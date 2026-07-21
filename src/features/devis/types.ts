/**
 * TYPES DU DEVIS
 *
 * UN SEUL TYPE DE LIGNE POUR TOUT LE CATALOGUE
 *
 * Produits, prestations, abonnements et véhicules n'ont rien en commun dans
 * leurs modules d'origine. S'ils gardaient chacun leur forme jusque dans le
 * document, il faudrait un composant d'affichage par famille, un calcul de
 * total par famille, un export par famille. C'est exactement le monolithe
 * qu'on veut éviter.
 *
 * Ils se convertissent donc tous en `LigneDevis` à l'entrée, une fois pour
 * toutes, dans `catalogue.ts`. Le reste du parcours ne connaît que ce type.
 * Ajouter une famille demande un adaptateur, jamais un composant.
 *
 * Tous les montants sont des ENTIERS en XAF. Aucun flottant ne représente de
 * l'argent : les arrondis binaires sur des sommes produisent des écarts qui
 * finissent en litige commercial.
 */

export type SourceLigne =
  | "produit"
  | "prestation"
  | "abonnement"
  | "vehicule"
  | "libre";

/** Options retenues sur une ligne (processeur, RAM, garantie…). Tranche 2. */
export type OptionRetenue = {
  readonly id: string;
  readonly label: string;
  /** Surcoût unitaire en XAF. Peut être négatif (configuration allégée). */
  readonly surcoutXaf: number;
};

export type LigneDevis = {
  /** Identité de la ligne dans CE devis. Deux fois le même produit avec des
   *  options différentes sont deux lignes distinctes. */
  readonly id: string;
  readonly source: SourceLigne;
  /** Slug d'origine, ou chaîne vide pour un article libre. */
  readonly reference: string;
  readonly designation: string;
  readonly detail?: string;
  readonly marque?: string;
  readonly image?: string;
  /** Famille du catalogue unifié. Sert à retrouver les options applicables :
   *  sans elle, il faudrait réinterroger le catalogue à chaque affichage. */
  readonly famille: string;
  quantite: number;
  /** Prix catalogue, hors options. */
  prixUnitaireXaf: number;
  options: OptionRetenue[];
  /** Remise sur cette ligne uniquement, en pourcentage entier. */
  remisePct: number;
};

export type ClientDevis = {
  type: "particulier" | "entreprise";
  /** Entreprise : raison sociale. Particulier : nom de famille. */
  nom: string;
  /** Particulier seulement. */
  prenom: string;
  /** Entreprise seulement : personne à contacter. */
  contact: string;
  telephone: string;
  email: string;
  adresse: string;
  /** Entreprise seulement, facultatif. */
  niu: string;
};

export type Devis = {
  reference: string;
  /** Date d'émission au format ISO (AAAA-MM-JJ). */
  emisLe: string;
  /**
   * Durée de validité. Un devis sans échéance engage l'entreprise sur un prix
   * indéfiniment, ce qui est intenable quand la grille tarifaire bouge.
   */
  valableJours: number;
  client: ClientDevis;
  lignes: LigneDevis[];
  /** Remise commerciale sur le total, en pourcentage entier. */
  remiseGlobalePct: number;
  /** Acompte demandé à la commande, en pourcentage entier. 0 = aucun. */
  acomptePct: number;
  /** Mot libre imprimé sous le tableau. */
  notes: string;
};

/* ══════════════════════════ CALCUL ══════════════════════════ */

export type TotauxDevis = {
  readonly sousTotalXaf: number;
  readonly remiseLignesXaf: number;
  readonly remiseGlobaleXaf: number;
  readonly totalXaf: number;
  readonly acompteXaf: number;
  readonly soldeXaf: number;
  readonly nombreArticles: number;
};

/** Prix unitaire options comprises. */
export function prixUnitaire(ligne: LigneDevis): number {
  const options = ligne.options.reduce((s, o) => s + o.surcoutXaf, 0);
  return Math.max(0, ligne.prixUnitaireXaf + options);
}

/** Montant de la ligne, remise de ligne déduite. */
export function montantLigne(ligne: LigneDevis): number {
  const brut = prixUnitaire(ligne) * ligne.quantite;
  // `round` et non `floor` : sur une remise de 33 %, tronquer ferait perdre
  // systématiquement un franc au client, ce qui se voit sur les gros volumes.
  return Math.max(0, brut - Math.round((brut * ligne.remisePct) / 100));
}

