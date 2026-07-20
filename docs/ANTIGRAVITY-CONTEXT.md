# ANTIGRAVITY CONTEXT — Clean Computer

> Ce document trace la reprise du projet par Antigravity. Il résume l'état d'avancement tel que laissé par l'agent précédent, les principes fondateurs à respecter, et les prochaines étapes à exécuter.

## 1. État des lieux

Le projet est une plateforme multi-services pour Bangui (RCA) comprenant 5 piliers :
- Électronique
- Services informatiques
- Design & branding
- Transfert d'argent
- Transit & import

**Phases complétées (1 à 4) :**
- Cadrage technique et design validés.
- Socle fonctionnel (Next.js 16.2 / 15, Tailwind v4).
- Base de données Supabase et schéma définis.
- Catalogue produit, recherche globale et panier fonctionnels.
- Tunnel de commande complet (checkout, suivi, admin basique).
- Authentification codée mais en attente d'exécution SQL côté Supabase.

**Phase en cours (5/7 - Différenciants) :**
- ✅ Configurateur de devis fonctionnel (côté frontend).
- ⏳ Reste à faire dans la Phase 5 :
  - Enregistrement des devis en base et envoi d'email.
  - Simulateur de transfert d'argent.
  - Suivi de transfert.
  - Comparateur de produits et Wishlist.
  - Avis clients avec photos.
  - Carte du transit.
  - Compteurs animés, notifications, chat.
  - Installation PWA.

**Blocages en attente du client :**
- Exécution de `supabase/schema.sql` dans le SQL Editor.
- Agrément transfert (BEAC/COBAC) / Logos Western Union & MoneyGram.
- Compte marchand CinetPay / Orange Money.
- Document fiscal pour les mentions légales et CGV.
- Tarifs réels.

## 2. Ligne directrice technique & design

- **Stack :** Next.js (App Router), Tailwind CSS v4, TypeScript strict, Supabase.
- **Performances :** App shell persistant, chargement statique (ISR 60s) maximisé, UI optimiste (Zustand), fallback image pour vidéos.
- **Design System (Inspiré Mastercard) :**
  - **Canevas givré (`Frost` `#F1F4F9`)**, jamais de blanc pur en fond.
  - **Couleur Primaire (`Ink` `#0F1520`)** pour textes et boutons d'action.
  - **Couleur de Marque (`Clean Blue` `#0148B2`)** pour accents et identité.
  - **Rayons absolus :** 20px (boutons), 40px (stades/hero), 50% (cercles), 999px (pilules). Jamais de 8-16px.
  - **Typographie :** Sofia Sans (variable, poids 450 pour corps de texte, 500 pour titres avec interlettrage -2%).
  - **Composants clés :** `<PortraitCircle>`, `<OrbitArc>`, `<NavPill>`, `<HeroFrame>`, `<GhostHeadline>`, `<EyebrowLabel>`.
  - Pas d'ombres dures, uniquement des coussins d'atmosphère.

## 3. Ma mission & Prochaines actions

Mon objectif immédiat est de poursuivre la **Phase 5 (Différenciants)** avec une priorité sur les éléments suivants (dans l'ordre de priorité défini par le plan initial et le tracking des progrès) :

1. **Sauvegarde Devis :** Finaliser l'enregistrement en base des devis et la mécanique d'envoi d'email (sous réserve de l'exécution du schéma DB).
2. **Transfert d'argent :** Développer le simulateur (taux, frais, montant) et le suivi de transfert.
3. **Produits :** Développer le comparateur, la wishlist et le système d'avis.
4. **Transit :** Créer la carte interactive des statuts d'expédition.
5. **App / PWA :** Configurer le manifeste et le service worker.

*Avant chaque développement nécessitant la base de données, je m'assurerai que les politiques RLS et le schéma ont été validés/exécutés, ou je proposerai des mocks fonctionnels de test.*
