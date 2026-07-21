import Link from "next/link";
import { ArrowRight, FileText, Receipt } from "lucide-react";
import { formatXAF } from "@/lib/format/currency";
import { formaterDate } from "@/features/devis/types";
import { listerMesDevis, type DevisEnListe } from "@/features/devis/actions";
import { cn } from "@/lib/utils/cn";

/**
 * MES DEVIS ET MES FACTURES
 *
 * Deux onglets sans JavaScript : la sélection passe par le paramètre `onglet`
 * de l'adresse. Un onglet est un état de navigation, pas un état local. Il se
 * partage, se met en favori et survit au rechargement, ce qu'un état React
 * perdrait à chaque fois.
 *
 * Les factures n'existent pas encore côté données. Plutôt que de masquer
 * l'onglet, on l'affiche en disant franchement où on en est : un onglet absent
 * laisse croire que la fonction n'est pas prévue.
 */
export async function MesDevis({ onglet }: { readonly onglet: string }) {
  const surFactures = onglet === "factures";
  const devis = surFactures ? [] : await listerMesDevis();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex gap-2">
        <Onglet href="/compte?onglet=devis" actif={!surFactures}>
          <FileText size={16} aria-hidden />
          Mes devis
        </Onglet>
        <Onglet href="/compte?onglet=factures" actif={surFactures}>
          <Receipt size={16} aria-hidden />
          Mes factures
        </Onglet>
      </div>

      {surFactures ? (
        <VideExplique
          titre="Pas encore de facture."
          texte="La facturation arrive après la validation des devis. Un devis accepté deviendra une facture ici."
        />
      ) : devis.length === 0 ? (
        <VideExplique
          titre="Aucun devis enregistré."
          texte="Composez un devis, il apparaîtra ici. Vous pourrez le reprendre là où vous vous êtes arrêté."
          action={{ href: "/devis", label: "Établir un devis" }}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {devis.map((d) => (
            <li key={d.reference}>
              <CarteDevis devis={d} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ────────────────────────── pièces ────────────────────────── */

const LIBELLES_STATUT: Record<string, string> = {
  brouillon: "Brouillon",
  emis: "Émis",
  accepte: "Accepté",
  refuse: "Refusé",
  expire: "Expiré",
};

function CarteDevis({ devis }: { readonly devis: DevisEnListe }) {
  // Un devis dont la date de validité est passée est signalé, même si son
  // statut en base n'a pas encore été mis à jour : la date fait foi, pas le
  // champ, qui dépend d'un traitement différé.
  const perime = devis.valableJusquau
    ? new Date(devis.valableJusquau) < new Date()
    : false;

  return (
    <Link
      href={`/devis?reprendre=${devis.reference}`}
      className="group/devis flex flex-wrap items-center gap-4 rounded-frame border border-mist/60 bg-white p-6 transition-[border-color,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-slate"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2.5">
          <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
            {devis.clientNom || "Sans nom"}
          </span>
          <span
            className={cn(
              "rounded-pill px-2.5 py-0.5 text-[0.6875rem] font-bold tracking-[0.04em] uppercase",
              perime
                ? "bg-signal/10 text-signal"
                : "bg-ghost text-graphite",
            )}
          >
            {perime ? "Expiré" : (LIBELLES_STATUT[devis.statut] ?? devis.statut)}
          </span>
        </span>
        <span className="text-[0.875rem] text-slate tabular-nums">
          {devis.reference}
          {devis.emisLe ? ` · ${formaterDate(devis.emisLe)}` : ""}
          {devis.valableJusquau
            ? ` · valable jusqu'au ${formaterDate(devis.valableJusquau)}`
            : ""}
        </span>
      </span>

      <span className="shrink-0 text-[1.125rem] font-medium text-ink tabular-nums">
        {formatXAF(devis.totalXaf)}
      </span>

      <ArrowRight
        size={17}
        aria-hidden
        className="shrink-0 text-slate transition-transform duration-200 ease-out-soft group-hover/devis:translate-x-1 group-hover/devis:text-ink"
      />
    </Link>
  );
}

function Onglet({
  href,
  actif,
  children,
}: {
  readonly href: string;
  readonly actif: boolean;
  readonly children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={actif ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-pill px-5 text-[0.9375rem] font-medium transition-colors",
        actif
          ? "bg-ink text-frost"
          : "bg-ghost text-graphite hover:bg-mist/60 hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}

function VideExplique({
  titre,
  texte,
  action,
}: {
  readonly titre: string;
  readonly texte: string;
  readonly action?: { readonly href: string; readonly label: string };
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-frame border border-mist/60 bg-white px-8 py-12">
      <p className="text-title text-ink">{titre}</p>
      <p className="max-w-md text-body leading-relaxed text-graphite">
        {texte}
      </p>
      {action ? (
        <Link
          href={action.href}
          className="mt-2 inline-flex min-h-12 items-center gap-2 rounded-action bg-ink px-6 text-[0.9375rem] font-medium text-frost transition-colors hover:bg-charcoal"
        >
          {action.label}
          <ArrowRight size={16} aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
