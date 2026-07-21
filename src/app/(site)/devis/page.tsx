import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { AtelierDevis } from "@/features/devis/AtelierDevis";
import { createClient } from "@/lib/supabase/server";
import { chargerDevis } from "@/features/devis/actions";

export const metadata: Metadata = {
  title: "Établir un devis",
  description:
    "Composez votre devis article par article et voyez le document se remplir en direct. Imprimable et enregistrable en PDF immédiatement.",
};

/**
 * PAGE DEVIS
 *
 * Le configurateur en six étapes, réservé aux projets web, reste accessible
 * à `/devis/projet-web`. Il répond à un besoin différent : chiffrer un projet
 * qui n'a pas de référence catalogue. Cet atelier-ci couvre tout le reste.
 */
export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ reprendre?: string }>;
}) {
  const { reprendre } = await searchParams;
  // L'état de connexion est lu au serveur : le panneau sait dès le premier
  // rendu s'il peut proposer l'enregistrement, plutôt que de laisser
  // l'utilisateur remplir un devis entier avant de lui annoncer qu'il doit
  // se connecter.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Reprise d'un devis enregistré. Le chargement passe par la session de
  // l'utilisateur : les politiques RLS garantissent qu'on ne peut pas ouvrir
  // le devis de quelqu'un d'autre en devinant sa référence.
  const repris = reprendre ? await chargerDevis(reprendre) : null;

  return (
    <>
      {/* En-tête volontairement bref : le document est le sujet de la page,
          il doit apparaître le plus haut possible. Un bandeau de titre pleine
          hauteur repoussait le devis sous la ligne de flottaison. */}
      <Container className="impression-cache pt-32 pb-6 md:pt-36">
        <div className="flex flex-col gap-2">
          <EyebrowLabel>Devis</EyebrowLabel>
          <h1 className="text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
            Établir un devis
          </h1>
          <p className="max-w-xl text-[1.0625rem] leading-relaxed text-graphite">
            Cherchez un article, il s&apos;inscrit sur le document.
          </p>
        </div>
      </Container>

      <Container className="pb-32">
        <AtelierDevis connecte={Boolean(user)} repris={repris} />

        <p className="impression-cache mt-16 text-center text-[0.9375rem] leading-relaxed text-graphite">
          Vous chiffrez un site ou une application sur mesure ?{" "}
          <Link
            href="/devis/projet-web"
            className="font-medium text-ink underline decoration-mist underline-offset-4 transition-colors hover:decoration-ink"
          >
            Le configurateur en six étapes
          </Link>{" "}
          est plus adapté.
        </p>
      </Container>
    </>
  );
}
