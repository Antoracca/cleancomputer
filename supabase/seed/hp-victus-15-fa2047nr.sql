insert into public.categories (id, slug, name)
values ('b5a1d7e4-4c20-4a5c-8a8c-015fa2047a01', 'ordinateurs-portables', 'Ordinateurs portables')
on conflict (slug) do nothing;

insert into public.fiches_produits (slug, manufacturer, ref, category, range, title, summary, fiche, images, sources, verified)
values (
  'hp-victus-15-fa2047nr', 'HP', 'B8BH1UA#ABA', 'ordinateurs-portables', 'Milieu de gamme — gaming performant',
  'Victus Gaming Laptop 15-fa2047nr',
  'Portable gaming équilibré : Core i5-13420H, RTX 4050 6 Go, 16 Go de mémoire et SSD 1 To.',
  $$ {"couleur":"Mica silver, logo noir chromé","marche":"États-Unis — Windows 11 Home","statut_commercial":"Fiche vérifiée ; prix et stock local à définir avant publication","points_cles":["Intel Core i5-13420H : 8 cœurs, 12 threads, jusqu’à 4,6 GHz","NVIDIA GeForce RTX 4050 Laptop GPU avec 6 Go GDDR6","16 Go DDR5-5200 et SSD PCIe NVMe de 1 To","Écran IPS Full HD 15,6 pouces à 144 Hz, antireflet, 300 nits","Wi‑Fi 6E, Ethernet Gigabit, HDMI 2.1, USB-C DisplayPort et clavier rétroéclairé avec pavé numérique"],"specifications":{"processeur":{"modele":"Intel Core i5-13420H","coeurs":8,"threads":12,"frequence_turbo_max":"4,6 GHz","cache":"12 Mo L3"},"memoire":{"capacite":"16 Go (2 × 8 Go)","type":"DDR5","vitesse":"5200 MT/s"},"stockage":{"capacite":"1 To","type":"SSD PCIe NVMe"},"graphismes":{"integre":"Intel UHD Graphics","dedie":"NVIDIA GeForce RTX 4050 Laptop GPU","memoire_video":"6 Go GDDR6"},"ecran":{"taille":"15,6 pouces","dalle":"IPS, micro-bords, antireflet","definition":"1920 × 1080 px (Full HD)","frequence":"144 Hz","luminosite":"300 nits","gamut":"62,5 % sRGB"},"batterie_et_alimentation":{"batterie":"70 Wh, 4 cellules, lithium-polymère","charge_rapide":"environ 50 % en 30 minutes","adaptateur_inclus":"120 W"},"dimensions_et_poids":{"largeur":"35,79 cm","profondeur":"25,50 cm","hauteur":"2,36 cm","poids":"2,30 kg"},"systeme_et_securite":{"systeme":"Windows 11 Home","garantie":"Garantie matérielle limitée d’un an"}}} $$::jsonb,
  array['/media/produits/hp-victus-15-fa2047nr/01-hero.jpg','/media/produits/hp-victus-15-fa2047nr/02-avant-gauche.jpg','/media/produits/hp-victus-15-fa2047nr/03-avant-droit.jpg','/media/produits/hp-victus-15-fa2047nr/04-arriere-gauche.jpg','/media/produits/hp-victus-15-fa2047nr/05-detail-clavier.jpg'],
  $$ [{"nom":"HP — fiche produit officielle","url":"https://www.hp.com/us-en/shop/pdp/victus-gaming-laptop-15-fa2047nr"},{"nom":"HyperX / HP — fiche et galerie officielle","url":"https://hyperx.com/products/victus-gaming-laptop-15-fa2047nr"}] $$::jsonb,
  date '2026-07-20'
)
on conflict (slug) do update set manufacturer = excluded.manufacturer, ref = excluded.ref, category = excluded.category, range = excluded.range, title = excluded.title, summary = excluded.summary, fiche = excluded.fiche, images = excluded.images, sources = excluded.sources, verified = excluded.verified, updated_at = now();
