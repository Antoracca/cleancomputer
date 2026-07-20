import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { CheckoutForm } from "@/features/panier/CheckoutForm";

export const metadata: Metadata = { title: "Commander" };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Commande"
        title="Plus qu'une étape."
        intro="Trois champs, et c'est réservé. Vous payez à la remise, en espèces. Aucun prélèvement en ligne."
      />
      <Container className="pb-32">
        <CheckoutForm />
      </Container>
    </>
  );
}
