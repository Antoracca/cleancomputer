"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { getAbonnement } from "@/lib/data/abonnements";

/**
 * ENREGISTREMENT D'UNE SOUSCRIPTION
 *
 * Même règle cardinale que les commandes et les transferts : LE CLIENT
 * N'ENVOIE AUCUN PRIX. Il transmet le slug de l'abonnement et le nom de la
 * formule ; le serveur retrouve le tarif dans le catalogue. Trafiquer la page
 * ne change que l'affichage, jamais le montant enregistré.
 *
 * Le prix est figé au moment de la commande, en centimes entiers. Si la
 * grille change la semaine suivante, la souscription garde le prix consenti.
 */

const MODES_PAIEMENT = ["orange_money", "especes_boutique"] as const;
type ModePaiement = (typeof MODES_PAIEMENT)[number];

export type EntreeSouscription = {
  abonnementSlug: string;
  formuleNom: string;
  compteIdentifiant: string;
  clientNom: string;
  clientTel: string;
  modePaiement: ModePaiement;
};

export type ResultatSouscription =
  | { ok: true; reference: string }
  | { ok: false; erreur: string };

export async function creerSouscription(
  input: EntreeSouscription,
): Promise<ResultatSouscription> {
  const abonnement = getAbonnement(input.abonnementSlug);
  if (!abonnement) {
    return { ok: false, erreur: "Cet abonnement n'existe pas." };
  }

  // Le prix vient du catalogue, jamais du formulaire.
  const formule = abonnement.formules.find((f) => f.nom === input.formuleNom);
  if (!formule) {
    return { ok: false, erreur: "Cette formule n'existe pas." };
  }

  if (!MODES_PAIEMENT.includes(input.modePaiement)) {
    return { ok: false, erreur: "Mode de paiement inconnu." };
  }

  const compte = input.compteIdentifiant.trim();
  const nom = input.clientNom.trim();
  const tel = input.clientTel.trim();

  if (compte.length < 3) {
    return {
      ok: false,
      erreur: "Indiquez le compte à activer (email ou identifiant).",
    };
  }
  if (nom.length < 2) return { ok: false, erreur: "Indiquez votre nom." };
  if (tel.replace(/\D/g, "").length < 8) {
    return { ok: false, erreur: "Numéro de téléphone incomplet." };
  }

  const reference = genererReference();

  const admin = await createAdminClient();
  const { error } = await admin.from("souscriptions").insert({
    reference,
    abonnement_slug: abonnement.slug,
    abonnement_nom: abonnement.nom,
    formule_nom: formule.nom,
    formule_duree: formule.duree,
    prix_cts: formule.prixXaf * 100,
    compte_identifiant: compte,
    client_nom: nom,
    client_tel: tel,
    mode_paiement: input.modePaiement,
  });

  if (error) {
    // Message honnête : la cause la plus probable pendant la mise en place est
    // que la table n'existe pas encore (supabase/abonnements.sql non exécuté).
    return {
      ok: false,
      erreur:
        "La commande n'a pas pu être enregistrée. Appelez-nous pour la valider par téléphone.",
    };
  }

  return { ok: true, reference };
}

function genererReference(): string {
  const alea = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AB-${Date.now().toString(36).toUpperCase()}${alea}`;
}
