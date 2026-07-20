/**
 * PRESTATIONS DE SERVICE
 *
 * Regroupement demandé par le client : « diviser tout ça en sous-services,
 * pour regrouper sous un seul angle, l'angle service ».
 *
 * ⚠️ PRIX PROVISOIRES — TODO_TARIFS. Ordres de grandeur pour valider la mise
 * en page et le configurateur de devis. À remplacer par la grille réelle.
 *
 * Source unique : alimente la page famille, la fiche prestation ET le
 * configurateur de devis. Une prestation ajoutée ici apparaît partout.
 */

export type Unite = "forfait" | "jour" | "poste" | "mois" | "an";

export type Prestation = {
  readonly slug: string;
  readonly nom: string;
  readonly description: string;
  readonly prixBaseXaf: number;
  readonly unite: Unite;
  readonly delai: string;
  readonly inclus: readonly string[];
};

export type FamilleService = {
  readonly slug: string;
  readonly nom: string;
  readonly accroche: string;
  readonly probleme: string;
  readonly image: string;
  readonly audience: "particuliers" | "professionnels" | "mixte";
  readonly prestations: readonly Prestation[];
};

export const UNITE_LABELS: Record<Unite, string> = {
  forfait: "au forfait",
  jour: "par jour",
  poste: "par poste",
  mois: "par mois",
  an: "par an",
};

