-- =============================================================================
-- TRANSFERTS D'ARGENT
-- À exécuter dans Supabase → SQL Editor. Idempotent.
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'transfert_statut') then
    create type public.transfert_statut as enum (
      'attente_paiement',  -- créé, le client n'a pas encore payé
      'paiement_recu',     -- paiement constaté par un agent
      'en_cours',          -- transmis à l'opérateur
      'recu',              -- le bénéficiaire a retiré
      'annule'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'mode_reception') then
    create type public.mode_reception as enum (
      'especes', 'compte_bancaire', 'mobile_money'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'mode_paiement_transfert') then
    create type public.mode_paiement_transfert as enum (
      'especes_agence', 'orange_money', 'carte_bancaire'
    );
  end if;
end $$;

create table if not exists public.transferts (
  id                  uuid primary key default gen_random_uuid(),
  reference           text unique not null,
  profile_id          uuid references public.profiles(id) on delete set null,
  statut              public.transfert_statut not null default 'attente_paiement',

  -- Corridor
  operateur           text not null,
  pays_depart         text not null,
  pays_arrivee        text not null,
  devise_depart       text not null,
  devise_arrivee      text not null,

  -- Montants. TOUS recalculés côté serveur, jamais reçus du client.
  -- Stockés en centimes pour éviter tout flottant sur de l'argent.
  montant_envoye_cts  bigint not null check (montant_envoye_cts > 0),
  frais_operateur_cts bigint not null check (frais_operateur_cts >= 0),
  frais_service_cts   bigint not null check (frais_service_cts >= 0),
  total_a_payer_cts   bigint not null check (total_a_payer_cts > 0),
  montant_recu_cts    bigint not null check (montant_recu_cts > 0),
  taux                numeric(18,8) not null check (taux > 0),

  -- Expéditeur
  expediteur_nom      text not null,
  expediteur_tel      text not null,

  -- Bénéficiaire
  benef_nom           text not null,
  benef_prenom        text not null,
  benef_tel           text not null,
  benef_mode          public.mode_reception not null,
  benef_details       text,          -- IBAN, numéro mobile money, etc.

  -- Paiement
  mode_paiement       public.mode_paiement_transfert not null,
  preuve_url          text,          -- capture du dépôt Orange Money

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists transferts_profile_idx on public.transferts(profile_id);
create index if not exists transferts_statut_idx on public.transferts(statut);

alter table public.transferts enable row level security;

-- Un client ne voit que ses propres transferts.
drop policy if exists "mes transferts" on public.transferts;
create policy "mes transferts"
  on public.transferts for select
  using (profile_id = auth.uid()
         or public.current_role_is(array['admin','conseiller']::public.user_role[]));

drop policy if exists "transferts administrables" on public.transferts;
create policy "transferts administrables"
  on public.transferts for all
  using (public.current_role_is(array['admin','conseiller']::public.user_role[]))
  with check (public.current_role_is(array['admin','conseiller']::public.user_role[]));

-- Horodatage
drop trigger if exists touch_transferts on public.transferts;
create trigger touch_transferts before update on public.transferts
  for each row execute function public.touch_updated_at();

-- =============================================================================
-- STOCKAGE DES PREUVES DE DÉPÔT
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('preuves-transfert', 'preuves-transfert', false)
on conflict (id) do nothing;

-- Le dépôt est ouvert : un expéditeur non connecté doit pouvoir joindre sa
-- capture. La LECTURE reste réservée à l'administration, car ces images
-- contiennent des données bancaires.
drop policy if exists "depot preuve" on storage.objects;
create policy "depot preuve"
  on storage.objects for insert
  with check (bucket_id = 'preuves-transfert');

drop policy if exists "lecture preuve admin" on storage.objects;
create policy "lecture preuve admin"
  on storage.objects for select
  using (
    bucket_id = 'preuves-transfert'
    and public.current_role_is(array['admin','conseiller']::public.user_role[])
  );
