import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { formatXAF } from "@/lib/format/currency";
import { createClient } from "@/lib/supabase/server";
import { STATUT_LABELS, StatutPill } from "@/features/admin/StatutPill";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/**
 * VUE D'ENSEMBLE
 *
 * Les quatre chiffres qui comptent au quotidien, puis les commandes à traiter.
 * Requêtes en `count` planifiées en parallèle — un tableau de bord lent ne
 * sert à rien.
 */
export default async function AdminHomePage() {
  const supabase = await createClient();

  const [commandesTotal, commandesAttente, produitsActifs, clients, recentes] =
    await Promise.all([
      supabase.from("commandes").select("*", { count: "exact", head: true }),
      supabase
        .from("commandes")
        .select("*", { count: "exact", head: true })
        .in("statut", ["en_attente", "payee", "preparation"]),
      supabase
        .from("produits")
        .select("*", { count: "exact", head: true })
        .eq("actif", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("commandes")
        .select("id, reference, statut, total_xaf, telephone, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  const stats = [
    { label: "Commandes à traiter", valeur: commandesAttente.count ?? 0, alerte: (commandesAttente.count ?? 0) > 0 },
    { label: "Commandes au total", valeur: commandesTotal.count ?? 0, alerte: false },
    { label: "Produits actifs", valeur: produitsActifs.count ?? 0, alerte: false },
    { label: "Comptes clients", valeur: clients.count ?? 0, alerte: false },
  ];

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-display text-ink">Vue d&apos;ensemble</h1>

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 rounded-frame border border-mist/60 bg-white p-6"
          >
            <dt className="text-[0.8125rem] text-slate">{stat.label}</dt>
            <dd
              className={`text-[2rem] leading-none font-medium tracking-[-0.02em] tabular-nums ${
                stat.alerte ? "text-brand" : "text-ink"
              }`}
            >
              {stat.valeur}
            </dd>
          </div>
        ))}
      </dl>

      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <EyebrowLabel>Dernières commandes</EyebrowLabel>
          <Link
            href="/admin/commandes"
            className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-brand transition-colors hover:text-brand-deep"
          >
            Tout voir
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        {(recentes.data ?? []).length === 0 ? (
          <p className="rounded-frame border border-mist/60 bg-white px-6 py-10 text-body text-graphite">
            Aucune commande pour le moment. Dès qu&apos;un client commandera,
            elle apparaîtra ici.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-frame border border-mist/60 bg-white">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-mist/60">
                  <Th>Référence</Th>
                  <Th>Date</Th>
                  <Th>Téléphone</Th>
                  <Th>Statut</Th>
                  <Th className="text-right">Total</Th>
                </tr>
              </thead>
              <tbody>
                {(recentes.data ?? []).map((commande) => (
                  <tr
                    key={commande.id}
                    className="border-b border-mist/40 last:border-0"
                  >
                    <td className="px-5 py-3.5 font-medium text-ink tabular-nums">
                      {commande.reference}
                    </td>
                    <td className="px-5 py-3.5 text-[0.875rem] text-graphite">
                      {new Intl.DateTimeFormat("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(commande.created_at))}
                    </td>
                    <td className="px-5 py-3.5 text-[0.875rem] text-graphite tabular-nums">
                      {commande.telephone}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatutPill statut={commande.statut} />
                    </td>
                    <td className="px-5 py-3.5 text-right text-ink tabular-nums">
                      {formatXAF(commande.total_xaf)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-[0.8125rem] text-slate">
        Statuts possibles : {Object.values(STATUT_LABELS).join(" · ")}
      </p>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-5 py-3.5 text-eyebrow font-bold text-slate uppercase ${className}`}
    >
      {children}
    </th>
  );
}
