import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Configurateur } from "@/features/devis/Configurateur";

export const metadata: Metadata = {
  title: "Devis en ligne",
  description:
    "Chiffrez votre projet de site ou d'application. Le prix se met à jour à chaque choix, sans attendre de rappel.",
};

export default function DevisPage() {
  return (
    <>
      <PageHeader
        eyebrow="Devis immédiat"
        title="Votre projet chiffré avant la fin de votre café."
        intro="Six questions, un prix qui se met à jour à chaque réponse. Pas de formulaire envoyé dans le vide, pas de rappel trois jours plus tard."
      />

      <Container className="pb-32">
        <Configurateur />
      </Container>
    </>
  );
}
