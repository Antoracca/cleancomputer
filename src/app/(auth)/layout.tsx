/**
 * COQUILLE D'AUTHENTIFICATION
 *
 * Volontairement dépouillée : ni navigation ni pied de page. Sur un écran de
 * connexion, chaque lien sortant est une occasion d'abandonner le parcours.
 * Seul le logo, dans le panneau latéral, ramène à l'accueil.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main id="contenu">{children}</main>;
}
