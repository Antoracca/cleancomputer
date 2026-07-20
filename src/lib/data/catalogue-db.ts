import { createClient } from "@supabase/supabase-js";
import type { Produit } from "@/types/catalogue";
import { getProduit as getProduitStatique, getProduits as getProduitsStatiques } from "@/lib/data/produits";

/**
 * CATALOGUE — SOURCE SUPABASE
 *
 * Le catalogue vit désormais en base : un produit ajouté ou modifié dans le
 * panel admin apparaît sur le site sans redéploiement (ISR, revalidation 60 s).
 *
 * REPLI STATIQUE : si la base est injoignable (réseau, panne, quota), on sert
 * le catalogue statique plutôt qu'une page vide. À Bangui, un site marchand
 * qui affiche « erreur serveur » à cause d'une coupure est un site mort ;
 * un catalogue légèrement daté vaut infiniment mieux.
 *
 * Client sans session : ces requêtes tournent au build et dans l'ISR, où il
 * n'y a pas de cookies. La clé publiable suffit — la lecture du catalogue est
 * publique par politique RLS.
 */

type ProduitRow = {
  slug: string;
  nom: string;
  marque: string;
  categorie_slug: string | null;
  description: string;
  prix_xaf: number;
  prix_barre_xaf: number | null;
  stock: number;
  image: string;
  mis_en_avant: boolean;
  caracteristiques: string[] | null;
};

function supabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

function versProduit(row: ProduitRow): Produit {
  return {
    slug: row.slug,
    nom: row.nom,
    marque: row.marque,
    categorie: (row.categorie_slug ?? "audio") as Produit["categorie"],
    description: row.description,
    prixXaf: row.prix_xaf,
    ...(row.prix_barre_xaf !== null && { prixBarreXaf: row.prix_barre_xaf }),
    stock: row.stock,
    image: row.image,
    misEnAvant: row.mis_en_avant,
    caracteristiques: row.caracteristiques ?? [],
  };
}

export async function chargerProduits(
  categorie?: string,
): Promise<readonly Produit[]> {
  try {
    let query = supabasePublic()
      .from("produits")
      .select("*")
      .eq("actif", true)
      .order("mis_en_avant", { ascending: false })
      .order("nom");

    if (categorie) query = query.eq("categorie_slug", categorie);

    const { data, error } = await query;
    if (error || !data) throw error ?? new Error("réponse vide");

    return (data as ProduitRow[]).map(versProduit);
  } catch {
    return getProduitsStatiques(categorie);
  }
}

export async function chargerProduitsMisEnAvant(): Promise<readonly Produit[]> {
  try {
    const { data, error } = await supabasePublic()
      .from("produits")
      .select("*")
      .eq("actif", true)
      .eq("mis_en_avant", true)
      .gt("stock", 0)
      .order("nom");

    if (error || !data || data.length === 0) throw error ?? new Error("vide");
    return (data as ProduitRow[]).map(versProduit);
  } catch {
    return getProduitsStatiques().filter((p) => p.misEnAvant);
  }
}

export async function chargerProduit(slug: string): Promise<Produit | undefined> {
  try {
    const { data, error } = await supabasePublic()
      .from("produits")
      .select("*")
      .eq("slug", slug)
      .eq("actif", true)
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;

    return versProduit(data as ProduitRow);
  } catch {
    return getProduitStatique(slug);
  }
}
