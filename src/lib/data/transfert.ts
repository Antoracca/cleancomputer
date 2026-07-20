/**
 * TRANSFERT D'ARGENT
 *
 * Taux, corridors, opérateurs et barème de frais.
 *
 * ⚠️ CADRE RÉGLEMENTAIRE : le transfert de fonds est une activité régulée en
 * zone CEMAC (BEAC / COBAC). Afficher les marques MoneyGram et Western Union
 * revient par ailleurs à se déclarer agent agréé de ces réseaux. Ce module
 * calcule et affiche ; il ne présume pas du droit d'exercer.
 * Voir docs/CONTEXTE.md § 7.
 */

/* ══════════════════════ TAUX ══════════════════════ */

/**
 * Taux pivot fournis par le client.
 *
 * Le taux EUR → XAF dérivé vaut 641,11, soit 2,26 % sous la parité fixe
 * officielle de 655,957. L'écart correspond à une marge de change commerciale,
 * il est donc conservé tel quel plutôt que corrigé.
 */
export const TAUX_EUR_MAD = 10.51;
export const TAUX_MAD_XAF = 61;

export type Devise = "XAF" | "MAD" | "EUR" | "USD" | "XOF";

/** Valeur d'une unité de chaque devise, exprimée en XAF. */
const EN_XAF: Record<Devise, number> = {
  XAF: 1,
  MAD: TAUX_MAD_XAF,
  EUR: TAUX_EUR_MAD * TAUX_MAD_XAF,
  // Dérivés d'un EUR/USD de 1,08. À confirmer avec le client.
  USD: (TAUX_EUR_MAD * TAUX_MAD_XAF) / 1.08,
  // Le franc CFA d'Afrique de l'Ouest est à parité avec celui d'Afrique
  // centrale : 1 XOF = 1 XAF.
  XOF: 1,
};

export const DEVISE_LABELS: Record<Devise, string> = {
  XAF: "Franc CFA",
  MAD: "Dirham marocain",
  EUR: "Euro",
  USD: "Dollar américain",
  XOF: "Franc CFA (UEMOA)",
};

/** Nombre de décimales affichées. Les francs CFA n'en ont pas. */
export const DEVISE_DECIMALES: Record<Devise, number> = {
  XAF: 0,
  XOF: 0,
  MAD: 2,
  EUR: 2,
  USD: 2,
};

export function convertir(montant: number, de: Devise, vers: Devise): number {
  if (!Number.isFinite(montant) || montant <= 0) return 0;
  const enXaf = montant * EN_XAF[de];
  return enXaf / EN_XAF[vers];
}

/** Combien vaut une unité de `de` exprimée en `vers`. Sert à l'affichage. */
export function tauxAffiche(de: Devise, vers: Devise): number {
  return EN_XAF[de] / EN_XAF[vers];
}

/* ══════════════════════ PAYS ══════════════════════ */

export type Pays = {
  readonly code: string;
  readonly nom: string;
  readonly devise: Devise;
  readonly indicatif: string;
};

/**
 * La devise n'est jamais choisie séparément : elle découle du pays. Laisser
 * l'utilisateur associer un pays et une devise incohérents produirait des
 * montants faux, ce qui est inacceptable sur un service financier.
 */
export const PAYS: readonly Pays[] = [
  { code: "CF", nom: "République Centrafricaine", devise: "XAF", indicatif: "+236" },
  { code: "MA", nom: "Maroc", devise: "MAD", indicatif: "+212" },
  { code: "FR", nom: "France", devise: "EUR", indicatif: "+33" },
  { code: "BE", nom: "Belgique", devise: "EUR", indicatif: "+32" },
  { code: "CM", nom: "Cameroun", devise: "XAF", indicatif: "+237" },
  { code: "SN", nom: "Sénégal", devise: "XOF", indicatif: "+221" },
  { code: "CI", nom: "Côte d'Ivoire", devise: "XOF", indicatif: "+225" },
  { code: "US", nom: "États-Unis", devise: "USD", indicatif: "+1" },
  { code: "CN", nom: "Chine", devise: "USD", indicatif: "+86" },
] as const;

export function getPays(code: string): Pays | undefined {
  return PAYS.find((p) => p.code === code);
}

/* ══════════════════════ OPÉRATEURS ══════════════════════ */

export type OperateurId = "orange-money" | "moneygram" | "western-union";

export type Operateur = {
  readonly id: OperateurId;
  readonly nom: string;
  readonly logo: string;
  /** Fond du logo. Certains logos sont fournis en noir sur transparent. */
  readonly logoSurBlanc: boolean;
  readonly baseline: string;
  /** Frais opérateur en pourcentage, par sens de corridor. */
  readonly fraisPct: { readonly depuisCF: number; readonly versCF: number };
  readonly delai: string;
  /** `null` signifie tous pays. Sinon liste blanche de codes pays. */
  readonly corridorsAutorises: readonly string[] | null;
  readonly note?: string;
  /** `false` quand le barème n'a pas encore été confirmé par le client. */
  readonly baremeConfirme: boolean;
};

