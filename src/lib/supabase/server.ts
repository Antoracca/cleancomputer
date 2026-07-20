import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * CLIENT SUPABASE — SERVEUR
 *
 * Utilise la clé publiable et la session de l'utilisateur portée par les
 * cookies. Les politiques RLS s'appliquent donc normalement : un composant
 * serveur ne peut pas lire les données d'un autre client par erreur.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Appelé depuis un composant serveur : l'écriture de cookie est
            // interdite. Le middleware rafraîchit déjà la session, donc on
            // peut ignorer sans risque.
          }
        },
      },
    },
  );
}

/**
 * CLIENT D'ADMINISTRATION — CONTOURNE LE RLS
 *
 * ⚠️ DANGER. Ce client a tous les droits sur toutes les lignes de toutes les
 * tables. Il n'existe que pour les traitements serveur qui ne peuvent pas
 * s'exécuter sous l'identité d'un utilisateur : webhooks de paiement,
 * tâches planifiées, imports.
 *
 * Règles absolues :
 * — jamais importé depuis un composant client
 * — jamais utilisé pour servir une requête au nom d'un visiteur
 * — la clé n'est pas préfixée NEXT_PUBLIC_, donc jamais envoyée au navigateur
 */
export async function createAdminClient() {
  const { createClient: createSupabaseClient } = await import(
    "@supabase/supabase-js"
  );

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY absente. Le client d'administration ne peut pas être créé.",
    );
  }

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
