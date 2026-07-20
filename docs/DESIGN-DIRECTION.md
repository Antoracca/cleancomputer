# DIRECTION ARTISTIQUE — Clean Computer
### Adaptation du système Mastercard à l'identité bleue

Source : `skills/DESIGN-mastercard.md`, lu intégralement.
Principe directeur : **on garde la grammaire, on change la palette.**

---

## Le raisonnement

Le système Mastercard repose sur trois gestes, et **aucun des trois n'est lié à
la couleur** :

1. **Le rayon démesuré** — 20px sur les boutons, 40px sur les cadres média,
   999px sur la navigation, 50% sur les portraits. Le « milieu générique » 8–16px
   est absent, et c'est précisément ce qui fait que l'interface ne ressemble pas
   à un template.
2. **L'orbite** — des portraits circulaires reliés par de fins arcs tracés, avec un
   micro-CTA « satellite » amarré à leur périmètre. Les services ne sont pas une
   liste, ce sont une constellation.
3. **Le vide comme structure** — 300 à 500px de canevas nu entre deux sections.
   L'œil ralentit, il lit une chose à la fois.

Ces trois gestes se transposent tels quels. **Ce qui ne se transpose pas, c'est le
crème chaud** : `#F3F0EE` est une couleur papier, pensée pour un logo rouge/jaune.
Sous un logo bleu franc, elle vire au sale.

**La bascule** : on remplace le crème putty par un **canevas givré froid** —
même intention (jamais de blanc pur, toujours une surface teintée), température
inversée pour s'accorder au bleu.

---

## Palette

### Fondations

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Canevas | **Frost** | `#F1F4F9` | Fond de page par défaut. Jamais de blanc pur. |
| Surface levée | **Frost Lifted** | `#FAFBFD` | Sections imbriquées, « papier posé sur papier » |
| Blanc | **White** | `#FFFFFF` | Pilule de navigation, cartes modales, satellites, boutons secondaires |
| Encre | **Ink** | `#0F1520` | CTA primaires, titres, fond du footer. Presque-noir **froid** (le crème chaud de Mastercard devient ici un noir bleuté) |

### Marque

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Bleu de marque | **Clean Blue** | `#0148B2` | **Logo, liens, accents, états actifs.** Extrait du logo par échantillonnage. |
| Bleu clair | **Orbit Blue** | `#3B82E8` | **Arcs orbitaux décoratifs uniquement.** Remplace exactement le rôle du Light Signal Orange. |
| Bleu profond | **Deep Blue** | `#01337E` | Liens secondaires, survol du bleu de marque |

> **Règle héritée de Mastercard, appliquée à la lettre** : chez Mastercard, le rouge
> et le jaune de marque ne sont **jamais** des couleurs d'interface — ils vivent
> dans le logo. Ici, le bleu a un statut légèrement plus large (liens, accents,
> arcs), **mais il n'est pas la couleur du CTA primaire**. Le CTA primaire reste
> une **pilule Ink**. C'est contre-intuitif et c'est exactement ce qui donne le
> caractère institutionnel : le bleu signale l'identité, le noir déclenche l'action.

### Signal réservé

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Consentement / légal | **Signal Amber** | `#C2410C` | **Uniquement** bandeau cookies, préférences de confidentialité, confirmations juridiques. Jamais un CTA marketing. |

### Neutres

| Nom | Hex | Usage |
|---|---|---|
| Charcoal | `#242A35` | Alternative de texte légèrement adoucie |
| Slate | `#697586` | Texte secondaire, libellés eyebrow, états désactivés |
| Graphite | `#4B5563` | Accents de texte en ligne |
| Mist | `#CBD3DF` | Texte « murmuré », états vides, faible contraste |
| Ghost | `#E4E9F2` | Titres filigranes crème-sur-crème (ici givré-sur-givré) |

### Sémantique

| Rôle | Hex |
|---|---|
| Succès (commande livrée, transfert reçu) | `#0F766E` |
| Attention (en transit, en attente) | `#B45309` |
| Erreur (paiement refusé) | `#B42318` |

> Ces trois couleurs servent **exclusivement aux statuts**, jamais à la décoration.

---

## Typographie

**Une seule famille, comme chez Mastercard.** MarkForMC est propriétaire ; le
document désigne lui-même **Sofia Sans** comme le meilleur substitut open source
— et elle figure déjà dans la pile de secours de Mastercard. Elle est disponible
sur Google Fonts, en variable, donc chargée via `next/font` sans requête externe.

```
Sofia Sans Variable → poids 400 / 450 / 500 / 700
```

| Rôle | Taille | Poids | Interligne | Interlettrage |
|---|---|---|---|---|
| H1 hero (desktop) | 64px | 500 | 64px (1:1) | **-2%** |
| H1 hero (mobile) | 40px | 500 | 42px | -2% |
| H2 section | 36px | 500 | 44px | -2% |
| H3 carte | 24px | 500 | 28.8px | -2% |
| Eyebrow | 14px | 700 | 14px | **+4%**, MAJUSCULES, point d'accent |
| Corps | 16px | **450** | 22.4px (1.4) | normal |
| Bouton / lien nav | 16px | 500 | 16px | -3% |
| Lien footer | 14px | 450 | 20px | normal |

**Les deux règles qui portent l'identité :**
- **Le poids 450 est structurel.** Le remplacer par 400 aplatit tout le système.
  Sofia Sans est variable, donc `font-weight: 450` fonctionne réellement.
- **-2% d'interlettrage sur tous les titres.** Les mots se verrouillent ensemble.
  C'est ce qui produit la densité éditoriale.

