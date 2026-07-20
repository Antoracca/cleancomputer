"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * PANIER — état client persistant
 *
 * Zustand + localStorage : le panier survit au rechargement et à la fermeture
 * du navigateur. Aucune requête réseau à l'ajout — l'interface réagit
 * instantanément (optimistic UI), la validation des prix se fait CÔTÉ SERVEUR
 * au moment de la commande.
 *
 * ⚠️ Le prix stocké ici n'est qu'un AFFICHAGE. Le serveur recalcule tout à
 * partir de la base au moment de commander : un client qui modifierait son
 * localStorage ne modifierait que ce qu'il voit, pas ce qu'il paie.
 */

export type LignePanier = {
  slug: string;
  nom: string;
  prixXaf: number;
  image: string;
  quantite: number;
};

type PanierState = {
  lignes: LignePanier[];
  ajouter: (ligne: Omit<LignePanier, "quantite">, quantite?: number) => void;
  retirer: (slug: string) => void;
  changerQuantite: (slug: string, quantite: number) => void;
  vider: () => void;
};

export const usePanier = create<PanierState>()(
  persist(
    (set) => ({
      lignes: [],

      ajouter: (ligne, quantite = 1) =>
        set((state) => {
          const existante = state.lignes.find((l) => l.slug === ligne.slug);
          if (existante) {
            return {
              lignes: state.lignes.map((l) =>
                l.slug === ligne.slug
                  ? { ...l, quantite: Math.min(l.quantite + quantite, 99) }
                  : l,
              ),
            };
          }
          return { lignes: [...state.lignes, { ...ligne, quantite }] };
        }),

      retirer: (slug) =>
        set((state) => ({
          lignes: state.lignes.filter((l) => l.slug !== slug),
        })),

      changerQuantite: (slug, quantite) =>
        set((state) => ({
          lignes:
            quantite <= 0
              ? state.lignes.filter((l) => l.slug !== slug)
              : state.lignes.map((l) =>
                  l.slug === slug ? { ...l, quantite: Math.min(quantite, 99) } : l,
                ),
        })),

      vider: () => set({ lignes: [] }),
    }),
    { name: "cc-panier" },
  ),
);

export function totalPanier(lignes: readonly LignePanier[]): number {
  return lignes.reduce((somme, l) => somme + l.prixXaf * l.quantite, 0);
}

export function nombreArticles(lignes: readonly LignePanier[]): number {
  return lignes.reduce((somme, l) => somme + l.quantite, 0);
}
