/**
 * CHIFFRES DE PREUVE SOCIALE
 *
 * ⚠️ VALEURS PROVISOIRES — À REMPLACER PAR LES CHIFFRES RÉELS DU CLIENT.
 *
 * Ces nombres sont des espaces réservés destinés à valider la mise en page et
 * l'animation de comptage. Ils ne doivent PAS partir en production tels quels :
 * afficher des statistiques inventées sur un site marchand est une allégation
 * commerciale trompeuse, et le premier client qui la vérifie perd confiance.
 *
 * Le client doit fournir : nombre de commandes livrées, de clients servis,
 * d'expéditions traitées, et l'année de démarrage réelle.
 *
 * Statut : TODO_CHIFFRES — bloquant Phase 6.
 */

export type ProofStat = {
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
  readonly detail: string;
};

export const PROOF_STATS: readonly ProofStat[] = [
  {
    value: 0,
    suffix: "",
    label: "Commandes livrées",
    detail: "À renseigner",
  },
  {
    value: 0,
    suffix: "",
    label: "Clients accompagnés",
    detail: "À renseigner",
  },
  {
    value: 0,
    suffix: "",
    label: "Expéditions Chine → Bangui",
    detail: "À renseigner",
  },
] as const;

/** Tant que les chiffres réels manquent, la section reste masquée. */
export const PROOF_READY = false;
