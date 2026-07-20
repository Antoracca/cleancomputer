"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export function LocalVideo({
  src,
  affiche,
  titre,
}: {
  src: string;
  affiche?: string;
  titre?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const conteneurRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const conteneur = conteneurRef.current;
    if (!video || !conteneur) return;

    const observateur = new IntersectionObserver(
      ([entree]) => {
        // `noUncheckedIndexedAccess` est actif : la déstructuration d'un
        // tableau rend le premier élément potentiellement absent. On sort tant
        // que l'observateur n'a rien transmis.
        if (!entree) return;
        setIsIntersecting(entree.isIntersecting);
        if (entree.isIntersecting) {
          video.play().then(() => setIsPlaying(true)).catch(() => {
            setIsPlaying(false);
          });
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.2 }
    );

    observateur.observe(conteneur);
    return () => observateur.disconnect();
  }, []);

  return (
    <div
      ref={conteneurRef}
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-frame bg-ink",
        // Ombre profonde et bordure de verre subtile (Apple-style)
        "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10",
        // Entrée fluide du conteneur
        "transition-all duration-1000 ease-out-soft",
        isIntersecting ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      )}
    >
      <video
        ref={videoRef}
        src={src}
        title={titre}
        muted
        loop
        playsInline
        controls={false}
        className={cn(
          "pointer-events-none absolute inset-0 size-full object-cover",
          // Effet "Ken Burns" : la vidéo dézoome doucement à l'intérieur de son cadre
          "transition-transform duration-[2500ms] ease-out-soft",
          isIntersecting ? "scale-100" : "scale-105"
        )}
      />

      {/* Affiche de secours au chargement */}
      {affiche && (
        <Image
          src={affiche}
          alt={titre || "Affiche vidéo"}
          fill
          sizes="(max-width: 1024px) 100vw, 1400px"
          className={cn(
            "pointer-events-none object-cover transition-opacity duration-1000 ease-out-soft",
            isPlaying ? "opacity-0" : "opacity-100"
          )}
        />
      )}
    </div>
  );
}
