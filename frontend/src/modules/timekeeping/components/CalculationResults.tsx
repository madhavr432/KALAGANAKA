/**
 * Calculation Results Panel.
 * Displays authoritative modern solar calculations, ephemeris status,
 * time comparisons (Civil vs LMST vs LAST), and explicit metadata.
 */

import React from "react";
import { SolarCalculatedData, CalculationStatus } from "../types/timekeeping";
import { InfoButton } from "./CalculationInfo";
import {
  formatDegrees,
  getAzimuthDirection,
  formatLatitude,
  formatLongitude,
} from "../utils/angleFormatting";
import { minutesToTimeStr } from "../utils/timeFormatting";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Sun,
  Compass,
  ShieldCheck,
  Activity,
} from "lucide-react";

interface CalculationResultsProps {
  solarData: SolarCalculatedData;
  calculationStatus: CalculationStatus;
  isBackendConnected: boolean;
  selectedDate: string;
  minutesSinceMidnight: number;
  latitude: number;
  longitude: number;
  timezone: string;
  onOpenInfo: (metricKey: string) => void;
}

export function CalculationResults({
  solarData,
  calculationStatus,
  isBackendConnected,
  selectedDate,
  minutesSinceMidnight,
  latitude,
  longitude,
  timezone,
  onOpenInfo,
}: CalculationResultsProps) {
  const civilTimeStr = minutesToTimeStr(minutesSinceMidnight, true);

  // Calculate longitude offset in minutes from UTC standard meridian:
  // For Asia/Kolkata (IST), standard meridian is 82.5° E (+330 min)
  const isIST = timezone === "Asia/Kolkata";
  const standardMeridianDeg = isIST ? 82.5 : 0;
  const lonOffsetMinutes = (longitude - standardMeridianDeg) * 4;

  return (
    <div className="w-full rounded-2xl border border-gold/25 bg-background/85 p-5 shadow-2xl backdrop-blur-md">
      {/* Header with Calculation Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-4">
        <div>
          <h3 className="font-deva text-xl text-gold-gradient">खगोलीय गणना एवं समय तुलना</h3>
          <p className="font-sans text-xs text-muted-foreground">
            Authoritative Modern Calculations & Timekeeping Analysis
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isBackendConnected && calculationStatus === "calculated" ? (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Calculated (JPL DE421 Live)</span>
            </span>
          ) : calculationStatus === "loading" ? (
            <span className="flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-[11px] font-medium text-sky-400">
              <Activity className="h-3.5 w-3.5 animate-spin" />
              <span>Querying Ephemeris...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-medium text-amber-300">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Illustrative Solar Model (Offline)</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid: 4 Structured Sections */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Section 1: Selected Inputs */}
        <div className="rounded-xl border border-gold/15 bg-background/50 p-4">
          <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-gold-soft mb-3">
            <Clock className="h-3.5 w-3.5 text-gold" />
            <span>Selected Inputs</span>
          </span>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between border-b border-gold/10 pb-1.5">
              <span className="text-muted-foreground">Civil Date:</span>
              <span className="text-foreground font-medium">{selectedDate}</span>
            </div>
            <div className="flex justify-between border-b border-gold/10 pb-1.5">
              <span className="text-muted-foreground">Civil Time:</span>
              <span className="text-amber-300 font-bold">{civilTimeStr}</span>
            </div>
            <div className="flex justify-between border-b border-gold/10 pb-1.5">
              <span className="text-muted-foreground">Timezone:</span>
              <span className="text-foreground">{timezone}</span>
            </div>
            <div className="flex justify-between border-b border-gold/10 pb-1.5">
              <span className="text-muted-foreground">Latitude:</span>
              <span className="text-foreground">{formatLatitude(latitude)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Longitude:</span>
              <span className="text-foreground">{formatLongitude(longitude)}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Modern Solar Coordinates */}
        <div className="rounded-xl border border-gold/15 bg-background/50 p-4">
          <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-gold-soft mb-3">
            <Sun className="h-3.5 w-3.5 text-gold" />
            <span>Solar Coordinates</span>
          </span>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-gold/10 pb-1.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>Solar Altitude:</span>
                <InfoButton metricKey="altitude" onOpenInfo={onOpenInfo} />
              </div>
              <span className="text-amber-300 font-bold">
                {formatDegrees(solarData.altitude_refracted_deg, 2)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gold/10 pb-1.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>Solar Azimuth:</span>
                <InfoButton metricKey="azimuth" onOpenInfo={onOpenInfo} />
              </div>
              <span className="text-foreground font-medium">
                {formatDegrees(solarData.azimuth_deg, 2)} (
                {getAzimuthDirection(solarData.azimuth_deg)})
              </span>
            </div>
            <div className="flex justify-between border-b border-gold/10 pb-1.5">
              <span className="text-muted-foreground">Solar Declination:</span>
              <span className="text-foreground">
                {formatDegrees(solarData.solar_declination_deg, 2)}
              </span>
            </div>
            <div className="flex justify-between border-b border-gold/10 pb-1.5">
              <span className="text-muted-foreground">Distance:</span>
              <span className="text-foreground">{solarData.distance_au.toFixed(4)} AU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sun Elevation:</span>
              <span
                className={
                  solarData.is_sun_up ? "text-emerald-400 font-semibold" : "text-slate-400"
                }
              >
                {solarData.is_sun_up ? "Above Horizon (Day)" : "Below Horizon (Night)"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Solar & Traditional Time */}
        <div className="rounded-xl border border-gold/15 bg-background/50 p-4">
          <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-gold-soft mb-3">
            <Compass className="h-3.5 w-3.5 text-gold" />
            <span>Solar & Traditional Time</span>
          </span>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-gold/10 pb-1.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>LMST (Mean Sun):</span>
                <InfoButton metricKey="lmst" onOpenInfo={onOpenInfo} />
              </div>
              <span className="text-foreground font-semibold">
                {solarData.local_mean_solar_time}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gold/10 pb-1.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>LAST (Apparent):</span>
                <InfoButton metricKey="last" onOpenInfo={onOpenInfo} />
              </div>
              <span className="text-amber-300 font-bold">
                {solarData.local_apparent_solar_time}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gold/10 pb-1.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>Eq. of Time (EoT):</span>
                <InfoButton metricKey="eot" onOpenInfo={onOpenInfo} />
              </div>
              <span className="text-foreground">
                {solarData.equation_of_time_min >= 0 ? "+" : ""}
                {solarData.equation_of_time_min.toFixed(2)} min
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gold/10 pb-1.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>Prahara (प्रहर):</span>
                <InfoButton metricKey="prahar" onOpenInfo={onOpenInfo} />
              </div>
              <span className="text-gold font-semibold">{solarData.prahar_name.split(" ")[0]}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gold/10 pb-1.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>Konark Beads (3m/ea):</span>
                <InfoButton metricKey="konarkWheel" onOpenInfo={onOpenInfo} />
              </div>
              <span className="text-amber-300 font-medium">30 Beads / Sector</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ghati & Pala:</span>
              <span className="text-gold-soft">
                {solarData.ghati_elapsed} Gh {solarData.pala_elapsed} Pa
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Solar Events & Disclaimers */}
        <div className="rounded-xl border border-gold/15 bg-background/50 p-4">
          <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-gold-soft mb-3">
            <Activity className="h-3.5 w-3.5 text-gold" />
            <span>Solar Events & Metadata</span>
          </span>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between border-b border-gold/10 pb-1.5">
              <span className="text-muted-foreground">Sunrise (Local):</span>
              <span className="text-amber-300 font-medium">{solarData.sunrise_local || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b border-gold/10 pb-1.5">
              <span className="text-muted-foreground">Solar Noon (Transit):</span>
              <span className="text-amber-300 font-bold">
                {solarData.solar_noon_local || "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gold/10 pb-1.5">
              <span className="text-muted-foreground">Sunset (Local):</span>
              <span className="text-amber-300 font-medium">{solarData.sunset_local || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b border-gold/10 pb-1.5">
              <span className="text-muted-foreground">Day Length:</span>
              <span className="text-foreground">
                {solarData.day_length_hours !== null
                  ? `${solarData.day_length_hours.toFixed(2)} hrs`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Engine:</span>
              <span
                className="text-[10px] text-muted-foreground/90 truncate max-w-[140px]"
                title={solarData.method_name}
              >
                {solarData.method_name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Callout: Explaining the Relationship */}
      <div className="mt-5 rounded-xl border border-gold/20 bg-gold/5 p-4 text-xs leading-relaxed">
        <h4 className="font-deva text-sm font-semibold text-gold mb-1">
          समय तुलना विश्लेषण (Comparative Analysis: Civil Time vs Apparent Solar Time)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-muted-foreground">
          <div className="rounded-lg border border-gold/10 bg-background/50 p-2.5">
            <span className="font-semibold text-gold-soft block mb-1">1. Longitude Offset:</span>
            <span>
              {longitude.toFixed(2)}° E is {Math.abs(lonOffsetMinutes).toFixed(1)} minutes{" "}
              {lonOffsetMinutes >= 0 ? "ahead of" : "behind"} standard {standardMeridianDeg}°
              meridian.
            </span>
          </div>

          <div className="rounded-lg border border-gold/10 bg-background/50 p-2.5">
            <span className="font-semibold text-gold-soft block mb-1">2. Equation of Time:</span>
            <span>
              Earth's axial tilt and elliptical orbit introduce a seasonal discrepancy of{" "}
              {solarData.equation_of_time_min.toFixed(1)} minutes today.
            </span>
          </div>

          <div className="rounded-lg border border-gold/10 bg-background/50 p-2.5">
            <span className="font-semibold text-gold-soft block mb-1">
              3. Konark Wheel Context:
            </span>
            <span>
              A physical sundial responds to Apparent Solar Time (LAST). Reading civil clock time
              requires both longitude offset and EoT correction.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
