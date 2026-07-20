"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { formatXAFCompact } from "@/lib/format/currency";
import { CATEGORIES } from "@/types/catalogue";
import { cn } from "@/lib/utils/cn";
import type { Produit } from "@/types/catalogue";

/**
 * CATALOGUE FILTRÉ
 *
 * Le filtrage est ENTIÈREMENT LOCAL. Les produits arrivent déjà rendus par le
 * serveur ; ce composant ne fait que les trier et les masquer. Aucun clic ne
 * déclenche de requête, donc aucun temps d'attente, ce qui compte sur une
 * connexion instable.
 *
 * Ce choix tient tant que le catalogue reste de cet ordre de grandeur. Au delà
 * de quelques centaines de références, il faudra basculer le filtrage côté
 * Postgres et paginer.
 *
 * Le panneau est collant sur grand écran et devient un tiroir sur mobile :
 * occuper la moitié d'un écran de téléphone avec des filtres avant même de
 * voir un produit ferait fuir.
 */

type Tri = "pertinence" | "prix-croissant" | "prix-decroissant" | "nom";

const TRIS: { valeur: Tri; label: string }[] = [
  { valeur: "pertinence", label: "Mis en avant" },
  { valeur: "prix-croissant", label: "Prix croissant" },
  { valeur: "prix-decroissant", label: "Prix décroissant" },
  { valeur: "nom", label: "Nom A → Z" },
];

