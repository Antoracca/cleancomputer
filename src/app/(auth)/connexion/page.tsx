import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { LoginForm } from "@/features/auth/LoginForm";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Accédez à vos commandes, devis et transferts Clean Computer.",
};

export default function ConnexionPage() {
  return (
    <AuthShell
      eyebrow="Votre compte"
      title="Content de vous revoir."
      intro="Retrouvez vos commandes, vos devis et le suivi de vos expéditions."
      asideTitle="Un compte, cinq métiers."
      asidePoints={[
        "Suivez vos commandes du paiement à la livraison",
        "Retrouvez vos devis chiffrés et relancez-les en un clic",
        "Gardez l'historique de vos transferts et expéditions",
        "Enregistrez vos adresses pour commander plus vite",
      ]}
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="font-medium text-brand transition-colors hover:text-brand-deep"
          >
            Créer un compte
          </Link>
        </>
      }
    >
      {/* `useSearchParams` impose une frontière Suspense : sans elle, toute la
          page basculerait en rendu dynamique et perdrait le prérendu. */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-5">
            <Skeleton className="h-12 w-full" radius="pill" />
            <Skeleton className="h-12 w-full" radius="pill" />
            <Skeleton className="h-14 w-full" radius="frame" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
