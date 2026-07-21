import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { LogoutButton } from "@/features/auth/LogoutButton";
import { MesDevis } from "@/features/devis/MesDevis";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Mon compte" };

/**
 * ESPACE CLIENT
 *
 * Route protégée. Le middleware bloque déjà les visiteurs non connectés ;
 * cette vérification est la seconde barrière — on ne fait jamais confiance à
 * un seul point de contrôle sur une page qui affiche des données personnelles.
 *
 * Un administrateur est renvoyé vers son panel : c'est la « redirection
 * automatique vers le panel administrateur » prévue au cahier des charges.
 */
export default async function ComptePage({
  searchParams,
}: {
  searchParams: Promise<{ onglet?: string }>;
}) {
  const { onglet = "devis" } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?suite=/compte");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nom, role, telephone, ville")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "admin") redirect("/admin");

  const prenom = (profile?.nom ?? "").split(" ")[0];

  return (
    <>
      <PageHeader
        eyebrow="Votre compte"
        title={prenom ? `Bonjour ${prenom}.` : "Votre espace."}
        intro="Vos commandes, vos devis et vos expéditions au même endroit."
      />

      <Container className="pb-32">
        <div className="mb-12">
          <MesDevis onglet={onglet} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <SectionCard
            icone={<Package size={20} strokeWidth={1.75} aria-hidden />}
            titre="Commandes"
            vide="Aucune commande pour le moment."
            href="/electronique"
            lien="Parcourir la boutique"
          />
          <SectionCard
            icone={<Send size={20} strokeWidth={1.75} aria-hidden />}
            titre="Transferts"
            vide="Aucun transfert enregistré."
            href="/transfert-argent"
            lien="En savoir plus"
          />
        </div>

        <div className="mt-10 flex flex-col gap-6 rounded-frame border border-mist/60 bg-white p-8">
          <EyebrowLabel>Vos informations</EyebrowLabel>
          <dl className="grid gap-5 sm:grid-cols-3">
            <Info label="Nom" valeur={profile?.nom || "—"} />
            <Info label="Email" valeur={user.email ?? "—"} />
            <Info label="Téléphone" valeur={profile?.telephone || "—"} />
          </dl>
          <div className="border-t border-mist/60 pt-6">
            <LogoutButton />
          </div>
        </div>
      </Container>
    </>
  );
}

function SectionCard({
  icone,
  titre,
  vide,
  href,
  lien,
}: {
  icone: React.ReactNode;
  titre: string;
  vide: string;
  href: string;
  lien: string;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-frame border border-mist/60 bg-white p-8">
      <span className="grid size-11 place-items-center rounded-full bg-ghost text-brand">
        {icone}
      </span>
      <h2 className="text-title text-ink">{titre}</h2>
      <p className="text-body text-graphite">{vide}</p>
      <Button asChild variant="secondary" size="sm" className="mt-auto w-fit">
        <Link href={href}>{lien}</Link>
      </Button>
    </section>
  );
}

function Info({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[0.8125rem] text-slate">{label}</dt>
      <dd className="text-body text-ink">{valeur}</dd>
    </div>
  );
}
