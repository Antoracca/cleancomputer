# INVENTAIRE MEDIA — identification et plan de renommage

Source : `media/` — 55 fichiers bruts.
Analyse : déduplication par empreinte MD5 + identification visuelle de chaque
fichier unique + extraction de frames vidéo (ffmpeg) pour identification.

## Synthèse

| | Fichiers bruts | Uniques (MD5) | Réellement distincts visuellement |
|---|---|---|---|
| Images | 34 (dont logo) | 21 | 21 |
| Vidéos | 21 | 21 | **12** |
| **Total** | **55** | **42** | **33** |

**14 images sont des doublons exacts** et **9 vidéos sont des variantes
ré-encodées du même plan**. Le dossier utile est nettement plus petit
qu'il n'y paraît.

---

## 1. Logo

| Fichier | Contenu | Destination |
|---|---|---|
| `logo.jpeg` | Logo CLEAN COMPUTER / IT SOLUTION — bleu sur blanc, 500×500 JPEG | `public/brand/` |

**Couleur extraite** (échantillonnage des pixels bleus saturés) : **`#0148B2`**
Valeurs voisines relevées : `#034CAA`, `#0049B0`, `#0347B2` → moyenne cohérente,
le bleu de marque est stable.

**Action requise** : le logo est fourni en **JPEG sur fond blanc opaque**. C'est
inutilisable proprement sur un fond non-blanc (liseré blanc visible autour).
- V1 : détourage du fond blanc → export **SVG vectoriel** (tracé du pictogramme + typographie)
- Livrables attendus : `logo-full.svg`, `logo-mark.svg` (pictogramme seul, pour favicon/PWA/nav mobile), `logo-inverse.svg` (version blanche pour footer sombre)
- **À demander au client** : le fichier source vectoriel (.ai / .svg / .eps) s'il existe. Sinon, revectorisation manuelle.

---

## 2. Images produits — 20 visuels uniques

