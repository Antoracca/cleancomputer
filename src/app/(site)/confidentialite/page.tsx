import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { COMPANY } from "@/lib/config/company";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
};

/**
 * Cette page décrit l'état RÉEL du traitement des données aujourd'hui : aucun
 * compte, aucun paiement, aucun traceur. Elle sera complétée à mesure que les
 * traitements existeront réellement — décrire des traitements inexistants
 * serait aussi trompeur que d'en cacher.
 */
export default function ConfidentialitePage() {
  return (
    <>
      <PageHeader
        eyebrow="Informations légales"
        title="Politique de confidentialité"
      />

      <Container className="pb-32">
        <div className="flex max-w-3xl flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h2 className="text-title text-ink">État actuel du site</h2>
            <p className="text-body text-graphite">
              À ce stade, le site ne collecte aucune donnée personnelle : il n&apos;y
              a ni compte utilisateur actif, ni paiement en ligne, ni traceur
              publicitaire, ni outil de mesure d&apos;audience. Les formulaires
              présents ne transmettent encore rien à un serveur.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-title text-ink">Ce qui changera</h2>
            <p className="text-body text-graphite">
              L&apos;ouverture des comptes clients et des commandes impliquera la
              collecte de données nécessaires au service : identité, coordonnées,
              adresse de livraison, historique de commandes. Cette page sera mise
              à jour avant cette ouverture, en précisant les finalités, les
              durées de conservation et les moyens d&apos;exercer vos droits.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-title text-ink">Vos droits</h2>
            <p className="text-body text-graphite">
              Vous pourrez à tout moment demander l&apos;accès, la rectification
              ou la suppression de vos données auprès de {COMPANY.name}. Les
              coordonnées de contact seront publiées avec les mentions légales.
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}
