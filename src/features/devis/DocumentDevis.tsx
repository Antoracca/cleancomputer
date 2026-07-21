"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { COMPANY } from "@/lib/config/company";
import { formatXAF } from "@/lib/format/currency";
import {
  calculerTotaux,
  dateEcheance,
  formaterDate,
  montantLigne,
  nomClient,
  prixUnitaire,
  type Devis,
  type LigneDevis,
} from "@/features/devis/types";
import {
  MARGE_MM,
  PAGE_MM,
  PIED_LEGAL_MM,
  pxVersMm,
  repartirEnPages,
} from "@/features/devis/pagination";
import { cn } from "@/lib/utils/cn";

/**
 * LE DOCUMENT
 *
 * Une seule mise en page sert d'aperçu à l'écran ET de document imprimé. Il
 * n'existe pas de « version PDF » séparée : ce que l'utilisateur voit est
 * littéralement ce qui sort de l'imprimante, au millimètre.
 *
 * La pagination est mesurée, pas devinée. Chaque ligne est rendue une fois
 * dans un calque de mesure invisible, sa hauteur réelle est relevée, puis les
 * lignes sont réparties en pages. C'est le seul moyen d'être exact quand les
 * désignations font une ou quatre lignes selon les articles.
 *
 * Conséquence directe : aucune ligne coupée en deux, aucun texte par-dessus le
 * pied de page, et un « page 2 sur 3 » qui dit la vérité.
 */

/** Place réservée en bas de la dernière page : totaux + zone de signature. */
const RESERVE_TOTAUX_MM = 78;

export function DocumentDevis({
  devis,
  zoom = 1,
  compact = false,
}: {
  readonly devis: Devis;
  readonly zoom?: number;
  readonly compact?: boolean;
}) {
  const mesure = useRef<HTMLDivElement>(null);
  const mesureEntete = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number[][]>([
    devis.lignes.map((_, i) => i),
  ]);

  // `useLayoutEffect` et non `useEffect` : la répartition doit être faite
  // avant la peinture, sinon l'utilisateur voit une page unique interminable
  // se découper sous ses yeux à chaque frappe.
  //
  // La dépendance porte sur `devis` entier, pas seulement sur les lignes : le
  // bloc destinataire grandit quand on saisit une adresse longue ou un NIU, ce
  // qui réduit la place disponible sur la page 1.
  useLayoutEffect(() => {
    const noeud = mesure.current;
    if (!noeud) return;

    const hauteurs = Array.from(noeud.children).map((enfant) =>
      pxVersMm((enfant as HTMLElement).getBoundingClientRect().height),
    );

    const enteteMm = mesureEntete.current
      ? pxVersMm(mesureEntete.current.getBoundingClientRect().height)
      : undefined;

    setPages(repartirEnPages(hauteurs, RESERVE_TOTAUX_MM, enteteMm));
  }, [devis, compact]);

  const totaux = calculerTotaux(devis);
  const nbPages = pages.length;

  return (
    <>
      {/* Calque de mesure : hors flux, invisible, jamais imprimé. Il porte la
          même largeur de colonne que le document réel, sans quoi les hauteurs
          relevées ne vaudraient rien. */}
      <div
        aria-hidden
        className="pointer-events-none invisible absolute -z-10 print:hidden"
        style={{ width: `${PAGE_MM.largeur - MARGE_MM * 2}mm` }}
      >
        {/* Tout ce qui occupe la page 1 AVANT la première ligne est mesuré
            ensemble : l'en-tête, dont la hauteur dépend de ce que le client a
            saisi, et la tête de tableau, qui ne figure que sur cette page. */}
        <div ref={mesureEntete}>
          <EnteteComplete devis={devis} mesure />
          <TeteTableau compact={compact} />
        </div>

        <div ref={mesure}>
          {devis.lignes.map((ligne, i) => (
            <LigneTableau
              key={ligne.id}
              ligne={ligne}
              rang={i + 1}
              compact={compact}
            />
          ))}
        </div>
      </div>

      <div
        className="flex flex-col items-center gap-6 print:block print:gap-0"
        style={{ zoom }}
      >
        {pages.map((indices, rang) => (
          <article
            key={rang}
            className={cn(
              "relative flex flex-col bg-white text-ink",
              "shadow-[0_8px_32px_-12px_rgba(15,21,32,0.25)] print:shadow-none",
              // `break-after` plutôt qu'une marge : c'est la règle que
              // l'imprimante comprend.
              "print:break-after-page print:last:break-after-auto",
            )}
            style={{
              width: `${PAGE_MM.largeur}mm`,
              height: `${PAGE_MM.hauteur}mm`,
              padding: `${MARGE_MM}mm`,
            }}
          >
            {rang === 0 ? (
              <EnteteComplete devis={devis} />
            ) : (
              <BandeauSuite devis={devis} />
            )}

            <div className="flex-1 overflow-hidden">
              {rang === 0 ? <TeteTableau compact={compact} /> : null}
              {indices.map((i) => {
                const ligne = devis.lignes[i];
                if (!ligne) return null;
                return (
                  <LigneTableau
                    key={ligne.id}
                    ligne={ligne}
                    rang={i + 1}
                    compact={compact}
                  />
                );
              })}

              {rang === nbPages - 1 ? (
                <BlocTotaux devis={devis} totaux={totaux} />
              ) : null}
            </div>

            {rang === 0 ? (
              <PiedLegal page={1} total={nbPages} />
            ) : (
              <PiedSuite page={rang + 1} total={nbPages} />
            )}
          </article>
        ))}
      </div>
    </>
  );
}

