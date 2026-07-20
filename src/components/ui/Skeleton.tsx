import { cn } from "@/lib/utils/cn";

/**
 * SQUELETTE
 *
 * Règle stricte du projet : visible UNIQUEMENT au tout premier chargement
 * d'une donnée jamais vue. Une fois la donnée en cache, la navigation ne doit
 * jamais réafficher de squelette.
 *
 * Le rayon doit toujours reprendre celui du composant final, sinon la
 * substitution produit un saut visuel.
 */
export function Skeleton({
  className,
  radius = "action",
}: {
  className?: string;
  radius?: "micro" | "action" | "frame" | "pill" | "full";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "skeleton",
        radius === "micro" && "rounded-micro",
        radius === "action" && "rounded-action",
        radius === "frame" && "rounded-frame",
        radius === "pill" && "rounded-pill",
        radius === "full" && "rounded-full",
        className,
      )}
    />
  );
}
