# PLAN DÉTAILLÉ — Plateforme Clean Computer

Documents liés : [`CONTEXTE.md`](CONTEXTE.md) · [`DESIGN-DIRECTION.md`](DESIGN-DIRECTION.md) · [`DECISION-STACK.md`](DECISION-STACK.md) · [`MEDIA-MANIFEST.md`](MEDIA-MANIFEST.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## 1. SITEMAP COMPLET

Légende : **[S]** socle, livré et fonctionnel · **[D]** différenciant, branché une fois le socle solide

```
/                                    [S]  Accueil — hero vidéo, 5 piliers en constellation, preuve, CTA
│
├── ÉLECTRONIQUE
│   ├── /electronique                [S]  Catalogue, filtres, tri, recherche
│   ├── /electronique/[categorie]    [S]  audio · charge · reseau · peripheriques · tablettes · gaming
│   ├── /electronique/p/[slug]       [S]  Fiche produit — galerie, variantes, stock, ajout panier
│   ├── /electronique/comparateur    [D]  Comparaison de 3 produits côte à côte
│   └── /electronique/avis/[slug]    [D]  Avis clients avec notes et photos
│
├── SERVICES INFORMATIQUES
│   ├── /services-informatiques      [S]  Les prestations, groupées en 4 familles
│   ├── /services-informatiques/[slug] [S] Détail d'une prestation
│   └── /devis                       [D]  ★ Configurateur multi-étapes, prix en direct
│
├── DESIGN & BRANDING
│   ├── /design-branding             [S]  Offre charte graphique, identité, onboarding
│   └── /realisations                [D]  Études de cas — avant/après, résultats
│
├── TRANSFERT D'ARGENT
│   ├── /transfert-argent            [S]  Présentation, corridors, tarifs
│   ├── /transfert-argent/simulateur [D]  ★ Taux du jour, frais en direct, montant reçu
│   └── /transfert-argent/suivi      [D]  Suivi par code de transaction
│
├── TRANSIT & IMPORT
│   ├── /transit-import              [S]  Fret Chine ↔ Bangui, dédouanement
│   ├── /transit-import/carte        [D]  Carte des routes et étapes du transit
│   ├── /vehicules                   [S]  Catalogue véhicules, motos, motocross
│   └── /vehicules/[slug]            [S]  Fiche véhicule — galerie, spécifications, demande
│
├── COMMERCE
│   ├── /panier                      [S]
│   ├── /checkout                    [S]  Livraison → paiement → confirmation
│   └── /suivi-commande              [S]  Suivi par numéro, avec ou sans compte
│
├── COMPTE
│   ├── /connexion  /inscription     [S]
│   ├── /compte                      [S]  Tableau de bord
│   ├── /compte/commandes            [S]
│   ├── /compte/devis                [S]
│   ├── /compte/transferts           [D]
│   ├── /compte/favoris              [D]  Wishlist persistante
│   └── /compte/parrainage           [D]  Cross-sell entre piliers
│
├── ADMIN                            [S]  Redirection automatique selon le rôle
│   ├── /admin                       [S]  Vue d'ensemble, indicateurs
│   ├── /admin/produits              [S]  CRUD, stock, prix
│   ├── /admin/commandes             [S]  Statuts, expédition
│   ├── /admin/devis                 [S]  Demandes, assignation conseiller
│   ├── /admin/transit               [D]  Mise à jour des statuts d'expédition
│   ├── /admin/avis                  [D]  Modération
│   └── /admin/clients               [S]
│
└── INSTITUTIONNEL
    ├── /a-propos  /notre-histoire   [D]  Storytelling, équipe, valeurs
    ├── /partenaires-marques         [D]  Marques importées, partenaires paiement
    ├── /actualites  /actualites/[slug] [D] Blog SEO — import Chine, transfert, astuces
    ├── /carrieres                   [D]
    ├── /contact                     [S]
    ├── /faq                         [S]
    └── /mentions-legales  /cgv  /confidentialite  [S]
```

### Regroupement des prestations en sous-services

Demande client : *« diviser tout ça en sous-services, pour regrouper sous un seul
angle, l'angle service »*. Structure retenue — **4 familles** :

| Famille | Prestations |
|---|---|
| **Systèmes & postes** | Installation Windows / macOS / Linux · Licences Office · Suite bureautique · Optimisation et nettoyage · Récupération de données |
| **Infrastructure** | Parc informatique entreprise · Réseau et Wi-Fi · Installation Starlink · Vidéosurveillance · Maintenance sous contrat |
| **Développement** | Site vitrine · Site e-commerce · Application mobile · Application sur mesure · Maintenance et évolution · Hébergement |
| **Identité & communication** | Charte graphique · Logo · Onboarding de marque · Refonte d'identité · Boîtes mail professionnelles et alias |

Chaque prestation est une **entrée de base de données**, pas une page codée en
dur — elle alimente à la fois la page de la famille, la fiche détaillée et le
configurateur de devis. Une prestation ajoutée en back-office apparaît partout
sans redéploiement.

---

## 2. MODÈLE DE DONNÉES

Conçu **dès maintenant** pour accueillir les différenciants, même si leur interface
arrive en Phase 5. Ajouter une table plus tard est facile ; migrer des données
existantes ne l'est pas.

```
IDENTITÉ
  profiles           id, role(client|conseiller|admin), nom, telephone, ville
  adresses           profile_id, ligne, quartier, ville, telephone, defaut

CATALOGUE
  categories         slug, nom, parent_id, ordre
  produits           slug, nom, description, categorie_id, marque,
                     prix_xaf(int), prix_barre_xaf, stock, actif, mis_en_avant
  produit_medias     produit_id, url, type(image|video), alt, ordre
  produit_variantes  produit_id, nom, valeur, delta_prix_xaf, stock
  produits_lies      produit_id, produit_lie_id, type(accessoire|alternative)   [D]

VÉHICULES
  vehicules          slug, type(voiture|moto|motocross), marque, modele, annee,
                     prix_xaf, kilometrage, motorisation, statut_import
  vehicule_medias    vehicule_id, url, ordre

SERVICES
  familles_service   slug, nom, description, ordre
  prestations        famille_id, slug, nom, description, prix_base_xaf,
                     unite(forfait|jour|poste|mois)
  devis              reference, profile_id, statut, total_xaf, payload(jsonb),
                     pdf_url, conseiller_id
  devis_options      devis_id, cle, libelle, valeur, delta_xaf

COMMERCE
  commandes          reference, profile_id, statut, sous_total_xaf, livraison_xaf,
                     total_xaf, mode_paiement, adresse_id
  commande_lignes    commande_id, produit_id, variante_id, quantite,
                     prix_unitaire_xaf, libelle_fige
  paiements          commande_id, fournisseur, ref_externe, statut, montant_xaf

TRANSFERT                                                                    [D]
  taux_change        devise_source, devise_cible, taux, frais_pct, frais_fixe, valide_le
  transferts         code, profile_id, montant_envoye_xaf, frais_xaf,
                     montant_recu, devise_cible, corridor, statut

TRANSIT                                                                      [D]
  expeditions        reference, profile_id, type(fret|vehicule), origine,
                     destination, poids_kg, volume_m3, statut
  expedition_etapes  expedition_id, etape, libelle, date, lieu, note

ENGAGEMENT                                                                   [D]
  avis               produit_id, profile_id, note(1-5), titre, corps, verifie
  avis_medias        avis_id, url
  favoris            profile_id, produit_id
  notifications      profile_id, type, titre, corps, lu, lien
  parrainages        parrain_id, filleul_id, code, recompense_xaf, statut

CONTENU
  articles           slug, titre, chapo, corps, couverture, publie_le, auteur_id
  realisations       slug, titre, client, probleme, solution, resultats(jsonb), medias
```

**Règle sur les montants** : tous les prix sont des **entiers en XAF**. Aucun
flottant, jamais. Le XAF n'a pas de décimale et les arrondis flottants sur de
l'argent sont une source de bugs garantie.

**Règle sur les commandes** : `commande_lignes.libelle_fige` et `prix_unitaire_xaf`
figent le nom et le prix **au moment de l'achat**. Une commande passée reste
lisible même si le produit est renommé ou supprimé.

---

## 3. LES SEPT PHASES

### Phase 1 — Cadrage *(en cours)*
Plan, sitemap, traitement du dossier media, direction artistique, décisions de stack.
**Sortie** : les cinq documents de `docs/`. **Aucun code.**
**Porte de validation** : accord client sur le sitemap, l'authentification et la palette.

### Phase 2 — Fondations
1. Initialisation Next.js 15 + TypeScript strict + Tailwind v4
2. Tokens du design system en `@theme` (couleurs, rayons, ombres, espacements)
3. Primitives : `Button`, `Input`, `Badge`, `Skeleton`, `Container`, `Dialog`
4. Composants signature : `PortraitCircle`, `OrbitArc`, `HeroFrame`, `NavPill`, `EyebrowLabel`, `GhostHeadline`
5. App shell : layout racine, navbar avec mega-menu, footer Ink
6. Traitement des médias : déduplication, renommage, recadrage 1:1, conversion AVIF/WebP, vectorisation du logo
7. Schéma Supabase + politiques RLS + types générés

**Porte** : une page de démonstration du design system, vérifiée dans le navigateur
à 360px et 1440px, revue par `design:design-critique`.

### Phase 3 — Socle, pilier par pilier
Dans cet ordre, chaque pilier étant validé avant le suivant :
1. **Accueil** — hero vidéo + fallback, constellation des 5 piliers, preuve sociale, CTA
2. **Électronique** — catalogue, filtres, fiche produit, panier
3. **Services informatiques** — les 4 familles, fiches prestation
4. **Design & branding** — offre, portfolio
5. **Transfert d'argent** — présentation, corridors, tarifs *(statique en V1)*
6. **Transit & véhicules** — fret, catalogue véhicules, fiches
7. Pages institutionnelles : contact, FAQ, mentions légales

**Porte** : navigation complète sans rechargement, mesurée dans le navigateur.

### Phase 4 — Transaction
1. Panier persistant + UI optimiste
2. Tunnel de commande : livraison → paiement → confirmation
3. Intégration CinetPay (carte + Orange Money) + paiement à la livraison
4. Authentification Supabase + trois rôles + redirection automatique selon le rôle
5. Espace client : commandes, devis, adresses
6. Panel admin : produits, commandes, devis, clients
7. Emails transactionnels

**Porte** : `security-review` sur le paiement et l'authentification. Bloquant.

### Phase 5 — Différenciants
1. ★ **Configurateur de devis** — multi-étapes, prix en direct, export PDF, envoi email
2. ★ **Simulateur de transfert** — taux du jour, frais en direct, suivi par code
3. Comparateur de produits, wishlist, avis avec photos, produits complémentaires
4. Carte du transit, statuts illustrés
5. Compteurs animés, notifications de compte, chat conseiller avec statut de disponibilité
6. **PWA** — service worker, manifeste, installable, cache des assets

**Porte** : Lighthouse réel — LCP < 1,5 s, INP < 200 ms, CLS ≈ 0.

### Phase 6 — Contenu et copie
1. Passe `brand` : voix de marque cohérente sur les cinq piliers
2. Passe `design:ux-copy` : chaque titre, CTA, message d'erreur, état vide
3. Deux registres — particuliers et professionnels
4. Contenu réel injecté (produits, prestations, tarifs)
5. SEO : métadonnées, données structurées, sitemap, Open Graph
6. Passe `design:design-critique` sur **chaque** page majeure

### Phase 7 — Durcissement
1. `security-review` complet
2. `design:accessibility-review` — WCAG 2.1 AA
3. `simplify` — dette technique, duplication
4. Revue responsive exhaustive : 360 · 390 · 414 · 768 · 1024 · 1280 · 1440
5. Recette navigateur de bout en bout de tous les parcours
6. Mode dégradé réseau lent vérifié en conditions réelles

---

## 4. NAVIGATION — le mega-menu

Cinq piliers, donc cinq entrées. Chaque survol ouvre un panneau à 40px de rayon
avec un aperçu visuel, pas une liste de liens nue.

| Entrée | Contenu du panneau |
|---|---|
| **Boutique** | 6 catégories + 2 produits mis en avant avec visuel |
| **Services** | 4 familles de prestations + accès direct au configurateur de devis |
| **Design** | Offre identité + 2 réalisations en aperçu |
| **Transfert** | Corridors + accès au simulateur + suivi par code |
| **Import & véhicules** | Fret Chine↔Bangui + catalogue véhicules en aperçu |

À droite de la pilule : recherche, panier avec compteur, compte.
Sous 1024px : logo + hamburger + panier. Le menu s'ouvre en plein écran, les
piliers se dépilent en accordéon.

> Contrainte Mastercard respectée : **jamais plus de six entrées de premier niveau.**

---

## 5. PARCOURS DU CONFIGURATEUR DE DEVIS

Le point le plus différenciant du projet. Le prix se recalcule **à chaque clic**,
jamais un formulaire qui part et attend une réponse.

```
Étape 1  Type de projet     Vitrine · E-commerce · Application mobile · Sur mesure
Étape 2  Périmètre          Nombre de pages, langues, espace client, blog
Étape 3  Fonctionnalités    Paiement en ligne, réservation, tableau de bord,
                            API, notifications…   (cases à cocher, chacune chiffrée)
Étape 4  Identité           Charte existante · à créer · refonte
Étape 5  Délai              Standard · Accéléré (+30%) · Urgent (+60%)
Étape 6  Récapitulatif      Détail ligne par ligne, total XAF, échéancier
                            → PDF · Envoi par email · Prise de contact
```

**Barre de prix persistante**, collée en bas sur mobile, en colonne latérale sur
desktop. Elle affiche le total en XAF et s'anime à chaque changement — c'est ce
qui transforme un besoin flou en décision.

Le barème vit en base (`prestations.prix_base_xaf` + deltas d'options), donc il est
modifiable en back-office sans redéploiement.

---

## 6. STRATÉGIE DE PERFORMANCE

| Type de page | Rendu | Cache |
|---|---|---|
| Accueil, piliers, institutionnel | **Statique** (build) | CDN + service worker |
| Catalogue, fiches produit | **ISR** (revalidation 60 s) | CDN + TanStack Query |
| Blog, réalisations | **Statique** | CDN + service worker |
| Panier | Client (Zustand persisté) | localStorage |
| Compte, commandes | Serveur dynamique | TanStack Query, invalidation ciblée |
| Suivi commande/transfert | Client + Realtime | Query + abonnement Supabase |
| Admin | Serveur dynamique, `noindex` | Query |

**Règles appliquées partout**
- `next/link` avec prefetch sur tout lien visible, preload au survol
- Skeleton **uniquement** au premier chargement d'une donnée jamais vue
- UI optimiste sur panier, favoris, avis
- Découpage par route, import dynamique de tout ce qui est hors du premier écran
- Aucune librairie de graphiques dans le bundle public

---

## 7. SKILLS PAR PHASE

| Phase | Skills mobilisés |
|---|---|
| 1 — Cadrage | `DESIGN-mastercard.md` ✅ |
| 2 — Fondations | `design-system` · `ui-styling` · `frontend-design` · `composition-patterns` · `design:design-critique` |
| 3 — Socle | `ui-ux-pro-max` · `web-design-guidelines` · `react-view-transitions` · `run` |
| 4 — Transaction | `react-best-practices` · `security-review` |
| 5 — Différenciants | `ui-ux-pro-max` · `dataviz` · `react-best-practices` · `run` |
| 6 — Contenu | `brand` · `design:ux-copy` · `design:design-critique` |
| 7 — Durcissement | `security-review` · `design:accessibility-review` · `simplify` · `run` |

Écartés comme demandé : `slides`, `banner-design`, `react-native-skills`,
`vercel-optimize`, `writing-guidelines`, `deploy-to-vercel`.

---

## 8. CE QUI BLOQUE ET CE QUI N'EST PAS TRANCHÉ

| Sujet | Nature | Impact |
|---|---|---|
| Document fiscal (raison sociale, RCCM, NIF, adresse, contacts) | **Bloquant** Phase 6 | Mentions légales, CGV, footer, factures |
| Agrément transfert d'argent (BEAC/COBAC) | **Bloquant** mise en ligne du pilier | Voir `CONTEXTE.md` § 7 |
| Compte marchand CinetPay / contrat Orange Money RCA | **Bloquant** Phase 4 | Encaissement |
| Droits sur les vidéos `media/` | **Bloquant** hero | Voir `MEDIA-MANIFEST.md` |
| Logo au format vectoriel | Gênant Phase 2 | Sinon revectorisation manuelle |
| Confirmation Supabase | À valider | Démarrage Phase 2 |
| Tarifs réels (produits, prestations, frais de transfert) | Bloquant Phase 6 | Le socle peut avancer avec des valeurs marquées provisoires |
