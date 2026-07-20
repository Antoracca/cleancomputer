"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type VehicleData = {
  id: string;
  brand: string;
  type: "voiture" | "moto";
  models: string;
  description: string;
  priceFCFA: string;
  logoPath: string;
  imagePaths: string[];
};

function VehicleCard({ vehicle }: { vehicle: VehicleData }) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % vehicle.imagePaths.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + vehicle.imagePaths.length) % vehicle.imagePaths.length);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[32px] bg-white shadow-lg ring-1 ring-mist/50 transition-all duration-500 hover:shadow-2xl">
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ghost">
        {vehicle.imagePaths.map((path, idx) => (
          <Image
            key={idx}
            src={path}
            alt={`${vehicle.brand} ${vehicle.models}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "object-cover transition-all duration-700 ease-out-soft",
              idx === currentImage ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            )}
          />
        ))}

        {/* Carousel Controls */}
        {vehicle.imagePaths.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button 
              onClick={prevImage} 
              className="rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition hover:bg-black/40"
              aria-label="Image précédente"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button 
              onClick={nextImage} 
              className="rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition hover:bg-black/40"
              aria-label="Image suivante"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}

        {/* Logo Badge */}
        <div className="absolute top-4 left-4 flex size-14 items-center justify-center rounded-2xl bg-white/90 p-2 shadow-sm backdrop-blur-md">
          <Image 
            src={vehicle.logoPath} 
            alt={vehicle.brand} 
            width={40} 
            height={40} 
            className="object-contain" 
            onError={(e) => {
              // Fallback if logo fails to load (optional)
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <h3 className="text-[1.375rem] font-bold tracking-tight text-ink">{vehicle.brand}</h3>
          <p className="mt-1 text-sm font-semibold tracking-wide text-brand">{vehicle.models}</p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-graphite line-clamp-3">
            {vehicle.description}
          </p>
        </div>

        <div className="mt-8">
          <div className="mb-5 rounded-2xl bg-ghost/50 p-4 border border-mist/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-graphite/80">À partir de</p>
            <p className="mt-1 flex items-baseline gap-1 text-[1.625rem] font-bold tracking-tight text-ink">
              {vehicle.priceFCFA} <span className="text-sm font-medium text-graphite">FCFA</span>
            </p>
            <p className="mt-1 text-xs text-graphite/60">*hors frais d'import et douane</p>
          </div>
          <Button asChild className="w-full text-[0.9375rem] font-semibold">
            <Link href="/devis-import">Commander ce modèle</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function VehicleShowcase({ vehicles }: { vehicles: VehicleData[] }) {
  const [activeTab, setActiveTab] = useState<"voiture" | "moto">("voiture");

  // Fallback if vehicles is empty (e.g. data fetching issue)
  if (!vehicles || vehicles.length === 0) {
    return <div className="text-center p-8 text-graphite">Chargement des modèles...</div>;
  }

  const filteredVehicles = vehicles.filter((v) => v.type === activeTab);

  return (
    <div className="flex flex-col gap-12 lg:gap-16">
      {/* Tabs */}
      <div className="flex items-center justify-center">
        <div className="flex rounded-[2rem] bg-ghost p-1.5 shadow-sm ring-1 ring-mist/50">
          <button
            onClick={() => setActiveTab("voiture")}
            className={cn(
              "rounded-full px-8 py-3 text-[0.9375rem] font-semibold transition-all duration-300",
              activeTab === "voiture" ? "bg-white text-ink shadow-sm" : "text-graphite hover:text-ink"
            )}
          >
            Voitures & SUV
          </button>
          <button
            onClick={() => setActiveTab("moto")}
            className={cn(
              "rounded-full px-8 py-3 text-[0.9375rem] font-semibold transition-all duration-300",
              activeTab === "moto" ? "bg-white text-ink shadow-sm" : "text-graphite hover:text-ink"
            )}
          >
            Motos & Quads
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}
