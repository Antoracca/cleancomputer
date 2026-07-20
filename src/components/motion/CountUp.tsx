"use client";

import { useEffect, useRef, useState } from "react";

/**
 * COMPTEUR ANIMÉ AU SCROLL
 *
 * Se déclenche une seule fois, à l'entrée dans le viewport. Courbe d'easing
 * sortante : le chiffre ralentit en approchant de sa valeur, ce qui se lit
 * comme un compteur mécanique plutôt que comme une interpolation linéaire.
 *
 * Respecte `prefers-reduced-motion` : la valeur finale s'affiche directement.
 */
export function CountUp({
  to,
  suffix = "",
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // easeOutExpo — décélération marquée en fin de course
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setValue(Math.round(eased * to));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat("fr-FR").format(value)}
      {suffix}
    </span>
  );
}
