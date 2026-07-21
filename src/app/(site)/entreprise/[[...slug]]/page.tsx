import { Container } from "@/components/ui/Container";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { Construction } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace Entreprise",
  description: "Solutions sur mesure pour les PME, ONG et partenaires.",
};

export default function EntrepriseComingSoonPage() {
  return (
    <section className="bg-frost min-h-[65vh] flex items-center py-20">
      <Container>
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto gap-6">
          <div className="grid size-20 place-items-center rounded-full bg-brand/10 text-brand mb-2 animate-reveal">
            <Construction size={36} strokeWidth={1.5} />
          </div>
          
          <div className="animate-reveal" style={{ animationDelay: "100ms" }}>
            <EyebrowLabel>Espace Entreprise</EyebrowLabel>
          </div>
          
          <h1 className="animate-reveal text-[clamp(2.5rem,5vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink" style={{ animationDelay: "200ms" }}>
            Cet évènement est à venir
          </h1>
          
          <p className="animate-reveal text-[1.125rem] text-graphite leading-relaxed" style={{ animationDelay: "300ms" }}>
            Nous finalisons actuellement nos offres et parcours dédiés aux PME, ONG et futurs partenaires. Cette section sera disponible très prochainement avec des solutions d'infogérance, de cotation et de fourniture de matériel pro sur mesure.
          </p>
          
          <div className="mt-6 animate-reveal" style={{ animationDelay: "400ms" }}>
            <Button asChild size="lg">
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
