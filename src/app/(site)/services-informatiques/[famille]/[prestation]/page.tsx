import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { formatXAF } from "@/lib/format/currency";
import {
  FAMILLES,
  UNITE_LABELS,
  getPrestation,
  getPrestationsVoisines,
} from "@/lib/data/services";

/**
 * FICHE PRESTATION
 *
 * Chaque prestation a désormais sa propre adresse. Avant, six entrées du
 * mega-menu Design et cinq de Services pointaient toutes vers la même page de
 * famille : on promettait une page précise, on livrait une liste.
 *
 * Les données viennent de la même source que la page famille et que le
 * configurateur de devis. Un prix corrigé dans services.ts se propage ici sans
 * intervention.
 */
export function generateStaticParams() {
  return FAMILLES.flatMap((f) =>
    f.prestations.map((p) => ({ famille: f.slug, prestation: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ famille: string; prestation: string }>;
}): Promise<Metadata> {
  const { famille, prestation } = await params;
  const trouve = getPrestation(famille, prestation);
  if (!trouve) return { title: "Prestation introuvable" };
  return {
    title: trouve.prestation.nom,
    description: trouve.prestation.description,
  };
}

export default async function PrestationPage({
  params,
}: {
  params: Promise<{ famille: string; prestation: string }>;
}) {
  const { famille: familleSlug, prestation: prestationSlug } = await params;
  const trouve = getPrestation(familleSlug, prestationSlug);
  if (!trouve) notFound();

  const { famille, prestation } = trouve;
  const voisines = getPrestationsVoisines(familleSlug, prestationSlug);

  return (
    <>
      <PageHeader
        eyebrow={famille.nom}
        title={prestation.nom}
        intro={prestation.description}
      />

      <Container className="pb-32">
        <Link
          href={`/services-informatiques/${famille.slug}`}
          className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-graphite transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden />
          {famille.nom}
        </Link>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
          {/* ───────────── Ce qui est compris ───────────── */}
          <div className="flex flex-col gap-6 rounded-frame border border-mist/60 bg-white p-8 md:p-10">
            <EyebrowLabel>Ce qui est compris</EyebrowLabel>

            <ul className="flex flex-col gap-4">
              {prestation.inclus.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3.5 text-body text-graphite"
                >
                  <Check
                    size={16}
                    aria-hidden
                    className="mt-1 shrink-0 text-brand"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <p className="border-t border-mist/60 pt-6 text-[0.9375rem] leading-relaxed text-slate">
              {famille.probleme}
            </p>
          </div>

          {/* ───────────── Le prix, collant au défilement ───────────── */}
          <aside className="flex flex-col gap-5 rounded-frame bg-ink p-8 text-white lg:sticky lg:top-32">
            <EyebrowLabel tone="frost">Tarif</EyebrowLabel>

            <div className="flex flex-col gap-1.5">
              <span className="text-[0.75rem] text-white/50">À partir de</span>
              <span className="text-[2rem] leading-none font-medium tracking-[-0.02em] tabular-nums">
                {formatXAF(prestation.prixBaseXaf)}
              </span>
              <span className="text-[0.875rem] text-white/60">
                {UNITE_LABELS[prestation.unite]}
              </span>
            </div>

            <span className="inline-flex items-center gap-2 text-[0.875rem] text-white/60">
              <Clock size={14} aria-hidden />
              {prestation.delai}
            </span>

            <div className="mt-2 flex flex-col gap-3">
              <Button asChild variant="onDark" size="lg" className="w-full">
                <Link href={`/devis?prestation=${prestation.slug}`}>
                  Chiffrer précisément
                </Link>
              </Button>
              <Button
                asChild
                variant="ghostOnDark"
                size="lg"
                className="w-full"
              >
                <Link href="/contact">Poser une question</Link>
              </Button>
            </div>

            <p className="text-[0.8125rem] leading-relaxed text-white/50">
              Le montant final dépend du volume et du déplacement. Le devis
              l&apos;arrête avant toute intervention.
            </p>
          </aside>
        </div>

        {/* ───────────── Maillage vers la même famille ───────────── */}
        {voisines.length > 0 ? (
          <div className="mt-20 flex flex-col gap-8">
            <EyebrowLabel>Dans la même famille</EyebrowLabel>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {voisines.map((v) => (
                <li key={v.slug}>
                  <Link
                    href={`/services-informatiques/${famille.slug}/${v.slug}`}
                    className="group/lien flex h-full flex-col gap-3 rounded-frame border border-mist/60 bg-white p-6 transition-[border-color,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-slate"
                  >
                    <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                      {v.nom}
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed text-graphite">
                      {v.description}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[0.875rem] text-ink">
                      À partir de {formatXAF(v.prixBaseXaf)}
                      <ArrowRight
                        size={15}
                        aria-hidden
                        className="transition-transform duration-200 ease-out-soft group-hover/lien:translate-x-1"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </>
  );
}
