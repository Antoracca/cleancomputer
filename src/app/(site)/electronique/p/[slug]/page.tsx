import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { PriceTag } from "@/components/shared/PriceTag";
import { ProductCard } from "@/components/shared/ProductCard";
import { AddToCart } from "@/features/panier/AddToCart";
import { chargerProduit, chargerProduits } from "@/lib/data/catalogue-db";
import { PRODUITS } from "@/lib/data/produits";
import { getCategorie } from "@/types/catalogue";

/**
 * ISR 60 s : un prix ou un stock modifié dans le panel admin apparaît ici en
 * moins d'une minute, sans redéploiement. Les produits ajoutés en base après
 * la construction sont rendus à la demande (dynamicParams par défaut).
 */
export const revalidate = 60;

export function generateStaticParams() {
  return PRODUITS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produit = await chargerProduit(slug);
  if (!produit) return { title: "Produit introuvable" };

  return {
    title: produit.nom,
    description: produit.description,
    openGraph: { images: [produit.image] },
  };
}

export default async function ProduitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produit = await chargerProduit(slug);
  if (!produit) notFound();

  const categorie = getCategorie(produit.categorie);
  const similaires = (await chargerProduits(produit.categorie))
    .filter((p) => p.slug !== produit.slug)
    .slice(0, 4);

  const enRupture = produit.stock === 0;

  return (
    <>
      <Container className="pt-32 pb-32 md:pt-40">
        <Link
          href={`/electronique/${produit.categorie}`}
          className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-graphite transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden />
          {categorie?.nom ?? "Retour"}
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visuel — rayon 40px, jamais un rectangle sec */}
          <div className="relative aspect-square overflow-hidden rounded-frame bg-ghost">
            <Image
              src={produit.image}
              alt={produit.nom}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Informations */}
          <div className="flex flex-col gap-8 lg:pt-8">
            <div className="flex flex-col gap-4">
              <EyebrowLabel>{produit.marque}</EyebrowLabel>
              <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] font-medium tracking-[-0.02em] text-ink">
                {produit.nom}
              </h1>
              <p className="max-w-md text-body text-graphite">
                {produit.description}
              </p>
            </div>

            <PriceTag
              amount={produit.prixXaf}
              strikeAmount={produit.prixBarreXaf}
              size="lg"
            />

            {/* Disponibilité annoncée franchement */}
            <div className="flex items-center gap-2.5 text-[0.9375rem]">
              <Package
                size={17}
                aria-hidden
                className={enRupture ? "text-slate" : "text-success"}
              />
              <span className={enRupture ? "text-slate" : "text-success"}>
                {enRupture
                  ? "Momentanément indisponible"
                  : produit.stock <= 3
                    ? `Plus que ${produit.stock} en stock à Bangui`
                    : "En stock à Bangui"}
              </span>
            </div>

            <AddToCart
              slug={produit.slug}
              nom={produit.nom}
              prixXaf={produit.prixXaf}
              image={produit.image}
              stock={produit.stock}
            />

            <Button asChild variant="secondary" size="lg" className="sm:w-fit">
              <Link href="/contact">Poser une question</Link>
            </Button>

            {produit.caracteristiques.length > 0 ? (
              <ul className="flex flex-col gap-3 border-t border-mist/60 pt-8">
                {produit.caracteristiques.map((carac) => (
                  <li
                    key={carac}
                    className="flex items-center gap-3 text-body text-graphite"
                  >
                    <Check size={16} aria-hidden className="shrink-0 text-brand" />
                    {carac}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Container>

      {similaires.length > 0 ? (
        <section className="bg-frost-lifted py-24 md:py-32">
          <Container>
            <div className="flex flex-col gap-5">
              <EyebrowLabel>Dans la même catégorie</EyebrowLabel>
              <h2 className="text-display text-ink">À regarder aussi</h2>
            </div>

            <ul className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {similaires.map((p) => (
                <li key={p.slug}>
                  <ProductCard produit={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
