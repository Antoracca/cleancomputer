import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";

export const metadata: Metadata = {
  title: "Design & branding",
  description:
    "Logo, charte graphique, refonte d'identité. Des marques reconnaissables, livrées avec leurs fichiers sources.",
};

const ETAPES = [
  {
    numero: "01",
    titre: "Comprendre",
    texte:
      "Ce que vous vendez, à qui, et ce qui vous distingue réellement de la boutique d'en face. Sans cette étape, un logo n'est qu'un dessin.",
  },
  {
    numero: "02",
    titre: "Explorer",
    texte:
      "Trois pistes visuelles franchement différentes. Pas trois variantes de la même idée pour donner l'illusion du choix.",
  },
  {
    numero: "03",
    titre: "Affiner",
    texte:
      "Deux tours de retouches sur la piste retenue. On teste sur les supports réels : enseigne, facture, écran de téléphone.",
  },
  {
    numero: "04",
    titre: "Livrer",
    texte:
      "Fichiers vectoriels, déclinaisons, règles d'usage. Vous repartez avec les sources, vous n'aurez pas à nous redemander.",
  },
] as const;

export default function DesignBrandingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Design & branding"
        title="Une identité qui tient debout partout."
        intro="Un logo différent sur chaque support, des couleurs qui changent d'un document à l'autre : votre entreprise paraît plus petite qu'elle ne l'est. On remet tout d'aplomb."
      />

      <Container className="pb-24">
        <ol className="grid gap-5 md:grid-cols-2">
          {ETAPES.map((etape) => (
            <li
              key={etape.numero}
              className="flex flex-col gap-4 rounded-frame border border-mist/60 bg-white p-8"
            >
              <span className="text-eyebrow text-brand uppercase tabular-nums">
                {etape.numero}
              </span>
              <h2 className="text-title text-ink">{etape.titre}</h2>
              <p className="text-body text-graphite">{etape.texte}</p>
            </li>
          ))}
        </ol>
      </Container>

      <section className="bg-frost-lifted py-24 md:py-32">
        <Container>
          <div className="flex max-w-2xl flex-col gap-6">
            <EyebrowLabel>Ce que vous recevez</EyebrowLabel>
            <h2 className="text-display text-ink">
              Les sources, systématiquement.
            </h2>
            <p className="text-body text-graphite">
              Un logo livré uniquement en image est un logo que vous ne pourrez
              jamais adapter. Chaque projet part avec ses fichiers vectoriels,
              ses déclinaisons et ses règles d&apos;usage, y compris si vous
              travaillez un jour avec quelqu&apos;un d&apos;autre.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/services-informatiques/identite">
                  Prestations & tarifs
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/realisations">Voir nos réalisations</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
