/**
 * DEVISE — Franc CFA BEAC (XAF)
 *
 * Point unique de formatage monétaire du projet. Aucun autre fichier ne doit
 * formater un prix.
 *
 * Le XAF n'a pas de subdivision en circulation : tous les montants sont des
 * ENTIERS. Aucun flottant ne doit jamais représenter de l'argent ici — les
 * arrondis binaires sur des montants sont une source de bugs garantie.
 */

const XAF = new Intl.NumberFormat("fr-FR", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formate un montant entier en XAF.
 * @example formatXAF(125000) → "125 000 FCFA"
 */
export function formatXAF(amount: number): string {
  if (!Number.isFinite(amount)) return "— FCFA";
  return `${XAF.format(Math.round(amount))} FCFA`;
}

/**
 * Variante compacte pour les espaces contraints (cartes denses, puces).
 * @example formatXAFCompact(1250000) → "1,25 M FCFA"
 */
export function formatXAFCompact(amount: number): string {
  if (!Number.isFinite(amount)) return "—";
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const formatted = new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: millions < 10 ? 2 : 0,
    }).format(millions);
    return `${formatted} M FCFA`;
  }
  if (amount >= 10_000) {
    return `${XAF.format(Math.round(amount / 1000))} k FCFA`;
  }
  return formatXAF(amount);
}
