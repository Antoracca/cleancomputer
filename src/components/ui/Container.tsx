import { cn } from "@/lib/utils/cn";

/**
 * CONTENEUR
 * Largeur maximale 1280px, gouttières 24px en mobile → 48px à partir de md.
 */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-6 md:px-12", className)}>
      {children}
    </div>
  );
}
