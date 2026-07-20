"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { formatXAF } from "@/lib/format/currency";
import { COMPANY } from "@/lib/config/company";
import { ETAPES, type Chiffrage, type Selection } from "@/features/devis/bareme";

/**
 * RÉCAPITULATIF DE DEVIS
 *
 * L'export PDF passe par l'impression du navigateur plutôt que par une
 * librairie de génération : zéro kilo-octet ajouté au bundle, fonctionne hors
 * ligne, et « Enregistrer en PDF » est natif sur tous les navigateurs modernes.
 * Une génération serveur n'apporterait rien tant qu'il n'y a pas d'envoi email.
 *
 * ⚠️ L'enregistrement en base et l'envoi par email arrivent avec la table
 * `devis` — le bouton correspondant le dit clairement.
 */
export function Recapitulatif({
  selection,
  chiffrage,
  onRetour,
  onRecommencer,
}: {
  selection: Selection;
  chiffrage: Chiffrage;
  onRetour: () => void;
  onRecommencer: () => void;
}) {
  const [notice, setNotice] = useState<string | null>(null);

  const reponses = ETAPES.map((etape) => ({
    titre: etape.titre,
    question: etape.question,
    choix: (selection[etape.id] ?? [])
      .map((id) => etape.options.find((o) => o.id === id)?.label)
      .filter((v): v is string => Boolean(v)),
  })).filter((r) => r.choix.length > 0);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 print:hidden">
        <EyebrowLabel>Votre estimation</EyebrowLabel>
        <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-medium tracking-[-0.02em] text-ink">
          Voici ce que ça donne.
        </h2>
      </div>

      {/* Document imprimable */}
      <article className="flex flex-col gap-8 rounded-frame border border-mist/60 bg-white p-8 md:p-12 print:border-0 print:p-0">
        <header className="flex flex-col gap-2 border-b border-mist/60 pb-6">
          <p className="text-title text-ink">Estimation de projet</p>
          <p className="text-[0.875rem] text-slate">
            {COMPANY.name} · {COMPANY.tradeName} · {COMPANY.city},{" "}
            {COMPANY.country}
          </p>
          <p className="text-[0.875rem] text-slate">
            RCCM {COMPANY.rccm} · NIU {COMPANY.niu} · {COMPANY.phone}
          </p>
        </header>

        <section className="flex flex-col gap-5">
          <h3 className="text-eyebrow text-slate uppercase">Votre projet</h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            {reponses.map((r) => (
              <div key={r.titre} className="flex flex-col gap-1">
                <dt className="text-[0.8125rem] text-slate">{r.titre}</dt>
                <dd className="text-body text-ink">{r.choix.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-eyebrow text-slate uppercase">Détail</h3>
          <ul className="flex flex-col">
            {chiffrage.lignes.map((ligne, i) => (
              <li
                key={`${ligne.label}-${i}`}
                className="flex items-baseline justify-between gap-4 border-b border-mist/40 py-3 text-body"
              >
                <span className="text-graphite">{ligne.label}</span>
                <span className="shrink-0 text-ink tabular-nums">
                  {formatXAF(ligne.montantXaf)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-baseline justify-between gap-4 pt-2">
            <span className="text-title text-ink">Total estimé</span>
            <span className="text-title text-ink tabular-nums">
              {formatXAF(chiffrage.totalXaf)}
            </span>
          </div>

          {chiffrage.semaines > 0 ? (
            <p className="text-[0.9375rem] text-graphite">
              Délai de réalisation estimé : environ {chiffrage.semaines} semaine
              {chiffrage.semaines > 1 ? "s" : ""}.
            </p>
          ) : null}
        </section>

        <footer className="border-t border-mist/60 pt-6">
          <p className="text-[0.75rem] leading-relaxed text-slate">
            Estimation indicative établie à partir des éléments déclarés, hors
            taxes applicables. Elle ne constitue pas un engagement contractuel :
            le devis définitif est établi après échange sur le projet. Prix
            exprimés en francs CFA (XAF).
          </p>
        </footer>
      </article>

      {notice ? (
        <p
          role="status"
          className="rounded-action border border-mist bg-white px-5 py-4 text-[0.875rem] text-graphite print:hidden"
        >
          {notice}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row print:hidden">
        <Button type="button" size="lg" onClick={() => window.print()}>
          <Printer size={17} aria-hidden />
          Enregistrer en PDF
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/contact">Faire valider ce devis</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => {
            setNotice(null);
            onRetour();
          }}
        >
          <ArrowLeft size={17} aria-hidden />
          Modifier
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={onRecommencer}>
          <RotateCcw size={16} aria-hidden />
          Recommencer
        </Button>
      </div>

      <p className="text-[0.8125rem] text-slate print:hidden">
        L&apos;enregistrement du devis dans votre compte et son envoi automatique
        par email seront actifs dès la mise en service de la base.
      </p>
    </div>
  );
}
