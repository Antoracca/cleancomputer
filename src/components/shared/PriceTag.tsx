import { formatXAF } from "@/lib/format/currency";
import { cn } from "@/lib/utils/cn";

/**
 * PRIX
 *
 * Seul composant autorisé à afficher un montant. Il délègue le formatage à
 * lib/format/currency — la devise n'est définie qu'à un seul endroit.
 */
export function PriceTag({
  amount,
  strikeAmount,
  size = "md",
  className,
}: {
  amount: number;
  strikeAmount?: number | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-medium tracking-[-0.02em] text-ink tabular-nums",
          size === "sm" && "text-[0.9375rem]",
          size === "md" && "text-[1.125rem]",
          size === "lg" && "text-title",
        )}
      >
        {formatXAF(amount)}
      </span>
      {strikeAmount !== undefined && strikeAmount > amount ? (
        <span className="text-[0.875rem] text-slate line-through tabular-nums">
          {formatXAF(strikeAmount)}
        </span>
      ) : null}
    </span>
  );
}
