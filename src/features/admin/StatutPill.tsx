import { cn } from "@/lib/utils/cn";

/**
 * PUCE DE STATUT
 * Couleurs sémantiques du design system — réservées aux statuts, jamais
 * décoratives. Pilule 999px conformément à l'échelle de rayons.
 */
export const STATUT_LABELS: Record<string, string> = {
  en_attente: "En attente",
  payee: "Payée",
  preparation: "En préparation",
  expediee: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
};

const TONS: Record<string, string> = {
  en_attente: "bg-warning/10 text-warning",
  payee: "bg-brand/10 text-brand",
  preparation: "bg-brand/10 text-brand",
  expediee: "bg-brand/10 text-brand",
  livree: "bg-success/10 text-success",
  annulee: "bg-danger/10 text-danger",
};

export function StatutPill({ statut }: { statut: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-[0.75rem] font-bold tracking-[0.02em] uppercase",
        TONS[statut] ?? "bg-ghost text-slate",
      )}
    >
      {STATUT_LABELS[statut] ?? statut}
    </span>
  );
}
