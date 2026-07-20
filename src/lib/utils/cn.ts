import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * FUSION DE CLASSES TAILWIND
 *
 * ⚠️ La configuration ci-dessous n'est pas cosmétique, elle corrige un bug réel.
 *
 * Le design system définit des ÉCHELLES DE TEXTE nommées (`text-body`,
 * `text-title`…) et des COULEURS nommées (`text-ink`, `text-frost`…). Les deux
 * familles produisent des utilitaires préfixés `text-`.
 *
 * Sans configuration, tailwind-merge ne peut pas deviner laquelle est une
 * taille et laquelle est une couleur : il les range dans le même groupe et
 * supprime la première. Résultat observé : un bouton `text-frost text-body`
 * perdait sa couleur et héritait de l'encre — texte encre sur fond encre,
 * donc invisible.
 *
 * Déclarer explicitement les deux groupes règle le problème partout à la fois.
 */

const FONT_SIZES = ["hero", "display", "title", "body", "eyebrow", "action"];

const COLORS = [
  "frost",
  "frost-lifted",
  "ink",
  "charcoal",
  "brand",
  "brand-deep",
  "orbit",
  "slate",
  "graphite",
  "mist",
  "ghost",
  "signal",
  "success",
  "warning",
  "danger",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
      "text-color": [{ text: COLORS }],
      "bg-color": [{ bg: COLORS }],
      "border-color": [{ border: COLORS }],
    },
  },
});

/**
 * Fusionne des classes Tailwind en résolvant les conflits.
 * Utilitaire unique du projet — aucune autre helper de classe ne doit exister.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