Tous sont des **photos réelles prises en boutique** (étagères bois clair, TV murale,
lampe d'ambiance, sol marbré) ou des packshots fournisseurs. Excellente matière :
authentiques, cohérentes entre elles, et elles prouvent que le stock existe.

| # | Nom cible | Sujet identifié | Usage prévu |
|---|---|---|---|
| 01 | `audio-casque-soundcore-space-one.jpg` | Casque ANC Soundcore Space One (boîte en main) | Catalogue audio |
| 02 | `audio-ecouteurs-soundcore-p30i.jpg` | Écouteurs Soundcore P30i ANC | Catalogue audio |
| 03 | `audio-ecouteurs-airpods-pro-2.jpg` | Apple AirPods Pro 2 | Catalogue audio |
| 04 | `charge-alimentation-starlink-packshot.jpg` | Alimentation Starlink Gen3/Mini — packshot studio fond blanc | Fiche produit réseau |
| 05 | `charge-alimentation-starlink-boite.jpg` | Boîte « For Starlink Gen3 & Mini Power Supply » | Catalogue réseau |
| 06 | `charge-ugreen-65w-gan.jpg` | Chargeur UGREEN 65W GaN 3 ports | Catalogue charge |
| 07 | `charge-ugreen-100w-5ports.jpg` | Kit chargeur UGREEN 100W 5 ports | Catalogue charge |
| 08 | `charge-ugreen-powerbank-20000mah.jpg` | Batterie externe UGREEN 20000mAh 45W | Catalogue charge |
| 09 | `charge-anker-gan-multiport.jpg` | Chargeur Anker GaN multiport (en main, hors boîte) | Catalogue charge |
| 10 | `reseau-starlink-kit-deballe.jpg` | Kit Starlink complet déballé (antenne + support + alim) | **Hero pilier Réseau / Import** |
| 11 | `reseau-tenda-wifi6-a23.jpg` | Répéteur Wi-Fi 6 Tenda A23 | Catalogue réseau |
| 12 | `peripherique-logitech-mx-keys-mini.jpg` | Clavier Logitech MX Keys Mini | Catalogue périphériques |
| 13 | `peripherique-logitech-mx-master-3s.jpg` | Souris Logitech MX Master 3S Bluetooth | Catalogue périphériques |
| 14 | `logiciel-windows-11-pro.jpg` | Licences Windows 11 Pro (lot de boîtes scellées) | **Pilier Services informatiques** |
| 15 | `logiciel-office-pro-plus-2024.jpg` | Microsoft Office Professional Plus 2024 | **Pilier Services informatiques** |
| 16 | `gaming-manette-sony-dualsense.jpg` | Manette Sony DualSense PS5 (rouge cosmique) | Catalogue gaming |
| 17 | `gaming-manette-gamesir-console.jpg` | Manette GameSir + console portable (EA FC 26 à l'écran) | Catalogue gaming |
| 18 | `tablette-nextbook-ares-8a.jpg` | Tablette Android Nextbook Ares 8A 8" | Catalogue tablettes |
| 19 | `tablette-android-en-main.jpg` | Tablette Android allumée, tenue en main (intérieur boutique) | **Preuve sociale / ambiance boutique** |
| 20 | `ambiance-lampe-led-rgb.jpg` | Lampe LED RGB d'ambiance allumée (plan sombre) | Catalogue maison connectée / ambiance |

### Doublons à supprimer (14 fichiers)
Chaque groupe partage une empreinte MD5 identique — un seul exemplaire est conservé.

| Empreinte | Fichiers redondants |
|---|---|
| `6e73715933` | `12.25.38.jpeg` · `12.25.40 (1)` · `12.25.41 (10)` |
| `edff741bf3` | `12.25.38 (1)` · `12.25.40` · `12.25.41 (11)` |
| `5231e181b6` | `12.25.40 (8)` · `12.25.41 (4)` |
| `6109db6a05` | `12.25.40 (7)` · `12.25.41 (5)` |
| `76541c2d59` | `12.25.40 (5)` · `12.25.41 (7)` |
| `89d705314c` | `12.25.40 (10)` · `12.25.41 (3)` |
| `8c1000424e` | `12.25.40 (13)` · `12.25.41 (1)` |
| `8e8eb75329` | `12.25.40 (4)` · `12.25.41 (8)` |
| `9d1d94fa0b` | `12.25.40 (6)` · `12.25.41 (6)` |
| `b1a5a192dc` | `12.25.40 (11)` · `12.25.41 (2)` |
| `d1129a8f62` | `12.25.40 (3)` · `12.25.41 (9)` |

### Traitement technique prévu
- Source conservée intacte dans `media/` (jamais modifiée)
- Copie renommée dans `public/media/produits/`
- Recadrage **1:1** pour les portraits circulaires du design system
- Conversion **AVIF + WebP** multi-tailles (`320 / 640 / 960 / 1280`) via `next/image`
- Placeholder flou (`blurDataURL`) généré à la construction

---

## 3. Vidéos — 12 plans réellement distincts sur 21 fichiers

Résolution : `576×1024` (vertical 9:16) sauf 3 fichiers en `1024×576` (horizontal 16:9).
Durées : 16 s à 108 s.

| # | Fichier source | Durée | Format | Contenu identifié |
|---|---|---|---|---|
| A | `12.25.43 (1).mp4` | 43 s | **16:9** | Gros plan cinématographique tranche d'ordinateur portable, ports + logo Intel |
| B | `12.25.43 (5).mp4` *(dbl : (10))* | 39 s | **16:9** | Caméra IP de surveillance sur meuble, arrière-plan flou chaleureux |
| C | `12.25.43 (3).mp4` *(dbl : (12))* | 48 s | 9:16 | Chargeur UGREEN 100W branché, ambiance sombre, écran LED visible |
| D | `12.25.43 (17).mp4` | 20 s | 9:16 | Batterie externe UGREEN posée sur table en bois, lumière naturelle |
| E | `12.25.41 (1).mp4` *(dbl : (2))* | 44 s | 9:16 | Notice Anker feuilletée en main |
| F | `12.25.43 (2).mp4` | 34 s | 9:16 | Déballage boîte produit sur table, ordinateur portable en fond |
| G | `12.25.43 (4).mp4` *(dbl : (11), (16))* | 34 s | 9:16 | Packaging écouteurs ANC « Strong Targeted Noise Cancelling » |
| H | `12.25.43 (6).mp4` *(dbl : (9))* | 16 s | 9:16 | AirPods tenus en main devant un mur décoré |
| I | `12.25.43 (7).mp4` *(dbl : (8))* | 27 s | 9:16 | Notice Soundcore, fond écran RGB vert |
| J | `12.25.43 (13).mp4` | 33 s | 9:16 | Déballage boîte MIIIW sur table claire |
| K | `12.25.43 (14).mp4` | 34 s | 9:16 | Écouteurs open-ear, packaging orange |
| L | `12.25.43 (15).mp4` | 34 s | 9:16 | Dongle USB GameSir, écran « COMPATIBLE », ambiance néon |
| — | `12.25.41.mp4` *(dbl : `12.25.43.mp4`)* | 108 s | 9:16 | **Présentateur face caméra** tenant des écouteurs — personne identifiable |

### ⚠️ Problème de droits — à trancher avant intégration

Ces vidéos ne sont pas des captations Clean Computer. Ce sont des **contenus
promotionnels de marques tierces** (Anker, UGREEN, Soundcore, GameSir) ou des
vidéos de créateurs. Deux d'entre elles montrent une **personne identifiable**
qui n'a pas donné son accord pour figurer sur ce site.

**Recommandation :**
- ❌ **Écarter** le plan présentateur (`12.25.41.mp4` / `12.25.43.mp4`) — droit à l'image
- ⚠️ Les plans produits de marque sont utilisables **en fiche produit** (illustration d'un
  article réellement vendu), mais **pas en hero de marque** sans autorisation écrite
- ✅ **Idéal** : tourner 2 ou 3 plans maison de 10–15 s dans la boutique (rayonnages,
  manipulation produit, comptoir) — plus authentique, zéro risque juridique, et
  cela renforce le storytelling local bien mieux qu'un B-roll générique de marque

### Sélection technique pour le hero (sous réserve d'autorisation)
Le hero exige du **16:9** — seuls trois fichiers le sont, et deux sont identiques :

| Rang | Plan | Pourquoi |
|---|---|---|
| 1 | **A** — tranche d'ordinateur portable | 16:9 natif, cadrage serré, mouvement lent, lisible en fond derrière du texte |
| 2 | **B** — caméra IP | 16:9 natif, faible profondeur de champ, tons chauds |
| 3 | **C** — chargeur UGREEN | Vertical mais plan sombre → bon recadrage possible, contraste idéal pour du texte blanc |

### Traitement technique prévu
- Découpe à **8–12 s** en boucle sans raccord visible
- **Sans audio** (piste supprimée — le hero est muet par principe)
- Double encodage **WebM/VP9** + **MP4/H.264**, cible **< 2 Mo** par fichier
- Poster JPEG/AVIF extrait de la première frame → affiché immédiatement, la vidéo
  se substitue une fois chargée
- Vidéo **désactivée** si `prefers-reduced-motion`, `Save-Data`, ou connexion `2g`/`slow-2g`
  détectée via `navigator.connection` → le poster reste seul
