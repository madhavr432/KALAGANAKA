/**
 * SolarDateControls.tsx
 * Comprehensive temporal and geographic controls for Module 2.
 * Includes Gregorian date picker, day/month steppers, time input, reset to today,
 * and observatory location selector.
 */

import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sun,
  ShieldCheck,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { ObservatoryPreset, SolarCalendarApiState } from "../types/solarCalendar";

interface SolarDateControlsProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  selectedPresetId: string;
  onPresetChange: (presetId: string) => void;
  presets: ObservatoryPreset[];
  onStepDay: (delta: number) => void;
  onStepMonth: (delta: number) => void;
  onResetToday: () => void;
  apiState: SolarCalendarApiState;
}

export function SolarDateControls({
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  selectedPresetId,
  onPresetChange,
  presets,
  onStepDay,
  onStepMonth,
  onResetToday,
  apiState,
}: SolarDateControlsProps) {
  const activePreset = presets.find((p) => p.id === selectedPresetId) || presets[0];

  return (
    <section className="w-full rounded-2xl border border-gold/25 bg-background/85 p-5 shadow-2xl backdrop-blur-md">
      {/* Top Header with Ephemeris Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gold" />
          <h3 className="font-deva text-lg font-semibold text-gold">
            काल एवं स्थान मापदण्ड (Date, Time & Location Parameters)
          </h3>
        </div>

        {/* Backend Ephemeris Connection Badge */}
        <div className="flex items-center gap-2">
          {apiState.isBackendConnected ? (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>JPL DE421 Live Ephemeris Online</span>
            </span>
          ) : apiState.isLoading ? (
            <span className="flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-[11px] font-medium text-sky-400">
              <Activity className="h-3.5 w-3.5 animate-spin" />
              <span>Calculating Coordinates...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[11px] font-medium text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Offline Astronomical Engine (Keplerian Fallback)</span>
            </span>
          )}

          {/* Quick Today Button */}
          <button
            type="button"
            onClick={onResetToday}
            className="flex items-center gap-1 rounded-lg border border-gold/25 bg-gold/5 px-2.5 py-1 text-xs text-gold-soft hover:bg-gold/15 hover:text-gold transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Primary Grid Controls */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Date Picker with Day Steppers */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="solar-date-picker"
            className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
          >
            <Calendar className="h-3.5 w-3.5 text-gold" />
            <span>Gregorian Date (दिनाङ्क):</span>
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onStepDay(-1)}
              className="rounded-lg border border-gold/25 bg-[#0c1322] p-2 text-slate-200 hover:text-amber-200 hover:border-gold transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <input
              id="solar-date-picker"
              type="date"
              value={selectedDate}
              min="1900-01-01"
              max="2050-12-31"
              onChange={(e) => onDateChange(e.target.value)}
              className="flex-1 rounded-lg border border-gold/25 bg-[#0c1322] px-3 py-2 font-mono text-xs text-amber-100 [color-scheme:dark] focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onStepDay(1)}
              className="rounded-lg border border-gold/25 bg-[#0c1322] p-2 text-slate-200 hover:text-amber-200 hover:border-gold transition-colors"
              title="Next Day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 2. Month Stepper Shortcuts */}
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-gold-soft">
            <Calendar className="h-3.5 w-3.5 text-gold" />
            <span>Month Navigation (मास परिवर्तन):</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStepMonth(-1)}
              className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-gold/25 bg-[#0c1322] py-2 text-xs text-slate-200 hover:text-amber-200 hover:border-gold transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>−1 Month</span>
            </button>
            <button
              type="button"
              onClick={() => onStepMonth(1)}
              className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-gold/25 bg-[#0c1322] py-2 text-xs text-slate-200 hover:text-amber-200 hover:border-gold transition-colors"
            >
              <span>+1 Month</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Event Time Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="solar-time-picker"
            className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
          >
            <Clock className="h-3.5 w-3.5 text-gold" />
            <span>Time of Day (समय, 24-hr):</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="solar-time-picker"
              type="time"
              value={selectedTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full rounded-lg border border-gold/25 bg-[#0c1322] px-3 py-2 font-mono text-xs text-amber-100 [color-scheme:dark] focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onTimeChange("12:00")}
              className="rounded-lg border border-gold/25 bg-[#0c1322] px-2.5 py-2 text-[11px] font-sans text-gold-soft hover:text-gold whitespace-nowrap"
              title="Set to solar noon (12:00)"
            >
              Noon
            </button>
          </div>
        </div>

        {/* 4. Observatory / Location Preset */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="solar-preset-select"
            className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
          >
            <MapPin className="h-3.5 w-3.5 text-gold" />
            <span>Observatory Location (वेधशाला स्थान):</span>
          </label>
          <select
            id="solar-preset-select"
            value={selectedPresetId}
            onChange={(e) => onPresetChange(e.target.value)}
            className="w-full rounded-lg border border-gold/25 bg-[#0c1322] px-3 py-2 text-xs text-amber-100 [color-scheme:dark] focus:border-gold focus:outline-none"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0c1322] text-amber-100">
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location Metadata Sub-bar (shows latitude, longitude, and live sunrise/sunset for location) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/15 bg-[#090e18]/60 px-4 py-2 text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-4">
          <span>
            Lat: <strong className="text-foreground">{activePreset.latitude.toFixed(4)}° N</strong>
          </span>
          <span>
            Lon: <strong className="text-foreground">{activePreset.longitude.toFixed(4)}° E</strong>
          </span>
          <span>
            TZ: <strong className="text-foreground">{activePreset.timezone}</strong>
          </span>
        </div>

        {apiState.solarEvents && (
          <div className="flex items-center gap-4 text-slate-300">
            <span>
              Sunrise:{" "}
              <strong className="text-amber-300">
                {apiState.solarEvents.sunrise.time_local?.match(/T(\d{2}:\d{2})/)?.[1] || "—"}
              </strong>
            </span>
            <span>
              Sunset:{" "}
              <strong className="text-amber-300">
                {apiState.solarEvents.sunset.time_local?.match(/T(\d{2}:\d{2})/)?.[1] || "—"}
              </strong>
            </span>
            <span>
              Day Length:{" "}
              <strong className="text-foreground">
                {apiState.solarEvents.day_length_hours?.toFixed(2)} hrs
              </strong>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