export const FAMILLES: readonly FamilleService[] = [
  {
    slug: "systemes",
    nom: "Systèmes & postes",
    accroche: "Un poste qui démarre vite et qui reste propre.",
    probleme:
      "Un ordinateur qui rame, une licence expirée, un système jamais mis à jour : ce sont des heures perdues chaque semaine, et des données qui finissent par disparaître.",
    image: "/media/portraits/logiciel-windows-11-pro.jpg",
    audience: "mixte",
    prestations: [
      {
        slug: "installation-windows",
        nom: "Installation Windows 11 Pro",
        description:
          "Installation propre, pilotes à jour, licence authentique fournie et activée.",
        prixBaseXaf: 25000,
        unite: "poste",
        delai: "Sous 24 h",
        inclus: ["Licence authentique", "Pilotes à jour", "Sauvegarde préalable"],
      },
      {
        slug: "suite-office",
        nom: "Microsoft Office Professional Plus",
        description:
          "Licence Office installée et activée, avec prise en main des outils.",
        prixBaseXaf: 45000,
        unite: "poste",
        delai: "Sous 24 h",
        inclus: ["Word, Excel, PowerPoint", "Licence perpétuelle", "Prise en main"],
      },
      {
        slug: "optimisation",
        nom: "Nettoyage & optimisation",
        description:
          "Diagnostic complet, suppression des logiciels parasites, remise en état des performances.",
        prixBaseXaf: 15000,
        unite: "poste",
        delai: "Sous 48 h",
        inclus: ["Diagnostic écrit", "Nettoyage complet", "Rapport de santé"],
      },
      {
        slug: "recuperation-donnees",
        nom: "Récupération de données",
        description:
          "Tentative de récupération sur disque défaillant ou fichiers supprimés. Devis après diagnostic.",
        prixBaseXaf: 35000,
        unite: "forfait",
        delai: "2 à 5 jours",
        inclus: ["Diagnostic préalable", "Sans récupération, sans frais", "Restitution sur support"],
      },
    ],
  },
  {
    slug: "infrastructure",
    nom: "Infrastructure",
    accroche: "Le réseau qui tient, même quand tout le monde est connecté.",
    probleme:
      "Une connexion qui tombe en pleine réunion, un Wi-Fi qui ne couvre pas la moitié des bureaux, aucune sauvegarde : l'infrastructure ne se voit que lorsqu'elle lâche.",
    image: "/media/portraits/reseau-starlink-kit-deballe.jpg",
    audience: "professionnels",
    prestations: [
      {
        slug: "installation-starlink",
        nom: "Installation Starlink",
        description:
          "Pose de l'antenne, orientation, configuration du routeur et test de débit.",
        prixBaseXaf: 85000,
        unite: "forfait",
        delai: "1 journée",
        inclus: ["Pose et orientation", "Configuration réseau", "Test de débit signé"],
      },
      {
        slug: "reseau-wifi",
        nom: "Couverture Wi-Fi professionnelle",
        description:
          "Étude de couverture, pose des bornes, segmentation invité et personnel.",
        prixBaseXaf: 120000,
        unite: "forfait",
        delai: "2 à 3 jours",
        inclus: ["Étude de couverture", "Réseau invité séparé", "Plan de câblage"],
      },
      {
        slug: "parc-informatique",
        nom: "Gestion de parc informatique",
        description:
          "Inventaire, standardisation des postes, suivi des licences et des garanties.",
        prixBaseXaf: 15000,
        unite: "poste",
        delai: "Selon volume",
        inclus: ["Inventaire complet", "Suivi des licences", "Tableau de bord"],
      },
      {
        slug: "maintenance-contrat",
        nom: "Maintenance sous contrat",
        description:
          "Intervention prioritaire, maintenance préventive, délai de prise en charge garanti.",
        prixBaseXaf: 75000,
        unite: "mois",
        delai: "Prise en charge sous 4 h",
        inclus: ["Intervention prioritaire", "Préventif trimestriel", "Rapport mensuel"],
      },
    ],
  },
  {
    slug: "developpement",
    nom: "Développement",
    accroche: "Un site ou une application qui vous appartient vraiment.",
    probleme:
      "Un site livré sans les accès, impossible à modifier, qui met huit secondes à charger sur un téléphone : c'est le sort de la plupart des sites vitrines du marché.",
    image: "/media/portraits/tablette-android-en-main.jpg",
    audience: "professionnels",
    prestations: [
      {
        slug: "site-vitrine",
        nom: "Site vitrine",
        description:
          "Site de présentation rapide et adapté au mobile, avec formulaire de contact.",
        prixBaseXaf: 450000,
        unite: "forfait",
        delai: "2 à 3 semaines",
        inclus: ["Jusqu'à 6 pages", "Adapté mobile", "Accès et sources livrés"],
      },
      {
        slug: "site-ecommerce",
        nom: "Site e-commerce",
        description:
          "Boutique complète : catalogue, panier, paiement en ligne et back-office.",
        prixBaseXaf: 1250000,
        unite: "forfait",
        delai: "6 à 10 semaines",
        inclus: ["Paiement carte et Orange Money", "Back-office", "Formation incluse"],
      },
      {
        slug: "application-mobile",
        nom: "Application mobile",
        description:
          "Application Android et iOS à partir d'une base commune, publiée sur les magasins.",
        prixBaseXaf: 2200000,
        unite: "forfait",
        delai: "8 à 14 semaines",
        inclus: ["Android et iOS", "Publication sur les stores", "Sources livrées"],
      },
      {
        slug: "maintenance-site",
        nom: "Maintenance & évolution",
        description:
          "Mises à jour de sécurité, sauvegardes, petites évolutions mensuelles.",
        prixBaseXaf: 45000,
        unite: "mois",
        delai: "Continu",
        inclus: ["Sauvegardes", "Mises à jour de sécurité", "2 h d'évolution par mois"],
      },
    ],
  },
  {
    slug: "identite",
    nom: "Identité & communication",
    accroche: "Une marque reconnaissable, jusque sur une facture.",
    probleme:
      "Un logo différent sur chaque support, des couleurs qui changent d'un document à l'autre, une adresse email en @gmail : l'entreprise paraît plus petite qu'elle ne l'est.",
    image: "/media/portraits/ambiance-lampe-led-rgb.jpg",
    audience: "professionnels",
    prestations: [
      {
        slug: "logo",
        nom: "Création de logo",
        description:
          "Trois pistes créatives, deux tours de retouches, fichiers sources livrés.",
        prixBaseXaf: 175000,
        unite: "forfait",
        delai: "1 à 2 semaines",
        inclus: ["3 pistes", "Fichiers vectoriels", "Déclinaisons noir et blanc"],
      },
      {
        slug: "charte-graphique",
        nom: "Charte graphique complète",
        description:
          "Logo, palette, typographies, règles d'usage et modèles de documents.",
        prixBaseXaf: 425000,
        unite: "forfait",
        delai: "3 à 4 semaines",
        inclus: ["Document de charte", "Modèles bureautiques", "Kit réseaux sociaux"],
      },
      {
        slug: "refonte-identite",
        nom: "Refonte d'identité",
        description:
          "Modernisation d'une identité existante, sans perdre ce qui vous rend reconnaissable.",
        prixBaseXaf: 350000,
        unite: "forfait",
        delai: "3 à 5 semaines",
        inclus: ["Audit de l'existant", "Transition progressive", "Guide de migration"],
      },
      {
        slug: "email-professionnel",
        nom: "Boîtes mail professionnelles",
        description:
          "Adresses à votre nom de domaine, alias, redirections et signatures unifiées.",
        prixBaseXaf: 12000,
        unite: "an",
        delai: "Sous 48 h",
        inclus: ["Nom de domaine", "Alias illimités", "Configuration sur mobile"],
      },
    ],
  },
] as const;

export function getFamille(slug: string): FamilleService | undefined {
  return FAMILLES.find((f) => f.slug === slug);
}

export function getToutesPrestations(): readonly Prestation[] {
  return FAMILLES.flatMap((f) => f.prestations);
}
