import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { HeroVideo } from "@/components/shared/HeroVideo";
import { PortraitCircle } from "@/components/shared/PortraitCircle";
import { OrbitArc } from "@/components/motion/OrbitArc";
import { ProductCard } from "@/components/shared/ProductCard";
import { LocalVideo } from "@/components/shared/LocalVideo";
import { OrdinateurCard } from "@/features/catalogue/OrdinateurCard";
import { VitrineVehicules } from "@/features/vehicules/VitrineVehicules";
import { CarteBoutique } from "@/features/contact/CarteBoutique";
import { chargerProduitsMisEnAvant } from "@/lib/data/catalogue-db";
import { ORDINATEURS, getOrdinateursVitrine } from "@/lib/data/ordinateurs";

export const revalidate = 60;

/**
 * ACCUEIL
 *
 * Principe de composition : CHAQUE SECTION A SON PROPRE TRAITEMENT.
 * La première version répétait le même bloc (libellé + titre + texte) six fois
 * de suite — le rythme était plat et la page paraissait pauvre malgré sa
 * longueur. Ici les registres alternent volontairement :
 *
 *   1. Hero              — cadre stade, vidéo, texte sur voile
 *   2. Bandeau de faits  — ligne dense, filets verticaux, aucun titre
 *   3. Métiers           — constellation asymétrique, portraits circulaires
 *   4. Stock réel        — diptyque image/texte sur fond encre
 *   5. Produits          — grille dense sur surface levée
 *   6. Véhicules         — bande pleine largeur, image en fond
 *   7. Devis             — encre, arcs orbitaux, un seul CTA
 *   8. Méthode           — liste numérotée, typographie seule
 *   9. Ancrage local     — une phrase, rien d'autre
 *
 * Règle sur l'imagerie : le visuel doit DIRE la même chose que le titre.
 * Un powerbank en face de « transfert d'argent » ou une manette en face de
 * « Guangzhou → Bangui » cassait la crédibilité du bloc entier.
 */

const METIERS = [
  {
    eyebrow: "Boutique d'électronique",
    href: "/electronique",
    alt: "Étalage organisé de matériel informatique de haute qualité",
    position: "lg:col-start-1 lg:col-span-5 lg:row-start-1",
    frames: [
      {
        title: "Ordinateurs, pièces & accessoires",
        description: "Du matériel de qualité professionnelle, sourcé et testé. Arrivages réguliers et sur commande.",
        image: "/LOGO/materiels1.jpg",
        objectFit: "contain",
      },
      {
        title: "Large gamme de matériels",
        description: "Trouvez tout ce dont vous avez besoin pour équiper votre entreprise ou votre domicile.",
        image: "/LOGO/materiels2.jpg",
        objectFit: "contain",
      },
      {
        title: "Qualité garantie",
        description: "Des produits fiables et durables, avec un service après-vente à votre écoute.",
        image: "/LOGO/materiels3.jpg",
        objectFit: "contain",
      }
    ]
  },
  {
    eyebrow: "Services informatiques",
    href: "/services",
    alt: "Technicien en train de configurer une baie de serveurs",
    position: "lg:col-start-8 lg:col-span-5 lg:row-start-1 lg:translate-y-24",
    frames: [
      {
        title: "Conception de site web",
        description: "Création de sites vitrines et plateformes e-commerce sur mesure, optimisés pour votre activité.",
        image: "/LOGO/conception1.webp",
      },
      {
        title: "Développement d'applications",
        description: "Solutions logicielles performantes et sécurisées pour automatiser vos processus d'entreprise.",
        image: "/LOGO/CONCEPTION2.avif",
      },
      {
        title: "Cloud Computing & Réseaux",
        description: "Architecture Cloud, déploiement de serveurs et gestion complète de votre infrastructure.",
        image: "/LOGO/cloud-computing-architecture.png",
        objectFit: "contain",
      }
    ]
  },
  {
    eyebrow: "Design & branding",
    href: "/design-branding",
    alt: "Création de contenu, logo et identité visuelle",
    position: "lg:col-start-2 lg:col-span-5 lg:row-start-2",
    frames: [
      {
        title: "Votre logo et votre identité visuelle",
        description: "Logo, couleurs, charte complète. Vous repartez avec tous les fichiers, prêts à l'emploi.",
        image: "/LOGO/photoshop.jpg",
      },
      {
        title: "Création de contenu vidéo",
        description: "Vente de logiciel de montage Premiere Pro et création de contenu sur mesure.",
        image: "/LOGO/premierpro.jpg",
      }
    ]
  },
  {
    eyebrow: "Transfert d'argent",
    href: "/transfert-argent",
    alt: "Services de transfert d'argent",
    position: "lg:col-start-8 lg:col-span-5 lg:row-start-2 lg:translate-y-28",
    frames: [
      {
        title: "Envoyez de l'argent en toute clarté",
        description: "Vous voyez ce que vous envoyez, ce que ça coûte et ce qui arrive, avant de valider.",
        images: ["/LOGO/WESTERN.svg", "/LOGO/logo-moneygram-black.svg"],
      },
      {
        title: "Orange Money vers le Maroc",
        description: "Transférer à des frais imbattables allant jusqu'à 8%. De la Centrafrique vers le Maroc, et inversement.",
        image: "/LOGO/orangemonney.png",
        objectFit: "contain",
      },
      {
        title: "Paiement marchand et PayPal",
        description: "Création de compte PayPal professionnel, dépôt et retrait, envoi PayPal.",
        image: "/LOGO/paypal.jpg",
        objectFit: "contain",
      }
    ]
  },
  {
    eyebrow: "Import & véhicules",
    titre: "Vos achats depuis la Chine, livrés à Bangui",
    texte:
      "Fret, dédouanement, véhicules et motos. On suit votre marchandise jusqu'à la remise.",
    href: "/transit-import",
    image: "/media/portraits/service-import-export.jpg",
    alt: "Port à conteneurs avec grues et navire en cours de chargement",
    position: "lg:col-start-4 lg:col-span-5 lg:row-start-3 lg:translate-y-8",
  },
] as const;

