"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/shared/PriceTag";
import { formatXAF } from "@/lib/format/currency";
import { totalPanier, usePanier } from "@/features/panier/store";

/**
 * VUE PANIER
 *
 * Tout est local et instantané : changer une quantité ou retirer une ligne ne
 * déclenche aucune requête. Le serveur ne voit le panier qu'au moment de
 * commander.
 */
export function CartView() {
  const lignes = usePanier((s) => s.lignes);
  const changerQuantite = usePanier((s) => s.changerQuantite);
  const retirer = usePanier((s) => s.retirer);

  if (lignes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-frame border border-mist/60 bg-white px-8 py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-ghost text-slate">
          <ShoppingBag size={26} strokeWidth={1.5} aria-hidden />
        </span>
        <h2 className="text-title text-ink">Votre panier est vide.</h2>
        <p className="max-w-md text-body text-graphite">
          Le stock affiché en boutique est réel — ce que vous ajoutez ici est
          disponible à Bangui.
        </p>
        <Button asChild size="lg">
          <Link href="/electronique">Parcourir la boutique</Link>
        </Button>
      </div>
    );
  }

  const total = totalPanier(lignes);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-16">
      <ul className="flex flex-col">
        {lignes.map((ligne) => (
          <li
            key={ligne.slug}
            className="flex gap-5 border-b border-mist/50 py-6 first:pt-0"
          >
            <Link
              href={`/electronique/p/${ligne.slug}`}
              className="relative size-24 shrink-0 overflow-hidden rounded-action bg-ghost"
            >
              <Image
                src={ligne.image}
                alt={ligne.nom}
                fill
                sizes="96px"
                className="object-cover"
              />
            </Link>

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <Link
                  href={`/electronique/p/${ligne.slug}`}
                  className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink transition-colors hover:text-brand"
                >
                  {ligne.nom}
                </Link>
                <button
                  type="button"
                  onClick={() => retirer(ligne.slug)}
                  aria-label={`Retirer ${ligne.nom} du panier`}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-slate transition-colors hover:bg-ghost hover:text-danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center rounded-pill border border-mist bg-white">
                  <button
                    type="button"
                    onClick={() => changerQuantite(ligne.slug, ligne.quantite - 1)}
                    aria-label="Diminuer"
                    className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ghost"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-7 text-center text-[0.9375rem] font-medium tabular-nums">
                    {ligne.quantite}
                  </span>
                  <button
                    type="button"
                    onClick={() => changerQuantite(ligne.slug, ligne.quantite + 1)}
                    aria-label="Augmenter"
                    className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ghost"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <PriceTag amount={ligne.prixXaf * ligne.quantite} size="sm" />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Récapitulatif collant */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-5 rounded-frame bg-ink p-8 text-white">
          <h2 className="text-title">Récapitulatif</h2>
          <dl className="flex flex-col gap-2 border-b border-white/15 pb-5 text-[0.9375rem]">
            <div className="flex justify-between">
              <dt className="text-white/70">Sous-total</dt>
              <dd className="tabular-nums">{formatXAF(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/70">Livraison</dt>
              <dd className="text-white/70">calculée à l&apos;étape suivante</dd>
            </div>
          </dl>
          <div className="flex items-baseline justify-between">
            <span className="text-body">Total</span>
            <span className="text-title tabular-nums">{formatXAF(total)}</span>
          </div>
          <Button
            asChild
            size="lg"
            className="w-full border-white bg-white text-ink hover:border-white/80 hover:bg-white/90"
          >
            <Link href="/checkout">Passer la commande</Link>
          </Button>
          <p className="text-[0.75rem] leading-relaxed text-white/40">
            Paiement à la livraison ou au retrait. Le paiement en ligne (carte,
            Orange Money) arrive bientôt.
          </p>
        </div>
      </aside>
    </div>
  );
}
