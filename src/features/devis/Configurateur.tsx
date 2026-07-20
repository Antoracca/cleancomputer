"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { formatXAF } from "@/lib/format/currency";
import { cn } from "@/lib/utils/cn";
import { ETAPES, calculer, type Selection } from "@/features/devis/bareme";
import { Recapitulatif } from "@/features/devis/Recapitulatif";

/**
 * CONFIGURATEUR DE DEVIS
 *
 * Le prix se recalcule à CHAQUE clic — c'est tout l'intérêt. Un formulaire qui
 * part et attend une réponse laisse le client dans le flou ; ici il voit
 * immédiatement l'effet de chaque choix, ce qui transforme un besoin vague en
 * décision.
 *
 * Le calcul est synchrone et local : aucune requête réseau, donc aucune
 * latence, ce qui compte sur une connexion instable.
 */
export function Configurateur() {
  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState<Selection>({});

  const chiffrage = useMemo(() => calculer(selection), [selection]);

  const etape = ETAPES[index];
  const termine = index >= ETAPES.length;
  const choixCourants = etape ? (selection[etape.id] ?? []) : [];
  const peutAvancer = choixCourants.length > 0;

  function choisir(etapeId: string, optionId: string, mode: "unique" | "multiple") {
    setSelection((prev) => {
      const actuels = prev[etapeId] ?? [];
      if (mode === "unique") return { ...prev, [etapeId]: [optionId] };
      return {
        ...prev,
        [etapeId]: actuels.includes(optionId)
          ? actuels.filter((id) => id !== optionId)
          : [...actuels, optionId],
      };
    });
  }

  if (termine) {
    return (
      <Recapitulatif
        selection={selection}
        chiffrage={chiffrage}
        onRetour={() => setIndex(ETAPES.length - 1)}
        onRecommencer={() => {
          setSelection({});
          setIndex(0);
        }}
      />
    );
  }

  if (!etape) return null;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
      {/* ------------------------------------------------ Colonne questions */}
      <div className="flex flex-col gap-8">
        {/* Progression — barres pleines, pas un pourcentage abstrait */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-1.5" aria-hidden>
            {ETAPES.map((e, i) => (
              <span
                key={e.id}
                className={cn(
                  "h-1 flex-1 rounded-pill transition-colors duration-500",
                  i <= index ? "bg-brand" : "bg-ghost",
                )}
              />
            ))}
          </div>
          <p className="text-[0.8125rem] text-slate">
            Étape {index + 1} sur {ETAPES.length} · {etape.titre}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight font-medium tracking-[-0.02em] text-ink">
            {etape.question}
          </h2>
          <p className="text-body text-graphite">{etape.aide}</p>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">{etape.question}</legend>
          {etape.options.map((option) => {
            const actif = choixCourants.includes(option.id);
            return (
              <label
                key={option.id}
                className={cn(
                  "group/opt flex cursor-pointer items-start gap-4 rounded-frame border bg-white p-6",
                  "transition-colors duration-200",
                  actif
                    ? "border-ink"
                    : "border-mist/60 hover:border-slate",
                )}
              >
                <input
                  type={etape.mode === "unique" ? "radio" : "checkbox"}
                  name={etape.id}
                  checked={actif}
                  onChange={() => choisir(etape.id, option.id, etape.mode)}
                  className="sr-only"
                />

                {/* Indicateur : cercle pour un choix unique, carré arrondi pour
                    un choix multiple — la forme annonce le comportement. */}
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center border-[1.5px] transition-colors duration-200",
                    etape.mode === "unique" ? "rounded-full" : "rounded-micro",
                    actif ? "border-ink bg-ink text-frost" : "border-mist",
                  )}
                >
                  {actif ? <Check size={12} strokeWidth={3} /> : null}
                </span>

                <span className="flex flex-1 flex-col gap-1">
                  <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                    {option.label}
                  </span>
                  {option.detail ? (
                    <span className="text-[0.9375rem] text-graphite">
                      {option.detail}
                    </span>
                  ) : null}
                </span>

                {option.prixXaf ? (
                  <span className="shrink-0 text-[0.9375rem] text-slate tabular-nums">
                    +{formatXAF(option.prixXaf)}
                  </span>
                ) : null}
              </label>
            );
          })}
        </fieldset>

        <div className="flex gap-3">
          {index > 0 ? (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => setIndex((i) => i - 1)}
            >
              <ArrowLeft size={17} aria-hidden />
              Retour
            </Button>
          ) : null}
          <Button
            type="button"
            size="lg"
            disabled={!peutAvancer}
            onClick={() => setIndex((i) => i + 1)}
            className="flex-1 sm:flex-none"
          >
            {index === ETAPES.length - 1 ? "Voir mon devis" : "Continuer"}
            <ArrowRight size={17} aria-hidden />
          </Button>
        </div>
      </div>

      {/* -------------------------------------------------- Colonne du prix */}
      {/* Collante en desktop, épinglée en bas sur mobile : le prix doit rester
          visible en permanence, c'est lui qui porte la décision. */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-frame bg-ink p-8 text-white">
          <EyebrowLabel tone="frost">Estimation</EyebrowLabel>

          <p className="mt-5 text-[clamp(1.75rem,4vw,2.5rem)] leading-none font-medium tracking-[-0.02em] tabular-nums">
            {formatXAF(chiffrage.totalXaf)}
          </p>

          {chiffrage.semaines > 0 ? (
            <p className="mt-3 text-[0.9375rem] text-white/60">
              Environ {chiffrage.semaines} semaine
              {chiffrage.semaines > 1 ? "s" : ""} de réalisation
            </p>
          ) : null}

          {chiffrage.lignes.length > 0 ? (
            <ul className="mt-6 flex flex-col gap-2 border-t border-white/15 pt-6">
              {chiffrage.lignes.map((ligne, i) => (
                <li
                  key={`${ligne.label}-${i}`}
                  className="flex items-baseline justify-between gap-4 text-[0.875rem]"
                >
                  <span className="text-white/70">{ligne.label}</span>
                  <span className="shrink-0 text-white/90 tabular-nums">
                    {formatXAF(ligne.montantXaf)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 border-t border-white/15 pt-6 text-[0.875rem] text-white/50">
              Faites un premier choix pour voir le prix se construire.
            </p>
          )}

          <p className="mt-6 text-[0.75rem] leading-relaxed text-white/40">
            Estimation indicative, hors taxes applicables. Le devis définitif est
            établi après échange sur votre projet.
          </p>
        </div>
      </aside>
    </div>
  );
}
