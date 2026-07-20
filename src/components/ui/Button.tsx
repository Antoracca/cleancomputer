import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

/**
 * BOUTON
 *
 * Rayon 20px = le rayon signature du système. Le CTA primaire est une pilule
 * INK, pas bleue : le bleu porte l'identité, le noir déclenche l'action.
 *
 * Note d'arbitrage : la référence Mastercard indique un padding de 6px/24px,
 * ce qui donne une hauteur d'environ 35px — sous le seuil de 44px exigé par
 * la même référence pour les cibles tactiles. Le conflit est tranché en faveur
 * de l'accessibilité : hauteur minimale 44px, l'aspect visuel resserré étant
 * conservé par un padding horizontal généreux.
 */
const button = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium tracking-[-0.03em] whitespace-nowrap",
    "min-h-11 select-none",
    "transition-[transform,background-color,color,border-color] duration-200 ease-out-soft",
    "active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        /* CTA primaire — pilule encre sur canevas givré */
        primary:
          "bg-ink text-frost border-[1.5px] border-ink rounded-action hover:bg-charcoal hover:border-charcoal",
        /* Secondaire — blanc cerné d'encre */
        secondary:
          "bg-white text-ink border-[1.5px] border-ink rounded-action font-[450] hover:bg-ink hover:text-frost",
        /* Consentement / légal UNIQUEMENT — jamais un CTA marketing */
        signal:
          "bg-signal text-white border-0 rounded-chip hover:brightness-110",
        /* Lien discret */
        ghost:
          "bg-transparent text-ink border-0 rounded-action hover:bg-ghost",
      },
      size: {
        sm: "px-5 text-[0.9375rem]",
        md: "px-6 text-body",
        lg: "px-10 py-4 text-body rounded-frame",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof button> & {
    /** Rend l'élément enfant à la place d'un <button> (pour un <Link>). */
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(button({ variant, size }), className)} {...props} />
  );
}
