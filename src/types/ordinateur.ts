/**
 * ORDINATEURS
 *
 * Type distinct de `Produit` : une machine se vend avec un état, un score de
 * santé et une galerie de plusieurs angles, ce qu'un accessoire n'a pas.
 *
 * Les références (`sku`) sont les codes HP réels lus sur les dossiers images.
 * Elles servent de clé de vérité : c'est ce qui permet de retrouver la fiche
 * constructeur exacte plutôt qu'un modèle approchant.
 */

export type EtatMachine = "neuf" | "quasi-neuf" | "occasion";

export type Ordinateur = {
  readonly slug: string;
  /** Référence constructeur exacte, telle qu'imprimée sous la machine. */
  readonly sku: string;
  readonly marque: string;
  readonly modele: string;
  readonly gamme: string;
  readonly accroche: string;
  readonly description: string;

  readonly etat: EtatMachine;
  /** Score d'état sur 10. Une machine neuve est à 10. */
  readonly sante: number;

  /** Montant ENTIER en XAF. */
  readonly prixXaf: number;
  readonly prixBarreXaf?: number;
  readonly stock: number;

  /** Chemins publics, dans l'ordre d'affichage de la galerie. */
  readonly images: readonly string[];

  readonly pointsCles: readonly string[];
  readonly specifications: Readonly<Record<string, string>>;

  /**
   * `true` seulement si les caractéristiques ont été confirmées sur une source
   * constructeur ou revendeur. Quand c'est `false`, l'interface annonce que la
   * fiche est en cours de vérification au lieu d'afficher des specs incertaines.
   */
  readonly specsVerifiees: boolean;
};

export const ETAT_LABELS: Record<EtatMachine, string> = {
  neuf: "Neuf",
  "quasi-neuf": "Quasi neuf",
  occasion: "Occasion",
};

export const ETAT_DESCRIPTIONS: Record<EtatMachine, string> = {
  neuf: "Jamais utilisé, scellé d'origine.",
  "quasi-neuf": "Très peu servi, aucune trace d'usage visible.",
  occasion: "Utilisé, testé et remis en état avant mise en vente.",
};

/** Couleur sémantique du score. Le seuil bas déclenche l'ambre, pas le rouge. */
export function tonSante(sante: number): "success" | "warning" | "danger" {
  if (sante >= 8) return "success";
  if (sante >= 5) return "warning";
  return "danger";
}
