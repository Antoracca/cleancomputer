-- =============================================================================
-- CLEAN COMPUTER — SCHÉMA INITIAL
-- Projet Supabase : hpudlzkkdfbspepofkma
-- =============================================================================
-- À exécuter dans : Supabase → SQL Editor → New query → Run
--
-- Le script est IDEMPOTENT : le relancer ne casse rien.
--
-- Principe de sécurité : la règle d'accès vit dans la BASE (RLS), pas dans le
-- code applicatif. Un appel API oublié côté serveur ne peut donc pas exposer
-- les données d'un autre client.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. RÔLES
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('client', 'conseiller', 'admin');
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 2. PROFILS
-- Étend auth.users. La clé primaire EST l'identifiant auth : pas de doublon
-- possible, suppression en cascade si le compte est supprimé.
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        public.user_role not null default 'client',
  nom         text not null default '',
  telephone   text,
  ville       text default 'Bangui',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is
  'Profil applicatif lié à auth.users. Le rôle pilote toutes les politiques RLS.';

-- -----------------------------------------------------------------------------
-- 3. CRÉATION AUTOMATIQUE DU PROFIL
-- Déclencheur à l''inscription : garantit qu''un compte a TOUJOURS un profil.
-- Sans cela, un utilisateur créé mais sans profil casse toutes les jointures.
--
-- `security definer` + `search_path` figé : obligatoire pour qu''un déclencheur
-- puisse écrire dans public depuis le schéma auth, sans être détournable.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nom, telephone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nom', ''),
    new.raw_user_meta_data ->> 'telephone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 4. FONCTIONS D'AIDE AUX POLITIQUES
-- Isolées pour éviter la récursion infinie : une politique sur `profiles` qui
-- interrogerait `profiles` directement se rappellerait sans fin.
-- -----------------------------------------------------------------------------
create or replace function public.current_role_is(roles public.user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = any(roles)
  );
$$;

-- -----------------------------------------------------------------------------
-- 5. POLITIQUES — PROFILS
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profil lisible par son proprietaire" on public.profiles;
create policy "profil lisible par son proprietaire"
  on public.profiles for select
  using (id = auth.uid() or public.current_role_is(array['admin','conseiller']::public.user_role[]));

drop policy if exists "profil modifiable par son proprietaire" on public.profiles;
create policy "profil modifiable par son proprietaire"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ⚠️ Le rôle n'est volontairement modifiable par PERSONNE via l'API.
-- Une promotion en admin passe par le SQL Editor ou la clé de service.
-- Sans cette restriction, un client pourrait se promouvoir lui-même.

drop policy if exists "profils administrables" on public.profiles;
create policy "profils administrables"
  on public.profiles for all
  using (public.current_role_is(array['admin']::public.user_role[]))
  with check (public.current_role_is(array['admin']::public.user_role[]));

-- -----------------------------------------------------------------------------
-- 6. CATALOGUE
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  slug        text primary key,
  nom         text not null,
  description text not null default '',
  ordre       int  not null default 0
);

