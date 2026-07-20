import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { formatXAFCompact } from "@/lib/format/currency";
import {
  DISPONIBILITE_LABELS,
  VEHICULES,
} from "@/lib/data/vehicules";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Véhicules & motos",
  description:
    "SUV Toyota, Mercedes et marques chinoises importés à Bangui. Prix rendu, dédouanement inclus.",
};

export default function VehiculesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Véhicules & motos"
        title="Le véhicule que vous cherchez, importé à votre nom."
        intro="Achat sur catalogue, expédition groupée, dédouanement pris en charge. Le prix affiché est le prix rendu à Bangui — pas un prix départ usine auquel s'ajouteront des frais."
        meta={[
          "Dédouanement inclus",
          "Prix rendu Bangui",
          "Suivi étape par étape",
        ]}
      />

      <Container className="pb-32">
        <ul className="grid gap-6 lg:grid-cols-2">
          {VEHICULES.map((vehicule) => (
            <li key={vehicule.slug}>
              <Link
                href={`/vehicules/${vehicule.slug}`}
                className="group/v flex h-full flex-col overflow-hidden rounded-frame border border-mist/60 bg-white transition-colors duration-300 hover:border-ink"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ghost">
                  <Image
                    src={vehicule.image}
                    alt={vehicule.nom}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out-soft group-hover/v:scale-105"
                  />
                  <span
                    className={cn(
                      "absolute top-4 left-4 rounded-pill px-3.5 py-1.5 text-[0.6875rem] font-bold tracking-[0.04em] uppercase backdrop-blur-sm",
                      vehicule.disponibilite === "en-stock"
                        ? "bg-success/90 text-white"
                        : vehicule.disponibilite === "en-transit"
                          ? "bg-warning/90 text-white"
                          : "bg-white/90 text-ink",
                    )}
                  >
                    {DISPONIBILITE_LABELS[vehicule.disponibilite]}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-eyebrow text-slate uppercase">
                        {vehicule.marque} · {vehicule.annee}
                      </span>
                      <h2 className="text-title text-ink">{vehicule.nom}</h2>
                    </div>
                    <ArrowUpRight
                      size={18}
                      aria-hidden
                      className="mt-1 shrink-0 text-slate transition-transform duration-200 group-hover/v:-translate-y-0.5 group-hover/v:translate-x-0.5 group-hover/v:text-ink"
                    />
                  </div>

                  <p className="text-body text-graphite">
                    {vehicule.description}
                  </p>

                  <ul className="flex flex-wrap gap-2 pt-1">
                    {vehicule.caracteristiques.slice(0, 3).map((c) => (
                      <li
                        key={c}
                        className="rounded-pill bg-frost px-3 py-1 text-[0.8125rem] text-graphite"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-auto pt-4 text-[1.25rem] font-medium tracking-[-0.02em] text-ink tabular-nums">
                    {formatXAFCompact(vehicule.prixXaf)}
                    <span className="ml-2 text-[0.8125rem] font-[450] text-slate">
                      rendu Bangui
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col gap-5 rounded-frame bg-frost-lifted px-8 py-12 md:px-12">
          <EyebrowLabel>Un modèle précis en tête ?</EyebrowLabel>
          <h2 className="max-w-2xl text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
            On peut sourcer presque n&apos;importe quel véhicule.
          </h2>
          <p className="max-w-lg text-[1.0625rem] leading-relaxed text-graphite">
            Le catalogue ci-dessus est ce qui est disponible ou en route.
            Au-delà, dites-nous marque, modèle et budget : nous cherchons chez
            nos fournisseurs en Chine et aux États-Unis, puis nous chiffrons le
            prix rendu à Bangui.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-action border-[1.5px] border-ink bg-ink px-8 text-body font-medium text-frost transition-colors hover:bg-charcoal"
            >
              Demander un véhicule
            </Link>
            <Link
              href="/transit-import"
              className="inline-flex min-h-12 items-center justify-center rounded-action border-[1.5px] border-ink bg-white px-8 text-body font-[450] text-ink transition-colors hover:bg-ink hover:text-frost"
            >
              Comment se passe l&apos;import
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
