import { Container } from "@/components/ui/Container";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";

/**
 * EN-TÊTE DE PAGE
 *
 * L'ancien titre filigrane (texte givré-sur-givré derrière le titre réel) a
 * été retiré : à l'écran il ne se lisait pas comme un parti pris typographique
 * mais comme un bug de contraste. Un dispositif décoratif qui demande à être
 * expliqué est un dispositif raté.
 *
 * À la place : un vrai bloc éditorial — index de chapitre, libellé filet,
 * titre large, chapô, et une ligne de contexte optionnelle qui donne du
 * corps à la page dès le premier écran.
 *
 * Le padding haut compense la navigation flottante.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  meta,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Faits courts affichés en pied d'en-tête : délais, stock, garanties. */
  meta?: readonly string[];
}) {
  return (
    <header className="pt-36 pb-14 md:pt-44 md:pb-20">
      <Container>
        <div className="flex max-w-3xl flex-col gap-7">
          <EyebrowLabel>{eyebrow}</EyebrowLabel>

          <h1 className="text-[clamp(2rem,5.2vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.025em] text-ink">
            {title}
          </h1>

          {intro ? (
            <p className="max-w-xl text-[1.0625rem] leading-relaxed text-graphite">
              {intro}
            </p>
          ) : null}

          {meta && meta.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
              {meta.map((fait) => (
                <li
                  key={fait}
                  className="flex items-center gap-2 text-[0.875rem] text-slate"
                >
                  <span aria-hidden className="h-px w-4 bg-mist" />
                  {fait}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
