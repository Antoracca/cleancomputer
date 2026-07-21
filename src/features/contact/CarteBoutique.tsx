"use client";

import { useState } from "react";
import { LoaderCircle, MapPin, Navigation, Phone } from "lucide-react";
import { COMPANY, PHONE_HREF } from "@/lib/config/company";
import { cn } from "@/lib/utils/cn";

/**
 * CARTE DE LA BOUTIQUE
 *
 * Carte Google centrée sur la boutique, et un itinéraire en un geste.
 *
 * POURQUOI PAS L'API JAVASCRIPT DE GOOGLE MAPS
 *
 * Elle exigerait une clé, donc une facturation à l'affichage, et chargerait
 * plusieurs centaines de kilo-octets de script. Pour montrer un point et
 * lancer un itinéraire, l'iframe d'intégration suffit : aucune clé, aucun
 * script tiers, et elle ne se charge qu'au défilement grâce à `loading=lazy`.
 *
 * GÉOLOCALISATION : SUR CLIC, JAMAIS AU CHARGEMENT
 *
 * Demander la position dès l'arrivée sur la page ferait surgir une
 * autorisation navigateur que personne n'a sollicitée, et la plupart des gens
 * refusent par réflexe. Ici, la position n'est demandée que si l'utilisateur
 * clique sur « Itinéraire depuis ma position ».
 *
 * Et si elle est refusée ou indisponible, l'itinéraire part quand même :
 * Google se charge alors de déterminer le point de départ. Le bouton ne tombe
 * jamais en panne, il est seulement moins précis.
 */

const DESTINATION = `${COMPANY.latitude},${COMPANY.longitude}`;

/** Carte d'intégration, sans clé d'API. */
const SRC_CARTE = `https://maps.google.com/maps?q=${DESTINATION}&z=17&hl=fr&output=embed`;

export function CarteBoutique() {
  const [localisation, setLocalisation] = useState<"repos" | "recherche">(
    "repos",
  );

  function ouvrirItineraire(origine?: string) {
    const params = new URLSearchParams({
      api: "1",
      destination: DESTINATION,
      travelmode: "driving",
    });
    if (origine) params.set("origin", origine);
    window.open(
      `https://www.google.com/maps/dir/?${params.toString()}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function itineraireDepuisMaPosition() {
    if (!("geolocation" in navigator)) {
      ouvrirItineraire();
      return;
    }

    setLocalisation("recherche");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocalisation("repos");
        const { latitude, longitude } = position.coords;
        ouvrirItineraire(`${latitude},${longitude}`);
      },
      () => {
        // Refus, délai dépassé, GPS coupé : on n'affiche pas d'erreur, on
        // lance l'itinéraire sans point de départ. Google demandera lui-même.
        setLocalisation("repos");
        ouvrirItineraire();
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    );
  }

  return (
    <div className="grid overflow-hidden rounded-frame border border-mist/60 bg-white lg:grid-cols-[1fr_1.15fr]">
      {/* ───────────── Le texte et les actions ───────────── */}
      <div className="flex flex-col gap-7 px-8 py-12 md:px-12 lg:py-14">
        <div className="flex flex-col gap-3">
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] font-medium tracking-[-0.025em] text-ink">
            Passez nous voir, on est ouvert.
          </h2>
          <p className="max-w-md text-[1.0625rem] leading-relaxed text-graphite">
            La boutique est sur l&apos;{COMPANY.address}, à {COMPANY.city}.
            Lancez l&apos;itinéraire, votre téléphone vous guide jusque devant
            la porte.
          </p>
        </div>

        <p className="inline-flex items-start gap-3 text-[1.0625rem] leading-snug font-medium text-ink">
          <MapPin size={19} aria-hidden className="mt-0.5 shrink-0 text-brand" />
          {COMPANY.address}, {COMPANY.city}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={itineraireDepuisMaPosition}
            disabled={localisation === "recherche"}
            className={cn(
              "inline-flex min-h-14 items-center justify-center gap-3 rounded-action px-8",
              "border-[1.5px] border-ink bg-ink text-[1.0625rem] font-medium tracking-[-0.02em] text-frost",
              "transition-colors hover:border-charcoal hover:bg-charcoal",
              "disabled:cursor-wait disabled:opacity-70",
            )}
          >
            {localisation === "recherche" ? (
              <>
                <LoaderCircle size={18} aria-hidden className="animate-spin" />
                Localisation…
              </>
            ) : (
              <>
                <Navigation size={18} aria-hidden />
                Itinéraire depuis ma position
              </>
            )}
          </button>

          <a
            href={PHONE_HREF}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-action border-[1.5px] border-ink bg-white px-8 text-[1.0625rem] font-medium tracking-[-0.02em] text-ink transition-colors hover:bg-ink hover:text-frost"
          >
            <Phone size={18} aria-hidden />
            {COMPANY.phone}
          </a>
        </div>

        <p className="text-[0.8125rem] leading-relaxed text-slate">
          Votre position sert uniquement à calculer le trajet. Elle part
          directement vers Google Maps, elle n&apos;est ni enregistrée ni
          transmise à Clean Computer.
        </p>
      </div>

      {/* ───────────── La carte ───────────── */}
      <div className="relative min-h-[340px] bg-ghost lg:min-h-[440px]">
        <iframe
          src={SRC_CARTE}
          title={`Emplacement de ${COMPANY.tradeName} sur la carte`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    </div>
  );
}