create table if not exists public.produits (
  slug            text primary key,
  nom             text not null,
  marque          text not null default '',
  categorie_slug  text references public.categories(slug) on delete set null,
  description     text not null default '',
  -- Montant ENTIER en XAF. Le franc CFA n'a pas de subdivision : aucun
  -- flottant ne doit jamais représenter de l'argent.
  prix_xaf        integer not null check (prix_xaf >= 0),
  prix_barre_xaf  integer check (prix_barre_xaf is null or prix_barre_xaf > prix_xaf),
  stock           integer not null default 0 check (stock >= 0),
  image           text not null default '',
  mis_en_avant    boolean not null default false,
  actif           boolean not null default true,
  caracteristiques text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Fiches techniques vérifiées. Elles sont distinctes de `produits` : un modèle
-- peut être documenté avant qu'un prix et un stock locaux soient disponibles.
-- `fiche` conserve les données détaillées sans figer prématurément le format
-- d'affichage du futur front-end ; `images` pointe vers les fichiers publics.
create table if not exists public.fiches_produits (
  slug                  text primary key,
  fabricant             text not null,
  reference_fabricant   text not null unique,
  categorie_slug        text references public.categories(slug) on delete set null,
  gamme                 text not null,
  titre                 text not null,
  resume                text not null default '',
  fiche                 jsonb not null default '{}'::jsonb,
  images                text[] not null default '{}',
  sources               jsonb not null default '[]'::jsonb,
  verifie_le            date not null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists produits_categorie_idx on public.produits(categorie_slug) where actif;

alter table public.categories enable row level security;
alter table public.produits   enable row level security;
alter table public.fiches_produits enable row level security;

-- Le catalogue est public en lecture : c'est une vitrine.
drop policy if exists "categories publiques" on public.categories;
create policy "categories publiques"
  on public.categories for select using (true);

drop policy if exists "produits actifs publics" on public.produits;
create policy "produits actifs publics"
  on public.produits for select using (actif);

drop policy if exists "fiches produits publiques" on public.fiches_produits;
create policy "fiches produits publiques"
  on public.fiches_produits for select using (true);

-- Écriture réservée à l'administration.
drop policy if exists "categories administrables" on public.categories;
create policy "categories administrables"
  on public.categories for all
  using (public.current_role_is(array['admin']::public.user_role[]))
  with check (public.current_role_is(array['admin']::public.user_role[]));

drop policy if exists "produits administrables" on public.produits;
create policy "produits administrables"
  on public.produits for all
  using (public.current_role_is(array['admin']::public.user_role[]))
  with check (public.current_role_is(array['admin']::public.user_role[]));

drop policy if exists "fiches produits administrables" on public.fiches_produits;
create policy "fiches produits administrables"
  on public.fiches_produits for all
  using (public.current_role_is(array['admin']::public.user_role[]))
  with check (public.current_role_is(array['admin']::public.user_role[]));

-- -----------------------------------------------------------------------------
-- 7. COMMANDES
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'commande_statut') then
    create type public.commande_statut as enum
      ('en_attente','payee','preparation','expediee','livree','annulee');
  end if;
end $$;

create table if not exists public.commandes (
  id              uuid primary key default gen_random_uuid(),
  reference       text unique not null,
  profile_id      uuid references public.profiles(id) on delete set null,
  statut          public.commande_statut not null default 'en_attente',
  sous_total_xaf  integer not null default 0 check (sous_total_xaf >= 0),
  livraison_xaf   integer not null default 0 check (livraison_xaf >= 0),
  total_xaf       integer not null default 0 check (total_xaf >= 0),
  mode_paiement   text,
  telephone       text,
  adresse         text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.commande_lignes (
  id                 uuid primary key default gen_random_uuid(),
  commande_id        uuid not null references public.commandes(id) on delete cascade,
  produit_slug       text references public.produits(slug) on delete set null,
  -- Nom et prix FIGÉS au moment de l'achat : une commande passée reste
  -- lisible même si le produit est renommé ou retiré du catalogue.
  libelle_fige       text not null,
  prix_unitaire_xaf  integer not null check (prix_unitaire_xaf >= 0),
  quantite           integer not null check (quantite > 0)
);

create index if not exists commandes_profile_idx on public.commandes(profile_id);
create index if not exists lignes_commande_idx on public.commande_lignes(commande_id);

alter table public.commandes       enable row level security;
alter table public.commande_lignes enable row level security;

drop policy if exists "mes commandes" on public.commandes;
create policy "mes commandes"
  on public.commandes for select
  using (profile_id = auth.uid()
         or public.current_role_is(array['admin','conseiller']::public.user_role[]));

drop policy if exists "creer ma commande" on public.commandes;
create policy "creer ma commande"
  on public.commandes for insert
  with check (profile_id = auth.uid());

drop policy if exists "commandes administrables" on public.commandes;
create policy "commandes administrables"
  on public.commandes for all
  using (public.current_role_is(array['admin','conseiller']::public.user_role[]))
  with check (public.current_role_is(array['admin','conseiller']::public.user_role[]));

drop policy if exists "mes lignes de commande" on public.commande_lignes;
create policy "mes lignes de commande"
  on public.commande_lignes for select
  using (exists (
    select 1 from public.commandes c
    where c.id = commande_id
      and (c.profile_id = auth.uid()
           or public.current_role_is(array['admin','conseiller']::public.user_role[]))
  ));

-- -----------------------------------------------------------------------------
-- 8. DEVIS
-- -----------------------------------------------------------------------------
create table if not exists public.devis (
  id            uuid primary key default gen_random_uuid(),
  reference     text unique not null,
  profile_id    uuid references public.profiles(id) on delete set null,
  statut        text not null default 'brouillon',
  total_xaf     integer not null default 0 check (total_xaf >= 0),
  payload       jsonb not null default '{}'::jsonb,
  pdf_url       text,
  conseiller_id uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);

alter table public.devis enable row level security;

drop policy if exists "mes devis" on public.devis;
create policy "mes devis"
  on public.devis for select
  using (profile_id = auth.uid()
         or conseiller_id = auth.uid()
         or public.current_role_is(array['admin']::public.user_role[]));

drop policy if exists "creer mon devis" on public.devis;
create policy "creer mon devis"
  on public.devis for insert
  with check (profile_id = auth.uid() or profile_id is null);

-- -----------------------------------------------------------------------------
-- 9. HORODATAGE AUTOMATIQUE
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['profiles','produits','commandes'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- =============================================================================
-- APRÈS EXÉCUTION
-- Pour vous promouvoir administrateur, créez d'abord votre compte sur le site,
-- puis exécutez ici :
--
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'VOTRE_EMAIL');
--
-- Le rôle n'est pas modifiable via l'API : c'est volontaire.
-- =============================================================================
