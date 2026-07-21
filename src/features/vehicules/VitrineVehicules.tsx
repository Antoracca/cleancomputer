"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { cn } from "@/lib/utils/cn";

/**
 * VITRINE VÉHICULES
 *
 * Une succession de plans façon spot télévisé : le véhicule occupe un grand
 * cadre, le texte lui fait face, et à chaque plan l'image bascule de côté avec
 * une accroche différente. Le mouvement latéral est ce qui distingue ce
 * carrousel d'un diaporama : l'œil suit le déplacement plutôt que de subir un
 * fondu sur place.
 *
 * Chaque véhicule porte son propre dégradé de fond. Les photos extérieures
 * Jetour sont détourées sur blanc pur, celle du Land Cruiser sur un studio
 * beige : sans fond coloré, le passage d'un plan à l'autre produirait un
 * clignotement blanc franchement laid.
 *
 * ACCESSIBILITÉ ET CONFORT
 *
 *   - défilement suspendu au survol et au focus clavier, pour laisser lire ;
 *   - suspendu aussi quand l'onglet passe en arrière-plan, sinon on revient
 *     sur une section qui a tourné dans le vide ;
 *   - bouton pause explicite, parce qu'un carrousel qui avance tout seul sans
 *     moyen de l'arrêter est une gêne réelle pour beaucoup de gens ;
 *   - `prefers-reduced-motion` coupe l'avance automatique entièrement.
 */

type Plan = {
  readonly id: string;
  readonly vehicule: string;
  readonly modele: string;
  readonly accroche: string;
  readonly texte: string;
  readonly image: string;
  readonly alt: string;
  /** Côté occupé par l'image. Alterne strictement d'un plan à l'autre. */
  readonly cote: "gauche" | "droite";
  /** Dégradé de fond, prolongement de la photo. */
  readonly fond: string;
  readonly puces: readonly string[];
  /** Coloris disponibles, illustrés par une seconde photo du même véhicule. */
  readonly coloris?: readonly { readonly nom: string; readonly image: string }[];
};

/**
 * Quatre plans, alternance parfaite gauche / droite y compris au bouclage.
 *
 * La cinquième photo Jetour (carrosserie blanche) est le même cadrage que la
 * grise : en faire un plan de plus n'aurait rien montré de neuf et aurait
 * cassé l'alternance. Elle sert de nuancier sur le plan extérieur Jetour, ce
 * qui la rend plus utile qu'un plan supplémentaire.
 *
 * ⚠️ CARACTÉRISTIQUES À CONFIRMER — les mentions techniques Jetour viennent du
 * nom de fichier fournisseur (« 2.0TD 211HP 5-6 Seat PHEV »). À valider avant
 * toute communication commerciale.
 */
const PLANS: readonly Plan[] = [
  {
    id: "jetour-exterieur",
    vehicule: "Jetour",
    modele: "G700",
    accroche: "Le 4×4 qui ne demande pas la permission.",
    texte:
      "Gabarit imposant, hybride rechargeable, sept places possibles. Le Jetour G700 vise la catégorie au-dessus de son prix, et il tient la comparaison.",
    image: "/media/vehicules/Image-de-presentation-Jetour-G700-.jpg",
    alt: "Jetour G700 gris, vue avant trois-quarts",
    cote: "gauche",
    fond: "linear-gradient(120deg,#e8ebef 0%,#d3d8df 55%,#b9c1cb 100%)",
    puces: ["Hybride rechargeable", "2.0 turbo, 211 ch", "5 à 6 places"],
    coloris: [
      { nom: "Gris ardoise", image: "/media/vehicules/Image-de-presentation-Jetour-G700-.jpg" },
      { nom: "Blanc nacré", image: "/media/vehicules/jetour2.png" },
    ],
  },
  {
    id: "toyota-exterieur",
    vehicule: "Toyota",
    modele: "Land Cruiser",
    accroche: "L'increvable, nouvelle génération.",
    texte:
      "Celui que les ONG et les chantiers achètent depuis quarante ans, redessiné. Sur les pistes centrafricaines, sa réputation n'est plus à faire.",
    image: "/media/vehicules/toyota1.webp",
    alt: "Toyota Land Cruiser sable, vue avant trois-quarts en studio",
    cote: "droite",
    fond: "linear-gradient(120deg,#f6ecd9 0%,#eddcbe 55%,#dcc79c 100%)",
    puces: ["Châssis échelle", "4 roues motrices", "Pièces trouvables à Bangui"],
  },
  {
    id: "jetour-interieur",
    vehicule: "Jetour",
    modele: "G700",
    accroche: "Un intérieur qui n'a pas peur de la couleur.",
    texte:
      "Cuir orange, double écran panoramique, sélecteur de terrain au centre. L'habitacle assume, là où la concurrence propose du gris sur du gris.",
    image: "/media/vehicules/Jetour-G700-Image-04.jpg",
    alt: "Intérieur du Jetour G700, cuir orange et double écran",
    cote: "gauche",
    fond: "linear-gradient(120deg,#2a1c14 0%,#4a2c17 55%,#7a4420 100%)",
    puces: ["Double écran", "Cuir pleine fleur", "Modes tout-terrain"],
  },
  {
    id: "toyota-interieur",
    vehicule: "Toyota",
    modele: "Land Cruiser",
    accroche: "Tout tombe sous la main.",
    texte:
      "Des vraies molettes, des vraies touches. Avec des gants ou les mains sales, vous réglez sans quitter la piste des yeux.",
    image: "/media/vehicules/toyota2.webp",
    alt: "Poste de conduite du Toyota Land Cruiser, cuir brun",
    cote: "droite",
    fond: "linear-gradient(120deg,#2b2320 0%,#4a3a30 55%,#6d5443 100%)",
    puces: ["Commandes physiques", "Écran central 12\"", "Sellerie cuir"],
  },
];

