"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { validateEmail, type FieldErrors } from "@/features/auth/validation";

/**
 * MOT DE PASSE OUBLIÉ
 *
 * ⚠️ Sécurité : la réponse est IDENTIQUE que l'adresse existe ou non, y compris
 * en cas d'erreur Supabase. Répondre « ce compte n'existe pas » permettrait
 * d'énumérer les comptes clients d'un site marchand.
 */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setNotice(null);

    const emailError = validateEmail(email);
    setErrors(emailError ? { email: emailError } : {});
    if (emailError) return;

    setPending(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/nouveau-mot-de-passe`,
    });

    // Réponse volontairement identique dans tous les cas — le résultat de
    // l'appel n'est délibérément pas testé.
    setPending(false);
    setNotice(
      "Si un compte existe avec cette adresse, un lien de réinitialisation vient d'être envoyé. Pensez à vérifier vos indésirables.",
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Field label="Adresse email" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="vous@exemple.cf"
          value={email}
          invalid={Boolean(errors.email)}
          onChange={(e) => setEmail(e.target.value)}
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

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 size={17} aria-hidden className="animate-spin" />
            Envoi…
          </>
        ) : (
          "Recevoir le lien"
        )}
      </Button>
    </form>
  );
}