export function CatalogueFiltre({
  produits,
  categorieActive,
}: {
  produits: readonly Produit[];
  categorieActive?: string;
}) {
  const [marques, setMarques] = useState<string[]>([]);
  const [enStock, setEnStock] = useState(false);
  const [plafond, setPlafond] = useState<number | null>(null);
  const [tri, setTri] = useState<Tri>("pertinence");
  const [tiroirOuvert, setTiroirOuvert] = useState(false);

  const toutesMarques = useMemo(
    () => [...new Set(produits.map((p) => p.marque))].sort(),
    [produits],
  );

  const prixMax = useMemo(
    () => Math.max(...produits.map((p) => p.prixXaf), 0),
    [produits],
  );

  const paliers = useMemo(() => {
    const bornes = [50_000, 200_000, 500_000, 1_000_000];
    return bornes.filter((b) => b < prixMax);
  }, [prixMax]);

  const resultats = useMemo(() => {
    const filtres = produits.filter((p) => {
      if (marques.length > 0 && !marques.includes(p.marque)) return false;
      if (enStock && p.stock === 0) return false;
      if (plafond !== null && p.prixXaf > plafond) return false;
      return true;
    });

    const trie = [...filtres];
    if (tri === "prix-croissant") trie.sort((a, b) => a.prixXaf - b.prixXaf);
    if (tri === "prix-decroissant") trie.sort((a, b) => b.prixXaf - a.prixXaf);
    if (tri === "nom") trie.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
    if (tri === "pertinence") {
      trie.sort((a, b) => Number(b.misEnAvant) - Number(a.misEnAvant));
    }
    return trie;
  }, [produits, marques, enStock, plafond, tri]);

  const filtresActifs =
    marques.length + (enStock ? 1 : 0) + (plafond !== null ? 1 : 0);

  function basculerMarque(marque: string) {
    setMarques((prev) =>
      prev.includes(marque)
        ? prev.filter((m) => m !== marque)
        : [...prev, marque],
    );
  }

  function reinitialiser() {
    setMarques([]);
    setEnStock(false);
    setPlafond(null);
  }

  const panneau = (
    <div className="flex flex-col gap-8">
      {/* Catégories : ce sont de vraies URL, donc indexables et partageables */}
      <FiltreGroupe titre="Catégories">
        <ul className="flex flex-col">
          <li>
            <LienCategorie href="/electronique" actif={!categorieActive}>
              Tout le catalogue
            </LienCategorie>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <LienCategorie
                href={`/electronique/${c.slug}`}
                actif={categorieActive === c.slug}
              >
                {c.nom}
              </LienCategorie>
            </li>
          ))}
        </ul>
      </FiltreGroupe>

      {toutesMarques.length > 1 ? (
        <FiltreGroupe titre="Marque">
          <div className="flex flex-wrap gap-2">
            {toutesMarques.map((marque) => (
              <button
                key={marque}
                type="button"
                onClick={() => basculerMarque(marque)}
                aria-pressed={marques.includes(marque)}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-pill border px-3.5 text-[0.8125rem] transition-colors",
                  marques.includes(marque)
                    ? "border-ink bg-ink text-frost"
                    : "border-mist bg-white text-graphite hover:border-ink hover:text-ink",
                )}
              >
                {marque}
              </button>
            ))}
          </div>
        </FiltreGroupe>
      ) : null}

      {paliers.length > 0 ? (
        <FiltreGroupe titre="Budget">
          <div className="flex flex-wrap gap-2">
            {paliers.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlafond(plafond === p ? null : p)}
                aria-pressed={plafond === p}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-pill border px-3.5 text-[0.8125rem] tabular-nums transition-colors",
                  plafond === p
                    ? "border-ink bg-ink text-frost"
                    : "border-mist bg-white text-graphite hover:border-ink hover:text-ink",
                )}
              >
                sous {formatXAFCompact(p)}
              </button>
            ))}
          </div>
        </FiltreGroupe>
      ) : null}

      <FiltreGroupe titre="Disponibilité">
        <label className="flex cursor-pointer items-center gap-3 text-[0.9375rem] text-graphite">
          <span
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-pill transition-colors",
              enStock ? "bg-ink" : "bg-mist",
            )}
          >
            <input
              type="checkbox"
              checked={enStock}
              onChange={(e) => setEnStock(e.target.checked)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "absolute top-1 size-4 rounded-full bg-white transition-transform duration-200 ease-out-soft",
                enStock ? "translate-x-6" : "translate-x-1",
              )}
            />
          </span>
          En stock uniquement
        </label>
      </FiltreGroupe>

      {filtresActifs > 0 ? (
        <button
          type="button"
          onClick={reinitialiser}
          className="inline-flex min-h-11 w-fit items-center gap-2 text-[0.875rem] font-medium text-brand transition-colors hover:text-brand-deep"
        >
          <X size={15} aria-hidden />
          Effacer les filtres ({filtresActifs})
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-14">
      {/* Panneau latéral, collant sur grand écran */}
      <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        {panneau}
      </aside>

      <div className="flex flex-col gap-6">
        {/* Barre : nombre de résultats, tri, ouverture du tiroir mobile */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mist/70 pb-4">
          <p className="text-[0.9375rem] text-graphite tabular-nums">
            {resultats.length} produit{resultats.length > 1 ? "s" : ""}
            {filtresActifs > 0 ? ` sur ${produits.length}` : ""}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTiroirOuvert(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-mist bg-white px-4 text-[0.875rem] font-medium text-ink lg:hidden"
            >
              <SlidersHorizontal size={15} aria-hidden />
              Filtrer
              {filtresActifs > 0 ? ` (${filtresActifs})` : ""}
            </button>

            <label className="flex items-center gap-2 text-[0.875rem] text-slate">
              <span className="hidden sm:inline">Trier par</span>
              <select
                value={tri}
                onChange={(e) => setTri(e.target.value as Tri)}
                aria-label="Trier les produits"
                className="min-h-11 rounded-pill border border-mist bg-white px-4 text-[0.875rem] text-ink"
              >
                {TRIS.map((t) => (
                  <option key={t.valeur} value={t.valeur}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {resultats.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-3">
            {resultats.map((produit) => (
              <li key={produit.slug}>
                <ProductCard produit={produit} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-frame border border-mist/60 bg-white px-8 py-16 text-center">
            <p className="text-title text-ink">Aucun produit ne correspond.</p>
            <p className="mx-auto mt-3 max-w-md text-body text-graphite">
              Élargissez le budget ou retirez une marque. Vous pouvez aussi nous
              dire ce que vous cherchez, le stock change chaque semaine.
            </p>
            <div className="mt-6">
              <Button type="button" onClick={reinitialiser}>
                Effacer les filtres
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Tiroir mobile */}
      {tiroirOuvert ? (
        <div className="fixed inset-0 z-100 lg:hidden">
          <button
            type="button"
            aria-label="Fermer les filtres"
            onClick={() => setTiroirOuvert(false)}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-frame bg-frost p-6 pb-10">
            <div className="mb-6 flex items-center justify-between">
              <EyebrowLabel rule={false}>Filtrer</EyebrowLabel>
              <button
                type="button"
                onClick={() => setTiroirOuvert(false)}
                aria-label="Fermer"
                className="grid size-11 place-items-center rounded-full text-ink hover:bg-ghost"
              >
                <X size={20} />
              </button>
            </div>
            {panneau}
            <div className="mt-8">
              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={() => setTiroirOuvert(false)}
              >
                Voir les {resultats.length} produits
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FiltreGroupe({
  titre,
  children,
}: {
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-eyebrow text-slate uppercase">{titre}</h2>
      {children}
    </div>
  );
}

function LienCategorie({
  href,
  actif,
  children,
}: {
  href: string;
  actif: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-current={actif ? "page" : undefined}
      className={cn(
        "flex min-h-10 items-center border-l-2 pl-4 text-[0.9375rem] transition-colors",
        actif
          ? "border-brand font-medium text-ink"
          : "border-transparent text-graphite hover:border-mist hover:text-ink",
      )}
    >
      {children}
    </a>
  );
}
