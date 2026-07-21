/**
 * GÉNÉRATION DES ICÔNES DU SITE
 *
 * Le sigle est extrait de `public/brand/logo-full.png`, dont la gouttière
 * entre le symbole et le mot « CLEAN COMPUTER » a été relevée à la colonne 80
 * par analyse de densité. `logo-mark.png` n'est pas utilisé : son recadrage
 * coupe le début du mot, ce qui donnerait un favicon tronqué.
 *
 * FOND BLANC, PAS TRANSPARENT
 *
 * Le sigle est bleu marque sur transparent. Dans un onglet de navigateur en
 * thème sombre, du bleu foncé sur fond sombre devient illisible. Une pastille
 * blanche garantit le contraste dans les deux thèmes, au prix d'un carré
 * blanc en thème clair, ce qui ne se remarque pas.
 *
 * Usage : node scripts/generer-favicon.mjs
 */

import sharp from "sharp";
import { join, resolve } from "node:path";

const RACINE = resolve(import.meta.dirname, "..");
const SOURCE = join(RACINE, "public", "brand", "logo-full.png");
const APP = join(RACINE, "src", "app");

/** Colonne où s'arrête le symbole, relevée sur le profil de densité. */
const LARGEUR_SIGLE = 80;

/** Marge autour du sigle, en proportion du côté. Sans elle, le symbole touche
 *  le bord et paraît coupé une fois arrondi par le navigateur. */
const MARGE = 0.16;

async function generer() {
  // Deux passes, et non une seule chaînée : sharp refuse `extract` suivi de
  // `trim` dans le même pipeline (« bad extract area »), le recadrage n'étant
  // pas encore matérialisé quand le rognage calcule ses bornes.
  const { height: hauteurSource = 0 } = await sharp(SOURCE).metadata();

  const decoupe = await sharp(SOURCE)
    .extract({ left: 0, top: 0, width: LARGEUR_SIGLE, height: hauteurSource })
    .toBuffer();

  // Rogné au plus près de son encre, pour que la marge appliquée ensuite soit
  // réellement celle qu'on demande.
  const sigle = await sharp(decoupe).trim({ threshold: 10 }).toBuffer();

  const { width = 0, height = 0 } = await sharp(sigle).metadata();
  const cote = Math.max(width, height);

  for (const [nom, taille] of [
    ["icon.png", 512],
    ["apple-icon.png", 180],
  ]) {
    const interieur = Math.round(taille * (1 - MARGE * 2));
    const redimensionne = await sharp(sigle)
      .resize(interieur, interieur, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toBuffer();

    await sharp({
      create: {
        width: taille,
        height: taille,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([{ input: redimensionne, gravity: "center" }])
      .png()
      .toFile(join(APP, nom));

    console.log(`  ${nom.padEnd(16)} ${taille}×${taille}`);
  }

  console.log(
    `\nSigle source : ${width}×${height} px (carré de ${cote}), extrait des ${LARGEUR_SIGLE} premières colonnes.`,
  );
}

generer().catch((e) => {
  console.error("Échec :", e.message);
  process.exit(1);
});
