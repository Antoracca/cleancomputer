"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search, Sparkles } from "lucide-react";
import {
  PAYS,
  calculerTransfert,
  getOperateur,
  operateursDisponibles,
  type Pays,
} from "@/lib/data/transfert";
import { cn } from "@/lib/utils/cn";

/**
 * FORMULAIRE MONEYGRAM
 *
 * Reproduction du parcours MoneyGram en deux temps :
 *
 *   1. les deux pays, sur des champs gris à libellé superposé ;
 *   2. le chiffrage, avec taux, montants, frais et total.
 *
 * ÉCART ASSUMÉ À LA CHARTE : rayons de 8 à 12px sur les champs, bannis
 * ailleurs sur le site. C'est la signature du formulaire MoneyGram et la
 * demande porte explicitement sur une reproduction fidèle. L'écart est borné
 * à ce composant, monté sur la seule page MoneyGram.
 *
 * Le chiffrage vient de `calculerTransfert`, la même fonction que le reste du
 * site. Les frais affichés ici sont donc les frais réellement appliqués, pas
 * une estimation d'affichage.
 *
 * Le sélecteur de pays est une vraie liste déroulante accessible : navigable
 * au clavier, fermée par Échap, refermée au clic extérieur. Un `select` natif
 * n'aurait pas permis les pastilles de drapeau ni le groupe « les plus
 * courants ».
 */

/** Pays mis en tête de liste, comme sur la capture. */
const COURANTS = ["MA", "CM", "SN", "CI", "FR"] as const;

/** Drapeaux en emoji régional : ce ne sont pas des icônes dessinées mais des
 *  caractères Unicode, rendus par la police système. Aucun fichier à charger,
 *  aucun visuel inventé. */
