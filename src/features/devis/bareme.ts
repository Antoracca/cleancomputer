/**
 * BARÈME DU CONFIGURATEUR DE DEVIS
 *
 * ⚠️ PRIX PROVISOIRES — TODO_TARIFS. À remplacer par la grille réelle.
 *
 * Le barème est ENTIÈREMENT déclaratif : ajouter une option ou une étape ne
 * demande aucune modification de l'interface. Il migrera tel quel vers la
 * table `prestations` de Supabase, la structure étant déjà alignée.
 *
 * Tous les montants sont des ENTIERS en XAF.
 */

export type OptionDevis = {
  readonly id: string;
  readonly label: string;
  readonly detail?: string;
  /** Montant fixe ajouté au total. */
  readonly prixXaf?: number;
  /** Multiplicateur appliqué au total courant (1.3 = +30%). */
  readonly facteur?: number;
  /** Délai indicatif ajouté, en semaines. */
  readonly semaines?: number;
};

export type EtapeDevis = {
  readonly id: string;
  readonly titre: string;
  readonly question: string;
  readonly aide: string;
  /** `unique` = un seul choix, `multiple` = cases à cocher. */
  readonly mode: "unique" | "multiple";
  readonly options: readonly OptionDevis[];
};

export const ETAPES: readonly EtapeDevis[] = [
  {
    id: "type",
    titre: "Projet",
    question: "Qu'est-ce que vous voulez construire ?",
    aide: "C'est le socle du chiffrage. Tout le reste s'ajoute par-dessus.",
    mode: "unique",
    options: [
      {
        id: "vitrine",
        label: "Site vitrine",
        detail: "Présenter l'activité, être trouvable, recevoir des demandes.",
        prixXaf: 450000,
        semaines: 3,
      },
      {
        id: "ecommerce",
        label: "Site e-commerce",
        detail: "Vendre en ligne, encaisser, gérer les commandes.",
        prixXaf: 1250000,
        semaines: 8,
      },
      {
        id: "mobile",
        label: "Application mobile",
        detail: "Android et iOS, publiée sur les magasins.",
        prixXaf: 2200000,
        semaines: 12,
      },
      {
        id: "surmesure",
        label: "Application métier",
        detail: "Outil interne taillé pour votre façon de travailler.",
        prixXaf: 1800000,
        semaines: 10,
      },
    ],
  },
  {
    id: "perimetre",
    titre: "Périmètre",
    question: "Quelle taille, à peu près ?",
    aide: "Une estimation suffit. On ajustera ensemble.",
    mode: "unique",
    options: [
      { id: "compact", label: "Compact", detail: "Jusqu'à 5 écrans ou pages", prixXaf: 0 },
      { id: "standard", label: "Standard", detail: "6 à 15 écrans", prixXaf: 280000, semaines: 2 },
      { id: "large", label: "Large", detail: "Plus de 15 écrans", prixXaf: 650000, semaines: 4 },
    ],
  },
  {
    id: "fonctions",
    titre: "Fonctionnalités",
    question: "De quoi avez-vous besoin ?",
    aide: "Chaque option est chiffrée séparément. Cochez ce qui compte vraiment.",
    mode: "multiple",
    options: [
      {
        id: "paiement",
        label: "Paiement en ligne",
        detail: "Carte bancaire et Orange Money",
        prixXaf: 420000,
        semaines: 2,
      },
      {
        id: "comptes",
        label: "Comptes utilisateurs",
        detail: "Inscription, connexion, espace personnel",
        prixXaf: 280000,
        semaines: 2,
      },
      {
        id: "reservation",
        label: "Réservation ou rendez-vous",
        detail: "Calendrier et créneaux",
        prixXaf: 350000,
        semaines: 2,
      },
      {
        id: "admin",
        label: "Back-office de gestion",
        detail: "Pour modifier le contenu sans nous appeler",
        prixXaf: 480000,
        semaines: 3,
      },
      {
        id: "multilingue",
        label: "Deuxième langue",
        detail: "Anglais ou sango",
        prixXaf: 220000,
        semaines: 1,
      },
      {
        id: "notifications",
        label: "Notifications",
        detail: "Email et SMS automatiques",
        prixXaf: 180000,
        semaines: 1,
      },
      {
        id: "api",
        label: "Connexion à un outil existant",
        detail: "Logiciel de caisse, comptabilité, ERP",
        prixXaf: 520000,
        semaines: 3,
      },
    ],
  },
  {
    id: "identite",
    titre: "Identité",
    question: "Avez-vous déjà une identité visuelle ?",
    aide: "Un logo, des couleurs, une charte. Sinon, on la crée.",
    mode: "unique",
    options: [
      { id: "existante", label: "Oui, complète", detail: "Charte et fichiers sources disponibles", prixXaf: 0 },
      { id: "partielle", label: "Un logo seulement", detail: "On construit le reste autour", prixXaf: 195000, semaines: 2 },
      { id: "aucune", label: "Rien du tout", detail: "Création complète de l'identité", prixXaf: 425000, semaines: 4 },
    ],
  },
  {
    id: "delai",
    titre: "Délai",
    question: "Pour quand ?",
    aide: "Accélérer coûte plus cher : cela mobilise l'équipe en priorité.",
    mode: "unique",
    options: [
      { id: "standard", label: "Rythme normal", detail: "Le délai calculé ci-contre", facteur: 1 },
      { id: "accelere", label: "Accéléré", detail: "Environ un tiers de temps en moins", facteur: 1.3 },
      { id: "urgent", label: "Urgent", detail: "Priorité absolue sur les autres projets", facteur: 1.6 },
    ],
  },
  {
    id: "suivi",
    titre: "Après livraison",
    question: "Et une fois en ligne ?",
    aide: "Un site sans maintenance vieillit vite et devient vulnérable.",
    mode: "unique",
    options: [
      { id: "aucun", label: "Je gère moi-même", detail: "Sources et accès livrés, comme toujours", prixXaf: 0 },
      { id: "maintenance", label: "Maintenance annuelle", detail: "Sauvegardes, sécurité, 2 h d'évolution par mois", prixXaf: 540000 },
      { id: "complet", label: "Accompagnement complet", detail: "Maintenance, hébergement et évolutions prioritaires", prixXaf: 980000 },
    ],
  },
] as const;

