import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { ContactForm } from "@/features/contact/ContactForm";
import { COMPANY } from "@/lib/config/company";

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrivez-nous. Nous répondons depuis Bangui.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Dites-nous ce dont vous avez besoin."
        intro="Une question sur un produit, un projet à chiffrer, une commande en cours : écrivez, on répond."
      />

      <Container className="pb-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-20">
          <ContactForm />

          <aside className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <EyebrowLabel>Où nous sommes</EyebrowLabel>
              <p className="text-body text-graphite">
                {COMPANY.city}, {COMPANY.country}
              </p>
              {/* Aucune coordonnée n'est affichée tant que le document fiscal
                  n'est pas fourni — voir lib/config/company.ts */}
              {COMPANY.phone ? (
                <p className="text-body text-graphite">{COMPANY.phone}</p>
              ) : null}
              {COMPANY.email ? (
                <p className="text-body text-graphite">{COMPANY.email}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 rounded-frame bg-frost-lifted p-8">
              <h2 className="text-title text-ink">Un projet à chiffrer ?</h2>
              <p className="text-body text-graphite">
                Le configurateur de devis vous donne un ordre de prix
                immédiatement, sans attendre notre réponse.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
