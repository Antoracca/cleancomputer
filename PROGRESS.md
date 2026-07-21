# SUIVI D'AVANCEMENT — Clean Computer

> Mis à jour à chaque étape terminée. Une phase ne démarre pas avant que la
> porte de validation de la précédente soit franchie.

**Dernière mise à jour** : 19 juillet 2026
**Phase courante** : 4/5 — Transaction et différenciants
**Statut** : commande de bout en bout FONCTIONNELLE (vérifiée en réel)

Légende : `[ ]` à faire · `[~]` en cours · `[x]` terminé · `[!]` bloqué

---

## PHASE 1 — Cadrage et plan

- [x] Lecture intégrale de `skills/DESIGN-mastercard.md`
- [x] Analyse du dossier `media/` — déduplication MD5 (55 → 42 uniques)
- [x] Identification visuelle des 20 images uniques
- [x] Identification des 21 vidéos → 12 plans réellement distincts
- [x] Extraction de la couleur de marque depuis le logo → `#0148B2`
- [x] Signalement du problème de droits sur les vidéos
- [x] Rédaction de `docs/CONTEXTE.md`
- [x] Rédaction de `docs/MEDIA-MANIFEST.md`
- [x] Rédaction de `docs/DESIGN-DIRECTION.md`
- [x] Rédaction de `docs/DECISION-STACK.md`
- [x] Rédaction de `docs/PLAN.md` — sitemap complet et modèle de données
- [x] Recommandation d'authentification argumentée → **Supabase**
- [x] Identification de la contrainte paiement (Stripe/PayPal absents de RCA)
- [x] **PORTE** — Validation client obtenue (sitemap · Supabase · palette)

## PHASE 2 — Fondations

- [x] Initialisation Next.js **16.2** + React 19.2 + TypeScript strict + Tailwind v4
- [x] Tokens du design system en `@theme`
- [x] Police Sofia Sans via `next/font` (variable, poids 450 réel)
- [x] Primitives : Button · Skeleton · Container · PriceTag
- [x] `PortraitCircle` + satellite
- [x] `OrbitArc` — tracé SVG irrégulier, animé au scroll
- [x] Cadre hero rayon 40px + `HeroVideo` à dégradation réseau
- [x] `NavPill` + mega-menu 5 piliers + `MobileMenu` accordéon
- [x] `EyebrowLabel` · `GhostHeadline` · `PageHeader` · `CategoryPills`
- [x] Footer Ink 4 colonnes
- [x] App shell — layout racine persistant
- [x] Médias : déduplication, renommage, recadrage 1:1, vidéos hero MP4+WebM
- [x] Logo : détourage → `logo-full.png` · `logo-mark.png` *(SVG vectoriel encore à produire)*
- [x] Projet Supabase connecté (`hpudlzkkdfbspepofkma`), clés en `.env.local`
- [x] Schéma + politiques RLS écrits → `supabase/schema.sql`
- [ ] **ACTION CLIENT** : exécuter `supabase/schema.sql` dans le SQL Editor
- [ ] Types TypeScript générés depuis la base *(après exécution du schéma)*
- [ ] **PORTE** — Vérification visuelle à 360px et 1440px + `design:design-critique`

## PHASE 3 — Socle, pilier par pilier

- [x] Accueil — hero vidéo + fallback, constellation, bande produits, section devis
- [x] Électronique — catalogue + filtres par catégorie (rendu statique, sans JS)
- [x] Électronique — fiche produit + produits similaires
- [x] **Recherche globale** — superposition Ctrl+K, instantanée, clavier complet
- [x] Catalogue basculé sur Supabase (ISR 60 s, repli statique si base injoignable)
- [ ] Services informatiques — 4 familles
- [ ] Services informatiques — fiches prestation
- [x] Services informatiques — 4 familles + fiches prestation
- [x] Design & branding
- [x] Transfert d'argent — présentation, corridors *(simulateur en Phase 5)*
- [x] Transit & import — fret, étapes
- [ ] Véhicules — catalogue et fiches *(attend le catalogue fournisseur)*
- [x] Contact (formulaire complet) · FAQ · Mentions légales · CGV · Confidentialité
- [x] Panier, compte, suivi de commande — états vides honnêtes
- [x] **34 routes vérifiées en 200, zéro 404 dans la navigation**
- [ ] **PORTE** — Navigation complète sans rechargement, vérifiée dans le navigateur

## PHASE 4 — Transaction