**Les MAJUSCULES n'existent qu'à l'échelle eyebrow (14px).** Aucun titre de section
en capitales.

---

## Rayons — l'échelle héritée telle quelle

| Rayon | Usage |
|---|---|
| 4px | Micro-éléments décoratifs, puces du bandeau cookies |
| **20px** | **CTA primaires et secondaires** — le rayon signature |
| 24px | Pilule de consentement, puces internes de modale |
| **40px** | **Cadres média du hero**, grands conteneurs de section |
| **50%** | **Portraits circulaires**, boutons-icônes, satellites |
| **999px** | **Navigation**, cartes carrousel, sélecteur pays, puces en ligne |

> **8 à 16px est interdit.** C'est la règle la plus facile à enfreindre par
> réflexe et celle qui, à elle seule, ferait retomber le site dans le générique.

---

## Élévation

| Niveau | Ombre | Usage |
|---|---|---|
| 0 | aucune | **95% des surfaces** — posées à plat sur le canevas |
| 1 | `0 4px 24px rgba(15,21,32,.04)` | Pilule de navigation flottante |
| 2 | `0 24px 48px rgba(15,21,32,.08)` | Cadres média, cartes surélevées |
| 3 | `0 70px 110px rgba(15,21,32,.22)` | Rare — une tuile vedette maximum par page |

**Philosophie :** l'ombre est un **coussin d'atmosphère**, pas une lumière
directionnelle. Aucune ombre serrée, aucun bord dur. Pour délimiter une zone
fonctionnelle (champ de formulaire, séparateur de footer), on utilise un **trait**,
jamais une ombre.

---

## Composants signature à construire

### 1. `<PortraitCircle>` — le composant identitaire
Portrait circulaire de 260–340px (220px mobile), photo carrée recadrée en cercle
parfait, **satellite blanc de 56px** amarré en bas à droite et débordant d'environ
40% hors du cercle, contenant une flèche Ink. Dessous : eyebrow avec point Orbit
Blue, puis titre H3.

C'est le point d'entrée de chaque pilier de service. Il est réutilisé à l'identique
pour les cinq métiers.

### 2. `<OrbitArc>` — l'arc orbital
Trait SVG de 1 à 1,5px en Orbit Blue reliant deux portraits. **Irrégularité
volontaire** : une courbe de Bézier parfaite trahit le CSS ; le tracé doit sembler
fait à la main. Animé au scroll par `stroke-dashoffset`.
**Retiré sous 768px** — l'arc n'a de sens qu'avec un placement asymétrique.

### 3. `<HeroFrame>` — le cadre stade
Rayon 40px sur les quatre coins, pleine largeur moins 48px de gouttière, 60–70%
de la hauteur de viewport, fond sombre pour la vidéo, **aucune ombre**. Le rayon
de 40px est maintenu à tous les paliers.

### 4. `<NavPill>` — la navigation flottante
Pilule blanche à 999px, flottant 24px sous le haut du viewport, ombre niveau 1,
logo à gauche, 5 liens maximum au centre avec 48px d'écart, bouton de recherche
circulaire de 48px à droite.

**Extension nécessaire au projet** : Clean Computer a cinq métiers, donc le
mega-menu avec aperçus visuels par pilier remplace le simple survol. La pilule
conserve sa forme ; le panneau qui s'ouvre est une carte à 40px de rayon posée
juste dessous.

### 5. `<GhostHeadline>` — le titre filigrane
Texte de 72–128px, poids 500, en `#E4E9F2` sur canevas `#F1F4F9`. Presque
invisible. Posé derrière les portraits, débordant du bord du viewport.

### 6. `<EyebrowLabel>`
Point d'accent + libellé en majuscules, 14px, poids 700, +4% d'interlettrage.
**Le point n'est jamais omis** — c'est le marqueur d'identité du système.

---

## Rythme de page

Chaque page suit la même progression tonale :

```
Canevas Frost  →  Frost Lifted (sections imbriquées)  →  Footer Ink
```

Espacement vertical de section : **128px** en desktop, **64px** en mobile.
Grille : 12 colonnes implicites, largeur maximale de contenu **1280px**,
gouttières de 48px (24px en mobile).

**Les portraits ne sont jamais alignés sur une grille.** Leur placement
asymétrique est ce qui produit l'effet de constellation. Les aligner tue le
système.

---

## Ce que le système doit gagner en plus de Mastercard

Mastercard est une page vitrine institutionnelle. Clean Computer est une
**application transactionnelle**. Trois familles de composants n'existent pas dans
la référence et doivent être conçues dans la même langue :

| Besoin | Traduction dans le système |
|---|---|
| Cartes produit en grille dense | Rayon 20px, ombre 0, trait 1px `Mist`. La grille dense est autorisée **dans le catalogue** — le vide éditorial reste réservé aux pages piliers. |
| Tableaux (admin, historique) | Pas de rayon sur les cellules, séparateurs 1px `Mist`, en-têtes à l'échelle eyebrow |
| Formulaires (checkout, devis) | Champs à **999px** (pilule) comme la recherche Mastercard, trait Ink à 50% d'opacité, blanc sur Frost |
| Statuts (commande, transit, transfert) | Puces 999px, couleurs sémantiques, **jamais** le Signal Amber |
| Squelettes de chargement | Fond `#E4E9F2`, rayon identique au composant final, pulsation lente (1,8 s) sans miroitement clinquant |

**Le principe qui arbitre tous les cas non prévus** : *l'éditorial respire, le
transactionnel se densifie — mais les deux partagent les mêmes rayons, la même
police et la même palette.*
