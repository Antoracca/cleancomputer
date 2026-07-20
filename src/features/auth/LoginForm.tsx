"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import {
  validateEmail,
  validatePassword,
  type FieldErrors,
} from "@/features/auth/validation";

/**
 * FORMULAIRE DE CONNEXION
 *
 * Branché sur Supabase Auth.
 *
 * ⚠️ Le message d'erreur reste VOLONTAIREMENT générique : distinguer
 * « ce compte n'existe pas » de « mot de passe incorrect » permet d'énumérer
 * les comptes clients d'un site marchand.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setNotice(null);

    const next: FieldErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError) next.email = emailError;
    if (passwordError) next.password = passwordError;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setPending(false);
      setNotice(
        error.message === "Email not confirmed"
          ? "Votre adresse n'est pas encore confirmée. Vérifiez votre boîte mail."
          : "Adresse email ou mot de passe incorrect.",
      );
      return;
    }

    // `refresh()` avant `push()` : sans cela, le layout serveur garde l'état
    // « déconnecté » en cache et l'utilisateur voit brièvement l'ancien écran.
    const suite = searchParams.get("suite") ?? "/compte";
    router.refresh();
    router.push(suite);
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

      <Field label="Mot de passe" htmlFor="password" error={errors.password}>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            invalid={Boolean(errors.password)}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-14"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={
              showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
            className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-slate transition-colors hover:bg-ghost hover:text-ink"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </Field>

      <div className="flex justify-end">
        <Link
          href="/mot-de-passe-oublie"
          className="inline-flex min-h-6 items-center text-[0.875rem] text-brand transition-colors hover:text-brand-deep"
        >
          Mot de passe oublié ?
        </Link>
      </div>

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
            Connexion…
          </>
        ) : (
          "Se connecter"
        )}
      </Button>
    </form>
  );
}
