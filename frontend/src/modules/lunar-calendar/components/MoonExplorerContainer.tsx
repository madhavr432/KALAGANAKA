/**
 * components/MoonExplorerContainer.tsx
 * Section B: The centerpiece Interactive 3D Moon Explorer.
 * Integrates 3D R3F Moon scene, synodic month scrubber, date/time/preset controls,
 * playback simulation, and live astronomical telemetry metrics.
 */

import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Compass,
  MapPin,
  Sparkles,
  Sun,
  Eye,
  Info,
} from "lucide-react";
import { Moon3DScene } from "../scenes/Moon3DScene";
import type {
  MoonPhysicalState,
  PanchangLimbsState,
  LunarObservationPreset,
} from "../types/lunarCalendar";
import { LUNAR_SYNODIC_MONTH_DAYS } from "../constants/lunarConstants";

interface MoonExplorerContainerProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedPresetId: string;
  applyPreset: (presetId: string) => void;
  presets: LunarObservationPreset[];
  isPlaying: boolean;
  togglePlayback: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  cameraResetTrigger: number;
  resetCamera: () => void;
  stepDay: (delta: number) => void;
  resetToToday: () => void;
  moonState: MoonPhysicalState;
  panchangLimbs: PanchangLimbsState;
  onOpenInfo: (key: string) => void;
}

