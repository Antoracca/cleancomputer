/**
 * CATALOGUE VÉHICULES
 *
 * Constitué à partir des photographies réelles fournies : chaque véhicule
 * listé ici correspond à un véhicule effectivement photographié.
 *
 * ⚠️ PRIX ET ANNÉES PROVISOIRES — TODO_TARIFS.
 * Un prix de véhicule engage lourdement : il doit être remplacé par le prix
 * rendu à Bangui réel, droits de douane inclus, avant mise en ligne.
 *
 * Un véhicule ne passe PAS par le panier : le parcours est une demande de
 * réservation, pas un achat en un clic. C'est volontaire — personne n'achète
 * un 4×4 sans parler à quelqu'un.
 */

export type TypeVehicule = "suv" | "berline" | "moto";

export type Vehicule = {
  readonly slug: string;
  readonly nom: string;
  readonly marque: string;
  readonly type: TypeVehicule;
  readonly annee: string;
  readonly description: string;
  /** Prix rendu à Bangui, entier en XAF. */
  readonly prixXaf: number;
  readonly disponibilite: "en-stock" | "sur-commande" | "en-transit";
  readonly image: string;
  readonly galerie: readonly string[];
  readonly caracteristiques: readonly string[];
};

export const TARIFS_VEHICULES_PROVISOIRES = true;

export const VEHICULES: readonly Vehicule[] = [
  {
    slug: "toyota-land-cruiser-prado",
    nom: "Toyota Land Cruiser Prado",
    marque: "Toyota",
    type: "suv",
    annee: "2024",
    description:
      "Le 4×4 de référence pour les pistes centrafricaines. Robuste, réparable partout, valeur de revente stable.",
    prixXaf: 48000000,
    disponibilite: "en-transit",
    image: "/media/vehicules/landcruiser-prado-avant.jpg",
    galerie: [
      "/media/vehicules/landcruiser-prado-avant.jpg",
      "/media/vehicules/landcruiser-prado-arriere.jpg",
      "/media/vehicules/landcruiser-prado-profil.jpg",
      "/media/vehicules/landcruiser-interieur-volant.jpg",
      "/media/vehicules/landcruiser-interieur-sieges.jpg",
    ],
    caracteristiques: [
      "4 roues motrices",
      "Boîte automatique",
      "Écran tactile",
      "Dédouanement inclus",
    ],
  },
  {
    slug: "toyota-rav4-adventure",
    nom: "Toyota RAV4 Adventure",
    marque: "Toyota",
    type: "suv",
    annee: "2023",
    description:
      "Le compromis idéal : assez haut pour la ville comme pour la piste, sobre en carburant.",
    prixXaf: 26500000,
    disponibilite: "en-stock",
    image: "/media/vehicules/toyota-rav4-avant.jpg",
    galerie: [
      "/media/vehicules/toyota-rav4-avant.jpg",
      "/media/vehicules/toyota-rav4-arriere.jpg",
      "/media/vehicules/toyota-rav4-profil.jpg",
      "/media/vehicules/toyota-rav4-adventure.jpg",
      "/media/vehicules/toyota-rav4-tableau-bord.jpg",
      "/media/vehicules/toyota-interieur-banquette.jpg",
    ],
    caracteristiques: [
      "Transmission intégrale",
      "Caméra de recul",
      "Sellerie cuir",
      "Dédouanement inclus",
    ],
  },
  {
    slug: "mercedes-gla-250",
    nom: "Mercedes-Benz GLA 250",
    marque: "Mercedes-Benz",
    type: "suv",
    annee: "2022",
    description:
      "SUV compact premium. Finition allemande, consommation contenue, présence en ville.",
    prixXaf: 22000000,
    disponibilite: "en-stock",
    image: "/media/vehicules/mercedes-gla-avant.jpg",
    galerie: [
      "/media/vehicules/mercedes-gla-avant.jpg",
      "/media/vehicules/mercedes-gla-arriere.jpg",
      "/media/vehicules/mercedes-interieur-volant.jpg",
      "/media/vehicules/mercedes-interieur-sieges.jpg",
      "/media/vehicules/mercedes-interieur-portiere.jpg",
      "/media/vehicules/mercedes-interieur-banquette.jpg",
    ],
    caracteristiques: [
      "Boîte automatique",
      "Sellerie cuir",
      "Écran multimédia",
      "Dédouanement inclus",
    ],
  },
  {
    slug: "geely-suv",
    nom: "Geely SUV",
    marque: "Geely",
    type: "suv",
    annee: "2024",
    description:
      "Import direct de Chine. Équipement complet pour un budget très en dessous des marques japonaises.",
    prixXaf: 14500000,
    disponibilite: "sur-commande",
    image: "/media/vehicules/geely-suv-rouge.jpg",
    galerie: ["/media/vehicules/geely-suv-rouge.jpg"],
    caracteristiques: [
      "Import direct Chine",
      "Équipement complet",
      "Garantie constructeur",
      "Dédouanement inclus",
    ],
  },
] as const;

export const DISPONIBILITE_LABELS: Record<Vehicule["disponibilite"], string> = {
  "en-stock": "Disponible à Bangui",
  "en-transit": "En transit",
  "sur-commande": "Sur commande",
};

export function getVehicule(slug: string): Vehicule | undefined {
  return VEHICULES.find((v) => v.slug === slug);
}
