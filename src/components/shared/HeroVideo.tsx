"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * VIDÉO HERO
 *
 * Trois corrections par rapport à la première version, qui ne démarrait pas
 * sur mobile :
 *
 * 1. `preload="none"` empêchait purement et simplement le chargement. Sans
 *    données, aucun navigateur ne peut déclencher la lecture automatique.
 *    Passé à `metadata`, la source est maintenant chargée à la demande.
 *
 * 2. La lecture est déclenchée EXPLICITEMENT par `play()`. Sur iOS et sur
 *    plusieurs navigateurs Android, l'attribut `autoplay` seul ne suffit pas :
 *    il faut un appel programmatique, même sur une vidéo muette.
 *
 * 3. Le filtre réseau excluait le type `3g`, ce qui bloquait la quasi-totalité
 *    des mobiles à Bangui. Seuls `2g` et `slow-2g` sont désormais écartés.
 *
 * Le poster reste affiché en permanence derrière la vidéo : il porte le LCP
 * et sert de repli si la lecture échoue, sans jamais laisser de trou noir.
 */

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

function peutCharger(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  const connexion = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;

  if (connexion?.saveData) return false;

  // Seules les connexions vraiment lentes sont écartées.
  const tropLent = ["slow-2g", "2g"];
  if (connexion?.effectiveType && tropLent.includes(connexion.effectiveType)) {
    return false;
  }

  return true;
}

export function HeroVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setActive(peutCharger());
  }, []);

  useEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;

    let annule = false;

    async function demarrer() {
      if (!video) return;
      try {
        video.muted = true;
        await video.play();
        if (!annule) setVisible(true);
      } catch {
        // Lecture refusée (mode économie d'énergie iOS, réglage navigateur).
        // Le poster reste affiché : l'utilisateur ne voit aucune anomalie.
        if (!annule) setVisible(false);
      }
    }

    if (video.readyState >= 2) {
      void demarrer();
    } else {
      video.addEventListener("loadeddata", demarrer, { once: true });
    }

    // La lecture peut être interrompue par le système au retour d'arrière-plan.
    function relancer() {
      if (document.visibilityState === "visible" && video?.paused) {
        void video.play().catch(() => {});
      }
    }
    document.addEventListener("visibilitychange", relancer);

    return () => {
      annule = true;
      video.removeEventListener("loadeddata", demarrer);
      document.removeEventListener("visibilitychange", relancer);
    };
  }, [active]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {active ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          disableRemotePlayback
          className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-out-soft ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}

      {/* Voile de lisibilité en deux couches : la source est une image claire,
          un simple dégradé vertical laissait le titre sous le seuil AA. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/62 to-ink/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-ink/25"
      />
    </div>
  );
}
