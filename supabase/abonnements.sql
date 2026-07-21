-- =============================================================================
-- SOUSCRIPTIONS D'ABONNEMENT
-- À exécuter dans Supabase → SQL Editor. Idempotent.
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'souscription_statut') then
    create type public.souscription_statut as enum (
      'attente_paiement',  -- créée, le client n'a pas encore réglé
      'paiement_recu',     -- paiement constaté par un agent
      'activee',           -- le compte est ouvert ou rechargé
      'annulee'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'mode_paiement_abonnement') then
    create type public.mode_paiement_abonnement as enum (
      'orange_money', 'especes_boutique'
    );
  end if;
end $$;

create table if not exists public.souscriptions (
  id            uuid primary key default gen_random_uuid(),
  reference     text unique not null,

  -- Ce qui est acheté. Le libellé de la formule est FIGÉ à la commande :
  -- si le tarif change demain, la souscription doit garder le prix consenti.
  abonnement_slug text not null,
  abonnement_nom  text not null,
  formule_nom     text not null,
  formule_duree   text not null,

  -- Argent en CENTIMES, entier. Aucun flottant ne représente de l'argent :
  -- les arrondis binaires sur des sommes produisent des litiges.
  prix_cts      bigint not null check (prix_cts >= 0),

  -- Le compte à activer. C'est l'information critique de la commande :
  -- sans elle, l'agent ne sait pas quel compte ouvrir ou recharger.
  compte_identifiant text not null,

  client_nom    text not null,
  client_tel    text not null,

  mode_paiement public.mode_paiement_abonnement not null,
  preuve_url    text,

  statut        public.souscription_statut not null default 'attente_paiement',
  note_interne  text,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists souscriptions_reference_idx on public.souscriptions (reference);
create index if not exists souscriptions_statut_idx    on public.souscriptions (statut, created_at desc);

alter table public.souscriptions enable row level security;

-- Aucune politique de lecture publique : une souscription porte le numéro de
-- téléphone et l'identifiant de compte du client. Seul le service (clé secrète)
-- y accède. La page de confirmation passe par le client d'administration et
-- n'expose que le strict nécessaire.
drop policy if exists "souscriptions lecture service" on public.souscriptions;

create or replace function public.touch_souscription()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists souscriptions_touch on public.souscriptions;
create trigger souscriptions_touch
  before update on public.souscriptions
  for each row execute function public.touch_souscription();
