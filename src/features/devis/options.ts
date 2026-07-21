/**
 * OPTIONS PAR FAMILLE
 *
 * ENTIÈREMENT DÉCLARATIF
 *
 * Le client demandait « des options pour presque tous les produits ». Écrites
 * en composants, cela ferait un fichier par famille et une explosion de code
 * qui se répète. Écrites ici en données, un seul composant les affiche toutes.
 *
 * Ajouter la garantie sur une famille = ajouter trois lignes dans ce tableau.
 * Aucune interface à toucher, aucun calcul à modifier.
 *
 * LES SURCOÛTS SONT DES ÉCARTS, PAS DES PRIX
 *
 * Une option ne remplace jamais le prix catalogue, elle s'y ajoute. Un
 * surcoût peut être négatif : une configuration allégée coûte moins cher que
 * le modèle de référence. Le prix ne descend jamais sous zéro, `prixUnitaire`
 * s'en charge.
 *
 * ⚠️ SURCOÛTS PROVISOIRES — TODO_TARIFS. Ordres de grandeur cohérents entre
 * eux, à remplacer par la grille réelle.
 */

import type { OptionRetenue, SourceLigne } from "@/features/devis/types";

export type OptionDisponible = {
  readonly id: string;
  readonly label: string;
  readonly surcoutXaf: number;
  readonly detail?: string;
};

export type GroupeOptions = {
  readonly id: string;
  readonly label: string;
  /** `unique` : un seul choix, remplace le précédent du même groupe.
   *  `multiple` : cases à cocher, cumulables. */
  readonly mode: "unique" | "multiple";
  readonly options: readonly OptionDisponible[];
};

/* ══════════════════════ GROUPES RÉUTILISABLES ══════════════════════ */

const GARANTIE: GroupeOptions = {
  id: "garantie",
  label: "Garantie",
  mode: "unique",
  options: [
    { id: "garantie-3", label: "3 mois (incluse)", surcoutXaf: 0 },
    { id: "garantie-6", label: "6 mois", surcoutXaf: 15000 },
    { id: "garantie-12", label: "12 mois", surcoutXaf: 35000 },
  ],
};

const ETAT: GroupeOptions = {
  id: "etat",
  label: "État",
  mode: "unique",
  options: [
    { id: "etat-neuf", label: "Neuf sous scellé", surcoutXaf: 0 },
    {
      id: "etat-occasion",
      label: "Occasion contrôlée",
      surcoutXaf: -60000,
      detail: "Testé et garanti, remise appliquée",
    },
  ],
};

const INSTALLATION: GroupeOptions = {
  id: "installation",
  label: "Mise en service",
  mode: "multiple",
  options: [
    {
      id: "install-config",
      label: "Configuration complète",
      surcoutXaf: 15000,
      detail: "Système, comptes, logiciels courants",
    },
    {
      id: "install-transfert",
      label: "Transfert de données",
      surcoutXaf: 20000,
      detail: "Depuis l'ancien appareil",
    },
    { id: "install-domicile", label: "Livraison à domicile", surcoutXaf: 5000 },
  ],
};

const URGENCE: GroupeOptions = {
  id: "urgence",
  label: "Délai",
  mode: "unique",
  options: [
    { id: "delai-normal", label: "Délai normal", surcoutXaf: 0 },
    {
      id: "delai-prioritaire",
      label: "Prioritaire",
      surcoutXaf: 25000,
      detail: "Traité avant la file courante",
    },
    {
      id: "delai-urgent",
      label: "Urgence 24 h",
      surcoutXaf: 60000,
      detail: "Intervention le jour même ou le lendemain",
    },
  ],
};

/* ══════════════════════ GROUPES SPÉCIFIQUES ══════════════════════ */

const PROCESSEUR: GroupeOptions = {
  id: "processeur",
  label: "Processeur",
  mode: "unique",
  options: [
    { id: "cpu-i3", label: "Core i3 ou Ryzen 3", surcoutXaf: -120000 },
    { id: "cpu-i5", label: "Core i5 ou Ryzen 5", surcoutXaf: 0 },
    { id: "cpu-i7", label: "Core i7 ou Ryzen 7", surcoutXaf: 180000 },
    { id: "cpu-i9", label: "Core i9 ou Ryzen 9", surcoutXaf: 420000 },
  ],
};

const MEMOIRE: GroupeOptions = {
  id: "memoire",
  label: "Mémoire vive",
  mode: "unique",
  options: [
    { id: "ram-8", label: "8 Go", surcoutXaf: 0 },
    { id: "ram-16", label: "16 Go", surcoutXaf: 55000 },
    { id: "ram-32", label: "32 Go", surcoutXaf: 145000 },
    { id: "ram-64", label: "64 Go", surcoutXaf: 320000 },
  ],
};

const STOCKAGE_PC: GroupeOptions = {
  id: "stockage",
  label: "Stockage interne",
  mode: "unique",
  options: [
    { id: "ssd-256", label: "SSD 256 Go", surcoutXaf: 0 },
    { id: "ssd-512", label: "SSD 512 Go", surcoutXaf: 45000 },
    { id: "ssd-1000", label: "SSD 1 To", surcoutXaf: 110000 },
    { id: "ssd-2000", label: "SSD 2 To", surcoutXaf: 245000 },
  ],
};

