/**
 * SolarOrbitContainer.tsx
 * Interactive wrapper around the 3D Solar Orbit Scene.
 * Houses animation controls (Play/Pause, speed multipliers), day-of-year scrubber,
 * cardinal seasonal station quick-jump pills, and camera reset.
 */

import React from "react";
import { SolarOrbitScene } from "../scenes/SolarOrbitScene";
import { AstronomicalStationEvent, SolarCalculatedValues } from "../types/solarCalendar";
import { ASTRONOMICAL_STATIONS } from "../constants/solarConstants";
import { Play, Pause, RotateCcw, Gauge, Sparkles, Info, Calendar, Compass } from "lucide-react";

interface SolarOrbitContainerProps {
  solarValues: SolarCalculatedValues;
  selectedDate: string;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  onDayOfYearChange: (dayOfYear: number) => void;
  onSelectStation: (station: AstronomicalStationEvent) => void;
  onResetCamera: () => void;
  onOpenInfo: (key: string) => void;
}

export function SolarOrbitContainer({
  solarValues,
  selectedDate,
  isPlaying,
  onTogglePlayback,
  playbackSpeed,
  onSpeedChange,
  onDayOfYearChange,
  onSelectStation,
  onResetCamera,
  onOpenInfo,
}: SolarOrbitContainerProps) {
  const cardinalStations = ASTRONOMICAL_STATIONS.filter(
    (s) => s.id.includes("equinox") || s.id.includes("solstice"),
  );

  return (
    <section className="w-full space-y-4 rounded-2xl border border-gold/25 bg-background/85 p-5 shadow-2xl backdrop-blur-md">
      {/* Header and Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="font-deva text-xl text-gold-gradient sm:text-2xl">
              सूर्य-परिक्रमण वेधशाला (Solar Orbit & Seasonal Explorer)
            </h3>
          </div>
          <p className="font-sans text-xs text-muted-foreground mt-0.5">
            Real-time 3D heliocentric Earth revolution, constant 23.44° axial tilt, and seasonal
            stations
          </p>
        </div>

        {/* Playback Controls & Camera Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={onTogglePlayback}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-sans text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? "bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-400/50"
                : "bg-gold-gradient text-slate-950 hover:opacity-95 shadow-gold/20"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                <span>Pause Orbit</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Animate Orbit</span>
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center rounded-xl border border-gold/25 bg-[#0b1220] p-0.5 text-xs">
            <span className="px-2 font-mono text-[10px] text-muted-foreground hidden sm:inline">
              Speed:
            </span>
            {[1, 5, 15, 30].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSpeedChange(s)}
                className={`rounded-lg px-2 py-1 font-mono text-[10px] transition-colors ${
                  playbackSpeed === s
                    ? "bg-gold/25 text-amber-200 font-bold border border-gold/40 shadow-sm"
                    : "text-slate-300 hover:text-amber-100"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Reset Camera Button */}
          <button
            type="button"
            onClick={onResetCamera}
            className="flex items-center gap-1 rounded-xl border border-gold/25 bg-[#0b1220] px-3 py-2 text-xs font-medium text-slate-200 hover:border-gold hover:text-amber-100 transition-colors"
            title="Reset 3D camera to default isometric viewpoint"
          >
            <RotateCcw className="h-3.5 w-3.5 text-gold" />
            <span className="hidden sm:inline">Reset View</span>
          </button>
        </div>
      </div>

      {/* Center 3D Viewport */}
      <SolarOrbitScene
        solarValues={solarValues}
        selectedDate={selectedDate}
        onSelectStation={onSelectStation}
        cameraResetTrigger={0}
      />

      {/* Annual Timeline Scrubber (Day of Year 1 to 365/366) */}
      <div className="rounded-xl border border-gold/20 bg-[#090e18]/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold" />
            <span className="font-deva font-semibold text-gold-light">
              वार्षिक समय-रेखा (Annual Progress Timeline):
            </span>
            <span className="font-mono text-amber-300 font-bold">
              Day {solarValues.dayOfYear} of {solarValues.totalDaysInYear} ({selectedDate})
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <span>
              Distance:{" "}
              <strong className="text-foreground">
                {solarValues.earthSunDistanceAU.toFixed(4)} AU
              </strong>{" "}
              ({(solarValues.earthSunDistanceKm / 1e6).toFixed(1)}M km)
            </span>
            <span>
              Declination:{" "}
              <strong className="text-amber-300">
                {solarValues.solarDeclinationDeg >= 0 ? "+" : ""}
                {solarValues.solarDeclinationDeg.toFixed(2)}°
              </strong>
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="relative pt-1">
          <input
            type="range"
            min={1}
            max={solarValues.totalDaysInYear}
            step={1}
            value={solarValues.dayOfYear}
            onChange={(e) => onDayOfYearChange(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-[#121c2e] rounded-lg appearance-none"
            aria-label="Annual orbit day-of-year scrubber"
          />

          {/* Month Marker Labels underneath slider */}
          <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-1.5 px-1 select-none">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>
      </div>

      {/* Quick Jump Stations Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold/15 bg-[#090e18]/50 p-3">
        <div className="flex items-center gap-1.5 text-xs text-gold-soft font-medium">
          <Compass className="h-4 w-4 text-gold" />
          <span>चार प्रधान ऋत्विक स्थल (Cardinal Seasonal Stations):</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {cardinalStations.map((st) => {
            const isCurrent = solarValues.activeStation?.id === st.id && solarValues.isNearStation;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStation(st)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all ${
                  isCurrent
                    ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-[#0c1322] text-slate-300 border border-gold/20 hover:border-gold hover:text-amber-100"
                }`}
              >
                <span>{st.sanskritName.split(" ")[0]}</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  ({st.approximateDate.replace("~", "")})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Educational Notice Alert: Axial Tilt vs Distance */}
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-3.5 text-xs leading-relaxed text-muted-foreground flex items-start gap-3">
        <Info className="h-4 w-4 text-gold shrink-0 mt-0.5" />
        <div>
          <strong className="text-gold-light">Scientific Clarification on Seasons:</strong> Earth's
          seasons are governed by its fixed{" "}
          <strong className="text-amber-200">23.44° axial tilt</strong>, which changes the angle of
          solar insolation and daylight duration as Earth orbits. Distance from the Sun plays
          virtually no role: Earth is actually <em>closest</em> to the Sun in early January (~147.1M
          km) during the Northern Hemisphere winter!
          <button
            onClick={() => onOpenInfo("seasonsAxialTilt")}
            className="ml-2 text-gold hover:underline font-medium inline-flex items-center gap-0.5"
          >
            <span>Read detailed derivation ⓘ</span>
          </button>
        </div>
      </div>
    </section>
  );
}
