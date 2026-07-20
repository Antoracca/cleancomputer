"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, Eye, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePanier } from "@/features/panier/store";
import { useFavoris } from "@/features/favoris/store";
import { cn } from "@/lib/utils/cn";

/**
 * ACHAT SUR LA FICHE PRODUIT
 *
 * Quantité, ajout au panier, achat direct et mise en favori.
 *
 * L'ajout au panier est optimiste : l'interface répond immédiatement, sans
 * aucun aller-retour réseau. Le stock et les prix sont revérifiés côté serveur
 * au moment de la commande, un panier trafiqué ne change donc que l'affichage.
 *
 * « Acheter maintenant » remplit le panier puis mène au paiement en un geste,
 * pour les visiteurs qui savent déjà ce qu'ils veulent.
 */
export function AddToCart({
  slug,
  nom,
  prixXaf,
  image,
  stock,
}: {
  slug: string;
  nom: string;
  prixXaf: number;
  image: string;
  stock: number;
}) {
  const router = useRouter();
  const ajouter = usePanier((s) => s.ajouter);
  const favoris = useFavoris((s) => s.slugs);
  const basculerFavori = useFavoris((s) => s.basculer);

  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);
  const [monte, setMonte] = useState(false);

  useEffect(() => setMonte(true), []);

  const enRupture = stock === 0;
  const max = Math.min(stock, 99);
  const estFavori = monte && favoris.includes(slug);

  const ligne = { slug, nom, prixXaf, image };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Quantité : cibles de 44px, conformes au seuil tactile */}
        <div
          className={cn(
            "flex items-center rounded-pill border border-mist bg-white",
            enRupture && "opacity-40",
          )}
        >
          <button
            type="button"
            onClick={() => setQuantite((q) => Math.max(1, q - 1))}
            disabled={enRupture || quantite <= 1}
            aria-label="Diminuer la quantité"
            className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ghost disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
          <span
            aria-live="polite"
            className="min-w-8 text-center text-body font-medium text-ink tabular-nums"
          >
            {quantite}
          </span>
          <button
            type="button"
            onClick={() => setQuantite((q) => Math.min(max, q + 1))}
            disabled={enRupture || quantite >= max}
            aria-label="Augmenter la quantité"
            className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ghost disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>

        <Button
          type="button"
          size="lg"
          disabled={enRupture}
          onClick={() => {
            ajouter(ligne, quantite);
            setAjoute(true);
            window.setTimeout(() => setAjoute(false), 1600);
          }}
          className="sm:flex-1"
        >
          {enRupture ? (
            "Indisponible"
          ) : ajoute ? (
            <>
              <Check size={18} aria-hidden />
              Ajouté au panier
            </>
          ) : (
            <>
              <ShoppingCart size={18} aria-hidden />
              Ajouter au panier
            </>
          )}
        </Button>
      </div>

      {!enRupture ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => {
              ajouter(ligne, quantite);
              router.push("/checkout");
            }}
            className="sm:flex-1"
          >
            <CreditCard size={17} aria-hidden />
            Acheter maintenant
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => basculerFavori(slug)}
            aria-pressed={estFavori}
            className={cn(estFavori && "border-ink bg-ink text-frost")}
          >
            <Eye size={17} aria-hidden />
            {estFavori ? "Suivi" : "Garder un œil"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
