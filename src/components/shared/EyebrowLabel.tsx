import { cn } from "@/lib/utils/cn";

/**
 * LIBELLÉ DE SECTION
 *
 * Trois versions ont été essayées avant celle-ci :
 *
 * 1. Pastille bleue + texte. Rejetée : c'est le tic visuel par défaut de toutes
 *    les plateformes SaaS, il signale le template plus qu'il ne signe la marque.
 * 2. Index numéroté « 01 ». Rejeté aussi : la numérotation donne un ton de
 *    sommaire de rapport, qui n'est pas le registre d'une boutique.
 * 3. Retenu : un FILET VERTICAL fin en bleu de marque avant le libellé, puis un
 *    filet horizontal qui court jusqu'au bord.
 *
 * Le filet vertical ancre le titre et donne du rythme à la page sans jamais
 * ressembler à une gommette. La couleur de marque reste présente, mais comme
 * une réglure typographique, pas comme un ornement.
 */
export function EyebrowLabel({
  children,
  className,
  tone = "orbit",
  rule = true,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "orbit" | "slate" | "frost";
  /** Le filet horizontal peut être retiré dans les espaces contraints. */
  rule?: boolean;
}) {
  const surSombre = tone === "frost";

  return (
    <span
      className={cn(
        "flex w-full items-center gap-3 text-eyebrow uppercase",
        surSombre ? "text-white/55" : "text-slate",
        className,
      )}
    >
      {/* Filet vertical : hauteur de la capitale, jamais plus. */}
      <span
        aria-hidden
        className={cn(
          "h-3.5 w-0.5 shrink-0 rounded-pill",
          surSombre ? "bg-white/50" : "bg-brand",
        )}
      />

      <span className="shrink-0">{children}</span>

      {rule ? (
        <span
          aria-hidden
          className={cn(
            "h-px min-w-8 flex-1",
            surSombre
              ? "bg-gradient-to-r from-white/30 to-transparent"
              : "bg-gradient-to-r from-mist to-transparent",
          )}
        />
      ) : null}
    </span>
  );
}
