import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  robots: { index: false },
};

/**
 * ⚠️ Les CGV engagent contractuellement l'entreprise. Elles ne peuvent pas
 * être rédigées sans les informations légales, les modalités de paiement
 * définitives et une relecture juridique. Aucun texte contractuel n'est donc
 * publié ici par défaut.
 */
export default function CgvPage() {
  return (
    <>
      <PageHeader
        eyebrow="Informations légales"
        title="Conditions générales de vente"
      />

      <Container className="pb-32">
        <div className="flex max-w-3xl flex-col gap-6">
          <p className="rounded-frame border border-mist/60 bg-white px-8 py-10 text-body text-graphite">
            Les conditions générales de vente sont en cours de rédaction. Elles
            seront publiées avant l&apos;ouverture des commandes en ligne, une
            fois arrêtés les moyens de paiement, les modalités de livraison, le
            droit de rétractation applicable et les conditions de garantie.
          </p>
          <p className="text-body text-graphite">
            Un texte contractuel engage l&apos;entreprise vis-à-vis de ses
            clients : il ne sera pas publié tant qu&apos;il n&apos;aura pas été
            établi sur la base des informations réelles de la société et
            relu juridiquement.
          </p>
        </div>
      </Container>
    </>
  );
}
