/**
 * CATALOGUE UNIFIÉ DU DEVIS
 *
 * Le point d'entrée unique : tout ce que l'entreprise vend, ramené à une
 * forme commune et cherchable.
 *
 * Chaque famille garde son module d'origine comme source de vérité. Ce
 * fichier ne recopie rien, il ADAPTE. Un prix corrigé dans `produits.ts` ou
 * `services.ts` se propage ici sans intervention, et il n'existe jamais deux
 * tarifs pour le même article.
 *
 * Ajouter une famille au devis = ajouter un adaptateur ici. Aucun composant
 * d'interface n'est à toucher.
 */

import { PRODUITS } from "@/lib/data/produits";
import { FAMILLES, UNITE_LABELS } from "@/lib/data/services";
import { ABONNEMENTS, DUREE_LABELS } from "@/lib/data/abonnements";
import { VEHICULES } from "@/lib/data/vehicules";
import { CATEGORIES } from "@/types/catalogue";
import type { LigneDevis, SourceLigne } from "@/features/devis/types";

/** Entrée cherchable. Ce n'est pas encore une ligne de devis : c'est ce qu'on
 *  propose, avant que l'utilisateur ne fixe une quantité. */
export type EntreeCatalogue = {
  readonly cle: string;
  readonly source: SourceLigne;
  readonly reference: string;
  readonly designation: string;
  readonly detail: string;
  readonly marque: string;
  readonly famille: string;
  readonly prixXaf: number;
  readonly image?: string;
  /** Mots supplémentaires pris en compte par la recherche. */
  readonly motsCles: readonly string[];
};

/* ══════════════════════════ ADAPTATEURS ══════════════════════════ */

function depuisProduits(): EntreeCatalogue[] {
  const nomCategorie = new Map(CATEGORIES.map((c) => [c.slug, c.nom]));

  return PRODUITS.map((p) => ({
    cle: `produit:${p.slug}`,
    source: "produit" as const,
    reference: p.slug,
    designation: p.nom,
    detail: p.description,
    marque: p.marque,
    famille: nomCategorie.get(p.categorie) ?? "Boutique",
    prixXaf: p.prixXaf,
    ...(p.image && { image: p.image }),
    motsCles: p.caracteristiques,
  }));
}

function depuisPrestations(): EntreeCatalogue[] {
  return FAMILLES.flatMap((f) =>
    f.prestations.map((p) => ({
      cle: `prestation:${f.slug}:${p.slug}`,
      source: "prestation" as const,
      reference: `${f.slug}/${p.slug}`,
      designation: p.nom,
      detail: p.description,
      marque: "Clean Computer",
      famille: f.nom,
      prixXaf: p.prixBaseXaf,
      // L'unité compte : « 25 000 par poste » et « 25 000 au forfait » ne
      // signifient pas la même chose une fois multipliés par la quantité.
      motsCles: [...p.inclus, UNITE_LABELS[p.unite], f.nom],
    })),
  );
}

function depuisAbonnements(): EntreeCatalogue[] {
  // Une entrée PAR FORMULE, pas par abonnement : Netflix Standard et Netflix
  // Premium sont deux articles différents à un prix différent. Proposer
  // « Netflix » tout court obligerait à rechoisir la formule ensuite.
  return ABONNEMENTS.flatMap((a) =>
    a.formules.map((f) => ({
      cle: `abonnement:${a.slug}:${f.nom}`,
      source: "abonnement" as const,
      reference: `${a.slug}/${f.nom}`,
      designation: `${a.nom} · ${f.nom}`,
      detail: `${f.inclus.join(", ")}. Activation ${a.delaiActivation.toLowerCase()}.`,
      marque: a.editeur,
      famille: `Abonnement ${DUREE_LABELS[f.duree]}`,
      prixXaf: f.prixXaf,
      ...(a.logo && { image: a.logo }),
      motsCles: [a.nom, f.nom, a.editeur, ...f.inclus],
    })),
  );
}

function depuisVehicules(): EntreeCatalogue[] {
  return VEHICULES.map((v) => ({
    cle: `vehicule:${v.slug}`,
    source: "vehicule" as const,
    reference: v.slug,
    designation: `${v.nom} ${v.annee}`,
    detail: v.description,
    marque: v.marque,
    famille: "Véhicules & motos",
    prixXaf: v.prixXaf,
    ...(v.image && { image: v.image }),
    motsCles: [...v.caracteristiques, v.annee, v.disponibilite],
  }));
}

/** Tout le catalogue, calculé une seule fois au chargement du module. */
export const CATALOGUE_DEVIS: readonly EntreeCatalogue[] = [
  ...depuisProduits(),
  ...depuisPrestations(),
  ...depuisAbonnements(),
  ...depuisVehicules(),
];

