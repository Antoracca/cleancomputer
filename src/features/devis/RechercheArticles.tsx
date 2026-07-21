"use client";

import { useMemo, useState } from "react";
import { Plus, PackagePlus, Search, X } from "lucide-react";
import { formatXAF } from "@/lib/format/currency";
import {
  chercherCatalogue,
  FAMILLES_DEVIS,
  ligneLibre,
  versLigne,
  type EntreeCatalogue,
} from "@/features/devis/catalogue";
import { useDevis } from "@/features/devis/store";
import { cn } from "@/lib/utils/cn";

/**
 * RECHERCHE ET AJOUT D'ARTICLES
 *
 * RECHERCHE D'ABORD, NAVIGATION ENSUITE
 *
 * Le catalogue dépasse la centaine d'articles répartis sur quatre familles.
 * Les afficher tous, même bien rangés, produit un mur dans lequel personne ne
 * trouve rien. On tape trois lettres, on obtient trois lignes.
 *
 * LA PORTE DE SORTIE EST OBLIGATOIRE
 *
 * Un devis réel comporte toujours un article que la boutique ne référence pas
 * encore. Sans saisie libre, le commercial abandonne l'outil au premier cas
 * particulier et reprend son carnet. Elle est donc au même niveau que la
 * recherche, pas cachée derrière un lien.
 */
