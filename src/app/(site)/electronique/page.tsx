import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Headphones, ShieldCheck, Store, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { ProductMarquee } from "@/features/catalogue/ProductMarquee";
import { CatalogueFiltre } from "@/features/catalogue/CatalogueFiltre";
import { OrdinateurCard } from "@/features/catalogue/OrdinateurCard";
import { chargerProduits } from "@/lib/data/catalogue-db";
import { ORDINATEURS } from "@/lib/data/ordinateurs";
import { COMPANY, PHONE_HREF } from "@/lib/config/company";

export const metadata: Metadata = {
  title: "Boutique électronique",
  description:
    "Téléphones, ordinateurs, téléviseurs, audio, réseau et logiciels. Matériel en stock à Bangui.",
};

export const revalidate = 60;

const GARANTIES = [
  {
    icone: Store,
    titre: "Retrait immédiat",
    texte: "Avenue Mubutu. Ce qui est en stock part le jour même.",
  },
  {
    icone: Truck,
    titre: "Livraison 24 h",
    texte: "Dans tout Bangui, payable à la remise en espèces.",
  },
  {
    icone: ShieldCheck,
    titre: "Matériel authentique",
    texte: "Garantie constructeur quand elle s'applique.",
  },
  {
    icone: Headphones,
    titre: "On reste joignable",
    texte: "Installation et après-vente avec les mêmes personnes.",
  },
] as const;

export default async function CataloguePage() {
  const produits = await chargerProduits();

  // Trois rangées de composition différente pour que le défilé ne répète pas
  // le même contenu à trois hauteurs. Chaque rangée part d'un point distinct
  // de la liste et avance dans un sens alterné.
  // Trois machines en tête de boutique : la plus haut de gamme, la plus
  // accessible et une professionnelle, pour couvrir les trois profils
  // d'acheteur plutôt que d'aligner trois modèles voisins.
  const arrivages = [
    ORDINATEURS.find((o) => o.slug === "hp-omen-max-16"),
    ORDINATEURS.find((o) => o.slug === "hp-15-fd0557nr"),
    ORDINATEURS.find((o) => o.slug === "hp-elitebook-840-g7"),
  ].filter((o): o is (typeof ORDINATEURS)[number] => Boolean(o));

  const tiers = Math.ceil(produits.length / 3);
  const rangees = [
    produits.slice(0, tiers * 2),
    [...produits.slice(tiers), ...produits.slice(0, tiers)],
    [...produits.slice(tiers * 2), ...produits.slice(0, tiers * 2)],
  ];

  return (
    <>
      <PageHeader
        eyebrow="Boutique"
        title="Du matériel disponible tout de suite."
        intro="Ce qui est affiché est en rayon à Bangui. Pas de commande fantôme, pas de délai découvert après paiement."
        meta={[
          `${produits.length} références en ligne`,
          "Retrait ou livraison",
          "Paiement à la remise",
        ]}
      />

      {/* ═══════════ DÉFILÉ — trois rangées, sens alternés ═══════════ */}
      <section aria-label="Aperçu du catalogue" className="overflow-hidden pb-6">
        <div className="flex flex-col gap-4">
          {/* Vitesses volontairement inégales : trois rangées au même rythme
              se liraient comme un seul bloc qui glisse. Le léger décalage
              donne de la profondeur. */}
          <ProductMarquee produits={rangees[0] ?? []} direction="gauche" vitesse={40} />
          <ProductMarquee produits={rangees[1] ?? []} direction="droite" vitesse={34} />
          <ProductMarquee produits={rangees[2] ?? []} direction="gauche" vitesse={46} />
        </div>
      </section>

      {/* ═══════════ NOUVEAUX ARRIVAGES — trois machines ═══════════ */}
      <section className="mt-16 md:mt-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="flex max-w-xl flex-col gap-5">
              <EyebrowLabel>Nouveaux arrivages</EyebrowLabel>
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
                Les machines qui viennent d&apos;arriver.
              </h2>
              <p className="text-[1.0625rem] leading-relaxed text-graphite">
                Cinq angles par machine, l&apos;état noté sur 10 et la référence
                constructeur affichée. Rien n&apos;est laissé au hasard.
              </p>
            </div>

            <Link
              href="/electronique/ordinateurs"
              className="group/lien inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-ink transition-colors hover:text-brand"
            >
              Voir les {ORDINATEURS.length} machines
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform duration-200 group-hover/lien:translate-x-1"
              />
            </Link>
          </div>

          {/* Trois cartes : la troisième passe sous les deux autres en dessous
              de 1280px, plutôt que de comprimer les trois sur une ligne trop
              étroite pour que les visuels restent lisibles. */}
          <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {arrivages.map((o, i) => (
              <li key={o.slug}>
                <OrdinateurCard ordinateur={o} priority={i === 0} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ═══════════ GARANTIES — bande de réassurance ═══════════ */}
      <section className="mt-16 md:mt-20">
        <Container>
          <dl className="grid grid-cols-1 gap-x-10 gap-y-8 border-y border-mist/70 py-10 sm:grid-cols-2 lg:grid-cols-4">
            {GARANTIES.map((g) => {
              const Icone = g.icone;
              return (
                <div key={g.titre} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ghost text-brand">
                    <Icone size={18} strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="flex flex-col gap-1">
                    <dt className="text-[0.9375rem] font-medium tracking-[-0.02em] text-ink">
                      {g.titre}
                    </dt>
                    <dd className="text-[0.875rem] leading-relaxed text-slate">
                      {g.texte}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </Container>
      </section>

      {/* ═══════════ CATALOGUE — filtres + grille ═══════════ */}
      <section className="mt-16 md:mt-20">
        <Container className="pb-24">
          <div className="mb-10 flex max-w-xl flex-col gap-4">
            <EyebrowLabel>Tout le catalogue</EyebrowLabel>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
              Trouvez ce qu&apos;il vous faut.
            </h2>
          </div>

          <CatalogueFiltre produits={produits} />
        </Container>
      </section>

      {/* ═══════════ AIDE — panneau de sortie ═══════════ */}
      <section className="pb-32">
        <Container>
          <div className="flex flex-col gap-8 rounded-frame bg-ink px-8 py-12 md:flex-row md:items-center md:justify-between md:px-14">
            <div className="flex flex-col gap-3">
              <EyebrowLabel tone="frost">Vous ne trouvez pas ?</EyebrowLabel>
              <p className="max-w-lg text-[1.25rem] leading-snug font-medium tracking-[-0.02em] text-white">
                Dites-nous ce que vous cherchez. Si ce n&apos;est pas en rayon,
                on le fait venir.
              </p>
              <p className="max-w-md text-[0.9375rem] leading-relaxed text-white/60">
                Import direct depuis la Chine ou les États-Unis, avec le prix
                rendu à {COMPANY.city} annoncé avant la commande.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a
                href={PHONE_HREF}
                className="inline-flex min-h-12 items-center justify-center rounded-action border-[1.5px] border-white bg-white px-7 text-body font-medium text-ink transition-colors hover:bg-white/90"
              >
                {COMPANY.phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-action border-[1.5px] border-white/40 px-7 text-body font-[450] text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
              >
                Nous écrire
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
