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

  /* ==================================================================
     ⚠️ PRIX PROVISOIRES — TODO_TARIFS
     Les cinq sections ci-dessous (composants, écrans, stockage, câbles,
     accessoires mobiles) portent des prix inventés, cohérents entre eux
     et calés sur un ordre de grandeur import + marge pour Bangui. Les
     noms, marques et caractéristiques techniques sont réels et vérifiés
     modèle par modèle ; seuls les montants et les stocks sont à
     remplacer par la grille tarifaire du client avant mise en ligne.
     ================================================================== */

  // -------------------------------------------------------- COMPOSANTS PC
  {
    slug: "kingston-fury-beast-ddr4-16go",
    nom: "Kingston Fury Beast DDR4 16 Go 3200 MHz",
    marque: "Kingston",
    categorie: "composants",
    description:
      "Barrette DDR4 de 16 Go pour poste fixe. Le bon compromis pour faire respirer une machine qui rame sous plusieurs onglets et une suite bureautique.",
    prixXaf: 65000,
    stock: 14,
    image: "/media/produits/composant-ram-ddr4-kingston.jpg",
    misEnAvant: true,
    caracteristiques: ["DDR4 3200 MHz", "16 Go, latence CL16", "Profil XMP 2.0"],
  },
  {
    slug: "corsair-vengeance-lpx-ddr4-8go",
    nom: "Corsair Vengeance LPX DDR4 8 Go 3200 MHz",
    marque: "Corsair",
    categorie: "composants",
    description:
      "Barrette DDR4 de 8 Go à profil bas. Elle passe sous les gros ventirads sans forcer, idéale pour compléter un poste déjà monté.",
    prixXaf: 38000,
    stock: 18,
    image: "/media/produits/composant-ram-ddr4-installee.jpg",
    misEnAvant: false,
    caracteristiques: ["DDR4 3200 MHz", "8 Go, latence CL16", "Dissipateur profil bas"],
  },
  {
    slug: "crucial-ddr4-sodimm-16go",
    nom: "Crucial DDR4 SO-DIMM 16 Go 3200 MHz",
    marque: "Crucial",
    categorie: "composants",
    description:
      "Mémoire au format SO-DIMM pour ordinateur portable. Montée en boutique, avec test mémoire complet avant restitution.",
    prixXaf: 72000,
    stock: 9,
    image: "/media/produits/composant-ram-sodimm.jpg",
    misEnAvant: false,
    caracteristiques: ["Format SO-DIMM", "DDR4 3200 MHz", "16 Go, latence CL22"],
  },
  {
    slug: "kingston-fury-beast-ddr5-32go",
    nom: "Kingston Fury Beast DDR5 32 Go (2 × 16 Go) 5600 MHz",
    marque: "Kingston",
    categorie: "composants",
    description:
      "Kit DDR5 de 32 Go en deux barrettes, pour les cartes mères récentes. Montage vidéo, machines virtuelles, gros fichiers CAO.",
    prixXaf: 165000,
    stock: 6,
    image: "/media/produits/composant-ram-kit.jpg",
    misEnAvant: true,
    caracteristiques: ["DDR5 5600 MHz", "2 × 16 Go, latence CL36", "Profil XMP 3.0"],
  },
  {
    slug: "corsair-vengeance-rgb-ddr5-32go",
    nom: "Corsair Vengeance RGB DDR5 32 Go (2 × 16 Go) 6000 MHz",
    marque: "Corsair",
    categorie: "composants",
    description:
      "Kit DDR5 haute fréquence avec éclairage adressable. Pensé pour les configurations de jeu à fenêtre latérale.",
    prixXaf: 195000,
    stock: 4,
    image: "/media/produits/composant-ram-ddr5-rgb.jpg",
    misEnAvant: false,
    caracteristiques: ["DDR5 6000 MHz", "2 × 16 Go, latence CL36", "Éclairage RGB adressable"],
  },
  {
    slug: "crucial-ddr5-sodimm-16go",
    nom: "Crucial DDR5 SO-DIMM 16 Go 5600 MHz",
    marque: "Crucial",
    categorie: "composants",
    description:
      "Barrette DDR5 au format portable, pour les machines de dernière génération. Compatibilité vérifiée avant commande.",
    prixXaf: 88000,
    stock: 7,
    image: "/media/produits/composant-ram-ddr5.jpg",
    misEnAvant: false,
    caracteristiques: ["Format SO-DIMM", "DDR5 5600 MHz", "16 Go, latence CL46"],
  },
  {
    slug: "samsung-990-evo-plus-1to",
    nom: "SSD Samsung 990 EVO Plus 1 To NVMe",
    marque: "Samsung",
    categorie: "composants",
    description:
      "SSD interne au format M.2. C'est la mise à niveau qui change le plus la sensation d'une machine, bien avant le processeur.",
    prixXaf: 125000,
    stock: 10,
    image: "/media/produits/composant-ssd-nvme.jpg",
    misEnAvant: true,
    caracteristiques: [
      "Format M.2 2280",
      "Lecture jusqu'à 7 250 Mo/s",
      "Clonage du disque existant inclus",
    ],
  },
  {
    slug: "crucial-p3-plus-500go",
    nom: "SSD Crucial P3 Plus 500 Go NVMe",
    marque: "Crucial",
    categorie: "composants",
    description:
      "Entrée de gamme NVMe pour redonner vie à un portable équipé d'un disque mécanique. Le meilleur rapport gain sur prix du catalogue.",
    prixXaf: 58000,
    stock: 15,
    image: "/media/produits/composant-ssd-m2.jpg",
    misEnAvant: false,
    caracteristiques: ["Format M.2 2280", "PCIe 4.0", "Lecture jusqu'à 5 000 Mo/s"],
  },
  {
    slug: "wd-blue-sn580-1to",
    nom: "SSD Western Digital Blue SN580 1 To NVMe",
    marque: "Western Digital",
    categorie: "composants",
    description:
      "SSD NVMe de 1 To sobre et fiable, sans dissipateur encombrant. Il rentre dans la quasi-totalité des portables récents.",
    prixXaf: 98000,
    stock: 8,
    image: "/media/produits/composant-ssd-nvme-installe.jpg",
    misEnAvant: false,
    caracteristiques: ["Format M.2 2280", "PCIe 4.0", "Lecture jusqu'à 4 150 Mo/s"],
  },
  {
    slug: "samsung-870-evo-500go",
    nom: "SSD Samsung 870 EVO 500 Go SATA",
    marque: "Samsung",
    categorie: "composants",
    description:
      "SSD 2,5 pouces SATA, pour les machines trop anciennes pour accueillir du NVMe. Il remplace directement un disque dur classique.",
    prixXaf: 72000,
    stock: 11,
    image: "/media/produits/composant-ssd-sata.jpg",
    misEnAvant: false,
    caracteristiques: ["Format 2,5 pouces SATA", "Lecture jusqu'à 560 Mo/s", "Compatible PC et portable"],
  },
  {
    slug: "gigabyte-rtx-4060-windforce",
    nom: "Carte graphique Gigabyte RTX 4060 Windforce OC 8 Go",
    marque: "Gigabyte",
    categorie: "composants",
    description:
      "Carte graphique milieu de gamme pour jouer en 1080p et accélérer le rendu vidéo. Deux ventilateurs, format court.",
    prixXaf: 425000,
    stock: 4,
    image: "/media/produits/composant-carte-graphique.jpg",
    misEnAvant: true,
    caracteristiques: ["8 Go GDDR6", "Double ventilateur", "HDMI 2.1 et 3 × DisplayPort"],
  },
  {
    slug: "msi-rtx-4070-super-ventus",
    nom: "Carte graphique MSI RTX 4070 Super Ventus 3X 12 Go",
    marque: "MSI",
    categorie: "composants",
    description:
      "Pour le jeu en 1440p et le calcul graphique lourd. Trois ventilateurs, refroidissement dimensionné pour un usage prolongé.",
    prixXaf: 780000,
    stock: 2,
    image: "/media/produits/composant-carte-graphique-rgb.jpg",
    misEnAvant: true,
    caracteristiques: ["12 Go GDDR6X", "Triple ventilateur", "Alimentation 750 W recommandée"],
  },
  {
    slug: "asus-dual-gtx-1650",
    nom: "Carte graphique Asus Dual GTX 1650 4 Go",
    marque: "Asus",
    categorie: "composants",
    description:
      "Carte d'entrée de gamme sans connecteur d'alimentation supplémentaire. Elle se greffe sur un poste bureautique existant sans changer le bloc.",
    prixXaf: 215000,
    stock: 5,
    image: "/media/produits/composant-carte-graphique-compacte.jpg",
    misEnAvant: false,
    caracteristiques: ["4 Go GDDR6", "Sans connecteur PCIe additionnel", "Format compact"],
  },
  {
    slug: "corsair-rm750e",
    nom: "Alimentation Corsair RM750e 750 W 80 PLUS Gold",
    marque: "Corsair",
    categorie: "composants",
    description:
      "Bloc entièrement modulaire : on ne branche que les câbles utiles, le boîtier reste propre et l'air circule.",
    prixXaf: 118000,
    stock: 6,
    image: "/media/produits/composant-alimentation-750w.jpg",
    misEnAvant: false,
    caracteristiques: ["750 W", "Certifié 80 PLUS Gold", "Entièrement modulaire"],
  },
  {
    slug: "msi-mag-a650bn",
    nom: "Alimentation MSI MAG A650BN 650 W 80 PLUS Bronze",
    marque: "MSI",
    categorie: "composants",
    description:
      "Alimentation d'entrée de gamme fiable pour une configuration sans carte graphique gourmande. Câblage fixe.",
    prixXaf: 68000,
    stock: 9,
    image: "/media/produits/composant-alimentation-modulaire.jpg",
    misEnAvant: false,
    caracteristiques: ["650 W", "Certifié 80 PLUS Bronze", "Ventilateur 120 mm"],
  },
  {
    slug: "be-quiet-system-power-10-550w",
    nom: "Alimentation be quiet! System Power 10 550 W",
    marque: "be quiet!",
    categorie: "composants",
    description:
      "Bloc silencieux pour poste bureautique. Le bruit de fond d'un bureau vient souvent de l'alimentation, pas du processeur.",
    prixXaf: 62000,
    stock: 7,
    image: "/media/produits/composant-alimentation-silencieuse.jpg",
    misEnAvant: false,
    caracteristiques: ["550 W", "Certifié 80 PLUS Bronze", "Fonctionnement silencieux"],
  },
  {
    slug: "cooler-master-hyper-212-black",
    nom: "Ventirad Cooler Master Hyper 212 Black Edition",
    marque: "Cooler Master",
    categorie: "composants",
    description:
      "Le ventirad tour de référence. Il remplace un refroidisseur d'origine bruyant et fait chuter les températures en charge.",
    prixXaf: 42000,
    stock: 10,
    image: "/media/produits/composant-ventirad-tour.jpg",
    misEnAvant: false,
    caracteristiques: ["4 caloducs en contact direct", "Ventilateur 120 mm PWM", "Compatible Intel et AMD"],
  },
  {
    slug: "arctic-freezer-36",
    nom: "Ventirad Arctic Freezer 36",
    marque: "Arctic",
    categorie: "composants",
    description:
      "Refroidisseur tour à double ventilateur, monté sur les sockets récents Intel et AMD. Bon niveau sonore en charge prolongée.",
    prixXaf: 38000,
    stock: 8,
    image: "/media/produits/composant-ventirad.jpg",
    misEnAvant: false,
    caracteristiques: ["Deux ventilateurs 120 mm", "Sockets LGA 1700 et AM5", "Pâte thermique pré-appliquée"],
  },
  {
    slug: "corsair-icue-h100i-rgb-elite",
    nom: "Watercooling Corsair iCUE H100i RGB Elite 240 mm",
    marque: "Corsair",
    categorie: "composants",
    description:
      "Refroidissement liquide tout-en-un avec radiateur de 240 mm. Pour les processeurs qui chauffent et les boîtiers étroits.",
    prixXaf: 168000,
    stock: 3,
    image: "/media/produits/composant-watercooling.jpg",
    misEnAvant: false,
    caracteristiques: ["Radiateur 240 mm", "Deux ventilateurs 120 mm", "Pompe et éclairage pilotés par logiciel"],
  },
  {
    slug: "arctic-p12-pwm-pack-5",
    nom: "Ventilateurs Arctic P12 PWM PST 120 mm, lot de 5",
    marque: "Arctic",
    categorie: "composants",
    description:
      "Lot de cinq ventilateurs de boîtier à pression statique. De quoi refaire entièrement la circulation d'air d'une tour.",
    prixXaf: 32000,
    stock: 12,
    image: "/media/produits/composant-ventilateur-boitier.jpg",
    misEnAvant: false,
    caracteristiques: ["120 mm, régulation PWM", "Chaînage PST", "Lot de 5"],
  },
  {
    slug: "gigabyte-b650m-ds3h",
    nom: "Carte mère Gigabyte B650M DS3H",
    marque: "Gigabyte",
    categorie: "composants",
    description:
      "Carte mère micro-ATX pour processeurs AMD récents. Deux emplacements M.2, mémoire DDR5, base saine pour un montage neuf.",
    prixXaf: 165000,
    stock: 5,
    image: "/media/produits/composant-carte-mere.jpg",
    misEnAvant: false,
    caracteristiques: ["Socket AM5", "Format micro-ATX", "DDR5 et 2 ports M.2"],
  },
  {
    slug: "msi-b450m-pro-vdh-plus",
    nom: "Carte mère MSI B450M PRO-VDH PLUS",
    marque: "MSI",
    categorie: "composants",
    description:
      "Carte mère AM4 économique pour remonter ou réparer une machine existante. Sorties HDMI, DVI et VGA d'origine.",
    prixXaf: 78000,
    stock: 6,
    image: "/media/produits/composant-carte-mere-msi.jpg",
    misEnAvant: false,
    caracteristiques: ["Socket AM4", "Format micro-ATX", "DDR4, sorties HDMI et VGA"],
  },
  {
    slug: "asus-prime-h610m-k-d4",
    nom: "Carte mère Asus PRIME H610M-K D4",
    marque: "Asus",
    categorie: "composants",
    description:
      "Carte mère Intel d'entrée de gamme en DDR4. Elle permet de garder ses barrettes existantes lors d'un changement de processeur.",
    prixXaf: 92000,
    stock: 5,
    image: "/media/produits/composant-carte-mere.jpg",
    misEnAvant: false,
    caracteristiques: ["Socket LGA 1700", "Format micro-ATX", "Mémoire DDR4"],
  },
  {
    slug: "cooler-master-masterbox-q300l",
    nom: "Boîtier Cooler Master MasterBox Q300L",
    marque: "Cooler Master",
    categorie: "composants",
    description:
      "Boîtier micro-ATX compact à façade perforée. Il tient sous un bureau étroit sans étouffer les composants.",
    prixXaf: 68000,
    stock: 6,
    image: "/media/produits/composant-boitier.jpg",
    misEnAvant: false,
    caracteristiques: ["Format micro-ATX", "Panneau latéral transparent", "Façade maillée"],
  },
  {
    slug: "corsair-4000d-airflow",
    nom: "Boîtier Corsair 4000D Airflow",
    marque: "Corsair",
    categorie: "composants",
    description:
      "Moyenne tour ATX conçue pour la circulation d'air. Passages de câbles larges, montage propre en une seule session.",
    prixXaf: 125000,
    stock: 4,
    image: "/media/produits/composant-boitier-rgb.jpg",
    misEnAvant: true,
    caracteristiques: ["Moyenne tour ATX", "Façade haute circulation", "Deux ventilateurs 120 mm inclus"],
  },
  {
    slug: "arctic-mx-4",
    nom: "Pâte thermique Arctic MX-4, 4 g",
    marque: "Arctic",
    categorie: "composants",
    description:
      "Pâte thermique non conductrice, la valeur sûre pour un remontage de processeur. Une seringue couvre plusieurs applications.",
    prixXaf: 9000,
    stock: 25,
    image: "/media/produits/composant-pate-thermique.jpg",
    misEnAvant: false,
    caracteristiques: ["Seringue de 4 g", "Conductivité 8,5 W/mK", "Non conductrice électriquement"],
  },
  {
    slug: "noctua-nt-h1",
    nom: "Pâte thermique Noctua NT-H1, 3,5 g",
    marque: "Noctua",
    categorie: "composants",
    description:
      "Référence des ateliers de maintenance. Pas de temps de rodage, pas de nettoyage compliqué au démontage.",
    prixXaf: 12000,
    stock: 18,
    image: "/media/produits/composant-pate-thermique-intel.jpg",
    misEnAvant: false,
    caracteristiques: ["Seringue de 3,5 g", "Sans temps de rodage", "Non conductrice électriquement"],
  },

  // ------------------------------------------------------ ÉCRANS & MONITEURS
  {
    slug: "dell-e2223hn-22",
    nom: "Écran Dell E2223HN 21,5 pouces",
    marque: "Dell",
    categorie: "ecrans",
    description:
      "Moniteur bureautique simple et solide. Sorties HDMI et VGA, donc compatible avec les unités centrales anciennes comme récentes.",
    prixXaf: 95000,
    stock: 10,
    image: "/media/produits/ecran-bureautique-22.jpg",
    misEnAvant: false,
    caracteristiques: ["21,5 pouces, Full HD", "Dalle VA", "HDMI et VGA"],
  },
  {
    slug: "aoc-24b2xh-24",
    nom: "Écran AOC 24B2XH 23,8 pouces IPS",
    marque: "AOC",
    categorie: "ecrans",
    description:
      "Dalle IPS sans bordure sur trois côtés. Les couleurs restent justes quand on regarde l'écran de côté, ce qui compte en poste partagé.",
    prixXaf: 128000,
    stock: 8,
    image: "/media/produits/ecran-bureautique-24.jpg",
    misEnAvant: true,
    caracteristiques: ["23,8 pouces, Full HD", "Dalle IPS 75 Hz", "HDMI et VGA"],
  },
  {
    slug: "lg-24mp60g-b",
    nom: "Écran LG 24MP60G-B 23,8 pouces IPS",
    marque: "LG",
    categorie: "ecrans",
    description:
      "IPS avec FreeSync et mode de réduction du flou. Un écran polyvalent qui tient aussi bien la bureautique que le jeu occasionnel.",
    prixXaf: 148000,
    stock: 6,
    image: "/media/produits/ecran-creation-ips.jpg",
    misEnAvant: false,
    caracteristiques: ["23,8 pouces, Full HD", "AMD FreeSync", "HDMI, DisplayPort et VGA"],
  },
  {
    slug: "dell-s2721ds-27",
    nom: "Écran Dell S2721DS 27 pouces QHD",
    marque: "Dell",
    categorie: "ecrans",
    description:
      "27 pouces en 2560 × 1440 : plus de place de travail réelle qu'en Full HD, sans passer à deux écrans. Pied réglable en hauteur.",
    prixXaf: 285000,
    stock: 4,
    image: "/media/produits/ecran-creation-27.jpg",
    misEnAvant: true,
    caracteristiques: ["27 pouces, QHD 2560 × 1440", "Dalle IPS 75 Hz", "Pied réglable en hauteur et pivot"],
  },
  {
    slug: "aoc-24g2sp",
    nom: "Écran AOC 24G2SP 23,8 pouces 165 Hz",
    marque: "AOC",
    categorie: "ecrans",
    description:
      "Écran de jeu à 165 Hz sur dalle IPS. La fluidité du 165 Hz se voit dès le déplacement du curseur, pas seulement en jeu.",
    prixXaf: 215000,
    stock: 5,
    image: "/media/produits/ecran-gaming-165hz.jpg",
    misEnAvant: false,
    caracteristiques: ["23,8 pouces, Full HD", "165 Hz, 1 ms", "Dalle IPS, FreeSync Premium"],
  },
  {
    slug: "samsung-odyssey-g5-27",
    nom: "Écran Samsung Odyssey G5 27 pouces incurvé",
    marque: "Samsung",
    categorie: "ecrans",
    description:
      "Dalle incurvée 1000R en QHD à 165 Hz. La courbure suit le champ de vision, l'écran paraît plus enveloppant qu'un plat de même taille.",
    prixXaf: 320000,
    stock: 3,
    image: "/media/produits/ecran-gaming-incurve.jpg",
    misEnAvant: true,
    caracteristiques: ["27 pouces, QHD 2560 × 1440", "Courbure 1000R, 165 Hz", "HDR10, FreeSync Premium"],
  },
  {
    slug: "lg-34wp65c-b",
    nom: "Écran LG 34WP65C-B 34 pouces ultra-large incurvé",
    marque: "LG",
    categorie: "ecrans",
    description:
      "Format ultra-large de 34 pouces : deux fenêtres côte à côte en pleine largeur, sans la coupure d'un montage à deux écrans.",
    prixXaf: 485000,
    stock: 2,
    image: "/media/produits/ecran-ultrawide-34.jpg",
    misEnAvant: true,
    caracteristiques: ["34 pouces, 2560 × 1080", "Incurvé, 160 Hz", "HDR10, deux ports HDMI"],
  },
  {
    slug: "lg-34wn80c-b",
    nom: "Écran LG 34WN80C-B 34 pouces IPS USB-C",
    marque: "LG",
    categorie: "ecrans",
    description:
      "Ultra-large en 3440 × 1440 sur dalle IPS, avec un seul câble USB-C pour l'image et la recharge du portable. Poste de montage ou de CAO.",
    prixXaf: 520000,
    stock: 2,
    image: "/media/produits/ecran-ultrawide-creation.jpg",
    misEnAvant: false,
    caracteristiques: ["34 pouces, 3440 × 1440", "Dalle IPS, sRGB 99 %", "USB-C avec charge 60 W"],
  },
  {
    slug: "aoc-27b2h",
    nom: "Écran AOC 27B2H 27 pouces IPS",
    marque: "AOC",
    categorie: "ecrans",
    description:
      "27 pouces en Full HD, sobre et sans bordure. Le format le plus demandé pour équiper un open space en double écran.",
    prixXaf: 165000,
    stock: 7,
    image: "/media/produits/ecran-double-poste.jpg",
    misEnAvant: false,
    caracteristiques: ["27 pouces, Full HD", "Dalle IPS 75 Hz", "HDMI et VGA"],
  },

  // ------------------------------------------------------ STOCKAGE & DISQUES
  {
    slug: "seagate-expansion-desktop-4to",
    nom: "Disque externe Seagate Expansion Desktop 4 To",
    marque: "Seagate",
    categorie: "stockage",
    description:
      "Disque de bureau de 4 To pour archiver photos, vidéos et sauvegardes complètes. Alimentation secteur séparée, il reste posé au bureau.",
    prixXaf: 145000,
    stock: 6,
    image: "/media/produits/stockage-disque-externe.jpg",
    misEnAvant: true,
    caracteristiques: ["4 To", "USB 3.0", "Alimentation secteur incluse"],
  },
  {
    slug: "wd-elements-portable-2to",
    nom: "Disque externe WD Elements Portable 2 To",
    marque: "Western Digital",
    categorie: "stockage",
    description:
      "Disque de poche alimenté par le port USB, sans bloc secteur. La sauvegarde qu'on emporte en déplacement.",
    prixXaf: 88000,
    stock: 12,
    image: "/media/produits/stockage-disque-externe-usb.jpg",
    misEnAvant: false,
    caracteristiques: ["2 To", "USB 3.0", "Alimenté par le port USB"],
  },
  {
    slug: "lacie-rugged-mini-2to",
    nom: "Disque externe LaCie Rugged Mini 2 To",
    marque: "LaCie",
    categorie: "stockage",
    description:
      "Coque caoutchouc résistante aux chutes et aux averses. Conçu pour le terrain, pas pour le tiroir de bureau.",
    prixXaf: 165000,
    stock: 4,
    image: "/media/produits/stockage-disque-portable.jpg",
    misEnAvant: false,
    caracteristiques: ["2 To", "Résistant aux chocs et à la pluie", "USB 3.0"],
  },
  {
    slug: "sandisk-extreme-portable-ssd-1to",
    nom: "SSD portable SanDisk Extreme 1 To",
    marque: "SanDisk",
    categorie: "stockage",
    description:
      "SSD externe sans pièce mobile, donc insensible aux secousses. Il copie une carte mémoire de tournage en quelques minutes.",
    prixXaf: 155000,
    stock: 7,
    image: "/media/produits/stockage-ssd-portable.jpg",
    misEnAvant: true,
    caracteristiques: ["1 To", "Lecture jusqu'à 1 050 Mo/s", "Étanchéité IP65"],
  },
  {
    slug: "samsung-t7-shield-1to",
    nom: "SSD portable Samsung T7 Shield 1 To",
    marque: "Samsung",
    categorie: "stockage",
    description:
      "SSD externe à revêtement antidérapant, pensé pour être manipulé toute la journée. Chiffrement matériel disponible.",
    prixXaf: 168000,
    stock: 5,
    image: "/media/produits/stockage-ssd-portable-samsung.jpg",
    misEnAvant: false,
    caracteristiques: ["1 To", "Lecture jusqu'à 1 050 Mo/s", "Étanchéité IP65"],
  },
  {
    slug: "sandisk-extreme-portable-ssd-2to",
    nom: "SSD portable SanDisk Extreme 2 To",
    marque: "SanDisk",
    categorie: "stockage",
    description:
      "La version 2 To pour les métiers de l'image. Un seul disque suffit à couvrir plusieurs projets sans jonglage.",
    prixXaf: 275000,
    stock: 3,
    image: "/media/produits/stockage-ssd-portable-bureau.jpg",
    misEnAvant: false,
    caracteristiques: ["2 To", "Lecture jusqu'à 1 050 Mo/s", "Boucle d'accroche métallique"],
  },
  {
    slug: "sandisk-ultra-microsdxc-128go",
    nom: "Carte microSDXC SanDisk Ultra 128 Go",
    marque: "SanDisk",
    categorie: "stockage",
    description:
      "Carte mémoire pour téléphone, tablette ou caméra embarquée. Livrée avec l'adaptateur SD.",
    prixXaf: 18000,
    stock: 30,
    image: "/media/produits/stockage-microsd.jpg",
    misEnAvant: false,
    caracteristiques: ["128 Go", "Classe 10, A1", "Adaptateur SD inclus"],
  },
  {
    slug: "samsung-pro-plus-sd-128go",
    nom: "Carte SD Samsung PRO Plus 128 Go",
    marque: "Samsung",
    categorie: "stockage",
    description:
      "Carte SD rapide pour appareil photo et caméra. Elle suit la rafale et l'enregistrement vidéo sans coupure d'écriture.",
    prixXaf: 32000,
    stock: 14,
    image: "/media/produits/stockage-carte-sd.jpg",
    misEnAvant: false,
    caracteristiques: ["128 Go", "Lecture jusqu'à 180 Mo/s", "Classée U3 et V30"],
  },
  {
    slug: "sandisk-ultra-flair-64go",
    nom: "Clé USB SanDisk Ultra Flair 64 Go",
    marque: "SanDisk",
    categorie: "stockage",
    description:
      "Clé USB 3.0 à corps métallique. Les transferts sont nettement plus rapides qu'en USB 2.0 sur un gros dossier.",
    prixXaf: 12000,
    stock: 35,
    image: "/media/produits/stockage-cle-usb.jpg",
    misEnAvant: false,
    caracteristiques: ["64 Go", "USB 3.0", "Corps métal"],
  },
  {
    slug: "sandisk-dual-drive-luxe-128go",
    nom: "Clé USB SanDisk Ultra Dual Drive Luxe 128 Go",
    marque: "SanDisk",
    categorie: "stockage",
    description:
      "Double connecteur USB-C et USB-A. Elle passe du téléphone à l'ordinateur sans adaptateur, ce qui règle la plupart des cas d'usage.",
    prixXaf: 25000,
    stock: 20,
    image: "/media/produits/stockage-cle-usb-otg.jpg",
    misEnAvant: true,
    caracteristiques: ["128 Go", "USB-C et USB-A", "Lecture jusqu'à 150 Mo/s"],
  },

  // ----------------------------------------------------- CÂBLES & ADAPTATEURS
  {
    slug: "ugreen-hdmi-2-0-2m",
    nom: "Câble Ugreen HDMI 2.0 4K, 2 m",
    marque: "UGREEN",
    categorie: "cables",
    description:
      "Câble HDMI 4K à 60 Hz pour relier un ordinateur, une box ou une console à un téléviseur. Connecteurs plaqués or.",
    prixXaf: 9000,
    stock: 30,
    image: "/media/produits/cable-hdmi.jpg",
    misEnAvant: false,
    caracteristiques: ["HDMI 2.0", "4K à 60 Hz", "Longueur 2 m"],
  },
  {
    slug: "ugreen-hdmi-2-1-2m",
    nom: "Câble Ugreen HDMI 2.1 8K, 2 m",
    marque: "UGREEN",
    categorie: "cables",
    description:
      "Câble certifié 48 Gbit/s pour le 4K à 120 Hz. Indispensable pour tirer le taux de rafraîchissement d'un écran de jeu récent.",
    prixXaf: 18000,
    stock: 16,
    image: "/media/produits/cable-hdmi-coude.jpg",
    misEnAvant: false,
    caracteristiques: ["HDMI 2.1, 48 Gbit/s", "8K à 60 Hz ou 4K à 120 Hz", "Longueur 2 m"],
  },
  {
    slug: "anker-powerline-iii-usbc-100w",
    nom: "Câble Anker PowerLine III USB-C 100 W, 1,8 m",
    marque: "Anker",
    categorie: "cables",
    description:
      "Câble USB-C vers USB-C capable de charger un ordinateur portable. Gaine renforcée testée sur plusieurs milliers de pliages.",
    prixXaf: 14000,
    stock: 22,
    image: "/media/produits/cable-usb-c.jpg",
    misEnAvant: false,
    caracteristiques: ["USB-C vers USB-C", "Charge jusqu'à 100 W", "Longueur 1,8 m"],
  },
  {
    slug: "baseus-usbc-tresse-2m",
    nom: "Câble Baseus USB-C tressé 100 W, 2 m",
    marque: "Baseus",
    categorie: "cables",
    description:
      "Gaine tressée nylon, connecteurs renforcés. La longueur de 2 m permet de charger depuis une prise éloignée du bureau.",
    prixXaf: 11000,
    stock: 25,
    image: "/media/produits/cable-usb-c-tresse.jpg",
    misEnAvant: false,
    caracteristiques: ["USB-C vers USB-C", "Charge jusqu'à 100 W", "Gaine tressée, 2 m"],
  },
  {
    slug: "ugreen-usba-usbc-lot-2",
    nom: "Câbles Ugreen USB-A vers USB-C, lot de 2",
    marque: "UGREEN",
    categorie: "cables",
    description:
      "Deux câbles pour les chargeurs et les ports USB-A encore majoritaires. Un pour la maison, un pour le sac.",
    prixXaf: 8000,
    stock: 28,
    image: "/media/produits/cable-usb-a.jpg",
    misEnAvant: false,
    caracteristiques: ["USB-A vers USB-C", "Charge jusqu'à 18 W", "Lot de 2 câbles de 1 m"],
  },
  {
    slug: "ugreen-rj45-cat6-3m",
    nom: "Câble réseau Ugreen Cat 6 RJ45, 3 m",
    marque: "UGREEN",
    categorie: "cables",
    description:
      "Câble Ethernet Cat 6 pour brancher un poste directement sur la box. Une liaison filaire reste plus stable que le Wi-Fi.",
    prixXaf: 6000,
    stock: 26,
    image: "/media/produits/cable-rj45.jpg",
    misEnAvant: false,
    caracteristiques: ["Catégorie 6", "Jusqu'à 1 Gbit/s", "Longueur 3 m"],
  },
  {
    slug: "ugreen-rj45-cat7-5m",
    nom: "Câble réseau Ugreen Cat 7 blindé, 5 m",
    marque: "UGREEN",
    categorie: "cables",
    description:
      "Câble blindé pour les environnements chargés en interférences, typiquement le long d'une goulotte électrique.",
    prixXaf: 11000,
    stock: 15,
    image: "/media/produits/cable-rj45-cat6.jpg",
    misEnAvant: false,
    caracteristiques: ["Catégorie 7 blindée", "Jusqu'à 10 Gbit/s", "Longueur 5 m"],
  },
  {
    slug: "ugreen-rj45-plat-10m",
    nom: "Câble réseau Ugreen Cat 6 plat, 10 m",
    marque: "UGREEN",
    categorie: "cables",
    description:
      "Câble plat de 10 m, à faire passer sous une plinthe ou un tapis sans surépaisseur visible.",
    prixXaf: 14000,
    stock: 12,
    image: "/media/produits/cable-rj45-plat.jpg",
    misEnAvant: false,
    caracteristiques: ["Catégorie 6, profil plat", "Jusqu'à 1 Gbit/s", "Longueur 10 m"],
  },
  {
    slug: "orico-hub-usb3-7-ports",
    nom: "Hub Orico USB 3.0 7 ports alimenté",
    marque: "Orico",
    categorie: "cables",
    description:
      "Sept ports USB 3.0 avec interrupteur individuel et alimentation externe. Il tient la charge de plusieurs disques en même temps.",
    prixXaf: 28000,
    stock: 9,
    image: "/media/produits/cable-hub-usb.jpg",
    misEnAvant: false,
    caracteristiques: ["7 ports USB 3.0", "Interrupteur par port", "Alimentation externe incluse"],
  },
  {
    slug: "ugreen-hub-usbc-6en1",
    nom: "Hub Ugreen USB-C 6 en 1",
    marque: "UGREEN",
    categorie: "cables",
    description:
      "Un seul port USB-C devient HDMI, USB-A, lecteur de cartes et recharge. La solution pour les portables fins sans connectique.",
    prixXaf: 35000,
    stock: 11,
    image: "/media/produits/cable-hub-usbc.jpg",
    misEnAvant: true,
    caracteristiques: ["HDMI 4K, 3 × USB-A", "Lecteur SD et microSD", "Recharge USB-C 100 W"],
  },
  {
    slug: "baseus-adaptateur-usbc-8en1",
    nom: "Adaptateur Baseus USB-C 8 en 1",
    marque: "Baseus",
    categorie: "cables",
    description:
      "Station d'accueil compacte avec HDMI, réseau filaire et lecteur de cartes. Elle transforme un portable en poste fixe en un branchement.",
    prixXaf: 42000,
    stock: 7,
    image: "/media/produits/cable-adaptateur-usbc.jpg",
    misEnAvant: false,
    caracteristiques: ["HDMI 4K et RJ45", "3 × USB-A, lecteur SD", "Recharge USB-C 100 W"],
  },

  // ---------------------------------------------------- ACCESSOIRES MOBILES
  {
    slug: "spigen-liquid-air",
    nom: "Coque Spigen Liquid Air",
    marque: "Spigen",
    categorie: "mobiles",
    description:
      "Coque souple à motif antidérapant. Elle absorbe les chocs du quotidien sans épaissir le téléphone.",
    prixXaf: 15000,
    stock: 24,
    image: "/media/produits/mobile-coque.jpg",
    misEnAvant: false,
    caracteristiques: ["Polymère souple", "Surface antidérapante", "Bords surélevés autour de l'écran"],
  },
  {
    slug: "uag-pathfinder",
    nom: "Coque renforcée UAG Pathfinder",
    marque: "UAG",
    categorie: "mobiles",
    description:
      "Protection renforcée à double couche, testée aux normes militaires de résistance aux chutes. Pour les chantiers et le terrain.",
    prixXaf: 32000,
    stock: 10,
    image: "/media/produits/mobile-coque-renforcee.jpg",
    misEnAvant: true,
    caracteristiques: ["Double couche", "Norme MIL-STD-810G 516.6", "Compatible charge sans fil"],
  },
  {
    slug: "spigen-cyrill-kajuk",
    nom: "Coque Spigen Cyrill Kajuk",
    marque: "Spigen",
    categorie: "mobiles",
    description:
      "Finition cuir grainé et coutures apparentes, pour un téléphone qui reste sobre en réunion.",
    prixXaf: 28000,
    stock: 8,
    image: "/media/produits/mobile-coque-cuir.jpg",
    misEnAvant: false,
    caracteristiques: ["Finition cuir grainé", "Coque rigide doublée", "Boutons métalliques"],
  },
  {
    slug: "spigen-glas-tr-ez-fit",
    nom: "Verre trempé Spigen Glas.tR EZ Fit, lot de 2",
    marque: "Spigen",
    categorie: "mobiles",
    description:
      "Deux verres livrés avec le gabarit de pose. La pose se fait droite du premier coup, sans bulle ni décalage.",
    prixXaf: 12000,
    stock: 26,
    image: "/media/produits/mobile-verre-trempe.jpg",
    misEnAvant: true,
    caracteristiques: ["Dureté 9H", "Gabarit de pose inclus", "Lot de 2"],
  },
  {
    slug: "ugreen-verre-trempe",
    nom: "Verre trempé Ugreen anti-lumière bleue",
    marque: "UGREEN",
    categorie: "mobiles",
    description:
      "Filtre la lumière bleue en plus de protéger l'écran. Utile pour ceux qui lisent longuement le soir sur leur téléphone.",
    prixXaf: 9000,
    stock: 20,
    image: "/media/produits/mobile-verre-trempe-pose.jpg",
    misEnAvant: false,
    caracteristiques: ["Dureté 9H", "Filtre lumière bleue", "Traitement anti-traces"],
  },
  {
    slug: "ugreen-trepied-smartphone",
    nom: "Trépied Ugreen pour smartphone",
    marque: "UGREEN",
    categorie: "mobiles",
    description:
      "Trépied pliant avec pince réglable. Pour filmer une démonstration, une visioconférence ou une vidéo de produit sans tenir le téléphone.",
    prixXaf: 22000,
    stock: 12,
    image: "/media/produits/mobile-support-trepied.jpg",
    misEnAvant: false,
    caracteristiques: ["Pince réglable", "Rotule orientable", "Pliage compact"],
  },
  {
    slug: "baseus-perche-selfie",
    nom: "Perche à selfie Bluetooth Baseus",
    marque: "Baseus",
    categorie: "mobiles",
    description:
      "Perche télescopique avec télécommande Bluetooth détachable, convertible en trépied de table.",
    prixXaf: 18000,
    stock: 15,
    image: "/media/produits/mobile-perche.jpg",
    misEnAvant: false,
    caracteristiques: ["Télécommande Bluetooth", "Convertible en trépied", "Extension jusqu'à 1 m"],
  },
  {
    slug: "anker-maggo-chargeur-sans-fil",
    nom: "Chargeur sans fil Anker MagGo 15 W",
    marque: "Anker",
    categorie: "mobiles",
    description:
      "Chargeur magnétique qui s'aligne seul sur le téléphone. Plus de câble à chercher en posant l'appareil sur le bureau.",
    prixXaf: 35000,
    stock: 9,
    image: "/media/produits/mobile-chargeur-sans-fil.jpg",
    misEnAvant: true,
    caracteristiques: ["Charge magnétique 15 W", "Compatible Qi", "Adaptateur secteur inclus"],
  },
  {
    slug: "baseus-chargeur-sans-fil-15w",
    nom: "Chargeur sans fil Baseus 15 W",
    marque: "Baseus",
    categorie: "mobiles",
    description:
      "Socle de charge sans fil incliné, qui garde l'écran visible pendant la recharge. Détection des corps étrangers intégrée.",
    prixXaf: 28000,
    stock: 11,
    image: "/media/produits/mobile-chargeur-sans-fil-bureau.jpg",
    misEnAvant: false,
    caracteristiques: ["Charge sans fil 15 W", "Compatible Qi", "Socle incliné"],
  },
  {
    slug: "ugreen-support-bureau",
    nom: "Support de bureau Ugreen réglable",
    marque: "UGREEN",
    categorie: "mobiles",
    description:
      "Support en aluminium à inclinaison réglable. Il tient aussi bien un téléphone qu'une petite tablette.",
    prixXaf: 14000,
    stock: 18,
    image: "/media/produits/mobile-support-bureau.jpg",
    misEnAvant: false,
    caracteristiques: ["Aluminium", "Inclinaison réglable", "Base antidérapante"],
  },

  /* ==================================================================
     ⚠️ PRIX PROVISOIRES — TODO_TARIFS
     Section composants électroniques : pièces de rechange pour
     téléphone et ordinateur portable. Les prix sont inventés, cohérents
     entre eux et calés sur un ordre de grandeur import + marge pour
     Bangui. Les caractéristiques techniques (diagonale, définition,
     capacité, connectique) sont celles du modèle nommé et ont été
     vérifiées une par une : une compatibilité annoncée à tort est une
     fausse promesse commerciale. Seuls les montants et les stocks sont
     à remplacer par la grille tarifaire du client avant mise en ligne.

     Ces pièces sont des rechanges compatibles, pas des pièces d'origine
     constructeur. C'est écrit sur chaque fiche, pas seulement ici.
     ================================================================== */

  // ------------------------------------------- COMPOSANTS ÉLECTRONIQUES
  {
    slug: "ecran-oled-iphone-12",
    nom: "Écran OLED de remplacement iPhone 12",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Bloc écran complet pour iPhone 12 : dalle OLED, vitre et tactile déjà assemblés. Livré avec la nappe montée, prêt à poser.",
    prixXaf: 85000,
    stock: 6,
    image: "/media/produits/piece-ecran-oled-iphone-12.jpg",
    misEnAvant: true,
    caracteristiques: [
      "Dalle OLED 6,1 pouces, 2532 × 1170 px",
      "Compatible iPhone 12 et iPhone 12 Pro",
      "Pièce compatible, non d'origine",
    ],
  },
  {
    slug: "ecran-lcd-iphone-11",
    nom: "Écran LCD de remplacement iPhone 11",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Bloc écran LCD pour iPhone 11. C'est la réparation la plus demandée en boutique, et la moins chère sur cette génération.",
    prixXaf: 45000,
    stock: 11,
    image: "/media/produits/piece-ecran-lcd-iphone-11.jpg",
    misEnAvant: true,
    caracteristiques: [
      "Dalle LCD IPS 6,1 pouces, 1792 × 828 px",
      "Compatible iPhone 11 uniquement",
      "Pièce compatible, non d'origine",
    ],
  },
  {
    slug: "ecran-oled-galaxy-s21",
    nom: "Écran OLED de remplacement Galaxy S21",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Bloc écran OLED pour Samsung Galaxy S21. Pose au banc, avec recollage du châssis et test tactile complet avant restitution.",
    prixXaf: 95000,
    stock: 3,
    image: "/media/produits/piece-ecran-oled-galaxy-s21.jpg",
    misEnAvant: false,
    caracteristiques: [
      "Dalle OLED 6,2 pouces, 2400 × 1080 px",
      "Compatible Galaxy S21 (SM-G991)",
      "Pièce compatible, non d'origine",
    ],
  },
  {
    slug: "batterie-iphone-11",
    nom: "Batterie de remplacement iPhone 11",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Batterie neuve pour iPhone 11, livrée avec les bandes adhésives de fixation. À changer dès que l'autonomie ne tient plus la journée.",
    prixXaf: 22000,
    stock: 14,
    image: "/media/produits/piece-batterie-iphone-11.jpg",
    misEnAvant: true,
    caracteristiques: [
      "3 110 mAh, 3,83 V, Li-ion",
      "Compatible iPhone 11 uniquement",
      "Adhésifs de fixation inclus",
    ],
  },
  {
    slug: "batterie-galaxy-a12",
    nom: "Batterie de remplacement Galaxy A12",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Batterie 5 000 mAh pour Samsung Galaxy A12. Sur ce modèle très répandu, le remplacement se fait dans la journée.",
    prixXaf: 15000,
    stock: 0,
    image: "/media/produits/piece-batterie-galaxy-a12.jpg",
    misEnAvant: false,
    caracteristiques: [
      "5 000 mAh, Li-ion",
      "Compatible Galaxy A12 (SM-A125)",
      "Pièce compatible, non d'origine",
    ],
  },
  {
    slug: "connecteur-charge-iphone-11",
    nom: "Nappe connecteur de charge iPhone 11",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Nappe de charge Lightning complète, avec le micro et la prise casque intégrés. À changer quand le câble ne tient plus dans la prise.",
    prixXaf: 12000,
    stock: 9,
    image: "/media/produits/piece-connecteur-charge-iphone-11.jpg",
    misEnAvant: false,
    caracteristiques: [
      "Connecteur Lightning",
      "Micro et antenne intégrés à la nappe",
      "Compatible iPhone 11 uniquement",
    ],
  },
  {
    slug: "connecteur-charge-galaxy-a52",
    nom: "Nappe connecteur de charge USB-C Galaxy A52",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Carte de charge USB-C pour Galaxy A52, micro inclus. La poussière et les faux contacts finissent toujours par avoir raison de cette pièce.",
    prixXaf: 11000,
    stock: 7,
    image: "/media/produits/piece-connecteur-charge-galaxy-a52.jpg",
    misEnAvant: false,
    caracteristiques: [
      "Connecteur USB-C, charge 25 W",
      "Micro intégré à la nappe",
      "Compatible Galaxy A52 (SM-A525)",
    ],
  },
  {
    slug: "vitre-arriere-iphone-12",
    nom: "Vitre arrière de remplacement iPhone 12",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Panneau de verre arrière pour iPhone 12. La dépose se fait au laser, c'est une opération d'atelier et pas une pose à domicile.",
    prixXaf: 18000,
    stock: 5,
    image: "/media/produits/piece-vitre-arriere-iphone-12.jpg",
    misEnAvant: false,
    caracteristiques: [
      "Verre arrière avec joint d'étanchéité",
      "Compatible iPhone 12 et iPhone 12 Pro",
      "Dépose au laser en atelier",
    ],
  },
  {
    slug: "camera-arriere-galaxy-a52",
    nom: "Module caméra arrière Galaxy A52",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Bloc caméra principal pour Galaxy A52. À remplacer quand la lentille est rayée ou que la stabilisation vibre en permanence.",
    prixXaf: 28000,
    stock: 0,
    image: "/media/produits/piece-camera-galaxy-a52.jpg",
    misEnAvant: false,
    caracteristiques: [
      "Capteur principal 64 Mpx, f/1.8",
      "Stabilisation optique intégrée",
      "Compatible Galaxy A52 (SM-A525)",
    ],
  },
  {
    slug: "haut-parleur-iphone-11",
    nom: "Haut-parleur interne iPhone 11",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Haut-parleur de bas de coque pour iPhone 11. Le son qui grésille ou qui sature en volume haut vient presque toujours de là.",
    prixXaf: 9000,
    stock: 12,
    image: "/media/produits/piece-haut-parleur-iphone-11.jpg",
    misEnAvant: false,
    caracteristiques: [
      "Haut-parleur de bas de coque",
      "Compatible iPhone 11 uniquement",
      "Pose et test audio en boutique",
    ],
  },
  {
    slug: "clavier-hp-probook-440-g8",
    nom: "Clavier de remplacement HP ProBook 440 G8",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Clavier AZERTY complet pour HP ProBook 440 G8, touches et plaque support d'un seul tenant. Pour un clavier noyé ou des touches mortes.",
    prixXaf: 35000,
    stock: 4,
    image: "/media/produits/piece-clavier-probook-440.jpg",
    misEnAvant: true,
    caracteristiques: [
      "Disposition AZERTY française",
      "Compatible HP ProBook 440 G8 (14 pouces)",
      "Plaque support incluse",
    ],
  },
  {
    slug: "dalle-ecran-14-fhd-portable",
    nom: "Dalle d'écran 14 pouces Full HD pour portable",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Dalle de rechange 14 pouces mate pour ordinateur portable. La référence exacte se vérifie sur l'étiquette de la dalle démontée, jamais sur le modèle du portable.",
    prixXaf: 65000,
    stock: 6,
    image: "/media/produits/piece-dalle-ecran-14-fhd.jpg",
    misEnAvant: true,
    caracteristiques: [
      "14 pouces IPS mat, 1920 × 1080 px",
      "Connecteur eDP 30 broches",
      "Référence à vérifier sur la dalle d'origine",
    ],
  },
  {
    slug: "batterie-portable-hp-hs04",
    nom: "Batterie de portable HP HS04",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Batterie 4 cellules pour les HP des séries 240 et 250 G4. Elle se change par l'extérieur sur ces châssis, sans ouvrir la machine.",
    prixXaf: 32000,
    stock: 8,
    image: "/media/produits/piece-batterie-hp-hs04.jpg",
    misEnAvant: false,
    caracteristiques: [
      "4 cellules, 14,6 V, 41 Wh",
      "Compatible HP 240 G4, 245 G4, 250 G4, 255 G4",
      "Pièce compatible, non d'origine",
    ],
  },
  {
    slug: "ventilateur-dell-latitude-5480",
    nom: "Ventilateur processeur Dell Latitude 5480",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Ventilateur de refroidissement pour Dell Latitude 5480. Une machine qui souffle fort et ralentit après vingt minutes a souvent un ventilateur en fin de vie.",
    prixXaf: 24000,
    stock: 5,
    image: "/media/produits/piece-ventilateur-latitude-5480.jpg",
    misEnAvant: false,
    caracteristiques: [
      "Ventilateur processeur, 5 V",
      "Compatible Dell Latitude 5480 (14 pouces)",
      "Nettoyage du radiateur inclus à la pose",
    ],
  },
  {
    slug: "nappe-ecran-edp-portable",
    nom: "Nappe d'écran eDP 30 broches pour portable",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Nappe vidéo entre la carte mère et la dalle. Un écran qui clignote ou s'éteint à l'ouverture du capot vient de cette nappe, pas de la dalle.",
    prixXaf: 14000,
    stock: 10,
    image: "/media/produits/piece-nappe-ecran-edp.jpg",
    misEnAvant: false,
    caracteristiques: [
      "Connecteur eDP 30 broches",
      "Référence à relever sur la nappe d'origine",
      "Diagnostic gratuit avant remplacement",
    ],
  },
  {
    slug: "connecteur-alimentation-dc-hp",
    nom: "Connecteur d'alimentation DC pour portable HP",
    marque: "Pièce compatible",
    categorie: "composants-electroniques",
    description:
      "Prise d'alimentation à souder ou à connecter selon le châssis. À changer quand il faut tenir le câble dans un certain angle pour que la charge démarre.",
    prixXaf: 7500,
    stock: 16,
    image: "/media/produits/piece-connecteur-alimentation-dc.jpg",
    misEnAvant: false,
    caracteristiques: [
      "Embout 4,5 × 3,0 mm, format HP",
      "Nappe d'alimentation fournie",
      "Soudure en atelier si le châssis l'exige",
    ],
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
