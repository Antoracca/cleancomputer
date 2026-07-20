import type { Produit } from "@/types/catalogue";

/**
 * CATALOGUE PRODUITS
 *
 * Les noms, marques et caractéristiques sont FACTUELS : ils proviennent de
 * l'identification des photos réelles du dossier media/.
 *
 * ⚠️ LES PRIX SONT PROVISOIRES — TODO_TARIFS.
 * Ce sont des ordres de grandeur destinés à valider la mise en page, le
 * formatage XAF et les filtres. Ils doivent être remplacés par la grille
 * tarifaire réelle avant toute mise en ligne : afficher un prix faux sur un
 * site marchand engage le vendeur.
 *
 * Le stock est également provisoire.
 *
 * Cette source statique sera remplacée par Supabase en Phase 4 sans toucher
 * aux composants — seuls les accesseurs ci-dessous changeront.
 */

export const TARIFS_PROVISOIRES = true;

export const PRODUITS: readonly Produit[] = [
  // ----------------------------------------------------------- TÉLÉPHONES
  {
    slug: "galaxy-s25-ultra",
    nom: "Samsung Galaxy S25 Ultra",
    marque: "Samsung",
    categorie: "telephones",
    description:
      "Le haut de gamme Samsung : écran 6,9 pouces, quadruple capteur photo, S Pen intégré.",
    prixXaf: 985000,
    stock: 4,
    image: "/media/produits/telephone-galaxy-s25-ultra.jpg",
    misEnAvant: true,
    caracteristiques: ["Écran 6,9 pouces", "S Pen intégré", "Garantie 24 mois"],
  },
  {
    slug: "galaxy-z-fold",
    nom: "Samsung Galaxy Z Fold",
    marque: "Samsung",
    categorie: "telephones",
    description:
      "Smartphone pliable : un téléphone dans la poche, une tablette une fois ouvert.",
    prixXaf: 1450000,
    stock: 2,
    image: "/media/produits/telephone-galaxy-z-fold.jpg",
    misEnAvant: true,
    caracteristiques: ["Écran pliable", "Multitâche", "Charge rapide"],
  },
  {
    slug: "google-pixel",
    nom: "Google Pixel",
    marque: "Google",
    categorie: "telephones",
    description:
      "La référence photo sous Android, avec les mises à jour les plus longues du marché.",
    prixXaf: 620000,
    stock: 3,
    image: "/media/produits/telephone-google-pixel.jpg",
    misEnAvant: false,
    caracteristiques: ["Photo computationnelle", "Android pur", "7 ans de mises à jour"],
  },

  // ------------------------------------------------------------ LOGICIELS
  {
    slug: "windows-11-pro-licence",
    nom: "Licence Windows 11 Pro",
    marque: "Microsoft",
    categorie: "logiciels",
    description:
      "Licence authentique Windows 11 Pro. Installation et activation faites en boutique, sur votre machine.",
    prixXaf: 65000,
    stock: 12,
    image: "/media/produits/logiciel-windows-11.jpg",
    misEnAvant: true,
    caracteristiques: [
      "Licence authentique",
      "Installation incluse",
      "Activation vérifiée devant vous",
    ],
  },
  {
    slug: "windows-10-pro-licence",
    nom: "Licence Windows 10 Pro",
    marque: "Microsoft",
    categorie: "logiciels",
    description:
      "Pour les machines plus anciennes qui ne passent pas sous Windows 11. Licence authentique, installation comprise.",
    prixXaf: 48000,
    stock: 8,
    image: "/media/produits/logiciel-windows-10.jpg",
    misEnAvant: false,
    caracteristiques: [
      "Licence authentique",
      "Adaptée aux machines anciennes",
      "Installation incluse",
    ],
  },
  {
    slug: "office-2021-famille-entreprise",
    nom: "Office 2021 Famille et Petite Entreprise",
    marque: "Microsoft",
    categorie: "logiciels",
    description:
      "Word, Excel, PowerPoint et Outlook. Licence à vie pour un PC ou un Mac, sans abonnement à renouveler.",
    prixXaf: 95000,
    stock: 6,
    image: "/media/produits/logiciel-office-2021.jpg",
    misEnAvant: true,
    caracteristiques: [
      "Licence à vie, sans abonnement",
      "1 PC ou 1 Mac",
      "Word, Excel, PowerPoint, Outlook",
    ],
  },

  // ---------------------------------------------------------- ORDINATEURS
  {
    slug: "macbook-pro",
    nom: "MacBook Pro",
    marque: "Apple",
    categorie: "ordinateurs",
    description:
      "Portable Apple silicium : autonomie longue, écran Liquid Retina, silence total.",
    prixXaf: 1850000,
    stock: 2,
    image: "/media/produits/ordinateur-macbook-pro.jpg",
    misEnAvant: true,
    caracteristiques: ["Puce Apple silicium", "Écran Liquid Retina", "Autonomie longue"],
  },
  {
    slug: "hp-portable-pro",
    nom: "HP Portable Pro",
    marque: "HP",
    categorie: "ordinateurs",
    description:
      "Portable professionnel Intel, livré avec Windows 11 Pro installé et activé.",
    prixXaf: 685000,
    stock: 5,
    image: "/media/produits/ordinateur-hp-argent.jpg",
    misEnAvant: false,
    caracteristiques: ["Processeur Intel", "Windows 11 Pro inclus", "Clavier rétroéclairé"],
  },
  {
    slug: "hp-portable-tactile",
    nom: "HP Portable tactile",
    marque: "HP",
    categorie: "ordinateurs",
    description:
      "Écran tactile, châssis fin. Configuré, mis à jour et prêt à l'emploi à la livraison.",
    prixXaf: 795000,
    stock: 3,
    image: "/media/produits/ordinateur-hp-bleu.jpg",
    misEnAvant: false,
    caracteristiques: ["Écran tactile", "Windows 11 Pro", "Configuration incluse"],
  },

  // ---------------------------------------------------------- TÉLÉVISEURS
  {
    slug: "tv-lg-uhd-43",
    nom: "TV LG UHD 43 pouces",
    marque: "LG",
    categorie: "television",
    description:
      "Téléviseur connecté 4K webOS 43 pouces. Netflix, YouTube et Disney+ intégrés.",
    prixXaf: 425000,
    stock: 4,
    image: "/media/produits/tv-lg-uhd-43-allumee.jpg",
    misEnAvant: true,
    caracteristiques: ["4K UHD", "webOS", "43 pouces"],
  },
  {
    slug: "tv-samsung-crystal-55",
    nom: "TV Samsung Crystal UHD 55 pouces",
    marque: "Samsung",
    categorie: "television",
    description:
      "Grand écran 55 pouces Crystal UHD, Samsung TV Plus et applications intégrées.",
    prixXaf: 685000,
    stock: 2,
    image: "/media/produits/tv-samsung-crystal-55.jpg",
    misEnAvant: false,
    caracteristiques: ["Crystal UHD", "55 pouces", "Samsung TV Plus"],
  },

  // ------------------------------------------------------------ PHOTO/VIDÉO
  {
    slug: "insta360-ace-pro",
    nom: "Insta360 Ace Pro",
    marque: "Insta360",
    categorie: "photo",
    description:
      "Caméra d'action étanche, écran rabattable, stabilisation avancée.",
    prixXaf: 385000,
    stock: 3,
    image: "/media/produits/photo-insta360-ace-pro.jpg",
    misEnAvant: false,
    caracteristiques: ["Étanche", "Écran rabattable", "Stabilisation"],
  },
  {
    slug: "dji-osmo-mobile-7",
    nom: "DJI Osmo Mobile 7",
    marque: "DJI",
    categorie: "photo",
    description:
      "Stabilisateur pour smartphone : suivi du sujet, pliable, prêt en deux secondes.",
    prixXaf: 145000,
    stock: 6,
    image: "/media/produits/photo-dji-osmo-mobile-7.jpg",
    misEnAvant: false,
    caracteristiques: ["Suivi de sujet", "Pliable", "Perche intégrée"],
  },

  // ---------------------------------------------------------------- AUDIO
  {
    slug: "soundcore-space-one",
    nom: "Soundcore Space One",
    marque: "Soundcore",
    categorie: "audio",
    description:
      "Casque circum-auriculaire à réduction de bruit active. Autonomie longue durée, confort sur la durée.",
    prixXaf: 68000,
    stock: 6,
    image: "/media/produits/audio-casque-soundcore-space-one.jpg",
    misEnAvant: true,
    caracteristiques: ["Réduction de bruit active", "Bluetooth", "Pliable"],
  },
  {
    slug: "soundcore-p30i",
    nom: "Soundcore P30i",
    marque: "Soundcore",
    categorie: "audio",
    description:
      "Écouteurs sans fil à réduction de bruit, boîtier de charge faisant support téléphone.",
    prixXaf: 32000,
    stock: 12,
    image: "/media/produits/audio-ecouteurs-soundcore-p30i.jpg",
    misEnAvant: false,
    caracteristiques: ["Réduction de bruit", "6 micros", "Boîtier support"],
  },
  {
    slug: "airpods-pro-2",
    nom: "AirPods Pro 2",
    marque: "Apple",
    categorie: "audio",
    description:
      "Écouteurs intra-auriculaires à réduction de bruit active et mode transparence.",
    prixXaf: 185000,
    stock: 4,
    image: "/media/produits/audio-ecouteurs-airpods-pro-2.jpg",
    misEnAvant: true,
    caracteristiques: ["Réduction de bruit", "Mode transparence", "USB-C"],
  },

  // --------------------------------------------------------------- CHARGE
  {
    slug: "ugreen-65w-gan",
    nom: "UGREEN Nexode 65W GaN",
    marque: "UGREEN",
    categorie: "charge",
    description:
      "Chargeur 3 ports en nitrure de gallium. Charge un ordinateur portable et deux appareils simultanément.",
    prixXaf: 28000,
    stock: 15,
    image: "/media/produits/charge-ugreen-65w-gan.jpg",
    misEnAvant: false,
    caracteristiques: ["65W", "3 ports", "Technologie GaN"],
  },
  {
    slug: "ugreen-100w-5ports",
    nom: "UGREEN Nexode 100W · 5 ports",
    marque: "UGREEN",
    categorie: "charge",
    description:
      "Station de charge 100W avec écran de puissance. Cinq appareils en simultané.",
    prixXaf: 45000,
    stock: 8,
    image: "/media/produits/charge-ugreen-100w-5ports.jpg",
    misEnAvant: true,
    caracteristiques: ["100W", "5 ports", "Écran de puissance"],
  },
  {
    slug: "ugreen-powerbank-20000",
    nom: "UGREEN Powerbank 20000 mAh",
    marque: "UGREEN",
    categorie: "charge",
    description:
      "Batterie externe 20000 mAh, charge rapide 45W. Autorisée en cabine.",
    prixXaf: 38000,
    stock: 10,
    image: "/media/produits/charge-ugreen-powerbank-20000mah.jpg",
    misEnAvant: false,
    caracteristiques: ["20000 mAh", "45W", "Écran de charge"],
  },
  {
    slug: "anker-gan-multiport",
    nom: "Anker GaN multiport",
    marque: "Anker",
    categorie: "charge",
    description:
      "Chargeur compact trois ports, deux USB-C et un USB-A. Format voyage.",
    prixXaf: 26000,
    stock: 9,
    image: "/media/produits/charge-anker-gan-multiport.jpg",
    misEnAvant: false,
    caracteristiques: ["2× USB-C", "1× USB-A", "Compact"],
  },
  {
    slug: "alimentation-starlink-gen3",
    nom: "Alimentation Starlink Gen 3 & Mini",
    marque: "Starlink",
    categorie: "charge",
    description:
      "Bloc d'alimentation de remplacement pour antenne Starlink Gen 3 et Mini.",
    prixXaf: 55000,
    stock: 5,
    image: "/media/produits/charge-alimentation-starlink-packshot.jpg",
    misEnAvant: false,
    caracteristiques: ["30V / 2A", "60W", "Compatible Gen 3 et Mini"],
  },

  // --------------------------------------------------------------- RÉSEAU
  {
    slug: "starlink-kit-gen3",
    nom: "Kit Starlink Gen 3",
    marque: "Starlink",
    categorie: "reseau",
    description:
      "Internet par satellite haut débit. Antenne, routeur Wi-Fi 6, support et alimentation inclus.",
    prixXaf: 425000,
    stock: 3,
    image: "/media/produits/reseau-starlink-kit-deballe.jpg",
    misEnAvant: true,
    caracteristiques: ["Wi-Fi 6 intégré", "Installation incluse", "Kit complet"],
  },
  {
    slug: "wavlink-ax3000-outdoor",
    nom: "Wavlink AX3000 Wi-Fi 6 extérieur",
    marque: "Wavlink",
    categorie: "reseau",
    description:
      "Point d'accès Wi-Fi 6 extérieur, résistant aux intempéries. Couvre une cour ou une terrasse.",
    prixXaf: 135000,
    stock: 6,
    image: "/media/produits/reseau-wavlink-ax3000.jpg",
    misEnAvant: false,
    caracteristiques: ["Wi-Fi 6 AX3000", "Usage extérieur", "Alimentation PoE"],
  },
  {
    slug: "tenda-a23-wifi6",
    nom: "Tenda A23 Wi-Fi 6",
    marque: "Tenda",
    categorie: "reseau",
    description:
      "Répéteur Wi-Fi 6 bibande. Étend la couverture dans les zones mortes.",
    prixXaf: 22000,
    stock: 14,
    image: "/media/produits/reseau-tenda-wifi6-a23.jpg",
    misEnAvant: false,
    caracteristiques: ["Wi-Fi 6", "Bibande", "Installation simple"],
  },

  // -------------------------------------------------------- PÉRIPHÉRIQUES
  {
    slug: "logitech-mx-keys-mini",
    nom: "Logitech MX Keys Mini",
    marque: "Logitech",
    categorie: "peripheriques",
    description:
      "Clavier compact rétroéclairé. Trois appareils appairés, bascule instantanée.",
    prixXaf: 78000,
    stock: 7,
    image: "/media/produits/peripherique-logitech-mx-keys-mini.jpg",
    misEnAvant: false,
    caracteristiques: ["Rétroéclairé", "3 appareils", "USB-C"],
  },
  {
    slug: "logitech-mx-master-3s",
    nom: "Logitech MX Master 3S",
    marque: "Logitech",
    categorie: "peripheriques",
    description:
      "Souris de précision 8000 DPI, clics silencieux, molette MagSpeed.",
    prixXaf: 82000,
    stock: 6,
    image: "/media/produits/peripherique-logitech-mx-master-3s.jpg",
    misEnAvant: true,
    caracteristiques: ["8000 DPI", "Clics silencieux", "Bluetooth"],
  },

  // ------------------------------------------------------------ TABLETTES
  {
    slug: "ipad-pro",
    nom: "iPad Pro",
    marque: "Apple",
    categorie: "tablettes",
    description:
      "Tablette professionnelle Apple : écran large, compatible Apple Pencil et clavier.",
    prixXaf: 1250000,
    stock: 2,
    image: "/media/produits/tablette-ipad-pro.jpg",
    misEnAvant: true,
    caracteristiques: ["Compatible Apple Pencil", "Écran large", "USB-C"],
  },
  {
    slug: "nextbook-ares-8a",
    nom: "Nextbook Ares 8A",
    marque: "Nextbook",
    categorie: "tablettes",
    description:
      "Tablette Android 8 pouces quad-core. Usage bureautique et scolaire.",
    prixXaf: 65000,
    stock: 5,
    image: "/media/produits/tablette-nextbook-ares-8a.jpg",
    misEnAvant: false,
    caracteristiques: ["8 pouces", "Quad-core", "HDMI"],
  },

  // --------------------------------------------------------------- GAMING
  {
    slug: "playstation-portal",
    nom: "PlayStation Portal",
    marque: "Sony",
    categorie: "gaming",
    description:
      "Console portable de lecture à distance pour PS5. Écran 8 pouces, manette DualSense intégrée.",
    prixXaf: 295000,
    stock: 2,
    image: "/media/produits/gaming-playstation-portal.jpg",
    misEnAvant: false,
    caracteristiques: ["Écran 8 pouces", "Lecture à distance PS5", "Retour haptique"],
  },
  {
    slug: "sony-dualsense",
    nom: "Manette Sony DualSense",
    marque: "Sony",
    categorie: "gaming",
    description:
      "Manette sans fil PS5 à retour haptique et gâchettes adaptatives.",
    prixXaf: 58000,
    stock: 4,
    image: "/media/produits/gaming-manette-sony-dualsense.jpg",
    misEnAvant: false,
    caracteristiques: ["Retour haptique", "Gâchettes adaptatives", "Sans fil"],
  },
  {
    slug: "gamesir-nova",
    nom: "Manette GameSir Nova",
    marque: "GameSir",
    categorie: "gaming",
    description:
      "Manette multiplateforme avec dongle USB. Compatible PC, Android et consoles portables.",
    prixXaf: 34000,
    stock: 8,
    image: "/media/produits/gaming-manette-gamesir-console.jpg",
    misEnAvant: false,
    caracteristiques: ["Multiplateforme", "Dongle USB", "Hall effect"],
  },
] as const;

/* ------------------------------------------------------------------ ACCÈS
   Ces fonctions deviendront des requêtes Supabase en Phase 4. Leur signature
   ne changera pas, donc aucun composant ne sera à réécrire. */

export function getProduits(categorie?: string): readonly Produit[] {
  if (!categorie) return PRODUITS;
  return PRODUITS.filter((p) => p.categorie === categorie);
}

export function getProduit(slug: string): Produit | undefined {
  return PRODUITS.find((p) => p.slug === slug);
}

export function getProduitsMisEnAvant(): readonly Produit[] {
  return PRODUITS.filter((p) => p.misEnAvant);
}
