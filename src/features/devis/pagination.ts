/**
 * GÉOMÉTRIE ET PAGINATION DU DOCUMENT
 *
 * Le document est découpé en pages RÉELLES à l'écran, pas seulement à
 * l'impression. C'est ce qui garantit que l'aperçu et le PDF sont identiques :
 * on ne laisse pas le navigateur décider des coupures au dernier moment.
 *
 * Sans découpe explicite, une ligne de tableau tombant en bas de page se
 * retrouve à cheval sur le pied de page, ou coupée en deux. C'est le défaut
 * classique des devis générés à la va-vite, et il se voit immédiatement.
 *
 * Toutes les mesures sont en millimètres, unité du format A4. La conversion
 * en pixels ne sert qu'à comparer avec des hauteurs mesurées dans le DOM.
 */

/** A4 portrait. */
export const PAGE_MM = { largeur: 210, hauteur: 297 } as const;

/** Marges typographiques. 15 mm passe sur toutes les imprimantes courantes. */
export const MARGE_MM = 15;

/**
 * Repli pour l'en-tête de la page 1, tant qu'il n'a pas été mesuré.
 *
 * Sa hauteur RÉELLE varie : une adresse qui passe sur deux lignes, la mention
 * « à l'attention de », le NIU du client. La traiter comme fixe ferait croire
 * à la pagination qu'elle dispose de plus de place qu'en réalité, et le bas de
 * la page 1 serait rogné. Elle est donc mesurée, cette valeur ne sert qu'au
 * tout premier rendu.
 */
export const ENTETE_PAGE1_MM = 62;

/** Bandeau de rappel sur les pages 2 et suivantes. */
export const BANDEAU_SUITE_MM = 14;

/** Pied de page légal, page 1 uniquement (NIU, RCCM, mentions). */
export const PIED_LEGAL_MM = 26;

/** Pied minimal des pages suivantes : numéro de page seul. */
export const PIED_SUITE_MM = 12;

/** 96 dpi : l'unité de référence du CSS. */
const PX_PAR_MM = 96 / 25.4;

export function mmVersPx(mm: number): number {
  return mm * PX_PAR_MM;
}

export function pxVersMm(px: number): number {
  return px / PX_PAR_MM;
}

/**
 * Hauteur utile pour le contenu, selon le rang de la page.
 *
 * La page 1 porte l'en-tête complet et le pied légal, elle est donc la plus
 * courte. Les suivantes récupèrent la place, ce qui est exactement ce qu'on
 * veut : le tableau respire dès qu'il déborde.
 */
export function hauteurUtileMm(
  rangPage: number,
  enteteMesureeMm = ENTETE_PAGE1_MM,
): number {
  const chrome =
    rangPage === 0
      ? enteteMesureeMm + PIED_LEGAL_MM
      : BANDEAU_SUITE_MM + PIED_SUITE_MM;
  return PAGE_MM.hauteur - MARGE_MM * 2 - chrome;
}

/**
 * Répartit des blocs de hauteurs connues en pages.
 *
 * Chaque bloc est indivisible : c'est ce qui empêche une ligne de devis d'être
 * coupée en deux. Un bloc plus haut qu'une page entière est placé seul sur sa
 * page plutôt que de bloquer la répartition à l'infini.
 *
 * `reserveDerniereMm` réserve de la place sur la DERNIÈRE page pour le bloc
 * des totaux et la zone de signature. Sans cette réserve, les totaux
 * partiraient seuls sur une page supplémentaire presque vide, ce qui est le
 * défaut le plus visible d'un devis mal paginé.
 */
export function repartirEnPages(
  hauteursMm: readonly number[],
  reserveDerniereMm: number,
  enteteMesureeMm = ENTETE_PAGE1_MM,
): number[][] {
  if (hauteursMm.length === 0) return [[]];

  const pages: number[][] = [];
  let courante: number[] = [];
  let occupe = 0;
  let rang = 0;

  for (let i = 0; i < hauteursMm.length; i += 1) {
    const hauteur = hauteursMm[i] ?? 0;
    const dernierBloc = i === hauteursMm.length - 1;
    const disponible =
      hauteurUtileMm(rang, enteteMesureeMm) -
      (dernierBloc ? reserveDerniereMm : 0);

    // Le bloc ne rentre pas : on ferme la page, sauf si elle est déjà vide
    // (bloc plus haut qu'une page entière, on le laisse déborder seul).
    if (occupe + hauteur > disponible && courante.length > 0) {
      pages.push(courante);
      courante = [];
      occupe = 0;
      rang += 1;
    }

    courante.push(i);
    occupe += hauteur;
  }

  pages.push(courante);

  // Les totaux ne tiennent pas sous le dernier bloc : ils prennent leur propre
  // page. On l'assume plutôt que d'écrire par-dessus le pied de page.
  const derniereOccupation = (pages.at(-1) ?? []).reduce(
    (s, i) => s + (hauteursMm[i] ?? 0),
    0,
  );
  if (
    derniereOccupation + reserveDerniereMm >
    hauteurUtileMm(pages.length - 1, enteteMesureeMm)
  ) {
    pages.push([]);
  }

  return pages;
}
