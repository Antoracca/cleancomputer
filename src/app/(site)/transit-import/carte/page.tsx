import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { FeatureNotice } from "@/components/shared/FeatureNotice";

export const metadata: Metadata = {
  title: "Suivi d'expédition",
  description: "Suivez votre expédition Chine ↔ Bangui étape par étape.",
};

export default function CarteTransitPage() {
  return (
    <>
      <PageHeader
        eyebrow="Suivi d'expédition"
        title="Où est votre marchandise."
        intro="Chaque étape du trajet, datée, de l'entrepôt chinois à Bangui."
      />

      <FeatureNotice
        titre="Le suivi cartographique est en construction."
        explication="La carte interactive et les statuts d'expédition seront branchés sur le système de gestion des expéditions. Pour toute expédition en cours, contactez-nous avec votre référence : nous avons l'information."
        phase="Phase 5"
      />
    </>
  );
}
