/**
 * ABONNEMENTS
 *
 * Dix-huit services vendus sous forme d'abonnement activé par Clean Computer.
 * Le client paie en francs CFA à Bangui, nous activons le compte chez
 * l'éditeur. C'est un service d'intermédiation, pas une revente de licence.
 *
 * ⚠️ PRIX PROVISOIRES — TODO_TARIFS. Ordres de grandeur construits sur le
 * tarif public de chaque éditeur converti à environ 655 XAF pour 1 EUR, arrondi
 * au millier, majoré de la marge d'activation locale. Aucun de ces montants
 * n'a été confirmé par le client. À remplacer par la grille réelle avant mise
 * en ligne.
 *
 * Source unique : alimente la page d'index et les dix-huit fiches. Les slugs
 * sont ceux de src/lib/config/navigation.ts, bloc « abonnements ». Toute
 * divergence recrée les 404 que cette section corrige.
 *
 * Rappel devise : le XAF n'a pas de subdivision. Tous les montants sont des
 * ENTIERS, jamais de flottant.
 */

import { formatXAF } from "@/lib/format/currency";

export type CategorieAbonnement =
  | "streaming"
  | "musique"
  | "gaming"
  | "logiciel"
  | "reseaux"
  | "connectivite";

export type DureeFormule = "mois" | "trimestre" | "semestre" | "an";

export type Formule = {
  readonly nom: string;
  /** Montant entier en XAF. 0 signifie que la formule est réellement gratuite. */
  readonly prixXaf: number;
  readonly duree: DureeFormule;
  readonly inclus: readonly string[];
};

export type Abonnement = {
  readonly slug: string;
  readonly nom: string;
  readonly editeur: string;
  readonly logo: string;
  readonly categorie: CategorieAbonnement;
  readonly accroche: string;
  readonly description: string;
  readonly formules: readonly Formule[];
  readonly delaiActivation: string;
  readonly prerequis: readonly string[];
  /**
   * Programme commun à plusieurs fiches. Les trois déclinaisons de Meta
   * Verified partagent le même dispositif : le signaler évite de laisser
   * croire à trois offres distinctes.
   */
  readonly programme?: {
    readonly nom: string;
    readonly logo: string;
  };
};

export const DUREE_LABELS: Record<DureeFormule, string> = {
  mois: "par mois",
  trimestre: "pour 3 mois",
  semestre: "pour 6 mois",
  an: "pour 12 mois",
};

export type CategorieInfo = {
  readonly id: CategorieAbonnement;
  readonly nom: string;
  readonly intro: string;
};

/** L'ordre de ce tableau est l'ordre d'affichage de la page d'index. */
export const CATEGORIES: readonly CategorieInfo[] = [
  {
    id: "streaming",
    nom: "Vidéo & streaming",
    intro: "Séries, films, sport et animation, sur tous vos écrans.",
  },
  {
    id: "musique",
    nom: "Musique",
    intro: "Écoute illimitée, hors ligne, sans publicité.",
  },
  {
    id: "gaming",
    nom: "Jeu vidéo",
    intro: "Catalogues de jeux et parties en ligne sur console et PC.",
  },
  {
    id: "logiciel",
    nom: "Logiciels & stockage",
    intro: "Outils de création, bureautique et sauvegarde en ligne.",
  },
  {
    id: "reseaux",
    nom: "Réseaux sociaux",
    intro: "Certification de compte et fonctions avancées.",
  },
  {
    id: "connectivite",
    nom: "Connectivité",
    intro: "L'accès internet par satellite, facturé en francs CFA.",
  },
] as const;

/** Programme partagé par Facebook, Instagram et WhatsApp. */
const META_VERIFIED = {
  nom: "Meta Verified",
  logo: "/media/logos/meta.svg",
} as const;

const PREREQUIS_META: readonly string[] = [
  "Compte actif depuis au moins 30 jours",
  "Pièce d'identité au nom du compte",
  "Authentification à deux facteurs activée",
];

