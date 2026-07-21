"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  CreditCard,
  Loader2,
  Smartphone,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { creerTransfert } from "@/features/transfert/actions";
import {
  DEVISE_LABELS,
  FRAIS_SERVICE_PCT,
  calculerTransfert,
  formatDevise,
  getOperateur,
  getPays,
  type OperateurId,
} from "@/lib/data/transfert";
import { COMPANY } from "@/lib/config/company";

/**
 * PARCOURS D'ENVOI
 *
 * Trois écrans après le montant : bénéficiaire, paiement, récapitulatif.
 *
 * Le chiffrage affiché ici est un MIROIR du calcul serveur, jamais la source.
 * L'action `creerTransfert` recalcule tout à partir du montant et du corridor ;
 * si quelqu'un trafique cette page, seul son affichage change.
 *
 * Les écrans sont montés en permanence et translatés, pour que revenir en
 * arrière ne perde aucune saisie.
 */

type Etape = 0 | 1 | 2;

const MODES_RECEPTION = [
  {
    id: "especes" as const,
    icone: Banknote,
    titre: "Retrait en espèces",
    detail: "Le bénéficiaire retire en agence avec son pièce d'identité.",
  },
  {
    id: "compte_bancaire" as const,
    icone: Building2,
    titre: "Virement bancaire",
    detail: "Versé directement sur son compte.",
  },
  {
    id: "mobile_money" as const,
    icone: Smartphone,
    titre: "Mobile money",
    detail: "Crédité sur son portefeuille mobile.",
  },
];

const MODES_PAIEMENT = [
  {
    id: "especes_agence" as const,
    icone: Banknote,
    titre: "Espèces en agence",
    detail: `Vous payez sur place, ${COMPANY.address}.`,
  },
  {
    id: "orange_money" as const,
    icone: Smartphone,
    titre: "Orange Money",
    detail: "Vous déposez, puis vous joignez la capture du dépôt.",
  },
  {
    id: "carte_bancaire" as const,
    icone: CreditCard,
    titre: "Carte bancaire",
    detail: "Paiement en ligne. Bientôt disponible.",
    indisponible: true,
  },
];

