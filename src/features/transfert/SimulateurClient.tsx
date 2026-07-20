"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { Simulateur } from "@/features/transfert/Simulateur";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

/**
 * ENVELOPPE CLIENT DU SIMULATEUR
 *
 * Isole l'état de la page serveur. Pour l'instant, « Continuer » affiche un
 * message d'attente : le parcours en étapes (bénéficiaire, mode de réception,
 * paiement, référence) n'est pas encore construit.
 *
 * ⚠️ Aucun faux enchaînement n'est simulé. Emmener un client jusqu'à un écran
 * de confirmation alors qu'aucun transfert ne part serait trompeur sur un
 * service financier.
 */
export function SimulateurClient() {
  const [valide, setValide] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <Simulateur onContinuer={() => setValide(true)} />

      {valide ? (
        <div
          role="status"
          className="flex flex-col gap-4 rounded-frame border border-mist/60 bg-white px-8 py-10"
        >
          <span className="inline-flex items-center gap-2.5 text-[1.0625rem] font-medium text-ink">
            <CircleCheck size={19} aria-hidden className="text-brand" />
            Votre estimation est prête.
          </span>
          <p className="max-w-xl text-body text-graphite">
            La suite du parcours, saisie du bénéficiaire, mode de réception et
            paiement, est en cours de construction. En attendant, appelez-nous
            avec cette estimation : nous préparons le transfert avec vous.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Nous contacter</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/transfert-argent">Comment ça marche</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
