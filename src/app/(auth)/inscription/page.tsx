import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { RegisterForm } from "@/features/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Créer un compte",
  description:
    "Créez votre compte Clean Computer pour commander, suivre vos devis et vos expéditions.",
};

export default function InscriptionPage() {
  return (
    <AuthShell
      eyebrow="Créer un compte"
      title="Deux minutes, puis tout est au même endroit."
      intro="Commandes, devis, transferts et expéditions : un seul compte pour les cinq métiers."
      asideTitle="Pourquoi créer un compte ?"
      asidePoints={[
        "Commander sans ressaisir vos coordonnées à chaque fois",
        "Recevoir vos devis en PDF et les retrouver plus tard",
        "Être prévenu quand un produit attendu arrive en stock",
        "Suivre une expédition Chine–Bangui étape par étape",
      ]}
      footer={
        <>
          Vous avez déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="font-medium text-brand transition-colors hover:text-brand-deep"
          >
            Se connecter
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