export function MoonExplorerContainer({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedPresetId,
  applyPreset,
  presets,
  isPlaying,
  togglePlayback,
  playbackSpeed,
  setPlaybackSpeed,
  cameraResetTrigger,
  resetCamera,
  stepDay,
  resetToToday,
  moonState,
  panchangLimbs,
  onOpenInfo,
}: MoonExplorerContainerProps) {
  // Handle synodic month slider (0 to 29.53 days)
  const handleSynodicScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetSynodicDay = parseFloat(e.target.value);
    const currentSynodicDay = moonState.synodicDay;
    const diffDays = targetSynodicDay - currentSynodicDay;
    stepDay(diffDays);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-gold/25 bg-midnight-card/80 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header with Title and Presets */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
              3D Lunar Phase Explorer
            </h2>
            <button
              type="button"
              onClick={() => onOpenInfo("phase-illumination")}
              className="text-xs text-gold hover:underline"
              aria-label="Phase illumination physics explanation"
            >
              ⓘ
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            Observe true physical solar illumination and cratered topography across the 29.53-day
            synodic cycle.
          </p>
        </div>

        {/* Observatory Location Preset Selector */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gold-soft" />
          <label htmlFor="lunar-observatory-preset-select" className="sr-only">
            Select observatory location preset
          </label>
          <select
            id="lunar-observatory-preset-select"
            aria-label="Observatory location preset"
            value={selectedPresetId}
            onChange={(e) => applyPreset(e.target.value)}
            className="rounded-xl border border-white/15 bg-black/60 px-3 py-1.5 text-xs font-medium text-slate-200 outline-none focus:border-gold"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.locationName.split(",")[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: 3D Viewport + Telemetry Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: 3D Moon Canvas Container (8 cols on lg) */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-inner sm:aspect-[4/3] lg:col-span-8 lg:aspect-auto lg:h-[500px]">
          <Moon3DScene
            elongationDeg={moonState.elongationDeg}
            illuminatedFraction={moonState.illuminatedFraction}
            phaseName={moonState.phaseNameEnglish}
            isWaxing={moonState.isWaxing}
            cameraResetTrigger={cameraResetTrigger}
          />

          {/* Quick Floating Reset Camera Button */}
          <button
            type="button"
            onClick={resetCamera}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/70 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md transition-all hover:bg-black/90 hover:text-white"
            title="Reset 3D camera to default viewpoint"
          >
            <RotateCcw className="h-3.5 w-3.5 text-gold-soft" />
            <span>Reset View</span>
          </button>
        </div>

        {/* Right: Live Telemetry & Phase Parameters (4 cols on lg) */}
        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-white/10 bg-black/40 p-5 lg:col-span-4">
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Current Phase Identification
              </span>
              <h3 className="mt-0.5 font-serif text-xl font-bold text-white">
                {moonState.phaseNameEnglish}
              </h3>
              <p className="font-deva text-sm text-gold-soft">{moonState.phaseNameSanskrit}</p>
            </div>

            {/* Metrics List */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <span className="text-slate-400">Illuminated Fraction (k)</span>
                <span className="font-mono font-semibold text-white">
                  {moonState.illuminationPercent}% ({moonState.illuminatedFraction.toFixed(3)})
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <span className="text-slate-400">Elongation Angle (θ)</span>
                <span className="font-mono font-semibold text-gold-light">
                  {moonState.elongationDeg.toFixed(2)}°
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <span className="text-slate-400">Synodic Cycle Progress</span>
                <span className="font-mono font-semibold text-white">
                  Day {moonState.synodicDay.toFixed(1)} / 29.5
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <span className="text-slate-400">Active Tithi</span>
                <span className="font-medium text-white">
                  {panchangLimbs.tithi.name} ({panchangLimbs.tithi.paksha})
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <span className="text-slate-400">Lunar Mansion (Nakshatra)</span>
                <span className="font-medium text-white">
                  {panchangLimbs.nakshatra.name} (Pada {panchangLimbs.nakshatra.pada})
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <span className="text-slate-400">Ayanamsha (Lahiri)</span>
                <span className="font-mono text-slate-300">
                  {moonState.ayanamshaDeg.toFixed(2)}°
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <span className="text-slate-400">Moon Distance (km)</span>
                <span className="font-mono text-slate-300">
                  {Math.round(moonState.distanceKm).toLocaleString()} km
                </span>
              </div>
            </div>
          </div>

          {/* Educational Callout */}
          <div className="rounded-xl border border-violet-500/20 bg-violet-950/20 p-3 text-[11px] text-violet-200">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
              <span>
                <strong>Did you know?</strong> Lunar phases are caused solely by the angle between
                the Sun, Earth, and Moon. They are NOT caused by Earth’s shadow!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Synodic Month Timeline Scrubber */}
      <div className="space-y-3 rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Synodic Month Scrubber (0.0 to 29.53 Days)
            </span>
          </div>
          <span className="font-mono text-xs text-gold-soft">
            Current: Day {moonState.synodicDay.toFixed(2)} • Elongation{" "}
            {moonState.elongationDeg.toFixed(1)}°
          </span>
        </div>

        {/* Range Slider */}
        <div className="relative py-1">
          <input
            type="range"
            min="0"
            max={LUNAR_SYNODIC_MONTH_DAYS}
            step="0.1"
            value={moonState.synodicDay}
            onChange={handleSynodicScrub}
            aria-label="Synodic Month Scrubber"
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-gold outline-none"
          />
        </div>

        {/* Milestone Labels */}
        <div className="grid grid-cols-5 text-center text-[10px] text-muted-foreground">
          <div>
            <span className="block font-semibold text-slate-300">Amavasya (0°)</span>
            <span>Day 0.0</span>
          </div>
          <div>
            <span className="block font-semibold text-slate-300">Shukla Ashtami (90°)</span>
            <span>Day 7.4</span>
          </div>
          <div>
            <span className="block font-semibold text-gold">Purnima (180°)</span>
            <span className="text-gold-soft">Day 14.8</span>
          </div>
          <div>
            <span className="block font-semibold text-slate-300">Krishna Ashtami (270°)</span>
            <span>Day 22.1</span>
          </div>
          <div>
            <span className="block font-semibold text-slate-300">Amavasya (360°)</span>
            <span>Day 29.5</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar: Date, Time, Step Buttons, Play/Pause Simulation */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/60 p-4">
        {/* Date and Time Inputs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-900/80 px-3 py-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5 text-gold-soft" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Select date"
              className="bg-transparent text-slate-200 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-900/80 px-3 py-1.5 text-xs">
            <Clock className="h-3.5 w-3.5 text-gold-soft" />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              aria-label="Select time"
              className="bg-transparent text-slate-200 outline-none"
            />
          </div>

          {/* Day Stepper Buttons */}
          <div className="flex items-center rounded-xl border border-white/15 bg-slate-900/80 p-0.5">
            <button
              type="button"
              onClick={() => stepDay(-1)}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              title="Previous Day (-1d)"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={resetToToday}
              className="px-2 py-1 text-xs font-medium text-slate-300 hover:text-white"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => stepDay(1)}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              title="Next Day (+1d)"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Simulation Playback & Speed Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlayback}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              isPlaying
                ? "border border-amber-500/40 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                : "border border-gold/40 bg-gold/20 text-gold-light hover:bg-gold/30"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Play Orbit</span>
              </>
            )}
          </button>

          {/* Speed Buttons */}
          <div className="flex items-center rounded-xl border border-white/15 bg-slate-900/80 p-0.5 text-[11px]">
            {[0.5, 1, 2, 5].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                className={`rounded-lg px-2 py-1 transition-all ${
                  playbackSpeed === spd
                    ? "bg-gold/30 font-semibold text-gold-light"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
