import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { MarqueLogo } from "@/components/shared/MarqueLogo";
import { SouscriptionAbonnement } from "@/features/abonnements/SouscriptionAbonnement";
import {
  ABONNEMENTS,
  CATEGORIES,
  DUREE_LABELS,
  getAbonnement,
  getAbonnementsVoisins,
  getFormuleEntree,
  libellePrixFormule,
} from "@/lib/data/abonnements";

/**
 * FICHE ABONNEMENT
 *
 * Une adresse par service, exactement celles que le mega-menu promet. Les
 * formules sont listées en clair : le visiteur compare avant de nous écrire,
 * il n'a pas à demander un tarif pour connaître un ordre de grandeur.
 */
export function generateStaticParams() {
  return ABONNEMENTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const abonnement = getAbonnement(slug);
  if (!abonnement) return { title: "Abonnement introuvable" };
  return {
    title: `Abonnement ${abonnement.nom}`,
    description: abonnement.accroche,
  };
}

export default async function AbonnementPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const abonnement = getAbonnement(slug);
  if (!abonnement) notFound();

  const categorie = CATEGORIES.find((c) => c.id === abonnement.categorie);
  const entree = getFormuleEntree(abonnement);
  const voisins = getAbonnementsVoisins(abonnement.slug);

  return (
    <>
      <PageHeader
        eyebrow={categorie ? categorie.nom : "Abonnements"}
        title={abonnement.accroche}
        intro={abonnement.description}
        meta={[
          abonnement.editeur,
          abonnement.delaiActivation,
          `À partir de ${libellePrixFormule(entree)} ${DUREE_LABELS[entree.duree]}`,
        ]}
      />

      <Container className="pb-32">
        <Link
          href="/abonnements"
          className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-graphite transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden />
          Tous les abonnements
        </Link>

        {/* ───────────── Identité du service ───────────── */}
        <div className="mt-8 flex flex-wrap items-center gap-5 rounded-frame border border-mist/60 bg-white px-7 py-6">
          <MarqueLogo
            src={abonnement.logo}
            nom={abonnement.nom}
            className="size-10 shrink-0 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-title text-ink">{abonnement.nom}</span>
            <span className="text-[0.875rem] text-slate">
              Édité par {abonnement.editeur}
            </span>
          </div>

          {abonnement.programme ? (
            <span className="ml-auto flex items-center gap-2.5 rounded-pill bg-frost px-4 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={abonnement.programme.logo}
                alt=""
                width={16}
                height={16}
                className="size-4 shrink-0 object-contain"
              />
              <span className="text-[0.8125rem] text-graphite">
                Programme {abonnement.programme.nom}
              </span>
            </span>
          ) : null}
        </div>

        {/* ───────────── La souscription, en quatre temps ───────────── */}
        <div className="mt-8">
          <SouscriptionAbonnement abonnement={abonnement} />
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div className="flex flex-col gap-5">
            {/* ───────────── Ce qu'il faut avoir sous la main ───────────── */}
            <div className="mt-4 flex flex-col gap-5 rounded-frame bg-frost-lifted p-7 md:p-8">
              <EyebrowLabel>Avant l&apos;activation</EyebrowLabel>
              <ul className="flex flex-col gap-3">
                {abonnement.prerequis.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-graphite"
                  >
                    <Info
                      size={15}
                      aria-hidden
                      className="mt-1 shrink-0 text-slate"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="border-t border-mist/60 pt-5 text-[0.875rem] leading-relaxed text-slate">
                Nous ne demandons jamais votre mot de passe. L&apos;activation
                se fait avec vous, sur votre propre compte.
              </p>
            </div>
          </div>

          {/* ───────────── Repères, plus un doublon de commande ─────────────
              Le bouton « Demander l'activation » qui menait au formulaire de
              contact n'a plus lieu d'être : la commande se fait au-dessus, sur
              la page. Ce panneau ne garde que ce qui aide à décider. */}
          <aside className="flex flex-col gap-5 rounded-frame bg-ink p-8 text-white lg:sticky lg:top-32">
            <EyebrowLabel tone="frost">Bon à savoir</EyebrowLabel>

            <div className="flex flex-col gap-1.5">
              <span className="text-[0.75rem] text-white/50">À partir de</span>
              <span className="text-[2rem] leading-none font-medium tracking-[-0.02em] tabular-nums">
                {libellePrixFormule(entree)}
              </span>
              <span className="text-[0.875rem] text-white/60">
                {DUREE_LABELS[entree.duree]}, formule {entree.nom}
              </span>
            </div>

            <span className="inline-flex items-center gap-2 text-[0.875rem] text-white/60">
              <Clock size={14} aria-hidden />
              {abonnement.delaiActivation}
            </span>

            <Button asChild variant="ghostOnDark" size="lg" className="w-full">
              <Link href="/contact">Poser une question</Link>
            </Button>

            <p className="text-[0.8125rem] leading-relaxed text-white/50">
              Prix indicatif, révisé selon le taux de change au moment du
              règlement. Le montant exact vous est confirmé avant paiement.
            </p>
          </aside>
        </div>

        {/* ───────────── Maillage vers la même catégorie ───────────── */}
        {voisins.length > 0 ? (
          <div className="mt-20 flex flex-col gap-8">
            <EyebrowLabel>
              {categorie ? categorie.nom : "Dans la même catégorie"}
            </EyebrowLabel>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {voisins.map((voisin) => {
                const entreeVoisin = getFormuleEntree(voisin);

                return (
                  <li key={voisin.slug}>
                    <Link
                      href={`/abonnements/${voisin.slug}`}
                      className="group/lien flex h-full flex-col gap-3 rounded-frame border border-mist/60 bg-white p-6 transition-[border-color,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-slate"
                    >
                      <span className="flex items-center gap-3">
                        <MarqueLogo
                          src={voisin.logo}
                          nom={voisin.nom}
                          className="size-[22px] shrink-0 object-contain"
                        />
                        <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                          {voisin.nom}
                        </span>
                      </span>
                      <span className="text-[0.9375rem] leading-relaxed text-graphite">
                        {voisin.accroche}
                      </span>
                      <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[0.875rem] text-ink">
                        À partir de {libellePrixFormule(entreeVoisin)}
                        <ArrowRight
                          size={15}
                          aria-hidden
                          className="transition-transform duration-200 ease-out-soft group-hover/lien:translate-x-1"
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </Container>
    </>
  );
}
