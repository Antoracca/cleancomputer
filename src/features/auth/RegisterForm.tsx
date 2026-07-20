"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import {
  passwordStrength,
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  type FieldErrors,
} from "@/features/auth/validation";

/**
 * FORMULAIRE D'INSCRIPTION
 *
 * Branché sur Supabase Auth. Le nom et le téléphone partent en métadonnées :
 * un déclencheur en base (`handle_new_user`) les recopie dans `profiles`, ce
 * qui garantit qu'un compte a toujours un profil associé.
 *
 * Le téléphone est demandé car c'est le canal de contact réel à Bangui pour
 * la livraison et le suivi de commande — pas un champ de confort.
 */
const STRENGTH_LABELS = ["", "Faible", "Correct", "Bon", "Solide"] as const;

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    nom: "",
    email: "",
    telephone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const strength = passwordStrength(values.password);

  function set(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setNotice(null);

    const next: FieldErrors = {};
    const nomError = validateRequired(values.nom, "Votre nom");
    const emailError = validateEmail(values.email);
    const phoneError = validatePhone(values.telephone);
    const passwordError = validatePassword(values.password);

    if (nomError) next.nom = nomError;
    if (emailError) next.email = emailError;
    if (phoneError) next.telephone = phoneError;
    if (passwordError) next.password = passwordError;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: {
        data: {
          nom: values.nom.trim(),
          telephone: values.telephone.trim(),
        },
      },
    });

    if (error) {
      setPending(false);
      setNotice(
        error.message.includes("already registered")
          ? "Un compte existe déjà avec cette adresse. Essayez de vous connecter."
          : "La création du compte a échoué. Réessayez dans un instant.",
      );
      return;
    }

    // Si la confirmation par email est active, aucune session n'est ouverte :
    // on annonce l'email à vérifier plutôt que de rediriger vers un espace
    // client auquel l'utilisateur n'a pas encore accès.
    if (!data.session) {
      setPending(false);
      setNotice(
        "Compte créé. Vérifiez votre boîte mail : un lien de confirmation vous attend.",
      );
      return;
    }

    router.refresh();
    router.push("/compte");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Field label="Nom complet" htmlFor="nom" error={errors.nom}>
        <Input
          id="nom"
          name="nom"
          autoComplete="name"
          placeholder="Prénom et nom"
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
          placeholder="vous@exemple.cf"
          value={values.email}
          invalid={Boolean(errors.email)}
          onChange={(e) => set("email", e.target.value)}
        />
      </Field>

      <Field
        label="Téléphone"
        htmlFor="telephone"
        hint="Pour le suivi de commande et la livraison."
        error={errors.telephone}
      >
        <Input
          id="telephone"
          name="telephone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+236 70 00 00 00"
          value={values.telephone}
          invalid={Boolean(errors.telephone)}
          onChange={(e) => set("telephone", e.target.value)}
        />
      </Field>

      <Field label="Mot de passe" htmlFor="password" error={errors.password}>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="8 caractères minimum"
            value={values.password}
            invalid={Boolean(errors.password)}
            onChange={(e) => set("password", e.target.value)}
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

        {/* Jauge de force — informative, jamais bloquante */}
        {values.password ? (
          <div className="mt-1 flex items-center gap-3">
            <div className="flex flex-1 gap-1" aria-hidden>
              {[1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className={cn(
                    "h-1 flex-1 rounded-pill transition-colors duration-300",
                    strength >= level
                      ? strength <= 1
                        ? "bg-danger"
                        : strength === 2
                          ? "bg-warning"
                          : "bg-success"
                      : "bg-ghost",
                  )}
                />
              ))}
            </div>
            <span className="text-[0.75rem] text-slate">
              {STRENGTH_LABELS[strength]}
            </span>
          </div>
        ) : null}
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
            Création…
          </>
        ) : (
          "Créer mon compte"
        )}
      </Button>

      <p className="text-[0.8125rem] text-slate">
        En créant un compte, vous acceptez nos conditions générales de vente et
        notre politique de confidentialité.
      </p>
    </form>
  );
}
