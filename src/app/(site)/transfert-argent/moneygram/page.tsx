import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EnvoiMoneyGram } from "@/features/transfert/EnvoiMoneyGram";
import { getOperateur } from "@/lib/data/transfert";
import { COMPANY, PHONE_HREF } from "@/lib/config/company";

export const metadata: Metadata = {
  title: "Envoyer avec MoneyGram",
  description:
    "Envoyez et recevez de l'argent par MoneyGram depuis notre agence de Bangui. Frais et taux annoncés avant validation.",
};

/**
 * PAGE MONEYGRAM
 *
 * Reprend les codes visuels de MoneyGram : dégradé cyan vers pêche,
 * titraille très grasse, carte blanche posée dessus, aplat rouge organique.
 *
 * DEUX ÉCARTS ASSUMÉS À `docs/DESIGN-DIRECTION.md` :
 *
 *   1. Le rayon 8-16px, banni ailleurs sur le site, est utilisé sur les
 *      champs : c'est une signature du formulaire MoneyGram.
 *   2. Le dégradé chaud remplace le canevas Frost.
 *
 * Ces écarts sont bornés à cette page. Le reste du site n'en hérite pas.
 *
 * MENTION NÉCESSAIRE : la page dit clairement que l'opérateur est MoneyGram
 * et que le point de service est Clean Computer. Reproduire l'habillage d'une
 * marque sans dire qui exploite le guichet laisserait croire au visiteur
 * qu'il est sur le site officiel de MoneyGram.
 */
export default function MoneyGramPage() {
  const operateur = getOperateur("moneygram");

  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-[linear-gradient(105deg,#dff1f7_0%,#f4f0e6_38%,#ffe2c4_66%,#ffb695_100%)]">
        <Container className="pt-36 pb-20 md:pt-44 md:pb-28">
          <Link
            href="/transfert-argent"
            className="mb-10 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-ink/70 transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} aria-hidden />
            Tous les services de transfert
          </Link>

          <div className="grid gap-12 lg:grid-cols-[1fr_26rem] lg:items-start">
            <div className="flex flex-col gap-7">
              {operateur ? (
                <span className="relative h-9 w-52">
                  <Image
                    src={operateur.logo}
                    alt="MoneyGram"
                    fill
                    sizes="208px"
                    priority
                    className="object-contain object-left"
                  />
                </span>
              ) : null}

              <span className="text-[1.0625rem] font-bold tracking-[-0.01em] text-[#2c6ecb]">
                Des milliards envoyés, des millions de clients servis
              </span>

              {/* Titraille MoneyGram : très grasse, interlignage serré. */}
              <h1 className="max-w-2xl text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em] text-ink">
                Envoyez et recevez de l&apos;argent comme vous le souhaitez
              </h1>

              <p className="max-w-lg text-[1.0625rem] leading-relaxed text-ink/75">
                Vous envoyez depuis notre agence de Bangui vers le réseau
                MoneyGram. Les frais et le taux sont affichés avant que vous
                validiez, jamais après.
              </p>

              {/* Chiffres MoneyGram, attribués à MoneyGram. Ce ne sont pas
                  ceux de Clean Computer et la page ne le laisse pas croire. */}
              <dl className="mt-2 flex flex-wrap items-stretch gap-x-10 gap-y-6">
                {[
                  { valeur: "200+", label: "Pays" },
                  { valeur: "470 000+", label: "Agences" },
                  { valeur: "85+ ans", label: "D'expérience" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={
                      i > 0
                        ? "border-l border-ink/15 pl-10"
                        : undefined
                    }
                  >
                    <dt className="text-[1.75rem] leading-none font-extrabold tracking-[-0.03em] text-ink tabular-nums">
                      {stat.valeur}
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem] text-ink/60">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="text-[0.8125rem] leading-relaxed text-ink/50">
                Chiffres communiqués par MoneyGram pour son réseau mondial.
              </p>
            </div>

            {/* ───────────── La carte d'envoi ─────────────
                Le liseré dégradé qui dépasse sous la carte est repris de la
                capture : c'est ce qui la fait flotter au-dessus du fond. */}
            <div className="relative">
              <span
                aria-hidden
                className="absolute inset-x-3 -bottom-2 h-10 rounded-[1.75rem] bg-[linear-gradient(100deg,#bfe3ec_0%,#f6ecd8_50%,#ffcf9e_100%)]"
              />
              <div className="relative rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-24px_rgba(15,21,32,0.28)] md:p-8">
                <EnvoiMoneyGram />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════ POURQUOI ═══════════ */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            {/* Aplat rouge organique, signature MoneyGram, avec le portrait
                posé par-dessus et débordant volontairement de la forme. */}
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <span
                aria-hidden
                className="absolute inset-0 bg-[#f5402c]"
                style={{ borderRadius: "62% 38% 45% 55% / 52% 48% 52% 48%" }}
              />
              <span
                aria-hidden
                className="absolute inset-x-6 top-16 bottom-0 bg-[#ff6b3d] opacity-70"
                style={{ borderRadius: "48% 52% 60% 40% / 45% 55% 45% 55%" }}
              />
              <Image
                src="/media/portraits/moneygram-portrait-homme.avif"
                alt="Client Clean Computer"
                fill
                sizes="(min-width: 1024px) 28rem, 100vw"
                className="scale-[1.06] object-contain object-bottom"
              />
            </div>

            <div className="flex flex-col gap-7">
              <span className="text-[1.0625rem] font-bold tracking-[-0.01em] text-[#2c6ecb]">
                Simple, flexible et fiable
              </span>

              <h2 className="text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-ink">
                Pourquoi MoneyGram ?
              </h2>

              <ul className="flex flex-col gap-5">
                {[
                  {
                    titre: "Un réseau que le bénéficiaire connaît déjà.",
                    detail:
                      "Le retrait se fait dans n'importe quelle agence MoneyGram du pays d'arrivée, avec une pièce d'identité et le code de référence.",
                  },
                  {
                    titre: "Des frais annoncés avant de payer.",
                    detail:
                      "Le montant reçu par le bénéficiaire est calculé devant vous. Ce que vous voyez est ce que vous réglez.",
                  },
                  {
                    titre: "Un interlocuteur sur place.",
                    detail: `En cas de problème, vous passez nous voir ${COMPANY.address}. Vous n'appelez pas un centre à l'étranger.`,
                  },
                ].map((point) => (
                  <li key={point.titre} className="flex items-start gap-4">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#f5402c] text-white">
                      <Check size={14} strokeWidth={3} aria-hidden />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="text-[1.0625rem] font-bold tracking-[-0.01em] text-ink">
                        {point.titre}
                      </span>
                      <span className="text-body leading-relaxed text-graphite">
                        {point.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href={PHONE_HREF}>Nous appeler</a>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/transfert-argent/suivi">
                    Suivre un transfert
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════ MENTION ═══════════ */}
      <section className="bg-frost py-14">
        <Container>
          <p className="mx-auto max-w-3xl text-center text-[0.875rem] leading-relaxed text-slate">
            MoneyGram est une marque déposée de MoneyGram International. Le
            guichet est exploité par {COMPANY.tradeName}, {COMPANY.address},{" "}
            {COMPANY.city}. Cette page n&apos;est pas le site officiel de
            MoneyGram.
          </p>
        </Container>
      </section>
    </>
  );
}