export function calculerTotaux(devis: Devis): TotauxDevis {
  const sousTotal = devis.lignes.reduce(
    (s, l) => s + prixUnitaire(l) * l.quantite,
    0,
  );
  const apresLignes = devis.lignes.reduce((s, l) => s + montantLigne(l), 0);
  const remiseLignes = sousTotal - apresLignes;

  const remiseGlobale = Math.round(
    (apresLignes * devis.remiseGlobalePct) / 100,
  );
  const total = Math.max(0, apresLignes - remiseGlobale);
  const acompte = Math.round((total * devis.acomptePct) / 100);

  return {
    sousTotalXaf: sousTotal,
    remiseLignesXaf: remiseLignes,
    remiseGlobaleXaf: remiseGlobale,
    totalXaf: total,
    acompteXaf: acompte,
    soldeXaf: total - acompte,
    nombreArticles: devis.lignes.reduce((s, l) => s + l.quantite, 0),
  };
}

/**
 * Analyse une date ISO (AAAA-MM-JJ) en tolérant l'absence de valeur.
 *
 * La référence et la date d'émission ne sont posées qu'après le montage
 * client : elles dépendent de l'heure courante, qui diffère entre le serveur
 * et le navigateur. Le document se rend donc UNE FOIS avec `emisLe` vide.
 *
 * `new Date("T00:00:00")` produit alors une date invalide, et `Intl.format`
 * lève une RangeError qui fait tomber la page entière. Un formatage doit
 * échouer en silence et rendre un tiret, jamais casser l'affichage.
 */
function analyserDate(iso: string): Date | null {
  if (!iso) return null;

  const parties = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!parties) return null;

  const annee = Number(parties[1]);
  const mois = Number(parties[2]);
  const jour = Number(parties[3]);

  // TOUT EN UTC, JAMAIS EN HEURE LOCALE.
  //
  // `new Date("2026-07-21T00:00:00")` est interprété en heure locale. Un
  // `toISOString()` derrière reconvertit en UTC et RECULE la date d'un jour
  // pour tout fuseau à l'est de Greenwich. L'échéance d'un devis se retrouvait
  // ainsi fausse d'une journée, sur un document qui engage l'entreprise.
  const d = new Date(Date.UTC(annee, mois - 1, jour));

  // Contrôle d'aller-retour : JavaScript accepte le 30 février et le décale
  // silencieusement au 2 mars. Une date impossible doit être refusée, pas
  // déplacée dans le dos de celui qui l'a saisie.
  if (
    d.getUTCFullYear() !== annee ||
    d.getUTCMonth() !== mois - 1 ||
    d.getUTCDate() !== jour
  ) {
    return null;
  }

  return d;
}

/** Date d'échéance, dérivée de l'émission et de la durée de validité. */
export function dateEcheance(devis: Devis): string {
  const emission = analyserDate(devis.emisLe);
  if (!emission) return "";
  emission.setUTCDate(emission.getUTCDate() + devis.valableJours);
  return emission.toISOString().slice(0, 10);
}

/** Marque d'une valeur pas encore connue. */
export const DATE_ABSENTE = "—";

/**
 * Date du jour au format AAAA-MM-JJ, dans le fuseau de celui qui l'émet.
 *
 * `toISOString()` donnerait la date UTC : passé minuit à Bangui ou à
 * Casablanca, le devis porterait la date de la veille. On lit donc les
 * composantes locales, pas l'horodatage universel.
 */
export function dateDuJour(maintenant: Date): string {
  const annee = maintenant.getFullYear();
  const mois = String(maintenant.getMonth() + 1).padStart(2, "0");
  const jour = String(maintenant.getDate()).padStart(2, "0");
  return `${annee}-${mois}-${jour}`;
}

export function formaterDate(iso: string): string {
  const d = analyserDate(iso);
  if (!d) return DATE_ABSENTE;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    // Sans ce fuseau, une date construite en UTC s'afficherait décalée d'un
    // jour selon l'endroit d'où le devis est ouvert.
    timeZone: "UTC",
  }).format(d);
}

/* ══════════════════════════ FABRIQUES ══════════════════════════ */

export function clientVide(): ClientDevis {
  return {
    type: "particulier",
    nom: "",
    prenom: "",
    contact: "",
    telephone: "",
    email: "",
    adresse: "",
    niu: "",
  };
}

/**
 * Le libellé du client tel qu'il s'imprime. Une entreprise se désigne par sa
 * raison sociale, un particulier par prénom puis nom : l'ordre inverse ferait
 * administratif là où le document doit rester lisible.
 */
export function nomClient(client: ClientDevis): string {
  if (client.type === "entreprise") return client.nom.trim();
  return [client.prenom.trim(), client.nom.trim()].filter(Boolean).join(" ");
}
