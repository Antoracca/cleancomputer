"use client";

import { useSyncExternalStore } from "react";
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
 * partir de la base et du catalogue au moment de commander : un client qui
 * modifierait son localStorage ne modifierait que ce qu'il voit, pas ce qu'il
 * paie.
 *
 * DEUX NATURES DE LIGNE
 *
 * Le panier mêle des produits physiques et des abonnements. Ils ne se
 * comportent pas pareil :
 *
 *   - un produit se compte (2 câbles), il a un stock ;
 *   - un abonnement ne se compte pas. Deux fois « Netflix Standard » sur le
 *     même compte n'a aucun sens ; deux comptes différents, ce sont deux
 *     lignes distinctes. La quantité y est donc figée à 1.
 *
 * L'IDENTITÉ N'EST PLUS LE SLUG
 *
 * Un même abonnement existe en plusieurs formules : « netflix » Standard et
 * « netflix » Premium sont deux lignes séparées. La clé d'unicité est donc
 * `id`, composite pour les abonnements. Garder le slug seul aurait fusionné
 * deux formules différentes en une seule ligne.
 */

export type LignePanier = {
  /** Clé d'unicité. Produit : le slug. Abonnement : `slug::formule::compte`. */
  id: string;
  type: "produit" | "abonnement";
  slug: string;
  nom: string;
  prixXaf: number;
  image: string;
  quantite: number;
  /** Abonnements seulement. */
  formuleNom?: string;
  duree?: string;
  /**
   * Compte à activer. Reste dans le navigateur de la personne jusqu'à la
   * commande, au même titre qu'un champ de formulaire pré-rempli. Il est
   * indispensable par ligne : quelqu'un peut commander Netflix sur une adresse
   * et Spotify sur une autre.
   */
  compteIdentifiant?: string;
};

/** Construit la clé d'unicité d'une ligne d'abonnement. */
export function idAbonnement(
  slug: string,
  formuleNom: string,
  compteIdentifiant: string,
): string {
  return `${slug}::${formuleNom}::${compteIdentifiant.trim().toLowerCase()}`;
}

type PanierState = {
  lignes: LignePanier[];
  ajouter: (ligne: Omit<LignePanier, "quantite">, quantite?: number) => void;
  retirer: (id: string) => void;
  changerQuantite: (id: string, quantite: number) => void;
  vider: () => void;
};

export const usePanier = create<PanierState>()(
  persist(
    (set) => ({
      lignes: [],

      ajouter: (ligne, quantite = 1) =>
        set((state) => {
          // Un abonnement ne s'additionne jamais. Ré-ajouter la même formule
          // sur le même compte remplace la ligne au lieu de la doubler.
          if (ligne.type === "abonnement") {
            const dejaLa = state.lignes.some((l) => l.id === ligne.id);
            if (dejaLa) {
              return {
                lignes: state.lignes.map((l) =>
                  l.id === ligne.id ? { ...ligne, quantite: 1 } : l,
                ),
              };
            }
            return { lignes: [...state.lignes, { ...ligne, quantite: 1 }] };
          }

          const existante = state.lignes.find((l) => l.id === ligne.id);
          if (existante) {
            return {
              lignes: state.lignes.map((l) =>
                l.id === ligne.id
                  ? { ...l, quantite: Math.min(l.quantite + quantite, 99) }
                  : l,
              ),
            };
          }
          return { lignes: [...state.lignes, { ...ligne, quantite }] };
        }),

      retirer: (id) =>
        set((state) => ({
          lignes: state.lignes.filter((l) => l.id !== id),
        })),

      changerQuantite: (id, quantite) =>
        set((state) => ({
          lignes:
            quantite <= 0
              ? state.lignes.filter((l) => l.id !== id)
              : state.lignes.map((l) =>
                  l.id === id
                    ? {
                        ...l,
                        // La quantité d'un abonnement ne bouge pas, quoi qu'on
                        // lui envoie.
                        quantite:
                          l.type === "abonnement"
                            ? 1
                            : Math.min(quantite, 99),
                      }
                    : l,
                ),
        })),

      vider: () => set({ lignes: [] }),
    }),
    {
      name: "cc-panier",
      version: 2,
      /**
       * Les paniers enregistrés avant l'arrivée des abonnements n'ont ni `id`
       * ni `type`. Sans cette migration, `l.id` vaudrait `undefined` sur ces
       * lignes : toutes se confondraient en une seule et le panier deviendrait
       * inutilisable pour qui revient sur le site.
       */
      migrate: (etatPersiste, versionPrecedente) => {
        const etat = etatPersiste as { lignes?: unknown[] } | undefined;
        if (!etat?.lignes || versionPrecedente >= 2) {
          return etatPersiste as PanierState;
        }
        return {
          ...etat,
          lignes: etat.lignes.map((brute) => {
            const l = brute as Partial<LignePanier> & { slug: string };
            return { ...l, id: l.id ?? l.slug, type: l.type ?? "produit" };
          }),
        } as PanierState;
      },
    },
  ),
);

/**
 * Vrai une fois le composant monté côté client, faux au rendu serveur.
 *
 * Le panier vient du localStorage, que le serveur ne connaît pas. Afficher
 * directement son contenu produirait une différence entre le HTML rendu au
 * serveur et le premier rendu client, donc une erreur d'hydratation.
 *
 * `useSyncExternalStore` exprime exactement ça : une valeur serveur et une
 * valeur client, sans effet qui appelle setState et déclenche un rendu en
 * cascade. L'abonnement ne notifie jamais, la valeur ne change plus après le
 * montage.
 */
export function useMonte(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function totalPanier(lignes: readonly LignePanier[]): number {
  return lignes.reduce((somme, l) => somme + l.prixXaf * l.quantite, 0);
}

export function nombreArticles(lignes: readonly LignePanier[]): number {
  return lignes.reduce((somme, l) => somme + l.quantite, 0);
}

/** Les abonnements exigent un compte à activer ; les produits, une adresse. */
export function contientAbonnement(lignes: readonly LignePanier[]): boolean {
  return lignes.some((l) => l.type === "abonnement");
}

export function contientProduit(lignes: readonly LignePanier[]): boolean {
  return lignes.some((l) => l.type === "produit");
}
