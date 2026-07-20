import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * MIDDLEWARE DE SESSION
 *
 * Rafraîchit le jeton Supabase à chaque navigation et protège les routes
 * privées.
 *
 * ⚠️ On utilise `getUser()` et non `getSession()` : `getSession()` lit le
 * cookie sans le vérifier auprès du serveur d'authentification, donc un cookie
 * falsifié passerait. `getUser()` valide le jeton. Sur une route qui garde un
 * panel d'administration, la différence est critique.
 */

const ROUTES_PRIVEES = ["/compte", "/admin"];
const ROUTES_AUTH = ["/connexion", "/inscription"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Visiteur non connecté sur une route privée → connexion, en mémorisant
  // la destination pour l'y renvoyer après authentification.
  if (!user && ROUTES_PRIVEES.some((r) => pathname.startsWith(r))) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("suite", pathname);
    return NextResponse.redirect(url);
  }

  // Utilisateur déjà connecté sur connexion/inscription → son compte.
  if (user && ROUTES_AUTH.some((r) => pathname.startsWith(r))) {
    const url = request.nextUrl.clone();
    url.pathname = "/compte";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Tout sauf les fichiers statiques et les images — inutile de valider une
     * session pour servir un logo, et coûteux à chaque requête.
     */
    "/((?!_next/static|_next/image|favicon.ico|media|brand|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|webm)$).*)",
  ],
};
