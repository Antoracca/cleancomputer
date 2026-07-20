import Link from "next/link";
import Image from "next/image";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";

/**
 * COQUILLE D'AUTHENTIFICATION
 *
 * Deux colonnes : le formulaire à gauche sur canevas, un panneau Ink à droite
 * qui rappelle ce que le compte débloque. Le panneau disparaît sous lg — sur
 * mobile, on ne met rien entre l'utilisateur et le champ de saisie.
 */
export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
  asideTitle,
  asidePoints,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  asideTitle: string;
  asidePoints: readonly string[];
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,520px)]">
      {/* Formulaire */}
      <div className="flex items-center justify-center px-6 pt-32 pb-20 md:px-12 lg:pt-24">
        <div className="flex w-full max-w-md flex-col gap-8">
          <div className="flex flex-col gap-4">
            <EyebrowLabel>{eyebrow}</EyebrowLabel>
            <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.1] font-medium tracking-[-0.02em] text-ink">
              {title}
            </h1>
            <p className="text-body text-graphite">{intro}</p>
          </div>

          {children}

          <div className="border-t border-mist/60 pt-6 text-[0.9375rem] text-graphite">
            {footer}
          </div>
        </div>
      </div>

      {/* Panneau Ink — argumentaire, jamais un simple visuel décoratif */}
      <aside className="relative hidden overflow-hidden bg-ink p-14 lg:flex lg:flex-col lg:justify-between">
        <svg
          aria-hidden
          viewBox="0 0 520 600"
          fill="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <path
            d="M -40 520 C 90 430, 200 370, 330 330 C 440 296, 510 210, 560 90"
            stroke="var(--color-orbit)"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.45"
          />
          <path
            d="M -40 600 C 110 500, 240 450, 380 400 C 480 364, 540 280, 580 180"
            stroke="var(--color-orbit)"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.2"
          />
        </svg>

        <Link href="/" className="relative w-fit">
          {/* Le pictogramme est bleu marque : sur la surface encre, le
              contraste est trop faible pour être lisible. On le passe en
              blanc plutôt que d'ajouter un fichier d'inversion. */}
          <Image
            src="/brand/logo-mark.png"
            alt="Clean Computer"
            width={512}
            height={512}
            className="size-11 object-contain brightness-0 invert"
          />
        </Link>

        <div className="relative flex flex-col gap-8">
          <h2 className="text-display text-white">{asideTitle}</h2>
          <ul className="flex flex-col gap-4">
            {asidePoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-body text-white/70"
              >
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-orbit"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
