import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { COMPANY } from "@/lib/config/company";
import { cn } from "@/lib/utils/cn";

/**
 * FOOTER
 *
 * Surface Ink, texte blanc, grand titre conversationnel puis grille 4 colonnes.
 * Troisième et dernier ton du rythme de page : canevas → surface levée → encre.
 *
 * ⚠️ Aucune coordonnée n'est affichée tant que le document fiscal n'est pas
 * fourni. Un faux numéro ou une fausse adresse en pied de page est un problème
 * juridique, pas un placeholder. Voir lib/config/company.ts.
 */

const COLUMNS = [
  {
    title: "Boutique",
    links: [
      { label: "Audio", href: "/electronique/audio" },
      { label: "Charge & batteries", href: "/electronique/charge" },
      { label: "Réseau & Wi-Fi", href: "/electronique/reseau" },
      { label: "Périphériques", href: "/electronique/peripheriques" },
      { label: "Gaming", href: "/electronique/gaming" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Systèmes & postes", href: "/services-informatiques/systemes" },
      { label: "Infrastructure", href: "/services-informatiques/infrastructure" },
      { label: "Développement", href: "/services-informatiques/developpement" },
      { label: "Identité & communication", href: "/services-informatiques/identite" },
      { label: "Obtenir un devis", href: "/devis" },
    ],
  },
  {
    title: "Transfert & import",
    links: [
      { label: "Envoyer de l'argent", href: "/transfert-argent" },
      { label: "Suivre un transfert", href: "/transfert-argent/suivi" },
      { label: "Fret Chine ↔ Bangui", href: "/transit-import" },
      { label: "Véhicules & motos", href: "/vehicules" },
    ],
  },
  {
    title: "Besoin d'aide ?",
    links: [
      { label: "Nous contacter", href: "/contact" },
      { label: "Questions fréquentes", href: "/faq" },
      { label: "Suivre ma commande", href: "/suivi-commande" },
      { label: "Mes favoris", href: "/favoris" },
      { label: "Mon compte", href: "/compte" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-32 bg-ink text-white md:mt-48">
      <Container className="pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Titre conversationnel — le footer parle, il ne liste pas d'abord */}
        <h2 className="max-w-2xl text-display text-white md:text-hero">
          Une question ? On répond depuis Bangui.
        </h2>

        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 md:mt-24 md:grid-cols-4">
          {COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-5">
              <h3 className="text-eyebrow text-white/45 uppercase">
                {column.title}
              </h3>
              {/* `inline-flex` + `min-h-6` : la cible de pointage atteint le
                  minimum de 24px de WCAG 2.2, sans grossir le texte ni
                  desserrer la colonne. */}
              <ul className="flex flex-col gap-1.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-6 items-center text-[0.875rem] font-[450] text-white/85 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Séparateur 1px blanc à faible opacité — un trait, jamais une ombre */}
        <div className="mt-20 border-t border-white/15 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="text-[0.8125rem] text-white/45">
              © {new Date().getFullYear()} {COMPANY.name} · {COMPANY.city},{" "}
              {COMPANY.country}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <FooterMinor href="/mentions-legales">Mentions légales</FooterMinor>
              <FooterMinor href="/cgv">CGV</FooterMinor>
              <FooterMinor href="/confidentialite">Confidentialité</FooterMinor>

              {/* Sélecteur pays — pilule cerclée, conforme à la référence */}
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-pill border border-white/40 px-4 py-2",
                  "text-[0.8125rem] text-white/85",
                )}
              >
                <Globe size={14} strokeWidth={1.75} aria-hidden />
                {COMPANY.country} · Français
              </span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterMinor({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-6 items-center gap-1 text-[0.8125rem] text-white/45 transition-colors hover:text-white"
    >
      {children}
      <ArrowUpRight size={12} aria-hidden />
    </Link>
  );
}
