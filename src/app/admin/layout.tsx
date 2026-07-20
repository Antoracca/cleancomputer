import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/features/auth/LogoutButton";

/**
 * COQUILLE D'ADMINISTRATION
 *
 * Double barrière : le middleware exige déjà une session, ce layout vérifie
 * le RÔLE. Un client connecté qui tape /admin est renvoyé vers son compte.
 * Et même si ces deux barrières tombaient, les politiques RLS en base
 * refuseraient les écritures — la sécurité ne repose jamais sur l'interface.
 *
 * Volontairement austère : c'est un outil de travail, pas une vitrine. La
 * grammaire du design system reste (rayons, encre, trait), le decorum non.
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?suite=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, nom")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin" && profile?.role !== "conseiller") {
    redirect("/compte");
  }

  return (
    <div className="min-h-dvh bg-frost">
      <header className="border-b border-mist/60 bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-6 md:px-12">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5">
              <Image
                src="/brand/logo-mark.png"
                alt=""
                width={512}
                height={512}
                className="size-8 object-contain"
              />
              <span className="text-action font-medium text-ink">
                Administration
              </span>
            </Link>
            <nav aria-label="Administration" className="hidden items-center gap-1 md:flex">
              <AdminLink href="/admin">Vue d&apos;ensemble</AdminLink>
              <AdminLink href="/admin/commandes">Commandes</AdminLink>
              <AdminLink href="/admin/produits">Produits</AdminLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-1.5 text-[0.875rem] text-graphite transition-colors hover:text-ink"
            >
              <ArrowLeft size={15} aria-hidden />
              Voir le site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Navigation mobile */}
      <nav aria-label="Administration" className="flex gap-1 border-b border-mist/60 bg-white px-6 py-2 md:hidden">
        <AdminLink href="/admin">Vue d&apos;ensemble</AdminLink>
        <AdminLink href="/admin/commandes">Commandes</AdminLink>
        <AdminLink href="/admin/produits">Produits</AdminLink>
      </nav>

      <main className="mx-auto max-w-[1280px] px-6 py-10 md:px-12">
        {children}
      </main>
    </div>
  );
}

function AdminLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center rounded-pill px-4 text-[0.9375rem] font-medium text-graphite transition-colors hover:bg-ghost hover:text-ink"
    >
      {children}
    </Link>
  );
}