export type Selection = Record<string, string[]>;

export type Chiffrage = {
  readonly totalXaf: number;
  readonly semaines: number;
  readonly lignes: readonly { label: string; montantXaf: number }[];
};

/**
 * Calcule le chiffrage à partir des sélections.
 *
 * Les montants FIXES s'additionnent d'abord, les FACTEURS s'appliquent ensuite
 * sur ce sous-total. L'ordre compte : appliquer une majoration d'urgence avant
 * d'avoir tout additionné donnerait un résultat différent — et faux.
 */
export function calculer(selection: Selection): Chiffrage {
  const lignes: { label: string; montantXaf: number }[] = [];
  let sousTotal = 0;
  let semaines = 0;
  const facteurs: { label: string; facteur: number }[] = [];

  for (const etape of ETAPES) {
    const choisis = selection[etape.id] ?? [];
    for (const optionId of choisis) {
      const option = etape.options.find((o) => o.id === optionId);
      if (!option) continue;

      if (option.semaines) semaines += option.semaines;

      if (option.facteur !== undefined && option.facteur !== 1) {
        facteurs.push({ label: option.label, facteur: option.facteur });
      } else if (option.prixXaf) {
        sousTotal += option.prixXaf;
        lignes.push({ label: option.label, montantXaf: option.prixXaf });
      }
    }
  }

  let total = sousTotal;
  for (const { label, facteur } of facteurs) {
    const supplement = Math.round(sousTotal * (facteur - 1));
    total += supplement;
    lignes.push({ label: `${label} (+${Math.round((facteur - 1) * 100)} %)`, montantXaf: supplement });
    semaines = Math.max(1, Math.round(semaines / facteur));
  }

  return { totalXaf: total, semaines, lignes };
}
