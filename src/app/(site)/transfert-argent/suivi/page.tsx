import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { FeatureNotice } from "@/components/shared/FeatureNotice";

export const metadata: Metadata = {
  title: "Suivi de transfert",
  description: "Suivez votre transfert avec son code de transaction.",
};

export default function SuiviTransfertPage() {
  return (
    <>
      <PageHeader
        eyebrow="Suivi"
        title="Où en est votre transfert."
        intro="Un code de transaction suffit : envoyé, en cours, reçu."
      />

      <FeatureNotice
        titre="Le suivi arrive avec le service de transfert."
        explication="Le suivi par code sera actif en même temps que le service lui-même. En attendant, appelez-nous : nous répondons sur l'état de tout dossier en cours."
        phase="Phase 5"
      />
    </>
  );
}
