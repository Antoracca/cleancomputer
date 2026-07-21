import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { createAdminClient } from "@/lib/supabase/server";
import { COMPANY, PHONE_HREF } from "@/lib/config/company";
import {
  formatDevise,
  getOperateur,
  getPays,
  type Devise,
} from "@/lib/data/transfert";

export const metadata: Metadata = {
  title: "Transfert enregistré",
  robots: { index: false },
};

/**
 * CONFIRMATION DE TRANSFERT
 *
 * La référence sert de jeton d'accès : générée aléatoirement, elle n'est
 * connue que de l'expéditeur.
 *
 * Aucune coordonnée bancaire ni téléphone complet n'est affiché. Si le lien
 * est partagé ou retrouvé dans un historique, seuls le montant et l'état du
 * dossier sont visibles.
 */
export default async function TransfertConfirmePage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference: brute } = await params;
  const reference = brute.toUpperCase();

  if (!/^TR-[A-Z0-9]{6,14}$/.test(reference)) notFound();

  const admin = await createAdminClient();
  const { data: t } = await admin
    .from("transferts")
    .select(
      "statut, operateur, pays_depart, pays_arrivee, devise_depart, devise_arrivee, montant_envoye_cts, total_a_payer_cts, montant_recu_cts, benef_prenom, benef_nom, mode_paiement, created_at",
    )
    .eq("reference", reference)
    .maybeSingle();

  if (!t) notFound();

  const depart = getPays(t.pays_depart);
  const arrivee = getPays(t.pays_arrivee);
  const operateur = getOperateur(t.operateur);
  const enAgence = t.mode_paiement === "especes_agence";

  return (
    <Container className="pt-40 pb-32 md:pt-48">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-success/10 text-success">
            <CircleCheck size={30} strokeWidth={1.75} aria-hidden />
          </span>
          <h1 className="text-display text-ink">Transfert enregistré.</h1>
          <p className="max-w-md text-body text-graphite">
            {enAgence
              ? "Présentez ce code à l'agence avec le montant en espèces. Le transfert part dès le paiement constaté."
              : "Nous vérifions votre dépôt. Vous serez prévenu dès que le transfert est parti."}
          </p>
          <p className="rounded-pill bg-ink px-6 py-3 text-title tracking-wide text-frost tabular-nums">
            {reference}
          </p>
        </div>

        <div className="flex flex-col gap-6 rounded-frame border border-mist/60 bg-white p-8">
          <EyebrowLabel>Détail</EyebrowLabel>

          <Ligne
            label="Corridor"
            valeur={`${depart?.nom ?? t.pays_depart} → ${arrivee?.nom ?? t.pays_arrivee}`}
          />
          <Ligne label="Service" valeur={operateur?.nom ?? t.operateur} />
          <Ligne
            label="Montant envoyé"
            valeur={formatDevise(
              t.montant_envoye_cts / 100,
              t.devise_depart as Devise,
            )}
          />

          <div className="flex items-baseline justify-between gap-4 border-t border-mist/60 pt-5">
            <span className="text-[1.0625rem] font-medium text-ink">
              Total à payer
            </span>
            <span className="text-[1.25rem] font-medium text-ink tabular-nums">
              {formatDevise(t.total_a_payer_cts / 100, t.devise_depart as Devise)}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-action bg-frost p-5">
            <span className="text-[0.8125rem] text-slate">
              {t.benef_prenom} {t.benef_nom} recevra
            </span>
            <span className="text-[1.5rem] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
              {formatDevise(
                t.montant_recu_cts / 100,
                t.devise_arrivee as Devise,
              )}
            </span>
          </div>
        </div>

        {enAgence ? (
          <div className="flex flex-col gap-4 rounded-frame bg-ink p-8 text-white">
            <EyebrowLabel tone="frost">Où payer</EyebrowLabel>
            <p className="inline-flex items-start gap-3 text-[1.0625rem] leading-snug font-medium">
              <MapPin size={19} aria-hidden className="mt-0.5 shrink-0" />
              {COMPANY.address}, {COMPANY.city}
            </p>
            <p className="text-[0.9375rem] leading-relaxed text-white/60">
              Munissez-vous d&apos;une pièce d&apos;identité et de votre code de
              référence.
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <a href={PHONE_HREF}>
              <Phone size={17} aria-hidden />
              {COMPANY.phone}
            </a>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/transfert-argent/suivi">Suivre ce transfert</Link>
          </Button>
        </div>

        <p className="text-center text-[0.8125rem] leading-relaxed text-slate">
          Un transfert remis ne peut pas être annulé. En cas de doute sur le
          bénéficiaire, appelez-nous avant de payer.
        </p>
      </div>
    </Container>
  );
}

function Ligne({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-[0.9375rem]">
      <span className="text-graphite">{label}</span>
      <span className="shrink-0 text-ink tabular-nums">{valeur}</span>
    </div>
  );
}