- [x] Panier persistant + UI optimiste (Zustand + localStorage, badge nav)
- [x] Tunnel de commande — retrait/livraison → confirmation avec référence
- [x] Paiement à la livraison (espèces à la remise)
- [x] **Prix revalidés côté serveur** — le client n'envoie que slugs + quantités
- [x] Suivi de commande sans compte (référence + téléphone, refus générique)
- [ ] Interface `PaymentProvider` + adaptateur CinetPay (paiement en ligne)
- [x] Interface d'authentification — connexion, inscription, mot de passe oublié
- [x] Validation client (email, téléphone +236, force du mot de passe)
- [ ] Authentification Supabase + 3 rôles *(branchement serveur)*
- [ ] Redirection automatique selon le rôle
- [ ] Espace client — commandes, devis, adresses
- [x] Admin — produits (stock, visibilité en ligne/masqué, ISR 60 s)
- [x] Admin — commandes (changement de statut, formulaires sans JS)
- [x] Admin — vue d'ensemble (compteurs, dernières commandes)
- [ ] Admin — devis et clients
- [ ] Emails transactionnels
- [ ] **PORTE** — `security-review` paiement + authentification *(bloquant)*

## PHASE 5 — Différenciants

- [x] ★ **Configurateur de devis — 6 étapes, prix en direct** *(logique vérifiée par 7 cas de test)*
- [x] Devis — récapitulatif imprimable / export PDF navigateur
- [ ] Devis — enregistrement en base + envoi email *(après schéma)*
- [ ] ★ Simulateur de transfert — taux, frais, montant reçu
- [ ] Transfert — suivi par code
- [ ] Comparateur de produits
- [ ] Wishlist
- [ ] Avis clients avec photos
- [ ] Produits complémentaires
- [ ] Carte du transit + statuts illustrés
- [ ] Compteurs animés au scroll
- [ ] Notifications de compte
- [ ] Chat conseiller + statut de disponibilité
- [ ] PWA — service worker, manifeste, installable
- [ ] **PORTE** — Lighthouse réel : LCP < 1,5 s · INP < 200 ms · CLS ≈ 0

## PHASE 6 — Contenu et copie

- [ ] Passe `brand` — voix de marque sur les 5 piliers
- [ ] Passe `design:ux-copy` — titres, CTA, erreurs, états vides
- [ ] Registre particuliers / registre professionnels
- [ ] Contenu réel injecté
- [ ] SEO — métadonnées, données structurées, sitemap, Open Graph
- [ ] `design:design-critique` sur chaque page majeure

## PHASE 7 — Durcissement

- [ ] `security-review` complet
- [ ] `design:accessibility-review` — WCAG 2.1 AA
- [ ] `simplify` — dette technique
- [ ] Responsive : 360 · 390 · 414 · 768 · 1024 · 1280 · 1440
- [ ] Recette de bout en bout de tous les parcours
- [ ] Mode dégradé réseau lent vérifié

---

## BLOCAGES OUVERTS

| # | Sujet | Bloque | Attendu de |
|---|---|---|---|
| ~~1~~ | ~~Document fiscal~~ — **RÉGLÉ** (bulletin CIM260114672424 intégré) | — | — |
| 2 | Agrément ou partenariat transfert d'argent (BEAC/COBAC) | Mise en ligne pilier transfert | Client |
| 3 | Compte marchand CinetPay / contrat Orange Money RCA | Phase 4 | Client |
| 4 | Autorisation d'usage des vidéos `media/` | Hero d'accueil | Client |
| 5 | Logo au format vectoriel source | Phase 2 *(contournable)* | Client |
| ~~6~~ | ~~Confirmation Supabase~~ — **RÉGLÉ** (projet connecté) | — | — |
| 9 | **Exécuter `supabase/schema.sql`** dans le SQL Editor Supabase | Auth fonctionnelle | Client |
| 10 | **Faire tourner la clé de service** (exposée en conversation) | Sécurité | Client |
| 11 | **Logos Western Union / MoneyGram** — afficher ces marques revient à se déclarer agent agréé. Statut d'agent à confirmer AVANT toute mise en ligne | Pilier transfert | Client |
| 12 | Prix véhicules réels (rendus Bangui, dédouanement inclus) | Mise en ligne /vehicules | Client |
| 13 | Affiche « Groupe Bassit » dans le second lot — société tierce, non utilisée | — | Pour info |
| 7 | Tarifs réels — produits, prestations, frais de transfert | Phase 6 | Client |
| 8 | Chiffres de preuve sociale réels (`lib/config/proof.ts`) | Section masquée tant qu'absents | Client |

## JOURNAL

