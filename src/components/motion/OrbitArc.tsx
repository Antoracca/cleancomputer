"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * ARC ORBITAL — le motif signature
 *
 * Trait fin en Orbit Blue reliant deux portraits circulaires. Il implique une
 * connexion entre les services sans recourir à une flèche littérale : les
 * métiers forment une constellation, pas une liste.
 *
 * Deux règles héritées de la référence :
 * — le tracé doit sembler FAIT À LA MAIN. Une courbe de Bézier parfaitement
 *   régulière trahit le CSS ; l'irrégularité est volontaire.
 * — l'arc est RETIRÉ sous 768px : il n'a de sens qu'avec un placement
 *   asymétrique, qui disparaît en colonne unique.
 */

/** Tracés irréguliers — les points de contrôle sont volontairement décalés. */
const PATHS = {
  "sweep-right":
    "M 4 118 C 96 34, 214 8, 348 26 C 470 42, 556 92, 632 156 C 690 205, 736 244, 796 252",
  "sweep-left":
    "M 796 40 C 690 22, 578 58, 486 122 C 396 185, 322 238, 214 252 C 132 262, 62 240, 4 196",
  "dip":
    "M 4 40 C 118 176, 268 246, 400 250 C 534 254, 682 182, 796 44",
} as const;

export type OrbitVariant = keyof typeof PATHS;

export function OrbitArc({
  variant = "sweep-right",
  className,
}: {
  variant?: OrbitVariant;
  className?: string;
}) {
  const ref = useRef<SVGPathElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const path = ref.current;
    if (!path) return;

    // La longueur réelle du tracé alimente l'animation de dessin.
    const length = path.getTotalLength();
    path.style.setProperty("--cc-path-length", String(length));
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(path);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      aria-hidden
      viewBox="0 0 800 280"
      fill="none"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute hidden md:block",
        className,
      )}
    >
      <path
        ref={ref}
        d={PATHS[variant]}
        stroke="var(--color-orbit)"
        strokeWidth="1.25"
        strokeLinecap="round"
        className={drawn ? "animate-draw" : undefined}
      />
    </svg>
  );
}