const ETAPES_WINDOWS = [
  {
    n: "01",
    titre: "Vous venez avec votre machine",
    texte:
      "Ou nous nous déplaçons, s'il y a plusieurs postes à équiper au bureau.",
  },
  {
    n: "02",
    titre: "On installe et on active",
    texte:
      "Licence Microsoft authentique. L'activation se fait devant vous, vous voyez le système la valider.",
  },
  {
    n: "03",
    titre: "On configure l'essentiel",
    texte:
      "Comptes, mises à jour, antivirus, sauvegarde. La machine est utilisable en sortant.",
  },
  {
    n: "04",
    titre: "Vous repartez avec la facture",
    texte:
      "Et notre numéro. Si quelque chose coince plus tard, vous rappelez les mêmes personnes.",
  },
] as const;

const METHODE = [
  {
    n: "01",
    titre: "Vous demandez",
    texte:
      "En boutique, par téléphone ou depuis le site. Un projet web se chiffre tout seul, en direct.",
  },
  {
    n: "02",
    titre: "On vous répond clairement",
    texte:
      "Ce qui est disponible, le délai, le prix. Si ce n'est pas en stock, on vous le dit tout de suite.",
  },
  {
    n: "03",
    titre: "Vous récupérez ou on livre",
    texte:
      "Retrait Avenue Mubutu, ou livraison à Bangui sous 24 h. Vous payez à la remise, en espèces.",
  },
  {
    n: "04",
    titre: "On reste joignable",
    texte:
      "Après-vente, installation, maintenance. Le même numéro qu'avant l'achat.",
  },
] as const;

