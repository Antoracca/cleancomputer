import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { ChoixCanal } from "@/features/transfert/ChoixCanal";
import {
  OPERATEURS,
  TAUX_EUR_MAD,
  TAUX_MAD_XAF,
  type OperateurId,
} from "@/lib/data/transfert";
import { COMPANY, PHONE_HREF } from "@/lib/config/company";

export const metadata: Metadata = {
  title: "Envoyer de l'argent",
  description:
    "Orange Money, MoneyGram et Western Union depuis Bangui. Vous voyez les frais et le montant reçu avant de valider.",
};

/**
 * TRANSFERT D'ARGENT
 *
 * Structure revue : les trois réseaux passent EN TÊTE, avant tout discours.
 * Un visiteur qui arrive ici cherche à savoir par quel canal il peut envoyer,
 * pas à lire une explication de service.
 *
 * Les listes de corridors ont été retirées : elles annonçaient des couloirs
 * sans les documenter, ce qui n'apportait rien. Les limites réelles (Orange
 * Money restreint au Maroc, envoi seulement) sont dites là où elles comptent,
 * c'est-à-dire dans le parcours lui-même et en pied de page.
 */
export default async function TransfertPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  // `?service=moneygram` ouvre directement le parcours de cet opérateur.
  // Depuis le menu, cliquer sur « MoneyGram » puis devoir rechoisir MoneyGram
  // est une étape pour rien : le choix est déjà fait.
  const { service } = await searchParams;
  const canalInitial = OPERATEURS.some((o) => o.id === service)
    ? (service as OperateurId)
    : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Transfert d'argent"
        title="Envoyez de l'argent en toute clarté."
        intro="Vous voyez ce que vous payez et ce que reçoit le bénéficiaire avant de valider. Pas de surprise au guichet."
        meta={[
          `1 EUR = ${TAUX_EUR_MAD} MAD`,
          `1 MAD = ${TAUX_MAD_XAF} FCFA`,
          "Réception en quelques minutes",
        ]}
      />

      {/* ═══════════ LES TROIS RÉSEAUX, EN TÊTE ═══════════ */}
      <Container className="pb-24">
        <div className="mb-10 flex max-w-2xl flex-col gap-4">
          <EyebrowLabel>Choisissez votre service</EyebrowLabel>
          <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
            Par quel réseau voulez-vous envoyer ?
          </h2>
        </div>

        <ChoixCanal canalInitial={canalInitial} />
      </Container>

      {/* ═══════════ SUIVI ═══════════ */}
      <section className="bg-frost-lifted py-20 md:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="flex max-w-lg flex-col gap-4">
              <EyebrowLabel>Déjà envoyé ?</EyebrowLabel>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
                Suivez un transfert en cours.
              </h2>
              <p className="text-[1.0625rem] leading-relaxed text-graphite">
                Votre code de transaction suffit pour savoir où en est
                l&apos;argent.
              </p>
            </div>

            <Link
              href="/transfert-argent/suivi"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-action border-[1.5px] border-ink bg-white px-8 text-body font-[450] text-ink transition-colors hover:bg-ink hover:text-frost"
            >
              Suivre un transfert
            </Link>
          </div>
        </Container>
      </section>

      {/* ═══════════ MENTIONS ET LIMITES, EN PIED ═══════════ */}
      <Container className="py-20 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <EyebrowLabel>Ce qu&apos;il faut savoir</EyebrowLabel>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
                Nos limites, dites franchement.
              </h2>
            </div>

            <dl className="grid gap-8 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <dt className="text-[0.9375rem] font-medium text-ink">
                  Envoi uniquement
                </dt>
                <dd className="text-[0.9375rem] leading-relaxed text-graphite">
                  {COMPANY.name} prend en charge l&apos;envoi depuis la
                  Centrafrique. Nous ne traitons pas la réception de fonds
                  entrants. Mieux vaut un service maîtrisé de bout en bout
                  qu&apos;une promesse intenable.
                </dd>
              </div>

              <div className="flex flex-col gap-2">
                <dt className="text-[0.9375rem] font-medium text-ink">
                  Orange Money, un seul corridor
                </dt>
                <dd className="text-[0.9375rem] leading-relaxed text-graphite">
                  Uniquement entre la Centrafrique et le Maroc, dans les deux
                  sens. Pour toute autre destination, MoneyGram ou Western
                  Union.
                </dd>
              </div>

              <div className="flex flex-col gap-2">
                <dt className="text-[0.9375rem] font-medium text-ink">
                  Le bénéficiaire reçoit tout
                </dt>
                <dd className="text-[0.9375rem] leading-relaxed text-graphite">
                  Les frais s&apos;ajoutent à votre montant, ils ne s&apos;en
                  retirent pas. Vous envoyez 100 000, il reçoit la contrevaleur
                  de 100 000.
                </dd>
              </div>

              <div className="flex flex-col gap-2">
                <dt className="text-[0.9375rem] font-medium text-ink">
                  Le taux du jour prime
                </dt>
                <dd className="text-[0.9375rem] leading-relaxed text-graphite">
                  Le taux retenu est celui en vigueur au moment du paiement.
                  L&apos;écart avec l&apos;estimation reste faible, mais il
                  existe.
                </dd>
              </div>
            </dl>
          </div>

          {/* Panneau d'aide */}
          <aside className="flex flex-col gap-5 rounded-frame bg-ink p-8 text-white lg:sticky lg:top-28 lg:self-start">
            <EyebrowLabel tone="frost">Un doute ?</EyebrowLabel>
            <p className="text-[1.0625rem] leading-snug font-medium">
              On préfère répondre avant que vous envoyiez.
            </p>
            <p className="text-[0.9375rem] leading-relaxed text-white/60">
              Montant, destination, mode de réception : appelez, on vérifie
              ensemble.
            </p>
            <a
              href={PHONE_HREF}
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-action border-[1.5px] border-white bg-white px-6 text-body font-medium text-ink transition-colors hover:bg-white/90"
            >
              {COMPANY.phone}
            </a>
          </aside>
        </div>

        {/* Bandeau des réseaux, en rappel discret */}
        <div className="mt-16 flex flex-wrap items-center gap-x-12 gap-y-6 border-t border-mist/70 pt-10">
          <span className="text-[0.8125rem] text-slate">
            Réseaux partenaires
          </span>
          {OPERATEURS.map((o) => (
            <span key={o.id} className="relative h-6 w-28 opacity-60">
              <Image
                src={o.logo}
                alt={o.nom}
                fill
                sizes="112px"
                className="object-contain object-left"
              />
            </span>
          ))}
        </div>
      </Container>
    </>
  );
}
