import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Info, Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { GalerieProduit } from "@/features/catalogue/GalerieProduit";
import { BadgeEtat, ScoreSante } from "@/features/catalogue/EtatMachine";
import { AddToCart } from "@/features/panier/AddToCart";
import { OrdinateurCard } from "@/features/catalogue/OrdinateurCard";
import { formatXAF } from "@/lib/format/currency";
import { ORDINATEURS, getOrdinateur } from "@/lib/data/ordinateurs";

export function generateStaticParams() {
  return ORDINATEURS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const o = getOrdinateur(slug);
  if (!o) return { title: "Ordinateur introuvable" };

  return {
    title: `${o.marque} ${o.modele}`,
    description: o.description,
    openGraph: { images: o.images[0] ? [o.images[0]] : [] },
  };
}

/**
 * FICHE ORDINATEUR
 *
 * Galerie multi-angles à gauche, décision d'achat à droite. L'état et le score
 * de santé sont placés AVANT les caractéristiques : c'est la première chose
 * qu'un acheteur de matériel veut savoir.
 *
 * Quand les caractéristiques n'ont pas été confirmées sur une source
 * constructeur, un avertissement le dit franchement plutôt que d'afficher une
 * fiche technique incertaine. Annoncer un processeur qui n'est pas celui de la
 * machine livrée se termine en litige.
 */
export default async function OrdinateurPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const o = getOrdinateur(slug);
  if (!o) notFound();

  const autres = ORDINATEURS.filter((a) => a.slug !== o.slug).slice(0, 2);
  const specs = Object.entries(o.specifications);

  return (
    <>
      <Container className="pt-32 pb-24 md:pt-40">
        <Link
          href="/electronique/ordinateurs"
          className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-graphite transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden />
          Tous les ordinateurs
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <GalerieProduit
            images={o.images}
            alt={`${o.marque} ${o.modele}`}
            priority
          />

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <BadgeEtat etat={o.etat} />
                <span className="text-eyebrow text-slate uppercase">
                  {o.marque} · {o.gamme}
                </span>
              </div>

              <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.08] font-medium tracking-[-0.025em] text-ink">
                {o.modele}
              </h1>

              <p className="text-[0.8125rem] text-slate">
                Référence constructeur {o.sku}
              </p>

              <p className="max-w-md text-[1.0625rem] leading-relaxed text-graphite">
                {o.description}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[1.75rem] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
                {formatXAF(o.prixXaf)}
              </span>
              <span className="inline-flex items-center gap-2 text-[0.9375rem] text-success">
                <Package size={16} aria-hidden />
                {o.stock > 2
                  ? "En stock à Bangui"
                  : `Plus que ${o.stock} en stock`}
              </span>
            </div>

            <ScoreSante sante={o.sante} etat={o.etat} />

            <AddToCart
              slug={o.slug}
              nom={`${o.marque} ${o.modele}`}
              prixXaf={o.prixXaf}
              image={o.images[0] ?? ""}
              stock={o.stock}
            />

            {/* Points clés */}
            <ul className="flex flex-col gap-3 border-t border-mist/60 pt-8">
              {o.pointsCles.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-body text-graphite"
                >
                  <span
                    aria-hidden
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Caractéristiques détaillées */}
        <section className="mt-20 md:mt-28">
          <div className="flex max-w-2xl flex-col gap-4">
            <EyebrowLabel>Caractéristiques</EyebrowLabel>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
              Le détail technique.
            </h2>
          </div>

          {!o.specsVerifiees ? (
            <p className="mt-6 flex max-w-2xl items-start gap-3 rounded-action border border-warning/30 bg-white px-5 py-4 text-[0.9375rem] leading-relaxed text-graphite">
              <Info size={17} aria-hidden className="mt-0.5 shrink-0 text-warning" />
              <span>
                La configuration exacte de cette référence est en cours de
                vérification auprès du constructeur. Appelez-nous pour connaître
                le processeur, la mémoire et le stockage précis de la machine en
                stock avant de commander.
              </span>
            </p>
          ) : null}

          <dl className="mt-8 grid max-w-3xl gap-x-10 sm:grid-cols-2">
            {specs.map(([cle, valeur]) => (
              <div
                key={cle}
                className="flex flex-col gap-1 border-t border-mist/60 py-4"
              >
                <dt className="text-[0.8125rem] text-slate">{cle}</dt>
                <dd className="text-body text-ink">{valeur}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>

      {/* Autres machines */}
      {autres.length > 0 ? (
        <section className="bg-frost-lifted py-24 md:py-28">
          <Container>
            <div className="flex flex-col gap-4">
              <EyebrowLabel>Autres machines</EyebrowLabel>
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
                À comparer avant de choisir.
              </h2>
            </div>

            <ul className="mt-12 grid gap-6 lg:grid-cols-2">
              {autres.map((a) => (
                <li key={a.slug}>
                  <OrdinateurCard ordinateur={a} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
