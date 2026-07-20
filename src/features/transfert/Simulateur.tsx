"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpDown, Info } from "lucide-react";
import { Drapeau } from "@/features/transfert/Drapeau";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import {
  DEVISE_LABELS,
  FRAIS_SERVICE_PCT,
  OPERATEURS,
  PAYS,
  calculerTransfert,
  formatDevise,
  getPays,
  operateursDisponibles,
  type OperateurId,
} from "@/lib/data/transfert";

/**
 * SIMULATEUR DE TRANSFERT
 *
 * Le calcul est LOCAL et synchrone : chaque frappe recalcule instantanément,
 * sans aller-retour réseau. Sur un service financier, voir le montant reçu
 * bouger en direct pendant qu'on tape est ce qui crée la confiance.
 *
 * Trois règles de conception :
 *
 * — La DEVISE N'EST JAMAIS CHOISIE séparément, elle découle du pays. Laisser
 *   associer un pays et une devise incohérents produirait des montants faux.
 *
 * — Changer de pays peut rendre l'opérateur courant indisponible : Orange Money
 *   ne couvre que le corridor Centrafrique ↔ Maroc. Dans ce cas on bascule
 *   automatiquement vers un opérateur valide au lieu d'afficher une erreur.
 *
 * — Les frais s'AJOUTENT au montant. L'expéditeur paie « montant + frais », le
 *   bénéficiaire reçoit l'intégralité de la somme annoncée. C'est le modèle le
 *   moins ambigu pour celui qui envoie.
 */
