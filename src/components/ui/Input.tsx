import { cn } from "@/lib/utils/cn";

/**
 * CHAMP DE SAISIE
 *
 * Pilule 999px, comme la recherche de la référence Mastercard. Trait plutôt
 * qu'ombre pour délimiter — c'est la règle du système.
 *
 * Le label est TOUJOURS visible. Pas de placeholder tenant lieu de label :
 * il disparaît à la saisie, et l'utilisateur perd le contexte du champ.
 */
export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[0.875rem] font-medium text-ink"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[0.8125rem] text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[0.8125rem] text-slate">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  invalid,
  ...props
}: React.ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "min-h-12 w-full rounded-pill border bg-white px-5 text-body text-ink",
        "placeholder:text-mist",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:border-brand",
        invalid ? "border-danger" : "border-mist hover:border-slate",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full resize-y rounded-action border border-mist bg-white px-5 py-4 text-body text-ink",
        "placeholder:text-mist",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:border-brand hover:border-slate",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "min-h-12 w-full appearance-none rounded-pill border border-mist bg-white px-5 text-body text-ink",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:border-brand hover:border-slate",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
