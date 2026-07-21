/**
 * CONTRÔLE DES MÉDIAS POUR LA PRODUCTION
 *
 * Le disque local (Windows, macOS) est INSENSIBLE À LA CASSE. Les serveurs de
 * production tournent sous Linux, qui y est sensible. Un chemin écrit
 * `/media/Logos/netflix.svg` alors que le dossier s'appelle `logos` fonctionne
 * parfaitement sur la machine du développeur et renvoie une 404 en ligne.
 *
 * C'est la cause numéro un des images qui « marchent chez moi » et disparaissent
 * une fois déployées. Aucun typecheck, aucun build ne la détecte : pour eux,
 * une image n'est qu'une chaîne de caractères.
 *
 * Ce script relit tous les chemins d'images du code source et les confronte au
 * disque en comparant OCTET PAR OCTET, comme le ferait Linux.
 *
 * Usage : node scripts/check-medias.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";

const RACINE = resolve(import.meta.dirname, "..");
const PUBLIC = join(RACINE, "public");
const SRC = join(RACINE, "src");

/** Formats que tout navigateur affiche sans discuter. */
const FORMATS_SURS = new Set([".jpg", ".jpeg", ".png", ".svg", ".webp", ".avif", ".gif"]);

/**
 * `.jfif` est un JPEG, mais son extension n'est pas reconnue par tous les
 * serveurs : beaucoup le servent en `application/octet-stream`, et le
 * navigateur refuse alors de l'afficher comme une image. L'optimiseur d'images
 * de Next ne le traite pas non plus de façon fiable.
 */
const FORMATS_RISQUES = new Set([".jfif", ".jfi", ".jpe", ".bmp", ".tif", ".tiff"]);

function fichiersSource(dir) {
  const sorties = [];
  for (const entree of readdirSync(dir)) {
    const chemin = join(dir, entree);
    if (statSync(chemin).isDirectory()) {
      sorties.push(...fichiersSource(chemin));
    } else if (/\.(ts|tsx|js|jsx|json|css)$/.test(entree)) {
      sorties.push(chemin);
    }
  }
  return sorties;
}

/** Vérifie qu'un chemin existe avec EXACTEMENT la même casse, segment par
 *  segment, comme le ferait un serveur Linux. */
function existeEnRespectantLaCasse(cheminRelatif) {
  const segments = cheminRelatif.split("/").filter(Boolean);
  let courant = PUBLIC;

  for (const segment of segments) {
    let entrees;
    try {
      entrees = readdirSync(courant);
    } catch {
      return { ok: false, attendu: segment, dans: courant };
    }
    if (!entrees.includes(segment)) {
      const approchant = entrees.find(
        (e) => e.toLowerCase() === segment.toLowerCase(),
      );
      return { ok: false, attendu: segment, trouve: approchant, dans: courant };
    }
    courant = join(courant, segment);
  }
  return { ok: true };
}

/* ─────────────────────────── collecte ─────────────────────────── */

const references = new Map(); // chemin -> [fichiers qui le citent]

for (const fichier of fichiersSource(SRC)) {
  const contenu = readFileSync(fichier, "utf8");
  const trouves = contenu.matchAll(
    /["'`](\/[^"'`\s)]+\.(?:jpe?g|png|svg|webp|avif|gif|jfif|jfi|bmp|tiff?))["'`]/gi,
  );
  for (const m of trouves) {
    const chemin = m[1];
    if (!references.has(chemin)) references.set(chemin, []);
    references.get(chemin).push(fichier.replace(RACINE + "\\", "").replace(/\\/g, "/"));
  }
}

/* ─────────────────────────── analyse ─────────────────────────── */

const absentes = [];
const casseFautive = [];
const formatRisque = [];
const avecEspace = [];
const avecAccent = [];

for (const [chemin, sources] of references) {
  const verdict = existeEnRespectantLaCasse(chemin);

  if (!verdict.ok) {
    if (verdict.trouve) {
      casseFautive.push({ chemin, attendu: verdict.attendu, reel: verdict.trouve, sources });
    } else {
      absentes.push({ chemin, sources });
    }
  }

  const ext = chemin.slice(chemin.lastIndexOf(".")).toLowerCase();
  if (FORMATS_RISQUES.has(ext)) formatRisque.push({ chemin, ext, sources });
  else if (!FORMATS_SURS.has(ext)) formatRisque.push({ chemin, ext, sources });

  if (/\s/.test(chemin)) avecEspace.push({ chemin, sources });
  // eslint-disable-next-line no-control-regex
  if (/[^\x00-\x7F]/.test(chemin)) avecAccent.push({ chemin, sources });
}

/* ─────────────────────────── rapport ─────────────────────────── */

function bloc(titre, entrees, ligne) {
  if (entrees.length === 0) return;
  console.log(`\n${titre} (${entrees.length})`);
  for (const e of entrees) {
    console.log(`  ${ligne(e)}`);
    for (const s of e.sources.slice(0, 2)) console.log(`      cité par ${s}`);
  }
}

console.log(`${references.size} chemins d'image référencés dans le code.`);

bloc("ABSENTES — 404 garantie en production", absentes, (e) => e.chemin);

bloc(
  "CASSE FAUTIVE — marche en local, 404 sous Linux",
  casseFautive,
  (e) => `${e.chemin}\n      le code écrit « ${e.attendu} », le disque contient « ${e.reel} »`,
);

bloc(
  "FORMAT À RISQUE — souvent servi en octet-stream, donc non affiché",
  formatRisque,
  (e) => `${e.chemin}  (${e.ext})`,
);

bloc("ESPACES dans le chemin — encodage fragile selon l'hébergeur", avecEspace, (e) => e.chemin);
bloc("CARACTÈRES ACCENTUÉS — encodage fragile selon l'hébergeur", avecAccent, (e) => e.chemin);

const total =
  absentes.length + casseFautive.length + formatRisque.length + avecEspace.length + avecAccent.length;

console.log(
  total === 0
    ? "\nAucun problème détecté sur les médias.\n"
    : `\n${total} point(s) à traiter avant déploiement.\n`,
);

// Seules les absences et les fautes de casse cassent réellement la page.
process.exit(absentes.length + casseFautive.length > 0 ? 1 : 0);
