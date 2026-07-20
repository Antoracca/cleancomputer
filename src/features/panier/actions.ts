"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { validatePhone, validateRequired } from "@/features/auth/validation";

/**
 * ACTIONS SERVEUR — COMMANDE
 *
 * Règle cardinale : LE CLIENT N'ENVOIE JAMAIS UN PRIX. Il envoie des slugs et
 * des quantités ; le serveur relit les prix EN BASE et recalcule tout. Un
 * panier trafiqué dans le localStorage ne change donc que l'affichage local,
 * jamais le montant réellement facturé.
 *
 * Le client d'administration (qui contourne le RLS) est utilisé ici car la
 * commande d'un invité — sans compte — doit pouvoir s'écrire en base. En
 * contrepartie, TOUTES les entrées sont validées avant la moindre écriture.
 */

const LIVRAISON_BANGUI_XAF = 2000;

export type ArticleCommande = { slug: string; quantite: number };

export type ResultatCommande =
  | { ok: true; reference: string }
  | { ok: false; erreur: string };

export async function creerCommande(input: {
  articles: ArticleCommande[];
  nom: string;
  telephone: string;
  mode: "retrait" | "livraison";
  adresse?: string;
}): Promise<ResultatCommande> {
  /* ---------------------------------------------------------- validation */
  if (!Array.isArray(input.articles) || input.articles.length === 0) {
    return { ok: false, erreur: "Le panier est vide." };
  }
  if (input.articles.length > 30) {
    return { ok: false, erreur: "Trop d'articles distincts dans une commande." };
  }

  const nomErr = validateRequired(input.nom ?? "", "Votre nom");
  if (nomErr) return { ok: false, erreur: nomErr };

  const telErr = validatePhone(input.telephone ?? "");
  if (telErr) return { ok: false, erreur: telErr };

  if (input.mode === "livraison") {
    const adrErr = validateRequired(input.adresse ?? "", "L'adresse de livraison");
    if (adrErr) return { ok: false, erreur: adrErr };
  }

  const quantites = new Map<string, number>();
  for (const article of input.articles) {
    const quantite = Math.floor(Number(article.quantite));
    if (!Number.isFinite(quantite) || quantite < 1 || quantite > 99) {
      return { ok: false, erreur: "Quantité invalide." };
    }
    if (typeof article.slug !== "string" || article.slug.length > 100) {
      return { ok: false, erreur: "Article invalide." };
    }
    quantites.set(article.slug, (quantites.get(article.slug) ?? 0) + quantite);
  }

  /* ------------------------------------------- relecture des prix en base */
  const admin = await createAdminClient();
  const { data: produits, error: errProduits } = await admin
    .from("produits")
    .select("slug, nom, prix_xaf, stock, actif")
    .in("slug", [...quantites.keys()]);

  if (errProduits || !produits) {
    return { ok: false, erreur: "Impossible de vérifier les articles. Réessayez." };
  }

  const lignes: {
    produit_slug: string;
    libelle_fige: string;
    prix_unitaire_xaf: number;
    quantite: number;
  }[] = [];

  for (const [slug, quantite] of quantites) {
    const produit = produits.find((p) => p.slug === slug);
    if (!produit || !produit.actif) {
      return { ok: false, erreur: "Un article du panier n'est plus disponible." };
    }
    if (produit.stock < quantite) {
      return {
        ok: false,
        erreur: `Stock insuffisant pour « ${produit.nom} » (${produit.stock} restant${produit.stock > 1 ? "s" : ""}).`,
      };
    }
    lignes.push({
      produit_slug: slug,
      libelle_fige: produit.nom,
      prix_unitaire_xaf: produit.prix_xaf,
      quantite,
    });
  }

  const sousTotal = lignes.reduce(
    (somme, l) => somme + l.prix_unitaire_xaf * l.quantite,
    0,
  );
  const livraison = input.mode === "livraison" ? LIVRAISON_BANGUI_XAF : 0;

  /* -------------------------------------------------------------- écriture */
  // Si un utilisateur est connecté, la commande lui est rattachée.
  const session = await createClient();
  const {
    data: { user },
  } = await session.auth.getUser();

  const reference = genererReference();

  const { data: commande, error: errCommande } = await admin
    .from("commandes")
    .insert({
      reference,
      profile_id: user?.id ?? null,
      statut: "en_attente",
      sous_total_xaf: sousTotal,
      livraison_xaf: livraison,
      total_xaf: sousTotal + livraison,
      mode_paiement: "a_la_livraison",
      telephone: input.telephone.trim(),
      adresse:
        input.mode === "livraison" ? (input.adresse ?? "").trim() : "Retrait en boutique",
    })
    .select("id")
    .single();

  if (errCommande || !commande) {
    return { ok: false, erreur: "La commande n'a pas pu être enregistrée. Réessayez." };
  }

  const { error: errLignes } = await admin.from("commande_lignes").insert(
    lignes.map((l) => ({ ...l, commande_id: commande.id })),
  );

  if (errLignes) {
    // Une commande sans lignes est inutilisable : on la retire plutôt que de
    // laisser une coquille vide dans le back-office.
    await admin.from("commandes").delete().eq("id", commande.id);
    return { ok: false, erreur: "La commande n'a pas pu être enregistrée. Réessayez." };
  }

  return { ok: true, reference };
}

