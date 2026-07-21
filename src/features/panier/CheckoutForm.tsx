"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { formatXAF } from "@/lib/format/currency";
import { totalPanier, usePanier } from "@/features/panier/store";
import { creerCommande } from "@/features/panier/actions";
import { cn } from "@/lib/utils/cn";
import {
  validatePhone,
  validateRequired,
  type FieldErrors,
} from "@/features/auth/validation";

const LIVRAISON_XAF = 2000;

/**
 * TUNNEL DE COMMANDE — une seule étape
 *
 * Trois champs et deux choix : sur mobile avec un réseau instable, chaque
 * étape supplémentaire est un abandon potentiel. Le paiement se fait à la
 * remise (retrait ou livraison) — c'est le mode dominant à Bangui, le
 * paiement en ligne s'ajoutera par-dessus sans changer ce parcours.
 */
export function CheckoutForm() {
  const router = useRouter();
  const lignes = usePanier((s) => s.lignes);
  const vider = usePanier((s) => s.vider);

  const [mode, setMode] = useState<"retrait" | "livraison">("retrait");
  const [values, setValues] = useState({ nom: "", telephone: "", adresse: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);

  if (lignes.length === 0 && !pending) {
    return (
      <div className="flex flex-col items-start gap-6 rounded-frame border border-mist/60 bg-white px-8 py-14">
        <h2 className="text-title text-ink">Rien à commander pour l&apos;instant.</h2>
        <Button asChild size="lg">
          <Link href="/electronique">Parcourir la boutique</Link>
        </Button>
      </div>
    );
  }

  const sousTotal = totalPanier(lignes);
  const livraison = mode === "livraison" ? LIVRAISON_XAF : 0;

  function set(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErreurServeur(null);

    const next: FieldErrors = {};
    const nomErr = validateRequired(values.nom, "Votre nom");
    const telErr = validatePhone(values.telephone);
    if (nomErr) next.nom = nomErr;
    if (telErr) next.telephone = telErr;
    if (mode === "livraison") {
      const adrErr = validateRequired(values.adresse, "L'adresse de livraison");
      if (adrErr) next.adresse = adrErr;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);

    const resultat = await creerCommande({
      // Le serveur retrouve chaque prix lui-même, dans la table produits ou
      // dans le catalogue d'abonnements selon le type. On ne lui envoie que de
      // quoi identifier la ligne.
      articles: lignes.map((l) =>
        l.type === "abonnement"
          ? {
              type: "abonnement" as const,
              slug: l.slug,
              formuleNom: l.formuleNom ?? "",
              compteIdentifiant: l.compteIdentifiant ?? "",
              quantite: 1,
            }
          : { type: "produit" as const, slug: l.slug, quantite: l.quantite },
      ),
      nom: values.nom,
      telephone: values.telephone,
      mode,
      ...(mode === "livraison" && { adresse: values.adresse }),
    });

    if (!resultat.ok) {
      setPending(false);
      setErreurServeur(resultat.erreur);
      return;
    }

    vider();
    router.push(`/commande/${resultat.reference}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-16"
    >
      <div className="flex flex-col gap-8">
        {/* Mode de remise */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-[0.875rem] font-medium text-ink">
            Comment récupérer votre commande ?
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <ModeCard
              actif={mode === "retrait"}
              onClick={() => setMode("retrait")}
              icone={<Store size={19} strokeWidth={1.75} aria-hidden />}
              titre="Retrait en boutique"
              detail="Avenue Mubutu, Bangui — gratuit"
            />
            <ModeCard
              actif={mode === "livraison"}
              onClick={() => setMode("livraison")}
              icone={<Truck size={19} strokeWidth={1.75} aria-hidden />}
              titre="Livraison à Bangui"
              detail={`${formatXAF(LIVRAISON_XAF)} — sous 24 h`}
            />
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Votre nom" htmlFor="nom" error={errors.nom}>
            <Input
              id="nom"
              autoComplete="name"
              value={values.nom}
              invalid={Boolean(errors.nom)}
              onChange={(e) => set("nom", e.target.value)}
            />
          </Field>
          <Field
            label="Téléphone"
            htmlFor="telephone"
            hint="Pour vous prévenir quand c'est prêt."
            error={errors.telephone}
          >
            <Input
              id="telephone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+236 70 00 00 00"
              value={values.telephone}
              invalid={Boolean(errors.telephone)}
              onChange={(e) => set("telephone", e.target.value)}
            />
          </Field>
        </div>

        {mode === "livraison" ? (
          <Field
            label="Adresse de livraison"
            htmlFor="adresse"
            hint="Quartier, rue, point de repère."
            error={errors.adresse}
          >
            <Textarea
              id="adresse"
              value={values.adresse}
              onChange={(e) => set("adresse", e.target.value)}
              className="min-h-24"
            />
          </Field>
        ) : null}

        {erreurServeur ? (
          <p
            role="alert"
            className="rounded-action border border-danger/30 bg-white px-5 py-4 text-[0.9375rem] text-danger"
          >
            {erreurServeur}
          </p>
        ) : null}
      </div>

      {/* Récapitulatif */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-5 rounded-frame bg-ink p-8 text-white">
          <h2 className="text-title">Votre commande</h2>
          <ul className="flex flex-col gap-2 border-b border-white/15 pb-5">
            {lignes.map((l) => (
              <li
                key={l.id}
                className="flex justify-between gap-3 text-[0.875rem]"
              >
                <span className="text-white/70">
                  {l.type === "abonnement"
                    ? `${l.nom} · ${l.formuleNom}`
                    : `${l.quantite} × ${l.nom}`}
                </span>
                <span className="shrink-0 tabular-nums">
                  {formatXAF(l.prixXaf * l.quantite)}
                </span>
              </li>
            ))}
            <li className="flex justify-between gap-3 text-[0.875rem]">
              <span className="text-white/70">Livraison</span>
              <span className="tabular-nums">
                {livraison === 0 ? "Gratuit" : formatXAF(livraison)}
              </span>
            </li>
          </ul>
          <div className="flex items-baseline justify-between">
            <span className="text-body">Total à payer</span>
            <span className="text-title tabular-nums">
              {formatXAF(sousTotal + livraison)}
            </span>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="w-full border-white bg-white text-ink hover:border-white/80 hover:bg-white/90"
          >
            {pending ? (
              <>
                <Loader2 size={17} aria-hidden className="animate-spin" />
                Enregistrement…
              </>
            ) : (
              "Confirmer la commande"
            )}
          </Button>
          <p className="text-[0.75rem] leading-relaxed text-white/40">
            Paiement en espèces à la remise. Aucun prélèvement en ligne.
          </p>
        </div>
      </aside>
    </form>
  );
}

function ModeCard({
  actif,
  onClick,
  icone,
  titre,
  detail,
}: {
  actif: boolean;
  onClick: () => void;
  icone: React.ReactNode;
  titre: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn(
        "flex items-start gap-4 rounded-frame border bg-white p-5 text-left transition-colors duration-200",
        actif ? "border-ink" : "border-mist/60 hover:border-slate",
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full transition-colors",
          actif ? "bg-ink text-frost" : "bg-ghost text-slate",
        )}
      >
        {icone}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[0.9375rem] font-medium text-ink">{titre}</span>
        <span className="text-[0.8125rem] text-graphite">{detail}</span>
      </span>
    </button>
  );
}
