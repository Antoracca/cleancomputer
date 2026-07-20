"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { formatXAF } from "@/lib/format/currency";
import { suivreCommande, type ResultatSuivi } from "@/features/panier/actions";
import { cn } from "@/lib/utils/cn";

const STATUTS: Record<string, { label: string; rang: number }> = {
  en_attente: { label: "Enregistrée", rang: 0 },
  payee: { label: "Payée", rang: 1 },
  preparation: { label: "En préparation", rang: 2 },
  expediee: { label: "En livraison", rang: 3 },
  livree: { label: "Livrée", rang: 4 },
  annulee: { label: "Annulée", rang: -1 },
};

const CHAINE = ["Enregistrée", "En préparation", "En livraison", "Livrée"];

/**
 * SUIVI DE COMMANDE SANS COMPTE
 *
 * Référence + téléphone, les deux obligatoires — voir actions.ts pour la
 * justification. Le statut s'affiche sur une chaîne d'étapes illustrée.
 */
export function SuiviForm() {
  const [reference, setReference] = useState("");
  const [telephone, setTelephone] = useState("");
  const [pending, setPending] = useState(false);
  const [resultat, setResultat] = useState<ResultatSuivi | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setResultat(null);
    const r = await suivreCommande({ reference, telephone });
    setResultat(r);
    setPending(false);
  }

  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Référence de commande"
            htmlFor="reference"
            hint="Format CC-XXXXXX, reçue à la confirmation."
          >
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              placeholder="CC-ABC123"
              autoComplete="off"
              className="uppercase"
            />
          </Field>
          <Field
            label="Téléphone de la commande"
            htmlFor="telephone"
            hint="Celui donné en commandant."
          >
            <Input
              id="telephone"
              type="tel"
              inputMode="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+236 70 00 00 00"
            />
          </Field>
        </div>
        <div>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? (
              <>
                <Loader2 size={17} aria-hidden className="animate-spin" />
                Recherche…
              </>
            ) : (
              "Voir ma commande"
            )}
          </Button>
        </div>
      </form>

      {resultat && !resultat.ok ? (
        <p
          role="alert"
          className="rounded-action border border-mist bg-white px-5 py-4 text-body text-graphite"
        >
          {resultat.erreur}
        </p>
      ) : null}

      {resultat?.ok ? (
        <div className="flex flex-col gap-8 rounded-frame border border-mist/60 bg-white p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <EyebrowLabel>Votre commande</EyebrowLabel>
            <span className="text-[0.875rem] text-slate">
              Passée le{" "}
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                new Date(resultat.creeLe),
              )}
            </span>
          </div>

          {/* Chaîne de statuts */}
          {STATUTS[resultat.statut]?.rang === -1 ? (
            <p className="text-title text-danger">Commande annulée</p>
          ) : (
            <ol className="flex flex-col gap-0 sm:flex-row sm:gap-2">
              {CHAINE.map((etape, i) => {
                const rangActuel = Math.min(
                  STATUTS[resultat.statut]?.rang ?? 0,
                  3,
                );
                // « payée » (rang 1) reste sur la première étape visuelle
                const rangVisuel = rangActuel <= 1 ? 0 : rangActuel - 1;
                const atteint = i <= rangVisuel;
                return (
                  <li key={etape} className="flex flex-1 items-center gap-2 py-1.5 sm:flex-col sm:py-0">
                    <span
                      aria-hidden
                      className={cn(
                        "size-3 shrink-0 rounded-full transition-colors",
                        atteint ? "bg-success" : "bg-ghost",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[0.875rem]",
                        atteint ? "font-medium text-ink" : "text-slate",
                      )}
                    >
                      {etape}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          <ul className="flex flex-col border-t border-mist/60 pt-5">
            {resultat.lignes.map((l, i) => (
              <li key={i} className="py-1.5 text-body text-graphite">
                {l.quantite} × {l.libelle}
              </li>
            ))}
          </ul>
          <p className="text-body font-medium text-ink tabular-nums">
            Total : {formatXAF(resultat.totalXaf)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
