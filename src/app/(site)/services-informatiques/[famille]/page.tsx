import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { formatXAF } from "@/lib/format/currency";
import { FAMILLES, UNITE_LABELS, getFamille } from "@/lib/data/services";

export function generateStaticParams() {
  return FAMILLES.map((f) => ({ famille: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ famille: string }>;
}): Promise<Metadata> {
  const { famille: slug } = await params;
  const famille = getFamille(slug);
  if (!famille) return { title: "Famille introuvable" };
  return { title: famille.nom, description: famille.accroche };
}

export default async function FamillePage({
  params,
}: {
  params: Promise<{ famille: string }>;
}) {
  const { famille: slug } = await params;
  const famille = getFamille(slug);
  if (!famille) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={famille.accroche}
        intro={famille.probleme}
      />

      <Container className="pb-32">
        <Link
          href="/services-informatiques"
          className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-graphite transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden />
          Toutes les familles
        </Link>

        <ul className="mt-10 grid gap-5 lg:grid-cols-2">
          {famille.prestations.map((prestation) => (
            <li key={prestation.slug}>
              <article className="flex h-full flex-col gap-5 rounded-frame border border-mist/60 bg-white p-8">
                <div className="flex flex-col gap-3">
                  <h2 className="text-title text-ink">{prestation.nom}</h2>
                  <p className="text-body text-graphite">
                    {prestation.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {prestation.inclus.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-[0.9375rem] text-graphite"
                    >
                      <Check
                        size={15}
                        aria-hidden
                        className="shrink-0 text-brand"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-mist/60 pt-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[0.75rem] text-slate">
                      À partir de
                    </span>
                    <span className="text-[1.125rem] font-medium text-ink tabular-nums">
                      {formatXAF(prestation.prixBaseXaf)}{" "}
                      <span className="text-[0.875rem] font-[450] text-slate">
                        {UNITE_LABELS[prestation.unite]}
                      </span>
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-slate">
                    <Clock size={13} aria-hidden />
                    {prestation.delai}
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col gap-6 rounded-frame bg-frost-lifted px-8 py-12 md:px-12">
          <EyebrowLabel>La suite</EyebrowLabel>
          <h2 className="max-w-xl text-display text-ink">
            Un besoin qui ne rentre pas dans une case ?
          </h2>
          <p className="max-w-lg text-body text-graphite">
            La plupart des projets mélangent plusieurs familles. Décrivez le
            vôtre, on le chiffre ensemble.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/devis">Chiffrer mon projet</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Nous écrire</Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
