/**
 * CONTRÔLE DE LA NAVIGATION
 *
 * Deux vérifications qu'aucun typecheck ne fait :
 *   1. chaque `image` d'aperçu existe réellement sur le disque ;
 *   2. chaque `href` correspond à une route servie par l'App Router.
 *
 * Un lien de mega-menu qui renvoie une 404 ne casse pas la compilation. Il ne
 * se voit qu'au clic, donc en production, donc par le client.
 *
 * Usage : node scripts/check-navigation.mjs
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const RACINE = resolve(import.meta.dirname, "..");
const PUBLIC = join(RACINE, "public");
const APP = join(RACINE, "src", "app");

const source = readFileSync(
  join(RACINE, "src", "lib", "config", "navigation.ts"),
  "utf8",
);

const hrefs = [...source.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1]);
const images = [...source.matchAll(/image:\s*"([^"]+)"/g)].map((m) => m[1]);

/** Toutes les routes réelles, segments dynamiques compris. */
function collecterRoutes(dir, prefixe = "") {
  const routes = [];
  for (const entree of readdirSync(dir)) {
    const chemin = join(dir, entree);
    if (!statSync(chemin).isDirectory()) continue;
    // Les groupes (site) et (auth) n'apparaissent pas dans l'URL.
    const segment = /^\(.+\)$/.test(entree) ? "" : `/${entree}`;
    const suite = prefixe + segment;
    if (existsSync(join(chemin, "page.tsx"))) routes.push(suite || "/");
    routes.push(...collecterRoutes(chemin, suite));
  }
  return routes;
}

const routes = collecterRoutes(APP);

/** Un segment [xxx] accepte n'importe quelle valeur non vide. */
function routeExiste(href) {
  const chemin = (href.split("?")[0] || "/").replace(/\/$/, "") || "/";
  const parts = chemin.split("/").filter(Boolean);
  return routes.some((route) => {
    const attendus = route.split("/").filter(Boolean);
    if (attendus.length !== parts.length) return false;
    return attendus.every(
      (segment, i) => /^\[.+\]$/.test(segment) || segment === parts[i],
    );
  });
}

let problemes = 0;

for (const image of new Set(images)) {
  if (!existsSync(join(PUBLIC, image))) {
    console.error(`IMAGE ABSENTE   ${image}`);
    problemes++;
  }
}

for (const href of new Set(hrefs)) {
  if (href.startsWith("http") || href.startsWith("#")) continue;
  if (!routeExiste(href)) {
    console.error(`ROUTE ABSENTE   ${href}`);
    problemes++;
  }
}

const uniques = new Set(hrefs.filter((h) => !h.startsWith("http")));
console.log(
  `\n${hrefs.length} liens (${uniques.size} destinations distinctes), ` +
    `${new Set(images).size} images, ${routes.length} routes détectées.`,
);

if (problemes > 0) {
  console.error(`\n${problemes} problème(s).`);
  process.exit(1);
}
console.log("Navigation saine.");
