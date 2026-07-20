# CONTEXTE PROJET — CLEAN COMPUTER

> Document de référence permanent. À relire au début de chaque session de travail
> et avant toute décision structurante. Toute instruction client validée est
> consignée ici.

---

## 1. Identité

- **Nom commercial** : CLEAN COMPUTER
- **Baseline (logo)** : IT SOLUTION
- **Marché** : Bangui, République Centrafricaine — clientèle particuliers + entreprises
- **Devise unique d'affichage** : Franc CFA BEAC — code ISO **XAF**
  - Format imposé : `125 000 FCFA` (espace insécable comme séparateur de milliers, **zéro décimale**)
  - Le XAF n'a pas de subdivision utilisée → tous les montants sont des entiers en base de données
- **Langue** : français (fr-FR), unique pour la V1

### Statut des informations manquantes
| Information | Statut | Source attendue |
|---|---|---|
| Raison sociale exacte, RCCM, NIF | **EN ATTENTE** | Document fiscal à fournir par le client |
| Adresse physique, téléphone, email officiel | **EN ATTENTE** | Document fiscal |
| Date de création, effectif | **EN ATTENTE** | Client |

> **Règle absolue** : aucune de ces valeurs ne doit être inventée. Tant qu'elles
> manquent, on utilise des constantes centralisées dans `src/lib/config/company.ts`
> avec la valeur `null` et un marqueur `TODO_FISCAL`, jamais un placeholder qui
> ressemble à une vraie donnée (pas de faux numéro RCCM, pas de fausse adresse).

---

## 2. Positionnement

Clean Computer n'est pas une boutique. C'est une **plateforme multi-services**
regroupant cinq métiers sous une seule marque :

1. **Électronique** — vente d'accessoires et matériel (téléphones, ordinateurs, chargeurs, audio, réseau/Wi-Fi, Starlink, gaming)
2. **Services informatiques** — installation OS, licences Office, maintenance, parc informatique, création de sites web et applications, maintenance de sites, boîtes mail professionnelles et alias
3. **Design & branding** — charte graphique, identité visuelle, onboarding de marque
4. **Transfert d'argent** — envoi Centrafrique ↔ Maroc et international. **Envoi uniquement, jamais réception**
5. **Transit & import** — expédition Chine ↔ Bangui (fret, dédouanement), import et vente de véhicules et motos de marques chinoises

Le fil conducteur : **produits physiques et produits immatériels vendus dans un
même parcours**, avec le même niveau de finition.

### Ambition de rendu
Qualité perçue de niveau Mastercard / Stripe / Linear. Le visiteur doit lire
« plateforme internationale », pas « vitrine locale ». Le « wow » vient de la
**fluidité et de la précision**, jamais de l'accumulation d'effets.

---

## 3. Charte graphique — règles fermes

### Origine
Le système est une **adaptation** de `skills/DESIGN-mastercard.md` à la couleur
de marque Clean Computer. On conserve intégralement la *grammaire* Mastercard
(rayons, rythme, typographie, élévation, portraits circulaires, satellites) et
on remplace la *palette chaude* par une palette froide dérivée du logo.

### Couleur de marque
Bleu extrait par échantillonnage du logo : **`#0148B2`**.

