/**
 * CONTRÔLE DE LA PAGINATION DU DEVIS
 *
 * La répartition en pages est purement fonctionnelle : on peut donc la
 * vérifier sans navigateur. C'est la pièce la plus risquée du document, celle
 * qui produit les défauts les plus visibles quand elle se trompe (ligne
 * coupée, texte sur le pied de page, page blanche).
 *
 * Usage : node --experimental-strip-types scripts/test-pagination.mts
 */

import {
  hauteurUtileMm,
  repartirEnPages,
} from "../src/features/devis/pagination.ts";

let echecs = 0;

function verifier(intitule: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ok    ${intitule}`);
  } else {
    echecs += 1;
    console.error(`  ECHEC ${intitule}${detail ? ` — ${detail}` : ""}`);
  }
}

const RESERVE = 78;
const ENTETE = 62;

console.log("\nGéométrie");
{
  const p0 = hauteurUtileMm(0, ENTETE);
  const p1 = hauteurUtileMm(1, ENTETE);
  verifier("la page 1 est plus courte que les suivantes", p1 > p0, `${p0} vs ${p1}`);
  verifier("les deux hauteurs sont positives", p0 > 0 && p1 > 0, `${p0} / ${p1}`);
}

console.log("\nRépartition");
{
  const pages = repartirEnPages([], RESERVE, ENTETE);
  verifier("un devis vide donne une page", pages.length === 1);
}
{
  // Trois lignes courtes : tout tient sur la page 1 avec la réserve totaux.
  const pages = repartirEnPages([8, 8, 8], RESERVE, ENTETE);
  verifier("trois lignes courtes tiennent sur une page", pages.length === 1,
    `${pages.length} pages`);
}
{
  // Assez de lignes pour déborder largement.
  const lignes = Array.from({ length: 40 }, () => 10);
  const pages = repartirEnPages(lignes, RESERVE, ENTETE);
  verifier("quarante lignes débordent sur plusieurs pages", pages.length > 1,
    `${pages.length} pages`);

  const total = pages.reduce((s, p) => s + p.length, 0);
  verifier("aucune ligne n'est perdue", total === 40, `${total} sur 40`);

  const indices = pages.flat();
  const ordonne = indices.every((v, i) => v === i);
  verifier("l'ordre des lignes est préservé", ordonne);
}
{
  // AUCUNE page ne doit dépasser sa hauteur utile : c'est la garantie qu'aucun
  // texte n'écrase le pied de page.
  const lignes = Array.from({ length: 60 }, (_, i) => (i % 5 === 0 ? 26 : 9));
  const pages = repartirEnPages(lignes, RESERVE, ENTETE);

  let debordement = "";
  pages.forEach((page, rang) => {
    const occupe = page.reduce((s, i) => s + (lignes[i] ?? 0), 0);
    const derniere = rang === pages.length - 1;
    const dispo = hauteurUtileMm(rang, ENTETE) - (derniere ? RESERVE : 0);
    // Une page d'un seul bloc plus haut que la page est tolérée : le bloc ne
    // peut pas être coupé, il déborde seul. Aucun de nos blocs n'est dans ce
    // cas ici.
    if (occupe > dispo + 0.01 && page.length > 1) {
      debordement = `page ${rang + 1} : ${occupe.toFixed(1)} > ${dispo.toFixed(1)} mm`;
    }
  });
  verifier("aucune page ne déborde de sa hauteur utile", !debordement, debordement);
}
{
  // Un bloc plus haut qu'une page entière ne doit pas boucler à l'infini.
  const pages = repartirEnPages([500, 10], RESERVE, ENTETE);
  verifier("un bloc géant ne bloque pas la répartition", pages.flat().length === 2,
    `${pages.flat().length} blocs placés`);
}
{
  // Les totaux ne doivent jamais chevaucher la dernière ligne.
  const lignes = Array.from({ length: 18 }, () => 10);
  const pages = repartirEnPages(lignes, RESERVE, ENTETE);
  const derniere = pages.at(-1) ?? [];
  const occupe = derniere.reduce((s, i) => s + (lignes[i] ?? 0), 0);
  const dispo = hauteurUtileMm(pages.length - 1, ENTETE);
  verifier(
    "la réserve des totaux tient sur la dernière page",
    occupe + RESERVE <= dispo + 0.01,
    `${(occupe + RESERVE).toFixed(1)} > ${dispo.toFixed(1)} mm`,
  );
}

console.log(
  echecs === 0
    ? "\nPagination saine.\n"
    : `\n${echecs} échec(s).\n`,
);
process.exit(echecs === 0 ? 0 : 1);
