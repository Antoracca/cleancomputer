"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  CircleCheck,
  LogIn,
  Mail,
  Printer,
  Save,
} from "lucide-react";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { formatXAF } from "@/lib/format/currency";
import { calculerTotaux } from "@/features/devis/types";
import { useDevis } from "@/features/devis/store";
import { enregistrerDevis } from "@/features/devis/actions";
import { cn } from "@/lib/utils/cn";

/**
 * RÉCUPÉRER LE DEVIS
 *
 * Trois sorties : enregistrer dans son compte, demander l'envoi par email,
 * imprimer ou enregistrer en PDF.
 *
 * LA QUESTION DU RAPPEL VIENT APRÈS, PAS AVANT
 *
 * Elle n'apparaît qu'une fois le devis obtenu. Posée avant, elle ressemble à
 * un péage : on demande un engagement commercial en échange du document. Posée
 * après, elle est une proposition d'aide, et le devis est déjà dans les mains
 * de la personne quoi qu'elle réponde.
 *
 * L'IMPRESSION NE DEMANDE PAS DE COMPTE
 *
 * Elle ne touche à rien côté serveur. Exiger une inscription pour imprimer une
 * page déjà affichée à l'écran serait un obstacle sans contrepartie.
 */
export function ActionsDevis({ connecte }: { readonly connecte: boolean }) {
  const devis = useDevis((s) => s.devis);
  const [etat, setEtat] = useState<"repos" | "envoi" | "fait">("repos");
  const [erreur, setErreur] = useState<string | null>(null);
  const [connexionRequise, setConnexionRequise] = useState(false);
  const [rappel, setRappel] = useState<boolean | null>(null);
  const [parEmail, setParEmail] = useState(false);

  const totaux = calculerTotaux(devis);
  const vide = devis.lignes.length === 0;

  async function enregistrer(envoiEmail: boolean) {
    setEtat("envoi");
    setErreur(null);
    setConnexionRequise(false);
    setParEmail(envoiEmail);

    const resultat = await enregistrerDevis(devis, {
      envoiEmailDemande: envoiEmail,
    });

    if (resultat.ok) {
      setEtat("fait");
      return;
    }

    setEtat("repos");
    setErreur(resultat.erreur);
    setConnexionRequise(Boolean(resultat.connexionRequise));
  }

  /** Le rappel se met à jour sur un devis déjà enregistré. */
  async function repondreRappel(souhaite: boolean) {
    setRappel(souhaite);
    await enregistrerDevis(devis, {
      rappelSouhaite: souhaite,
      envoiEmailDemande: parEmail,
    });
  }

  return (
    <section className="flex flex-col gap-4 rounded-frame bg-ink p-7 text-white">
      <EyebrowLabel tone="frost">Le total</EyebrowLabel>

      <div className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-4">
        <span className="text-[0.9375rem] text-white/60">
          {totaux.nombreArticles} article
          {totaux.nombreArticles > 1 ? "s" : ""}
        </span>
        <span className="text-[1.75rem] leading-none font-medium tabular-nums">
          {formatXAF(totaux.totalXaf)}
        </span>
      </div>

      {devis.acomptePct > 0 ? (
        <p className="text-[0.875rem] text-white/60 tabular-nums">
          Acompte {formatXAF(totaux.acompteXaf)} · solde{" "}
          {formatXAF(totaux.soldeXaf)}
        </p>
      ) : null}

      {etat === "fait" ? (
        <Confirme
          parEmail={parEmail}
          email={devis.client.email}
          reference={devis.reference}
          rappel={rappel}
          onRepondre={repondreRappel}
        />
      ) : (
        <>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={vide}
            className={cn(
              "inline-flex min-h-14 items-center justify-center gap-3 rounded-action px-8",
              "bg-frost text-[1.0625rem] font-medium tracking-[-0.02em] text-ink",
              "transition-colors hover:bg-white",
              "disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50",
            )}
          >
            <Printer size={18} aria-hidden />
            Imprimer ou enregistrer en PDF
          </button>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <BoutonSecondaire
              onClick={() => enregistrer(false)}
              disabled={vide || etat === "envoi"}
              icone={<Save size={17} aria-hidden />}
              label={etat === "envoi" ? "Enregistrement…" : "Enregistrer"}
            />
            <BoutonSecondaire
              onClick={() => enregistrer(true)}
              disabled={vide || etat === "envoi" || !devis.client.email.trim()}
              icone={<Mail size={17} aria-hidden />}
              label="Recevoir par email"
            />
          </div>

          {!devis.client.email.trim() && !vide ? (
            <p className="text-[0.8125rem] text-white/50">
              Renseignez l&apos;adresse email du client pour activer
              l&apos;envoi.
            </p>
          ) : null}

          {/* Prévenu AVANT, pas après. Laisser quelqu'un composer un devis
              entier puis lui annoncer au moment d'enregistrer qu'il fallait un
              compte est le meilleur moyen de le perdre. Le brouillon local
              tient pendant la connexion, donc rien n'est perdu. */}
          {!connecte && !vide ? (
            <div className="flex flex-col gap-3 rounded-action bg-white/10 px-4 py-3.5">
              <p className="text-[0.875rem] leading-relaxed text-white/80">
                L&apos;impression fonctionne sans compte. Pour enregistrer ce
                devis et le retrouver plus tard, connectez-vous. Votre saisie
                est conservée pendant ce temps.
              </p>
              <Link
                href="/connexion?suite=/devis"
                className="inline-flex min-h-11 w-fit items-center gap-2 rounded-action bg-frost px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-white"
              >
                <LogIn size={16} aria-hidden />
                Se connecter
              </Link>
            </div>
          ) : null}

          {erreur ? (
            <div className="flex flex-col gap-3 rounded-action bg-white/10 px-4 py-3.5">
              <p className="text-[0.875rem] leading-relaxed text-white">
                {erreur}
              </p>
              {connexionRequise ? (
                <Link
                  href="/connexion?suite=/devis"
                  className="inline-flex min-h-11 w-fit items-center gap-2 rounded-action bg-frost px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-white"
                >
                  <LogIn size={16} aria-hidden />
                  Se connecter
                </Link>
              ) : null}
            </div>
          ) : null}

          <p className="text-[0.8125rem] leading-relaxed text-white/50">
            L&apos;impression ne demande pas de compte. L&apos;enregistrement,
            si : c&apos;est ce qui permet de retrouver le devis plus tard.
          </p>
        </>
      )}
    </section>
  );
}

