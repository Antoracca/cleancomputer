import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { OrdinateurCard } from "@/features/catalogue/OrdinateurCard";
import { COMPANY, PHONE_HREF } from "@/lib/config/company";
import { ORDINATEURS } from "@/lib/data/ordinateurs";

export const metadata: Metadata = {
  title: "Ordinateurs portables",
  description:
    "Portables HP neufs à Bangui : bureautique, professionnel et gaming. État vérifié, caractéristiques détaillées, plusieurs vues par machine.",
};

export default function OrdinateursPage() {
  const neufs = ORDINATEURS.filter((o) => o.etat === "neuf").length;

  return (
    <>
      <PageHeader
        eyebrow="Ordinateurs"
        title="Des machines vérifiées, pas des promesses."
        intro="Chaque portable est photographié sous cinq angles, avec son état, son score de santé et sa référence constructeur. Vous savez exactement ce que vous achetez."
        meta={[
          `${ORDINATEURS.length} machines en stock`,
          `${neufs} neuves`,
          "Installation incluse",
        ]}
      />

      <Container className="pb-24">
        <ul className="grid gap-6 lg:grid-cols-2">
          {ORDINATEURS.map((o, i) => (
            <li key={o.slug}>
              <OrdinateurCard ordinateur={o} priority={i < 2} />
            </li>
          ))}
        </ul>

        {/* Comment on note l'état */}
        <section className="mt-20 flex flex-col gap-6 rounded-frame bg-frost-lifted px-8 py-12 md:px-14">
          <EyebrowLabel>Notre façon de noter</EyebrowLabel>
          <h2 className="max-w-2xl text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
            Ce que veulent dire nos scores.
          </h2>

          <dl className="grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <dt className="text-[0.9375rem] font-medium text-ink">
                Neuf, 10 sur 10
              </dt>
              <dd className="text-[0.9375rem] leading-relaxed text-graphite">
                Jamais utilisé, scellé d&apos;origine, garantie constructeur
                pleine.
              </dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="text-[0.9375rem] font-medium text-ink">
                Quasi neuf, 8 à 9
              </dt>
              <dd className="text-[0.9375rem] leading-relaxed text-graphite">
                Très peu servi, aucune trace visible. Batterie et écran testés.
              </dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="text-[0.9375rem] font-medium text-ink">
                Occasion, 5 à 7
              </dt>
              <dd className="text-[0.9375rem] leading-relaxed text-graphite">
                Utilisé et remis en état. Les marques d&apos;usage sont
                photographiées, pas dissimulées.
              </dd>
            </div>
          </dl>

          <p className="max-w-2xl text-[0.875rem] leading-relaxed text-slate">
            Le score porte sur l&apos;état physique et le fonctionnement, pas sur
            la puissance. Une machine ancienne en parfait état peut être notée 10
            si elle est neuve.
          </p>
        </section>

        {/* Aide */}
        <section className="mt-8 flex flex-col gap-6 rounded-frame bg-ink px-8 py-12 md:flex-row md:items-center md:justify-between md:px-14">
          <div className="flex flex-col gap-3">
            <p className="max-w-lg text-[1.25rem] leading-snug font-medium tracking-[-0.02em] text-white">
              Vous hésitez entre deux machines ?
            </p>
            <p className="max-w-md text-[0.9375rem] leading-relaxed text-white/60">
              Dites-nous ce que vous en ferez. On vous oriente vers celle qui
              convient, pas vers la plus chère.
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
        </section>
      </Container>
    </>
  );
}
