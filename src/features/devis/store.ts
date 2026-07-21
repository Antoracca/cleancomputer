"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  clientVide,
  type ClientDevis,
  type Devis,
  type LigneDevis,
  type OptionRetenue,
} from "@/features/devis/types";

/**
 * BROUILLON DE DEVIS
 *
 * Persisté dans le navigateur. Un devis se remplit en plusieurs fois : on
 * cherche un prix, on appelle un fournisseur, on revient. Perdre la saisie
 * parce qu'un onglet s'est fermé rendrait l'outil inutilisable en conditions
 * réelles.
 *
 * Ce brouillon local ne remplace pas l'enregistrement en compte, prévu à la
 * tranche suivante : il ne suit pas l'utilisateur d'un appareil à l'autre et
 * disparaît si le navigateur est nettoyé. Il couvre l'accident, pas l'archive.
 *
 * ⚠️ Les prix stockés ici ne sont qu'un AFFICHAGE, comme pour le panier. Le
 * jour où le devis sera envoyé depuis le serveur, celui-ci relira la grille
 * tarifaire lui-même.
 */

type DevisState = {
  devis: Devis;
  /** Vrai dès qu'une saisie a eu lieu, pour ne pas proposer de reprendre un
   *  brouillon vide. */
  touche: boolean;

  definirClient: (champ: keyof ClientDevis, valeur: string) => void;
  ajouterLigne: (ligne: LigneDevis) => void;
  retirerLigne: (id: string) => void;
  changerQuantite: (id: string, quantite: number) => void;
  changerRemiseLigne: (id: string, pct: number) => void;
  changerPrix: (id: string, prixXaf: number) => void;
  changerOptions: (id: string, options: OptionRetenue[]) => void;
  monterLigne: (id: string) => void;
  descendreLigne: (id: string) => void;
  definirReglage: <C extends "remiseGlobalePct" | "acomptePct" | "valableJours">(
    champ: C,
    valeur: number,
  ) => void;
  definirNotes: (notes: string) => void;
  definirReference: (reference: string, emisLe: string) => void;
  /** Écrase le brouillon courant par un devis rechargé depuis le compte. */
  remplacer: (devis: Devis) => void;
  reinitialiser: () => void;
};

function devisVide(): Devis {
  return {
    // Remplis au montage côté client : `Date.now` au moment de la création du
    // module donnerait une valeur différente au serveur et au navigateur, donc
    // une erreur d'hydratation.
    reference: "",
    emisLe: "",
    valableJours: 30,
    client: clientVide(),
    lignes: [],
    remiseGlobalePct: 0,
    acomptePct: 0,
    notes: "",
  };
}

/**
 * Deux lignes ne fusionnent que si elles portent EXACTEMENT la même
 * configuration. Un portable en 16 Go et le même en 32 Go sont deux articles
 * distincts, à deux prix différents : les additionner masquerait la différence
 * et fausserait le total.
 */
function memesOptions(
  a: readonly OptionRetenue[],
  b: readonly OptionRetenue[],
): boolean {
  if (a.length !== b.length) return false;
  const idsA = new Set(a.map((o) => o.id));
  return b.every((o) => idsA.has(o.id));
}

/** Borne un pourcentage entier entre 0 et 100. */
function pct(valeur: number): number {
  if (!Number.isFinite(valeur)) return 0;
  return Math.min(100, Math.max(0, Math.round(valeur)));
}

function deplacer(lignes: LigneDevis[], id: string, delta: number): LigneDevis[] {
  const i = lignes.findIndex((l) => l.id === id);
  const cible = i + delta;
  if (i === -1 || cible < 0 || cible >= lignes.length) return lignes;
  const copie = [...lignes];
  const [ligne] = copie.splice(i, 1);
  if (!ligne) return lignes;
  copie.splice(cible, 0, ligne);
  return copie;
}

