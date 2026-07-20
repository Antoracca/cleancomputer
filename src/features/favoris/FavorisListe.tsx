"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFavoris } from "@/features/favoris/store";
import type { Produit } from "@/types/catalogue";

export function FavorisListe({ produits }: { produits: readonly Produit[] }) {
  const slugs = useFavoris((s) => s.slugs);
  const vider = useFavoris((s) => s.vider);
  const [monte, setMonte] = useState(false);

  useEffect(() => setMonte(true), []);

  // Tant que le stockage local n'est pas lu, on montre des squelettes plutôt
  // qu'un état vide qui clignoterait avant d'être remplacé.
  if (!monte) {
    return (
      <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-2/3" radius="pill" />
          </li>
        ))}
      </ul>
    );
  }

  const retenus = produits.filter((p) => slugs.includes(p.slug));

  if (retenus.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-frame border border-mist/60 bg-white px-8 py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-ghost text-slate">
          <Heart size={26} strokeWidth={1.5} aria-hidden />
        </span>
        <h2 className="text-title text-ink">Aucun favori pour le moment.</h2>
        <p className="max-w-md text-body text-graphite">
          Cliquez sur le cœur d&apos;un produit pour le retrouver ici. Pratique
          pour comparer avant de vous décider, ou pour suivre un article épuisé.
        </p>
        <Button asChild size="lg">
          <Link href="/electronique">Parcourir la boutique</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between border-b border-mist/70 pb-4">
        <p className="text-[0.9375rem] text-graphite tabular-nums">
          {retenus.length} produit{retenus.length > 1 ? "s" : ""} en favori
        </p>
        <button
          type="button"
          onClick={vider}
          className="inline-flex min-h-11 items-center text-[0.875rem] font-medium text-brand transition-colors hover:text-brand-deep"
        >
          Tout retirer
        </button>
      </div>

      <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {retenus.map((produit) => (
          <li key={produit.slug}>
            <ProductCard produit={produit} />
          </li>
        ))}
      </ul>
    </div>
  );
}
