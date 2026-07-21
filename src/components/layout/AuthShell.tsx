import Link from "next/link";
import { Check } from "lucide-react";

/**
 * COQUILLE D'AUTHENTIFICATION (Refonte Premium)
 *
 * S'inspire de la mise en page MoneyGram :
 * - Dégradé chaud et accueillant en fond.
 * - Typographie très grasse et texturée à gauche.
 * - Formulaire dans une carte blanche flottante à droite, avec liseré dégradé.
 * - Rendu parfait sur mobile (carte qui remonte) comme sur PC.
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
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[linear-gradient(105deg,#dff1f7_0%,#f4f0e6_38%,#ffe2c4_66%,#ffb695_100%)] px-4 py-10 sm:px-8 md:py-16 lg:justify-center">
      {/* Éléments décoratifs en arrière-plan pour donner de la profondeur */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] h-[60%] w-[50%] rounded-full bg-white/50 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[60%] w-[50%] rounded-full bg-[#f5402c]/5 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-[1280px]">
        {/* Le logo : visible sur mobile et desktop, rendu net */}
        <Link
          href="/"
          className="relative z-10 mb-10 block w-fit transition-transform hover:scale-105 active:scale-95 lg:mb-16"
          aria-label="Retour à l'accueil"
        >
          <img
            src="/brand/logo-full.png"
            alt="Clean Computer"
            className="h-10 w-auto object-contain drop-shadow-sm sm:h-12"
          />
        </Link>

        <div className="grid gap-14 lg:grid-cols-[1fr_28rem] lg:items-center xl:gap-20">
          
          {/* Colonne de gauche : Argumentaire très visuel (façon MoneyGram) */}
          <div className="animate-reveal relative z-10 flex flex-col gap-6 lg:gap-8">
            <span className="text-[1.0625rem] font-bold tracking-[-0.01em] text-[#2c6ecb]">
              {eyebrow}
            </span>
            
            <h1 className="max-w-2xl text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em] text-ink">
              {asideTitle}
            </h1>
            
            <p className="max-w-lg text-[1.0625rem] leading-relaxed text-ink/75">
              {intro}
            </p>

            <ul className="mt-4 flex flex-col gap-5">
              {asidePoints.map((point) => (
                <li key={point} className="flex items-start gap-4">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#f5402c] text-white shadow-sm">
                    <Check size={14} strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-[1.0625rem] font-bold tracking-[-0.01em] text-ink">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne de droite : Carte formulaire flottante */}
          <div 
            className="animate-slide-in-right relative z-10 w-full max-w-md mx-auto mt-4 lg:mt-0 lg:max-w-none"
            style={{ animationDelay: "150ms" }}
          >
            {/* Liseré dégradé qui dépasse sous la carte pour l'effet de flottaison */}
            <span
              aria-hidden
              className="absolute inset-x-3 -bottom-2 h-10 rounded-[1.75rem] bg-[linear-gradient(100deg,#bfe3ec_0%,#f6ecd8_50%,#ffcf9e_100%)] shadow-xl"
            />
            
            {/* La carte blanche contenant le formulaire */}
            <div className="relative flex flex-col rounded-[1.75rem] bg-white p-7 shadow-[0_24px_60px_-24px_rgba(15,21,32,0.28)] ring-1 ring-black/5 md:p-10">
              
              <div className="mb-8 flex flex-col gap-2 text-center">
                <h2 className="text-[1.75rem] leading-[1.1] font-extrabold tracking-[-0.02em] text-ink">
                  {title}
                </h2>
              </div>

              {children}

              <div className="mt-8 border-t border-mist/60 pt-6 text-center text-[0.9375rem] text-graphite">
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
