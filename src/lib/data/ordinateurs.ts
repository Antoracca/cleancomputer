import type { Ordinateur } from "@/types/ordinateur";

/**
 * PARC ORDINATEURS
 *
 * Source de vérité : les six dossiers de `public/media/produits/`. Chaque
 * référence est un SKU HP réel, lu sur le nom du dossier.
 *
 * ⚠️ PRIX PROVISOIRES — TODO_TARIFS. Ordres de grandeur pour valider la mise
 * en page. À remplacer par la grille réelle avant mise en ligne.
 *
 * ⚠️ CARACTÉRISTIQUES : le champ `specsVerifiees` distingue ce qui a été
 * confirmé sur une source constructeur de ce qui reste à valider. Quand il est
 * à `false`, l'interface annonce une fiche en cours de vérification plutôt que
 * d'afficher des specs incertaines. Annoncer un processeur qui n'est pas celui
 * de la machine livrée est un litige commercial, pas un détail.
 *
 * ÉTAT : les six machines sont neuves, donc à 10 sur 10.
 */

const D = "/media/produits";

export const ORDINATEURS: readonly Ordinateur[] = [
  {
    slug: "hp-omen-max-16",
    sku: "16-ah0097nr",
    marque: "HP",
    modele: "OMEN MAX 16",
    gamme: "Gaming haut de gamme",
    accroche: "La machine qui ne bride rien",
    description:
      "Le sommet de la gamme gaming HP. Processeur 24 cœurs, RTX 5080 et dalle 240 Hz : de quoi jouer en qualité maximale et monter de la vidéo sans attendre les rendus.",
    etat: "neuf",
    sante: 10,
    prixXaf: 3450000,
    stock: 1,
    images: [
      `${D}/hp-omen-max-16-ah0097nr/01-hero.jpg`,
      `${D}/hp-omen-max-16-ah0097nr/02-avant-gauche.jpg`,
      `${D}/hp-omen-max-16-ah0097nr/03-avant-droit.jpg`,
      `${D}/hp-omen-max-16-ah0097nr/04-arriere.jpg`,
      `${D}/hp-omen-max-16-ah0097nr/05-profil-gauche.jpg`,
    ],
    pointsCles: [
      "NVIDIA GeForce RTX 5080",
      "Intel Core Ultra 9 275HX, 24 cœurs",
      "Écran 16 pouces WQXGA 240 Hz",
      "32 Go DDR5 et 1 To SSD",
    ],
    specifications: {
      Processeur: "Intel Core Ultra 9 275HX, jusqu'à 5,4 GHz, 24 cœurs",
      "Carte graphique": "NVIDIA GeForce RTX 5080",
      "Mémoire vive": "32 Go DDR5-5600",
      Stockage: "1 To SSD",
      Écran: "16 pouces WQXGA 2560 × 1600, IPS, 240 Hz, antireflet",
      "Système d'exploitation": "Windows 11 Famille",
      Coloris: "Shadow Black",
    },
    specsVerifiees: true,
  },
  {
    slug: "hp-15-fd0557nr",
    sku: "15-fd0557nr",
    marque: "HP",
    modele: "HP 15",
    gamme: "Bureautique",
    accroche: "Le portable qui fait tout, sans se ruiner",
    description:
      "Un Core i7 dans un châssis 15 pouces classique. Bureautique, navigation, cours en ligne et streaming : il encaisse la journée sans broncher.",
    etat: "neuf",
    sante: 10,
    prixXaf: 685000,
    stock: 4,
    images: [
      `${D}/hp-15-fd0557nr/01-hero.jpg`,
      `${D}/hp-15-fd0557nr/02-angle.jpg`,
      `${D}/hp-15-fd0557nr/03-face.jpg`,
      `${D}/hp-15-fd0557nr/04-clavier.jpg`,
      `${D}/hp-15-fd0557nr/05-profil.jpg`,
    ],
    pointsCles: [
      "Intel Core i7-1255U, 10 cœurs",
      "12 Go de mémoire vive",
      "512 Go SSD NVMe",
      "Écran 15,6 pouces Full HD",
    ],
    specifications: {
      Processeur: "Intel Core i7-1255U, 12ᵉ génération, 10 cœurs, jusqu'à 4,7 GHz",
      "Mémoire vive": "12 Go DDR4",
      Stockage: "512 Go SSD PCIe NVMe",
      Écran: "15,6 pouces Full HD 1920 × 1080",
      "Sans fil": "Wi-Fi 6 et Bluetooth 5.3",
      "Système d'exploitation": "Windows 11",
    },
    specsVerifiees: true,
  },
  {
    slug: "hp-elitebook-840-g7",
    sku: "1C8N4UT",
    marque: "HP",
    modele: "EliteBook 840 G7",
    gamme: "Professionnel",
    accroche: "Le portable de bureau qui tient des années",
    description:
      "Châssis aluminium, clavier confortable et sécurité d'entreprise. Le format 14 pouces reste le meilleur compromis entre écran utilisable et sac léger.",
    etat: "neuf",
    sante: 10,
    prixXaf: 895000,
    stock: 2,
    images: [
      `${D}/hp-elitebook-840-g7-1c8n4ut/01-vue.jpg`,
      `${D}/hp-elitebook-840-g7-1c8n4ut/02-vue.jpg`,
      `${D}/hp-elitebook-840-g7-1c8n4ut/03-vue.jpg`,
      `${D}/hp-elitebook-840-g7-1c8n4ut/04-detail-ecran.jpg`,
      `${D}/hp-elitebook-840-g7-1c8n4ut/05-detail-clavier.jpg`,
    ],
    pointsCles: [
      "Processeur Intel 10ᵉ génération",
      "Écran 14 pouces Full HD IPS",
      "Châssis aluminium",
      "Sécurité professionnelle HP",
    ],
    specifications: {
      Processeur: "Intel Core 10ᵉ génération",
      Écran: "14 pouces Full HD 1920 × 1080, IPS",
      Châssis: "Aluminium",
    },
    // La configuration exacte de ce SKU n'a pas pu être confirmée : le 840 G7
    // se décline en de nombreuses variantes de processeur, mémoire et stockage.
    specsVerifiees: false,
  },
  {
    slug: "hp-elitebook-850-g8",
    sku: "3C7Z6EA",
    marque: "HP",
    modele: "EliteBook 850 G8",
    gamme: "Professionnel",
    accroche: "Grand écran, exigences d'entreprise",
    description:
      "La version 15 pouces de la gamme EliteBook. Plus de surface pour travailler sur deux fenêtres, avec la même robustesse et la même sécurité.",
    etat: "neuf",
    sante: 10,
    prixXaf: 985000,
    stock: 2,
    images: [
      `${D}/hp-elitebook-850-g8-3c7z6ea/01-vue.jpg`,
      `${D}/hp-elitebook-850-g8-3c7z6ea/02-vue.jpg`,
      `${D}/hp-elitebook-850-g8-3c7z6ea/03-vue.jpg`,
      `${D}/hp-elitebook-850-g8-3c7z6ea/04-vue.jpg`,
      `${D}/hp-elitebook-850-g8-3c7z6ea/05-vue.jpg`,
    ],
    pointsCles: [
      "Écran 15,6 pouces",
      "Gamme professionnelle EliteBook",
      "Châssis aluminium",
    ],
    specifications: {
      Écran: "15,6 pouces",
      Gamme: "EliteBook, série professionnelle",
    },
    specsVerifiees: false,
  },
  {
    slug: "hp-victus-15",
    sku: "15-fa2047nr",
    marque: "HP",
    modele: "Victus 15",
    gamme: "Gaming accessible",
    accroche: "Jouer sérieusement, sans y laisser un salaire",
    description:
      "L'entrée de gamme gaming de HP. Assez de puissance pour les jeux du moment en bonne qualité, et un châssis qui reste discret au bureau.",
    etat: "neuf",
    sante: 10,
    prixXaf: 1150000,
    stock: 2,
    images: [
      `${D}/hp-victus-15-fa2047nr/01-hero.jpg`,
      `${D}/hp-victus-15-fa2047nr/02-avant-gauche.jpg`,
      `${D}/hp-victus-15-fa2047nr/03-avant-droit.jpg`,
      `${D}/hp-victus-15-fa2047nr/04-arriere-gauche.jpg`,
      `${D}/hp-victus-15-fa2047nr/05-detail-clavier.jpg`,
    ],
    pointsCles: [
      "Écran 15,6 pouces",
      "Carte graphique dédiée",
      "Refroidissement renforcé",
    ],
    specifications: {
      Écran: "15,6 pouces",
      Gamme: "Victus, série gaming",
    },
    specsVerifiees: false,
  },
  {
    slug: "hp-omnibook-5-16",
    sku: "16-bc1047nr",
    marque: "HP",
    modele: "OmniBook 5 16",
    gamme: "Bureautique grand écran",
    accroche: "Seize pouces pour travailler à l'aise",
    description:
      "Un grand écran dans un châssis fin. Confortable pour les tableurs, les longues sessions de rédaction et le travail à deux fenêtres.",
    etat: "neuf",
    sante: 10,
    prixXaf: 795000,
    stock: 3,
    images: [
      `${D}/hp-omnibook-5-16-bc1047nr/01-hero.webp`,
      `${D}/hp-omnibook-5-16-bc1047nr/02-ouvert.jpg`,
      `${D}/hp-omnibook-5-16-bc1047nr/03-ecran.jpg`,
      `${D}/hp-omnibook-5-16-bc1047nr/04-dimensions.png`,
      `${D}/hp-omnibook-5-16-bc1047nr/05-connectique.png`,
    ],
    pointsCles: [
      "Écran 16 pouces",
      "Châssis fin",
      "Gamme OmniBook",
    ],
    specifications: {
      Écran: "16 pouces",
      Gamme: "OmniBook 5",
    },
    specsVerifiees: false,
  },
] as const;

export function getOrdinateur(slug: string): Ordinateur | undefined {
  return ORDINATEURS.find((o) => o.slug === slug);
}

/** Sélection pour la page d'accueil : la plus haut de gamme et la plus accessible. */
export function getOrdinateursVitrine(): readonly Ordinateur[] {
  return [
    ORDINATEURS.find((o) => o.slug === "hp-omen-max-16"),
    ORDINATEURS.find((o) => o.slug === "hp-15-fd0557nr"),
  ].filter((o): o is Ordinateur => Boolean(o));
}
