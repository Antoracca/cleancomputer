import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";

/**
 * AVIS DE FONCTIONNALITÉ À VENIR
 *
 * Employé sur les pages dont l'interface est posée mais dont le moteur n'est
 * pas encore branché (simulateur, panier, configurateur…).
 *
 * Principe : ne JAMAIS simuler une fonctionnalité absente. Une fausse
 * confirmation de commande ou un faux taux de change trompent l'utilisateur
 * et détruisent la confiance bien plus qu'un message d'attente honnête.
 *
 * Chaque avis propose donc une voie de sortie réelle : un contact humain.
 */
export function FeatureNotice({
  titre,
  explication,
  phase,
}: {
  titre: string;
  explication: string;
  phase: string;
}) {
  return (
    <Container className="pb-32">
      <div className="flex flex-col gap-6 rounded-frame border border-mist/60 bg-white px-8 py-14 md:px-14">
        <EyebrowLabel>En cours de construction</EyebrowLabel>
        <h2 className="max-w-2xl text-display text-ink">{titre}</h2>
        <p className="max-w-xl text-body text-graphite">{explication}</p>
        <p className="text-[0.8125rem] text-slate">Livraison prévue : {phase}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/contact">Nous contacter directement</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/electronique">Voir la boutique</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
