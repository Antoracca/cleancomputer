/**
 * CONTRÔLE DU FORMATAGE DES DATES DU DEVIS
 *
 * Écrit après un vrai plantage : `formaterDate("")` levait une RangeError qui
 * faisait tomber la page entière. La cause était que la date d'émission n'est
 * posée qu'après le montage client, donc le document se rend une fois sans
 * elle.
 *
 * Une fonction de formatage ne doit jamais casser un affichage. Ces contrôles
 * verrouillent ce comportement.
 *
 * Usage : node --experimental-strip-types scripts/test-devis-dates.mts
 */

import {
  DATE_ABSENTE,
  dateEcheance,
  formaterDate,
  type Devis,
} from "../src/features/devis/types.ts";

let echecs = 0;

function verifier(intitule: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ok    ${intitule}`);
  } else {
    echecs += 1;
    console.error(`  ECHEC ${intitule}${detail ? ` — ${detail}` : ""}`);
  }
}

function sansJeter(action: () => unknown): { ok: boolean; valeur?: unknown } {
  try {
    return { ok: true, valeur: action() };
  } catch {
    return { ok: false };
  }
}

console.log("\nformaterDate");
{
  const cas = ["", "   ", "pas-une-date", "2026-13-45", "2026-02-30", "20260721"];
  for (const entree of cas) {
    const r = sansJeter(() => formaterDate(entree));
    verifier(
      `« ${entree || "(vide)"} » ne jette pas`,
      r.ok,
      "RangeError levée",
    );
    if (r.ok) {
      verifier(
        `« ${entree || "(vide)"} » rend le marqueur d'absence`,
        r.valeur === DATE_ABSENTE,
        String(r.valeur),
      );
    }
  }
}
{
  const r = formaterDate("2026-07-21");
  verifier(
    "une date valide est formatée en français",
    r.includes("2026") && r.includes("juillet"),
    r,
  );
}

console.log("\ndateEcheance");
{
  const base: Devis = {
    reference: "DV-2607-AB12",
    emisLe: "",
    valableJours: 30,
    client: {
      type: "particulier",
      nom: "",
      prenom: "",
      contact: "",
      telephone: "",
      email: "",
      adresse: "",
      niu: "",
    },
    lignes: [],
    remiseGlobalePct: 0,
    acomptePct: 0,
    notes: "",
  };

  const r = sansJeter(() => dateEcheance(base));
  verifier("une émission vide ne jette pas", r.ok);
  verifier("une émission vide rend une chaîne vide", r.valeur === "", String(r.valeur));

  const avecDate = dateEcheance({ ...base, emisLe: "2026-07-21" });
  verifier(
    "trente jours après le 21 juillet donne le 20 août",
    avecDate === "2026-08-20",
    avecDate,
  );

  // Le passage d'une année à l'autre est le cas qu'on oublie toujours.
  const bascule = dateEcheance({
    ...base,
    emisLe: "2026-12-20",
    valableJours: 30,
  });
  verifier(
    "l'échéance franchit le changement d'année",
    bascule === "2027-01-19",
    bascule,
  );

  // Une échéance formatée doit rester affichable même sans date d'émission.
  const r2 = sansJeter(() => formaterDate(dateEcheance(base)));
  verifier("l'échéance vide reste formatable", r2.ok && r2.valeur === DATE_ABSENTE);
}

console.log(
  echecs === 0 ? "\nDates saines.\n" : `\n${echecs} échec(s).\n`,
);
process.exit(echecs === 0 ? 0 : 1);
