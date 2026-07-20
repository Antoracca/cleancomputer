import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Recevez un lien de réinitialisation par email.",
};

export default function MotDePasseOubliePage() {
  return (
    <AuthShell
      eyebrow="Mot de passe"
      title="On vous renvoie une clé."
      intro="Indiquez l'adresse email de votre compte. Vous recevrez un lien pour choisir un nouveau mot de passe."
      asideTitle="Ça arrive à tout le monde."
      asidePoints={[
        "Le lien reçu est valable une heure",
        "Il ne peut servir qu'une seule fois",
        "Votre ancien mot de passe reste actif jusqu'au changement",
      ]}
      footer={
        <>
          Vous vous en souvenez ?{" "}
          <Link
            href="/connexion"
            className="font-medium text-brand transition-colors hover:text-brand-deep"
          >
            Retour à la connexion
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
