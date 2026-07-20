import { ShieldCheck } from "lucide-react";
import {
  ETAT_DESCRIPTIONS,
  ETAT_LABELS,
  tonSante,
  type EtatMachine as Etat,
} from "@/types/ordinateur";
import { cn } from "@/lib/utils/cn";

/**
 * ÉTAT ET SCORE DE SANTÉ
 *
 * Deux composants, une seule règle : l'état d'une machine d'occasion doit être
 * annoncé avant le prix, pas caché en bas de fiche. C'est la première question
 * de tout acheteur de matériel informatique, et l'esquiver coûte la vente.
 *
 * Le score de santé est une note sur 10 affichée sous forme de barre. Une barre
 * se lit d'un coup d'œil là où un chiffre seul demande une interprétation.
 */

export function BadgeEtat({
  etat,
  className,
}: {
  etat: Etat;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-[0.6875rem] font-bold tracking-[0.04em] uppercase",
        etat === "neuf" && "bg-success text-white",
        etat === "quasi-neuf" && "bg-brand text-white",
        etat === "occasion" && "bg-warning text-white",
        className,
      )}
    >
      {ETAT_LABELS[etat]}
    </span>
  );
}

export function ScoreSante({
  sante,
  etat,
  compact = false,
}: {
  sante: number;
  etat: Etat;
  compact?: boolean;
}) {
  const ton = tonSante(sante);
  const pourcentage = Math.max(0, Math.min(100, (sante / 10) * 100));

  if (compact) {
    return (
      <span className="inline-flex items-center gap-2 text-[0.8125rem] text-graphite">
        <ShieldCheck
          size={14}
          aria-hidden
          className={cn(
            ton === "success" && "text-success",
            ton === "warning" && "text-warning",
            ton === "danger" && "text-danger",
          )}
        />
        <span className="tabular-nums">État {sante}/10</span>
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-action border border-mist/60 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
          <ShieldCheck size={17} aria-hidden className="text-brand" />
          État de la machine
        </span>
        <span className="text-[1.125rem] font-medium text-ink tabular-nums">
          {sante}
          <span className="text-[0.875rem] font-[450] text-slate">/10</span>
        </span>
      </div>

      {/* Barre de score : lecture immédiate, sans interprétation */}
      <div
        role="meter"
        aria-valuenow={sante}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-label="Score d'état"
        className="h-2 w-full overflow-hidden rounded-pill bg-ghost"
      >
        <div
          className={cn(
            "h-full rounded-pill transition-[width] duration-700 ease-out-soft",
            ton === "success" && "bg-success",
            ton === "warning" && "bg-warning",
            ton === "danger" && "bg-danger",
          )}
          style={{ width: `${pourcentage}%` }}
        />
      </div>

      <p className="text-[0.875rem] leading-relaxed text-graphite">
        <strong className="font-medium text-ink">{ETAT_LABELS[etat]}.</strong>{" "}
        {ETAT_DESCRIPTIONS[etat]}
      </p>
    </div>
  );
}