/* ────────────────────────── pièces ────────────────────────── */

function Confirme({
  parEmail,
  email,
  reference,
  rappel,
  onRepondre,
}: {
  readonly parEmail: boolean;
  readonly email: string;
  readonly reference: string;
  readonly rappel: boolean | null;
  readonly onRepondre: (souhaite: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <CircleCheck size={22} aria-hidden className="mt-0.5 shrink-0" />
        <div className="flex flex-col gap-1">
          <p className="text-[1.0625rem] font-medium">Devis enregistré.</p>
          <p className="text-[0.875rem] leading-relaxed text-white/60">
            {parEmail
              ? `Il est dans votre compte sous la référence ${reference}. Nous l'envoyons à ${email}.`
              : `Il est dans votre compte sous la référence ${reference}. Vous pouvez le reprendre quand vous voulez.`}
          </p>
        </div>
      </div>

      {/* La proposition de rappel, une fois le document obtenu. */}
      <div className="flex flex-col gap-3 border-t border-white/15 pt-4">
        {rappel === null ? (
          <>
            <p className="text-[0.9375rem]">
              Souhaitez-vous qu&apos;un conseiller vous rappelle pour en
              parler ?
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => onRepondre(true)}
                className="min-h-12 flex-1 rounded-action bg-frost px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-white"
              >
                Oui, rappelez-moi
              </button>
              <button
                type="button"
                onClick={() => onRepondre(false)}
                className="min-h-12 flex-1 rounded-action border-[1.5px] border-white/25 px-5 text-[0.9375rem] text-white transition-colors hover:border-white/60"
              >
                Non merci
              </button>
            </div>
          </>
        ) : (
          <p className="inline-flex items-center gap-2 text-[0.9375rem] text-white/70">
            <Check size={16} aria-hidden />
            {rappel
              ? "Un conseiller vous rappelle sous 24 h ouvrées."
              : "Entendu. Le devis reste dans votre compte."}
          </p>
        )}
      </div>

      <Link
        href="/compte?onglet=devis"
        className="inline-flex min-h-11 w-fit items-center gap-2 text-[0.875rem] text-white/60 transition-colors hover:text-white"
      >
        Voir tous mes devis
      </Link>
    </div>
  );
}

function BoutonSecondaire({
  onClick,
  disabled,
  icone,
  label,
}: {
  readonly onClick: () => void;
  readonly disabled: boolean;
  readonly icone: React.ReactNode;
  readonly label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-action px-5",
        "border-[1.5px] border-white/25 text-[0.9375rem] text-white",
        "transition-colors hover:border-white/60",
        "disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30",
      )}
    >
      {icone}
      {label}
    </button>
  );
}
