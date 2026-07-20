/**
 * TRAITEMENT DES MÉDIAS
 *
 * Source : media/ (jamais modifiée)
 * Sortie : public/media/
 *
 * - Renomme les 20 images uniques selon docs/MEDIA-MANIFEST.md
 * - Génère un recadrage carré 1:1 pour les portraits circulaires du design system
 * - Prépare les vidéos hero : 10s, sans audio, WebM + MP4, poster
 *
 * Usage : node scripts/process-media.mjs
 */

import { execFile } from "node:child_process";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);

const SRC = path.resolve("media");
const OUT = path.resolve("public/media");

/** Mapping identification visuelle → nom de fichier cible. */
const IMAGES = {
  "audio-casque-soundcore-space-one": "WhatsApp Image 2026-07-19 at 12.25.38.jpeg",
  "audio-ecouteurs-soundcore-p30i": "WhatsApp Image 2026-07-19 at 12.25.40 (2).jpeg",
  "audio-ecouteurs-airpods-pro-2": "WhatsApp Image 2026-07-19 at 12.25.40 (7).jpeg",
  "charge-alimentation-starlink-packshot": "WhatsApp Image 2026-07-19 at 12.25.38 (1).jpeg",
  "charge-alimentation-starlink-boite": "WhatsApp Image 2026-07-19 at 12.25.40 (3).jpeg",
  "charge-ugreen-65w-gan": "WhatsApp Image 2026-07-19 at 12.25.40 (9).jpeg",
  "charge-ugreen-100w-5ports": "WhatsApp Image 2026-07-19 at 12.25.40 (12).jpeg",
  "charge-ugreen-powerbank-20000mah": "WhatsApp Image 2026-07-19 at 12.25.40 (11).jpeg",
  "charge-anker-gan-multiport": "WhatsApp Image 2026-07-19 at 12.25.41 (13).jpeg",
  "reseau-starlink-kit-deballe": "WhatsApp Image 2026-07-19 at 12.25.41.jpeg",
  "reseau-tenda-wifi6-a23": "WhatsApp Image 2026-07-19 at 12.25.40 (5).jpeg",
  "peripherique-logitech-mx-keys-mini": "WhatsApp Image 2026-07-19 at 12.25.40 (6).jpeg",
  "peripherique-logitech-mx-master-3s": "WhatsApp Image 2026-07-19 at 12.25.40 (13).jpeg",
  "logiciel-windows-11-pro": "WhatsApp Image 2026-07-19 at 12.25.40 (8).jpeg",
  "logiciel-office-pro-plus-2024": "WhatsApp Image 2026-07-19 at 12.25.40 (4).jpeg",
  "gaming-manette-sony-dualsense": "WhatsApp Image 2026-07-19 at 12.25.40 (10).jpeg",
  "gaming-manette-gamesir-console": "WhatsApp Image 2026-07-19 at 12.25.41 (15).jpeg",
  "tablette-nextbook-ares-8a": "WhatsApp Image 2026-07-19 at 12.25.41 (12).jpeg",
  "tablette-android-en-main": "WhatsApp Image 2026-07-19 at 12.25.41 (14).jpeg",
  "ambiance-lampe-led-rgb": "WhatsApp Image 2026-07-19 at 12.25.40 (14).jpeg",
};

/**
 * Vidéos hero — 16:9 natif uniquement.
 * ⚠️ Usage sous réserve d'autorisation : ce sont des contenus de marques tierces.
 * Voir docs/MEDIA-MANIFEST.md § 3.
 */
const HERO_VIDEOS = {
  "hero-laptop": "WhatsApp Video 2026-07-19 at 12.25.43 (1).mp4",
  "hero-camera": "WhatsApp Video 2026-07-19 at 12.25.43 (5).mp4",
};

async function processImages() {
  await mkdir(path.join(OUT, "produits"), { recursive: true });
  await mkdir(path.join(OUT, "portraits"), { recursive: true });

  for (const [name, source] of Object.entries(IMAGES)) {
    const input = path.join(SRC, source);

    // Image produit : largeur max 1400px, qualité élevée, métadonnées supprimées
    await sharp(input)
      .rotate()
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(OUT, "produits", `${name}.jpg`));

    // Portrait circulaire : carré 1:1 centré sur le sujet (attention haute —
    // les produits sont tenus en main dans le tiers supérieur du cadre)
    await sharp(input)
      .rotate()
      .resize(900, 900, { fit: "cover", position: "attention" })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(OUT, "portraits", `${name}.jpg`));

    console.log(`  image  ${name}`);
  }
}

async function processLogo() {
  await mkdir(path.join(OUT, "..", "brand"), { recursive: true });
  await copyFile(path.join(SRC, "logo.jpeg"), path.resolve("public/brand/logo-source.jpeg"));
  console.log("  logo   copié (vectorisation à faire — voir MEDIA-MANIFEST)");
}

async function processVideos() {
  await mkdir(path.join(OUT, "video"), { recursive: true });

  for (const [name, source] of Object.entries(HERO_VIDEOS)) {
    const input = path.join(SRC, source);
    const base = path.join(OUT, "video", name);

    // Poster : première frame utile, affichée immédiatement.
    // La vidéo ne fait que s'y substituer une fois chargée → aucun flash.
    await run("ffmpeg", [
      "-loglevel", "error", "-y", "-ss", "3", "-i", input,
      "-frames:v", "1", "-vf", "scale=1280:-2",
      `${base}-poster.jpg`,
    ]);

    // MP4 H.264 — compatibilité maximale, 10s, sans audio
    await run("ffmpeg", [
      "-loglevel", "error", "-y", "-ss", "3", "-t", "10", "-i", input,
      "-an", "-vf", "scale=1280:-2",
      "-c:v", "libx264", "-crf", "30", "-preset", "slow",
      "-movflags", "+faststart", "-pix_fmt", "yuv420p",
      `${base}.mp4`,
    ]);

    // WebM VP9 — plus léger là où il est supporté
    await run("ffmpeg", [
      "-loglevel", "error", "-y", "-ss", "3", "-t", "10", "-i", input,
      "-an", "-vf", "scale=1280:-2",
      "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0", "-row-mt", "1",
      `${base}.webm`,
    ]);

    console.log(`  video  ${name}`);
  }
}

console.log("Traitement des médias…");
await processImages();
await processLogo();
await processVideos();
console.log("Terminé.");