export function Simulateur({
  onContinuer,
  canalImpose,
}: {
  onContinuer?: (donnees: {
    montant: number;
    departCode: string;
    arriveeCode: string;
    operateur: OperateurId;
  }) => void;
  /**
   * Quand le canal a déjà été choisi à l'écran précédent, le sélecteur
   * d'opérateur disparaît : le répéter obligerait à refaire un choix
   * qui vient d'être fait.
   */
  canalImpose?: OperateurId;
}) {
  const [departCode, setDepartCode] = useState("CF");
  const [arriveeCode, setArriveeCode] = useState("MA");
  const [operateurId, setOperateurId] = useState<OperateurId>(
    canalImpose ?? "orange-money",
  );
  const [saisie, setSaisie] = useState("100000");

  const depart = getPays(departCode) ?? PAYS[0]!;
  const arrivee = getPays(arriveeCode) ?? PAYS[1]!;

  const disponibles = useMemo(
    () => operateursDisponibles(depart, arrivee),
    [depart, arrivee],
  );

  // Si le corridor choisi exclut l'opérateur courant, on bascule sur le premier
  // opérateur valide plutôt que de laisser une sélection impossible.
  useEffect(() => {
    if (!disponibles.some((o) => o.id === operateurId)) {
      const premier = disponibles[0];
      if (premier) setOperateurId(premier.id);
    }
  }, [disponibles, operateurId]);

  const operateur =
    disponibles.find((o) => o.id === operateurId) ?? disponibles[0];

  const montant = Number(saisie.replace(/[^\d.]/g, "")) || 0;

  const chiffrage = useMemo(
    () =>
      operateur
        ? calculerTransfert(montant, depart, arrivee, operateur)
        : null,
    [montant, depart, arrivee, operateur],
  );

  function inverser() {
    setDepartCode(arriveeCode);
    setArriveeCode(departCode);
  }

  const memeDevise = depart.devise === arrivee.devise;

  return (
    <div className="flex flex-col gap-8 rounded-frame border border-mist/60 bg-white p-6 md:p-10">
      {/* ─────────── Choix des pays ─────────── */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <SelecteurPays
          label="Vous envoyez depuis"
          valeur={departCode}
          onChange={setDepartCode}
        />

        <button
          type="button"
          onClick={inverser}
          aria-label="Inverser les pays"
          className="mx-auto grid size-11 shrink-0 place-items-center rounded-full border border-mist bg-white text-ink transition-[transform,border-color] duration-200 ease-out-soft hover:rotate-180 hover:border-ink md:mb-1"
        >
          <ArrowUpDown size={17} className="md:rotate-90" />
        </button>

        <SelecteurPays
          label="Le bénéficiaire reçoit au"
          valeur={arriveeCode}
          onChange={setArriveeCode}
        />
      </div>

      {/* ─────────── Choix de l'opérateur ─────────── */}
      {canalImpose ? null : (
      <div className="flex flex-col gap-3">
        <span className="text-[0.875rem] font-medium text-ink">
          Par quel service ?
        </span>

        <div className="grid gap-3 sm:grid-cols-3">
          {OPERATEURS.map((o) => {
            const utilisable = disponibles.some((d) => d.id === o.id);
            const actif = operateur?.id === o.id;

            return (
              <button
                key={o.id}
                type="button"
                onClick={() => utilisable && setOperateurId(o.id)}
                disabled={!utilisable}
                aria-pressed={actif}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-action border-[1.5px] p-4 text-left transition-colors duration-200",
                  actif
                    ? "border-ink bg-frost"
                    : "border-mist bg-white hover:border-slate",
                  !utilisable && "cursor-not-allowed opacity-40",
                )}
              >
                <span className="relative h-6 w-full">
                  <Image
                    src={o.logo}
                    alt={o.nom}
                    fill
                    sizes="160px"
                    className="object-contain object-left"
                  />
                </span>
                <span className="text-[0.8125rem] leading-snug text-slate">
                  {utilisable ? o.baseline : "Corridor non couvert"}
                </span>
              </button>
            );
          })}
        </div>

        {operateur?.note ? (
          <p className="text-[0.8125rem] text-slate">{operateur.note}</p>
        ) : null}
      </div>
      )}

      {/* Rappel de corridor quand le canal vient de l'écran précédent */}
      {canalImpose && operateur?.note ? (
        <p className="text-[0.875rem] text-slate">{operateur.note}</p>
      ) : null}

      {/* ─────────── Montant ─────────── */}
      <div className="flex flex-col gap-3">
        <label
          htmlFor="montant-transfert"
          className="text-[0.875rem] font-medium text-ink"
        >
          Combien voulez-vous envoyer ?
        </label>

        <div className="relative">
          <input
            id="montant-transfert"
            type="text"
            inputMode="numeric"
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            className="min-h-16 w-full rounded-action border border-mist bg-white pr-24 pl-6 text-[1.5rem] font-medium text-ink tabular-nums transition-colors focus:border-brand focus:outline-none"
          />
          <span className="pointer-events-none absolute top-1/2 right-6 -translate-y-1/2 text-[0.9375rem] font-medium text-slate">
            {depart.devise === "XAF" || depart.devise === "XOF"
              ? "FCFA"
              : depart.devise}
          </span>
        </div>
      </div>

      {/* ─────────── Détail du calcul ─────────── */}
      {chiffrage && operateur ? (
        <div className="flex flex-col gap-5 rounded-action bg-frost p-6">
          <Ligne
            label="Montant envoyé"
            valeur={formatDevise(chiffrage.montantEnvoye, chiffrage.deviseDepart)}
          />
          <Ligne
            label={`Frais ${operateur.nom} (${
              depart.code === "CF"
                ? operateur.fraisPct.depuisCF
                : operateur.fraisPct.versCF
            } %)`}
            valeur={formatDevise(chiffrage.fraisOperateur, chiffrage.deviseDepart)}
          />
          <Ligne
            label={`Frais de service (${FRAIS_SERVICE_PCT} %)`}
            valeur={formatDevise(chiffrage.fraisService, chiffrage.deviseDepart)}
          />

          <div className="flex items-baseline justify-between gap-4 border-t border-mist/70 pt-5">
            <span className="text-[1.0625rem] font-medium text-ink">
              Total à payer
            </span>
            <span className="text-[1.25rem] font-medium text-ink tabular-nums">
              {formatDevise(chiffrage.totalAPayer, chiffrage.deviseDepart)}
            </span>
          </div>

          {/* Le montant reçu est l'information la plus regardée : il a droit à
              son propre bloc, en encre, détaché du reste. */}
          <div className="flex flex-col gap-2 rounded-action bg-ink p-5 text-white">
            <span className="text-[0.8125rem] text-white/60">
              Le bénéficiaire reçoit
            </span>
            <span className="text-[clamp(1.5rem,4vw,2rem)] leading-none font-medium tracking-[-0.02em] tabular-nums">
              {formatDevise(chiffrage.montantRecu, chiffrage.deviseArrivee)}
            </span>
            {!memeDevise ? (
              <span className="text-[0.8125rem] text-white/50 tabular-nums">
                1 {chiffrage.deviseDepart} = {chiffrage.taux.toFixed(
                  chiffrage.deviseArrivee === "XAF" ? 2 : 4,
                )}{" "}
                {chiffrage.deviseArrivee} · {DEVISE_LABELS[chiffrage.deviseArrivee]}
              </span>
            ) : null}
            <span className="text-[0.8125rem] text-white/50">
              Réception estimée : {operateur.delai}
            </span>
          </div>

          {!operateur.baremeConfirme ? (
            <p className="flex items-start gap-2.5 rounded-action border border-warning/30 bg-white px-4 py-3 text-[0.8125rem] leading-relaxed text-graphite">
              <Info size={15} aria-hidden className="mt-0.5 shrink-0 text-warning" />
              Le barème {operateur.nom} n&apos;est pas encore confirmé. Le taux
              affiché est indicatif, appelez-nous avant d&apos;envoyer.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <Button
          type="button"
          size="lg"
          disabled={montant <= 0 || !operateur}
          onClick={() =>
            operateur &&
            onContinuer?.({
              montant,
              departCode,
              arriveeCode,
              operateur: operateur.id,
            })
          }
          className="w-full sm:w-fit"
        >
          Continuer
          <ArrowRight size={17} aria-hidden />
        </Button>

        <p className="text-[0.75rem] leading-relaxed text-slate">
          Le taux appliqué est celui en vigueur au moment du paiement.
        </p>
      </div>
    </div>
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

function SelecteurPays({
  label,
  valeur,
  onChange,
}: {
  label: string;
  valeur: string;
  onChange: (code: string) => void;
}) {
  const pays = getPays(valeur);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={`pays-${label}`}
        className="text-[0.875rem] font-medium text-ink"
      >
        {label}
      </label>

      {/* Select natif : accessible, utilisable au clavier et léger. Un
          combobox sur mesure serait plus décoratif mais nettement plus
          fragile. Le drapeau est affiché à côté, un select ne pouvant pas
          contenir d'image. */}
      <div className="relative flex items-center rounded-pill border border-mist bg-white transition-colors focus-within:border-brand">
        <span className="pointer-events-none absolute left-5">
          {pays ? (
            <Drapeau code={pays.code} nom={pays.nom} className="h-4 w-6" />
          ) : null}
        </span>

        <select
          id={`pays-${label}`}
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-14 w-full appearance-none rounded-pill bg-transparent py-2 pr-5 pl-16 text-body text-ink focus:outline-none"
        >
          {PAYS.map((p) => (
            <option key={p.code} value={p.code}>
              {p.nom}
            </option>
          ))}
        </select>
      </div>

      {pays ? (
        <span className="pl-2 text-[0.8125rem] text-slate">
          {DEVISE_LABELS[pays.devise]}
        </span>
      ) : null}
    </div>
  );
}
