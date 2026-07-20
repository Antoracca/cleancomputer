/**
 * VALIDATION DES FORMULAIRES D'AUTHENTIFICATION
 *
 * Règles partagées entre le client et le futur serveur. La validation client
 * sert le confort ; elle ne remplacera JAMAIS la validation serveur, qui
 * viendra avec l'intégration Supabase.
 *
 * Les messages sont rédigés pour dire quoi FAIRE, pas seulement ce qui est
 * faux : « Il manque le @ » plutôt que « Email invalide ».
 */

export type FieldErrors = Record<string, string>;

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return "Renseignez votre adresse email.";
  if (!email.includes("@")) return "Il manque le @ dans l'adresse.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return "Cette adresse ne semble pas complète.";
  }
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Choisissez un mot de passe.";
  if (value.length < 8) {
    return `Encore ${8 - value.length} caractère${8 - value.length > 1 ? "s" : ""} minimum.`;
  }
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  return value.trim() ? null : `${label} est nécessaire.`;
}

/**
 * Téléphone centrafricain : 8 chiffres, éventuellement précédés de +236.
 * On accepte les espaces et les points — les gens les saisissent, à nous de
 * les absorber plutôt que de les rejeter.
 */
export function validatePhone(value: string): string | null {
  const raw = value.trim();
  if (!raw) return "Renseignez un numéro de téléphone.";
  const digits = raw.replace(/[\s.\-()]/g, "").replace(/^\+?236/, "");
  if (!/^\d{8}$/.test(digits)) {
    return "Un numéro centrafricain compte 8 chiffres.";
  }
  return null;
}

/** Force du mot de passe, pour la jauge visuelle. 0 à 4. */
export function passwordStrength(value: string): number {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 4);
}
