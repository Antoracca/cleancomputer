import { NavPill } from "@/components/layout/NavPill";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingCart } from "@/features/panier/FloatingCart";

/**
 * COQUILLE DU SITE
 *
 * Navigation et pied de page montés UNE FOIS. Next.js conserve ce layout
 * entre les routes du groupe : passer du catalogue à une fiche produit ne
 * remonte ni la navbar ni le footer, seul `children` change.
 *
 * C'est le socle de l'exigence « chargé une fois, puis instantané partout ».
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NavPill />
      <main id="contenu">{children}</main>
      <SiteFooter />
      {/* Raccourci vers le panier, visible dès qu'il contient un article */}
      <FloatingCart />
    </>
  );
}