export const ABONNEMENTS: readonly Abonnement[] = [
  /* ─────────────────────────── Vidéo & streaming ─────────────────────────── */
  {
    slug: "netflix",
    nom: "Netflix",
    editeur: "Netflix",
    logo: "/media/logos/netflix.svg",
    categorie: "streaming",
    accroche: "Le catalogue au complet, payé en francs CFA.",
    description:
      "Vous n'avez pas besoin d'une carte bancaire internationale. Nous ouvrons ou rechargeons votre compte Netflix, vous réglez sur place et vous regardez le soir même.",
    formules: [
      {
        nom: "Essentiel avec publicité",
        prixXaf: 5000,
        duree: "mois",
        inclus: [
          "1 écran à la fois",
          "Qualité 1080p",
          "Coupures publicitaires courtes",
        ],
      },
      {
        nom: "Standard",
        prixXaf: 10000,
        duree: "mois",
        inclus: [
          "2 écrans en simultané",
          "Qualité 1080p sans publicité",
          "Téléchargement sur 2 appareils",
        ],
      },
      {
        nom: "Premium",
        prixXaf: 16000,
        duree: "mois",
        inclus: [
          "4 écrans en simultané",
          "Qualité 4K HDR et son spatial",
          "Téléchargement sur 6 appareils",
        ],
      },
    ],
    delaiActivation: "Moins de 2 heures en journée",
    prerequis: [
      "Une adresse email valide",
      "Connexion d'au moins 5 Mb/s pour la 1080p",
    ],
  },
  {
    slug: "amazon",
    nom: "Amazon Prime",
    editeur: "Amazon",
    logo: "/media/logos/primevideo.svg",
    categorie: "streaming",
    accroche: "Prime Video et les avantages Prime, sans carte étrangère.",
    description:
      "L'abonnement donne accès au catalogue Prime Video ainsi qu'aux avantages Prime sur les commandes. Utile si vous faites déjà venir du matériel par notre service d'import.",
    formules: [
      {
        nom: "Mensuel",
        prixXaf: 5000,
        duree: "mois",
        inclus: [
          "Prime Video en illimité",
          "3 appareils en simultané",
          "Résiliable chaque mois",
        ],
      },
      {
        nom: "Annuel",
        prixXaf: 45000,
        duree: "an",
        inclus: [
          "Douze mois d'accès",
          "Environ deux mois offerts sur le tarif mensuel",
          "Avantages Prime sur les commandes",
        ],
      },
    ],
    delaiActivation: "Moins de 2 heures en journée",
    prerequis: ["Une adresse email valide", "Un compte Amazon existant ou créé avec vous"],
  },
  {
    slug: "iptv",
    nom: "IPTV",
    editeur: "Bouquet partenaire",
    logo: "/media/logos/iptv.svg",
    categorie: "streaming",
    accroche: "Les chaînes et le sport en direct, sur box, TV ou téléphone.",
    description:
      "Un bouquet de chaînes internationales avec les compétitions en direct, livré avec l'application et le paramétrage sur votre appareil. Nous configurons la première installation avec vous.",
    formules: [
      {
        nom: "Découverte",
        prixXaf: 8000,
        duree: "mois",
        inclus: [
          "1 appareil connecté",
          "Chaînes générales et sport",
          "Guide des programmes intégré",
        ],
      },
      {
        nom: "Trimestre",
        prixXaf: 20000,
        duree: "trimestre",
        inclus: [
          "2 appareils connectés",
          "Replay sur 7 jours",
          "Assistance au paramétrage incluse",
        ],
      },
      {
        nom: "Année complète",
        prixXaf: 60000,
        duree: "an",
        inclus: [
          "3 appareils connectés",
          "Replay sur 7 jours",
          "Remplacement du lien en cas de coupure",
        ],
      },
    ],
    delaiActivation: "Sous 24 heures, paramétrage compris",
    prerequis: [
      "Connexion d'au moins 10 Mb/s pour la HD",
      "Box Android, Smart TV ou smartphone récent",
    ],
  },
  {
    slug: "mycanal",
    nom: "MyCanal",
    editeur: "Canal+",
    logo: "/media/logos/canalplus.svg",
    categorie: "streaming",
    accroche: "Canal+ en ligne, avec une offre d'entrée sans frais.",
    description:
      "MyCanal donne accès aux chaînes Canal+ auxquelles votre foyer est abonné, et à une sélection de contenus en clair pour tout le monde. Nous gérons l'activation et le rattachement des appareils.",
    formules: [
      {
        nom: "Accès en clair",
        prixXaf: 0,
        duree: "mois",
        inclus: [
          "Chaînes en clair et bandes-annonces",
          "Aucun engagement",
          "Création du compte assurée par nos soins",
        ],
      },
      {
        nom: "Séries & Cinéma",
        prixXaf: 15000,
        duree: "mois",
        inclus: [
          "Chaînes Canal+ cinéma et séries",
          "2 écrans en simultané",
          "Replay et téléchargement",
        ],
      },
      {
        nom: "Intégrale",
        prixXaf: 30000,
        duree: "mois",
        inclus: [
          "Tout le bouquet, sport compris",
          "4 écrans en simultané",
          "Qualité jusqu'à la 4K selon les programmes",
        ],
      },
    ],
    delaiActivation: "Moins de 2 heures en journée",
    prerequis: [
      "Une adresse email valide",
      "Un numéro de téléphone joignable pour la vérification",
    ],
  },
  {
    slug: "disneyplus",
    nom: "Disney+",
    editeur: "The Walt Disney Company",
    logo: "/media/logos/disneyplus.svg",
    categorie: "streaming",
    accroche: "Disney, Pixar, Marvel et Star sur un seul compte.",
    description:
      "Un catalogue familial, avec des profils enfants verrouillés et le téléchargement pour les trajets. L'activation se fait sur votre compte, vous en gardez la main.",
    formules: [
      {
        nom: "Standard avec publicité",
        prixXaf: 5000,
        duree: "mois",
        inclus: ["2 écrans en simultané", "Qualité 1080p", "Profils enfants"],
      },
      {
        nom: "Standard",
        prixXaf: 9000,
        duree: "mois",
        inclus: [
          "2 écrans en simultané",
          "Aucune publicité",
          "Téléchargement sur 10 appareils",
        ],
      },
      {
        nom: "Premium",
        prixXaf: 12000,
        duree: "mois",
        inclus: [
          "4 écrans en simultané",
          "Qualité 4K HDR et Dolby Atmos",
          "Téléchargement sur 10 appareils",
        ],
      },
    ],
    delaiActivation: "Moins de 2 heures en journée",
    prerequis: ["Une adresse email valide", "Connexion d'au moins 5 Mb/s"],
  },
  {
    slug: "crunchyroll",
    nom: "Crunchyroll",
    editeur: "Sony Pictures Entertainment",
    logo: "/media/logos/crunchyroll.svg",
    categorie: "streaming",
    accroche: "L'animation japonaise en simulcast, sans publicité.",
    description:
      "Les nouveaux épisodes arrivent quelques heures après leur diffusion au Japon, sous-titrés en français. Le catalogue de fond dépasse les mille séries.",
    formules: [
      {
        nom: "Fan",
        prixXaf: 5000,
        duree: "mois",
        inclus: [
          "1 écran à la fois",
          "Simulcast sans publicité",
          "Accès au catalogue complet",
        ],
      },
      {
        nom: "Mega Fan",
        prixXaf: 7000,
        duree: "mois",
        inclus: [
          "4 écrans en simultané",
          "Téléchargement hors ligne",
          "Accès anticipé aux billetteries d'événements",
        ],
      },
      {
        nom: "Mega Fan, année complète",
        prixXaf: 70000,
        duree: "an",
        inclus: [
          "Douze mois d'accès Mega Fan",
          "Environ deux mois offerts",
          "Téléchargement hors ligne",
        ],
      },
    ],
    delaiActivation: "Moins de 2 heures en journée",
    prerequis: ["Une adresse email valide"],
  },

  /* ────────────────────────────── Musique ────────────────────────────────── */
  {
    slug: "spotify",
    nom: "Spotify Premium",
    editeur: "Spotify",
    logo: "/media/logos/spotify.svg",
    categorie: "musique",
    accroche: "Toute la musique hors ligne, sans coupure publicitaire.",
    description:
      "Le mode hors ligne change tout à Bangui : vous téléchargez vos titres quand la connexion est bonne, vous écoutez ensuite sans consommer de données.",
    formules: [
      {
        nom: "Individuel",
        prixXaf: 8000,
        duree: "mois",
        inclus: [
          "1 compte Premium",
          "Téléchargement de 10 000 titres",
          "Qualité d'écoute élevée",
        ],
      },
      {
        nom: "Duo",
        prixXaf: 11000,
        duree: "mois",
        inclus: [
          "2 comptes Premium",
          "Playlist commune Duo Mix",
          "Même adresse de facturation requise",
        ],
      },
      {
        nom: "Famille",
        prixXaf: 14000,
        duree: "mois",
        inclus: [
          "6 comptes Premium",
          "Contrôle parental sur les paroles explicites",
          "Même adresse de facturation requise",
        ],
      },
    ],
    delaiActivation: "Moins de 2 heures en journée",
    prerequis: ["Une adresse email valide par compte"],
  },
  {
    slug: "applemusic",
    nom: "Apple Music",
    editeur: "Apple",
    logo: "/media/logos/applemusic.svg",
    categorie: "musique",
    accroche: "Cent millions de titres, en audio sans perte.",
    description:
      "L'intégration est totale sur iPhone, iPad et Mac, et l'application existe aussi sur Android. L'audio spatial fonctionne sur tous les écouteurs compatibles.",
    formules: [
      {
        nom: "Individuel",
        prixXaf: 8000,
        duree: "mois",
        inclus: [
          "1 compte",
          "Audio sans perte et audio spatial",
          "Téléchargement hors ligne",
        ],
      },
      {
        nom: "Famille",
        prixXaf: 13000,
        duree: "mois",
        inclus: [
          "6 comptes via le partage familial",
          "Bibliothèque personnelle pour chacun",
          "Audio sans perte inclus",
        ],
      },
      {
        nom: "Individuel, année complète",
        prixXaf: 80000,
        duree: "an",
        inclus: [
          "Douze mois d'accès individuel",
          "Environ deux mois offerts",
          "Aucun renouvellement à surveiller",
        ],
      },
    ],
    delaiActivation: "Moins de 2 heures en journée",
    prerequis: ["Un identifiant Apple actif"],
  },

  /* ───────────────────────────── Jeu vidéo ───────────────────────────────── */
  {
    slug: "playstation",
    nom: "PlayStation Plus",
    editeur: "Sony Interactive Entertainment",
    logo: "/media/logos/playstation.svg",
    categorie: "gaming",
    accroche: "Le jeu en ligne et un catalogue qui tourne chaque mois.",
    description:
      "Sans PlayStation Plus, le multijoueur en ligne est fermé sur PS4 et PS5. Les paliers supérieurs ajoutent un catalogue de plusieurs centaines de jeux à télécharger.",
    formules: [
      {
        nom: "Essential",
        prixXaf: 7000,
        duree: "mois",
        inclus: [
          "Multijoueur en ligne",
          "Jeux mensuels offerts",
          "Sauvegarde dans le cloud",
        ],
      },
      {
        nom: "Extra",
        prixXaf: 11000,
        duree: "mois",
        inclus: [
          "Tout le palier Essential",
          "Catalogue de jeux PS4 et PS5",
          "Téléchargement illimité pendant l'abonnement",
        ],
      },
      {
        nom: "Premium, année complète",
        prixXaf: 110000,
        duree: "an",
        inclus: [
          "Tout le palier Extra",
          "Catalogue classique et essais limités",
          "Douze mois sans renouvellement à gérer",
        ],
      },
    ],
    delaiActivation: "Sous 4 heures en journée",
    prerequis: [
      "Un compte PlayStation Network",
      "Une console PS4 ou PS5 reliée à internet",
    ],
  },
  {
    slug: "xbox",
    nom: "Xbox Game Pass",
    editeur: "Microsoft",
    logo: "/media/logos/xbox.svg",
    categorie: "gaming",
    accroche: "Des centaines de jeux, y compris le jour de leur sortie.",
    description:
      "Les productions Microsoft arrivent dans le catalogue dès leur sortie, sans achat supplémentaire. Le palier Ultimate couvre la console et le PC avec un seul abonnement.",
    formules: [
      {
        nom: "Core",
        prixXaf: 6000,
        duree: "mois",
        inclus: [
          "Multijoueur en ligne sur console",
          "Sélection de plus de 25 jeux",
          "Réductions réservées aux membres",
        ],
      },
      {
        nom: "PC Game Pass",
        prixXaf: 10000,
        duree: "mois",
        inclus: [
          "Catalogue complet sur PC Windows",
          "Nouveautés Microsoft dès leur sortie",
          "Application Xbox pour Windows",
        ],
      },
      {
        nom: "Ultimate",
        prixXaf: 15000,
        duree: "mois",
        inclus: [
          "Console et PC réunis",
          "Jeu en nuage sur mobile et navigateur",
          "Avantages EA Play inclus",
        ],
      },
    ],
    delaiActivation: "Sous 4 heures en journée",
    prerequis: [
      "Un compte Microsoft",
      "Une console Xbox ou un PC Windows 10 ou 11",
    ],
  },

  /* ─────────────────────── Logiciels & stockage ──────────────────────────── */
  {
    slug: "adobe",
    nom: "Adobe Creative Cloud",
    editeur: "Adobe",
    logo: "/media/logos/adobe.svg",
    categorie: "logiciel",
    accroche: "Photoshop, Illustrator et InDesign, en licence légale.",
    description:
      "Une licence authentique, mise à jour automatiquement, utilisable sur deux postes. C'est la même suite que nous utilisons pour les chartes graphiques que nous produisons.",
    formules: [
      {
        nom: "Application unique",
        prixXaf: 20000,
        duree: "mois",
        inclus: [
          "Un logiciel au choix",
          "100 Go de stockage en ligne",
          "Polices Adobe Fonts",
        ],
      },
      {
        nom: "Toutes les applications",
        prixXaf: 50000,
        duree: "mois",
        inclus: [
          "Plus de vingt logiciels",
          "100 Go de stockage en ligne",
          "Installation sur deux postes",
        ],
      },
      {
        nom: "Toutes les applications, année complète",
        prixXaf: 480000,
        duree: "an",
        inclus: [
          "Douze mois de suite complète",
          "Tarif figé sur l'année",
          "Facture au nom de l'entreprise sur demande",
        ],
      },
    ],
    delaiActivation: "Sous 24 heures, installation comprise",
    prerequis: [
      "Un Adobe ID",
      "Poste Windows 10 ou 11, ou macOS récent",
      "Environ 20 Go d'espace disque pour la suite complète",
    ],
  },
  {
    slug: "microsoft365",
    nom: "Microsoft 365",
    editeur: "Microsoft",
    logo: "/media/logos/microsoft365.svg",
    categorie: "logiciel",
    accroche: "Word, Excel et Outlook à jour, avec 1 To par personne.",
    description:
      "La suite installée sur le poste, pas seulement dans le navigateur. Le téraoctet OneDrive fait office de sauvegarde, ce qui règle la moitié des pertes de données que nous voyons en atelier.",
    formules: [
      {
        nom: "Personnel, mensuel",
        prixXaf: 7000,
        duree: "mois",
        inclus: [
          "1 personne, jusqu'à 5 appareils",
          "1 To de stockage OneDrive",
          "Word, Excel, PowerPoint et Outlook",
        ],
      },
      {
        nom: "Personnel, année complète",
        prixXaf: 70000,
        duree: "an",
        inclus: [
          "Douze mois pour une personne",
          "1 To de stockage OneDrive",
          "Mises à jour de version incluses",
        ],
      },
      {
        nom: "Famille, année complète",
        prixXaf: 95000,
        duree: "an",
        inclus: [
          "Jusqu'à 6 personnes",
          "1 To de stockage par personne",
          "Chacun garde son compte et ses fichiers",
        ],
      },
    ],
    delaiActivation: "Sous 24 heures, installation comprise",
    prerequis: [
      "Un compte Microsoft",
      "Poste Windows 10 ou 11, ou macOS récent",
    ],
  },
  {
    slug: "icloud",
    nom: "iCloud+",
    editeur: "Apple",
    logo: "/media/logos/icloud.svg",
    categorie: "logiciel",
    accroche: "De la place pour vos photos, et une sauvegarde qui tourne seule.",
    description:
      "Les 5 Go gratuits d'Apple sont saturés en quelques mois. iCloud+ rétablit la sauvegarde automatique de l'iPhone et ajoute le relais privé ainsi que les adresses email masquées.",
    formules: [
      {
        nom: "50 Go",
        prixXaf: 1000,
        duree: "mois",
        inclus: [
          "Sauvegarde automatique de l'iPhone",
          "Partage avec la famille",
          "Relais privé iCloud",
        ],
      },
      {
        nom: "200 Go",
        prixXaf: 2500,
        duree: "mois",
        inclus: [
          "Photothèque partagée",
          "Sauvegarde de plusieurs appareils",
          "Adresses email masquées",
        ],
      },
      {
        nom: "2 To",
        prixXaf: 8000,
        duree: "mois",
        inclus: [
          "Archivage vidéo confortable",
          "Partage familial jusqu'à 6 personnes",
          "Vidéo sécurisée HomeKit",
        ],
      },
    ],
    delaiActivation: "Moins de 2 heures en journée",
    prerequis: [
      "Un identifiant Apple actif",
      "iOS ou macOS à jour pour le relais privé",
    ],
  },

  /* ─────────────────────────── Réseaux sociaux ───────────────────────────── */
  {
    slug: "facebook",
    nom: "Facebook",
    editeur: "Meta",
    logo: "/media/logos/facebook.svg",
    categorie: "reseaux",
    accroche: "Le badge bleu sur votre page, et un support qui répond.",
    description:
      "Meta Verified certifie que la page vous appartient réellement. Pour un commerce, c'est surtout une protection contre les faux comptes qui vendent en votre nom.",
    programme: META_VERIFIED,
    formules: [
      {
        nom: "Meta Verified, mensuel",
        prixXaf: 12000,
        duree: "mois",
        inclus: [
          "Badge de vérification",
          "Protection contre l'usurpation de compte",
          "Assistance humaine prioritaire",
        ],
      },
      {
        nom: "Meta Verified, année complète",
        prixXaf: 130000,
        duree: "an",
        inclus: [
          "Douze mois de certification",
          "Visibilité renforcée dans les suggestions",
          "Aucun renouvellement mensuel à suivre",
        ],
      },
    ],
    delaiActivation: "48 à 72 heures, le temps de la vérification par Meta",
    prerequis: PREREQUIS_META,
  },
  {
    slug: "instagram",
    nom: "Instagram",
    editeur: "Meta",
    logo: "/media/logos/instagram.svg",
    categorie: "reseaux",
    accroche: "Un compte certifié, et des statistiques plus fines.",
    description:
      "Même programme que sur Facebook, appliqué au compte Instagram. La certification se rattache au profil vérifié, elle ne se transfère pas à un autre compte.",
    programme: META_VERIFIED,
    formules: [
      {
        nom: "Meta Verified, mensuel",
        prixXaf: 12000,
        duree: "mois",
        inclus: [
          "Badge de vérification",
          "Protection contre l'usurpation de compte",
          "Statistiques détaillées sur les publications",
        ],
      },
      {
        nom: "Meta Verified, année complète",
        prixXaf: 130000,
        duree: "an",
        inclus: [
          "Douze mois de certification",
          "Autocollants et fonctions exclusives",
          "Assistance humaine prioritaire",
        ],
      },
    ],
    delaiActivation: "48 à 72 heures, le temps de la vérification par Meta",
    prerequis: PREREQUIS_META,
  },
  {
    slug: "whatsapp",
    nom: "WhatsApp Business",
    editeur: "Meta",
    logo: "/media/logos/whatsapp.svg",
    categorie: "reseaux",
    accroche: "Le numéro de votre commerce, certifié auprès de vos clients.",
    description:
      "La certification lève le doute au moment où un client vous écrit pour la première fois. Le compte professionnel ajoute le catalogue produits et les réponses automatiques.",
    programme: META_VERIFIED,
    formules: [
      {
        nom: "Meta Verified, mensuel",
        prixXaf: 15000,
        duree: "mois",
        inclus: [
          "Badge de vérification sur le profil",
          "Catalogue produits et réponses rapides",
          "Assistance humaine prioritaire",
        ],
      },
      {
        nom: "Meta Verified, année complète",
        prixXaf: 160000,
        duree: "an",
        inclus: [
          "Douze mois de certification",
          "Jusqu'à 10 appareils reliés au même numéro",
          "Aucun renouvellement mensuel à suivre",
        ],
      },
    ],
    delaiActivation: "48 à 72 heures, le temps de la vérification par Meta",
    prerequis: [
      "Un numéro dédié à l'activité, joignable par SMS",
      "Application WhatsApp Business installée",
      "Pièce d'identité ou document d'entreprise",
    ],
  },
  {
    slug: "snapchat",
    nom: "Snapchat+",
    editeur: "Snap",
    logo: "/media/logos/snapchat.svg",
    categorie: "reseaux",
    accroche: "Les fonctions réservées aux abonnés, activées sur votre compte.",
    description:
      "Snapchat+ ajoute le badge, la personnalisation de l'icône et l'accès anticipé aux nouveautés. C'est l'abonnement le moins cher de la sélection.",
    formules: [
      {
        nom: "Mensuel",
        prixXaf: 3000,
        duree: "mois",
        inclus: [
          "Badge Snapchat+",
          "Icône d'application personnalisable",
          "Accès anticipé aux nouvelles fonctions",
        ],
      },
      {
        nom: "Année complète",
        prixXaf: 25000,
        duree: "an",
        inclus: [
          "Douze mois d'accès",
          "Environ deux mois offerts",
          "Fonctions de personnalisation étendues",
        ],
      },
    ],
    delaiActivation: "Moins de 2 heures en journée",
    prerequis: ["Un compte Snapchat actif", "Application à jour"],
  },

  /* ───────────────────────────── Connectivité ────────────────────────────── */
  {
    slug: "starlink",
    nom: "Starlink",
    editeur: "SpaceX",
    logo: "/media/logos/starlink.svg",
    categorie: "connectivite",
    accroche: "Internet par satellite, réglé sur place en francs CFA.",
    description:
      "Le service Starlink se paie normalement par carte bancaire internationale. Nous prenons en charge le renouvellement mensuel et vous réglez à Bangui. Le kit et la pose se commandent séparément.",
    formules: [
      {
        nom: "Résidentiel Lite",
        prixXaf: 45000,
        duree: "mois",
        inclus: [
          "Usage domestique à une adresse fixe",
          "Débit prioritaire en heures creuses",
          "Données non plafonnées",
        ],
      },
      {
        nom: "Résidentiel",
        prixXaf: 65000,
        duree: "mois",
        inclus: [
          "Débit prioritaire à toute heure",
          "Données non plafonnées",
          "Adapté au télétravail et à la visioconférence",
        ],
      },
      {
        nom: "Itinérance régionale",
        prixXaf: 120000,
        duree: "mois",
        inclus: [
          "Utilisation en déplacement dans la région",
          "Aucune adresse fixe imposée",
          "Adapté aux chantiers et aux missions",
        ],
      },
    ],
    delaiActivation: "Sous 24 heures une fois le kit enregistré",
    prerequis: [
      "Kit Starlink en votre possession",
      "Vue dégagée du ciel sans obstacle",
      "Alimentation électrique stable ou onduleur",
    ],
  },
] as const;

