"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { validatePhone, validateRequired } from "@/features/auth/validation";
import {
  calculerTransfert,
  getOperateur,
  getPays,
  operateursDisponibles,
  type OperateurId,
} from "@/lib/data/transfert";

/**
 * ENREGISTREMENT D'UN TRANSFERT
 *
 * Règle cardinale, identique aux commandes : LE CLIENT N'ENVOIE AUCUN MONTANT
 * CALCULÉ. Il transmet le montant à envoyer, les deux pays et l'opérateur ;
 * le serveur recalcule frais, total et montant reçu à partir du barème.
 * Un client qui trafiquerait la page ne changerait que son affichage.
 *
 * Les montants sont stockés en CENTIMES (entiers). Aucun flottant ne
 * représente de l'argent en base : les arrondis binaires sur des sommes sont
 * une source de litiges garantie.
 *
 * Le client d'administration est utilisé car un expéditeur peut ne pas avoir
 * de compte. En contrepartie, toutes les entrées sont validées avant écriture.
 */

const MODES_RECEPTION = ["especes", "compte_bancaire", "mobile_money"] as const;
const MODES_PAIEMENT = ["especes_agence", "orange_money", "carte_bancaire"] as const;

type ModeReception = (typeof MODES_RECEPTION)[number];
type ModePaiement = (typeof MODES_PAIEMENT)[number];

export type EntreeTransfert = {
  montant: number;
  departCode: string;
  arriveeCode: string;
  operateur: OperateurId;
  expediteurNom: string;
  expediteurTel: string;
  benefNom: string;
  benefPrenom: string;
  benefTel: string;
  benefMode: ModeReception;
  benefDetails?: string;
  modePaiement: ModePaiement;
  /** Image de la preuve encodée en base64, avec son préfixe `data:`. */
  preuveDataUrl?: string;
};

export type ResultatTransfert =
  | { ok: true; reference: string }
  | { ok: false; erreur: string };

/** Plafond de sécurité. Au-delà, le dossier passe obligatoirement en agence. */
const PLAFOND_XAF = 5_000_000;

