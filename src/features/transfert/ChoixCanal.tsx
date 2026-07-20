"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Simulateur } from "@/features/transfert/Simulateur";
import { OPERATEURS, type OperateurId } from "@/lib/data/transfert";
import { cn } from "@/lib/utils/cn";

/**
 * CHOIX DU CANAL, PUIS ENVOI
 *
 * Deux temps sur une seule page, sans rechargement :
 *
 *   1. L'utilisateur choisit son canal parmi les trois réseaux.
 *   2. Le panneau d'envoi glisse depuis la droite.
 *
 * Le bouton reste INACTIF tant qu'aucun canal n'est choisi. Un bouton
 * cliquable qui ne fait rien est plus déroutant qu'un bouton visiblement
 * désactivé : ici l'état gris dit exactement ce qu'il manque.
 *
 * Les deux panneaux sont montés en permanence et translatés. Démonter puis
 * remonter provoquerait un saut de mise en page et perdrait la saisie en cours
 * si l'utilisateur revient en arrière.
 */
export function ChoixCanal() {
  const [canal, setCanal] = useState<OperateurId | null>(null);
  const [etape, setEtape] = useState<0 | 1>(0);

  const choisi = OPERATEURS.find((o) => o.id === canal);

  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          "flex w-[200%] transition-transform duration-500 ease-out-soft",
          etape === 1 && "-translate-x-1/2",
        )}
      >
        {/* ───────────── Panneau 1 : le canal ───────────── */}
        <div
          className="w-1/2 shrink-0 pr-1"
          aria-hidden={etape === 1}
          inert={etape === 1 ? true : undefined}
        >
          <div className="flex flex-col gap-8">
            <ul className="grid gap-4 md:grid-cols-3">
              {OPERATEURS.map((o) => {
                const actif = canal === o.id;
                return (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => setCanal(o.id)}
                      aria-pressed={actif}
                      className={cn(
                        "group/canal relative flex w-full flex-col gap-5 rounded-frame border-[1.5px] bg-white p-7 text-left",
                        "transition-[border-color,transform] duration-200 ease-out-soft",
                        actif
                          ? "border-ink"
                          : "border-mist hover:-translate-y-0.5 hover:border-slate",
                      )}
                    >
                      {actif ? (
                        <span className="absolute top-5 right-5 grid size-6 place-items-center rounded-full bg-ink text-frost">
                          <Check size={14} strokeWidth={3} aria-hidden />
                        </span>
                      ) : null}

                      <span className="relative h-9 w-full">
                        <Image
                          src={o.logo}
                          alt={o.nom}
                          fill
                          sizes="200px"
                          className="object-contain object-left"
                        />
                      </span>

                      <span className="flex flex-col gap-1.5">
                        <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                          {o.nom}
                        </span>
                        <span className="text-[0.9375rem] leading-relaxed text-graphite">
                          {o.baseline}
                        </span>
                      </span>

                      <span className="mt-auto flex flex-wrap gap-2">
                        <span className="rounded-pill bg-frost px-3 py-1 text-[0.75rem] text-graphite">
                          {o.delai}
                        </span>
                        {o.corridorsAutorises ? (
                          <span className="rounded-pill bg-frost px-3 py-1 text-[0.75rem] text-graphite">
                            Maroc uniquement
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                size="lg"
                disabled={!canal}
                onClick={() => setEtape(1)}
                className="w-full sm:w-fit"
              >
                Envoyer de l&apos;argent
                <ArrowRight size={17} aria-hidden />
              </Button>

              {!canal ? (
                <p className="text-[0.875rem] text-slate">
                  Choisissez d&apos;abord un service ci-dessus.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* ───────────── Panneau 2 : l'envoi ───────────── */}
        <div
          className="w-1/2 shrink-0 pl-1"
          aria-hidden={etape === 0}
          inert={etape === 0 ? true : undefined}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setEtape(0)}
                className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-graphite transition-colors hover:text-ink"
              >
                <ArrowRight size={16} aria-hidden className="rotate-180" />
                Changer de service
              </button>

              {choisi ? (
                <span className="relative h-7 w-32">
                  <Image
                    src={choisi.logo}
                    alt={choisi.nom}
                    fill
                    sizes="128px"
                    className="object-contain object-right"
                  />
                </span>
              ) : null}
            </div>

            {canal ? <Simulateur canalImpose={canal} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
