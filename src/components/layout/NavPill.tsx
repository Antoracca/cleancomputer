"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { PILLARS } from "@/lib/config/navigation";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/features/recherche/SearchOverlay";
import { nombreArticles, usePanier } from "@/features/panier/store";
import { cn } from "@/lib/utils/cn";

/**
 * NAVIGATION FLOTTANTE
 *
 * Pilule blanche à 999px flottant 24px sous le haut du viewport. Elle ne
 * touche jamais y=0 — c'est ce décollement qui la fait lire comme un objet
 * posé sur le canevas plutôt que comme une barre système.
 *
 * La forme pilule est préservée à TOUS les paliers ; seul le contenu se réduit.
 */
export function NavPill() {
  const pathname = usePathname();
  const [openPillar, setOpenPillar] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Compteur du panier — lu après montage uniquement : le serveur ne connaît
  // pas le localStorage, afficher le compte au premier rendu créerait un
  // décalage d'hydratation.
  const lignes = usePanier((s) => s.lignes);
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  const articles = monte ? nombreArticles(lignes) : 0;

  // Toute navigation referme les panneaux — sinon le menu survit à la
  // transition de page et donne une impression de désynchronisation.
  useEffect(() => {
    setOpenPillar(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenPillar(null);
        setMobileOpen(false);
        setSearchOpen(false);
      }
      // Ctrl+K / ⌘K — le raccourci attendu de toute interface moderne.
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-action focus:bg-ink focus:px-5 focus:py-3 focus:text-frost"
      >
        Aller au contenu
      </a>

      <header
        className="fixed inset-x-0 top-6 z-50 px-4 md:px-12"
        onMouseLeave={() => setOpenPillar(null)}
      >
        <nav
          aria-label="Navigation principale"
          className={cn(
            "mx-auto flex h-16 max-w-[1280px] items-center justify-between",
            "rounded-pill bg-white/85 px-4 shadow-nav backdrop-blur-xl md:px-6",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-pill py-2 pr-3 pl-2"
            aria-label="Clean Computer — accueil"
          >
            {/* Le logo complet n'apparaît qu'à partir de lg.
                Entre 640 et 1024px, la pilule porte déjà cinq liens et quatre
                icônes : le lettrage s'y écrasait et se coupait. En dessous de
                lg, seul le pictogramme est affiché — il reste lisible à toute
                taille et ne subit aucune compression.
                `shrink-0` est indispensable : sans lui, le conteneur flex
                comprime l'image avant les liens. */}
            <Image
              src="/brand/logo-full.png"
              alt="Clean Computer"
              width={336}
              height={91}
              priority
              className="hidden h-7 w-auto shrink-0 lg:block"
            />
            <Image
              src="/brand/logo-mark.png"
              alt="Clean Computer"
              width={512}
              height={512}
              priority
              className="size-9 shrink-0 object-contain lg:hidden"
            />
          </Link>

          {/* Liens piliers — desktop */}
          <ul className="hidden items-center lg:flex">
            {PILLARS.map((pillar) => {
              const active = pathname.startsWith(pillar.href);
              return (
                <li key={pillar.id}>
                  <Link
                    href={pillar.href}
                    onMouseEnter={() => setOpenPillar(pillar.id)}
                    onFocus={() => setOpenPillar(pillar.id)}
                    aria-expanded={openPillar === pillar.id}
                    className={cn(
                      "relative flex h-16 items-center px-4 text-action font-medium",
                      "transition-colors duration-200",
                      active || openPillar === pillar.id
                        ? "text-brand"
                        : "text-ink hover:text-brand",
                    )}
                  >
                    {pillar.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-4 bottom-4 h-px origin-left bg-brand",
                        "transition-transform duration-300 ease-out-soft",
                        openPillar === pillar.id ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1">
            <IconButton
              label="Rechercher (Ctrl+K)"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={19} strokeWidth={1.75} />
            </IconButton>
            <IconButton label="Mon compte" href="/compte" className="hidden sm:grid">
              <User size={19} strokeWidth={1.75} />
            </IconButton>
            <IconButton
              label={articles > 0 ? `Panier, ${articles} article${articles > 1 ? "s" : ""}` : "Panier"}
              href="/panier"
              className="relative"
            >
              <ShoppingBag size={19} strokeWidth={1.75} />
              {articles > 0 ? (
                <span
                  aria-hidden
                  className="absolute top-1 right-1 grid min-w-4.5 place-items-center rounded-pill bg-brand px-1 text-[0.625rem] leading-4 font-bold text-white tabular-nums"
                >
                  {articles > 9 ? "9+" : articles}
                </span>
              ) : null}
            </IconButton>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ghost lg:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mega-menu desktop */}
        <MegaMenu
          openPillar={openPillar}
          onClose={() => setOpenPillar(null)}
        />
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function IconButton({
  children,
  label,
  href,
  className,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  const classes = cn(
    "grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ghost",
    className,
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
