# DÉCISIONS TECHNIQUES ARGUMENTÉES

---

## 1. AUTHENTIFICATION — recommandation : **Supabase Auth**

### Le comparatif

| Critère | Firebase Auth | **Supabase Auth** | NextAuth (Auth.js) |
|---|---|---|---|
| Base de données incluse | Firestore (NoSQL) | **PostgreSQL** | Aucune |
| Modèle de données e-commerce | ⚠️ Mal adapté | ✅ Relationnel natif | — (à fournir) |
| Rôles client / conseiller / admin | Custom claims (fonction Cloud) | ✅ RLS Postgres + claims JWT | À implémenter soi-même |
| Temps réel (suivi commande, chat) | ✅ Inclus | ✅ Inclus (Realtime) | ❌ |
| Stockage fichiers (photos avis, PDF devis) | ✅ | ✅ | ❌ |
| Coût à l'échelle | ⚠️ **Facturé à la lecture** | ✅ Forfait prévisible (0 $ → 25 $/mois) | Gratuit (mais infra en plus) |
| Auth par téléphone / OTP SMS | ✅ Inclus | ⚠️ Via Twilio/MessageBird | Via provider |
| Réversibilité / auto-hébergement | ❌ Verrouillage Google | ✅ Open source, auto-hébergeable | ✅ |
| Pièces à assembler | 1 | **1** | 3 (auth + BDD + stockage) |

### Pourquoi Supabase gagne ici

**1. Le modèle de données est relationnel, pas documentaire.**
Ce projet manipule commandes → lignes de commande → produits → variantes, devis →
options sélectionnées, transferts → statuts, avis → produits → utilisateurs. C'est
du relationnel de manuel. Firestore obligerait à dénormaliser massivement et à
maintenir la cohérence à la main. PostgreSQL fait ça nativement, avec des
contraintes d'intégrité réelles — ce qui compte quand on manipule de l'argent.

**2. Le coût Firebase est un piège sur un catalogue.**
Firestore facture **par document lu**. Un visiteur qui parcourt le catalogue génère
des centaines de lectures. Supabase facture la taille de la base et la bande
passante, pas le nombre de requêtes — bien plus prévisible pour un e-commerce, et
compatible avec du cache agressif côté client (une donnée en cache = zéro lecture,
alors que chez Firebase le modèle pousse à l'inverse).

**3. Les trois rôles sont natifs.**
`client` / `conseiller` / `admin` s'expriment directement en Row Level Security
Postgres : « un client ne voit que ses commandes », « un conseiller voit les devis
qui lui sont assignés », « un admin voit tout ». La règle vit dans la base, pas
dans le code applicatif — donc elle ne peut pas être contournée par un appel API
oublié. C'est le point qui compte le plus pour un site qui touche au paiement.

**4. Une seule brique au lieu de trois.**
Auth + base + stockage + temps réel + Edge Functions dans un seul service. NextAuth
ne fournit *que* l'authentification : il faudrait ajouter une base, un ORM, un
stockage, et une couche temps réel. Trois fois plus de surface à maintenir pour un
résultat équivalent.

**5. Réversibilité.**
Supabase est open source et auto-hébergeable. Si le coût ou la latence depuis
l'Afrique centrale posait problème, la migration est possible sans réécriture.
Avec Firebase, elle ne l'est pas.

### La réserve honnête

Le point faible de Supabase ici est l'**authentification par SMS**. À Bangui, le
numéro de téléphone est un identifiant plus naturel que l'adresse email. Firebase
inclut l'OTP SMS ; Supabase impose de brancher un fournisseur externe (Twilio,
MessageBird, ou un agrégateur local).

**Réponse retenue** : email + mot de passe et Google en V1, architecture prête pour
brancher l'OTP SMS en V2. Le coût du SMS (≈ 0,05 $/message) doit de toute façon
être arbitré par le client — ce n'est pas une décision technique.

> ⚠️ **Décision à confirmer par le client** avant Phase 2.

---

## 2. PAIEMENT — contrainte majeure à connaître

### Stripe et PayPal ne sont pas disponibles en République Centrafricaine

Ni Stripe, ni PayPal, ni Paddle n'acceptent de marchands immatriculés en RCA. Toute
architecture qui les suppose est à écarter d'emblée. C'est la contrainte la plus
structurante du projet côté encaissement.

### Options réellement praticables

| Solution | Couverture | Orange Money | Carte bancaire | Zone XAF |
|---|---|---|---|---|
| **CinetPay** | Afrique de l'Ouest + Centrale | ✅ | ✅ Visa/MC | ✅ |
| **PayDunya** | Principalement UEMOA (XOF) | ✅ | ✅ | ⚠️ Partiel |
| **Kkiapay** | Bénin, extension régionale | ✅ | ✅ | ⚠️ Partiel |
| **API Orange Money directe** | Par pays, via Orange RCA | ✅ | ❌ | ✅ |