export async function creerTransfert(
  input: EntreeTransfert,
): Promise<ResultatTransfert> {
  /* ─────────────── Validation ─────────────── */
  const depart = getPays(input.departCode);
  const arrivee = getPays(input.arriveeCode);
  const operateur = getOperateur(input.operateur);

  if (!depart || !arrivee || !operateur) {
    return { ok: false, erreur: "Corridor ou service invalide." };
  }
  if (depart.code === arrivee.code) {
    return { ok: false, erreur: "Les pays de départ et d'arrivée sont identiques." };
  }
  if (!operateursDisponibles(depart, arrivee).some((o) => o.id === operateur.id)) {
    return {
      ok: false,
      erreur: `${operateur.nom} ne couvre pas ce corridor.`,
    };
  }

  const montant = Number(input.montant);
  if (!Number.isFinite(montant) || montant <= 0) {
    return { ok: false, erreur: "Montant invalide." };
  }

  for (const [valeur, libelle] of [
    [input.expediteurNom, "Votre nom"],
    [input.benefNom, "Le nom du bénéficiaire"],
    [input.benefPrenom, "Le prénom du bénéficiaire"],
  ] as const) {
    const err = validateRequired(valeur ?? "", libelle);
    if (err) return { ok: false, erreur: err };
  }

  const telErr = validatePhone(input.expediteurTel ?? "");
  if (telErr) return { ok: false, erreur: `Votre téléphone : ${telErr}` };

  if (!(input.benefTel ?? "").trim()) {
    return { ok: false, erreur: "Le téléphone du bénéficiaire est nécessaire." };
  }

  if (!MODES_RECEPTION.includes(input.benefMode)) {
    return { ok: false, erreur: "Mode de réception invalide." };
  }
  if (!MODES_PAIEMENT.includes(input.modePaiement)) {
    return { ok: false, erreur: "Mode de paiement invalide." };
  }

  // Un versement bancaire ou mobile sans coordonnées est inexploitable.
  if (input.benefMode !== "especes" && !(input.benefDetails ?? "").trim()) {
    return {
      ok: false,
      erreur:
        input.benefMode === "compte_bancaire"
          ? "Indiquez le numéro de compte ou l'IBAN du bénéficiaire."
          : "Indiquez le numéro mobile money du bénéficiaire.",
    };
  }

  /* ─────────── Recalcul serveur, source de vérité ─────────── */
  const chiffrage = calculerTransfert(montant, depart, arrivee, operateur);

  // Plafond exprimé en XAF, quel que soit le pays de départ.
  const enXaf =
    depart.devise === "XAF" || depart.devise === "XOF"
      ? chiffrage.montantEnvoye
      : chiffrage.montantEnvoye * chiffrage.taux;

  if (enXaf > PLAFOND_XAF) {
    return {
      ok: false,
      erreur:
        "Au-delà de 5 000 000 FCFA, le dossier doit être ouvert en agence. Appelez-nous.",
    };
  }

  const cts = (v: number) => Math.round(v * 100);

  /* ─────────────── Écriture ─────────────── */
  const admin = await createAdminClient();
  const session = await createClient();
  const {
    data: { user },
  } = await session.auth.getUser();

  const reference = genererReference();

  // La preuve est déposée AVANT l'insertion : si le dépôt échoue, aucun
  // transfert orphelin ne reste en base.
  let preuveUrl: string | null = null;
  if (input.modePaiement === "orange_money" && input.preuveDataUrl) {
    preuveUrl = await deposerPreuve(admin, reference, input.preuveDataUrl);
    if (!preuveUrl) {
      return {
        ok: false,
        erreur: "La preuve de dépôt n'a pas pu être envoyée. Réessayez.",
      };
    }
  }

  const { error } = await admin.from("transferts").insert({
    reference,
    profile_id: user?.id ?? null,
    statut: "attente_paiement",
    operateur: operateur.id,
    pays_depart: depart.code,
    pays_arrivee: arrivee.code,
    devise_depart: depart.devise,
    devise_arrivee: arrivee.devise,
    montant_envoye_cts: cts(chiffrage.montantEnvoye),
    frais_operateur_cts: cts(chiffrage.fraisOperateur),
    frais_service_cts: cts(chiffrage.fraisService),
    total_a_payer_cts: cts(chiffrage.totalAPayer),
    montant_recu_cts: cts(chiffrage.montantRecu),
    taux: chiffrage.taux,
    expediteur_nom: input.expediteurNom.trim(),
    expediteur_tel: input.expediteurTel.trim(),
    benef_nom: input.benefNom.trim(),
    benef_prenom: input.benefPrenom.trim(),
    benef_tel: input.benefTel.trim(),
    benef_mode: input.benefMode,
    benef_details: (input.benefDetails ?? "").trim() || null,
    mode_paiement: input.modePaiement,
    preuve_url: preuveUrl,
  });

  if (error) {
    const tableAbsente = /does not exist|schema cache|PGRST205/i.test(error.message);
    return {
      ok: false,
      erreur: tableAbsente
        ? "La table des transferts n'existe pas encore. Exécutez supabase/transferts.sql."
        : "L'enregistrement a échoué. Réessayez dans un instant.",
    };
  }

  return { ok: true, reference };
}

/** Dépose la capture dans le bucket privé. Retourne le chemin, ou null. */
async function deposerPreuve(
  admin: Awaited<ReturnType<typeof createAdminClient>>,
  reference: string,
  dataUrl: string,
): Promise<string | null> {
  const correspondance = /^data:(image\/(png|jpe?g|webp));base64,(.+)$/.exec(dataUrl);
  if (!correspondance) return null;

  const [, mime, , base64] = correspondance;
  if (!mime || !base64) return null;

  const octets = Buffer.from(base64, "base64");
  // 6 Mo : au-delà, c'est une photo non compressée, pas une capture d'écran.
  if (octets.byteLength > 6 * 1024 * 1024) return null;

  const extension = mime.includes("png")
    ? "png"
    : mime.includes("webp")
      ? "webp"
      : "jpg";
  const chemin = `${reference}.${extension}`;

  const { error } = await admin.storage
    .from("preuves-transfert")
    .upload(chemin, octets, { contentType: mime, upsert: true });

  return error ? null : chemin;
}

function genererReference(): string {
  // Préfixe distinct des commandes produit (CC-) pour qu'un agent sache
  // immédiatement de quel dossier on parle au téléphone.
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let alea = "";
  for (let i = 0; i < 3; i++) {
    alea += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `TR-${Date.now().toString(36).toUpperCase()}${alea}`;
}