/**
 * Libellé monétaire d'une formule. Le seul cas particulier est la formule
 * réellement gratuite : afficher « 0 FCFA » y ressemblerait à un prix manquant.
 * Le formatage reste délégué à formatXAF, point unique du projet.
 */
export function libellePrixFormule(formule: Formule): string {
  return formule.prixXaf === 0 ? "Gratuit" : formatXAF(formule.prixXaf);
}

/** Retourne l'abonnement correspondant au slug, ou undefined. */
export function getAbonnement(slug: string): Abonnement | undefined {
  return ABONNEMENTS.find((a) => a.slug === slug);
}

/** Abonnements d'une catégorie, dans l'ordre de déclaration. */
export function getAbonnementsParCategorie(
  categorie: CategorieAbonnement,
): readonly Abonnement[] {
  return ABONNEMENTS.filter((a) => a.categorie === categorie);
}

/**
 * Autres abonnements de la même catégorie, pour le maillage en pied de fiche.
 */
export function getAbonnementsVoisins(slug: string): readonly Abonnement[] {
  const abonnement = getAbonnement(slug);
  if (!abonnement) return [];
  return ABONNEMENTS.filter(
    (a) => a.categorie === abonnement.categorie && a.slug !== slug,
  );
}

/** Formule la moins chère, utilisée pour l'affichage « à partir de ». */
export function getFormuleEntree(abonnement: Abonnement): Formule {
  return abonnement.formules.reduce((moins, formule) =>
    formule.prixXaf < moins.prixXaf ? formule : moins,
  );
}
