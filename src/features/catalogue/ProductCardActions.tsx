"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, Eye, ShoppingCart } from "lucide-react";
import { usePanier } from "@/features/panier/store";
import { useFavoris } from "@/features/favoris/store";
import { cn } from "@/lib/utils/cn";
import type { Produit } from "@/types/catalogue";

/**
 * ACTIONS RAPIDES SUR UNE CARTE PRODUIT
 *
 * Trois actions alignées horizontalement au bas de l'image, chacune avec une
 * conséquence évidente :
 *
 *   ŒIL     garde le produit à l'œil. Rien d'autre ne se passe, on reste
 *           exactement où on est.
 *   PANIER  ajoute au panier. Le panier ne s'ouvre PAS : on continue de
 *           parcourir la grille, le raccourci flottant en bas signale l'ajout.
 *   CARTE   ouvre la fiche produit, comme un clic sur la carte. On voit
 *           l'article en détail avant de s'engager.
 *
 * L'éclair de la version précédente était une erreur : le symbole ne disait
 * rien et l'action filait droit au paiement sans que l'article ait été vu.
 *
 * Ces boutons vivent DANS le lien de la carte. Chaque gestionnaire appelle donc
 * `preventDefault` et `stopPropagation`, sinon le clic déclencherait aussi la
 * navigation du lien parent.
 *
 * L'état des favoris n'est lu qu'après montage : le serveur ignore le stockage
 * local, afficher un œil actif au premier rendu créerait une divergence
 * d'hydratation.
 */
export function ProductCardActions({ produit }: { produit: Produit }) {
  const router = useRouter();
  const ajouter = usePanier((s) => s.ajouter);
  const favoris = useFavoris((s) => s.slugs);
  const basculerFavori = useFavoris((s) => s.basculer);

  const [monte, setMonte] = useState(false);
  const [ajoute, setAjoute] = useState(false);

  useEffect(() => setMonte(true), []);

  const suivi = monte && favoris.includes(produit.slug);
  const enRupture = produit.stock === 0;

  function stopper(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div
      className={cn(
        "absolute right-2 bottom-2 left-2 z-10 flex items-center justify-center gap-1.5 sm:right-3 sm:bottom-3 sm:left-3 sm:gap-2",
        "transition-[opacity,transform] duration-300 ease-out-soft",
        // Toujours visible au doigt, révélé au survol à la souris.
        "opacity-100 md:translate-y-2 md:opacity-0",
        "md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100",
      )}
    >
      {/* Voile sombre sous les boutons : sur une photo claire, des pastilles
          blanches se fondraient dans le fond et deviendraient illisibles. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-2 -bottom-2 h-20 rounded-b-action bg-gradient-to-t from-ink/35 to-transparent sm:-inset-x-3 sm:-bottom-3"
      />

      <ActionRonde
        label={
          suivi
            ? `Ne plus suivre ${produit.nom}`
            : `Garder un œil sur ${produit.nom}`
        }
        actif={suivi}
        onClick={(e) => {
          stopper(e);
          basculerFavori(produit.slug);
        }}
      >
        <Eye size={19} strokeWidth={1.75} />
      </ActionRonde>

      {!enRupture ? (
        <ActionRonde
          label={`Ajouter ${produit.nom} au panier`}
          succes={ajoute}
          onClick={(e) => {
            stopper(e);
            ajouter({
              id: produit.slug,
              type: "produit",
              slug: produit.slug,
              nom: produit.nom,
              prixXaf: produit.prixXaf,
              image: produit.image,
            });
            setAjoute(true);
            window.setTimeout(() => setAjoute(false), 1600);
          }}
        >
          {ajoute ? (
            <Check size={19} strokeWidth={2.5} />
          ) : (
            <ShoppingCart size={19} strokeWidth={1.75} />
          )}
        </ActionRonde>
      ) : null}

      <ActionRonde
        label={`Voir et acheter ${produit.nom}`}
        onClick={(e) => {
          stopper(e);
          router.push(`/electronique/p/${produit.slug}`);
        }}
      >
        <CreditCard size={19} strokeWidth={1.75} />
      </ActionRonde>
    </div>
  );
}

function ActionRonde({
  children,
  label,
  onClick,
  actif = false,
  succes = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  actif?: boolean;
  succes?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={actif || undefined}
      className={cn(
        // 40px en deux colonnes sur téléphone : trois boutons de 48px plus
        // leurs espaces dépasseraient la largeur d'une carte à cette taille.
        // `relative` est nécessaire : le voile qui les précède est en
        // `absolute` et passerait devant des boutons non positionnés.
        "relative grid size-10 shrink-0 place-items-center rounded-full shadow-nav backdrop-blur-sm sm:size-12",
        "transition-[transform,background-color,color] duration-200 ease-out-soft",
        "hover:scale-110 active:scale-95",
        succes
          ? "bg-success text-white"
          : actif
            ? "bg-ink text-frost"
            : "bg-white/95 text-ink hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}