export function ParcoursEnvoi({
  montant,
  departCode,
  arriveeCode,
  operateurId,
  onRetour,
}: {
  montant: number;
  departCode: string;
  arriveeCode: string;
  operateurId: OperateurId;
  onRetour: () => void;
}) {
  const router = useRouter();
  const ancre = useRef<HTMLDivElement>(null);
  const [etape, setEtape] = useState<Etape>(0);

  /**
   * Le panneau précédent est souvent plus haut que le suivant. Sans ce
   * recentrage, la page raccourcit sous les pieds de l'utilisateur : il reste
   * là où il était, se retrouve devant du vide, et croit que le clic n'a rien
   * fait. C'était précisément le symptôme signalé.
   */
  useEffect(() => {
    const noeud = ancre.current;
    if (!noeud) return;
    const y = noeud.getBoundingClientRect().top + window.scrollY - 140;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, [etape]);
  const [pending, setPending] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const [v, setV] = useState({
    expediteurNom: "",
    expediteurTel: "",
    benefNom: "",
    benefPrenom: "",
    benefTel: "",
    benefDetails: "",
  });
  const [benefMode, setBenefMode] =
    useState<(typeof MODES_RECEPTION)[number]["id"]>("especes");
  const [modePaiement, setModePaiement] =
    useState<(typeof MODES_PAIEMENT)[number]["id"]>("especes_agence");
  const [preuve, setPreuve] = useState<string | null>(null);
  const [conditions, setConditions] = useState(false);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  const depart = getPays(departCode);
  const arrivee = getPays(arriveeCode);
  const operateur = getOperateur(operateurId);

  const chiffrage = useMemo(
    () =>
      depart && arrivee && operateur
        ? calculerTransfert(montant, depart, arrivee, operateur)
        : null,
    [montant, depart, arrivee, operateur],
  );

  function set(cle: keyof typeof v, valeur: string) {
    setV((p) => ({ ...p, [cle]: valeur }));
    // L'erreur s'efface dès que le champ est corrigé, sans attendre un
    // nouveau clic : laisser un message rouge sous un champ désormais rempli
    // donne l'impression que la correction n'a pas été prise en compte.
    if (erreurs[cle]) {
      setErreurs((p) => {
        const suite = { ...p };
        delete suite[cle];
        return suite;
      });
    }
  }

  /**
   * Le bouton reste ACTIF même quand le formulaire est incomplet.
   *
   * Un bouton grisé sans explication est le pire des deux mondes : l'utilisateur
   * clique, rien ne bouge, et rien ne lui dit ce qui manque. C'était le défaut
   * signalé. Ici le clic déclenche la validation et pointe le champ fautif.
   */
  function validerEtape0(): boolean {
    const e: Record<string, string> = {};
    if (!v.expediteurNom.trim()) e.expediteurNom = "Indiquez votre nom.";
    if (!v.expediteurTel.trim()) e.expediteurTel = "Indiquez votre téléphone.";
    if (!v.benefPrenom.trim()) e.benefPrenom = "Le prénom est nécessaire.";
    if (!v.benefNom.trim()) e.benefNom = "Le nom est nécessaire.";
    if (!v.benefTel.trim()) e.benefTel = "Le téléphone du bénéficiaire est nécessaire.";
    if (benefMode !== "especes" && !v.benefDetails.trim()) {
      e.benefDetails =
        benefMode === "compte_bancaire"
          ? "Indiquez le numéro de compte ou l'IBAN."
          : "Indiquez le numéro mobile money.";
    }
    setErreurs(e);
    return Object.keys(e).length === 0;
  }

  function validerEtape1(): boolean {
    if (modePaiement === "orange_money" && !preuve) {
      setErreur("Joignez la capture de votre dépôt Orange Money pour continuer.");
      return false;
    }
    setErreur(null);
    return true;
  }

  async function onFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    if (fichier.size > 6 * 1024 * 1024) {
      setErreur("La capture dépasse 6 Mo. Réduisez-la avant de l'envoyer.");
      return;
    }
    const lecteur = new FileReader();
    lecteur.onload = () => setPreuve(String(lecteur.result));
    lecteur.readAsDataURL(fichier);
  }

  async function valider() {
    setErreur(null);
    setPending(true);

    const r = await creerTransfert({
      montant,
      departCode,
      arriveeCode,
      operateur: operateurId,
      expediteurNom: v.expediteurNom,
      expediteurTel: v.expediteurTel,
      benefNom: v.benefNom,
      benefPrenom: v.benefPrenom,
      benefTel: v.benefTel,
      benefMode,
      ...(v.benefDetails.trim() && { benefDetails: v.benefDetails }),
      modePaiement,
      ...(preuve && { preuveDataUrl: preuve }),
    });

    if (!r.ok) {
      setPending(false);
      setErreur(r.erreur);
      return;
    }
    router.push(`/transfert-argent/${r.reference}`);
  }

  if (!chiffrage || !depart || !arrivee || !operateur) return null;

  return (
    <div ref={ancre} className="flex flex-col gap-6">
      {/* Fil d'étapes */}
      <ol className="flex items-center gap-2">
        {["Bénéficiaire", "Paiement", "Récapitulatif"].map((titre, i) => (
          <li key={titre} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "h-1 flex-1 rounded-pill transition-colors duration-400",
                i <= etape ? "bg-brand" : "bg-ghost",
              )}
            />
            <span
              className={cn(
                "shrink-0 text-[0.75rem] whitespace-nowrap",
                i === etape ? "font-medium text-ink" : "text-slate",
              )}
            >
              {titre}
            </span>
          </li>
        ))}
      </ol>

      <div className="overflow-hidden">
        <div
          className="flex w-[300%] transition-transform duration-500 ease-out-soft"
          style={{ transform: `translateX(-${(etape * 100) / 3}%)` }}
        >
          {/* ═══════ ÉTAPE 1 : bénéficiaire ═══════ */}
          <Panneau actif={etape === 0}>
            <Bloc titre="Vos coordonnées">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Votre nom complet" htmlFor="exp-nom" error={erreurs.expediteurNom}>
                  <Input
                    id="exp-nom"
                    autoComplete="name"
                    value={v.expediteurNom}
                    onChange={(e) => set("expediteurNom", e.target.value)}
                  />
                </Field>
                <Field
                  label="Votre téléphone"
                  htmlFor="exp-tel"
                  hint="Pour vous joindre au sujet du dossier."
                  error={erreurs.expediteurTel}
                >
                  <Input
                    id="exp-tel"
                    type="tel"
                    inputMode="tel"
                    placeholder="+236 70 00 00 00"
                    value={v.expediteurTel}
                    onChange={(e) => set("expediteurTel", e.target.value)}
                  />
                </Field>
              </div>
            </Bloc>

            <Bloc titre="Le bénéficiaire">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Prénom" htmlFor="ben-prenom" error={erreurs.benefPrenom}>
                  <Input
                    id="ben-prenom"
                    value={v.benefPrenom}
                    onChange={(e) => set("benefPrenom", e.target.value)}
                  />
                </Field>
                <Field label="Nom" htmlFor="ben-nom" error={erreurs.benefNom}>
                  <Input
                    id="ben-nom"
                    value={v.benefNom}
                    onChange={(e) => set("benefNom", e.target.value)}
                  />
                </Field>
              </div>

              <Field
                label={`Son téléphone au ${arrivee.nom}`}
                htmlFor="ben-tel"
                hint="Il en aura besoin pour être prévenu."
                error={erreurs.benefTel}
              >
                <Input
                  id="ben-tel"
                  type="tel"
                  inputMode="tel"
                  placeholder={`${arrivee.indicatif} …`}
                  value={v.benefTel}
                  onChange={(e) => set("benefTel", e.target.value)}
                />
              </Field>
            </Bloc>

            <Bloc titre="Comment veut-il recevoir ?">
              <div className="grid gap-3 sm:grid-cols-3">
                {MODES_RECEPTION.map((m) => (
                  <Choix
                    key={m.id}
                    actif={benefMode === m.id}
                    onClick={() => setBenefMode(m.id)}
                    icone={<m.icone size={18} strokeWidth={1.75} aria-hidden />}
                    titre={m.titre}
                    detail={m.detail}
                  />
                ))}
              </div>

              {benefMode !== "especes" ? (
                <Field
                  label={
                    benefMode === "compte_bancaire"
                      ? "Numéro de compte ou IBAN"
                      : "Numéro mobile money"
                  }
                  htmlFor="ben-details"
                  error={erreurs.benefDetails}
                >
                  <Input
                    id="ben-details"
                    value={v.benefDetails}
                    onChange={(e) => set("benefDetails", e.target.value)}
                  />
                </Field>
              ) : null}
            </Bloc>

            <Navigation
              retour={onRetour}
              retourLabel="Modifier le montant"
              suivant={() => {
                if (validerEtape0()) setEtape(1);
              }}
            />

            {Object.keys(erreurs).length > 0 ? (
              <p
                role="alert"
                className="rounded-action border border-danger/30 bg-white px-5 py-4 text-[0.9375rem] text-danger"
              >
                Il manque {Object.keys(erreurs).length} information
                {Object.keys(erreurs).length > 1 ? "s" : ""} ci-dessus.
              </p>
            ) : null}
          </Panneau>

          {/* ═══════ ÉTAPE 2 : paiement ═══════ */}
          <Panneau actif={etape === 1}>
            <Bloc titre="Comment payez-vous ?">
              <div className="grid gap-3 sm:grid-cols-3">
                {MODES_PAIEMENT.map((m) => (
                  <Choix
                    key={m.id}
                    actif={modePaiement === m.id}
                    onClick={() => !m.indisponible && setModePaiement(m.id)}
                    icone={<m.icone size={18} strokeWidth={1.75} aria-hidden />}
                    titre={m.titre}
                    detail={m.detail}
                    desactive={m.indisponible}
                  />
                ))}
              </div>
            </Bloc>

            {modePaiement === "especes_agence" ? (
              <p className="rounded-action bg-frost px-5 py-4 text-[0.9375rem] leading-relaxed text-graphite">
                Vous recevrez un code de référence. Présentez-le à
                l&apos;agence, {COMPANY.address} à {COMPANY.city}, avec le
                montant en espèces. Le transfert part dès le paiement constaté.
              </p>
            ) : null}

            {modePaiement === "orange_money" ? (
              <Bloc titre="Preuve du dépôt">
                <p className="text-[0.9375rem] leading-relaxed text-graphite">
                  Déposez le montant sur notre numéro Orange Money, puis joignez
                  la capture de confirmation. Sans elle, le dossier ne peut pas
                  être traité.
                </p>

                {preuve ? (
                  <div className="relative w-fit overflow-hidden rounded-action border border-mist">
                    <Image
                      src={preuve}
                      alt="Preuve de dépôt"
                      width={220}
                      height={160}
                      unoptimized
                      className="h-40 w-auto object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setPreuve(null)}
                      aria-label="Retirer la capture"
                      className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-ink/80 text-frost backdrop-blur-sm"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-action border-[1.5px] border-dashed border-mist bg-white p-6 text-center transition-colors hover:border-ink">
                    <Upload size={20} className="text-slate" aria-hidden />
                    <span className="text-[0.9375rem] font-medium text-ink">
                      Joindre la capture
                    </span>
                    <span className="text-[0.8125rem] text-slate">
                      PNG ou JPEG, 6 Mo maximum
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={onFichier}
                      className="sr-only"
                    />
                  </label>
                )}
              </Bloc>
            ) : null}

            {erreur ? (
              <p
                role="alert"
                className="rounded-action border border-danger/30 bg-white px-5 py-4 text-[0.9375rem] text-danger"
              >
                {erreur}
              </p>
            ) : null}

            <Navigation
              retour={() => setEtape(0)}
              retourLabel="Retour"
              suivant={() => {
                if (validerEtape1()) setEtape(2);
              }}
            />
          </Panneau>

          {/* ═══════ ÉTAPE 3 : récapitulatif ═══════ */}
          <Panneau actif={etape === 2}>
            <div className="flex flex-col gap-5 rounded-frame border border-mist/60 bg-white p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-mist/60 pb-5">
                <span className="text-title text-ink">Récapitulatif</span>
                <span className="relative h-6 w-28">
                  <Image
                    src={operateur.logo}
                    alt={operateur.nom}
                    fill
                    sizes="112px"
                    className="object-contain object-right"
                  />
                </span>
              </div>

              <Recap label="Corridor" valeur={`${depart.nom} → ${arrivee.nom}`} />
              <Recap
                label="Montant envoyé"
                valeur={formatDevise(chiffrage.montantEnvoye, chiffrage.deviseDepart)}
              />
              <Recap
                label={`Frais ${operateur.nom}`}
                valeur={formatDevise(chiffrage.fraisOperateur, chiffrage.deviseDepart)}
              />
              <Recap
                label={`Frais de service (${FRAIS_SERVICE_PCT} %)`}
                valeur={formatDevise(chiffrage.fraisService, chiffrage.deviseDepart)}
              />

              <div className="flex items-baseline justify-between gap-4 border-t border-mist/60 pt-5">
                <span className="text-[1.0625rem] font-medium text-ink">
                  Total à payer
                </span>
                <span className="text-[1.25rem] font-medium text-ink tabular-nums">
                  {formatDevise(chiffrage.totalAPayer, chiffrage.deviseDepart)}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-action bg-ink p-5 text-white">
                <span className="text-[0.8125rem] text-white/60">
                  {v.benefPrenom} {v.benefNom} reçoit
                </span>
                <span className="text-[1.75rem] leading-none font-medium tracking-[-0.02em] tabular-nums">
                  {formatDevise(chiffrage.montantRecu, chiffrage.deviseArrivee)}
                </span>
                <span className="text-[0.8125rem] text-white/50 tabular-nums">
                  1 {chiffrage.deviseDepart} = {chiffrage.taux.toFixed(4)}{" "}
                  {DEVISE_LABELS[chiffrage.deviseArrivee]}
                </span>
              </div>

              <dl className="grid gap-4 border-t border-mist/60 pt-5 sm:grid-cols-2">
                <Info label="Réception" valeur={
                  MODES_RECEPTION.find((m) => m.id === benefMode)?.titre ?? ""
                } />
                <Info label="Paiement" valeur={
                  MODES_PAIEMENT.find((m) => m.id === modePaiement)?.titre ?? ""
                } />
                <Info label="Téléphone bénéficiaire" valeur={v.benefTel} />
                <Info label="Délai" valeur={operateur.delai} />
              </dl>
            </div>

            {/* Conditions et avertissement fraude */}
            <div className="flex flex-col gap-4 rounded-frame bg-frost-lifted p-6">
              <p className="text-[0.875rem] leading-relaxed text-graphite">
                <strong className="font-medium text-ink">
                  Vérifiez le bénéficiaire.
                </strong>{" "}
                Un transfert remis ne peut pas être annulé. N&apos;envoyez
                jamais d&apos;argent à quelqu&apos;un que vous ne connaissez
                pas, même s&apos;il invoque une urgence, une promesse de gain ou
                une administration. {COMPANY.name} ne vous demandera jamais vos
                codes.
              </p>

              <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem] text-graphite">
                <input
                  type="checkbox"
                  checked={conditions}
                  onChange={(e) => setConditions(e.target.checked)}
                  className="mt-1 size-4 shrink-0 accent-[var(--color-ink)]"
                />
                <span>
                  Je confirme l&apos;identité du bénéficiaire et j&apos;accepte
                  les conditions du service ainsi que la politique de
                  confidentialité.
                </span>
              </label>
            </div>

            {erreur ? (
              <p
                role="alert"
                className="rounded-action border border-danger/30 bg-white px-5 py-4 text-[0.9375rem] text-danger"
              >
                {erreur}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => setEtape(1)}
                disabled={pending}
              >
                <ArrowLeft size={17} aria-hidden />
                Retour
              </Button>
              <Button
                type="button"
                size="lg"
                disabled={!conditions || pending}
                onClick={valider}
                className="sm:flex-1"
              >
                {pending ? (
                  <>
                    <Loader2 size={17} aria-hidden className="animate-spin" />
                    Enregistrement…
                  </>
                ) : (
                  "Confirmer le transfert"
                )}
              </Button>
            </div>
          </Panneau>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Sous-composants ─────────────── */

function Panneau({
  actif,
  children,
}: {
  actif: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex w-1/3 shrink-0 flex-col gap-6 px-1"
      aria-hidden={!actif}
      inert={!actif ? true : undefined}
    >
      {children}
    </div>
  );
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 rounded-frame border border-mist/60 bg-white p-6 md:p-8">
      <h3 className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
        {titre}
      </h3>
      {children}
    </div>
  );
}

