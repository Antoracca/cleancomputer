/**
 * TRAITEMENT DU SECOND LOT (public/media/Dexiemevague)
 *
 * 71 fichiers bruts → 54 uniques (43 images + 11 vidéos) après déduplication MD5.
 * Chaque fichier a été identifié VISUELLEMENT une par une avant d'être nommé ici.
 *
 * Sortie :
 *   public/media/produits/   image produit, 1400px de large
 *   public/media/portraits/  recadrage carré 1:1 pour les cercles du design system
 *   public/media/vehicules/  images véhicules, format paysage conservé
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("public/media/Dexiemevague");
const OUT = path.resolve("public/media");

/** Raccourci : les fichiers suffixés « (n) ». */
const j = (n) => `WhatsApp Image 2026-07-19 at 14.00.30 (${n}).jpeg`;
/** Les quatre fichiers sans suffixe numéroté. */
const A = "WhatsApp Image 2026-07-19 at 14.00.26.jpeg";
const A1 = "WhatsApp Image 2026-07-19 at 14.00.26 (1).jpeg";
const A2 = "WhatsApp Image 2026-07-19 at 14.00.26 (2).jpeg";
const B = "WhatsApp Image 2026-07-19 at 14.00.30.jpeg";

/* ---------------------------------------------------------------- PRODUITS */
const PRODUITS = {
  // Téléviseurs
  "tv-lg-uhd-43-carton": j(22),
  "tv-lg-uhd-43-allumee": j(15),
  "tv-samsung-crystal-55": j(21),
  // Ordinateurs
  "ordinateur-hp-bleu": j(42),
  "ordinateur-hp-argent": j(28),
  "ordinateur-macbook-pro": j(23),
  "ordinateur-portable-boite": j(31),
  // Tablettes
  "tablette-ipad-pro": j(56),
  "tablette-nextbook-ares-8a-v2": j(29),
  // Téléphones
  "telephone-galaxy-s25-ultra": j(45),
  "telephone-galaxy-s25-ultra-main": j(55),
  "telephone-galaxy-z-fold": j(47),
  "telephone-galaxy-z-fold-ouvert": j(16),
  "telephone-google-pixel": j(19),
  // Photo & vidéo
  "photo-insta360-ace-pro": j(18),
  "photo-dji-osmo-mobile-7": j(17),
  // Gaming
  "gaming-playstation-portal": j(53),
  // Réseau
  "reseau-wavlink-ax3000": j(40),
  "reseau-starlink-stock": j(48),
  // Accessoires
  "accessoire-station-accueil": j(30),
  // Boutique / ambiance
  "boutique-etagere-accessoires": j(32),
  "boutique-ecran-installation": j(54),
};

/* --------------------------------------------------------------- VÉHICULES */
const VEHICULES = {
  "toyota-rav4-avant": j(7),
  "toyota-rav4-arriere": j(9),
  "toyota-rav4-profil": j(8),
  "toyota-rav4-adventure": j(10),
  "toyota-rav4-arriere-2": j(5),
  "toyota-rav4-tableau-bord": j(3),
  "toyota-interieur-banquette": j(4),
  "landcruiser-prado-avant": j(14),
  "landcruiser-prado-arriere": j(11),
  "landcruiser-prado-profil": j(12),
  "landcruiser-interieur-volant": j(13),
  "landcruiser-interieur-sieges": j(6),
  "mercedes-gla-avant": A2,
  "mercedes-gla-arriere": j(1),
  "mercedes-interieur-volant": A,
  "mercedes-interieur-portiere": j(2),
  "mercedes-interieur-sieges": B,
  "mercedes-interieur-banquette": A1,
  "geely-suv-rouge": j(41),
};

/* -------- Portraits circulaires des piliers -------------------------------
   Règle : le visuel doit dire la même chose que le titre. Un powerbank pour
   « transfert d'argent » ou une manette pour « import Chine » ne raconte rien.
   Les deux piliers immatériels (design, transfert) n'ont pas d'équivalent
   photographiable en boutique → images Unsplash sous licence libre, déjà
   téléchargées séparément. */
const PORTRAITS_PILIERS = {
  "pilier-boutique": j(32), // étagère boutique garnie
  "pilier-services": j(23), // MacBook Pro — poste de travail
  "pilier-import": j(48), // cartons Starlink en stock — la logistique réelle
  "pilier-vehicules": j(14), // Land Cruiser Prado
};

async function produire(mapping, dossier, largeur, carre) {
  await mkdir(path.join(OUT, dossier), { recursive: true });
  const echecs = [];
  let ok = 0;

  for (const [nom, source] of Object.entries(mapping)) {
    try {
      const pipeline = sharp(path.join(SRC, source)).rotate();
      if (carre) {
        await pipeline
          .resize(1000, 1000, { fit: "cover", position: "attention" })
          .jpeg({ quality: 86, mozjpeg: true })
          .toFile(path.join(OUT, dossier, `${nom}.jpg`));
      } else {
        await pipeline
          .resize({ width: largeur, withoutEnlargement: true })
          .jpeg({ quality: 86, mozjpeg: true })
          .toFile(path.join(OUT, dossier, `${nom}.jpg`));
      }
      ok++;
    } catch {
      echecs.push(nom);
    }
  }
  console.log(`${dossier.padEnd(10)} ${ok} produits${echecs.length ? ` — ECHECS: ${echecs.join(", ")}` : ""}`);
}

console.log("Traitement du second lot…");
await produire(PRODUITS, "produits", 1400, false);
await produire(PRODUITS, "portraits", 0, true);
await produire(VEHICULES, "vehicules", 1600, false);
await produire(PORTRAITS_PILIERS, "portraits", 0, true);
console.log("Terminé.");
