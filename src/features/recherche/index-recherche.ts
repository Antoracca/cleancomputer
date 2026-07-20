import { PRODUITS } from "@/lib/data/produits";
import { FAMILLES } from "@/lib/data/services";
import { CATEGORIES } from "@/types/catalogue";

/**
 * INDEX DE RECHERCHE
 *
 * Construit au chargement du module à partir des données existantes : produits,
 * prestations, catégories et pages clés. Une seule source de vérité — ajouter
 * un produit l'ajoute à la recherche sans rien faire d'autre.
 *
 * La recherche est LOCALE : sur un catalogue de cette taille, un index en
 * mémoire répond en microsecondes là où un aller-retour serveur coûterait
 * une seconde sur le réseau de Bangui. On basculera vers une recherche
 * Postgres quand le catalogue dépassera quelques centaines d'entrées.
 */

export type ResultatRecherche = {
  readonly type: "produit" | "service" | "page";
  readonly titre: string;
  readonly detail: string;
  readonly href: string;
  readonly image?: string;
  /** Texte normalisé sur lequel on cherche. */
  readonly cle: string;
};

/** Minuscules + suppression des accents : « écouteur » trouve « ecouteur ». */
export function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const PAGES: readonly Omit<ResultatRecherche, "cle">[] = [
  { type: "page", titre: "Obtenir un devis", detail: "Chiffrez votre projet en direct", href: "/devis" },
  { type: "page", titre: "Transfert d'argent", detail: "Envoyer depuis la Centrafrique", href: "/transfert-argent" },
  { type: "page", titre: "Fret Chine ↔ Bangui", detail: "Transit et dédouanement", href: "/transit-import" },
  { type: "page", titre: "Véhicules & motos", detail: "Import de marques chinoises", href: "/vehicules" },
  { type: "page", titre: "Suivre ma commande", detail: "Par référence et téléphone", href: "/suivi-commande" },
  { type: "page", titre: "Design & branding", detail: "Logo, charte, identité", href: "/design-branding" },
  { type: "page", titre: "Nous contacter", detail: "Une question, un projet", href: "/contact" },
  { type: "page", titre: "Questions fréquentes", detail: "Livraison, paiement, garantie", href: "/faq" },
];

export const INDEX: readonly ResultatRecherche[] = [
  ...PRODUITS.map((p) => ({
    type: "produit" as const,
    titre: p.nom,
    detail: `${p.marque} · ${CATEGORIES.find((c) => c.slug === p.categorie)?.nom ?? ""}`,
    href: `/electronique/p/${p.slug}`,
    image: p.image,
    cle: normaliser(`${p.nom} ${p.marque} ${p.categorie} ${p.description}`),
  })),
  ...FAMILLES.flatMap((f) =>
    f.prestations.map((prestation) => ({
      type: "service" as const,
      titre: prestation.nom,
      detail: f.nom,
      href: `/services-informatiques/${f.slug}`,
      cle: normaliser(`${prestation.nom} ${f.nom} ${prestation.description}`),
    })),
  ),
  ...CATEGORIES.map((c) => ({
    type: "page" as const,
    titre: c.nom,
    detail: "Catégorie de la boutique",
    href: `/electronique/${c.slug}`,
    cle: normaliser(`${c.nom} ${c.description}`),
  })),
  ...PAGES.map((p) => ({ ...p, cle: normaliser(`${p.titre} ${p.detail}`) })),
];

/**
 * Tous les mots de la requête doivent apparaître (ET logique) — « chargeur
 * ugreen » ne renvoie que les chargeurs UGREEN, pas tout UGREEN plus tous
 * les chargeurs.
 */
export function chercher(requete: string, limite = 8): ResultatRecherche[] {
  const mots = normaliser(requete).split(/\s+/).filter((m) => m.length >= 2);
  if (mots.length === 0) return [];

  return INDEX.filter((entree) => mots.every((mot) => entree.cle.includes(mot)))
    .sort((a, b) => {
      // Les produits d'abord — c'est ce qu'on vient chercher le plus souvent.
      const poids = { produit: 0, service: 1, page: 2 };
      return poids[a.type] - poids[b.type];
    })
    .slice(0, limite);
}