function Choix({
  actif,
  onClick,
  icone,
  titre,
  detail,
  desactive = false,
}: {
  actif: boolean;
  onClick: () => void;
  icone: React.ReactNode;
  titre: string;
  detail: string;
  desactive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactive}
      aria-pressed={actif}
      className={cn(
        "flex flex-col gap-2.5 rounded-action border-[1.5px] p-4 text-left transition-colors duration-200",
        actif ? "border-ink bg-frost" : "border-mist bg-white hover:border-slate",
        desactive && "cursor-not-allowed opacity-40",
      )}
    >
      <span
        className={cn(
          "grid size-9 place-items-center rounded-full",
          actif ? "bg-ink text-frost" : "bg-ghost text-brand",
        )}
      >
        {icone}
      </span>
      <span className="text-[0.9375rem] font-medium text-ink">{titre}</span>
      <span className="text-[0.8125rem] leading-relaxed text-slate">
        {detail}
      </span>
    </button>
  );
}

function Navigation({
  retour,
  retourLabel,
  suivant,
}: {
  retour: () => void;
  retourLabel: string;
  suivant: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button type="button" variant="secondary" size="lg" onClick={retour}>
        <ArrowLeft size={17} aria-hidden />
        {retourLabel}
      </Button>
      <Button type="button" size="lg" onClick={suivant} className="sm:flex-1">
        Continuer
        <ArrowRight size={17} aria-hidden />
      </Button>
    </div>
  );
}

function Recap({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-[0.9375rem]">
      <span className="text-graphite">{label}</span>
      <span className="shrink-0 text-ink tabular-nums">{valeur}</span>
    </div>
  );
}

function Info({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[0.75rem] text-slate">{label}</dt>
      <dd className="text-[0.9375rem] text-ink">{valeur}</dd>
    </div>
  );
}