export const useDevis = create<DevisState>()(
  persist(
    (set) => ({
      devis: devisVide(),
      touche: false,

      definirClient: (champ, valeur) =>
        set((s) => ({
          touche: true,
          devis: {
            ...s.devis,
            client: { ...s.devis.client, [champ]: valeur },
          },
        })),

      ajouterLigne: (ligne) =>
        set((s) => {
          // Le même article ajouté deux fois incrémente la quantité au lieu de
          // créer une ligne. Répéter « Samsung Galaxy S25 Ultra » huit fois de
          // suite rendait le devis illisible et faux à la relecture : personne
          // ne compte huit lignes identiques pour savoir qu'il y en a huit.
          //
          // Un article libre échappe à la règle : deux saisies manuelles du
          // même nom peuvent désigner deux choses différentes, on ne présume
          // pas qu'elles se confondent.
          const jumelle =
            ligne.source === "libre"
              ? undefined
              : s.devis.lignes.find(
                  (l) =>
                    l.source === ligne.source &&
                    l.reference === ligne.reference &&
                    memesOptions(l.options, ligne.options),
                );

          if (jumelle) {
            return {
              touche: true,
              devis: {
                ...s.devis,
                lignes: s.devis.lignes.map((l) =>
                  l.id === jumelle.id
                    ? { ...l, quantite: Math.min(l.quantite + ligne.quantite, 9999) }
                    : l,
                ),
              },
            };
          }

          return {
            touche: true,
            devis: { ...s.devis, lignes: [...s.devis.lignes, ligne] },
          };
        }),

      retirerLigne: (id) =>
        set((s) => ({
          touche: true,
          devis: {
            ...s.devis,
            lignes: s.devis.lignes.filter((l) => l.id !== id),
          },
        })),

      changerQuantite: (id, quantite) =>
        set((s) => ({
          touche: true,
          devis: {
            ...s.devis,
            lignes:
              quantite <= 0
                ? s.devis.lignes.filter((l) => l.id !== id)
                : s.devis.lignes.map((l) =>
                    l.id === id
                      ? { ...l, quantite: Math.min(Math.round(quantite), 9999) }
                      : l,
                  ),
          },
        })),

      changerRemiseLigne: (id, valeur) =>
        set((s) => ({
          touche: true,
          devis: {
            ...s.devis,
            lignes: s.devis.lignes.map((l) =>
              l.id === id ? { ...l, remisePct: pct(valeur) } : l,
            ),
          },
        })),

      changerPrix: (id, prixXaf) =>
        set((s) => ({
          touche: true,
          devis: {
            ...s.devis,
            lignes: s.devis.lignes.map((l) =>
              l.id === id
                ? {
                    ...l,
                    prixUnitaireXaf: Math.max(0, Math.round(prixXaf) || 0),
                  }
                : l,
            ),
          },
        })),

      changerOptions: (id, options) =>
        set((s) => ({
          touche: true,
          devis: {
            ...s.devis,
            lignes: s.devis.lignes.map((l) =>
              l.id === id ? { ...l, options } : l,
            ),
          },
        })),

      monterLigne: (id) =>
        set((s) => ({
          touche: true,
          devis: { ...s.devis, lignes: deplacer(s.devis.lignes, id, -1) },
        })),

      descendreLigne: (id) =>
        set((s) => ({
          touche: true,
          devis: { ...s.devis, lignes: deplacer(s.devis.lignes, id, 1) },
        })),

      definirReglage: (champ, valeur) =>
        set((s) => ({
          touche: true,
          devis: {
            ...s.devis,
            [champ]:
              champ === "valableJours"
                ? Math.min(365, Math.max(1, Math.round(valeur) || 30))
                : pct(valeur),
          },
        })),

      definirNotes: (notes) =>
        set((s) => ({ touche: true, devis: { ...s.devis, notes } })),

      definirReference: (reference, emisLe) =>
        set((s) => ({ devis: { ...s.devis, reference, emisLe } })),

      remplacer: (devis) => set({ devis, touche: true }),

      reinitialiser: () => set({ devis: devisVide(), touche: false }),
    }),
    { name: "cc-devis-brouillon", version: 1 },
  ),
);

/**
 * Référence lisible et triable : DV-AAMM-XXXX.
 *
 * Le préfixe année-mois rend les devis classables à l'œil dans un dossier, ce
 * qu'un identifiant purement aléatoire ne permet pas. Le suffixe évite les
 * collisions entre deux devis émis la même minute.
 */
export function genererReference(maintenant: Date): string {
  const aa = String(maintenant.getFullYear()).slice(2);
  const mm = String(maintenant.getMonth() + 1).padStart(2, "0");
  const alea = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DV-${aa}${mm}-${alea}`;
}
