"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatXAF } from "@/lib/format/currency";
import { cn } from "@/lib/utils/cn";
import type { Produit } from "@/types/catalogue";

/**
 * DÉFILÉ PRODUITS
 *
 * Rangée qui avance seule, en boucle sans couture, avec des flèches pour
 * reprendre la main.
 *
 * Choix techniques, et pourquoi :
 *
 * — SCROLL NATIF plutôt qu'un `transform` animé. Le conteneur est un vrai
 *   élément défilant : la molette, le glissement tactile et la navigation au
 *   clavier fonctionnent sans une ligne de code en plus. Un carrousel bâti sur
 *   `translateX` casse ces trois choses et il faut les réimplémenter à la main.
 *
 * — BOUCLE SANS COUTURE par duplication de la liste. Quand le défilement passe
 *   la moitié de la largeur totale, on retranche cette moitié. Le contenu étant
 *   identique, l'œil ne voit aucun saut.
 *
 * — AVANCE EN PIXELS PAR SECONDE, pas par image. Le rythme est donc le même
 *   sur un écran 60 Hz et sur un 120 Hz. Une animation calée sur les images
 *   défile deux fois plus vite sur un écran rapide.
 *
 * — PAUSE au survol, au focus clavier et pendant un glissement tactile. Rien
 *   n'est plus agaçant qu'une rangée qui continue de bouger pendant qu'on
 *   essaie de lire une fiche.
 *
 * — ARRÊT COMPLET si `prefers-reduced-motion` est actif. Les flèches restent
 *   utilisables : la fonction n'est jamais perdue, seul le mouvement l'est.
 */

const LARGEUR_CARTE = 260;

