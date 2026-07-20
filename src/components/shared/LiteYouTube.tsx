"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * VIDÉO D'ARRIÈRE-PLAN DEPUIS YOUTUBE
 *
 * Rendu identique à la vidéo du hero : aucune commande, aucun bouton, aucune
 * interface YouTube visible à aucun moment.
 *
 * Trois corrections par rapport à la version précédente :
 *
 * 1. QUALITÉ. L'iframe était agrandie à 300% pour masquer d'éventuelles bandes
 *    noires. YouTube rendait donc la vidéo à taille réduite avant qu'on
 *    l'étire, d'où le flou. Le cadre et la vidéo étant tous deux en 16:9,
 *    aucun agrandissement n'est nécessaire : l'iframe occupe exactement le
 *    conteneur, à sa résolution native.
 *
 * 2. BOUTON DE LECTURE. Le lecteur affiche brièvement son icône avant que la
 *    lecture automatique ne démarre. L'affiche locale reste donc AU-DESSUS de
 *    l'iframe et ne s'efface qu'une fois ce moment passé. On ne voit jamais
 *    l'interface, seulement l'image puis la vidéo.
 *
 * 3. REPRISE. Le lecteur n'est plus démonté quand la section sort du champ.
 *    Il continue donc là où il en était au retour, au lieu de repartir de
 *    zéro. La vidéo étant muette, jouer hors écran ne gêne personne.
 *
 * ⚠️ Pourquoi un lecteur YouTube et pas un fichier local comme le hero :
 * la vidéo appartient à Microsoft. L'intégration par le lecteur YouTube est
 * couverte par leur licence de diffusion, la copie sur un serveur tiers non.
 */

type InfoReseau = { saveData?: boolean; effectiveType?: string };

function reseauSuffisant(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const c = (navigator as Navigator & { connection?: InfoReseau }).connection;
  if (c?.saveData) return false;
  if (c?.effectiveType && ["slow-2g", "2g"].includes(c.effectiveType)) return false;

  return true;
}

export function LiteYouTube({
  videoId,
  affiche,
  titre,
  debut,
  fin,
}: {
  videoId: string;
  affiche: string;
  titre: string;
  debut?: number;
  fin?: number;
}) {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const [charge, setCharge] = useState(false);
  const [afficheVisible, setAfficheVisible] = useState(true);
  const [autorise, setAutorise] = useState(false);

  useEffect(() => {
    setAutorise(reseauSuffisant());
  }, []);

  useEffect(() => {
    const noeud = conteneurRef.current;
    if (!noeud || !autorise || charge) return;

    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree?.isIntersecting) return;

        setCharge(true);
        observateur.disconnect();

        // L'affiche ne s'efface qu'une fois le démarrage passé, pour couvrir
        // l'icône de lecture que le player montre pendant son initialisation.
        window.setTimeout(() => setAfficheVisible(false), 2200);
      },
      { threshold: 0.35 },
    );

    observateur.observe(noeud);
    return () => observateur.disconnect();
  }, [autorise, charge]);

  const parametres = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    disablekb: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    iv_load_policy: "3",
    fs: "0",
    loop: "1",
    playlist: videoId,
    ...(debut !== undefined && { start: String(debut) }),
    ...(fin !== undefined && { end: String(fin) }),
  });

  return (
    <div
      ref={conteneurRef}
      className="relative aspect-video w-full overflow-hidden rounded-frame bg-ink"
    >
      {/* Le lecteur occupe exactement le cadre, sans mise à l'échelle : c'est
          ce qui préserve la définition d'origine. */}
      {charge ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${parametres}`}
          title={titre}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full border-0"
        />
      ) : null}

      {/* Affiche PAR-DESSUS le lecteur : elle masque l'initialisation, puis
          disparaît en fondu. Elle reste aussi le repli permanent si le réseau
          ne permet pas la lecture. */}
      <Image
        src={affiche}
        alt={titre}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 1400px"
        className={`pointer-events-none object-cover transition-opacity duration-1000 ease-out-soft ${
          afficheVisible ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
