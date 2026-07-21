import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck, Timer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { MarqueLogo } from "@/components/shared/MarqueLogo";
import {
  ABONNEMENTS,
  CATEGORIES,
  DUREE_LABELS,
  getAbonnementsParCategorie,
  getFormuleEntree,
  libellePrixFormule,
} from "@/lib/data/abonnements";

/**
 * INDEX DES ABONNEMENTS
 *
 * Les dix-huit entrées du mega-menu pointaient dans le vide. Cette page est
 * leur point d'atterrissage commun, groupée par catégorie plutôt qu'en une
 * grille de dix-huit tuiles indifférenciées : personne ne cherche « un
 * abonnement », on cherche de la vidéo, de la musique ou une licence.
 */
export const metadata: Metadata = {
  title: "Abonnements",
  description:
    "Netflix, Spotify, Microsoft 365, Starlink et douze autres services activés depuis Bangui, réglés en francs CFA, sans carte bancaire internationale.",
};

const ARGUMENTS = [
  {
    icone: CreditCard,
    titre: "Réglé en francs CFA",
    texte:
      "Aucune carte bancaire internationale n'est nécessaire. Vous payez sur place, nous réglons l'éditeur.",
  },
  {
    icone: Timer,
    titre: "Activé le jour même",
    texte:
      "La plupart des services sont ouverts en moins de deux heures pendant les horaires d'atelier.",
  },
  {
    icone: ShieldCheck,
    titre: "Votre compte reste le vôtre",
    texte:
      "L'abonnement est posé sur votre propre compte, avec vos identifiants. Rien n'est mutualisé.",
  },
] as const;

export default function AbonnementsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Abonnements"
        title="Vos services préférés, activés depuis Bangui."
        intro="Dix-huit abonnements que vous ne pouvez pas payer directement depuis la Centrafrique faute de carte internationale. On s'en charge, vous réglez en francs CFA."
        meta={[
          `${ABONNEMENTS.length} services`,
          "Activation le jour même",
          "Paiement en espèces ou mobile money",
        ]}
      />

      <Container className="pb-32">
        {/* ───────────── Pourquoi passer par nous ───────────── */}
        <ul className="grid gap-4 sm:grid-cols-3">
          {ARGUMENTS.map(({ icone: Icone, titre, texte }) => (
            <li
              key={titre}
              className="flex flex-col gap-3 rounded-frame border border-mist/60 bg-white p-7"
            >
              <Icone size={20} aria-hidden className="text-brand" />
              <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                {titre}
              </span>
              <span className="text-[0.9375rem] leading-relaxed text-graphite">
                {texte}
              </span>
            </li>
          ))}
        </ul>

        {/* ───────────── Le catalogue, par catégorie ───────────── */}
        {CATEGORIES.map((categorie) => {
          const abonnements = getAbonnementsParCategorie(categorie.id);
          if (abonnements.length === 0) return null;

          return (
            <section key={categorie.id} className="mt-20">
              <div className="flex flex-col gap-4">
                <EyebrowLabel>{categorie.nom}</EyebrowLabel>
                <p className="max-w-lg text-body text-graphite">
                  {categorie.intro}
                </p>
              </div>

              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {abonnements.map((abonnement) => {
                  const entree = getFormuleEntree(abonnement);

                  return (
                    <li key={abonnement.slug}>
                      <Link
                        href={`/abonnements/${abonnement.slug}`}
                        className="group/carte flex h-full flex-col gap-5 rounded-frame border border-mist/60 bg-white p-7 transition-[border-color,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-slate"
                      >
                        <span className="flex items-center gap-4">
                          <MarqueLogo
                            src={abonnement.logo}
                            nom={abonnement.nom}
                            className="size-7 shrink-0 object-contain"
                          />
                          <span className="flex flex-col">
                            <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                              {abonnement.nom}
                            </span>
                            <span className="text-[0.8125rem] text-slate">
                              {abonnement.editeur}
                            </span>
                          </span>
                        </span>

                        <span className="text-[0.9375rem] leading-relaxed text-graphite">
                          {abonnement.accroche}
                        </span>

                        <span className="mt-auto flex items-end justify-between gap-3 border-t border-mist/60 pt-5">
                          <span className="flex flex-col gap-0.5">
                            <span className="text-[0.75rem] text-slate">
                              À partir de
                            </span>
                            <span className="text-[1.0625rem] font-medium text-ink tabular-nums">
                              {libellePrixFormule(entree)}{" "}
                              <span className="text-[0.8125rem] font-[450] text-slate">
                                {DUREE_LABELS[entree.duree]}
                              </span>
                            </span>
                          </span>
                          <ArrowRight
                            size={16}
                            aria-hidden
                            className="mb-1 shrink-0 text-ink transition-transform duration-200 ease-out-soft group-hover/carte:translate-x-1"
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        {/* ───────────── Passerelle ───────────── */}
        <div className="mt-20 flex flex-col gap-6 rounded-frame bg-ink px-8 py-14 md:px-14 md:py-16">
          <EyebrowLabel tone="frost">Un service absent de la liste</EyebrowLabel>
          <h2 className="max-w-2xl text-display text-white">
            Si l&apos;éditeur accepte un paiement depuis l&apos;étranger, on
            peut l&apos;activer.
          </h2>
          <p className="max-w-lg text-body text-white/70">
            Dites-nous lequel et sous quelle formule. On vérifie la faisabilité
            et on vous annonce le prix avant tout engagement.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="onDark" size="lg">
              <Link href="/contact">Demander un service</Link>
            </Button>
            <Button asChild variant="ghostOnDark" size="lg">
              <Link href="/electronique">Voir le matériel</Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
