import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, ShieldCheck, Briefcase } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { LocalVideo } from "@/components/shared/LocalVideo";

export const metadata: Metadata = {
  title: "Entreprise & B2B",
  description:
    "Le partenaire technologique des décideurs exigeants en Centrafrique. Solutions PME, ONG, Cotation express et Infogérance.",
};

export default function EntreprisePage() {
  return (
    <>
      {/* ═══════════ HERO (Wow Effect) ═══════════ */}
      <section className="relative overflow-hidden bg-ink pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-30"
          >
            <source src="/media/video/hero-laptop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="flex max-w-4xl flex-col items-start gap-8 animate-reveal">
            <EyebrowLabel className="text-white/80 bg-white/10 px-4 py-2 rounded-pill backdrop-blur-md shadow-sm">
              Espace Professionnels & ONG
            </EyebrowLabel>
            <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-white text-balance">
              Le partenaire technologique des décideurs exigeants.
            </h1>
            <p className="max-w-2xl text-[1.125rem] md:text-[1.25rem] leading-relaxed text-white/80">
              Infrastructures fiables, fourniture de matériel de pointe certifié et maintenance proactive pour les PME et ONG en République Centrafricaine.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row mt-4 w-full sm:w-auto">
              <Button asChild size="lg" className="bg-white text-ink hover:bg-frost h-14 px-8 text-lg w-full sm:w-auto">
                <Link href="/entreprise/cotation">Demander une cotation</Link>
              </Button>
              <Button asChild size="lg" className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/40 h-14 px-8 text-lg w-full sm:w-auto">
                <Link href="/contact">Parler à un expert</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════ BENTO GRID (Pôles d'expertise) ═══════════ */}
      <section className="bg-frost py-20 md:py-32">
        <Container>
          <div className="mb-16 flex flex-col gap-4 animate-reveal">
            <h2 className="text-[clamp(2rem,5vw,3rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink">
              Nos pôles d'expertise
            </h2>
            <p className="max-w-xl text-lg text-graphite">
              Des solutions sur mesure conçues pour répondre aux défis logistiques et techniques de votre secteur.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-[400px]">
            {/* PME (Span 2 cols on LG) */}
            <Link
              href="/entreprise/pme"
              className="group relative overflow-hidden rounded-[2rem] bg-white shadow-[0_4px_24px_rgba(15,21,32,0.04)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl lg:col-span-2 animate-reveal"
            >
              <div className="absolute inset-0 z-0 h-full w-full">
                <Image
                  src="/logo/materiels1.jpg"
                  alt="Matériel PME"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white">
                <div className="mb-4 grid size-12 place-items-center rounded-full bg-white/20 backdrop-blur-md">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-3xl font-bold tracking-[-0.02em] mb-3">Pour les PME & Institutions</h3>
                <p className="text-white/80 max-w-md text-lg">Modernisation de votre parc informatique, déploiement réseau très haut débit, et digitalisation pour accélérer votre croissance.</p>
              </div>
            </Link>

            {/* ONG */}
            <Link
              href="/entreprise/ong"
              className="group relative overflow-hidden rounded-[2rem] bg-white shadow-[0_4px_24px_rgba(15,21,32,0.04)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl animate-reveal"
              style={{ animationDelay: "100ms" }}
            >
              <div className="absolute inset-0 z-0 h-full w-full">
                <Image
                  src="/media/portraits/reseau-starlink-stock.jpg"
                  alt="ONG Starlink"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold tracking-[-0.02em] mb-2">Pour les ONG</h3>
                <p className="text-white/80">Connectivité satellite Starlink, communications sécurisées et équipements durcis pour vos missions sur le terrain.</p>
              </div>
            </Link>

            {/* Cotation */}
            <Link
              href="/entreprise/cotation"
              className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] p-8 shadow-[0_4px_24px_rgba(15,21,32,0.04)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl animate-reveal"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="grid size-16 place-items-center rounded-2xl bg-white shadow-sm">
                  <Image src="/logo/cotation.png" alt="Cotation" width={32} height={32} className="object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-[-0.02em] text-ink mb-2">Demande de cotation</h3>
                  <p className="text-graphite">Traitement prioritaire pour vos achats en volume avec tarification B2B exclusive.</p>
                </div>
              </div>
            </Link>

            {/* Partenariat (Span 2 cols on LG) */}
            <Link
              href="/entreprise/partenariat"
              className="group relative overflow-hidden rounded-[2rem] bg-brand p-8 shadow-[0_4px_24px_rgba(15,21,32,0.04)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl lg:col-span-2 animate-reveal"
              style={{ animationDelay: "100ms" }}
            >
              <div className="absolute -right-20 -top-20 size-96 rounded-full bg-white/10 blur-3xl transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-black/10 blur-3xl" />
              
              <div className="relative z-10 flex h-full flex-col justify-between text-white">
                <div className="grid size-16 place-items-center rounded-2xl bg-white/10 backdrop-blur-md">
                  <Image src="/logo/partenariat.png" alt="Partenariat" width={40} height={40} className="object-contain brightness-0 invert" />
                </div>
                <div className="max-w-lg">
                  <h3 className="text-[2rem] leading-tight font-bold tracking-[-0.02em] mb-3">
                    Partenariat & Infogérance
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Confiez-nous votre infrastructure. Nous proposons des contrats de maintenance préventive avec un SLA garanti (temps d'intervention), pour que la panne ne soit plus une option.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* ═══════════ SLOW MOTION SHOWCASE ═══════════ */}
      <section className="bg-ink py-20 md:py-32 overflow-hidden relative">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-6 text-white animate-reveal">
              <span className="text-[1.0625rem] font-bold tracking-[-0.01em] text-brand">Matériel premium</span>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
                Équipements certifiés, zéro compromis.
              </h2>
              <p className="text-lg text-white/70 leading-relaxed max-w-lg">
                Dans le monde professionnel, chaque seconde compte. C'est pourquoi Clean Computer s'engage à ne fournir que du matériel authentique (Microsoft, HP, Starlink) éprouvé pour des environnements critiques.
              </p>
              
              <ul className="mt-4 flex flex-col gap-4">
                {[
                  "Approvisionnement direct sans intermédiaires douteux.",
                  "Configuration et tests de performance avant livraison sur site.",
                  "Remplacement express en cas de défaillance matérielle."
                ].map((point) => (
                  <li key={point} className="flex items-start gap-4">
                    <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-success/20 text-success">
                      <Check size={14} strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-[1.0625rem] font-medium text-white/90">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square animate-reveal" style={{ animationDelay: "150ms" }}>
              <div className="absolute inset-0 scale-[1.02] bg-white/5 blur-3xl rounded-full" />
              <LocalVideo
                src="/video/Trailerwindow11.mp4"
                affiche="/media/video/windows11-affiche.jpg"
                titre="Matériel Professionnel"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="bg-white py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-3xl text-center flex flex-col items-center gap-8 animate-reveal">
            <div className="grid size-20 place-items-center rounded-full bg-brand/10 text-brand shadow-sm">
              <ShieldCheck size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-ink text-balance">
              Prêt à transformer votre infrastructure ?
            </h2>
            <p className="text-xl text-graphite max-w-2xl text-balance">
              Un expert dédié est prêt à étudier vos besoins techniques et logistiques, pour vous proposer une solution sur mesure sous 24 heures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
              <Button asChild size="lg" className="w-full sm:w-auto h-14 px-10 text-lg shadow-lg">
                <Link href="/entreprise/cotation">Lancer une cotation</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg">
                <Link href="/contact">Planifier un appel</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
