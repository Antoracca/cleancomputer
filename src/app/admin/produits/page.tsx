import type { Metadata } from "next";
import Image from "next/image";
import { formatXAF } from "@/lib/format/currency";
import { createClient } from "@/lib/supabase/server";
import {
  basculerProduitActif,
  changerStockProduit,
} from "@/features/admin/actions";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Produits · Administration",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/**
 * GESTION DES PRODUITS
 *
 * Les deux gestes du quotidien : ajuster un stock, masquer un produit.
 * Chaque modification est visible sur le site public en moins d'une minute
 * (ISR 60 s). Formulaires purs — utilisables sans JavaScript.
 */
export default async function AdminProduitsPage() {
  const supabase = await createClient();

  const { data: produits } = await supabase
    .from("produits")
    .select("slug, nom, marque, categorie_slug, prix_xaf, stock, image, actif")
    .order("categorie_slug")
    .order("nom");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-display text-ink">Produits</h1>
        <p className="text-body text-graphite">
          Les modifications apparaissent sur le site en moins d&apos;une minute.
        </p>
      </div>

      <div className="overflow-x-auto rounded-frame border border-mist/60 bg-white">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-mist/60">
              <Th>Produit</Th>
              <Th>Catégorie</Th>
              <Th className="text-right">Prix</Th>
              <Th>Stock</Th>
              <Th>Visibilité</Th>
            </tr>
          </thead>
          <tbody>
            {(produits ?? []).map((produit) => (
              <tr
                key={produit.slug}
                className={cn(
                  "border-b border-mist/40 last:border-0",
                  !produit.actif && "opacity-50",
                )}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-ghost">
                      <Image
                        src={produit.image}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-ink">{produit.nom}</span>
                      <span className="text-[0.8125rem] text-slate">
                        {produit.marque}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-[0.875rem] text-graphite">
                  {produit.categorie_slug}
                </td>
                <td className="px-5 py-3 text-right text-ink tabular-nums">
                  {formatXAF(produit.prix_xaf)}
                </td>
                <td className="px-5 py-3">
                  <form action={changerStockProduit} className="flex items-center gap-2">
                    <input type="hidden" name="slug" value={produit.slug} />
                    <input
                      type="number"
                      name="stock"
                      defaultValue={produit.stock}
                      min={0}
                      max={9999}
                      aria-label={`Stock de ${produit.nom}`}
                      className={cn(
                        "min-h-10 w-20 rounded-pill border bg-white px-3 text-center text-[0.9375rem] tabular-nums",
                        produit.stock === 0 ? "border-danger text-danger" : "border-mist text-ink",
                      )}
                    />
                    <button
                      type="submit"
                      className="inline-flex min-h-10 items-center rounded-pill border border-mist px-3.5 text-[0.8125rem] font-medium text-graphite transition-colors hover:border-ink hover:text-ink"
                    >
                      OK
                    </button>
                  </form>
                </td>
                <td className="px-5 py-3">
                  <form action={basculerProduitActif}>
                    <input type="hidden" name="slug" value={produit.slug} />
                    <input type="hidden" name="actif" value={String(produit.actif)} />
                    <button
                      type="submit"
                      className={cn(
                        "inline-flex min-h-10 items-center rounded-pill px-4 text-[0.8125rem] font-bold tracking-[0.02em] uppercase transition-colors",
                        produit.actif
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : "bg-ghost text-slate hover:bg-mist/50",
                      )}
                    >
                      {produit.actif ? "En ligne" : "Masqué"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[0.8125rem] text-slate">
        L&apos;ajout de nouveaux produits et la modification des prix se font
        pour l&apos;instant via la base — l&apos;éditeur complet arrive.
      </p>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-5 py-3.5 text-eyebrow font-bold text-slate uppercase ${className}`}
    >
      {children}
    </th>
  );
}
