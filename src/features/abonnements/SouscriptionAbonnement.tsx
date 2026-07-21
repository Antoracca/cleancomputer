"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CircleCheck,
  ShoppingBag,
  Smartphone,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { formatXAF } from "@/lib/format/currency";
import { DUREE_LABELS, type Abonnement } from "@/lib/data/abonnements";
import { COMPANY, PHONE_HREF } from "@/lib/config/company";
import { creerSouscription } from "@/features/abonnements/actions";
import { idAbonnement, usePanier } from "@/features/panier/store";
import { cn } from "@/lib/utils/cn";

/**
 * SOUSCRIPTION EN QUATRE TEMPS
 *
 *   1. la formule           (l'utilisateur choisit son pack, rien n'est imposé)
 *   2. le mode de paiement
 *   3. le compte à activer  (et de quoi rappeler le client)
 *   4. les instructions de paiement, avec la référence
 *
 * Aucun bouton désactivé sans explication : la validation se déclenche au clic
 * et nomme le champ qui manque. Un bouton mort est plus déroutant qu'un
 * message d'erreur.
 *
 * Le prix affiché ici n'est qu'un affichage. Le serveur retrouve le tarif
 * depuis le catalogue à partir du nom de la formule.
 */

type Mode = "orange_money" | "especes_boutique";

