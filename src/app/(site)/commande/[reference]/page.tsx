import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { formatXAF } from "@/lib/format/currency";
import { COMPANY, PHONE_HREF } from "@/lib/config/company";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Commande confirmée",
  robots: { index: false },
};

/**
 * CONFIRMATION DE COMMANDE
 *
 * La référence fait office de jeton d'accès : générée aléatoirement, elle
 * n'est connue que de la personne qui vient de commander. La page n'affiche
 * ni téléphone ni adresse — si le lien est partagé, seuls le contenu et le
 * montant sont visibles, pas les coordonnées.
 */
export default async function CommandeConfirmeePage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference: brute } = await params;
  const reference = brute.toUpperCase();

  if (!/^CC-[A-Z0-9]{6,12}$/.test(reference)) notFound();

  const admin = await createAdminClient();
  const { data: commande } = await admin
    .from("commandes")
    .select("id, statut, sous_total_xaf, livraison_xaf, total_xaf, adresse, created_at")
    .eq("reference", reference)
    .maybeSingle();

  if (!commande) notFound();

  const { data: lignes } = await admin
    .from("commande_lignes")
    .select("libelle_fige, prix_unitaire_xaf, quantite")
    .eq("commande_id", commande.id);

  return (
    <Container className="pt-40 pb-32 md:pt-48">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-success/10 text-success">
            <CircleCheck size={30} strokeWidth={1.75} aria-hidden />
          </span>
          <h1 className="text-display text-ink">Commande enregistrée.</h1>
          <p className="max-w-md text-body text-graphite">
            Gardez cette référence. C&apos;est elle qu&apos;on vous demandera
            au retrait ou à la livraison.
          </p>
          <p className="rounded-pill bg-ink px-6 py-3 text-title tracking-wide text-frost tabular-nums">
            {reference}
          </p>
        </div>

        <div className="flex flex-col gap-6 rounded-frame border border-mist/60 bg-white p-8">
          <EyebrowLabel>Détail</EyebrowLabel>
          <ul className="flex flex-col">
            {(lignes ?? []).map((l, i) => (
              <li
                key={i}
                className="flex justify-between gap-4 border-b border-mist/40 py-3 text-body"
              >
                <span className="text-graphite">
                  {l.quantite} × {l.libelle_fige}
                </span>
                <span className="shrink-0 text-ink tabular-nums">
                  {formatXAF(l.prix_unitaire_xaf * l.quantite)}
                </span>
              </li>
            ))}
            <li className="flex justify-between gap-4 py-3 text-body">
              <span className="text-graphite">Livraison</span>
              <span className="text-ink tabular-nums">
                {commande.livraison_xaf === 0
                  ? "Gratuit"
                  : formatXAF(commande.livraison_xaf)}
              </span>
            </li>
          </ul>
          <div className="flex items-baseline justify-between border-t border-mist/60 pt-4">
            <span className="text-title text-ink">Total à payer</span>
            <span className="text-title text-ink tabular-nums">
              {formatXAF(commande.total_xaf)}
            </span>
          </div>
          <p className="text-[0.875rem] text-graphite">
            {commande.adresse === "Retrait en boutique"
              ? `À retirer : ${COMPANY.address}, ${COMPANY.city}. Paiement en espèces sur place.`
              : "Livraison sous 24 h à Bangui. Paiement en espèces à la remise."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <a href={PHONE_HREF}>
              <Phone size={17} aria-hidden />
              {COMPANY.phone}
            </a>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/electronique">Continuer mes achats</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
