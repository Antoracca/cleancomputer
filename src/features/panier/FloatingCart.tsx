"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { formatXAF } from "@/lib/format/currency";
import { nombreArticles, totalPanier, useMonte, usePanier } from "@/features/panier/store";
import { cn } from "@/lib/utils/cn";

/**
 * PANIER FLOTTANT
 *
 * Pastille fixée en bas à droite, qui n'apparaît qu'une fois le panier garni.
 * Elle évite l'aller-retour vers la navigation en haut de page quand on ajoute
 * plusieurs articles d'affilée depuis la grille.
 *
 * ⚠️ Une première version animait une « secousse » à chaque ajout, pilotée par
 * deux `useEffect` qui se déclenchaient mutuellement. Ils laissaient
 * l'animation d'entrée figée à opacité nulle : la pastille restait invisible
 * alors que le panier contenait bien un article.
 *
 * Le retour visuel est désormais porté par le seul compteur, qui change de
 * valeur à chaque ajout. Moins d'effet, mais un composant qui marche.
 *
 * Deux précautions conservées :
 *
 * — MASQUÉE sur le panier, le tunnel et la confirmation. Un raccourci vers la
 *   page où l'on se trouve déjà ne sert à rien et vole de la place.
 *
 * — Le compteur n'est lu qu'après montage : le serveur ignore le stockage
 *   local, l'afficher au premier rendu créerait une divergence d'hydratation.
 */
const ROUTES_MASQUEES = ["/panier", "/checkout", "/commande"];

export function FloatingCart() {
  const pathname = usePathname();
  const lignes = usePanier((s) => s.lignes);
  const monte = useMonte();

  const articles = monte ? nombreArticles(lignes) : 0;
  const total = monte ? totalPanier(lignes) : 0;

  const masquee = ROUTES_MASQUEES.some((r) => pathname.startsWith(r));
  const visible = monte && articles > 0 && !masquee;

  return (
    <div
      className={cn(
        "fixed right-5 bottom-5 z-50 md:right-8 md:bottom-8",
        "transition-[opacity,transform] duration-300 ease-out-soft",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <Link
        href="/panier"
        tabIndex={visible ? undefined : -1}
        aria-hidden={!visible}
        aria-label={`Voir le panier, ${articles} article${articles > 1 ? "s" : ""}, total ${formatXAF(total)}`}
        className="group/fc flex items-center gap-3 rounded-pill bg-ink py-3 pr-5 pl-3 text-frost shadow-frame transition-transform duration-200 ease-out-soft hover:scale-[1.03]"
      >
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white/10">
          <ShoppingCart size={18} strokeWidth={1.75} aria-hidden />
          <span
            aria-hidden
            className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-pill bg-brand px-1 text-[0.6875rem] leading-5 font-bold text-white tabular-nums"
          >
            {articles > 9 ? "9+" : articles}
          </span>
        </span>

        <span className="flex flex-col leading-tight">
          <span className="text-[0.75rem] text-frost/60">Mon panier</span>
          <span className="text-[0.9375rem] font-medium tabular-nums">
            {formatXAF(total)}
          </span>
        </span>

        <ArrowRight
          size={16}
          aria-hidden
          className="ml-1 transition-transform duration-200 group-hover/fc:translate-x-1"
        />
      </Link>
    </div>
  );
}
