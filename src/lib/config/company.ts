/**
 * IDENTITÉ DE L'ENTREPRISE
 *
 * Source : Bulletin d'immatriculation CIM260114672424, délivré le 14/01/2026
 * par la Direction Générale des Impôts et des Domaines, Ministère des Finances
 * et du Budget de la République Centrafricaine.
 *
 * Toutes les valeurs ci-dessous sont VÉRIFIÉES. Aucune n'est estimée.
 */

export const COMPANY = {
  /* --- Commercial --- */
  name: "Clean Computer",
  tagline: "IT Solution",

  /* --- Légal (bulletin d'immatriculation) --- */
  legalName: "OUAMALET SID JUNIOR",
  tradeName: "ETS CLEAN",
  niu: "2362026P94523G",
  rccm: "CA/BG/2021A1542",
  legalForm: "Entreprise individuelle",
  activity: "Prestation de service, commerce général",
  immatriculationRef: "CIM260114672424",

  /* --- Coordonnées --- */
  address: "Avenue Mubutu",
  city: "Bangui",
  country: "République Centrafricaine",
  countryCode: "CF",
  phone: "+236 72 28 07 27",
  phoneRaw: "+23672280727",

  /**
   * Position exacte de la boutique, relevée par le gérant.
   * Sert à la carte de la page d'accueil et à l'itinéraire. Un seul endroit
   * pour la corriger si la boutique déménage.
   */
  latitude: 4.360924,
  longitude: 18.583275,

  /* --- Localisation --- */
  locale: "fr-FR",
  currency: "XAF",

  /**
   * ⚠️ Toujours en attente : adresse email professionnelle.
   * Le bulletin n'en mentionne pas. À créer sur le nom de domaine
   * (c'est d'ailleurs une des prestations vendues).
   */
  email: null as string | null,
} as const;

/** Les informations légales obligatoires sont-elles disponibles ? */
export function hasLegalInfo(): boolean {
  return Boolean(COMPANY.legalName && COMPANY.rccm && COMPANY.niu);
}

/** Lien téléphonique cliquable. */
export const PHONE_HREF = `tel:${COMPANY.phoneRaw}`;
