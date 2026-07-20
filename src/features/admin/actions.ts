"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * ACTIONS D'ADMINISTRATION
 *
 * Elles utilisent la session de l'UTILISATEUR, pas la clé de service : ce sont
 * les politiques RLS (« commandes administrables », « produits administrables »)
 * qui autorisent ou refusent. Un non-admin qui appellerait ces actions
 * directement recevrait un refus de la base elle-même.
 */

const STATUTS_VALIDES = [
  "en_attente",
  "payee",
  "preparation",
  "expediee",
  "livree",
  "annulee",
] as const;

export async function changerStatutCommande(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const statut = String(formData.get("statut") ?? "");

  if (!id || !STATUTS_VALIDES.includes(statut as (typeof STATUTS_VALIDES)[number])) {
    return;
  }

  const supabase = await createClient();
  await supabase.from("commandes").update({ statut }).eq("id", id);

  revalidatePath("/admin/commandes");
  revalidatePath("/admin");
}

export async function changerStockProduit(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const stock = Math.floor(Number(formData.get("stock")));

  if (!slug || !Number.isFinite(stock) || stock < 0 || stock > 9999) return;

  const supabase = await createClient();
  await supabase.from("produits").update({ stock }).eq("slug", slug);

  revalidatePath("/admin/produits");
  // Le site public suit via l'ISR (60 s) — pas besoin d'invalidation ciblée.
}

export async function basculerProduitActif(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const actif = String(formData.get("actif")) === "true";

  if (!slug) return;

  const supabase = await createClient();
  await supabase.from("produits").update({ actif: !actif }).eq("slug", slug);

  revalidatePath("/admin/produits");
}
