/**
 * TYPES CATALOGUE
 *
 * Ces types reproduisent exactement le futur schéma Supabase (voir docs/PLAN.md
 * § 2). Le catalogue est alimenté aujourd'hui par un module statique ; le
 * passage en base ne changera que la SOURCE, pas les types ni les composants.
 */

export type CategorieSlug =
  | "telephones"
  | "ordinateurs"
  | "television"
  | "audio"
  | "charge"
  | "reseau"
  | "peripheriques"
  | "tablettes"
  | "photo"
  | "gaming"
  | "logiciels"
  | "composants"
  | "composants-electroniques"
  | "ecrans"
  | "stockage"
  | "cables"
  | "mobiles";

export type Categorie = {
  readonly slug: CategorieSlug;
  readonly nom: string;
  readonly description: string;
};

export type Produit = {
  readonly slug: string;
  readonly nom: string;
  readonly marque: string;
  readonly categorie: CategorieSlug;
  readonly description: string;
  /** Montant ENTIER en XAF. Jamais de flottant sur de l'argent. */
  readonly prixXaf: number;
  /** Prix barré, si promotion. */
  readonly prixBarreXaf?: number;
  readonly stock: number;
  readonly image: string;
  readonly misEnAvant: boolean;
  readonly caracteristiques: readonly string[];
};

export const CATEGORIES: readonly Categorie[] = [
  {
    slug: "telephones",
    nom: "Téléphones",
    description: "Smartphones haut de gamme, pliables et milieu de gamme.",
  },
  {
    slug: "ordinateurs",
    nom: "Ordinateurs",
    description: "Portables professionnels, MacBook et postes de travail.",
  },
  {
    slug: "television",
    nom: "Téléviseurs",
    description: "Écrans LED et UHD, du 43 au 55 pouces.",
  },
  {
    slug: "logiciels",
    nom: "Logiciels",
    description: "Licences Windows et Office authentiques, installées et activées.",
  },
  {
    slug: "photo",
    nom: "Photo & vidéo",
    description: "Caméras d'action, stabilisateurs et accessoires de tournage.",
  },
  {
    slug: "audio",
    nom: "Audio",
    description: "Casques, écouteurs et son sans fil.",
  },
  {
    slug: "charge",
    nom: "Charge & batteries",
    description: "Chargeurs rapides, batteries externes, alimentations.",
  },
  {
    slug: "reseau",
    nom: "Réseau & Wi-Fi",
    description: "Internet par satellite, répéteurs, couverture Wi-Fi.",
  },
  {
    slug: "peripheriques",
    nom: "Périphériques",
    description: "Claviers, souris et accessoires de poste de travail.",
  },
  {
    slug: "tablettes",
    nom: "Tablettes",
    description: "Tablettes Android pour le travail et les études.",
  },
  {
    slug: "gaming",
    nom: "Gaming",
    description: "Manettes et accessoires de jeu.",
  },
  {
    slug: "composants",
    nom: "Composants PC",
    description:
      "Mémoire, stockage interne, cartes graphiques et alimentations pour monter ou faire évoluer un poste.",
  },
  {
    slug: "composants-electroniques",
    nom: "Composants électroniques",
    description:
      "Pièces de rechange pour téléphone et ordinateur portable : écrans, batteries, connecteurs de charge, nappes, claviers et ventilateurs.",
  },
  {
    slug: "ecrans",
    nom: "Écrans & moniteurs",
    description: "Moniteurs bureautiques, création et jeu, du 22 au 34 pouces.",
  },
  {
    slug: "stockage",
    nom: "Stockage & disques",
    description: "Disques externes, SSD portables, cartes mémoire et clés USB.",
  },
  {
    slug: "cables",
    nom: "Câbles & adaptateurs",
    description: "HDMI, USB-C, réseau, hubs et adaptateurs de tous formats.",
  },
  {
    slug: "mobiles",
    nom: "Accessoires mobiles",
    description: "Coques, protections d'écran, supports et charge sans fil.",
  },
] as const;

export function getCategorie(slug: string): Categorie | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