**19/07/2026 (6)** — Passe de refonte visuelle sur retours client.
Badge à point bleu SUPPRIMÉ partout (motif générique) → remplacé par un
libellé éditorial avec index numéroté et filet dégradé. Titres filigranes
supprimés (illisibles, lus comme un bug) → en-têtes de page enrichis avec
ligne de faits. Vidéo hero recadrée : logo Intel éliminé. Logo nav corrigé en
tablette (pictogramme jusqu'à lg, `shrink-0`). Accueil reconstruit en 9
sections à traitements DIFFÉRENTS (plus de motif répété).
**Images de service corrigées** — chaque visuel dit désormais la même chose
que son titre : étagère boutique, MacBook, nuanciers (Unsplash), écran de
transfert (Unsplash), Land Cruiser. Second lot traité : 71 fichiers → 54
uniques, 43 images identifiées une par une. 13 produits ajoutés (28 au total),
4 catégories créées (téléphones, ordinateurs, TV, photo). Catalogue véhicules
créé avec 4 modèles et galeries réelles.
⚠️ Reste à trancher : logos Western Union / MoneyGram (voir blocage 11).

**19/07/2026 (5)** — Le site est devenu transactionnel. Base peuplée (6
catégories, 15 produits), catalogue basculé sur Supabase avec repli statique.
Recherche globale livrée (le bouton loupe était mort — c'était le point
remonté). Panier persistant, tunnel de commande, confirmation avec référence,
suivi sans compte, panel admin (commandes + produits + vue d'ensemble).
**Vérifié de bout en bout dans Chrome** : recherche « starlink » → fiche au
clavier → ajout panier → checkout → commande CC-MRRYZ6V3MUG écrite en base →
suivi refusé avec un mauvais téléphone, accepté avec le bon. Une commande de
test « Test Fable » reste en base — à annuler depuis /admin/commandes.

**21/07/2026** — Audit et réparation de la navigation. 60 liens de la navbar
croisés avec les routes réelles : 24 étaient cassés ou trompeurs. Créé les 5
catégories absentes (composants, ecrans, stockage, cables, mobiles) et la route
`[famille]/[prestation]`, qui supprime les 11 liens Services et Design pointant
tous vers 4 pages de famille. Remonté au menu 3 catégories existantes mais
invisibles (television, logiciels, photo). Retiré de Transfert « Virement
bancaire » (aucun opérateur correspondant) et « Simulateur » (contredisait la
décision de bannir ce mot). Section Abonnements créée de zéro : 18 fiches, les
19 liens renvoyaient tous une 404. Catalogue enrichi de 67 produits dont 27
composants PC. Aperçus du mega-menu passés à quatre en grille 2×2.

Garde-fou ajouté : `scripts/check-navigation.mjs` vérifie que chaque image
existe sur le disque et que chaque lien correspond à une route servie. Un lien
mort ne casse pas la compilation, il ne se voit qu'au clic donc chez le client.

**Audit des logos de marque.** Trois fichiers étaient faux : `canalplus.svg` et
`mycanal.svg` étaient des rectangles noirs avec du texte tapé en Arial,
`starlink.svg` était le logo SpaceX (`<title>SpaceX</title>`). `meta.svg` était
un assemblage maison réutilisant le tracé de Facebook, remplacé par le vrai
vectoriel Simple Icons. Aucun vectoriel authentique n'existe pour Canal+ et
Starlink : composant `MarqueLogo` avec repli typographique, plutôt qu'une
approximation présentée comme le logo officiel. Vérification faite : Amazon,
Disney+, Xbox et Adobe sont de vrais tracés, mon soupçon initial était infondé.

Vérifié par build de production : 193 pages prérendues, 98 images produits
référencées et toutes présentes, zéro lien mort. **Prix inventés partout,
marqués `TODO_TARIFS`.** Deux points à trancher par le client : le repli
typographique ou des kits presse officiels, et l'exposition liée à la revente
d'abonnements Netflix, Disney+ et Spotify (contraire à leurs CGU).

**19/07/2026 (4)** — Supabase connecté, authentification branchée (connexion,
inscription, mot de passe oublié, déconnexion, middleware de session, espace
client réel avec redirection admin). Document fiscal intégré : ETS CLEAN,
RCCM CA/BG/2021A1542, NIU 2362026P94523G. `docs/CIM.pdf` exclu du dépôt.
Configurateur de devis livré — 6 étapes, prix en direct, récapitulatif
imprimable ; logique de calcul validée par 7 cas de test dont les majorations
multiplicatives. Script de peuplement prêt.
**Reste bloquant : exécuter `supabase/schema.sql` dans le SQL Editor.**

**19/07/2026 (3)** — Navigation complète : 34 routes, zéro 404. Authentification
(connexion, inscription, mot de passe oublié) avec validation réelle, non encore
branchée au serveur. Restructuration en groupes de routes `(site)` / `(auth)`.
**Bug systémique corrigé** : `tailwind-merge` supprimait les classes de couleur
au contact des classes de taille (`text-frost` + `text-body`), rendant le texte
des boutons invisible. Configuration des groupes de classes personnalisés.

**19/07/2026 (2)** — Phase 2 et catalogue. Design system, composants signature,
médias traités, logo détouré. Trois défauts corrigés après vérification à
l'écran : logo en carré blanc, contraste du hero sous le seuil AA, constellation
aux rangées gonflées.

**19/07/2026** — Phase 1 achevée. Cinq documents de cadrage produits. Media
analysé : 55 fichiers ramenés à 33 visuels réellement distincts. Couleur de marque
extraite du logo. Sept blocages identifiés et remontés au client. En attente de la
porte de validation avant Phase 2.