**Recommandation : CinetPay en agrégateur principal.** C'est celui qui couvre le
mieux la zone CEMAC/XAF, il expose Orange Money **et** la carte bancaire derrière une
seule intégration, et il fournit des webhooks exploitables pour la réconciliation
de commande.

**Architecture retenue** : une interface `PaymentProvider` abstraite dès le départ,
avec CinetPay comme première implémentation. Changer d'agrégateur ou en ajouter un
second (Orange Money direct, paiement à la livraison) ne doit toucher qu'un seul
fichier.

**Toujours prévoir le paiement à la livraison** (espèces à la remise) : sur ce
marché, c'est un mode d'encaissement majoritaire, pas un mode dégradé.

> ⚠️ **À confirmer avec le client** : compte marchand existant ? Contrat Orange Money
> RCA en cours ? Cela conditionne le planning de la Phase 4.

---

## 3. STACK APPLICATIVE

| Couche | Choix | Justification |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Layouts persistants = app shell sans rechargement ; ISR pour le catalogue ; Server Components = moins de JS envoyé |
| UI | **React 19** | Transitions natives, `useOptimistic` pour l'UI optimiste du panier |
| Langage | **TypeScript strict** | `strict: true`, `noUncheckedIndexedAccess: true` |
| Style | **Tailwind CSS v4** | Tokens en CSS natif via `@theme` ; zéro runtime |
| Primitives | **shadcn/ui** (Radix) | Accessibles par construction, code possédé et modifiable |
| Icônes | **lucide-react** | Bibliothèque dessinée à la main, tracé uniforme — conforme à l'interdit « pas d'icône générative » |
| Cache serveur→client | **TanStack Query v5** | Cache, invalidation ciblée, retour arrière instantané |
| État panier | **Zustand** + persistance | 1,2 kB, survit au rechargement |
| Formulaires | **react-hook-form + Zod** | Validation partagée client/serveur, un seul schéma |
| Animation | **CSS + View Transitions API**, `motion` en secours | On n'embarque une librairie d'animation que là où le CSS ne suffit pas |
| Backend | **Supabase** | Voir § 1 |
| PWA | **Serwist** | Successeur maintenu de next-pwa, compatible App Router |
| Email | **Resend** + React Email | Devis PDF, confirmation de commande |
| PDF devis | **@react-pdf/renderer** | Génération côté serveur, sans navigateur headless |

### Ce qu'on n'embarque volontairement pas
- Pas de librairie de carrousel (CSS `scroll-snap` suffit)
- Pas de moment.js / date-fns complet (`Intl` natif suffit pour le français)
- Pas de librairie de graphiques lourde côté public — les compteurs animés sont
  du CSS + `IntersectionObserver`. Une librairie de charts n'est chargée que dans
  le panel admin, en import dynamique.

---

## 4. ARCHITECTURE DES DOSSIERS

```
src/
├── app/
│   ├── (marketing)/              # accueil, à-propos, réalisations, blog
│   ├── (boutique)/               # electronique, vehicules, panier, checkout
│   ├── (services)/               # services-informatiques, design, transfert, transit, devis
│   ├── (compte)/                 # connexion, tableau de bord, commandes, devis
│   ├── admin/                    # back-office (layout et middleware séparés)
│   ├── api/                      # webhooks paiement, génération PDF
│   ├── layout.tsx                # app shell — chargé une seule fois
│   └── globals.css               # tokens @theme Tailwind v4
│
├── components/
│   ├── ui/                       # primitives : Button, Input, Dialog, Skeleton…
│   ├── layout/                   # Navbar, MegaMenu, Footer, Container
│   ├── motion/                   # OrbitArc, CountUp, Reveal, PageTransition
│   └── shared/                   # PriceTag, ProductCard, PortraitCircle, EyebrowLabel
│
├── features/                     # un dossier par domaine métier
│   ├── catalogue/                # components/ hooks/ api/ types/
│   ├── panier/
│   ├── devis/                    # le configurateur — cœur différenciant
│   ├── transfert/
│   ├── transit/
│   ├── avis/
│   └── admin/
│
├── lib/
│   ├── supabase/                 # client, server, middleware
│   ├── paiement/                 # interface PaymentProvider + adaptateur CinetPay
│   ├── format/                   # formatXAF, formatDate — devise centralisée
│   ├── config/                   # company.ts, navigation.ts, seo.ts
│   └── utils/
│
├── hooks/                        # useMediaQuery, useIntersection, useNetworkStatus
├── types/                        # types partagés + types générés Supabase
└── styles/                       # tokens.css, animations.css
```

**Règles de découpage appliquées**
- Un composant = un fichier. Au-delà de ~200 lignes ou de deux responsabilités → on fractionne.
- Un composant de page **orchestre**, il ne calcule pas. Toute logique métier vit dans `features/*/` ou `lib/`.
- Chaque `features/` expose une façade via son `index.ts` ; l'intérieur reste privé.
- Aucun import direct entre deux `features/` — la communication passe par `lib/` ou par les props.
- Le formatage de la devise n'existe **qu'à un seul endroit** : `lib/format/currency.ts`.
