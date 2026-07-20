import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { SimulateurClient } from "@/features/transfert/SimulateurClient";
import { FRAIS_SERVICE_PCT, TAUX_EUR_MAD, TAUX_MAD_XAF } from "@/lib/data/transfert";

export const metadata: Metadata = {
  title: "Simuler un transfert",
  description:
    "Calculez en direct ce que vous payez et ce que reçoit le bénéficiaire. Orange Money, MoneyGram et Western Union.",
};

export default function SimulateurPage() {
  return (
    <>
      <PageHeader
        eyebrow="Simulateur"
        title="Combien part, combien arrive."
        intro="Le calcul se fait devant vous. Frais opérateur, frais de service et montant reçu : les trois chiffres avant que vous validiez quoi que ce soit."
        meta={[
          `1 EUR = ${TAUX_EUR_MAD} MAD`,
          `1 MAD = ${TAUX_MAD_XAF} FCFA`,
          `Frais de service ${FRAIS_SERVICE_PCT} %`,
        ]}
      />

      <Container className="pb-24">
        <SimulateurClient />
      </Container>

      {/* Ce que le simulateur ne dit pas */}
      <Container className="pb-32">
        <div className="flex flex-col gap-5 rounded-frame bg-frost-lifted px-8 py-12 md:px-14">
          <EyebrowLabel>Bon à savoir</EyebrowLabel>
          <h2 className="max-w-2xl text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
            Trois choses avant d&apos;envoyer.
          </h2>

          <dl className="grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <dt className="text-[0.9375rem] font-medium text-ink">
                Le bénéficiaire reçoit tout
              </dt>
              <dd className="text-[0.9375rem] leading-relaxed text-graphite">
                Les frais s&apos;ajoutent à votre montant, ils ne s&apos;en
                retirent pas. Si vous envoyez 100 000, il reçoit la contrevaleur
                de 100 000.
              </dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="text-[0.9375rem] font-medium text-ink">
                Orange Money, un seul corridor
              </dt>
              <dd className="text-[0.9375rem] leading-relaxed text-graphite">
                Uniquement entre la Centrafrique et le Maroc, dans les deux sens.
                Pour les autres pays, MoneyGram ou Western Union.
              </dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="text-[0.9375rem] font-medium text-ink">
                Le taux du jour prime
              </dt>
              <dd className="text-[0.9375rem] leading-relaxed text-graphite">
                Le taux appliqué est celui en vigueur au moment du paiement.
                L&apos;écart avec l&apos;estimation reste faible, mais il existe.
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </>
  );
}
