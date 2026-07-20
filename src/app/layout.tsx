import type { Metadata, Viewport } from "next";
import { Sofia_Sans } from "next/font/google";
import "./globals.css";

/**
 * LAYOUT RACINE
 *
 * Ne contient QUE la coquille du document. La navigation et le pied de page
 * vivent dans le groupe `(site)`, pour que le groupe `(auth)` puisse s'en
 * passer sans dupliquer le document.
 *
 * Les deux groupes partagent ce layout, donc la police, les tokens et le
 * document ne sont chargés qu'une seule fois — l'app shell reste persistant
 * d'une route à l'autre.
 */

/**
 * Sofia Sans — substitut open source de MarkForMC, désigné par Mastercard
 * elle-même dans sa pile de secours. Variable, donc le poids 450 du corps de
 * texte (signature du système) est réellement disponible, pas simulé.
 */
const sofia = Sofia_Sans({
  subsets: ["latin"],
  variable: "--font-sofia",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Clean Computer — Électronique, informatique et services à Bangui",
    template: "%s · Clean Computer",
  },
  description:
    "Matériel électronique, prestations informatiques, création de sites et applications, identité visuelle, transfert d'argent et import Chine–Bangui. Une seule plateforme.",
  metadataBase: new URL("https://cleancomputer.cf"),
};

export const viewport: Viewport = {
  themeColor: "#f1f4f9",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${sofia.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
