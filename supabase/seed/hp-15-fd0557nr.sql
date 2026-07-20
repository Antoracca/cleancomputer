-- Fiche de référence sans prix de vente : définissez le prix et le stock locaux
-- avant de créer une entrée publique dans `produits`.
-- À exécuter après `supabase/schema.sql`.

insert into public.categories (slug, nom, description, ordre)
values (
  'ordinateurs',
  'Ordinateurs',
  'Portables professionnels, MacBook et postes de travail.',
  2
)
on conflict (slug) do nothing;

insert into public.fiches_produits (
  slug,
  fabricant,
  reference_fabricant,
  categorie_slug,
  gamme,
  titre,
  resume,
  fiche,
  images,
  sources,
  verifie_le
)
values (
  'hp-15-fd0557nr',
  'HP',
  'BM7B8UA#ABA',
  'ordinateurs',
  'Milieu de gamme — usage quotidien',
  'HP Laptop 15-fd0557nr',
  'Portable 15,6 pouces pour bureautique, études, visioconférence et navigation, avec Core i7, 12 Go de RAM et SSD NVMe de 512 Go.',
  $$
  {
    "couleur": "Natural silver (argent naturel)",
    "marche": "États-Unis — clavier QWERTY US, Windows 11 Home en anglais",
    "processeur": { "modele": "Intel Core i7-1255U (12e génération)", "coeurs": 10, "threads": 12, "frequence_turbo_max": "4,7 GHz", "cache": "12 Mo L3" },
    "memoire": { "capacite": "12 Go (1 × 8 Go + 1 × 4 Go)", "type": "DDR4 SDRAM, SO-DIMM 260 broches", "vitesse": "3200 MT/s", "emplacements": 2, "emplacements_libres": 0 },
    "stockage": { "capacite": "512 Go", "type": "SSD M.2 PCIe NVMe" },
    "graphismes": { "modele": "Intel Iris Xe Graphics", "type": "Intégrée" },
    "ecran": { "taille": "15,6 pouces (39,6 cm)", "dalle": "IPS LED, micro-bords, antireflet", "definition": "1920 × 1080 px (Full HD), 16:9", "luminosite": "300 cd/m²", "gamut": "62,5 % sRGB" },
    "connectivite": { "wifi": "Wi‑Fi 6 (802.11ax), double flux 2 × 2, contrôleur Realtek", "bluetooth": "5.3", "ports": ["1 × USB-C 3.2 Gen 1 (données uniquement)", "2 × USB-A 3.2 Gen 1", "1 × HDMI", "1 × prise casque/microphone combinée"] },
    "camera_et_audio": { "camera": "HP TrueVision HD 720p, obturateur de confidentialité, réduction temporelle du bruit", "audio": "Deux haut-parleurs et deux microphones" },
    "clavier_et_pave_tactile": { "clavier": "Taille standard, disposition US, pavé numérique", "pave_tactile": "Precision touchpad / Imagepad" },
    "batterie_et_alimentation": { "batterie": "41 Wh, 3 cellules, lithium-polymère", "autonomie_video_annoncee": "jusqu’à 9,5 heures", "autonomie_usage_typique_annoncee": "jusqu’à 6,5 heures", "charge_rapide": "HP Fast Charge", "adaptateur_inclus": "45 W HP Smart AC Adapter" },
    "dimensions_et_poids": { "largeur": "35,98 cm", "profondeur": "23,6 cm", "hauteur": "1,86 cm", "poids": "1,59 kg" },
    "systeme_et_securite": { "systeme": "Windows 11 Home, anglais", "securite": "TPM pris en charge", "standards": ["ENERGY STAR", "EPEAT Gold", "testé MIL-STD-810H"] }
  }
  $$::jsonb,
  array[
    '/media/produits/hp-15-fd0557nr/01-hero.jpg',
    '/media/produits/hp-15-fd0557nr/02-angle.jpg',
    '/media/produits/hp-15-fd0557nr/03-face.jpg',
    '/media/produits/hp-15-fd0557nr/04-clavier.jpg',
    '/media/produits/hp-15-fd0557nr/05-profil.jpg'
  ],
  $$[
    {"nom":"HP — support produit","url":"https://support.hp.com/fr-fr/drivers/hp-15.6-inch-laptop-pc-15-fd0000/model/2101497706?sku=7G0E6UA","usage":"Identification de la famille HP 15-fd0000"},
    {"nom":"SHI — fiche de la référence BM7B8UA#ABA","url":"https://www.shi.com/product/50060690/HP-Laptop-15-fd0557nr","usage":"Caractéristiques de la configuration exacte et galerie fabricant"}
  ]$$::jsonb,
  date '2026-07-20'
)
on conflict (slug) do update set
  fabricant = excluded.fabricant,
  reference_fabricant = excluded.reference_fabricant,
  categorie_slug = excluded.categorie_slug,
  gamme = excluded.gamme,
  titre = excluded.titre,
  resume = excluded.resume,
  fiche = excluded.fiche,
  images = excluded.images,
  sources = excluded.sources,
  verifie_le = excluded.verifie_le,
  updated_at = now();
