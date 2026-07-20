import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { COMPANY, hasLegalInfo } from "@/lib/config/company";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

/**
 * ⚠️ Cette page ne peut pas être complétée sans le document fiscal de
 * l'entreprise. Inventer une raison sociale, un RCCM ou une adresse serait une
 * fausse déclaration — pas un placeholder.
 *
 * Elle affiche donc explicitement ce qui manque, et n'affirme rien de faux.
 */
export default function MentionsLegalesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Informations légales"
        title="Mentions légales"
      />

      <Container className="pb-32">
        <div className="flex max-w-3xl flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h2 className="text-title text-ink">Éditeur du site</h2>
            {hasLegalInfo() ? (
              <dl className="grid gap-4 sm:grid-cols-2">
                <Ligne label="Raison sociale" valeur={COMPANY.legalName} />
                <Ligne label="Nom commercial" valeur={COMPANY.tradeName} />
                <Ligne label="Forme juridique" valeur={COMPANY.legalForm} />
                <Ligne label="Activité" valeur={COMPANY.activity} />
                <Ligne label="Numéro RCCM" valeur={COMPANY.rccm} />
                <Ligne label="NIU" valeur={COMPANY.niu} />
                <Ligne
                  label="Siège"
                  valeur={`${COMPANY.address}, ${COMPANY.city}, ${COMPANY.country}`}
                />
                <Ligne label="Téléphone" valeur={COMPANY.phone} />
              </dl>
            ) : (
              <p className="rounded-action border border-mist bg-white px-5 py-4 text-body text-graphite">
                Informations d&apos;immatriculation en attente.
              </p>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-title text-ink">Activité</h2>
            <p className="text-body text-graphite">
              {COMPANY.name} — vente de matériel électronique, prestations
              informatiques, création de sites et d&apos;applications, identité
              visuelle, transfert d&apos;argent et transit de marchandises.
              Établi à {COMPANY.city}, {COMPANY.country}.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-title text-ink">Marques citées</h2>
            <p className="text-body text-graphite">
              Les marques et visuels de produits présentés sur ce site
              appartiennent à leurs détenteurs respectifs. Ils illustrent des
              articles effectivement commercialisés par {COMPANY.name} et ne
              constituent ni un partenariat, ni une affiliation.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-title text-ink">Hébergement</h2>
            <p className="text-body text-graphite">
              L&apos;hébergeur du site sera précisé lors de la mise en ligne.
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}

function Ligne({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[0.8125rem] text-slate">{label}</dt>
      <dd className="text-body text-ink">{valeur}</dd>
    </div>
  );
}
