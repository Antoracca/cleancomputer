"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Package, Search, Wrench, X } from "lucide-react";
import { chercher } from "@/features/recherche/index-recherche";
import { cn } from "@/lib/utils/cn";

/**
 * RECHERCHE — superposition plein écran
 *
 * Instantanée : l'index vit en mémoire, chaque frappe filtre sans réseau.
 * Entièrement pilotable au clavier : ↑/↓ pour naviguer, Entrée pour ouvrir,
 * Échap pour fermer. Ctrl+K / ⌘K l'ouvre depuis n'importe quelle page.
 *
 * L'état vide propose des départs utiles plutôt qu'un écran blanc.
 */
const SUGGESTIONS = ["Starlink", "AirPods", "Chargeur", "Site web", "Windows 11"];

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [requete, setRequete] = useState("");
  const [actif, setActif] = useState(0);

  const resultats = useMemo(() => chercher(requete), [requete]);

  // Focus à l'ouverture, remise à zéro à la fermeture.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setActif(0);
    } else {
      setRequete("");
    }
  }, [open]);

  // Le fond ne défile pas derrière la superposition.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setActif(0), [requete]);

  function ouvrir(href: string) {
    onClose();
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    if (resultats.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActif((a) => (a + 1) % resultats.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActif((a) => (a - 1 + resultats.length) % resultats.length);
    }
    if (e.key === "Enter") {
      const resultat = resultats[actif];
      if (resultat) ouvrir(resultat.href);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rechercher sur le site"
      hidden={!open}
      className="fixed inset-0 z-100 flex items-start justify-center bg-ink/40 px-4 pt-24 backdrop-blur-sm md:pt-32"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex w-full max-w-xl flex-col overflow-hidden rounded-frame bg-white shadow-frame"
        onKeyDown={handleKeyDown}
      >
        {/* Champ */}
        <div className="flex items-center gap-3 border-b border-mist/60 px-6 py-4">
          <Search size={19} className="shrink-0 text-slate" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={requete}
            onChange={(e) => setRequete(e.target.value)}
            placeholder="Produit, service, marque…"
            aria-label="Rechercher"
            className="min-h-11 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-mist"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la recherche"
            className="grid size-10 shrink-0 place-items-center rounded-full text-slate transition-colors hover:bg-ghost hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {/* Résultats */}
        <div className="max-h-[55vh] overflow-y-auto overscroll-contain">
          {requete.trim().length < 2 ? (
            <div className="flex flex-col gap-4 p-6">
              <p className="text-eyebrow text-slate uppercase">Souvent cherché</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRequete(s)}
                    className="rounded-pill border border-mist px-4 py-2 text-[0.9375rem] text-graphite transition-colors hover:border-ink hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : resultats.length === 0 ? (
            <div className="flex flex-col gap-2 p-8 text-center">
              <p className="text-body font-medium text-ink">
                Rien pour « {requete} ».
              </p>
              <p className="text-[0.9375rem] text-graphite">
                Essayez une marque, une catégorie, ou appelez-nous — le stock
                bouge chaque semaine.
              </p>
            </div>
          ) : (
            <ul role="listbox" aria-label="Résultats">
              {resultats.map((r, i) => (
                <li key={r.href + r.titre} role="option" aria-selected={i === actif}>
                  <button
                    type="button"
                    onClick={() => ouvrir(r.href)}
                    onMouseEnter={() => setActif(i)}
                    className={cn(
                      "flex w-full items-center gap-4 px-6 py-3.5 text-left transition-colors",
                      i === actif ? "bg-frost" : "bg-transparent",
                    )}
                  >
                    {r.image ? (
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-ghost">
                        <Image
                          src={r.image}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ghost text-slate">
                        {r.type === "service" ? (
                          <Wrench size={17} strokeWidth={1.75} aria-hidden />
                        ) : (
                          <Package size={17} strokeWidth={1.75} aria-hidden />
                        )}
                      </span>
                    )}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[0.9875rem] font-medium text-ink">
                        {r.titre}
                      </span>
                      <span className="truncate text-[0.8125rem] text-slate">
                        {r.detail}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={15}
                      aria-hidden
                      className={cn(
                        "shrink-0 text-slate transition-opacity",
                        i === actif ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pied — raccourcis */}
        <div className="hidden items-center gap-4 border-t border-mist/60 px-6 py-3 text-[0.75rem] text-slate md:flex">
          <span><Kbd>↑↓</Kbd> naviguer</span>
          <span><Kbd>Entrée</Kbd> ouvrir</span>
          <span><Kbd>Échap</Kbd> fermer</span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-micro border border-mist bg-frost px-1.5 py-0.5 font-sans text-[0.6875rem] text-graphite">
      {children}
    </kbd>
  );
}