### Interdits absolus
- ❌ Aucune icône, illustration, texture ou image **générée par IA**
- ❌ Aucun **emoji** dans l'interface
- ❌ Aucun **blanc pur** (`#FFFFFF`) en fond de page
- ❌ Aucun rayon de bordure entre **8 et 16px** (le « milieu générique »)
- ❌ Aucune imagerie de service en **rectangle** — les portraits de service sont des cercles parfaits
- ❌ Aucun mélange de familles typographiques (une seule police)
- ❌ Aucune ombre dure (toute élévation ≥ 24px de flou, ≤ 10% d'opacité)
- ❌ Le bleu de marque n'est **pas** une couleur de CTA primaire (voir § design system)

### Iconographie autorisée
Bibliothèque d'icônes **dessinées à la main par des humains**, tracé linéaire
uniforme : `lucide-react`. Aucune icône custom générée.

---

## 4. Exigences techniques non négociables

### Performance perçue — « c'est une app, pas un site »
Après le premier chargement, **plus aucune sensation de rechargement**.
- App shell persistant (layouts App Router), jamais de full page reload
- Prefetch agressif de chaque lien visible + preload à l'intention de clic
- Cache client sur toute donnée déjà récupérée — un retour arrière est instantané, sans refetch
- Statique/ISR partout où c'est possible ; fetch client réservé au réellement dynamique
- Optimistic UI sur panier, wishlist, avis
- Skeleton **uniquement** au tout premier chargement d'une donnée jamais vue. Jamais de re-skeleton en navigation.

### Cibles mesurables (Core Web Vitals, à vérifier réellement)
| Métrique | Cible |
|---|---|
| LCP | < 1,5 s |
| INP | < 200 ms |
| CLS | ≈ 0 |
| JS initial (route home) | < 120 kB gzip |

### Contrainte marché Bangui
Réseau instable et coûteux. Conséquences structurelles :
- `next/image` partout, AVIF/WebP, tailles par breakpoint, placeholder flou
- Lazy loading systématique hors premier écran
- Vidéo hero avec **fallback image statique** et coupure automatique en `save-data` / connexion lente
- **PWA installable** avec service worker : assets en cache dès la première visite

### Responsive — mobile first strict
Design conçu à **360px d'abord**, puis élargi. Paliers vérifiés :
`360 · 390 · 414 · 768 · 1024 · 1280 · 1440+`
Aucune cible tactile sous **44×44px**.

---

## 5. Architecture

TypeScript **strict**. Composants réutilisables, découpage par domaine.
**Aucun fichier fourre-tout** : si un fichier dépasse ~200 lignes ou mélange
deux responsabilités, il est fractionné.

Règle : un composant = un fichier = une responsabilité. La logique métier vit
dans `lib/` ou `features/`, jamais dans un composant de page.

---

## 6. Copywriting

- Chaque pilier raconte une histoire : **problème → solution → preuve → action**
- Deux registres selon l'audience :
  - **Particuliers** (électronique, transfert) — direct, concret, rassurant
  - **Professionnels** (devis web, charte, parc informatique) — précis, chiffré, orienté résultat
- Aucun superlatif invérifiable (« le n°1 », « le meilleur ») — la crédibilité vient
  des preuves affichées, pas des adjectifs
- Chaque titre, CTA et description passe par une revue `brand` + `design:ux-copy` avant d'être considéré final

---

## 7. Points de vigilance juridique et réglementaire

> Ces points sont signalés et **doivent être tranchés par le client**. Ils ne
> bloquent pas la construction de l'interface, mais conditionnent la mise en ligne.

1. **Transfert d'argent** — activité régulée (BEAC / COBAC en zone CEMAC). Exercer
   le transfert de fonds exige un agrément ou un partenariat avec un établissement
   agréé. La V1 construit le **simulateur et la prise de demande**, pas un moteur
   de transfert autonome.
2. **Droits sur les vidéos** — la majorité des vidéos du dossier `media/` sont des
   contenus de marque tiers (Anker, Ugreen, Soundcore, GameSir) et deux d'entre
   elles montrent une **personne identifiable**. Leur usage en fond de hero
   commercial nécessite une autorisation. Voir `docs/MEDIA-MANIFEST.md`.
3. **Marques déposées** — les photos produits affichent des marques tierces
   (Microsoft, Apple, Sony, Logitech, Starlink…). Usage acceptable en tant que
   revendeur pour illustrer les produits réellement vendus ; à ne pas utiliser
   comme éléments de l'identité Clean Computer.
4. **Mentions légales / CGV** — obligatoires avant mise en ligne, à rédiger avec
   les données du document fiscal.

---

## 8. Méthode de travail

- Le plan de référence est `docs/PLAN.md`
- L'avancement est suivi dans `PROGRESS.md`, mis à jour **à chaque étape terminée**
- Aucune phase ne démarre avant validation explicite de la précédente
- Chaque page majeure est vérifiée **réellement dans le navigateur** avant validation,
  pas seulement en théorie
- Rien n'est laissé au hasard : du plus petit bouton au configurateur de devis