export default async function HomePage() {
  const vedettes = (await chargerProduitsMisEnAvant()).slice(0, 4);
  const vitrineOrdinateurs = getOrdinateursVitrine();

  return (
    <>
      {/* ═══════════ 1. HERO — cadre stade ═══════════ */}
      <section className="px-4 pt-27 md:px-12">
        <div className="relative mx-auto flex min-h-[540px] max-w-[1400px] flex-col justify-end overflow-hidden rounded-frame md:min-h-[600px] lg:min-h-[68vh]">
          <HeroVideo
            src="/media/video/hero-laptop.mp4"
            poster="/media/video/hero-laptop-poster.jpg"
            alt="Ordinateur portable en gros plan"
          />

          <div className="relative z-10 flex flex-col gap-7 p-8 pb-12 md:p-14 md:pb-16 lg:max-w-3xl">
            <h1
              className="animate-reveal text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] font-medium tracking-[-0.025em] text-white"
              style={{ animationDelay: "80ms" }}
            >
              Tout ce qui fait tourner votre équipement.
              <br className="hidden sm:block" />
              <span className="text-white/55"> Et tout ce qui va avec.</span>
            </h1>

            <p
              className="animate-reveal max-w-lg text-[1.0625rem] leading-relaxed text-white/75"
              style={{ animationDelay: "160ms" }}
            >
              Matériel en stock, prestations informatiques, création de sites,
              identité visuelle, transfert d&apos;argent et import direct de
              Chine. Un seul interlocuteur.
            </p>

            <div
              className="animate-reveal flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <Button
                asChild
                size="lg"
                className="border-white bg-white text-ink hover:border-white/80 hover:bg-white/90"
              >
                <Link href="/electronique">Découvrir la boutique</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white hover:text-ink"
              >
                <Link href="/devis">Chiffrer mon projet</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 2. NOS SERVICES — constellation ═══════════ */}
      <section className="mt-24 md:mt-32">
        <Container>
          <div className="flex max-w-2xl flex-col gap-6">
            <EyebrowLabel>Ce que nous faisons</EyebrowLabel>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] font-medium tracking-[-0.025em] text-ink">
              Du matériel, des services, et le suivi qui va avec.
            </h2>
            <p className="max-w-lg text-[1.0625rem] leading-relaxed text-graphite">
              Vous achetez un ordinateur, vous faites installer votre réseau,
              vous commandez un site ou vous envoyez de l&apos;argent à votre
              famille. Tout se fait ici, avec les mêmes personnes.
            </p>
          </div>

          <div className="relative mt-20 grid grid-cols-1 gap-20 sm:grid-cols-2 sm:gap-x-12 lg:mt-28 lg:grid-cols-12 lg:items-start lg:gap-x-6 lg:gap-y-28">
            <OrbitArc
              variant="sweep-right"
              className="top-[8%] left-[24%] h-[240px] w-[52%]"
            />
            <OrbitArc
              variant="sweep-left"
              className="top-[42%] left-[16%] h-[220px] w-[58%]"
            />

            {METIERS.map((metier, i) => (
              <div key={metier.href} className={`relative z-10 ${metier.position}`}>
                <PortraitCircle
                  frames={(metier as any).frames}
                  image={(metier as any).image}
                  images={(metier as any).images}
                  alt={metier.alt}
                  eyebrow={metier.eyebrow}
                  title={(metier as any).titre}
                  description={(metier as any).texte}
                  href={metier.href}
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>


      {/* ═══════════ 4. STOCK RÉEL — diptyque encre ═══════════ */}
      <section className="mt-36 md:mt-52">
        <Container>
          <div className="grid overflow-hidden rounded-frame bg-ink lg:grid-cols-2">
            <div className="relative min-h-[280px] lg:min-h-[440px]">
              <Image
                src="/media/produits/boutique-etagere-accessoires.jpg"
                alt="Étagères garnies dans la boutique Clean Computer à Bangui"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-6 p-8 md:p-14">
              <EyebrowLabel tone="frost">Notre stock</EyebrowLabel>
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.025em] text-white">
                Ce que vous voyez est en rayon.
              </h2>
              <p className="max-w-md text-[1.0625rem] leading-relaxed text-white/70">
                Chaque fiche produit indique la quantité disponible. S&apos;il
                ne reste que deux pièces, c&apos;est écrit. Si c&apos;est
                épuisé, c&apos;est marqué. Vous savez toujours à quoi vous en
                tenir avant de vous déplacer.
              </p>
              <div>
                <Button
                  asChild
                  variant="secondary"
                  className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white hover:text-ink"
                >
                  <Link href="/electronique">Voir le catalogue</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════ 3bis. ORDINATEURS — vitrine machines ═══════════ */}
      <section className="mt-28 md:mt-40">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="flex max-w-xl flex-col gap-5">
              <EyebrowLabel>Ordinateurs</EyebrowLabel>
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
                Des machines neuves, vérifiées une par une.
              </h2>
              <p className="text-[1.0625rem] leading-relaxed text-graphite">
                Cinq angles par machine, l&apos;état noté sur 10 et la référence
                constructeur affichée. Vous savez exactement ce que vous achetez.
              </p>
            </div>

            <Link
              href="/electronique/ordinateurs"
              className="group/lien inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-ink transition-colors hover:text-brand"
            >
              Voir les {ORDINATEURS.length} machines
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform duration-200 group-hover/lien:translate-x-1"
              />
            </Link>
          </div>

          <ul className="mt-12 grid gap-6 lg:grid-cols-2">
            {vitrineOrdinateurs.map((o) => (
              <li key={o.slug}>
                <OrdinateurCard ordinateur={o} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ═══════════ 4bis. WINDOWS 11 — vidéo + scénario ═══════════ */}
      <section className="mt-28 md:mt-40">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <LocalVideo
              src="/video/Trailerwindow11.mp4"
              affiche="/media/video/windows11-affiche.jpg"
              titre="Windows 11 en action"
            />

            {/* Le scénario : ce qui se passe réellement, étape par étape */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                <EyebrowLabel>Windows 11</EyebrowLabel>
                <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
                  Installé, activé, prêt à travailler.
                </h2>
                <p className="text-[1.0625rem] leading-relaxed text-graphite">
                  Vous repartez avec une licence authentique et une machine
                  configurée. Pas une clé trouvée en ligne qui se désactive
                  trois semaines plus tard.
                </p>
              </div>

              <ol className="flex flex-col">
                {ETAPES_WINDOWS.map((etape) => (
                  <li
                    key={etape.n}
                    className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 border-t border-mist/70 py-4 last:border-b"
                  >
                    <span className="pt-0.5 text-[0.8125rem] font-bold tracking-[0.04em] text-brand tabular-nums">
                      {etape.n}
                    </span>
                    <h3 className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                      {etape.titre}
                    </h3>
                    <p className="col-start-2 text-[0.9375rem] leading-relaxed text-graphite">
                      {etape.texte}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/electronique/p/windows-11-pro-licence">
                    Acheter ma licence
                    <ArrowRight size={17} aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/contact">Prendre rendez-vous</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════ 5. PRODUITS — grille dense ═══════════ */}
      <section className="mt-28 bg-frost-lifted py-24 md:mt-40 md:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="flex max-w-lg flex-col gap-5">
              <EyebrowLabel>Nos produits</EyebrowLabel>
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
                Les plus demandés en ce moment.
              </h2>
            </div>
            <Link
              href="/electronique"
              className="group/lien inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-ink transition-colors hover:text-brand"
            >
              Tout le catalogue
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform duration-200 group-hover/lien:translate-x-1"
              />
            </Link>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {vedettes.map((produit) => (
              <li key={produit.slug}>
                <ProductCard produit={produit} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ═══════════ 6. VÉHICULES — vitrine façon spot télévisé ═══════════ */}
      <div className="mt-28 md:mt-40">
        <VitrineVehicules />
      </div>

      {/* ═══════════ 7. DEVIS — encre + arcs ═══════════ */}
      <section className="mt-28 md:mt-40">
        <Container>
          <div className="relative overflow-hidden rounded-frame bg-ink px-8 py-20 md:px-14 md:py-24">
            <svg
              aria-hidden
              viewBox="0 0 800 400"
              fill="none"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[58%] md:block"
            >
              <path
                d="M 60 400 C 180 300, 300 240, 460 210 C 610 182, 720 120, 800 20"
                stroke="var(--color-orbit)"
                strokeWidth="1.25"
                strokeLinecap="round"
                opacity="0.5"
              />
              <path
                d="M 180 400 C 300 320, 420 280, 560 240 C 680 206, 760 150, 800 90"
                stroke="var(--color-orbit)"
                strokeWidth="1.25"
                strokeLinecap="round"
                opacity="0.25"
              />
            </svg>

            <div className="relative flex max-w-xl flex-col gap-7">
              <EyebrowLabel tone="frost">
                Devis immédiat
              </EyebrowLabel>
              <h2 className="text-[clamp(1.75rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.025em] text-white">
                Votre site chiffré avant la fin de votre café.
              </h2>
              <p className="max-w-md text-[1.0625rem] leading-relaxed text-white/70">
                Six questions. Le prix se met à jour à chaque réponse et vous
                repartez avec un devis en PDF. Pas de formulaire envoyé dans le
                vide, pas de rappel trois jours plus tard.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="border-white bg-white text-ink hover:border-white/80 hover:bg-white/90"
                >
                  <Link href="/devis">
                    Lancer le configurateur
                    <ArrowRight size={18} aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════ 8. MÉTHODE — typographie seule ═══════════ */}
      <section className="mt-28 md:mt-40">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-24">
            <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <EyebrowLabel>Comment ça se passe</EyebrowLabel>
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
                Quatre étapes, aucune surprise.
              </h2>
              <p className="text-[1.0625rem] leading-relaxed text-graphite">
                La même méthode, que vous achetiez un chargeur ou que vous
                fassiez importer un véhicule.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="group/lien inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-brand transition-colors hover:text-brand-deep"
                >
                  Nous poser une question
                  <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="transition-transform duration-200 group-hover/lien:translate-x-0.5 group-hover/lien:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>

            <ol className="flex flex-col">
              {METHODE.map((etape) => (
                <li
                  key={etape.n}
                  className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-mist/70 py-8 last:border-b"
                >
                  <span className="text-[0.875rem] font-bold tracking-[0.04em] text-brand tabular-nums">
                    {etape.n}
                  </span>
                  <h3 className="text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                    {etape.titre}
                  </h3>
                  <p className="col-start-2 max-w-md text-[1.0625rem] leading-relaxed text-graphite">
                    {etape.texte}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ═══════════ 9. VENEZ NOUS VOIR ═══════════ */}
      <section className="mt-28 md:mt-36">
        <Container>
          <CarteBoutique />
        </Container>
      </section>
    </>
  );
}
