"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { formatXAF } from "@/lib/format/currency";
import {
  montantLigne,
  prixUnitaire,
  type LigneDevis,
} from "@/features/devis/types";
import { appliquerOption, groupesPour } from "@/features/devis/options";
import { useDevis } from "@/features/devis/store";
import { cn } from "@/lib/utils/cn";

/**
 * LES LIGNES DU DEVIS, ÉDITABLES
 *
 * Quantité, prix et remise se corrigent ici, jamais sur le document. Rendre le
 * document lui-même modifiable donnerait un rendu approximatif et laisserait
 * croire qu'on peut y écrire n'importe où.
 *
 * LE PRIX EST MODIFIABLE, Y COMPRIS SUR UN ARTICLE DU CATALOGUE
 *
 * C'est délibéré. Une négociation réelle sort du tarif affiché, et un outil
 * qui l'interdit se fait contourner à la main dans un tableur. Le tarif
 * catalogue reste le point de départ, il n'est pas une prison.
 */
export function LignesDevis() {
  const lignes = useDevis((s) => s.devis.lignes);
  const changerQuantite = useDevis((s) => s.changerQuantite);
  const changerRemise = useDevis((s) => s.changerRemiseLigne);
  const changerPrix = useDevis((s) => s.changerPrix);
  const retirer = useDevis((s) => s.retirerLigne);
  const monter = useDevis((s) => s.monterLigne);
  const descendre = useDevis((s) => s.descendreLigne);

  if (lignes.length === 0) {
    return (
      <p className="rounded-frame bg-frost px-5 py-8 text-center text-[0.9375rem] leading-relaxed text-graphite">
        Aucun article pour l&apos;instant.
        <br />
        Cherchez ci-dessus, le document se remplit à mesure.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {lignes.map((ligne, i) => (
        <li
          key={ligne.id}
          className="flex flex-col gap-3 rounded-frame border border-mist/70 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="flex min-w-0 flex-col">
              <span className="text-[0.9375rem] font-medium text-ink">
                {ligne.designation}
              </span>
              <span className="text-[0.8125rem] text-slate">
                {ligne.marque || "Hors catalogue"}
              </span>
            </span>

            <span className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => monter(ligne.id)}
                disabled={i === 0}
                aria-label="Monter la ligne"
                className="grid size-8 place-items-center rounded-full text-slate transition-colors hover:bg-ghost hover:text-ink disabled:opacity-25"
              >
                <ChevronUp size={15} />
              </button>
              <button
                type="button"
                onClick={() => descendre(ligne.id)}
                disabled={i === lignes.length - 1}
                aria-label="Descendre la ligne"
                className="grid size-8 place-items-center rounded-full text-slate transition-colors hover:bg-ghost hover:text-ink disabled:opacity-25"
              >
                <ChevronDown size={15} />
              </button>
              <button
                type="button"
                onClick={() => retirer(ligne.id)}
                aria-label={`Retirer ${ligne.designation}`}
                className="grid size-8 place-items-center rounded-full text-slate transition-colors hover:bg-ghost hover:text-danger"
              >
                <Trash2 size={15} />
              </button>
            </span>
          </div>

          {/* `min-w-0` sur chaque colonne : sans lui, un champ de saisie garde
              sa largeur intrinsèque et refuse de se comprimer, ce qui faisait
              déborder la remise hors de la carte. */}
          <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,5.5rem)] items-end gap-2.5">
            {/* Quantité */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[0.75rem] text-slate">Quantité</span>
              <div className="flex items-center rounded-pill border border-mist bg-white">
                <button
                  type="button"
                  onClick={() => changerQuantite(ligne.id, ligne.quantite - 1)}
                  aria-label="Diminuer"
                  className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ghost"
                >
                  <Minus size={13} />
                </button>
                <span className="min-w-8 text-center text-[0.9375rem] font-medium tabular-nums">
                  {ligne.quantite}
                </span>
                <button
                  type="button"
                  onClick={() => changerQuantite(ligne.id, ligne.quantite + 1)}
                  aria-label="Augmenter"
                  className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ghost"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Prix unitaire */}
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-[0.75rem] text-slate">P. unitaire</span>
              <input
                type="text"
                inputMode="numeric"
                value={ligne.prixUnitaireXaf}
                onChange={(e) =>
                  changerPrix(ligne.id, Number(e.target.value.replace(/\D/g, "")))
                }
                className="min-h-9 w-full min-w-0 rounded-action border-[1.5px] border-mist bg-white px-3 text-[0.875rem] text-ink tabular-nums transition-colors outline-none focus:border-ink"
              />
            </label>

            {/* Remise de ligne */}
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-[0.75rem] text-slate">Remise %</span>
              <input
                type="text"
                inputMode="numeric"
                value={ligne.remisePct}
                onChange={(e) =>
                  changerRemise(ligne.id, Number(e.target.value.replace(/\D/g, "")))
                }
                className="min-h-9 w-full min-w-0 rounded-action border-[1.5px] border-mist bg-white px-3 text-[0.875rem] text-ink tabular-nums transition-colors outline-none focus:border-ink"
              />
            </label>
          </div>

          <OptionsLigne ligne={ligne} />

          <div className="flex items-baseline justify-between gap-3 border-t border-mist/60 pt-2.5">
            <span className="text-[0.8125rem] text-slate tabular-nums">
              {ligne.quantite} × {formatXAF(prixUnitaire(ligne))}
            </span>
            <span className="text-[1.0625rem] font-medium text-ink tabular-nums">
              {formatXAF(montantLigne(ligne))}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ────────────────────────── options ────────────────────────── */

/**
 * Les options d'une ligne, repliées par défaut.
 *
 * Dépliées d'office, six groupes sur un ordinateur portable feraient une
 * colonne de deux mètres et noieraient les lignes suivantes. Le bouton dit
 * combien d'options sont retenues, donc on sait s'il y a quelque chose à voir
 * sans avoir à ouvrir.
 */
function OptionsLigne({ ligne }: { readonly ligne: LigneDevis }) {
  const [ouvert, setOuvert] = useState(false);
  const changerOptions = useDevis((s) => s.changerOptions);

  const groupes = groupesPour(ligne.source, ligne.famille, ligne.reference);
  if (groupes.length === 0) return null;

  const retenus = new Set(ligne.options.map((o) => o.id));

  return (
    <div className="border-t border-mist/60 pt-2.5">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-[0.8125rem] font-medium text-graphite">
          <SlidersHorizontal size={14} aria-hidden />
          Configurer
          {ligne.options.length > 0 ? (
            <span className="rounded-pill bg-ink px-2 py-0.5 text-[0.6875rem] text-frost tabular-nums">
              {ligne.options.length}
            </span>
          ) : null}
        </span>
        <ChevronDown
          size={15}
          aria-hidden
          className={cn(
            "shrink-0 text-slate transition-transform duration-200 ease-out-soft",
            ouvert && "rotate-180",
          )}
        />
      </button>

      {ouvert ? (
        <div className="mt-3 flex flex-col gap-3.5">
          {groupes.map((groupe) => (
            <div key={groupe.id} className="flex flex-col gap-1.5">
              <span className="text-[0.75rem] text-slate">{groupe.label}</span>
              <div className="flex flex-wrap gap-1.5">
                {groupe.options.map((option) => {
                  const actif = retenus.has(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        changerOptions(
                          ligne.id,
                          appliquerOption(ligne.options, groupe, option),
                        )
                      }
                      aria-pressed={actif}
                      title={option.detail}
                      className={cn(
                        "rounded-pill px-3 py-1.5 text-[0.8125rem] transition-colors",
                        actif
                          ? "bg-ink text-frost"
                          : "bg-ghost text-graphite hover:bg-mist/60 hover:text-ink",
                      )}
                    >
                      {option.label}
                      {option.surcoutXaf !== 0 ? (
                        <span
                          className={cn(
                            "ml-1.5 tabular-nums",
                            actif ? "text-frost/70" : "text-slate",
                          )}
                        >
                          {option.surcoutXaf > 0 ? "+" : "−"}
                          {formatXAF(Math.abs(option.surcoutXaf))}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