/** Durée d'un plan. */
const DUREE_MS = 5000;

/** Abonnement à la préférence système, pour `useSyncExternalStore`. */
function souscrireMouvementReduit(rappel: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", rappel);
  return () => mq.removeEventListener("change", rappel);
}

export function VitrineVehicules() {
  const [index, setIndex] = useState(0);

  const section = useRef<HTMLElement>(null);

  // `useSyncExternalStore` plutôt qu'un effet qui appelle setState : la
  // préférence système est un état externe, pas un état dérivé. Le lire ainsi
  // évite le rendu en cascade et donne la bonne valeur dès le premier rendu
  // client. Le serveur répond `false`, il ne connaît pas la préférence.
  const mouvementReduit = useSyncExternalStore(
    souscrireMouvementReduit,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  const avancer = useCallback(() => {
    setIndex((i) => (i + 1) % PLANS.length);
  }, []);

  const reculer = useCallback(() => {
    setIndex((i) => (i - 1 + PLANS.length) % PLANS.length);
  }, []);

  // Le défilement ne s'interrompt JAMAIS pour le survol ni le focus. C'est une
  // demande explicite, formulée deux fois : une animation qui s'arrête sous le
  // curseur donne l'impression que la page a planté.
  //
  // Seule exception, l'onglet en arrière-plan : les minuteurs y sont bridés
  // par le navigateur et les plans s'empileraient d'un coup au retour. On
  // repart proprement du plan courant quand l'onglet redevient visible.
  useEffect(() => {
    let minuteur = window.setInterval(avancer, DUREE_MS);

    const auChangementDeVisibilite = () => {
      window.clearInterval(minuteur);
      if (!document.hidden) {
        minuteur = window.setInterval(avancer, DUREE_MS);
      }
    };
    document.addEventListener("visibilitychange", auChangementDeVisibilite);

    return () => {
      window.clearInterval(minuteur);
      document.removeEventListener("visibilitychange", auChangementDeVisibilite);
    };
  }, [avancer]);

  const plan = PLANS[index];
  if (!plan) return null;

  const imageAGauche = plan.cote === "gauche";

  return (
    <section
      ref={section}
      aria-roledescription="carrousel"
      aria-label="Véhicules importés"
      className="relative overflow-hidden transition-[background] duration-[1400ms] [transition-timing-function:cubic-bezier(0.33,0,0.15,1)]"
      style={{ background: plan.fond }}
    >
      <Container className="py-16 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <EyebrowLabel tone={plan.id.includes("interieur") ? "frost" : undefined}>
              Véhicules & motos
            </EyebrowLabel>
            <p
              className={cn(
                "max-w-md text-[1.0625rem] leading-relaxed",
                plan.id.includes("interieur") ? "text-white/70" : "text-ink/70",
              )}
            >
              Achat sur catalogue, expédition groupée, dédouanement pris en
              charge. Prix rendu à Bangui connu avant le départ.
            </p>
          </div>

          <Commandes
            index={index}
            total={PLANS.length}
            sombre={plan.id.includes("interieur")}
            onPrecedent={reculer}
            onSuivant={avancer}
            onAller={setIndex}
          />
        </div>

        {/* ───────────── Le plan ───────────── */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* L'ordre visuel bascule, l'ordre DOM reste stable : le lecteur
              d'écran et la tabulation gardent une séquence cohérente. */}
          <div
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-frame",
              imageAGauche ? "lg:order-1" : "lg:order-2",
            )}
          >
            {PLANS.map((p, i) => {
              const actif = i === index;
              return (
                <div
                  key={p.id}
                  aria-hidden={!actif}
                  className={cn(
                    // Fondu long : c'est lui qui fait la coupe « vidéo »
                    // plutôt que le changement d'image sec.
                    "absolute inset-0 transition-opacity duration-[1400ms]",
                    "[transition-timing-function:cubic-bezier(0.33,0,0.15,1)]",
                    actif ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <Image
                    src={p.image}
                    alt={actif ? p.alt : ""}
                    fill
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    priority={i === 0}
                    className={cn(
                      "object-cover",
                      // La dérive ne tourne que sur le plan visible : animer
                      // quatre images en permanence ferait travailler le GPU
                      // pour rien.
                      actif && !mouvementReduit
                        ? "animate-derive"
                        : "scale-[1.04]",
                    )}
                  />
                </div>
              );
            })}
          </div>

          <div
            className={cn(
              "flex flex-col gap-6",
              imageAGauche ? "lg:order-2" : "lg:order-1",
            )}
          >
            {/* `key` sur le plan : React remonte le bloc à chaque changement,
                ce qui rejoue la montée du texte. Elle est volontairement plus
                lente que le fondu de l'image, pour que le texte arrive après
                elle plutôt qu'en même temps. */}
            <div
              key={plan.id}
              className={cn(
                "flex flex-col gap-6",
                mouvementReduit ? undefined : "animate-monte",
              )}
            >
              <span
                className={cn(
                  "text-[0.8125rem] font-bold tracking-[0.08em] uppercase",
                  plan.id.includes("interieur") ? "text-white/55" : "text-ink/50",
                )}
              >
                {plan.vehicule} {plan.modele}
              </span>

              <h2
                className={cn(
                  "max-w-md text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] font-medium tracking-[-0.03em]",
                  plan.id.includes("interieur") ? "text-white" : "text-ink",
                )}
              >
                {plan.accroche}
              </h2>

              <p
                className={cn(
                  "max-w-md text-[1.0625rem] leading-relaxed",
                  plan.id.includes("interieur") ? "text-white/70" : "text-ink/70",
                )}
              >
                {plan.texte}
              </p>

              <ul className="flex flex-wrap gap-2.5">
                {plan.puces.map((puce) => (
                  <li
                    key={puce}
                    className={cn(
                      "rounded-pill px-4 py-1.5 text-[0.875rem]",
                      plan.id.includes("interieur")
                        ? "bg-white/12 text-white/85"
                        : "bg-ink/8 text-ink/75",
                    )}
                  >
                    {puce}
                  </li>
                ))}
              </ul>

              {plan.coloris ? (
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-[0.8125rem]",
                      plan.id.includes("interieur")
                        ? "text-white/55"
                        : "text-ink/50",
                    )}
                  >
                    Coloris
                  </span>
                  {plan.coloris.map((c) => (
                    <span
                      key={c.nom}
                      title={c.nom}
                      className="relative size-11 overflow-hidden rounded-full ring-1 ring-ink/15"
                    >
                      <Image
                        src={c.image}
                        alt={c.nom}
                        fill
                        sizes="44px"
                        className="scale-[1.7] object-cover"
                      />
                    </span>
                  ))}
                </div>
              ) : null}

              <div>
                <Link
                  href="/vehicules"
                  className={cn(
                    "group/cta inline-flex min-h-13 items-center gap-2.5 rounded-action px-8 py-4 text-body font-medium transition-colors",
                    plan.id.includes("interieur")
                      ? "bg-white text-ink hover:bg-white/90"
                      : "bg-ink text-frost hover:bg-charcoal",
                  )}
                >
                  Découvrir ce véhicule
                  <ArrowRight
                    size={17}
                    aria-hidden
                    className="transition-transform duration-200 ease-out-soft group-hover/cta:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────── commandes du carrousel ───────────────────── */

function Commandes({
  index,
  total,
  sombre,
  onPrecedent,
  onSuivant,
  onAller,
}: {
  readonly index: number;
  readonly total: number;
  readonly sombre: boolean;
  readonly onPrecedent: () => void;
  readonly onSuivant: () => void;
  readonly onAller: (i: number) => void;
}) {
  const bouton = cn(
    "grid size-11 place-items-center rounded-full transition-colors",
    sombre
      ? "text-white/70 hover:bg-white/12 hover:text-white"
      : "text-ink/60 hover:bg-ink/8 hover:text-ink",
  );

  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={onPrecedent} aria-label="Plan précédent" className={bouton}>
        <ChevronLeft size={20} aria-hidden />
      </button>

      <ul className="flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => onAller(i)}
              aria-label={`Aller au plan ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-1.5 rounded-pill transition-[width,background-color] duration-300 ease-out-soft",
                i === index ? "w-8" : "w-1.5",
                sombre
                  ? i === index
                    ? "bg-white"
                    : "bg-white/35 hover:bg-white/60"
                  : i === index
                    ? "bg-ink"
                    : "bg-ink/25 hover:bg-ink/45",
              )}
            />
          </li>
        ))}
      </ul>

      <button type="button" onClick={onSuivant} aria-label="Plan suivant" className={bouton}>
        <ChevronRight size={20} aria-hidden />
      </button>
    </div>
  );
}