export function SouscriptionAbonnement({
  abonnement,
}: {
  readonly abonnement: Abonnement;
}) {
  const [etape, setEtape] = useState<0 | 1 | 2 | 3>(0);
  const [formuleNom, setFormuleNom] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [compte, setCompte] = useState("");
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [envoi, setEnvoi] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);
  const [ajouteAuPanier, setAjouteAuPanier] = useState(false);

  const ajouterLigne = usePanier((s) => s.ajouter);

  const ancre = useRef<HTMLDivElement>(null);
  const premierRendu = useRef(true);

  // On ramène l'utilisateur en haut du bloc à chaque changement d'étape :
  // l'écran suivant est souvent plus court, la page raccourcit sous lui et il
  // se retrouve face à du vide. Jamais au premier rendu, sinon la page saute
  // à l'arrivée.
  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    const noeud = ancre.current;
    if (!noeud) return;
    const y = noeud.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, [etape]);

  const formule = abonnement.formules.find((f) => f.nom === formuleNom);

  function effacerErreur(cle: string) {
    // L'erreur s'efface dès que le champ est corrigé. Laisser un message rouge
    // sous un champ désormais rempli donne l'impression que la correction n'a
    // pas été prise en compte.
    setErreurs((p) => {
      if (!p[cle]) return p;
      const suite = { ...p };
      delete suite[cle];
      return suite;
    });
  }

  function validerCompte(): boolean {
    const e: Record<string, string> = {};
    if (compte.trim().length < 3) {
      e.compte = `Indiquez le compte ${abonnement.nom} à activer.`;
    }
    if (nom.trim().length < 2) e.nom = "Indiquez votre nom.";
    if (tel.replace(/\D/g, "").length < 8) {
      e.tel = "Numéro incomplet, indicatif compris.";
    }
    setErreurs(e);
    return Object.keys(e).length === 0;
  }

  /**
   * Mise au panier. Passe par la même validation que la commande directe : un
   * abonnement sans compte à activer serait inexploitable en boutique, qu'il
   * arrive seul ou dans un panier de cinq lignes.
   */
  function ajouterAuPanier() {
    if (!validerCompte()) return;
    if (!formuleNom || !formule) return;

    ajouterLigne({
      id: idAbonnement(abonnement.slug, formuleNom, compte),
      type: "abonnement",
      slug: abonnement.slug,
      nom: abonnement.nom,
      prixXaf: formule.prixXaf,
      image: abonnement.logo,
      formuleNom: formule.nom,
      duree: DUREE_LABELS[formule.duree],
      compteIdentifiant: compte.trim(),
    });

    setAjouteAuPanier(true);
    window.setTimeout(() => setAjouteAuPanier(false), 2000);
  }

  async function envoyer() {
    if (!validerCompte()) return;
    if (!formuleNom || !mode) return;

    setEnvoi(true);
    setErreurServeur(null);

    const resultat = await creerSouscription({
      abonnementSlug: abonnement.slug,
      formuleNom,
      compteIdentifiant: compte,
      clientNom: nom,
      clientTel: tel,
      modePaiement: mode,
    });

    setEnvoi(false);

    if (resultat.ok) {
      setReference(resultat.reference);
      setEtape(3);
    } else {
      setErreurServeur(resultat.erreur);
    }
  }

  return (
    <div ref={ancre} className="flex flex-col gap-8">
      <Etapes courante={etape} />

      {/* ═══════════ 1. LA FORMULE ═══════════ */}
      {etape === 0 ? (
        <div className="flex flex-col gap-6">
          <EyebrowLabel>Choisissez votre formule</EyebrowLabel>

          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {abonnement.formules.map((f) => {
              const actif = formuleNom === f.nom;
              return (
                <li key={f.nom}>
                  <button
                    type="button"
                    onClick={() => setFormuleNom(f.nom)}
                    aria-pressed={actif}
                    className={cn(
                      "relative flex h-full w-full flex-col gap-4 rounded-frame border-[1.5px] bg-white p-7 text-left",
                      "transition-[border-color,transform] duration-200 ease-out-soft",
                      actif
                        ? "border-ink"
                        : "border-mist hover:-translate-y-0.5 hover:border-slate",
                    )}
                  >
                    {actif ? (
                      <span className="absolute top-5 right-5 grid size-6 place-items-center rounded-full bg-ink text-frost">
                        <Check size={14} strokeWidth={3} aria-hidden />
                      </span>
                    ) : null}

                    <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                      {f.nom}
                    </span>

                    <span className="flex flex-col gap-1">
                      <span className="text-[1.75rem] leading-none font-medium tracking-[-0.02em] text-ink tabular-nums">
                        {f.prixXaf === 0 ? "Gratuit" : formatXAF(f.prixXaf)}
                      </span>
                      {f.prixXaf > 0 ? (
                        <span className="text-[0.8125rem] text-slate">
                          {DUREE_LABELS[f.duree]}
                        </span>
                      ) : null}
                    </span>

                    <ul className="mt-auto flex flex-col gap-2 border-t border-mist/60 pt-4">
                      {f.inclus.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-graphite"
                        >
                          <Check
                            size={14}
                            aria-hidden
                            className="mt-0.5 shrink-0 text-brand"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              size="lg"
              onClick={() => {
                if (!formuleNom) {
                  setErreurs({ formule: "Choisissez une formule ci-dessus." });
                  return;
                }
                setErreurs({});
                setEtape(1);
              }}
              className="w-full sm:w-fit"
            >
              Continuer
              <ArrowRight size={17} aria-hidden />
            </Button>
            {erreurs.formule ? (
              <p className="text-[0.875rem] text-signal">{erreurs.formule}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ═══════════ 2. LE PAIEMENT ═══════════ */}
      {etape === 1 ? (
        <div className="flex flex-col gap-6">
          <Retour onClick={() => setEtape(0)}>Changer de formule</Retour>
          <EyebrowLabel>Comment souhaitez-vous payer ?</EyebrowLabel>

          <ul className="grid gap-4 sm:grid-cols-2">
            <li>
              <ChoixPaiement
                actif={mode === "orange_money"}
                onClick={() => setMode("orange_money")}
                icone={<Smartphone size={20} aria-hidden />}
                titre="Orange Money"
                detail={`Dépôt sur le ${COMPANY.phone}, puis envoi de la capture.`}
              />
            </li>
            <li>
              <ChoixPaiement
                actif={mode === "especes_boutique"}
                onClick={() => setMode("especes_boutique")}
                icone={<Store size={20} aria-hidden />}
                titre="Espèces en boutique"
                detail={`Règlement sur place, ${COMPANY.address}, avec votre référence.`}
              />
            </li>
          </ul>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              size="lg"
              onClick={() => {
                if (!mode) {
                  setErreurs({ mode: "Choisissez un mode de paiement." });
                  return;
                }
                setErreurs({});
                setEtape(2);
              }}
              className="w-full sm:w-fit"
            >
              Continuer
              <ArrowRight size={17} aria-hidden />
            </Button>
            {erreurs.mode ? (
              <p className="text-[0.875rem] text-signal">{erreurs.mode}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ═══════════ 3. LE COMPTE À ACTIVER ═══════════ */}
      {etape === 2 ? (
        <div className="flex flex-col gap-6">
          <Retour onClick={() => setEtape(1)}>Changer de paiement</Retour>
          <EyebrowLabel>Quel compte devons-nous activer ?</EyebrowLabel>

          <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
            <div className="flex flex-col gap-5 rounded-frame border border-mist/60 bg-white p-7">
              <Champ
                label={`Compte ${abonnement.nom}`}
                aide="Email ou identifiant du compte. Si vous n'en avez pas encore, indiquez l'email à utiliser, nous le créons."
                valeur={compte}
                onChange={(v) => {
                  setCompte(v);
                  effacerErreur("compte");
                }}
                error={erreurs.compte}
                autoComplete="email"
              />
              <Champ
                label="Votre nom"
                valeur={nom}
                onChange={(v) => {
                  setNom(v);
                  effacerErreur("nom");
                }}
                error={erreurs.nom}
                autoComplete="name"
              />
              <Champ
                label="Votre téléphone"
                aide="Pour vous prévenir dès que le compte est actif."
                valeur={tel}
                onChange={(v) => {
                  setTel(v);
                  effacerErreur("tel");
                }}
                error={erreurs.tel}
                autoComplete="tel"
                inputMode="tel"
              />
            </div>

            <aside className="flex flex-col gap-4 rounded-frame bg-ink p-7 text-white lg:sticky lg:top-32">
              <EyebrowLabel tone="frost">Votre commande</EyebrowLabel>
              <div className="flex flex-col gap-1">
                <span className="text-[0.8125rem] text-white/50">
                  {abonnement.nom}
                </span>
                <span className="text-[1.0625rem] font-medium">
                  {formule?.nom}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-white/15 pt-4">
                <span className="text-[0.875rem] text-white/60">À régler</span>
                <span className="text-[1.5rem] leading-none font-medium tabular-nums">
                  {formule && formule.prixXaf > 0
                    ? formatXAF(formule.prixXaf)
                    : "Gratuit"}
                </span>
              </div>
              <span className="text-[0.8125rem] leading-relaxed text-white/50">
                Activation {abonnement.delaiActivation.toLowerCase()}.
              </span>
            </aside>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                size="lg"
                onClick={envoyer}
                disabled={envoi}
                className="w-full sm:w-fit"
              >
                {envoi ? "Enregistrement…" : "Commander seulement ceci"}
                {envoi ? null : <ArrowRight size={17} aria-hidden />}
              </Button>

              {/* Le panier sert à grouper : quelqu'un qui prend Netflix et
                  Spotify ne doit pas passer deux fois par tout le parcours. */}
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={ajouterAuPanier}
                disabled={envoi}
                className="w-full sm:w-fit"
              >
                {ajouteAuPanier ? (
                  <>
                    <Check size={17} aria-hidden />
                    Ajouté au panier
                  </>
                ) : (
                  <>
                    <ShoppingBag size={17} aria-hidden />
                    Ajouter au panier
                  </>
                )}
              </Button>
            </div>

            {Object.keys(erreurs).length > 0 ? (
              <p className="text-[0.875rem] text-signal">
                Il manque {Object.keys(erreurs).length} information
                {Object.keys(erreurs).length > 1 ? "s" : ""} ci-dessus.
              </p>
            ) : null}

            {erreurServeur ? (
              <p className="rounded-action bg-signal/10 px-4 py-3 text-[0.875rem] leading-relaxed text-signal">
                {erreurServeur}{" "}
                <a href={PHONE_HREF} className="underline">
                  {COMPANY.phone}
                </a>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ═══════════ 4. LE PAIEMENT À EFFECTUER ═══════════ */}
      {etape === 3 && reference ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-success/10 text-success">
              <CircleCheck size={28} strokeWidth={1.75} aria-hidden />
            </span>
            <h3 className="text-display text-ink">Commande enregistrée.</h3>
            <p className="rounded-pill bg-ink px-6 py-3 text-title tracking-wide text-frost tabular-nums">
              {reference}
            </p>
          </div>

          <div className="flex flex-col gap-5 rounded-frame border border-mist/60 bg-white p-8">
            <EyebrowLabel>Ce qu&apos;il reste à faire</EyebrowLabel>

            {mode === "orange_money" ? (
              <>
                <p className="text-body text-graphite">
                  Effectuez le dépôt de{" "}
                  <strong className="font-medium text-ink">
                    {formule ? formatXAF(formule.prixXaf) : ""}
                  </strong>{" "}
                  sur notre numéro Orange Money :
                </p>
                <p className="inline-flex items-center gap-3 rounded-action bg-frost px-5 py-4 text-title text-ink tabular-nums">
                  <Smartphone size={20} aria-hidden />
                  {COMPANY.phone}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-graphite">
                  Envoyez ensuite la capture du dépôt par WhatsApp au même
                  numéro, en indiquant votre référence{" "}
                  <strong className="font-medium text-ink">{reference}</strong>.
                  Le compte est activé dès le paiement constaté.
                </p>
              </>
            ) : (
              <>
                <p className="text-body text-graphite">
                  Passez en boutique avec{" "}
                  <strong className="font-medium text-ink">
                    {formule ? formatXAF(formule.prixXaf) : ""}
                  </strong>{" "}
                  en espèces et votre référence en main.
                </p>
                <p className="inline-flex items-start gap-3 rounded-action bg-frost px-5 py-4 text-[1.0625rem] leading-snug font-medium text-ink">
                  <Store size={20} aria-hidden className="mt-0.5 shrink-0" />
                  {COMPANY.address}, {COMPANY.city}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-graphite">
                  Le compte est activé pendant que vous patientez, ou dans les
                  heures qui suivent selon l&apos;affluence.
                </p>
              </>
            )}

            <div className="flex flex-col gap-1 border-t border-mist/60 pt-5">
              <span className="text-[0.8125rem] text-slate">
                Compte à activer
              </span>
              <span className="text-[1.0625rem] text-ink">{compte}</span>
            </div>
          </div>

          <Button asChild size="lg" className="w-full sm:w-fit">
            <a href={PHONE_HREF}>
              <Banknote size={17} aria-hidden />
              Une question ? {COMPANY.phone}
            </a>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

/* ────────────────────────── pièces internes ────────────────────────── */

const TITRES = ["Formule", "Paiement", "Compte", "Confirmation"] as const;

function Etapes({ courante }: { readonly courante: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {TITRES.map((titre, i) => {
        const passee = i < courante;
        const active = i === courante;
        return (
          <li key={titre} className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-[0.8125rem]",
                active && "bg-ink text-frost",
                passee && "bg-ghost text-ink",
                !active && !passee && "text-slate",
              )}
            >
              {passee ? <Check size={13} strokeWidth={3} aria-hidden /> : null}
              {titre}
            </span>
            {i < TITRES.length - 1 ? (
              <span aria-hidden className="h-px w-5 bg-mist" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function Retour({
  onClick,
  children,
}: {
  readonly onClick: () => void;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 w-fit items-center gap-2 text-[0.9375rem] text-graphite transition-colors hover:text-ink"
    >
      <ArrowLeft size={16} aria-hidden />
      {children}
    </button>
  );
}

function ChoixPaiement({
  actif,
  onClick,
  icone,
  titre,
  detail,
}: {
  readonly actif: boolean;
  readonly onClick: () => void;
  readonly icone: React.ReactNode;
  readonly titre: string;
  readonly detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn(
        "relative flex h-full w-full flex-col gap-3 rounded-frame border-[1.5px] bg-white p-6 text-left",
        "transition-[border-color,transform] duration-200 ease-out-soft",
        actif
          ? "border-ink"
          : "border-mist hover:-translate-y-0.5 hover:border-slate",
      )}
    >
      {actif ? (
        <span className="absolute top-5 right-5 grid size-6 place-items-center rounded-full bg-ink text-frost">
          <Check size={14} strokeWidth={3} aria-hidden />
        </span>
      ) : null}
      <span className="text-ink">{icone}</span>
      <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
        {titre}
      </span>
      <span className="text-[0.9375rem] leading-relaxed text-graphite">
        {detail}
      </span>
    </button>
  );
}

function Champ({
  label,
  aide,
  valeur,
  onChange,
  error,
  autoComplete,
  inputMode,
}: {
  readonly label: string;
  readonly aide?: string;
  readonly valeur: string;
  readonly onChange: (v: string) => void;
  readonly error?: string | undefined;
  readonly autoComplete?: string;
  readonly inputMode?: "tel" | "email" | "text";
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[0.9375rem] font-medium text-ink">{label}</span>
      {aide ? (
        <span className="text-[0.8125rem] leading-relaxed text-slate">
          {aide}
        </span>
      ) : null}
      <input
        type="text"
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        className={cn(
          "min-h-12 rounded-action border-[1.5px] bg-white px-4 text-body text-ink",
          "transition-colors outline-none placeholder:text-slate",
          error ? "border-signal" : "border-mist focus:border-ink",
        )}
      />
      {error ? (
        <span className="text-[0.8125rem] text-signal">{error}</span>
      ) : null}
    </label>
  );
}
