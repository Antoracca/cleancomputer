import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { PortraitCircle } from "@/components/shared/PortraitCircle";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { OrbitArc } from "@/components/motion/OrbitArc";
import { FAMILLES } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services informatiques",
  description:
    "Systèmes et postes, infrastructure, développement, identité visuelle. Quatre familles de prestations, un seul interlocuteur à Bangui.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Quatre familles de prestations, un seul interlocuteur."
        intro="Du poste de travail au site e-commerce, en passant par le réseau et l'identité visuelle. Vous n'avez qu'un numéro à appeler."
      />

      <Container className="pb-24">
        <div className="relative grid grid-cols-1 gap-20 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-12 lg:items-start lg:gap-x-6 lg:gap-y-28">
          <OrbitArc
            variant="sweep-right"
            className="top-[10%] left-[26%] h-[220px] w-[48%]"
          />
          <OrbitArc
            variant="sweep-left"
            className="top-[52%] left-[18%] h-[200px] w-[54%]"
          />

          {FAMILLES.map((famille, index) => (
            <div
              key={famille.slug}
              className={`relative z-10 ${
                [
                  "lg:col-start-1 lg:col-span-5 lg:row-start-1",
                  "lg:col-start-8 lg:col-span-5 lg:row-start-1 lg:translate-y-24",
                  "lg:col-start-2 lg:col-span-5 lg:row-start-2",
                  "lg:col-start-8 lg:col-span-5 lg:row-start-2 lg:translate-y-20",
                ][index]
              }`}
            >
              <PortraitCircle
                image={famille.image}
                alt={famille.nom}
                eyebrow={famille.nom}
                title={famille.accroche}
                description={`${famille.prestations.length} prestations`}
                href={`/services-informatiques/${famille.slug}`}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </Container>

      {/* Passerelle vers le configurateur */}
      <section className="mt-24 md:mt-40">
        <Container>
          <div className="flex flex-col gap-8 rounded-frame bg-ink px-8 py-16 md:px-16 md:py-20">
            <EyebrowLabel tone="frost">Devis immédiat</EyebrowLabel>
            <h2 className="max-w-2xl text-display text-white">
              Un projet de site ou d&apos;application ? Chiffrez-le vous-même.
            </h2>
            <p className="max-w-lg text-body text-white/70">
              Le prix se met à jour à chaque choix. Vous repartez avec un devis
              en PDF, sans attendre qu&apos;on vous rappelle.
            </p>
            <div>
              <Button
                asChild
                size="lg"
                className="border-white bg-white text-ink hover:border-white/80 hover:bg-white/90"
              >
                <Link href="/devis">Lancer le configurateur</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
