import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { CartView } from "@/features/panier/CartView";

export const metadata: Metadata = { title: "Panier" };

export default function PanierPage() {
  return (
    <>
      <PageHeader eyebrow="Panier" title="Votre panier." />
      <Container className="pb-32">
        <CartView />
      </Container>
    </>
  );
}
