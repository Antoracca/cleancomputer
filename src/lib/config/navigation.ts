/**
 * NAVIGATION
 *
 * Contrainte héritée de Mastercard : jamais plus de six entrées de premier
 * niveau. La pilule doit rester aérée.
 *
 * Chaque pilier porte un aperçu visuel — le mega-menu n'est pas une liste de
 * liens, c'est une vitrine.
 */

export type NavPreview = {
  readonly image: string;
  readonly label: string;
  readonly href: string;
};

export type NavLink = {
  readonly label: string;
  readonly href: string;
  readonly note?: string;
  readonly logo?: string;
};

export type NavPillar = {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly intro: string;
  readonly links: readonly NavLink[];
  readonly previews: readonly NavPreview[];
};

export const PILLARS: readonly NavPillar[] = [
  {
    id: "boutique",
    label: "Boutique",
    href: "/electronique",
    intro: "Du matériel testé, en stock à Bangui.",
    links: [
      { label: "Ordinateurs", href: "/electronique/ordinateurs" },
      { label: "Téléphones", href: "/electronique/telephones" },
      { label: "Composants PC", href: "/electronique/composants" },
      { label: "Composants électroniques", href: "/electronique/composants-electroniques" },
      { label: "Écrans & moniteurs", href: "/electronique/ecrans" },
      { label: "Stockage & disques", href: "/electronique/stockage" },
      { label: "Réseau & Wi-Fi", href: "/electronique/reseau" },
      { label: "Audio", href: "/electronique/audio" },
      { label: "Gaming", href: "/electronique/gaming" },
      { label: "Charge & batteries", href: "/electronique/charge" },
      { label: "Câbles & adaptateurs", href: "/electronique/cables" },
      { label: "Accessoires mobiles", href: "/electronique/mobiles" },
      { label: "Périphériques", href: "/electronique/peripheriques" },
      { label: "Tablettes", href: "/electronique/tablettes" },
      { label: "Téléviseurs", href: "/electronique/television" },
      { label: "Photo & vidéo", href: "/electronique/photo" },
      { label: "Logiciels", href: "/electronique/logiciels" },
    ],
    previews: [
      {
        image: "/media/portraits/ordinateur-hp-argent.jpg",
        label: "Ordinateurs",
        href: "/electronique/ordinateurs",
      },
      {
        image: "/media/portraits/telephone-galaxy-s25-ultra.jpg",
        label: "Téléphones",
        href: "/electronique/telephones",
      },
      {
        image: "/media/portraits/reseau-starlink-kit-deballe.jpg",
        label: "Kit Starlink",
        href: "/electronique/reseau",
      },
      {
        image: "/media/portraits/audio-ecouteurs-airpods-pro-2.jpg",
        label: "Audio sans fil",
        href: "/electronique/audio",
      },
    ],
  },
  {
    id: "services",
    label: "Services",
    href: "/services-informatiques",
    intro: "Quatre familles de prestations, un seul interlocuteur.",
    links: [
      { label: "Systèmes & postes", href: "/services-informatiques/systemes" },
      { label: "Infrastructure", href: "/services-informatiques/infrastructure" },
      { label: "Développement", href: "/services-informatiques/developpement" },
      { label: "Identité & communication", href: "/services-informatiques/identite" },
      {
        label: "Installation Windows",
        href: "/services-informatiques/systemes/installation-windows",
      },
      {
        label: "Récupération de données",
        href: "/services-informatiques/systemes/recuperation-donnees",
      },
      {
        label: "Installation Starlink",
        href: "/services-informatiques/infrastructure/installation-starlink",
      },
      {
        label: "Couverture Wi-Fi pro",
        href: "/services-informatiques/infrastructure/reseau-wifi",
      },
      {
        label: "Maintenance sous contrat",
        href: "/services-informatiques/infrastructure/maintenance-contrat",
      },
      {
        label: "Site vitrine",
        href: "/services-informatiques/developpement/site-vitrine",
      },
      {
        label: "Site e-commerce",
        href: "/services-informatiques/developpement/site-ecommerce",
      },
      { label: "Obtenir un devis", href: "/devis", note: "Prix immédiat" },
    ],
    previews: [
      {
        image: "/media/portraits/logiciel-windows-11-pro.jpg",
        label: "Systèmes & postes",
        href: "/services-informatiques/systemes",
      },
      {
        image: "/media/portraits/reseau-starlink-stock.jpg",
        label: "Installation Starlink",
        href: "/services-informatiques/infrastructure/installation-starlink",
      },
      {
        image: "/media/portraits/reseau-wavlink-ax3000.jpg",
        label: "Couverture Wi-Fi",
        href: "/services-informatiques/infrastructure/reseau-wifi",
      },
      {
        image: "/media/portraits/logiciel-office-pro-plus-2024.jpg",
        label: "Suite bureautique",
        href: "/services-informatiques/systemes/suite-office",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    href: "/design-branding",
    intro: "Une identité qui tient debout partout.",
    links: [
      { label: "Notre approche", href: "/design-branding" },
      { label: "Création de logo", href: "/services-informatiques/identite/logo" },
      {
        label: "Charte graphique",
        href: "/services-informatiques/identite/charte-graphique",
      },
      {
        label: "Refonte d'identité",
        href: "/services-informatiques/identite/refonte-identite",
      },
      {
        label: "Flyers & affiches",
        href: "/services-informatiques/identite/flyers-affiches",
      },
      {
        label: "Cartes de visite",
        href: "/services-informatiques/identite/cartes-de-visite",
      },
      {
        label: "Signalétique & habillage",
        href: "/services-informatiques/identite/signaletique",
      },
      { label: "Prestations & tarifs", href: "/services-informatiques/identite" },
      { label: "Nos réalisations", href: "/realisations" },
    ],
    // Deux aperçus seulement : je n'ai pas de photo de travail graphique réel.
    // Padder avec une image de tablette pour « Création de logo » donnerait
    // exactement le décalage image/titre déjà reproché. À compléter dès que le
    // portfolio fournit de vrais visuels.
    previews: [
      {
        image: "/media/portraits/service-design-branding.jpg",
        label: "Notre approche",
        href: "/design-branding",
      },
      {
        image: "/media/portraits/ambiance-lampe-led-rgb.jpg",
        label: "Nos réalisations",
        href: "/realisations",
      },
    ],
  },
  {
    id: "transfert",
    label: "Transfert",
    href: "/transfert-argent",
    intro: "Envoyer, sans mauvaise surprise sur les frais.",
    links: [
      { label: "Envoyer de l'argent", href: "/transfert-argent", note: "Taux du jour" },
      { label: "Suivre un transfert", href: "/transfert-argent/suivi" },
      // Chaque canal ouvre directement son propre parcours. Cliquer sur
      // « MoneyGram » puis devoir rechoisir MoneyGram était une étape pour
      // rien : le choix est déjà fait au moment du clic.
      { label: "MoneyGram", href: "/transfert-argent/moneygram" },
      { label: "Orange Money", href: "/transfert-argent?service=orange-money" },
      {
        label: "Western Union",
        href: "/transfert-argent?service=western-union",
      },
    ],
    previews: [],
  },
  {
    id: "import",
    label: "Import & véhicules",
    href: "/transit-import",
    intro: "De Guangzhou à Bangui, suivi étape par étape.",
    links: [
      { label: "Fret Chine ↔ Bangui", href: "/transit-import" },
      { label: "Véhicules & motos", href: "/vehicules" },
      { label: "Suivre une expédition", href: "/transit-import/carte" },
      { label: "Pièces détachées auto", href: "/transit-import" },
      { label: "Électronique en gros", href: "/transit-import" },
      { label: "Mobilier & équipement", href: "/transit-import" },
      { label: "Demander un devis fret", href: "/transit-import", note: "Sur mesure" },
    ],
    previews: [
      {
        image: "/media/portraits/pilier-import.jpg",
        label: "Fret Chine ↔ Bangui",
        href: "/transit-import",
      },
      {
        image: "/media/vehicules/toyota-rav4-avant.jpg",
        label: "Toyota RAV4",
        href: "/vehicules",
      },
      {
        image: "/media/vehicules/landcruiser-prado-avant.jpg",
        label: "Land Cruiser Prado",
        href: "/vehicules",
      },
      {
        image: "/media/portraits/service-import-export.jpg",
        label: "Suivre une expédition",
        href: "/transit-import/carte",
      },
    ],
  },
  {
    id: "abonnements",
    label: "Abonnements",
    href: "/abonnements",
    intro: "Vos services préférés, activés en un instant.",
    links: [
      { label: "Netflix", href: "/abonnements/netflix", logo: "/media/logos/netflix.svg" },
      { label: "Amazon Prime", href: "/abonnements/amazon", logo: "/media/logos/primevideo.svg" },
      { label: "IPTV", href: "/abonnements/iptv", logo: "/media/logos/iptv.svg" },
      { label: "Spotify", href: "/abonnements/spotify", logo: "/media/logos/spotify.svg" },
      { label: "Apple Music", href: "/abonnements/applemusic", logo: "/media/logos/applemusic.svg" },
      { label: "Adobe Creative Cloud", href: "/abonnements/adobe", logo: "/media/logos/adobe.svg" },
      { label: "MyCanal", href: "/abonnements/mycanal", note: "Gratuit", logo: "/media/logos/canalplus.svg" },
      { label: "Starlink", href: "/abonnements/starlink", logo: "/media/logos/starlink.svg" },
      { label: "Disney+", href: "/abonnements/disneyplus", logo: "/media/logos/disneyplus.svg" },
      { label: "PlayStation Plus", href: "/abonnements/playstation", logo: "/media/logos/playstation.svg" },
      { label: "Xbox Game Pass", href: "/abonnements/xbox", logo: "/media/logos/xbox.svg" },
      { label: "Microsoft 365", href: "/abonnements/microsoft365", logo: "/media/logos/microsoft365.svg" },
      { label: "Crunchyroll", href: "/abonnements/crunchyroll", logo: "/media/logos/crunchyroll.svg" },
      { label: "Facebook", href: "/abonnements/facebook", note: "Meta Verified", logo: "/media/logos/facebook.svg" },
      { label: "Instagram", href: "/abonnements/instagram", note: "Meta Verified", logo: "/media/logos/instagram.svg" },
      { label: "WhatsApp", href: "/abonnements/whatsapp", note: "Meta Verified", logo: "/media/logos/whatsapp.svg" },
      { label: "iCloud+", href: "/abonnements/icloud", logo: "/media/logos/icloud.svg" },
      { label: "Snapchat+", href: "/abonnements/snapchat", logo: "/media/logos/snapchat.svg" },
    ],
    previews: [],
  },
  {
    id: "entreprise",
    label: "Entreprise",
    href: "/entreprise",
    intro: "Solutions sur mesure pour les professionnels, PME et ONG.",
    links: [
      { label: "Pour les PME", href: "/entreprise/pme" },
      { label: "Pour les ONG", href: "/entreprise/ong" },
      { label: "Demande de cotation", href: "/entreprise/cotation" },
      { label: "Traitement de cotation", href: "/entreprise/traitement-cotation" },
      { label: "Partenariat", href: "/entreprise/partenariat" },
      { label: "Fourniture de matériel pro", href: "/entreprise/fourniture" },
    ],
    previews: [
      {
        image: "/logo/cotation.png",
        label: "Demande de cotation",
        href: "/entreprise/cotation",
      },
      {
        image: "/logo/partenariat.png",
        label: "Partenariat",
        href: "/entreprise/partenariat",
      },
    ],
  },
] as const;
