import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: "Livraison, paiement, garantie, délais d'import et de transfert.",
};

/**
 * Chaque réponse est rédigée pour être vraie aujourd'hui. Les points encore
 * indéterminés (moyens de paiement en ligne, délais contractuels) le disent
 * plutôt que d'annoncer un engagement que l'entreprise ne peut pas encore tenir.
 */
const QUESTIONS = [
  {
    q: "Les produits affichés sont-ils réellement en stock ?",
    r: "Oui. Le catalogue reflète le stock physique à Bangui. Quand il ne reste que quelques pièces, c'est indiqué sur la fiche produit. Un article épuisé est marqué comme tel plutôt que retiré discrètement.",
  },
  {
    q: "Comment puis-je payer ?",
    r: "Le paiement en ligne par carte et Orange Money est en cours d'intégration. Le paiement à la livraison, en espèces, restera disponible en permanence. C'est le mode le plus utilisé ici et nous ne comptons pas le supprimer.",
  },
  {
    q: "Livrez-vous en dehors de Bangui ?",
    r: "Les modalités hors Bangui sont étudiées au cas par cas selon le volume et la destination. Contactez-nous avec votre localité, nous vous disons ce qui est possible et à quel coût.",
  },
  {
    q: "Combien de temps prend un import depuis la Chine ?",
    r: "Le maritime compte généralement en semaines, l'aérien en jours. Le délai exact dépend du volume, de la période et du dédouanement. Nous annonçons une fourchette au moment de la commande et communiquons chaque étape.",
  },
  {
    q: "Que comprend un site web livré ?",
    r: "Les fichiers sources et tous les accès. Un site livré sans ses accès vous rend dépendant de votre prestataire ; ce n'est pas notre façon de travailler. Vous pouvez reprendre le projet ailleurs quand vous voulez.",
  },
  {
    q: "Le transfert d'argent fonctionne-t-il dans les deux sens ?",
    r: "Non, uniquement à l'envoi depuis la Centrafrique. Nous ne traitons pas la réception de fonds entrants. Mieux vaut un service maîtrisé de bout en bout qu'une promesse intenable.",
  },
  {
    q: "Proposez-vous une garantie sur le matériel ?",
    r: "Les produits bénéficient de la garantie constructeur quand elle s'applique. Les conditions précises figureront dans les CGV, en cours de rédaction avec les informations légales de l'entreprise.",
  },
] as const;

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Questions fréquentes"
        title="Les questions qu'on nous pose vraiment."
        intro="Si la vôtre n'y est pas, écrivez-nous : elle finira probablement sur cette page."
      />

      <Container className="pb-32">
        <dl className="flex max-w-3xl flex-col">
          {QUESTIONS.map((item) => (
            <div
              key={item.q}
              className="flex flex-col gap-3 border-b border-mist/60 py-8 first:pt-0"
            >
              <dt className="text-title text-ink">{item.q}</dt>
              <dd className="text-body text-graphite">{item.r}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </>
  );
}
