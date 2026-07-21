"use client";

import { RotateCcw, User, Users } from "lucide-react";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { useDevis } from "@/features/devis/store";
import { RechercheArticles } from "@/features/devis/RechercheArticles";
import { LignesDevis } from "@/features/devis/LignesDevis";
import { ActionsDevis } from "@/features/devis/ActionsDevis";
import { cn } from "@/lib/utils/cn";

/**
 * PANNEAU DE SAISIE
 *
 * Tout ce qui se règle est ici ; le document en face ne fait que refléter.
 * Cette séparation stricte est ce qui permet au document d'être exactement le
 * PDF final, sans champs de saisie qui traînent à l'impression.
 *
 * L'ordre suit le raisonnement de la personne : qui êtes-vous, que voulez-vous,
 * à quelles conditions, et enfin comment récupérer le document.
 */
export function PanneauDevis({ connecte }: { readonly connecte: boolean }) {
  const devis = useDevis((s) => s.devis);
  const definirClient = useDevis((s) => s.definirClient);
  const definirReglage = useDevis((s) => s.definirReglage);
  const definirNotes = useDevis((s) => s.definirNotes);
  const reinitialiser = useDevis((s) => s.reinitialiser);

  const entreprise = devis.client.type === "entreprise";

  return (
    <div className="flex flex-col gap-10">
      {/* ═════════ 1. QUI ═════════ */}
      <section className="flex flex-col gap-5">
        <EyebrowLabel>Le client</EyebrowLabel>

        <div className="grid grid-cols-2 gap-3">
          <ChoixType
            actif={!entreprise}
            onClick={() => definirClient("type", "particulier")}
            icone={<User size={19} aria-hidden />}
            label="Particulier"
          />
          <ChoixType
            actif={entreprise}
            onClick={() => definirClient("type", "entreprise")}
            icone={<Users size={19} aria-hidden />}
            label="Entreprise"
          />
        </div>

        {entreprise ? (
          <>
            <Champ
              label="Raison sociale"
              valeur={devis.client.nom}
              onChange={(v) => definirClient("nom", v)}
              placeholder="ETS EXEMPLE"
            />
            <Champ
              label="Personne à contacter"
              valeur={devis.client.contact}
              onChange={(v) => definirClient("contact", v)}
            />
          </>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Champ
              label="Prénom"
              valeur={devis.client.prenom}
              onChange={(v) => definirClient("prenom", v)}
            />
            <Champ
              label="Nom"
              valeur={devis.client.nom}
              onChange={(v) => definirClient("nom", v)}
            />
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Champ
            label="Téléphone"
            valeur={devis.client.telephone}
            onChange={(v) => definirClient("telephone", v)}
            inputMode="tel"
            placeholder="+236 …"
          />
          <Champ
            label="Adresse email"
            valeur={devis.client.email}
            onChange={(v) => definirClient("email", v)}
            inputMode="email"
          />
        </div>

        <Champ
          label="Adresse"
          valeur={devis.client.adresse}
          onChange={(v) => definirClient("adresse", v)}
          placeholder="Quartier, ville"
        />

        {entreprise ? (
          <Champ
            label="NIU du client"
            valeur={devis.client.niu}
            onChange={(v) => definirClient("niu", v)}
            placeholder="Facultatif"
          />
        ) : null}
      </section>

      {/* ═════════ 2. QUOI ═════════ */}
      <section className="flex flex-col gap-5">
        <EyebrowLabel>Les articles</EyebrowLabel>
        <RechercheArticles />
      </section>

      {devis.lignes.length > 0 ? (
        <section className="flex flex-col gap-5">
          <EyebrowLabel>Le détail</EyebrowLabel>
          <LignesDevis />
        </section>
      ) : null}

      {/* ═════════ 3. CONDITIONS ═════════ */}
      <section className="flex flex-col gap-5">
        <EyebrowLabel>Les conditions</EyebrowLabel>

        <div className="grid gap-3 sm:grid-cols-3">
          <ChampNombre
            label="Remise globale %"
            valeur={devis.remiseGlobalePct}
            onChange={(v) => definirReglage("remiseGlobalePct", v)}
          />
          <ChampNombre
            label="Acompte %"
            valeur={devis.acomptePct}
            onChange={(v) => definirReglage("acomptePct", v)}
          />
          <ChampNombre
            label="Validité (jours)"
            valeur={devis.valableJours}
            onChange={(v) => definirReglage("valableJours", v)}
          />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[0.8125rem] font-medium text-graphite">
            Précisions imprimées sur le devis
          </span>
          <textarea
            value={devis.notes}
            onChange={(e) => definirNotes(e.target.value)}
            rows={3}
            placeholder="Délai de livraison, conditions particulières…"
            className="rounded-action border-[1.5px] border-mist bg-white px-3.5 py-3 text-[0.9375rem] leading-relaxed text-ink transition-colors outline-none placeholder:text-slate focus:border-ink"
          />
        </label>
      </section>

      {/* ═════════ 4. RÉCUPÉRER ═════════ */}
      <ActionsDevis connecte={connecte} />

      <button
        type="button"
        onClick={() => {
          if (window.confirm("Effacer ce devis et repartir de zéro ?")) {
            reinitialiser();
          }
        }}
        className="inline-flex min-h-11 items-center justify-center gap-2 text-[0.875rem] text-slate transition-colors hover:text-ink"
      >
        <RotateCcw size={15} aria-hidden />
        Recommencer un devis vierge
      </button>
    </div>
  );
}

/* ────────────────────────── pièces ────────────────────────── */

function ChoixType({
  actif,
  onClick,
  icone,
  label,
}: {
  readonly actif: boolean;
  readonly onClick: () => void;
  readonly icone: React.ReactNode;
  readonly label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn(
        "flex min-h-14 items-center justify-center gap-2.5 rounded-action border-[1.5px] text-[0.9375rem] font-medium transition-colors",
        actif
          ? "border-ink bg-ink text-frost"
          : "border-mist bg-white text-graphite hover:border-slate hover:text-ink",
      )}
    >
      {icone}
      {label}
    </button>
  );
}

function Champ({
  label,
  valeur,
  onChange,
  placeholder,
  inputMode,
}: {
  readonly label: string;
  readonly valeur: string;
  readonly onChange: (v: string) => void;
  readonly placeholder?: string;
  readonly inputMode?: "tel" | "email" | "text";
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.8125rem] font-medium text-graphite">
        {label}
      </span>
      <input
        type="text"
        value={valeur}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-12 rounded-action border-[1.5px] border-mist bg-white px-3.5 text-[0.9375rem] text-ink transition-colors outline-none placeholder:text-slate focus:border-ink"
      />
    </label>
  );
}

function ChampNombre({
  label,
  valeur,
  onChange,
}: {
  readonly label: string;
  readonly valeur: number;
  readonly onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.8125rem] font-medium text-graphite">
        {label}
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={valeur}
        onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")))}
        className="min-h-12 rounded-action border-[1.5px] border-mist bg-white px-3.5 text-[0.9375rem] text-ink tabular-nums transition-colors outline-none focus:border-ink"
      />
    </label>
  );
}