/** Familles présentes, pour le filtrage par onglet. */
export const FAMILLES_DEVIS: readonly string[] = [
  ...new Set(CATALOGUE_DEVIS.map((e) => e.famille)),
].sort((a, b) => a.localeCompare(b, "fr"));

/* ══════════════════════════ RECHERCHE ══════════════════════════ */

/**
 * Normalise pour la comparaison : minuscules, accents retirés.
 * Sans ça, « ecran » ne trouverait pas « Écran » et « telephone » ne
 * trouverait pas « Téléphone », ce qui est exactement ce que les gens tapent.
 */
function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    // Bloc des diacritiques combinants U+0300 à U+036F. La classe contient
    // des caractères combinants littéraux, donc invisibles à la lecture : le
    // formateur du projet les réécrit ainsi et refuse la forme échappée.
    // Si cette ligne paraît vide entre les crochets, elle ne l'est pas.
    .replace(/[̀-ͯ]/g, "");
}

/** Index pré-calculé : la recherche ne renormalise pas 150 entrées par frappe. */
const INDEX: readonly { entree: EntreeCatalogue; titre: string; tout: string }[] =
  CATALOGUE_DEVIS.map((entree) => ({
    entree,
    titre: normaliser(`${entree.designation} ${entree.marque}`),
    tout: normaliser(
      [
        entree.designation,
        entree.marque,
        entree.famille,
        entree.detail,
        ...entree.motsCles,
      ].join(" "),
    ),
  }));

/**
 * Recherche multi-mots. Tous les mots doivent apparaître, dans n'importe quel
 * ordre : « hp 16 » trouve « HP OMEN MAX 16 ». Une correspondance dans le
 * titre pèse plus qu'une correspondance dans la description, sinon un produit
 * dont le nom est exact se retrouve derrière dix produits qui le citent.
 */
export function chercherCatalogue(
  requete: string,
  famille?: string,
  limite = 40,
): readonly EntreeCatalogue[] {
  const base = famille
    ? INDEX.filter((i) => i.entree.famille === famille)
    : INDEX;

  const mots = normaliser(requete).split(/\s+/).filter(Boolean);
  if (mots.length === 0) return base.slice(0, limite).map((i) => i.entree);

  const resultats: { entree: EntreeCatalogue; score: number }[] = [];

  for (const item of base) {
    if (!mots.every((m) => item.tout.includes(m))) continue;

    let score = 0;
    for (const mot of mots) {
      if (item.titre.startsWith(mot)) score += 6;
      else if (item.titre.includes(mot)) score += 3;
      else score += 1;
    }
    resultats.push({ entree: item.entree, score });
  }

  return resultats
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.entree.designation.localeCompare(b.entree.designation, "fr"),
    )
    .slice(0, limite)
    .map((r) => r.entree);
}

/* ══════════════════════════ CONVERSION ══════════════════════════ */

let compteur = 0;

/**
 * Identifiant de ligne. Un compteur, pas un aléatoire : `Math.random` et
 * `Date.now` divergeraient entre le rendu serveur et le rendu client et
 * casseraient l'hydratation.
 */
function idLigne(prefixe: string): string {
  compteur += 1;
  return `${prefixe}-${compteur}`;
}

export function versLigne(
  entree: EntreeCatalogue,
  quantite = 1,
): LigneDevis {
  return {
    id: idLigne(entree.source),
    source: entree.source,
    reference: entree.reference,
    designation: entree.designation,
    detail: entree.detail,
    marque: entree.marque,
    famille: entree.famille,
    ...(entree.image && { image: entree.image }),
    quantite,
    prixUnitaireXaf: entree.prixXaf,
    options: [],
    remisePct: 0,
  };
}

/**
 * Article absent du catalogue. Indispensable : un devis réel comporte
 * toujours une ligne que la boutique ne référence pas encore. Sans cette
 * porte de sortie, le commercial abandonne l'outil et reprend son carnet.
 */
export function ligneLibre(
  designation: string,
  prixUnitaireXaf: number,
  quantite = 1,
  detail = "",
  marque = "",
): LigneDevis {
  return {
    id: idLigne("libre"),
    source: "libre",
    reference: "",
    designation: designation.trim(),
    detail: detail.trim(),
    marque: marque.trim(),
    // Un article libre n'appartient à aucune famille du catalogue, il n'a donc
    // aucune option prédéfinie. C'est cohérent : on ne sait pas ce que c'est.
    famille: "",
    quantite,
    prixUnitaireXaf: Math.max(0, Math.round(prixUnitaireXaf)),
    options: [],
    remisePct: 0,
  };
}
