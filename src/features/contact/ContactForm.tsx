"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import {
  validateEmail,
  validateRequired,
  type FieldErrors,
} from "@/features/auth/validation";

/**
 * FORMULAIRE DE CONTACT
 *
 * ⚠️ NON BRANCHÉ — l'envoi n'atteint aucun serveur pour l'instant. L'interface
 * et la validation sont réelles ; l'envoi par email (Resend) arrive en Phase 4.
 *
 * Le message de retour le dit franchement : afficher « Message envoyé ! » alors
 * que rien n'est parti laisserait un client attendre une réponse qui ne
 * viendrait jamais.
 */
const SUJETS = [
  "Question sur un produit",
  "Projet de site ou d'application",
  "Identité visuelle",
  "Transfert d'argent",
  "Import ou expédition",
  "Commande en cours",
  "Autre",
] as const;

export function ContactForm() {
  const [values, setValues] = useState({
    nom: "",
    email: "",
    sujet: SUJETS[0] as string,
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function set(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setNotice(null);

    const next: FieldErrors = {};
    const nomError = validateRequired(values.nom, "Votre nom");
    const emailError = validateEmail(values.email);
    const messageError = validateRequired(values.message, "Un message");

    if (nomError) next.nom = nomError;
    if (emailError) next.email = emailError;
    if (messageError) next.message = messageError;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    // Phase 4 : envoi via Resend + enregistrement de la demande
    window.setTimeout(() => {
      setPending(false);
      setNotice(
        "L'envoi du formulaire n'est pas encore connecté au serveur. Votre message n'a donc pas été transmis — contactez-nous directement en attendant.",
      );
    }, 600);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Votre nom" htmlFor="nom" error={errors.nom}>
          <Input
            id="nom"
            name="nom"
            autoComplete="name"
            value={values.nom}
            invalid={Boolean(errors.nom)}
            onChange={(e) => set("nom", e.target.value)}
          />
        </Field>

        <Field label="Adresse email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            invalid={Boolean(errors.email)}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Sujet" htmlFor="sujet">
        <Select
          id="sujet"
          name="sujet"
          value={values.sujet}
          onChange={(e) => set("sujet", e.target.value)}
        >
          {SUJETS.map((sujet) => (
            <option key={sujet} value={sujet}>
              {sujet}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Votre message"
        htmlFor="message"
        hint="Plus c'est précis, plus la réponse sera utile."
        error={errors.message}
      >
        <Textarea
          id="message"
          name="message"
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </Field>

      {notice ? (
        <p
          role="status"
          className="rounded-action border border-mist bg-white px-5 py-4 text-[0.875rem] text-graphite"
        >
          {notice}
        </p>
      ) : null}

      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? (
            <>
              <Loader2 size={17} aria-hidden className="animate-spin" />
              Envoi…
            </>
          ) : (
            "Envoyer le message"
          )}
        </Button>
      </div>
    </form>
  );
}
