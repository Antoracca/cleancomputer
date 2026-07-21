"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  calculerTotaux,
  dateEcheance,
  nomClient,
  type Devis,
} from "@/features/devis/types";

/**
 * ACTIONS SERVEUR — DEVIS
 *
 * L'ENREGISTREMENT EXIGE UN COMPTE
 *
 * Un devis porte le nom, le téléphone et l'adresse d'une personne, et engage
 * l'entreprise sur des prix. Le rattacher à un compte est la seule façon de
 * savoir qui l'a émis et de le retrouver. Le client utilise ici sa PROPRE
 * session, jamais la clé d'administration : les politiques RLS font le
 * cloisonnement, on ne le réimplémente pas à la main.
 *
 * LE TOTAL EST RECALCULÉ AU SERVEUR
 *
 * Comme pour le panier et les transferts. Le corps JSON vient du navigateur,
 * mais le montant indexé pour la liste est recalculé ici à partir de ce corps.
 * Un total trafiqué dans le stockage local n'entre jamais en base.
 */

export type ResultatDevis =
  | { ok: true; reference: string }
  | { ok: false; erreur: string; connexionRequise?: boolean };

const MAX_LIGNES = 200;

export async function enregistrerDevis(
  devis: Devis,
  options: { rappelSouhaite?: boolean; envoiEmailDemande?: boolean } = {},
): Promise<ResultatDevis> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      erreur: "Connectez-vous pour enregistrer ce devis.",
      connexionRequise: true,
    };
  }

  /* ---------------------------------------------------------- validation */
  if (!devis.reference || !/^DV-\d{4}-[A-Z0-9]{4}$/.test(devis.reference)) {
    return { ok: false, erreur: "Référence de devis invalide." };
  }
  if (devis.lignes.length === 0) {
    return { ok: false, erreur: "Ajoutez au moins un article au devis." };
  }
  if (devis.lignes.length > MAX_LIGNES) {
    return { ok: false, erreur: "Ce devis comporte trop de lignes." };
  }
  if (!nomClient(devis.client).trim()) {
    return { ok: false, erreur: "Indiquez le nom du client." };
  }

  // Recalcul serveur : le total stocké ne vient jamais du navigateur.
  const totaux = calculerTotaux(devis);

  const { error } = await supabase.from("devis").upsert(
    {
      reference: devis.reference,
      profile_id: user.id,
      statut: "brouillon",
      corps: devis,
      client_nom: nomClient(devis.client),
      total_xaf: totaux.totalXaf,
      emis_le: devis.emisLe || null,
      valable_jusquau: devis.emisLe ? dateEcheance(devis) : null,
      rappel_souhaite: options.rappelSouhaite ?? false,
      envoi_email_demande: options.envoiEmailDemande ?? false,
    },
    { onConflict: "reference" },
  );

  if (error) {
    return {
      ok: false,
      erreur:
        "Le devis n'a pas pu être enregistré. Réessayez, ou appelez-nous si cela persiste.",
    };
  }

  revalidatePath("/compte");
  return { ok: true, reference: devis.reference };
}

export type DevisEnListe = {
  reference: string;
  statut: string;
  clientNom: string;
  totalXaf: number;
  emisLe: string | null;
  valableJusquau: string | null;
  modifieLe: string;
};

export async function listerMesDevis(): Promise<readonly DevisEnListe[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("devis")
    .select(
      "reference, statut, client_nom, total_xaf, emis_le, valable_jusquau, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((d) => ({
    reference: d.reference,
    statut: d.statut,
    clientNom: d.client_nom,
    totalXaf: d.total_xaf,
    emisLe: d.emis_le,
    valableJusquau: d.valable_jusquau,
    modifieLe: d.updated_at,
  }));
}

/** Recharge un devis pour reprendre la rédaction là où elle s'est arrêtée. */
export async function chargerDevis(reference: string): Promise<Devis | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("devis")
    .select("corps")
    .eq("reference", reference)
    .maybeSingle();

  if (error || !data) return null;
  return data.corps as Devis;
}

export async function supprimerDevis(
  reference: string,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("devis")
    .delete()
    .eq("reference", reference);

  if (error) return { ok: false };
  revalidatePath("/compte");
  return { ok: true };
}
