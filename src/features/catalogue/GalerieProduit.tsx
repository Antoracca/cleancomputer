"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * GALERIE PRODUIT
 *
 * Vue principale, flèches de navigation et bande de miniatures. C'est le motif
 * des grands sites marchands, parce qu'il répond à la seule question qui compte
 * avant d'acheter une machine à plusieurs centaines de milliers de francs :
 * à quoi ressemble-t-elle vraiment, sous tous les angles.
 *
 * Détails qui font la différence :
 *
 * — Toutes les images sont préchargées dès le montage, mais seule la courante
 *   est visible. Le changement d'angle est donc instantané, sans le clignotement
 *   gris d'un chargement à la demande.
 *
 * — Les flèches bouclent : depuis la dernière image, on revient à la première.
 *   Un utilisateur qui parcourt les angles ne doit jamais tomber sur un bouton
 *   mort.
 *
 * — Navigation au clavier par les flèches gauche et droite quand la galerie a
 *   le focus.
 *
 * — Compteur « 2 / 5 » : on sait toujours combien il reste à voir.
 */
export function GalerieProduit({
  images,
  alt,
  priority = false,
}: {
  images: readonly string[];
  alt: string;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const aller = useCallback(
    (pas: number) => {
      setIndex((i) => (i + pas + total) % total);
    },
    [total],
  );

  useEffect(() => {
    function auClavier(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") aller(-1);
      if (e.key === "ArrowRight") aller(1);
    }
    window.addEventListener("keydown", auClavier);
    return () => window.removeEventListener("keydown", auClavier);
  }, [aller]);

  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="group/gal relative aspect-[4/3] overflow-hidden rounded-frame bg-white">
        {/* Toutes les vues sont montées : le passage d'un angle à l'autre est
            immédiat, sans rechargement visible. */}
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? alt : `${alt}, vue ${i + 1}`}
            fill
            priority={priority && i === 0}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className={cn(
              "object-contain p-6 transition-opacity duration-300 ease-out-soft",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {total > 1 ? (
          <>
            <FlecheGalerie sens="gauche" onClick={() => aller(-1)} />
            <FlecheGalerie sens="droite" onClick={() => aller(1)} />

            <span
              aria-live="polite"
              className="absolute right-4 bottom-4 rounded-pill bg-ink/80 px-3 py-1 text-[0.75rem] font-medium text-frost tabular-nums backdrop-blur-sm"
            >
              {index + 1} / {total}
            </span>
          </>
        ) : null}
      </div>

      {/* Miniatures */}
      {total > 1 ? (
        <ul className="grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Voir la vue ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-action border-2 bg-white transition-colors duration-200",
                  i === index
                    ? "border-ink"
                    : "border-transparent hover:border-mist",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain p-1.5"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function FlecheGalerie({
  sens,
  onClick,
}: {
  sens: "gauche" | "droite";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={sens === "gauche" ? "Vue précédente" : "Vue suivante"}
      className={cn(
        "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center",
        "rounded-full bg-white text-ink shadow-nav",
        "transition-[opacity,transform] duration-200 ease-out-soft",
        "hover:scale-110",
        // Toujours accessibles au doigt, révélées au survol à la souris.
        "opacity-100 md:opacity-0 md:group-hover/gal:opacity-100 md:focus-visible:opacity-100",
        sens === "gauche" ? "left-4" : "right-4",
      )}
    >
      {sens === "gauche" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
}
