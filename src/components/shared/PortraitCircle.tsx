"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EyebrowLabel } from "@/components/shared/EyebrowLabel";
import { cn } from "@/lib/utils/cn";

export type PortraitFrame = {
  image?: string;
  images?: [string, string];
  title: string;
  description?: string;
  objectFit?: "cover" | "contain";
};

/**
 * PORTRAIT CIRCULAIRE — le composant identitaire du système
 *
 * Photo carrée recadrée en cercle parfait, avec un satellite blanc amarré en
 * bas à droite qui déborde d'environ 40% hors du cercle.
 * Peut désormais animer un carrousel d'images et de textes via la prop `frames`.
 */
export function PortraitCircle({
  image,
  images,
  frames,
  alt,
  eyebrow,
  title,
  description,
  href,
  size = "md",
  className,
  priority = false,
}: {
  image?: string;
  images?: [string, string];
  frames?: PortraitFrame[];
  alt: string;
  eyebrow: string;
  title?: string;
  description?: string;
  href: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!frames || frames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % frames.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [frames]);

  const diameter = {
    sm: "size-[200px] sm:size-[240px]",
    md: "size-[220px] sm:size-[280px] lg:size-[320px]",
    lg: "size-[240px] sm:size-[320px] lg:size-[380px]",
  }[size];

  return (
    <div className={cn("group/portrait flex max-w-[380px] flex-col", className)}>
      <Link
        href={href}
        className="relative block self-start rounded-full outline-offset-8"
        aria-label={title || (frames && frames[0]?.title) || alt}
      >
        {/* Le cercle */}
        <div
          className={cn(
            diameter,
            "relative overflow-hidden rounded-full bg-ghost",
            "transition-transform duration-500 ease-out-soft",
            "group-hover/portrait:scale-[1.02]",
          )}
        >
          {frames ? (
            frames.map((frame, idx) => (
              <div
                key={idx}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000",
                  currentIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                )}
              >
                {frame.images ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-white p-8 transition-transform duration-700 ease-out-soft group-hover/portrait:scale-105">
                    <div className="relative h-1/4 w-3/4">
                      <Image src={frame.images[0]} alt={alt} fill className="object-contain" />
                    </div>
                    <div className="relative h-1/4 w-3/4">
                      <Image src={frame.images[1]} alt={alt} fill className="object-contain" />
                    </div>
                  </div>
                ) : frame.image ? (
                  <div className={cn(
                    "absolute inset-0 transition-transform duration-700 ease-out-soft group-hover/portrait:scale-105",
                    frame.objectFit === "contain" && "bg-white p-6"
                  )}>
                    <Image
                      src={frame.image}
                      alt={alt}
                      fill
                      sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
                      priority={priority && idx === 0}
                      className={cn(
                        frame.objectFit === "contain" ? "object-contain" : "object-cover"
                      )}
                    />
                  </div>
                ) : null}
              </div>
            ))
          ) : images ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-white p-8 transition-transform duration-700 ease-out-soft group-hover/portrait:scale-105">
              <div className="relative h-1/4 w-3/4">
                <Image src={images[0]} alt={alt} fill className="object-contain" />
              </div>
              <div className="relative h-1/4 w-3/4">
                <Image src={images[1]} alt={alt} fill className="object-contain" />
              </div>
            </div>
          ) : image ? (
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out-soft group-hover/portrait:scale-105"
            />
          ) : null}
        </div>

        {/* Satellite — amarré en bas à droite, débordant hors du cercle.
            C'est le point d'entrée : il porte l'action, pas le cercle. */}
        <span
          className={cn(
            "absolute right-0 bottom-2 grid size-14 translate-x-[38%] place-items-center",
            "rounded-full bg-white text-ink",
            "transition-[transform,background-color,color] duration-300 ease-out-soft",
            "group-hover/portrait:bg-ink group-hover/portrait:text-frost",
            "group-hover/portrait:translate-x-[38%] group-hover/portrait:-translate-y-1",
          )}
        >
          <ArrowUpRight size={20} strokeWidth={2} aria-hidden />
        </span>
      </Link>

      <div className="mt-8 flex flex-col">
        <div className="mb-3">
          <EyebrowLabel>{eyebrow}</EyebrowLabel>
        </div>
        
        {frames ? (
          <div className="relative min-h-[100px]">
            {frames.map((frame, idx) => (
              <div
                key={idx}
                className={cn(
                  "absolute inset-0 flex flex-col gap-3 transition-opacity duration-1000",
                  currentIndex === idx ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
              >
                <h3 className="text-title text-ink">{frame.title}</h3>
                {frame.description ? (
                  <p className="text-body text-graphite">{frame.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {title && <h3 className="text-title text-ink">{title}</h3>}
            {description && <p className="text-body text-graphite">{description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
