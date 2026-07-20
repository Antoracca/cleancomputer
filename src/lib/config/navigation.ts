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
      { label: "Audio", href: "/electronique/audio" },
      { label: "Charge & batteries", href: "/electronique/charge" },
      { label: "Réseau & Wi-Fi", href: "/electronique/reseau" },
      { label: "Périphériques", href: "/electronique/peripheriques" },
      { label: "Tablettes", href: "/electronique/tablettes" },
      { label: "Gaming", href: "/electronique/gaming" },
      { label: "Composants PC", href: "/electronique/composants" },
      { label: "Écrans & Moniteurs", href: "/electronique/ecrans" },
      { label: "Stockage & Disques", href: "/electronique/stockage" },
      { label: "Câbles & Adaptateurs", href: "/electronique/cables" },
      { label: "Accessoires Mobiles", href: "/electronique/mobiles" },
    ],
    previews: [
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
      { label: "Installation Windows", href: "/services-informatiques/systemes" },
      { label: "Installation Starlink", href: "/services-informatiques/infrastructure" },
      { label: "Récupération de données", href: "/services-informatiques/systemes" },
      { label: "Maintenance sous contrat", href: "/services-informatiques/infrastructure" },
      { label: "Couverture Wi-Fi pro", href: "/services-informatiques/infrastructure" },
      { label: "Obtenir un devis", href: "/devis", note: "Prix immédiat" },
    ],
    previews: [
      {
        image: "/media/portraits/logiciel-windows-11-pro.jpg",
        label: "Licences & systèmes",
        href: "/services-informatiques/systemes",
      },
      {
        image: "/media/portraits/logiciel-office-pro-plus-2024.jpg",
        label: "Suite bureautique",
        href: "/services-informatiques/systemes",
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
      { label: "Création de logo", href: "/services-informatiques/identite" },
      { label: "Charte graphique", href: "/services-informatiques/identite" },
      { label: "Refonte d'identité", href: "/services-informatiques/identite" },
      { label: "Flyers & affiches", href: "/services-informatiques/identite" },
      { label: "Cartes de visite", href: "/services-informatiques/identite" },
      { label: "Prestations & tarifs", href: "/services-informatiques/identite" },
      { label: "Nos réalisations", href: "/realisations" },
    ],
    previews: [
      {
        image: "/media/portraits/tablette-android-en-main.jpg",
        label: "Réalisations",
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
      { label: "MoneyGram", href: "/transfert-argent" },
      { label: "Orange Money", href: "/transfert-argent" },
      { label: "Western Union", href: "/transfert-argent" },
      { label: "Virement bancaire", href: "/transfert-argent" },
      { label: "Calculer les frais", href: "/transfert-argent", note: "Simulateur" },
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
        image: "/media/portraits/gaming-manette-gamesir-console.jpg",
        label: "Import direct",
        href: "/transit-import",
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
      { label: "Amazon Prime", href: "/abonnements/amazon", logo: "/media/logos/amazon.svg" },
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
] as const;
