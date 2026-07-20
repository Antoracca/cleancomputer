import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { FeatureNotice } from "@/components/shared/FeatureNotice";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Études de cas des sites, applications et identités visuelles livrés par Clean Computer.",
};

export default function RealisationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Réalisations"
        title="Les projets livrés, avec leurs résultats."
        intro="Avant, après, et ce que ça a changé pour le client."
      />

      {/* Aucune réalisation fictive n'est affichée : inventer des études de cas
          sur un site commercial est une allégation trompeuse. La page attend
          les vrais projets et leurs autorisations de publication. */}
      <FeatureNotice
        titre="Les études de cas arrivent."
        explication="Nous préparons les premières fiches projet avec l'accord des clients concernés : contexte, solution retenue, résultats mesurés. Aucune réalisation ne sera publiée sans leur autorisation écrite."
        phase="Phase 5 — après validation des clients cités"
      />
    </>
  );
}
