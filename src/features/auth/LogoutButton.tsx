"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

/**
 * DÉCONNEXION
 *
 * `refresh()` avant `push()` : sans cela, les composants serveur gardent en
 * cache l'état « connecté » et l'utilisateur verrait encore ses données une
 * fraction de seconde après s'être déconnecté.
 */
export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleLogout}
      disabled={pending}
    >
      <LogOut size={16} aria-hidden />
      {pending ? "Déconnexion…" : "Se déconnecter"}
    </Button>
  );
}
