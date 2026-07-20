import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BadgeEtat, ScoreSante } from "@/features/catalogue/EtatMachine";
import { formatXAF } from "@/lib/format/currency";
import type { Ordinateur } from "@/types/ordinateur";

/**
 * CARTE ORDINATEUR
 *
 * Format éditorial large, réservé à la vitrine de l'accueil. Une machine à
 * plusieurs centaines de milliers de francs mérite plus qu'une vignette de
 * grille : on montre le produit en grand, l'état, trois arguments et le prix.
 *
 * La carte entière est cliquable et mène à la fiche détaillée, où se trouvent
 * la galerie complète et les caractéristiques.
 */
export function OrdinateurCard({
  ordinateur,
  priority = false,
}: {
  ordinateur: Ordinateur;
  priority?: boolean;
}) {
  const premiere = ordinateur.images[0];

  return (
    <Link
      href={`/electronique/ordinateurs/${ordinateur.slug}`}
      className="group/ord flex h-full flex-col overflow-hidden rounded-frame border border-mist/60 bg-white transition-colors duration-300 hover:border-ink"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-frost-lifted">
        {premiere ? (
          <Image
            src={premiere}
            alt={`${ordinateur.marque} ${ordinateur.modele}`}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-6 transition-transform duration-700 ease-out-soft group-hover/ord:scale-105"
          />
        ) : null}

        <span className="absolute top-4 left-4">
          <BadgeEtat etat={ordinateur.etat} />
        </span>

        {ordinateur.stock <= 2 ? (
          <span className="absolute top-4 right-4 rounded-pill bg-white/95 px-3 py-1 text-[0.6875rem] font-bold tracking-[0.04em] text-warning uppercase backdrop-blur-sm">
            {ordinateur.stock === 1 ? "Dernière pièce" : "Plus que 2"}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-7">
        <div className="flex flex-col gap-2">
          <span className="text-eyebrow text-slate uppercase">
            {ordinateur.marque} · {ordinateur.gamme}
          </span>
          <h3 className="text-title text-ink">{ordinateur.modele}</h3>
          <p className="text-body text-graphite">{ordinateur.accroche}</p>
        </div>

        <ul className="flex flex-col gap-1.5">
          {ordinateur.pointsCles.slice(0, 3).map((point) => (
            <li
              key={point}
              className="flex items-start gap-2.5 text-[0.9375rem] text-graphite"
            >
              <span
                aria-hidden
                className="mt-2 size-1 shrink-0 rounded-full bg-brand"
              />
              {point}
            </li>
          ))}
        </ul>

        <ScoreSante sante={ordinateur.sante} etat={ordinateur.etat} compact />

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-mist/60 pt-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.75rem] text-slate">Prix</span>
            <span className="text-[1.25rem] font-medium tracking-[-0.02em] text-ink tabular-nums">
              {formatXAF(ordinateur.prixXaf)}
            </span>
          </div>

          <span className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink transition-colors group-hover/ord:text-brand">
            Voir la fiche
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform duration-200 group-hover/ord:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