const STOCKAGE_MOBILE: GroupeOptions = {
  id: "stockage-mobile",
  label: "Capacité",
  mode: "unique",
  options: [
    { id: "tel-128", label: "128 Go", surcoutXaf: 0 },
    { id: "tel-256", label: "256 Go", surcoutXaf: 60000 },
    { id: "tel-512", label: "512 Go", surcoutXaf: 150000 },
  ],
};

const IMPORT_VEHICULE: GroupeOptions = {
  id: "import",
  label: "Acheminement",
  mode: "multiple",
  options: [
    {
      id: "import-fret",
      label: "Fret maritime jusqu'à Douala",
      surcoutXaf: 1850000,
    },
    {
      id: "import-dedouanement",
      label: "Dédouanement et mise à la route",
      surcoutXaf: 2400000,
      detail: "Droits et formalités pris en charge",
    },
    {
      id: "import-convoyage",
      label: "Convoyage Douala vers Bangui",
      surcoutXaf: 950000,
    },
  ],
};

const HEBERGEMENT: GroupeOptions = {
  id: "hebergement",
  label: "Hébergement et domaine",
  mode: "unique",
  options: [
    { id: "heb-aucun", label: "Le client s'en occupe", surcoutXaf: 0 },
    { id: "heb-1an", label: "Pris en charge, 1 an", surcoutXaf: 85000 },
    { id: "heb-3ans", label: "Pris en charge, 3 ans", surcoutXaf: 220000 },
  ],
};

/* ══════════════════════ AFFECTATION ══════════════════════ */

/**
 * Quelles options s'appliquent à quoi.
 *
 * La clé est le nom de famille tel que le produit l'expose dans le catalogue
 * unifié. Une famille absente de ce tableau n'a simplement pas d'options : ce
 * n'est pas une erreur, la plupart des câbles n'en ont pas besoin.
 */
const PAR_FAMILLE: Record<string, readonly GroupeOptions[]> = {
  Ordinateurs: [PROCESSEUR, MEMOIRE, STOCKAGE_PC, ETAT, GARANTIE, INSTALLATION],
  Téléphones: [STOCKAGE_MOBILE, ETAT, GARANTIE, INSTALLATION],
  Tablettes: [STOCKAGE_MOBILE, ETAT, GARANTIE],
  "Composants PC": [GARANTIE, INSTALLATION],
  "Composants électroniques": [GARANTIE],
  "Écrans & moniteurs": [GARANTIE, INSTALLATION],
  Téléviseurs: [GARANTIE, INSTALLATION],
  "Stockage & disques": [GARANTIE],
  "Réseau & Wi-Fi": [GARANTIE, INSTALLATION],
  Audio: [GARANTIE],
  Gaming: [GARANTIE],
  "Photo & vidéo": [GARANTIE],
  "Charge & batteries": [GARANTIE],
  Périphériques: [GARANTIE],
  "Véhicules & motos": [IMPORT_VEHICULE],
};

/** Familles de prestations : le délai compte plus que la garantie. */
const PAR_SOURCE: Partial<Record<SourceLigne, readonly GroupeOptions[]>> = {
  prestation: [URGENCE],
};

/** Prestations de développement : elles seules ont un hébergement. */
const PRESTATIONS_WEB = new Set([
  "developpement/site-vitrine",
  "developpement/site-ecommerce",
  "developpement/application-mobile",
]);

export function groupesPour(
  source: SourceLigne,
  famille: string,
  reference: string,
): readonly GroupeOptions[] {
  const groupes: GroupeOptions[] = [];

  const parFamille = PAR_FAMILLE[famille];
  if (parFamille) groupes.push(...parFamille);

  const parSource = PAR_SOURCE[source];
  if (parSource) groupes.push(...parSource);

  if (PRESTATIONS_WEB.has(reference)) groupes.push(HEBERGEMENT);

  return groupes;
}

/**
 * Applique un choix aux options déjà retenues.
 *
 * Un groupe `unique` remplace : choisir 16 Go après 8 Go ne doit pas cumuler
 * les deux surcoûts, ce qui gonflerait le devis d'un montant que personne ne
 * comprendrait en le relisant.
 */
export function appliquerOption(
  retenues: readonly OptionRetenue[],
  groupe: GroupeOptions,
  option: OptionDisponible,
): OptionRetenue[] {
  const idsDuGroupe = new Set(groupe.options.map((o) => o.id));
  const dejaRetenue = retenues.some((r) => r.id === option.id);

  if (groupe.mode === "multiple") {
    return dejaRetenue
      ? retenues.filter((r) => r.id !== option.id)
      : [
          ...retenues,
          { id: option.id, label: option.label, surcoutXaf: option.surcoutXaf },
        ];
  }

  // Unique : on retire tout ce qui appartient au groupe, puis on pose le
  // nouveau choix. Recliquer sur l'option active la retire.
  const sansLeGroupe = retenues.filter((r) => !idsDuGroupe.has(r.id));
  if (dejaRetenue) return sansLeGroupe;

  return [
    ...sansLeGroupe,
    { id: option.id, label: option.label, surcoutXaf: option.surcoutXaf },
  ];
}
