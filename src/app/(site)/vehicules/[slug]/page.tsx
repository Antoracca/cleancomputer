import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { formatXAF } from "@/lib/format/currency";
import { COMPANY, PHONE_HREF } from "@/lib/config/company";
import {
  DISPONIBILITE_LABELS,
  VEHICULES,
  getVehicule,
} from "@/lib/data/vehicules";

export function generateStaticParams() {
  return VEHICULES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicule = getVehicule(slug);
  if (!vehicule) return { title: "Véhicule introuvable" };
  return {
    title: vehicule.nom,
    description: vehicule.description,
    openGraph: { images: [vehicule.image] },
  };
}

/**
 * FICHE VÉHICULE
 *
 * Pas de bouton « ajouter au panier » : un véhicule à plusieurs dizaines de
 * millions ne s'achète pas en un clic. Le parcours mène à une demande de
 * réservation et à un appel — ce qui correspond à la réalité de la vente.
 */
export default async function VehiculePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicule = getVehicule(slug);
  if (!vehicule) notFound();

  const [principale, ...secondaires] = vehicule.galerie;

  return (
    <Container className="pt-32 pb-32 md:pt-40">
      <Link
        href="/vehicules"
        className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-graphite transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} aria-hidden />
        Tous les véhicules
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* Galerie */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-frame bg-ghost">
            <Image
              src={principale ?? vehicule.image}
              alt={vehicule.nom}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>

          {secondaires.length > 0 ? (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {secondaires.map((image, i) => (
                <li key={image}>
                  <div className="relative aspect-square overflow-hidden rounded-action bg-ghost">
                    <Image
                      src={image}
                      alt={`${vehicule.nom} — vue ${i + 2}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Informations */}
        <div className="flex flex-col gap-8 lg:pt-4">
          <div className="flex flex-col gap-4">
            <EyebrowLabel>
              {vehicule.marque} · {vehicule.annee}
            </EyebrowLabel>
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.08] font-medium tracking-[-0.025em] text-ink">
              {vehicule.nom}
            </h1>
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-graphite">
              {vehicule.description}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[1.75rem] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
              {formatXAF(vehicule.prixXaf)}
            </span>
            <span className="text-[0.875rem] text-slate">
              Prix rendu à Bangui, dédouanement inclus
            </span>
          </div>

          <p className="text-[0.9375rem] text-graphite">
            Disponibilité :{" "}
            <strong className="font-medium text-ink">
              {DISPONIBILITE_LABELS[vehicule.disponibilite]}
            </strong>
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="sm:flex-1">
              <a href={PHONE_HREF}>
                <Phone size={17} aria-hidden />
                {COMPANY.phone}
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Demander une réservation</Link>
            </Button>
          </div>

          <ul className="flex flex-col gap-3 border-t border-mist/60 pt-8">
            {vehicule.caracteristiques.map((c) => (
              <li
                key={c}
                className="flex items-center gap-3 text-body text-graphite"
              >
                <Check size={16} aria-hidden className="shrink-0 text-brand" />
                {c}
              </li>
            ))}
          </ul>

          <p className="text-[0.8125rem] leading-relaxed text-slate">
            Prix indicatif soumis à confirmation au moment de la commande, les
            taux de fret et de change évoluant. Le prix ferme est confirmé par
            écrit avant tout versement.
          </p>
        </div>
      </div>
    </Container>
  );
}
