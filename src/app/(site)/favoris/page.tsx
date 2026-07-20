import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { FavorisListe } from "@/features/favoris/FavorisListe";
import { chargerProduits } from "@/lib/data/catalogue-db";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Les produits que vous avez mis de côté.",
};

export const revalidate = 60;

/**
 * Les favoris vivent dans le navigateur, pas en base. On envoie donc le
 * catalogue complet et le composant client ne garde que les slugs enregistrés.
 * Sur un catalogue de cette taille, c'est instantané et cela évite d'exiger
 * un compte pour une action aussi anodine que mettre de côté.
 */
export default async function FavorisPage() {
  const produits = await chargerProduits();

  return (
    <>
      <PageHeader
        eyebrow="Favoris"
        title="Ce que vous avez mis de côté."
        intro="Votre liste reste enregistrée sur cet appareil, même sans compte."
      />
      <Container className="pb-32">
        <FavorisListe produits={produits} />
      </Container>
    </>
  );
}
