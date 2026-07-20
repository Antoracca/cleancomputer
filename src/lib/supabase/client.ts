import { createBrowserClient } from "@supabase/ssr";

/**
 * CLIENT SUPABASE — NAVIGATEUR
 *
 * N'utilise que la clé publiable. Toute la sécurité repose sur les politiques
 * RLS définies dans supabase/schema.sql : ce client n'a aucun privilège
 * particulier, même si quelqu'un lit la clé dans le code source.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