/* ══════════════════════════ EN-TÊTE ══════════════════════════ */

function EnteteComplete({
  devis,
  mesure = false,
}: {
  readonly devis: Devis;
  /** Rendu dans le calque de mesure : le logo n'y est pas prioritaire, sinon
   *  Next chargerait deux fois la même image en priorité haute. */
  readonly mesure?: boolean;
}) {
  const client = nomClient(devis.client);

  return (
    <header className="mb-5 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-8">
        <div className="flex flex-col gap-2">
          <div className="relative h-[14mm] w-[46mm]">
            <Image
              src="/brand/logo-full.png"
              alt={COMPANY.tradeName}
              fill
              sizes="180px"
              className="object-contain object-left"
              priority={!mesure}
            />
          </div>
          <p className="text-[7.5pt] leading-[1.5] text-[#4b5563]">
            {COMPANY.address}, {COMPANY.city}
            <br />
            {COMPANY.country}
            <br />
            {COMPANY.phone}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[17pt] leading-none font-bold tracking-[-0.02em]">
            DEVIS
          </p>
          <p className="mt-1 text-[10pt] font-medium tabular-nums">
            {devis.reference}
          </p>
          <table className="mt-3 ml-auto text-[7.5pt] leading-[1.6]">
            <tbody>
              <tr>
                <td className="pr-3 text-[#697586]">Émis le</td>
                <td className="text-right font-medium">
                  {formaterDate(devis.emisLe)}
                </td>
              </tr>
              <tr>
                <td className="pr-3 text-[#697586]">Valable jusqu&apos;au</td>
                <td className="text-right font-medium">
                  {formaterDate(dateEcheance(devis))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Destinataire */}
      <div className="flex justify-end">
        <div className="w-[78mm] border border-[#cbd3df] p-3">
          <p className="text-[6.5pt] font-bold tracking-[0.08em] text-[#697586] uppercase">
            {devis.client.type === "entreprise" ? "Client" : "Destinataire"}
          </p>
          <p className="mt-1.5 text-[10pt] font-bold">
            {client || "Nom du client"}
          </p>
          {devis.client.type === "entreprise" && devis.client.contact ? (
            <p className="text-[8pt] text-[#4b5563]">
              À l&apos;attention de {devis.client.contact}
            </p>
          ) : null}
          {/* Une information par ligne. Agglomérées avec des points médians,
              adresse, téléphone et email formaient un bloc qu'on relit deux
              fois pour trouver le numéro. */}
          <dl className="mt-2 flex flex-col gap-0.5 text-[8pt] leading-[1.45]">
            {devis.client.adresse ? (
              <LigneDestinataire label="Adresse" valeur={devis.client.adresse} />
            ) : null}
            {devis.client.telephone ? (
              <LigneDestinataire
                label="Téléphone"
                valeur={devis.client.telephone}
              />
            ) : null}
            {devis.client.email ? (
              <LigneDestinataire label="Email" valeur={devis.client.email} />
            ) : null}
            {devis.client.type === "entreprise" && devis.client.niu ? (
              <LigneDestinataire label="NIU" valeur={devis.client.niu} />
            ) : null}
          </dl>
        </div>
      </div>
    </header>
  );
}

