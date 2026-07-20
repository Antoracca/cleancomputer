/**
 * PEUPLEMENT DE LA BASE
 *
 * Injecte les catégories et les produits dans Supabase à partir des mêmes
 * données que le catalogue statique.
 *
 * Prérequis : avoir exécuté supabase/schema.sql dans le SQL Editor.
 *
 * Usage : node scripts/seed.mjs
 *
 * Utilise la clé de service : elle contourne le RLS, ce qui est nécessaire
 * pour écrire dans des tables dont l'écriture est réservée aux administrateurs.
 * Ce script ne doit donc JAMAIS être exposé côté navigateur.
 *
 * Il est IDEMPOTENT (upsert sur la clé primaire) : le relancer met à jour
 * sans créer de doublon.
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

/* --- Chargement de .env.local (Node ne le fait pas tout seul) ------------- */
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("URL ou clé de service absente de .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

/* --- Données : importées depuis les modules TypeScript via une extraction
       simple, pour garder UNE seule source de vérité ----------------------- */
const source = readFileSync("src/lib/data/produits.ts", "utf8");
const categoriesSource = readFileSync("src/types/catalogue.ts", "utf8");

function extraireObjets(texte, champsRequis) {
  const objets = [];
  const blocs = texte.split(/\n  \{\n/).slice(1);
  for (const bloc of blocs) {
    const obj = {};
    for (const [cle, motif] of Object.entries(champsRequis)) {
      const m = bloc.match(motif);
      if (m) obj[cle] = m[1];
    }
    if (Object.keys(obj).length >= 2) objets.push(obj);
  }
  return objets;
}

const categories = extraireObjets(categoriesSource, {
  slug: /slug:\s*"([^"]+)"/,
  nom: /nom:\s*"([^"]+)"/,
  description: /description:\s*\n?\s*"([^"]+)"/,
}).map((c, i) => ({ ...c, ordre: i }));

const produits = extraireObjets(source, {
  slug: /slug:\s*"([^"]+)"/,
  nom: /nom:\s*"([^"]+)"/,
  marque: /marque:\s*"([^"]+)"/,
  categorie_slug: /categorie:\s*"([^"]+)"/,
  description: /description:\s*\n?\s*"([^"]+)"/,
  prix_xaf: /prixXaf:\s*(\d+)/,
  stock: /stock:\s*(\d+)/,
  image: /image:\s*"([^"]+)"/,
  mis_en_avant: /misEnAvant:\s*(true|false)/,
}).map((p) => ({
  ...p,
  prix_xaf: Number(p.prix_xaf),
  stock: Number(p.stock),
  mis_en_avant: p.mis_en_avant === "true",
}));

console.log(`Extrait : ${categories.length} catégories, ${produits.length} produits`);

if (categories.length === 0 || produits.length === 0) {
  console.error("Extraction vide — vérifier le format des fichiers source.");
  process.exit(1);
}

/* --- Injection ----------------------------------------------------------- */
const { error: errCat } = await supabase
  .from("categories")
  .upsert(categories, { onConflict: "slug" });

if (errCat) {
  // PostgREST renvoie plusieurs formulations selon qu'il s'agisse d'une table
  // absente ou d'un cache de schéma non rafraîchi. On couvre les deux.
  const tableAbsente =
    /does not exist|Could not find the table|schema cache|PGRST205/i.test(
      errCat.message,
    );

  if (tableAbsente) {
    console.error("\n→ Les tables n'existent pas encore.");
    console.error("  Ouvrez Supabase → SQL Editor, exécutez supabase/schema.sql,");
    console.error("  puis relancez : node scripts/seed.mjs");
  } else {
    console.error("Catégories :", errCat.message);
  }
  process.exit(1);
}
console.log(`  ${categories.length} catégories injectées`);

const { error: errProd } = await supabase
  .from("produits")
  .upsert(produits, { onConflict: "slug" });

if (errProd) {
  console.error("Produits :", errProd.message);
  process.exit(1);
}
console.log(`  ${produits.length} produits injectés`);

console.log("\nTerminé.");