function drapeau(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

export function EnvoiMoneyGram() {
  const [etape, setEtape] = useState<0 | 1>(0);
  const [departCode, setDepartCode] = useState("FR");
  const [arriveeCode, setArriveeCode] = useState<string | null>(null);
  const [montant, setMontant] = useState("100");

  const depart = PAYS.find((p) => p.code === departCode);
  const arrivee = arriveeCode
    ? PAYS.find((p) => p.code === arriveeCode)
    : undefined;

  const operateur = getOperateur("moneygram");

  // MoneyGram n'est pas praticable sur tous les couples de pays. Mieux vaut
  // le dire ici que laisser l'utilisateur remplir un dossier qui sera refusé.
  const praticable = useMemo(() => {
    if (!depart || !arrivee) return true;
    return operateursDisponibles(depart, arrivee).some(
      (o) => o.id === "moneygram",
    );
  }, [depart, arrivee]);

  const chiffrage =
    depart && arrivee && operateur
      ? calculerTransfert(Number(montant.replace(",", ".")) || 0, depart, arrivee, operateur)
      : null;

  const pretAContinuer = Boolean(arrivee) && praticable;

  return (
    <div className="flex flex-col gap-5">
      {etape === 0 ? (
        <>
          <p className="text-center text-[1.25rem] font-extrabold tracking-[-0.02em] text-ink">
            Envoi depuis :
          </p>
          <SelecteurPays
            valeur={depart}
            onChange={(p) => setDepartCode(p.code)}
            exclure={arriveeCode}
          />

          <p className="text-center text-[1.25rem] font-extrabold tracking-[-0.02em] text-ink">
            Envoi à :
          </p>
          <SelecteurPays
            valeur={arrivee}
            onChange={(p) => setArriveeCode(p.code)}
            exclure={departCode}
          />

          {!praticable ? (
            <p className="rounded-[0.5rem] bg-signal/10 px-4 py-3 text-[0.875rem] leading-relaxed text-signal">
              MoneyGram ne dessert pas ce couple de pays. Choisissez une autre
              destination, ou revenez aux autres services.
            </p>
          ) : null}

          <button
            type="button"
            disabled={!pretAContinuer}
            onClick={() => setEtape(1)}
            className={cn(
              "min-h-14 w-full rounded-[0.5rem] text-[1.0625rem] font-bold transition-colors",
              pretAContinuer
                ? "bg-ink text-white hover:bg-charcoal"
                : "cursor-not-allowed bg-[#b4b4b4] text-white",
            )}
          >
            Envoyer de l&apos;argent
          </button>
        </>
      ) : null}

      {etape === 1 && chiffrage && depart && arrivee ? (
        <>
          {/* Bandeau de taux */}
          <div className="flex items-start gap-3 rounded-[0.75rem] bg-[linear-gradient(100deg,#f6f7f9_0%,#faf6f2_60%,#fdf1e8_100%)] px-4 py-3.5">
            <Sparkles size={18} aria-hidden className="mt-0.5 shrink-0 text-ink" />
            <span className="flex flex-col gap-0.5">
              <span className="text-[0.9375rem] text-ink">
                D&apos;excellents taux, à chaque transfert
              </span>
              <span className="text-[0.9375rem] font-bold text-ink tabular-nums">
                1 {depart.devise} = {formaterNombre(chiffrage.taux)}{" "}
                {arrivee.devise}
              </span>
            </span>
          </div>

          {/* Vous envoyez — le seul champ saisissable */}
          <div className="rounded-[0.5rem] border border-mist/70 px-4 py-3">
            <label className="flex flex-col gap-1">
              <span className="text-[0.875rem] text-graphite">
                Vous envoyez
              </span>
              <span className="flex items-baseline justify-between gap-3">
                <input
                  type="text"
                  inputMode="decimal"
                  value={montant}
                  onChange={(e) =>
                    setMontant(e.target.value.replace(/[^\d.,]/g, ""))
                  }
                  className="min-w-0 flex-1 bg-transparent text-[1.5rem] font-bold tracking-[-0.02em] text-ink outline-none tabular-nums"
                />
                <span className="shrink-0 text-[1.0625rem] font-bold text-ink">
                  {depart.devise}
                </span>
              </span>
            </label>
          </div>

          {/* Ils reçoivent */}
          <div className="rounded-[0.5rem] border border-mist/70 px-4 py-3">
            <span className="flex flex-col gap-1">
              <span className="text-[0.875rem] text-graphite">
                Ils reçoivent
              </span>
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[1.5rem] font-bold tracking-[-0.02em] text-ink tabular-nums">
                  {formaterNombre(chiffrage.montantRecu)}
                </span>
                <span className="shrink-0 text-[1.0625rem] font-bold text-ink">
                  {arrivee.devise}
                </span>
              </span>
            </span>
          </div>

          {/* Frais et total */}
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[0.9375rem] text-ink underline decoration-mist underline-offset-4">
                Frais
              </span>
              <span className="text-[0.9375rem] font-bold text-ink tabular-nums">
                {formaterNombre(
                  chiffrage.fraisOperateur + chiffrage.fraisService,
                )}{" "}
                {depart.devise}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[1.0625rem] font-bold text-ink">
                Votre total
              </span>
              <span className="text-[1.0625rem] font-bold text-ink tabular-nums">
                {formaterNombre(chiffrage.totalAPayer)} {depart.devise}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEtape(0)}
            className="min-h-14 w-full rounded-[0.5rem] bg-ink text-[1.0625rem] font-bold text-white transition-colors hover:bg-charcoal"
          >
            Commencer
          </button>

          <button
            type="button"
            onClick={() => setEtape(0)}
            className="min-h-11 text-[0.875rem] text-graphite transition-colors hover:text-ink"
          >
            Changer de pays
          </button>

          <p className="text-[0.75rem] leading-relaxed text-slate">
            Frais opérateur et frais de service compris. Le montant reçu dépend
            du taux au moment du règlement.
          </p>
        </>
      ) : null}
    </div>
  );
}

/* ───────────────────── sélecteur de pays ───────────────────── */