/**
 * SUIVI SANS COMPTE
 *
 * La référence seule ne suffit pas : il faut AUSSI le téléphone de la
 * commande. Une référence peut fuiter (capture d'écran, conversation) ; le
 * couple référence + téléphone limite ce qu'un tiers peut consulter.
 */
export type ResultatSuivi =
  | {
      ok: true;
      statut: string;
      totalXaf: number;
      creeLe: string;
      lignes: { libelle: string; quantite: number }[];
    }
  | { ok: false; erreur: string };

export async function suivreCommande(input: {
  reference: string;
  telephone: string;
}): Promise<ResultatSuivi> {
  const reference = (input.reference ?? "").trim().toUpperCase();
  if (!/^CC-[A-Z0-9]{6,12}$/.test(reference)) {
    return { ok: false, erreur: "Cette référence ne ressemble pas à une référence Clean Computer (format CC-XXXXXX)." };
  }

  const telErr = validatePhone(input.telephone ?? "");
  if (telErr) return { ok: false, erreur: telErr };

  const admin = await createAdminClient();
  const { data: commande } = await admin
    .from("commandes")
    .select("id, statut, total_xaf, telephone, created_at")
    .eq("reference", reference)
    .maybeSingle();

  // Réponse identique que la référence soit inconnue ou que le téléphone ne
  // corresponde pas : on ne confirme jamais l'existence d'une commande à
  // quelqu'un qui n'en connaît pas les deux clés.
  const normaliser = (t: string) => t.replace(/[\s.\-()]/g, "").replace(/^\+?236/, "");
  if (
    !commande ||
    normaliser(commande.telephone ?? "") !== normaliser(input.telephone)
  ) {
    return {
      ok: false,
      erreur: "Aucune commande trouvée avec cette référence et ce numéro.",
    };
  }

  const { data: lignes } = await admin
    .from("commande_lignes")
    .select("libelle_fige, quantite")
    .eq("commande_id", commande.id);

  return {
    ok: true,
    statut: commande.statut,
    totalXaf: commande.total_xaf,
    creeLe: commande.created_at,
    lignes: (lignes ?? []).map((l) => ({
      libelle: l.libelle_fige,
      quantite: l.quantite,
    })),
  };
}

function genererReference(): string {
  // Horodatage base 36 + 3 caractères aléatoires : lisible au téléphone,
  // assez entropique pour ne pas être devinable en pratique.
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let alea = "";
  for (let i = 0; i < 3; i++) {
    alea += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CC-${Date.now().toString(36).toUpperCase()}${alea}`;
}
