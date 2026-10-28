import React from "react";
import { type PlanetVisualItem } from "./CelestialZodiacSkyMap";
import { type TraditionalSolarResponse, type ComparisonResponse } from "@/services/astronomy-api";
import { Globe, Compass, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

interface PlanetaryComparisonPanelProps {
  planet: PlanetVisualItem;
  traditionalSolar: TraditionalSolarResponse | null;
  comparisonResult: ComparisonResponse | null;
}

export function PlanetaryComparisonPanel({
  planet,
  traditionalSolar,
  comparisonResult,
}: PlanetaryComparisonPanelProps) {
  const isSun = planet.name.toLowerCase() === "sun";

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold/15 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-gold" />
          <h3 className="font-deva text-xl text-gold-gradient sm:text-2xl">
            {planet.sanskritName} • {planet.name}
          </h3>
        </div>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-xs text-gold">
          {planet.symbol}
        </span>
      </div>

      {/* Coordinate & Distance Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-mono">
        <div className="rounded-lg border border-gold/15 bg-gold/5 p-3">
          <span className="font-sans text-[11px] text-muted-foreground block">
            निरयण रेखांश (Sidereal):
          </span>
          <span className="font-bold text-gold-light text-base">
            {planet.siderealLongitudeDeg.toFixed(3)}°
          </span>
          <span className="font-sans text-[10px] text-gold-soft block mt-0.5">
            Lahiri Chitrapaksha
          </span>
        </div>

        <div className="rounded-lg border border-gold/15 bg-gold/5 p-3">
          <span className="font-sans text-[11px] text-muted-foreground block">
            सायण रेखांश (Tropical):
          </span>
          <span className="font-bold text-gold-light text-base">
            {planet.tropicalLongitudeDeg.toFixed(3)}°
          </span>
          <span className="font-sans text-[10px] text-muted-foreground block mt-0.5">
            J2000 Equator & Equinox
          </span>
        </div>

        <div className="rounded-lg border border-gold/15 bg-gold/5 p-3">
          <span className="font-sans text-[11px] text-muted-foreground block">
            क्रान्तिवृत्त अक्षांश (Latitude):
          </span>
          <span className="font-bold text-gold-light text-base">
            {planet.latitudeDeg.toFixed(4)}°
          </span>
          <span className="font-sans text-[10px] text-muted-foreground block mt-0.5">
            Ecliptic Latitude (β)
          </span>
        </div>

        <div className="rounded-lg border border-gold/15 bg-gold/5 p-3">
          <span className="font-sans text-[11px] text-muted-foreground block">
            भूकेन्द्रिय दूरी (Distance):
          </span>
          <span className="font-bold text-gold-light text-base">
            {planet.distanceAu.toFixed(4)} AU
          </span>
          <span className="font-sans text-[10px] text-gold-soft block mt-0.5">
            {Number(planet.distanceKm.toFixed(0)).toLocaleString()} km
          </span>
        </div>
      </div>

      {/* Traditional Indian Astronomy vs Modern Ephemeris Comparison */}
      <div className="rounded-lg border border-gold/20 bg-background/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-gold">
          <Sparkles className="h-4 w-4" />
          <h4 className="font-deva text-base font-semibold">
            पारम्परिक सूर्य-सिद्धान्त तुलना (Traditional Surya Siddhanta Comparison)
          </h4>
        </div>

        {isSun ? (
          <div className="space-y-3 text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Surya Siddhanta preliminary mean motion calculation active for the Sun.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="rounded border border-gold/15 bg-gold/5 p-2.5">
                <span className="font-sans text-[11px] text-muted-foreground block">
                  Surya Siddhanta (Mean):
                </span>
                <span className="font-bold text-gold-light">
                  {traditionalSolar?.longitude_deg.toFixed(3) ?? "—"}°
                </span>
              </div>
              <div className="rounded border border-gold/15 bg-gold/5 p-2.5">
                <span className="font-sans text-[11px] text-muted-foreground block">
                  JPL DE421 (Apparent):
                </span>
                <span className="font-bold text-gold-light">
                  {planet.tropicalLongitudeDeg.toFixed(3)}°
                </span>
              </div>
              <div className="rounded border border-gold/15 bg-gold/5 p-2.5">
                <span className="font-sans text-[11px] text-muted-foreground block">
                  Angular Difference:
                </span>
                <span className="font-bold text-amber-300">
                  {comparisonResult?.comparisons?.[0]
                    ? `${comparisonResult.comparisons[0].difference_deg.toFixed(3)}°`
                    : "—"}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground text-[11px]">
              <strong>Methodology & Assumptions:</strong> The traditional calculation calculates
              mean solar motion from the Burgess 1860 translation reference (1860-01-01 Ujjain). The
              true solar position requires applying the solar equation of the apsis (Manda-phala),
              which explains the expected mean-to-apparent difference.
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <div className="flex items-start gap-2 text-amber-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <strong className="text-amber-200">Scientific & Historical Disclosure:</strong> The
                backend Surya Siddhanta epicyclic corrections for <strong>{planet.name}</strong>{" "}
                (Manda-phala equation of center and Shighra-phala synodic anomaly) are currently
                documented in backend knowledge bases and pending independent validation.
              </div>
            </div>
            <p className="text-[11px]">
              In accordance with KalaGanaka&rsquo;s accuracy commitment, we do not fabricate
              approximate ancient numbers for planets where validated true-position algorithms have
              not yet been certified. The coordinates above reflect authoritative NASA/JPL DE421
              geocentric apparent ephemeris.
            </p>
          </div>
        )}
      </div>

      {/* Scale & Observational Disclosure */}
      <div className="rounded-lg border border-gold/15 bg-gold/5 p-3 text-[11px] text-muted-foreground leading-relaxed">
        <strong>Visual Scale Note:</strong> In the Celestial Zodiac sky map, the celestial bodies
        and their orbital distances are rendered at an illustrative, equidistant scale for clarity
        of observation. Real planetary distances range from 0.0026 AU (Moon) to 10+ AU (Saturn) and
        are precisely reported in the numerical data table.
      </div>
    </div>
  );
}