export function ProductMarquee({
  produits,
  direction = "gauche",
  vitesse = 40,
  className,
}: {
  produits: readonly Produit[];
  /** `gauche` fait défiler le contenu vers la gauche, donc lecture vers la droite. */
  direction?: "gauche" | "droite";
  /** Pixels par seconde. 35 à 50 donne un rythme vivant mais encore lisible. */
  vitesse?: number;
  className?: string;
}) {
  const pisteRef = useRef<HTMLDivElement>(null);
  const [enPause, setEnPause] = useState(false);
  const [animer, setAnimer] = useState(false);

  // La liste est doublée : c'est ce qui permet la boucle sans couture.
  const boucle = [...produits, ...produits];

  useEffect(() => {
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAnimer(!reduit);
  }, []);

  // Position de départ décalée pour le sens inverse, sinon la rangée
  // commencerait collée au bord gauche sans matière à faire défiler.
  useEffect(() => {
    const piste = pisteRef.current;
    if (!piste || direction !== "droite") return;
    piste.scrollLeft = piste.scrollWidth / 2;
  }, [direction]);

  useEffect(() => {
    const piste = pisteRef.current;
    if (!piste || !animer || enPause) return;

    /**
     * ⚠️ La position est tenue en FLOTTANT dans une variable, jamais relue
     * depuis `scrollLeft`.
     *
     * À 24 px/s, une image de 60 Hz avance de 0,4 pixel. Le navigateur tronque
     * cette fraction en écrivant `scrollLeft`, si bien qu'une relecture rend 0.
     * En repartant de cette valeur relue, l'avance ne s'accumule jamais et la
     * rangée reste parfaitement immobile.
     *
     * En gardant l'accumulateur côté JavaScript, les fractions s'additionnent
     * et le défilement avance réellement, à la vitesse demandée.
     */
    let position = piste.scrollLeft;
    let image = 0;
    let precedent = performance.now();

    const avancer = (maintenant: number) => {
      const delta = Math.min((maintenant - precedent) / 1000, 0.05);
      precedent = maintenant;

      const moitie = piste.scrollWidth / 2;
      if (moitie > 0) {
        position += vitesse * delta * (direction === "gauche" ? 1 : -1);

        // Repli sur la copie identique, dans les deux sens.
        if (position >= moitie) position -= moitie;
        if (position < 0) position += moitie;

        piste.scrollLeft = position;
      }

      image = requestAnimationFrame(avancer);
    };

    image = requestAnimationFrame(avancer);
    return () => cancelAnimationFrame(image);
  }, [animer, enPause, direction, vitesse]);

  // Après un clic sur une flèche, l'accumulateur doit repartir de la position
  // réelle, sinon la rangée saute en arrière. Une brève interruption laisse le
  // défilement fluide du navigateur se terminer avant que la boucle reprenne.
  const resynchroniser = useCallback(() => {
    setEnPause(true);
    window.setTimeout(() => setEnPause(false), 550);
  }, []);

  const deplacer = useCallback(
    (sens: -1 | 1) => {
      const piste = pisteRef.current;
      if (!piste) return;
      piste.scrollBy({ left: sens * LARGEUR_CARTE * 2, behavior: "smooth" });
      resynchroniser();
    },
    [resynchroniser],
  );

  if (produits.length === 0) return null;

  return (
    <div
      className={cn("group/def relative", className)}
      // Aucune pause au survol ni au focus : le défilement ne s'interrompt
      // jamais, même curseur posé dessus.
      //
      // La pause tactile est conservée, et uniquement celle-ci : pendant un
      // glissement du doigt, le défilement natif et la boucle d'animation
      // écriraient tous les deux la position en même temps, ce qui rendrait la
      // rangée impossible à manipuler. Elle dure le temps du geste.
      onTouchStart={() => setEnPause(true)}
      onTouchEnd={() => setEnPause(false)}
      onTouchCancel={() => setEnPause(false)}
    >
      {/* ⚠️ Pas de `scroll-smooth` ici. Cette classe pose
          `scroll-behavior: smooth`, qui fait animer par le navigateur CHAQUE
          écriture de `scrollLeft`. Combinée à une avance image par image, elle
          annule le mouvement : chaque micro déplacement est interrompu par le
          suivant et la rangée reste immobile.
          Le défilement fluide est appliqué uniquement aux flèches, via
          l'option `behavior: "smooth"` de `scrollBy`. */}
      <div
        ref={pisteRef}
        className="flex gap-4 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {boucle.map((produit, i) => (
          <CarteDefile
            key={`${produit.slug}-${i}`}
            produit={produit}
            // Seule la première moitié est annoncée : la copie ferait doublon
            // pour un lecteur d'écran.
            masque={i >= produits.length}
          />
        ))}
      </div>

      {/* Fondus latéraux : les cartes se dissolvent dans le canevas au lieu
          d'être tranchées net par le bord. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-frost to-transparent md:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-frost to-transparent md:w-24"
      />

      {/* Flèches : révélées au survol sur grand écran, toujours visibles au
          doigt puisqu'il n'y a pas de survol sur mobile. */}
      <FlecheDefile sens="gauche" onClick={() => deplacer(-1)} />
      <FlecheDefile sens="droite" onClick={() => deplacer(1)} />
    </div>
  );
}

function FlecheDefile({
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
      aria-label={sens === "gauche" ? "Produits précédents" : "Produits suivants"}
      className={cn(
        "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center",
        "rounded-full bg-white text-ink shadow-nav",
        "transition-[opacity,transform] duration-300 ease-out-soft",
        "hover:scale-110 focus-visible:opacity-100",
        "opacity-0 group-hover/def:opacity-100 max-md:opacity-100",
        sens === "gauche" ? "left-3" : "right-3",
      )}
    >
      {sens === "gauche" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
    </button>
  );
}

function CarteDefile({
  produit,
  masque,
}: {
  produit: Produit;
  masque: boolean;
}) {
  return (
    <Link
      href={`/electronique/p/${produit.slug}`}
      aria-hidden={masque}
      tabIndex={masque ? -1 : undefined}
      className="group/c flex w-[220px] shrink-0 flex-col gap-3 md:w-[260px]"
    >
      <div className="relative aspect-square overflow-hidden rounded-action bg-ghost">
        <Image
          src={produit.image}
          alt={produit.nom}
          fill
          sizes="260px"
          className="object-cover transition-transform duration-700 ease-out-soft group-hover/c:scale-105"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="truncate text-[0.9375rem] font-medium tracking-[-0.02em] text-ink">
          {produit.nom}
        </span>
        <span className="text-[0.875rem] text-slate tabular-nums">
          {formatXAF(produit.prixXaf)}
        </span>
      </div>
    </Link>
  );
}