function SelecteurPays({
  valeur,
  onChange,
  exclure,
}: {
  readonly valeur: Pays | undefined;
  readonly onChange: (p: Pays) => void;
  readonly exclure?: string | null;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [recherche, setRecherche] = useState("");
  const boite = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur et à la touche Échap. Sans ça, une liste
  // ouverte reste ouverte derrière le reste de la page.
  useEffect(() => {
    if (!ouvert) return;

    function auClic(e: MouseEvent) {
      if (boite.current && !boite.current.contains(e.target as Node)) {
        setOuvert(false);
      }
    }
    function auClavier(e: KeyboardEvent) {
      if (e.key === "Escape") setOuvert(false);
    }

    document.addEventListener("mousedown", auClic);
    document.addEventListener("keydown", auClavier);
    return () => {
      document.removeEventListener("mousedown", auClic);
      document.removeEventListener("keydown", auClavier);
    };
  }, [ouvert]);

  const disponibles = PAYS.filter((p) => p.code !== exclure);
  const filtres = recherche.trim()
    ? disponibles.filter((p) =>
        p.nom.toLowerCase().includes(recherche.trim().toLowerCase()),
      )
    : null;

  const courants = disponibles.filter((p) =>
    (COURANTS as readonly string[]).includes(p.code),
  );
  const autres = disponibles.filter(
    (p) => !(COURANTS as readonly string[]).includes(p.code),
  );

  function choisir(p: Pays) {
    onChange(p);
    setOuvert(false);
    setRecherche("");
  }

  return (
    <div ref={boite} className="relative">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        aria-haspopup="listbox"
        className="flex min-h-[4.25rem] w-full items-center justify-between gap-3 rounded-[0.5rem] bg-[#f2f2f2] px-4 py-3 text-left transition-colors hover:bg-[#ececec]"
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-[0.875rem] text-graphite">Pays</span>
          <span className="flex items-center gap-2.5 text-[1.0625rem] text-ink">
            {valeur ? (
              <>
                <span aria-hidden className="text-[1.25rem] leading-none">
                  {drapeau(valeur.code)}
                </span>
                {valeur.nom}
              </>
            ) : (
              <span className="text-graphite">Sélectionnez un pays</span>
            )}
          </span>
        </span>
        {ouvert ? (
          <ChevronUp size={20} aria-hidden className="shrink-0 text-ink" />
        ) : (
          <ChevronDown size={20} aria-hidden className="shrink-0 text-ink" />
        )}
      </button>

      {ouvert ? (
        <div
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-[0.5rem] bg-white shadow-[0_18px_44px_-12px_rgba(15,21,32,0.3)]"
        >
          <div className="flex items-center gap-2.5 border-b border-mist/60 px-4 py-3">
            <Search size={16} aria-hidden className="shrink-0 text-slate" />
            <input
              type="text"
              autoFocus
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Sélectionnez un pays"
              className="w-full bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-slate"
            />
          </div>

          <div className="max-h-72 overflow-y-auto">
            {filtres ? (
              filtres.length > 0 ? (
                filtres.map((p) => (
                  <Ligne key={p.code} pays={p} onClick={() => choisir(p)} />
                ))
              ) : (
                <p className="px-4 py-5 text-[0.9375rem] text-slate">
                  Aucun pays ne correspond.
                </p>
              )
            ) : (
              <>
                <p className="px-4 pt-3 pb-1.5 text-[0.9375rem] text-graphite">
                  Pays les plus courants
                </p>
                {courants.map((p) => (
                  <Ligne key={p.code} pays={p} onClick={() => choisir(p)} />
                ))}
                <p className="px-4 pt-3 pb-1.5 text-[0.9375rem] text-graphite">
                  Tous les pays
                </p>
                {autres.map((p) => (
                  <Ligne key={p.code} pays={p} onClick={() => choisir(p)} />
                ))}
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Ligne({
  pays,
  onClick,
}: {
  readonly pays: Pays;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={false}
      onClick={onClick}
      className="flex min-h-12 w-full items-center gap-3 px-4 py-2.5 text-left text-[1.0625rem] text-ink transition-colors hover:bg-[#f2f2f2]"
    >
      <span aria-hidden className="text-[1.25rem] leading-none">
        {drapeau(pays.code)}
      </span>
      {pays.nom}
    </button>
  );
}

/** Format MoneyGram : séparateur de milliers, deux décimales. */
function formaterNombre(valeur: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valeur);
}
