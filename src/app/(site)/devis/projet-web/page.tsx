import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Configurateur } from "@/features/devis/Configurateur";

export const metadata: Metadata = {
  title: "Chiffrer un projet web",
  description:
    "Chiffrez votre projet de site ou d'application. Le prix se met à jour à chaque choix, sans attendre de rappel.",
};

/**
 * CONFIGURATEUR DE PROJET WEB
 *
 * Conservé tel quel, à sa propre adresse. Il répond à un besoin que l'atelier
 * de devis ne couvre pas : chiffrer une prestation sur mesure, dont le prix
 * dépend de choix successifs plutôt que d'une référence catalogue. Sa logique
 * de calcul est validée par sept cas de test, il n'y avait aucune raison de la
 * remplacer.
 */
export default function ProjetWebPage() {
  return (
    <>
      <PageHeader
        eyebrow="Devis immédiat"
        title="Votre projet chiffré avant la fin de votre café."
        intro="Six questions, un prix qui se met à jour à chaque réponse. Pas de formulaire envoyé dans le vide, pas de rappel trois jours plus tard."
      />

      <Container className="pb-32">
        <Link
          href="/devis"
          className="mb-10 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-graphite transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden />
          Devis sur catalogue
        </Link>

        <Configurateur />
      </Container>
    </>
  );
}