export function RechercheArticles() {
  const [requete, setRequete] = useState("");
  const [famille, setFamille] = useState<string | undefined>(undefined);
  const [modeLibre, setModeLibre] = useState(false);

  const ajouterLigne = useDevis((s) => s.ajouterLigne);

  const resultats = useMemo(
    () => chercherCatalogue(requete, famille, 30),
    [requete, famille],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5 rounded-action border-[1.5px] border-mist bg-white px-4 transition-colors focus-within:border-ink">
        <Search size={17} aria-hidden className="shrink-0 text-slate" />
        <input
          type="search"
          value={requete}
          onChange={(e) => setRequete(e.target.value)}
          placeholder="Ordinateur, Starlink, logo, Netflix…"
          aria-label="Rechercher un article"
          className="min-h-12 w-full bg-transparent text-body text-ink outline-none placeholder:text-slate"
        />
        {requete ? (
          <button
            type="button"
            onClick={() => setRequete("")}
            aria-label="Effacer la recherche"
            className="grid size-8 shrink-0 place-items-center rounded-full text-slate transition-colors hover:bg-ghost hover:text-ink"
          >
            <X size={15} />
          </button>
        ) : null}
      </div>

      {/* Familles : filtre secondaire, jamais le point d'entrée principal. */}
      <div className="flex gap-2 overflow-x-auto scroll-discret pb-1">
        <Puce actif={!famille} onClick={() => setFamille(undefined)}>
          Tout
        </Puce>
        {FAMILLES_DEVIS.map((f) => (
          <Puce
            key={f}
            actif={famille === f}
            onClick={() => setFamille(famille === f ? undefined : f)}
          >
            {f}
          </Puce>
        ))}
      </div>

      <ul className="flex max-h-[26rem] flex-col gap-1.5 overflow-y-auto scroll-discret">
        {resultats.map((entree) => (
          <li key={entree.cle}>
            <Resultat
              entree={entree}
              onAjouter={() => ajouterLigne(versLigne(entree))}
            />
          </li>
        ))}

        {resultats.length === 0 ? (
          <li className="rounded-action bg-frost px-4 py-5 text-[0.9375rem] leading-relaxed text-graphite">
            Aucun article ne correspond à « {requete} ». Ajoutez-le à la main
            ci-dessous, le devis l&apos;acceptera.
          </li>
        ) : null}
      </ul>

      {/* ───────────── Article hors catalogue ───────────── */}
      <div className="rounded-frame border border-mist/70 bg-frost-lifted p-5">
        {modeLibre ? (
          <FormulaireLibre
            onAnnuler={() => setModeLibre(false)}
            onValider={(designation, prix, quantite, detail, marque) => {
              ajouterLigne(
                ligneLibre(designation, prix, quantite, detail, marque),
              );
              setModeLibre(false);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setModeLibre(true)}
            className="flex w-full items-center gap-3 text-left"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-frost">
              <PackagePlus size={18} aria-hidden />
            </span>
            <span className="flex flex-col">
              <span className="text-[0.9375rem] font-medium text-ink">
                Article absent du catalogue
              </span>
              <span className="text-[0.8125rem] text-graphite">
                Saisissez la désignation et le prix vous-même.
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────── pièces ────────────────────────── */

function Puce({
  actif,
  onClick,
  children,
}: {
  readonly actif: boolean;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn(
        "shrink-0 rounded-pill px-3.5 py-1.5 text-[0.8125rem] whitespace-nowrap transition-colors",
        actif
          ? "bg-ink text-frost"
          : "bg-ghost text-graphite hover:bg-mist/60 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function Resultat({
  entree,
  onAjouter,
}: {
  readonly entree: EntreeCatalogue;
  readonly onAjouter: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onAjouter}
      className="group/res flex w-full items-center gap-3 rounded-action px-3 py-2.5 text-left transition-colors hover:bg-frost"
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[0.9375rem] font-medium text-ink">
          {entree.designation}
        </span>
        <span className="truncate text-[0.8125rem] text-slate">
          {entree.marque} · {entree.famille}
        </span>
      </span>

      <span className="shrink-0 text-[0.875rem] font-medium text-ink tabular-nums">
        {formatXAF(entree.prixXaf)}
      </span>

      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ghost text-ink transition-colors group-hover/res:bg-ink group-hover/res:text-frost">
        <Plus size={15} aria-hidden />
      </span>
    </button>
  );
}

function FormulaireLibre({
  onValider,
  onAnnuler,
}: {
  readonly onValider: (
    designation: string,
    prix: number,
    quantite: number,
    detail: string,
    marque: string,
  ) => void;
  readonly onAnnuler: () => void;
}) {
  const [designation, setDesignation] = useState("");
  const [marque, setMarque] = useState("");
  const [detail, setDetail] = useState("");
  const [prix, setPrix] = useState("");
  const [quantite, setQuantite] = useState("1");
  const [erreur, setErreur] = useState("");

  function valider() {
    if (designation.trim().length < 2) {
      setErreur("Indiquez la désignation de l'article.");
      return;
    }
    const montant = Number(prix.replace(/[^\d]/g, ""));
    if (!Number.isFinite(montant) || montant <= 0) {
      setErreur("Indiquez un prix unitaire en francs CFA.");
      return;
    }
    onValider(
      designation,
      montant,
      Math.max(1, Number(quantite) || 1),
      detail,
      marque,
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[0.9375rem] font-medium text-ink">
        Article hors catalogue
      </p>

      <ChampLibre
        label="Désignation"
        valeur={designation}
        onChange={(v) => {
          setDesignation(v);
          setErreur("");
        }}
        placeholder="Onduleur 1500 VA"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <ChampLibre
          label="Marque"
          valeur={marque}
          onChange={setMarque}
          placeholder="Facultatif"
        />
        <ChampLibre
          label="Quantité"
          valeur={quantite}
          onChange={setQuantite}
          inputMode="numeric"
        />
      </div>

      <ChampLibre
        label="Prix unitaire (FCFA)"
        valeur={prix}
        onChange={(v) => {
          setPrix(v);
          setErreur("");
        }}
        inputMode="numeric"
        placeholder="125000"
      />

      <ChampLibre
        label="Précision"
        valeur={detail}
        onChange={setDetail}
        placeholder="Facultatif, s'imprime sous la désignation"
      />

      {erreur ? (
        <p className="text-[0.8125rem] text-signal">{erreur}</p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={valider}
          className="min-h-11 flex-1 rounded-action bg-ink px-5 text-[0.9375rem] font-medium text-frost transition-colors hover:bg-charcoal"
        >
          Ajouter au devis
        </button>
        <button
          type="button"
          onClick={onAnnuler}
          className="min-h-11 rounded-action border-[1.5px] border-mist px-5 text-[0.9375rem] text-graphite transition-colors hover:border-ink hover:text-ink"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

function ChampLibre({
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
  readonly inputMode?: "numeric" | "text";
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
        className="min-h-11 rounded-action border-[1.5px] border-mist bg-white px-3.5 text-[0.9375rem] text-ink transition-colors outline-none placeholder:text-slate focus:border-ink"
      />
    </label>
  );
}
