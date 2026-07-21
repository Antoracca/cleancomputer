"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PILLARS } from "@/lib/config/navigation";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { MarqueLogo } from "@/components/shared/MarqueLogo";
import { cn } from "@/lib/utils/cn";

/**
 * MEGA-MENU
 *
 * Extension nécessaire au projet : Clean Computer porte cinq métiers, un
 * simple survol de lien ne suffit pas à les rendre lisibles.
 *
 * La pilule de navigation garde sa forme ; le panneau qui s'ouvre est une
 * carte à 40px de rayon posée juste dessous. Chaque pilier montre un aperçu
 * visuel — c'est une vitrine, pas une liste de liens.
 */
export function MegaMenu({
  openPillar,
  onClose,
}: {
  openPillar: string | null;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "mx-auto hidden max-w-[1280px] lg:block",
        "transition-[opacity,transform] duration-300 ease-out-soft",
        openPillar
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      {PILLARS.map((pillar) => {
        if (pillar.id !== openPillar) return null;

        return (
          <div
            key={pillar.id}
            className="mt-3 overflow-hidden rounded-frame bg-white shadow-frame"
          >
            <div className="grid grid-cols-[1fr_auto] gap-12 p-10">
              {/* Colonne liens */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <EyebrowLabel>{pillar.label}</EyebrowLabel>
                  <p className="max-w-sm text-title text-ink">{pillar.intro}</p>
                </div>

                {/* Abonnements porte 18 entrées : la liste dépassait la hauteur
                    du panneau et les dernières marques étaient inatteignables.
                    Hauteur plafonnée à la fenêtre, défilement sans barre
                    visible, et un fondu en bas qui signale qu'il reste du
                    contenu. Sans ce fondu, un défilement invisible ne se
                    devine pas. */}
                <ul
                  className={cn(
                    "grid grid-cols-2 gap-x-10 gap-y-1",
                    // Seules les listes réellement longues sont plafonnées.
                    // Appliqué partout, le fondu rognerait la dernière ligne
                    // de Design ou de Transfert, qui tiennent sans déborder.
                    pillar.links.length > 10 &&
                      "max-h-[min(26rem,50vh)] overflow-y-auto scroll-discret [mask-image:linear-gradient(to_bottom,black_calc(100%-2.5rem),transparent)]",
                  )}
                >
                  {pillar.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="group/link flex items-center justify-between gap-4 rounded-action py-2.5 pr-3 text-body text-graphite transition-colors hover:text-brand"
                      >
                        <span className="flex items-center gap-2">
                          {link.logo ? (
                            <MarqueLogo
                              src={link.logo}
                              nom={link.label}
                              className="size-5 opacity-70 transition-opacity group-hover/link:opacity-100"
                            />
                          ) : null}
                          {link.label}
                          {link.note ? (
                            <span className="rounded-pill bg-ghost px-2.5 py-0.5 text-[0.6875rem] font-bold tracking-[0.04em] text-brand uppercase">
                              {link.note}
                            </span>
                          ) : null}
                        </span>
                        <ArrowRight
                          size={15}
                          aria-hidden
                          className="-translate-x-1 opacity-0 transition-[transform,opacity] duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Aperçus visuels — cercles, jamais de vignettes rectangulaires.
                  Deux colonnes fixes : à quatre aperçus, la rangée unique
                  poussait la colonne de liens hors du panneau. */}
              {pillar.previews.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-5 gap-y-7 border-l border-ghost pl-12">
                  {pillar.previews.map((preview) => (
                    <Link
                      key={preview.href + preview.label}
                      href={preview.href}
                      onClick={onClose}
                      className="group/preview flex w-[124px] flex-col items-center gap-3.5 text-center"
                    >
                      <div className="relative size-[124px] overflow-hidden rounded-full bg-ghost">
                        <Image
                          src={preview.image}
                          alt=""
                          fill
                          sizes="124px"
                          className="object-cover transition-transform duration-500 ease-out-soft group-hover/preview:scale-105"
                        />
                      </div>
                      <span className="text-[0.9375rem] font-medium text-ink transition-colors group-hover/preview:text-brand">
                        {preview.label}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
