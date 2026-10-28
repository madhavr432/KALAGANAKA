import React from "react";
import { type SolarPositionResponse, type SolarEventsResponse } from "@/services/astronomy-api";
import { type ShadowGeometry } from "@/services/samrat-yantra-math";
import { Sunrise, Sunset, Clock, Compass, Sun, MapPin, Sparkles } from "lucide-react";

interface AstronomyInfoPanelProps {
  solarPosition: SolarPositionResponse | null;
  solarEvents: SolarEventsResponse | null;
  shadowGeometry: ShadowGeometry;
  localTimeDisplay: string;
}

export function AstronomyInfoPanel({
  solarPosition,
  solarEvents,
  shadowGeometry,
  localTimeDisplay,
}: AstronomyInfoPanelProps) {
  // Helper to format cardinal direction from azimuth
  const getCardinalDirection = (azimuth: number): string => {
    const directions = [
      "North (उत्तर)",
      "North-Northeast",
      "Northeast (ईशान)",
      "East-Northeast",
      "East (पूर्व)",
      "East-Southeast",
      "Southeast (आग्नेय)",
      "South-Southeast",
      "South (दक्षिण)",
      "South-Southwest",
      "Southwest (नैऋत्य)",
      "West-Southwest",
      "West (पश्चिम)",
      "West-Northwest",
      "Northwest (वायव्य)",
      "North-Northwest",
    ];
    const index = Math.round((azimuth % 360) / 22.5) % 16;
    return directions[index];
  };

  const formatEventTime = (isoString: string | null | undefined): string => {
    if (!isoString) return "Unavailable";
    try {
      const match = isoString.match(/T(\d{2}:\d{2}:\d{2})/);
      return match ? match[1] : isoString;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold/15 pb-3">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-gold" />
          <h3 className="font-deva text-xl text-gold-gradient sm:text-2xl">
            खगोलीय एवं यन्त्र परिमाप (Astronomical & Instrument Readings)
          </h3>
        </div>
        <span className="font-sans text-xs text-muted-foreground">
          Observed Instant: <span className="text-gold-soft font-mono">{localTimeDisplay}</span>
        </span>
      </div>

      {/* Grid of Key Astronomical Parameters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Solar Elevation / Altitude */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-3.5 transition-all hover:border-gold/40">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-deva text-gold">
              नतांश / उन्नतांश (Altitude)
            </span>
            <Compass className="h-3.5 w-3.5 text-gold-soft" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-gold-light">
              {solarPosition ? `${solarPosition.altitude_deg.toFixed(2)}°` : "—"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Refracted: {solarPosition ? `${solarPosition.altitude_refracted_deg.toFixed(2)}°` : "—"}{" "}
            (Horizon elevation)
          </p>
        </div>

        {/* 2. Solar Azimuth & Cardinal Bearing */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-3.5 transition-all hover:border-gold/40">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-deva text-gold">दिगंश (Azimuth)</span>
            <Compass className="h-3.5 w-3.5 text-gold-soft" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-gold-light">
              {solarPosition ? `${solarPosition.azimuth_deg.toFixed(2)}°` : "—"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-gold-soft">
            {solarPosition
              ? getCardinalDirection(solarPosition.azimuth_deg)
              : "Clockwise from True North"}
          </p>
        </div>

        {/* 3. Local Apparent Solar Time (LAT) */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-3.5 transition-all hover:border-gold/40">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-deva text-gold">
              प्रत्यक्ष सौर समय (LAT)
            </span>
            <Clock className="h-3.5 w-3.5 text-gold-soft" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-gold-light">
              {shadowGeometry.isSunUp
                ? `${String(shadowGeometry.readingHours).padStart(2, "0")}:${String(
                    shadowGeometry.readingMinutes,
                  ).padStart(2, "0")}:${String(shadowGeometry.readingSeconds).padStart(2, "0")}`
                : "रात्रि (Night)"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Sundial shadow reading on equinoctial scale
          </p>
        </div>

        {/* 4. Traditional Timekeeping (Ghati / Pala) */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-3.5 transition-all hover:border-gold/40">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-deva text-gold">
              इष्टकाल / घटी-पल (Traditional)
            </span>
            <Sparkles className="h-3.5 w-3.5 text-gold-soft" />
          </div>
          <div className="mt-2">
            <span className="font-deva text-lg font-bold text-gold-light">
              {shadowGeometry.isSunUp
                ? `${shadowGeometry.traditionalReading.ghati} घटी ${shadowGeometry.traditionalReading.pala} पल ${shadowGeometry.traditionalReading.vipala} विपल`
                : "सूर्योदय पूर्व"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-gold-soft">
            {shadowGeometry.isSunUp
              ? `${shadowGeometry.traditionalReading.totalGhatiDecimal.toFixed(2)} Ghatis (${shadowGeometry.traditionalReading.ghati} Gh ${shadowGeometry.traditionalReading.pala} Pal ${shadowGeometry.traditionalReading.vipala} Vip)`
              : "60 Ghatis per solar day"}
          </p>
        </div>
      </div>

      {/* Solar Events (Sunrise, Noon, Sunset, Day Length) */}
      <div className="rounded-lg border border-gold/15 bg-background/50 p-4">
        <h4 className="mb-3 font-deva text-sm font-semibold text-gold">
          दिनमान एवं दैनिक सौर घटनाएँ (Solar Day & Horizon Events)
        </h4>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-2 text-amber-400">
              <Sunrise className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">सूर्योदय (Sunrise)</p>
              <p className="font-mono text-sm font-semibold text-gold-light">
                {solarEvents?.sunrise.available
                  ? formatEventTime(solarEvents.sunrise.time_local)
                  : "Unavailable"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="rounded-md border border-gold/30 bg-gold/10 p-2 text-gold">
              <Sun className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">मध्याह्न (Solar Noon)</p>
              <p className="font-mono text-sm font-semibold text-gold-light">
                {solarEvents?.solar_noon.available
                  ? formatEventTime(solarEvents.solar_noon.time_local)
                  : "Unavailable"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="rounded-md border border-orange-500/30 bg-orange-500/10 p-2 text-orange-400">
              <Sunset className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">सूर्यास्त (Sunset)</p>
              <p className="font-mono text-sm font-semibold text-gold-light">
                {solarEvents?.sunset.available
                  ? formatEventTime(solarEvents.sunset.time_local)
                  : "Unavailable"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="rounded-md border border-blue-500/30 bg-blue-500/10 p-2 text-blue-300">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">दिनमान (Day Length)</p>
              <p className="font-mono text-sm font-semibold text-gold-light">
                {solarEvents?.day_length_hours
                  ? `${solarEvents.day_length_hours.toFixed(2)} hrs (${(solarEvents.day_length_hours * 2.5).toFixed(1)} घटी)`
                  : "Unavailable"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shadow Geometry and Instrument State Description */}
      <div className="rounded-lg border border-gold/15 bg-gold/5 p-4 text-xs text-gold-soft leading-relaxed">
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <div>
            <span className="font-semibold text-gold">
              यन्त्र स्थिति विश्लेषण (Instrument State Analysis):{" "}
            </span>
            <span>{shadowGeometry.description}</span>
          </div>
        </div>

        {solarPosition && (
          <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-muted-foreground border-t border-gold/10 pt-2">
            <span>
              Distance to Sun:{" "}
              <strong className="text-gold-light">{solarPosition.distance_au.toFixed(6)} AU</strong>{" "}
              ({solarPosition.distance_km.toLocaleString()} km)
            </span>
            <span>
              Atmospheric Refraction Correction:{" "}
              <strong className="text-gold-light">
                +{(solarPosition.altitude_refracted_deg - solarPosition.altitude_deg).toFixed(4)}°
              </strong>
            </span>
            <span>
              Ephemeris Engine:{" "}
              <strong className="text-gold-light">JPL DE421 via Python Skyfield</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
