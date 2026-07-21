"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PILLARS } from "@/lib/config/navigation";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { MarqueLogo } from "@/components/shared/MarqueLogo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

/**
 * MENU MOBILE
 *
 * Superposition plein écran, piliers dépliés en accordéon.
 * Conforme à la référence : sous 1024px, les liens de premier niveau passent
 * derrière le hamburger, la pilule ne conserve que logo + menu + panier.
 */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Le fond ne défile pas derrière la superposition.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      id="menu-mobile"
      hidden={!open}
      className={cn(
        "fixed inset-0 z-40 bg-frost lg:hidden",
        "flex flex-col overflow-y-auto pt-28 pb-12",
      )}
    >
      <nav aria-label="Navigation mobile" className="flex flex-col px-6">
        <ul className="flex flex-col">
          {PILLARS.map((pillar) => {
            const isOpen = expanded === pillar.id;
            return (
              <li key={pillar.id} className="border-b border-mist/60">
                <div className="flex items-center">
                  <Link
                    href={pillar.href}
                    onClick={onClose}
                    className="flex-1 py-5 text-display text-ink"
                  >
                    {pillar.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : pillar.id)}
                    aria-label={`Afficher les sous-rubriques ${pillar.label}`}
                    aria-expanded={isOpen}
                    className="grid size-11 place-items-center rounded-full text-slate transition-colors hover:bg-ghost"
                  >
                    <ChevronDown
                      size={20}
                      className={cn(
                        "transition-transform duration-300 ease-out-soft",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                </div>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out-soft",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <ul className="overflow-hidden">
                    {pillar.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className="flex items-center gap-3 py-3 pl-1 text-body text-graphite"
                        >
                          {link.logo ? (
                            <MarqueLogo
                              src={link.logo}
                              nom={link.label}
                              className="size-5 opacity-70"
                            />
                          ) : null}
                          <span>{link.label}</span>
                          {link.note ? (
                            <span className="ml-2 rounded-pill bg-ghost px-2 py-0.5 text-[0.625rem] font-bold text-brand uppercase">
                              {link.note}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                    <li aria-hidden className="h-4" />
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col gap-4">
          <EyebrowLabel>Votre projet</EyebrowLabel>
          <Button asChild size="lg" className="w-full">
            <Link href="/devis" onClick={onClose}>
              Chiffrer mon projet
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full">
            <Link href="/compte" onClick={onClose}>
              Mon compte
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
}
