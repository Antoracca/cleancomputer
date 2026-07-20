import Image from "next/image";
import Link from "next/link";
import { PriceTag } from "@/components/shared/PriceTag";
import { ProductCardActions } from "@/features/catalogue/ProductCardActions";
import type { Produit } from "@/types/catalogue";

/**
 * CARTE PRODUIT
 *
 * Rayon 20px, trait 1px, aucune ombre — la densité est autorisée dans le
 * catalogue, contrairement aux sections éditoriales qui respirent.
 *
 * Le statut de stock est affiché honnêtement : un catalogue qui montre du
 * matériel indisponible détruit la confiance plus vite qu'un catalogue court.
 */
export function ProductCard({ produit }: { produit: Produit }) {
  const enRupture = produit.stock === 0;
  const stockFaible = produit.stock > 0 && produit.stock <= 3;

  return (
    <Link
      href={`/electronique/p/${produit.slug}`}
      className="group/card relative flex h-full flex-col overflow-hidden rounded-action border border-mist/50 bg-white transition-colors duration-300 hover:border-ink"
    >
      <div className="relative aspect-square overflow-hidden bg-ghost">
        <Image
          src={produit.image}
          alt={produit.nom}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out-soft group-hover/card:scale-105"
        />

        {/* Les actions sont ancrées au bas de l'IMAGE, pas de la carte.
            Placées sur la carte, elles retombaient sur le bloc de texte et
            recouvraient le nom et le prix. */}
        <ProductCardActions produit={produit} />

        {enRupture ? (
          <span className="absolute top-3 left-3 rounded-pill bg-ink/90 px-3 py-1 text-[0.6875rem] font-bold tracking-[0.04em] text-frost uppercase">
            Rupture
          </span>
        ) : stockFaible ? (
          <span className="absolute top-3 left-3 rounded-pill bg-white px-3 py-1 text-[0.6875rem] font-bold tracking-[0.04em] text-warning uppercase">
            Dernières pièces
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-eyebrow text-slate uppercase">
          {produit.marque}
        </span>
        <span className="text-[1.0625rem] leading-snug font-medium tracking-[-0.02em] text-ink">
          {produit.nom}
        </span>
        <PriceTag
          amount={produit.prixXaf}
          strikeAmount={produit.prixBarreXaf}
          className="mt-auto pt-3"
        />
      </div>
    </Link>
  );
}
