-- =============================================================================
-- DEVIS ENREGISTRÉS
-- À exécuter dans Supabase → SQL Editor. Idempotent.
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'devis_statut') then
    create type public.devis_statut as enum (
      'brouillon',   -- en cours de rédaction, modifiable
      'emis',        -- transmis au client
      'accepte',     -- bon pour accord reçu
      'refuse',
      'expire'       -- date de validité dépassée
    );
  end if;
end $$;

create table if not exists public.devis (
  id          uuid primary key default gen_random_uuid(),
  reference   text unique not null,
  profile_id  uuid not null references auth.users(id) on delete cascade,

  statut      public.devis_statut not null default 'brouillon',

  -- Le CORPS du devis est stocké tel quel en JSON.
  --
  -- Choix délibéré. Un devis est un document FIGÉ : une fois émis, il doit
  -- rester lisible exactement tel qu'il a été envoyé, même si le catalogue,
  -- les prix ou les options changent ensuite. Le normaliser en tables le
  -- rendrait dépendant de données vivantes, et un devis de l'an dernier
  -- s'afficherait avec les prix d'aujourd'hui. C'est inacceptable sur un
  -- document contractuel.
  corps       jsonb not null,

  -- Champs extraits du corps, uniquement pour lister et chercher sans avoir à
  -- désérialiser le JSON. Ils ne font jamais autorité sur le contenu.
  client_nom  text not null default '',
  total_xaf   bigint not null default 0 check (total_xaf >= 0),
  emis_le     date,
  valable_jusquau date,

  -- Suite donnée par le client au moment de récupérer le document.
  rappel_souhaite boolean not null default false,
  envoi_email_demande boolean not null default false,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RATTRAPAGE D'UNE TABLE DÉJÀ EXISTANTE
--
-- `create table if not exists` ne fait rien si la table est là, même
-- incomplète. Un premier essai interrompu, ou une version antérieure du
-- schéma, laisse alors une table sans certaines colonnes, et la création des
-- index échoue sur « column does not exist ».
--
-- Ces ajouts sont sans effet sur une base saine et réparent le cas contraire.
alter table public.devis
  add column if not exists statut          public.devis_statut not null default 'brouillon',
  add column if not exists corps           jsonb not null default '{}'::jsonb,
  add column if not exists client_nom      text not null default '',
  add column if not exists total_xaf       bigint not null default 0,
  add column if not exists emis_le         date,
  add column if not exists valable_jusquau date,
  add column if not exists rappel_souhaite boolean not null default false,
  add column if not exists envoi_email_demande boolean not null default false,
  add column if not exists created_at      timestamptz not null default now(),
  add column if not exists updated_at      timestamptz not null default now();

create index if not exists devis_profile_idx on public.devis (profile_id, updated_at desc);
create index if not exists devis_statut_idx  on public.devis (statut, updated_at desc);

alter table public.devis enable row level security;

-- Chacun ne voit que ses devis. Le personnel autorisé voit tout : sans cela,
-- un conseiller ne pourrait pas rappeler un client qui l'a demandé.
drop policy if exists "mes devis" on public.devis;
create policy "mes devis"
  on public.devis for select
  using (
    profile_id = auth.uid()
    or public.current_role_is(array['admin','conseiller']::public.user_role[])
  );

drop policy if exists "creer mes devis" on public.devis;
create policy "creer mes devis"
  on public.devis for insert
  with check (profile_id = auth.uid());

-- La modification s'arrête à l'émission. Un devis transmis au client ne doit
-- plus bouger : c'est ce qui lui donne sa valeur d'engagement.
drop policy if exists "modifier mes brouillons" on public.devis;
create policy "modifier mes brouillons"
  on public.devis for update
  using (profile_id = auth.uid() and statut = 'brouillon')
  with check (profile_id = auth.uid());

drop policy if exists "supprimer mes brouillons" on public.devis;
create policy "supprimer mes brouillons"
  on public.devis for delete
  using (profile_id = auth.uid() and statut = 'brouillon');

create or replace function public.touch_devis()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists devis_touch on public.devis;
create trigger devis_touch
  before update on public.devis
  for each row execute function public.touch_devis();
