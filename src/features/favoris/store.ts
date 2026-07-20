"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * FAVORIS
 *
 * Liste de souhaits locale, persistée dans le navigateur. Aucun compte n'est
 * exigé pour mettre un produit de côté : demander une inscription avant même
 * un geste aussi anodin fait perdre la moitié des visiteurs.
 *
 * À la connexion, cette liste pourra être fusionnée avec celle du compte.
 * On ne stocke que le `slug` : le nom, le prix et l'image sont relus depuis le
 * catalogue, donc un prix qui change se répercute partout au lieu de rester
 * figé dans le stockage local.
 */

type FavorisState = {
  slugs: string[];
  basculer: (slug: string) => void;
  retirer: (slug: string) => void;
  vider: () => void;
};

export const useFavoris = create<FavorisState>()(
  persist(
    (set) => ({
      slugs: [],

      basculer: (slug) =>
        set((state) => ({
          slugs: state.slugs.includes(slug)
            ? state.slugs.filter((s) => s !== slug)
            : [...state.slugs, slug],
        })),

      retirer: (slug) =>
        set((state) => ({ slugs: state.slugs.filter((s) => s !== slug) })),

      vider: () => set({ slugs: [] }),
    }),
    { name: "cc-favoris" },
  ),
);