export const OPERATEURS: readonly Operateur[] = [
  {
    id: "orange-money",
    nom: "Orange Money",
    logo: "/LOGO/orangemonney.png",
    logoSurBlanc: true,
    baseline: "Sur le téléphone du bénéficiaire",
    fraisPct: { depuisCF: 10.5, versCF: 5 },
    delai: "Quelques minutes",
    // Seul corridor ouvert : Centrafrique ↔ Maroc, dans les deux sens.
    corridorsAutorises: ["MA"],
    note: "Disponible uniquement entre la Centrafrique et le Maroc.",
    baremeConfirme: true,
  },
  {
    id: "moneygram",
    nom: "MoneyGram",
    logo: "/LOGO/logo-moneygram-black.svg",
    logoSurBlanc: true,
    baseline: "Retrait en espèces ou versement bancaire",
    fraisPct: { depuisCF: 10.2, versCF: 10.2 },
    delai: "Sous 24 h",
    corridorsAutorises: null,
    baremeConfirme: true,
  },
  {
    id: "western-union",
    nom: "Western Union",
    logo: "/LOGO/WESTERN.svg",
    logoSurBlanc: true,
    baseline: "Le réseau le plus dense",
    // ⚠️ TODO_TARIFS : barème jamais communiqué. Aligné provisoirement sur
    // MoneyGram, et signalé comme tel dans l'interface.
    fraisPct: { depuisCF: 10.2, versCF: 10.2 },
    delai: "Sous 24 h",
    corridorsAutorises: null,
    baremeConfirme: false,
  },
] as const;

export function getOperateur(id: OperateurId): Operateur | undefined {
  return OPERATEURS.find((o) => o.id === id);
}

/** Frais de service Clean Computer, en plus des frais opérateur. */
export const FRAIS_SERVICE_PCT = 2;

/* ══════════════════════ CALCUL ══════════════════════ */

export type Chiffrage = {
  readonly montantEnvoye: number;
  readonly fraisOperateur: number;
  readonly fraisService: number;
  readonly totalAPayer: number;
  readonly montantRecu: number;
  readonly taux: number;
  readonly deviseDepart: Devise;
  readonly deviseArrivee: Devise;
};

/**
 * Le bénéficiaire reçoit l'intégralité du montant envoyé, converti au taux.
 * Les frais s'AJOUTENT au montant, ils ne s'en déduisent pas : l'expéditeur
 * paie « montant + frais », ce qui évite qu'un bénéficiaire reçoive moins que
 * la somme annoncée par l'expéditeur.
 */
export function calculerTransfert(
  montant: number,
  paysDepart: Pays,
  paysArrivee: Pays,
  operateur: Operateur,
): Chiffrage {
  const propre = Number.isFinite(montant) && montant > 0 ? montant : 0;
  const depuisCF = paysDepart.code === "CF";

  const pctOperateur = depuisCF
    ? operateur.fraisPct.depuisCF
    : operateur.fraisPct.versCF;

  const fraisOperateur = (propre * pctOperateur) / 100;
  const fraisService = (propre * FRAIS_SERVICE_PCT) / 100;

  return {
    montantEnvoye: propre,
    fraisOperateur,
    fraisService,
    totalAPayer: propre + fraisOperateur + fraisService,
    montantRecu: convertir(propre, paysDepart.devise, paysArrivee.devise),
    taux: tauxAffiche(paysDepart.devise, paysArrivee.devise),
    deviseDepart: paysDepart.devise,
    deviseArrivee: paysArrivee.devise,
  };
}

/** Formate un montant selon les décimales de sa devise. */
export function formatDevise(montant: number, devise: Devise): string {
  const decimales = DEVISE_DECIMALES[devise];
  const formate = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(montant);
  return `${formate} ${devise === "XAF" || devise === "XOF" ? "FCFA" : devise}`;
}

/** Opérateurs praticables pour un couple de pays donné. */
export function operateursDisponibles(
  paysDepart: Pays,
  paysArrivee: Pays,
): readonly Operateur[] {
  return OPERATEURS.filter((o) => {
    if (o.corridorsAutorises === null) return true;
    // Corridor restreint : un des deux pays doit être la Centrafrique et
    // l'autre doit figurer dans la liste blanche.
    const autre = paysDepart.code === "CF" ? paysArrivee.code : paysDepart.code;
    const impliqueCF = paysDepart.code === "CF" || paysArrivee.code === "CF";
    return impliqueCF && o.corridorsAutorises.includes(autre);
  });
}
