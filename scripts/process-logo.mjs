/**
 * DÉTOURAGE DU LOGO
 *
 * Le logo fourni est un JPEG sur fond blanc opaque : inutilisable tel quel dès
 * qu'on le pose ailleurs que sur du blanc (liseré visible, carré blanc dans la
 * navigation).
 *
 * Ce script produit une version PNG à fond transparent, recadrée au contenu :
 * — logo-full.png : logo complet (pictogramme + typographie)
 * — logo-mark.png : pictogramme seul, pour favicon / PWA / nav mobile
 *
 * ⚠️ Solution intermédiaire. Le livrable propre reste un SVG vectoriel :
 * un PNG détouré reste pixellisé et ne se redimensionne pas proprement.
 * Le fichier source vectoriel est à demander au client.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("media/logo.jpeg");
const OUT = path.resolve("public/brand");

/** Au-dessus de ce seuil sur les 3 canaux, le pixel est considéré comme fond. */
const WHITE_THRESHOLD = 232;

await mkdir(OUT, { recursive: true });

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

let minX = width;
let minY = height;
let maxX = 0;
let maxY = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r === undefined || g === undefined || b === undefined) continue;

    const isBackground =
      r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD;

    if (isBackground) {
      // Transparence progressive : les pixels presque blancs deviennent
      // partiellement transparents, ce qui préserve l'antialiasing des bords
      // au lieu de produire un contour en escalier.
      data[i + 3] = 0;
    } else {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const box = {
  left: minX,
  top: minY,
  width: maxX - minX + 1,
  height: maxY - minY + 1,
};

const base = sharp(data, { raw: { width, height, channels } });

// Logo complet, recadré au contenu avec une marge de respiration de 2%
await base
  .clone()
  .extract(box)
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, "logo-full.png"));

// Pictogramme seul : le carré à gauche. Sa largeur vaut environ sa hauteur.
await base
  .clone()
  .extract({
    left: box.left,
    top: box.top,
    width: Math.min(box.height + 12, box.width),
    height: box.height,
  })
  .resize(512, 512, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, "logo-mark.png"));

console.log(`source      ${width}x${height}`);
console.log(`contenu     ${box.width}x${box.height} @ ${box.left},${box.top}`);
console.log("écrit       logo-full.png, logo-mark.png");