function LigneDestinataire({
  label,
  valeur,
}: {
  readonly label: string;
  readonly valeur: string;
}) {
  return (
    <div className="flex gap-2">
      <dt className="w-[16mm] shrink-0 text-[#697586]">{label}</dt>
      <dd className="min-w-0 flex-1 break-words text-[#1f2937]">{valeur}</dd>
    </div>
  );
}

/**
 * Pages 2 et suivantes. L'en-tête complet ne se répète pas, mais la référence
 * si : un devis multipage se sépare, et une page isolée sans référence ni
 * émetteur devient un papier anonyme impossible à rattacher.
 */
function BandeauSuite({ devis }: { readonly devis: Devis }) {
  return (
    <header className="mb-4 flex items-baseline justify-between border-b border-[#cbd3df] pb-2">
      <span className="text-[8pt] font-bold tracking-[-0.01em]">
        {COMPANY.tradeName}
      </span>
      <span className="text-[8pt] text-[#697586] tabular-nums">
        Devis {devis.reference} · {nomClient(devis.client) || "Client"}
      </span>
    </header>
  );
}

/* ══════════════════════════ TABLEAU ══════════════════════════ */

const COLONNES = "6mm 1fr 16mm 24mm 26mm";

function TeteTableau({ compact }: { readonly compact: boolean }) {
  return (
    <div
      className={cn(
        "grid items-end gap-2 border-b-2 border-ink pb-1.5 text-[6.5pt] font-bold tracking-[0.06em] text-[#4b5563] uppercase",
        compact ? "mb-1" : "mb-2",
      )}
      style={{ gridTemplateColumns: COLONNES }}
    >
      <span>#</span>
      <span>Désignation</span>
      <span className="text-right">Qté</span>
      <span className="text-right">P. unitaire</span>
      <span className="text-right">Montant</span>
    </div>
  );
}

function LigneTableau({
  ligne,
  rang,
  compact,
}: {
  readonly ligne: LigneDevis;
  readonly rang: number;
  readonly compact: boolean;
}) {
  const unitaire = prixUnitaire(ligne);

  return (
    <div
      className={cn(
        "grid gap-2 border-b border-[#e4e9f2] text-[8.5pt]",
        // `break-inside-avoid` en filet de sécurité : la pagination mesurée
        // fait déjà le travail, mais si une police se charge en retard côté
        // imprimante, cette règle évite une coupure au milieu d'une ligne.
        "break-inside-avoid",
        compact ? "py-1" : "py-1.5",
      )}
      style={{ gridTemplateColumns: COLONNES }}
    >
      <span className="text-[#697586] tabular-nums">{rang}</span>

      <span className="flex flex-col gap-0.5">
        <span className="font-medium">{ligne.designation}</span>
        {ligne.marque && ligne.source !== "libre" ? (
          <span className="text-[7pt] text-[#697586]">{ligne.marque}</span>
        ) : null}
        {!compact && ligne.detail ? (
          <span className="text-[7pt] leading-[1.45] text-[#4b5563]">
            {ligne.detail}
          </span>
        ) : null}
        {ligne.options.length > 0 ? (
          <span className="text-[7pt] leading-[1.45] text-[#4b5563]">
            {ligne.options.map((o) => o.label).join(" · ")}
          </span>
        ) : null}
        {ligne.remisePct > 0 ? (
          <span className="text-[7pt] font-medium text-[#c2410c]">
            Remise {ligne.remisePct} %
          </span>
        ) : null}
      </span>

      <span className="text-right tabular-nums">{ligne.quantite}</span>
      <span className="text-right tabular-nums">{formatXAF(unitaire)}</span>
      <span className="text-right font-medium tabular-nums">
        {formatXAF(montantLigne(ligne))}
      </span>
    </div>
  );
}

/* ══════════════════════════ TOTAUX ══════════════════════════ */

