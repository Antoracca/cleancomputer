-- =============================================================================
-- ABONNEMENTS DANS LE PANIER
-- À exécuter dans Supabase → SQL Editor. Idempotent, sans perte de données.
--
-- Une ligne de commande pouvait seulement désigner un produit. Elle peut
-- désormais désigner un abonnement, qui n'est pas en base : sa source de
-- vérité est le catalogue statique. On fige donc le slug, la formule et le
-- compte à activer directement sur la ligne.
-- =============================================================================

alter table public.commande_lignes
  add column if not exists abonnement_slug    text,
  add column if not exists formule_nom        text,
  -- Le compte à activer est l'information critique : sans elle, l'agent ne
  -- sait pas quel compte ouvrir ou recharger.
  add column if not exists compte_identifiant text;

-- Contrainte volontairement limitée à la complétude des lignes d'abonnement.
--
-- On ne peut PAS exiger « produit_slug ou abonnement_slug, exactement l'un des
-- deux » : `produit_slug` porte `on delete set null`, donc supprimer un
-- produit du catalogue laisse des lignes historiques sans slug. Une contrainte
-- stricte échouerait à l'installation sur ces lignes, et referait échouer
-- chaque suppression de produit ensuite. Le libellé figé reste de toute façon
-- lisible sur ces lignes.
--
-- Ce qui est réellement dangereux, c'est un abonnement sans formule ni compte :
-- l'agent ne saurait ni quoi activer ni où. C'est cela qu'on interdit.
alter table public.commande_lignes
  drop constraint if exists commande_lignes_nature;

alter table public.commande_lignes
  add constraint commande_lignes_abonnement_complet check (
    abonnement_slug is null
    or (formule_nom is not null and compte_identifiant is not null)
  );

create index if not exists lignes_abonnement_idx
  on public.commande_lignes (abonnement_slug)
  where abonnement_slug is not null;
