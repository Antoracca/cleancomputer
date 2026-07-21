import { cn } from "@/lib/utils/cn";

/**
 * LOGO DE MARQUE
 *
 * Toutes les marques n'ont pas de logo vectoriel officiel disponible. Pour
 * celles-là, le projet contenait des approximations dessinées à la main :
 * `canalplus.svg` était un rectangle noir avec le mot CANAL tapé en Arial,
 * `starlink.svg` était en réalité le logo SpaceX.
 *
 * Deux raisons de ne pas garder ces fichiers :
 *
 *   1. Un SVG chargé via <img> est un document isolé. Il n'hérite pas de la
 *      police du site, donc le texte retombe sur la police système et le rendu
 *      change d'un poste à l'autre.
 *   2. Une approximation de logo affichée comme le vrai logo est un faux, avec
 *      ce que ça implique côté marque.
 *
 * Le repli est donc typographique : le nom composé dans la police du site,
 * dans une pastille. Ça ne prétend pas être le logo officiel, c'est net, et
 * c'est identique partout.
 *
 * Dès qu'un vrai vectoriel est fourni (kits presse officiels), il suffit de
 * déposer le fichier et de retirer la marque de SANS_VECTORIEL.
 */

/** Marques dont aucun vectoriel authentique n'est disponible à ce jour. */
const SANS_VECTORIEL = new Set([
  "/media/logos/canalplus.svg",
  "/media/logos/mycanal.svg",
  "/media/logos/starlink.svg",
]);

export function MarqueLogo({
  src,
  nom,
  className,
}: {
  readonly src: string;
  readonly nom: string;
  readonly className?: string;
}) {
  if (SANS_VECTORIEL.has(src)) {
    return (
      <span
        className={cn(
          // `className` d'abord : on récupère l'opacité et la transition du
          // point d'appel, mais les classes qui suivent doivent gagner.
          className,
          "inline-flex shrink-0 items-center rounded-chip bg-ink px-2 py-0.5",
          "text-[0.6875rem] leading-none font-bold tracking-[-0.01em] whitespace-nowrap text-frost",
          // Les points d'appel passent `size-5` pour cadrer une icône carrée.
          // Sur une pastille de texte, ça l'écraserait à 20 px de large.
          "h-auto w-auto",
        )}
      >
        {nom}
      </span>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element -- SVG local, pas d'optimisation à faire
  return <img src={src} alt="" aria-hidden className={className} />;
}
