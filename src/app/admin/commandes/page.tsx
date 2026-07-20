import type { Metadata } from "next";
import { formatXAF } from "@/lib/format/currency";
import { createClient } from "@/lib/supabase/server";
import { changerStatutCommande } from "@/features/admin/actions";
import { STATUT_LABELS, StatutPill } from "@/features/admin/StatutPill";

export const metadata: Metadata = {
  title: "Commandes · Administration",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/**
 * GESTION DES COMMANDES
 *
 * Le changement de statut est un <form> avec action serveur : fonctionne sans
 * une ligne de JavaScript client, donc même sur la connexion la plus fragile.
 * La liste déroulante soumet directement — un geste, pas trois.
 */
export default async function AdminCommandesPage() {
  const supabase = await createClient();

  const { data: commandes } = await supabase
    .from("commandes")
    .select(
      "id, reference, statut, total_xaf, telephone, adresse, created_at, commande_lignes(libelle_fige, quantite)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-display text-ink">Commandes</h1>

      {(commandes ?? []).length === 0 ? (
        <p className="rounded-frame border border-mist/60 bg-white px-6 py-10 text-body text-graphite">
          Aucune commande enregistrée pour le moment.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {(commandes ?? []).map((commande) => (
            <li
              key={commande.id}
              className="flex flex-col gap-5 rounded-frame border border-mist/60 bg-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="text-[1.0625rem] font-medium text-ink tabular-nums">
                    {commande.reference}
                  </span>
                  <StatutPill statut={commande.statut} />
                </div>
                <span className="text-[0.875rem] text-slate">
                  {new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(commande.created_at))}
                </span>
              </div>

              <div className="grid gap-4 text-[0.9375rem] sm:grid-cols-3">
                <div>
                  <p className="text-[0.75rem] text-slate uppercase">Contenu</p>
                  <ul className="mt-1 text-graphite">
                    {(commande.commande_lignes ?? []).map((l, i) => (
                      <li key={i}>
                        {l.quantite} × {l.libelle_fige}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[0.75rem] text-slate uppercase">Client</p>
                  <p className="mt-1 text-graphite tabular-nums">{commande.telephone}</p>
                  <p className="text-graphite">{commande.adresse}</p>
                </div>
                <div>
                  <p className="text-[0.75rem] text-slate uppercase">Total</p>
                  <p className="mt-1 font-medium text-ink tabular-nums">
                    {formatXAF(commande.total_xaf)}
                  </p>
                </div>
              </div>

              {/* Changement de statut — formulaire pur, zéro JS requis */}
              <form
                action={changerStatutCommande}
                className="flex flex-wrap items-center gap-3 border-t border-mist/50 pt-4"
              >
                <input type="hidden" name="id" value={commande.id} />
                <label
                  htmlFor={`statut-${commande.id}`}
                  className="text-[0.875rem] text-graphite"
                >
                  Passer au statut :
                </label>
                <select
                  id={`statut-${commande.id}`}
                  name="statut"
                  defaultValue={commande.statut}
                  className="min-h-11 rounded-pill border border-mist bg-white px-4 text-[0.9375rem] text-ink"
                >
                  {Object.entries(STATUT_LABELS).map(([valeur, label]) => (
                    <option key={valeur} value={valeur}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center rounded-action border-[1.5px] border-ink bg-ink px-5 text-[0.9375rem] font-medium text-frost transition-colors hover:bg-charcoal"
                >
                  Appliquer
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
