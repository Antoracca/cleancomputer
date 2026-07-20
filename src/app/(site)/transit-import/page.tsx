import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";

export const metadata: Metadata = {
  title: "Transit & import",
  description:
    "Fret Chine ↔ Bangui, dédouanement, import de véhicules et de motos. Suivi étape par étape.",
};

const ETAPES = [
  {
    titre: "En Chine",
    texte: "Achat, contrôle avant expédition, groupage dans notre entrepôt.",
  },
  {
    titre: "En transit",
    texte: "Maritime ou aérien selon l'urgence et le volume. Numéro de suivi communiqué.",
  },
  {
    titre: "Dédouanement",
    texte: "Formalités douanières prises en charge. Droits et taxes annoncés avant l'arrivée.",
  },
  {
    titre: "Livré à Bangui",
    texte: "Retrait en entrepôt ou livraison à votre adresse.",
  },
] as const;

export default function TransitPage() {
  return (
    <>
      <PageHeader
        eyebrow="Transit & import"
        title="De Guangzhou à Bangui, étape par étape."
        intro="Vous suivez la marchandise, pas des promesses. Chaque étape est datée et communiquée."
      />

      <Container className="pb-24">
        {/* Les quatre étapes du transit, numérotées et reliées visuellement */}
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ETAPES.map((etape, index) => (
            <li
              key={etape.titre}
              className="relative flex flex-col gap-4 rounded-frame border border-mist/60 bg-white p-8"
            >
              <span className="text-eyebrow text-brand uppercase tabular-nums">
                Étape {index + 1}
              </span>
              <h2 className="text-title text-ink">{etape.titre}</h2>
              <p className="text-body text-graphite">{etape.texte}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col gap-4 rounded-frame bg-frost-lifted px-8 py-10 md:px-12">
          <EyebrowLabel>Les deux sens</EyebrowLabel>
          <h2 className="text-title text-ink">Chine → Bangui et Bangui → Chine</h2>
          <p className="max-w-2xl text-body text-graphite">
            L&apos;essentiel du volume va de la Chine vers Bangui, mais
            l&apos;expédition dans l&apos;autre sens est possible : échantillons,
            pièces, documents commerciaux.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/vehicules">Véhicules & motos</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/transit-import/carte">Suivre une expédition</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
