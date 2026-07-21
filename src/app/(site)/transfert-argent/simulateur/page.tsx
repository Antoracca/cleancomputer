import { redirect } from "next/navigation";

/**
 * L'ancienne adresse du simulateur redirige vers le parcours d'envoi.
 * Le mot « simulateur » a disparu du vocabulaire du site : on n'estime plus,
 * on envoie. Les liens déjà partagés continuent de fonctionner.
 */
export default function SimulateurRedirect() {
  redirect("/transfert-argent");
}