function BlocTotaux({
  devis,
  totaux,
}: {
  readonly devis: Devis;
  readonly totaux: ReturnType<typeof calculerTotaux>;
}) {
  return (
    <div className="mt-5 flex flex-col gap-4 break-inside-avoid">
      <div className="flex justify-end">
        <table className="w-[74mm] text-[8.5pt]">
          <tbody>
            <Total label="Sous-total" valeur={totaux.sousTotalXaf} />
            {totaux.remiseLignesXaf > 0 ? (
              <Total
                label="Remises par ligne"
                valeur={-totaux.remiseLignesXaf}
              />
            ) : null}
            {totaux.remiseGlobaleXaf > 0 ? (
              <Total
                label={`Remise commerciale ${devis.remiseGlobalePct} %`}
                valeur={-totaux.remiseGlobaleXaf}
              />
            ) : null}
            <tr>
              <td className="border-t-2 border-ink pt-2 text-[10pt] font-bold">
                Total à payer
              </td>
              <td className="border-t-2 border-ink pt-2 text-right text-[12pt] font-bold tabular-nums">
                {formatXAF(totaux.totalXaf)}
              </td>
            </tr>
            {devis.acomptePct > 0 ? (
              <>
                <Total
                  label={`Acompte à la commande (${devis.acomptePct} %)`}
                  valeur={totaux.acompteXaf}
                />
                <Total label="Solde à la livraison" valeur={totaux.soldeXaf} />
              </>
            ) : null}
          </tbody>
        </table>
      </div>

      {devis.notes.trim() ? (
        <div className="border-l-2 border-[#cbd3df] pl-3">
          <p className="text-[6.5pt] font-bold tracking-[0.08em] text-[#697586] uppercase">
            Précisions
          </p>
          <p className="mt-1 text-[8pt] leading-[1.5] whitespace-pre-line text-[#4b5563]">
            {devis.notes}
          </p>
        </div>
      ) : null}

      {/* Zone d'acceptation. Un devis qu'on ne peut pas signer n'engage
          personne et oblige à un aller-retour de plus. */}
      <div className="flex gap-4">
        <div className="flex-1 border border-[#cbd3df] p-3">
          <p className="text-[7.5pt] font-bold">Bon pour accord</p>
          <p className="mt-0.5 text-[7pt] text-[#697586]">
            Date, signature et cachet du client
          </p>
          <div className="h-[16mm]" />
        </div>
        <div className="w-[52mm] border border-[#cbd3df] p-3">
          <p className="text-[7.5pt] font-bold">{COMPANY.tradeName}</p>
          <p className="mt-0.5 text-[7pt] text-[#697586]">Le représentant</p>
          <div className="h-[16mm]" />
        </div>
      </div>
    </div>
  );
}

function Total({
  label,
  valeur,
}: {
  readonly label: string;
  readonly valeur: number;
}) {
  return (
    <tr>
      <td className="py-0.5 text-[#4b5563]">{label}</td>
      <td className="py-0.5 text-right tabular-nums">
        {valeur < 0 ? `− ${formatXAF(Math.abs(valeur))}` : formatXAF(valeur)}
      </td>
    </tr>
  );
}

/* ══════════════════════════ PIEDS DE PAGE ══════════════════════════ */

function PiedLegal({
  page,
  total,
}: {
  readonly page: number;
  readonly total: number;
}) {
  return (
    <footer
      className="mt-auto border-t border-[#cbd3df] pt-2"
      style={{ minHeight: `${PIED_LEGAL_MM}mm` }}
    >
      {/* Le nom patronymique du gérant n'a pas à figurer ici. L'enseigne, le
          NIU et le RCCM suffisent à identifier l'émetteur, et c'est l'enseigne
          que le client connaît. */}
      <p className="text-[6.5pt] leading-[1.55] text-[#697586]">
        <strong className="text-[#0148b2]">{COMPANY.tradeName}</strong> ·{" "}
        {COMPANY.legalForm} · {COMPANY.activity}
        <br />
        NIU {COMPANY.niu} · RCCM {COMPANY.rccm} · {COMPANY.address},{" "}
        {COMPANY.city}, {COMPANY.country} · {COMPANY.phone}
      </p>
      <p className="mt-1.5 text-[6.5pt] leading-[1.55] text-[#697586]">
        Montants exprimés en francs CFA (XAF). Devis gratuit et sans
        engagement, valable jusqu&apos;à la date indiquée ci-dessus. Passé ce
        délai, les prix sont susceptibles d&apos;être révisés. La commande vaut
        acceptation du présent devis.
      </p>
      <div className="mt-1 flex items-baseline justify-between gap-4">
        <span className="text-[6.5pt] font-bold text-[#0148b2]">
          {COMPANY.tradeName}
        </span>
        <span className="text-[6.5pt] text-[#697586] tabular-nums">
          Page {page} sur {total}
        </span>
      </div>
    </footer>
  );
}

function PiedSuite({
  page,
  total,
}: {
  readonly page: number;
  readonly total: number;
}) {
  return (
    <footer className="mt-auto border-t border-[#cbd3df] pt-2">
      <p className="text-right text-[6.5pt] text-[#697586] tabular-nums">
        Page {page} sur {total}
      </p>
    </footer>
  );
}
