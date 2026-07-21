"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, Rows3 } from "lucide-react";
import { useMonte } from "@/features/panier/store";
import { useDevis, genererReference } from "@/features/devis/store";
import { dateDuJour, type Devis } from "@/features/devis/types";
import { DocumentDevis } from "@/features/devis/DocumentDevis";
import { PanneauDevis } from "@/features/devis/PanneauDevis";
import { cn } from "@/lib/utils/cn";

/**
 * L'ATELIER
 *
 * Document à gauche, saisie à droite. Le document n'est pas une prévisualisation
 * approximative : c'est le fichier final, affiché tel qu'il sortira.
 *
 * LE MONTAGE EST DIFFÉRÉ
 *
 * La référence et la date d'émission dépendent de l'heure courante, qui n'est
 * pas la même sur le serveur et dans le navigateur. Les calculer au rendu
 * serveur produirait une erreur d'hydratation à chaque chargement. On attend
 * donc le montage client, puis on les fixe une seule fois.
 */
export function AtelierDevis({
  connecte,
  repris,
}: {
  readonly connecte: boolean;
  /** Devis rechargé depuis le compte, via `?reprendre=`. */
  readonly repris?: Devis | null;
}) {
  const devis = useDevis((s) => s.devis);
  const definirReference = useDevis((s) => s.definirReference);
  const remplacer = useDevis((s) => s.remplacer);

  const monte = useMonte();
  const [zoom, setZoom] = useState(0.9);
  const [compact, setCompact] = useState(false);

  // Reprise d'un devis enregistré : il écrase le brouillon local. On ne
  // fusionne pas les deux, ce qui produirait un document hybride que personne
  // n'a voulu. La condition sur la référence évite d'écraser en boucle si
  // l'utilisateur modifie ensuite le devis repris.
  useEffect(() => {
    if (!monte || !repris) return;
    if (devis.reference === repris.reference) return;
    remplacer(repris);
  }, [monte, repris, devis.reference, remplacer]);

  // Un brouillon repris garde sa référence et sa date : les régénérer
  // renuméroterait un devis déjà transmis au client.
  useEffect(() => {
    if (!monte || devis.reference) return;
    const maintenant = new Date();
    definirReference(genererReference(maintenant), dateDuJour(maintenant));
  }, [monte, devis.reference, definirReference]);

  // On attend AUSSI la référence, posée juste après le montage. Sans cette
  // condition, le document s'affiche une fraction de seconde avec un numéro
  // vide et des dates absentes, ce qui donne l'impression d'un document cassé
  // au moment précis où l'utilisateur le découvre.
  if (!monte || !devis.reference) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_26rem]">
        <div className="skeleton h-[70vh] rounded-frame" />
        <div className="skeleton h-[70vh] rounded-frame" />
      </div>
    );
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_26rem] lg:gap-12">
      {/* ───────────── Le document ───────────── */}
      <div className="flex flex-col gap-4">
        {/* Barre d'outils : jamais imprimée. */}
        <div className="impression-cache flex flex-wrap items-center gap-2 rounded-pill border border-mist/70 bg-white px-3 py-2">
          <span className="px-2 text-[0.8125rem] text-slate">Affichage</span>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.08).toFixed(2)))}
            aria-label="Réduire l'aperçu"
            className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ghost"
          >
            <Minus size={15} />
          </button>
          <span className="min-w-12 text-center text-[0.875rem] font-medium text-ink tabular-nums">
            {Math.round(zoom * 100)} %
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.08).toFixed(2)))}
            aria-label="Agrandir l'aperçu"
            className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ghost"
          >
            <Plus size={15} />
          </button>

          <span aria-hidden className="mx-1 h-6 w-px bg-mist" />

          {/* Densité, et non taille de police : le client ne peut pas déformer
              la typographie du document, il peut seulement condenser un devis
              long pour gagner des pages. */}
          <button
            type="button"
            onClick={() => setCompact((c) => !c)}
            aria-pressed={compact}
            className={cn(
              "inline-flex min-h-9 items-center gap-2 rounded-pill px-3.5 text-[0.875rem] transition-colors",
              compact
                ? "bg-ink text-frost"
                : "text-graphite hover:bg-ghost hover:text-ink",
            )}
          >
            <Rows3 size={15} aria-hidden />
            Condensé
          </button>
        </div>

        <div className="impression-racine overflow-x-auto scroll-discret">
          <DocumentDevis devis={devis} zoom={zoom} compact={compact} />
        </div>
      </div>

      {/* ───────────── La saisie ───────────── */}
      <div className="impression-cache lg:sticky lg:top-28">
        <PanneauDevis connecte={connecte} />
      </div>
    </div>
  );
}
