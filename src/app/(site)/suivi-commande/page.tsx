import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { SuiviForm } from "@/features/panier/SuiviForm";

export const metadata: Metadata = {
  title: "Suivi de commande",
  description: "Suivez votre commande avec sa référence et votre téléphone.",
};

export default function SuiviCommandePage() {
  return (
    <>
      <PageHeader
        eyebrow="Suivi de commande"
        title="Où en est votre commande."
        intro="Votre référence et le téléphone utilisé en commandant, rien d'autre."
      />
      <Container className="pb-32">
        <SuiviForm />
      </Container>
    </>
  );
}
