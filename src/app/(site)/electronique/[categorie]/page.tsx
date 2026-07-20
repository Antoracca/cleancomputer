import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { CatalogueFiltre } from "@/features/catalogue/CatalogueFiltre";
import { chargerProduits } from "@/lib/data/catalogue-db";
import { CATEGORIES, getCategorie } from "@/types/catalogue";

/** ISR : le stock et les prix suivent le panel admin en moins d'une minute. */
export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ categorie: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}): Promise<Metadata> {
  const { categorie: slug } = await params;
  const categorie = getCategorie(slug);
  if (!categorie) return { title: "Catégorie introuvable" };

  return {
    title: categorie.nom,
    description: categorie.description,
  };
}

export default async function CategoriePage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie: slug } = await params;
  const categorie = getCategorie(slug);
  if (!categorie) notFound();

  const produits = await chargerProduits(slug);

  return (
    <>
      <PageHeader
        eyebrow="Boutique"
        title={categorie.nom}
        intro={categorie.description}
      />

      <Container className="pb-32">
        {produits.length > 0 ? (
          <div className="mt-12">
            <CatalogueFiltre produits={produits} categorieActive={slug} />
          </div>
        ) : (
          /* État vide honnête : on annonce la suite plutôt que d'afficher
             une grille vide sans explication. */
          <div className="mt-12 rounded-frame border border-mist/60 bg-white px-8 py-16 text-center">
            <p className="text-title text-ink">
              Rien dans cette catégorie pour le moment.
            </p>
            <p className="mx-auto mt-3 max-w-md text-body text-graphite">
              Le stock évolue chaque semaine. Dites-nous ce que vous cherchez,
              nous vous prévenons dès son arrivée.
            </p>
          </div>
        )}
      </Container>
    </>
  );
}
