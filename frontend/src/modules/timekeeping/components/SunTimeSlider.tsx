/**
 * Prominent Time-of-Day Sun Slider with Playback Controls and Dynamic Shortcuts.
 */

import React, { useCallback } from "react";
import { Play, Pause, RotateCcw, Clock, Sun, Moon, Sunrise, Sunset } from "lucide-react";
import { minutesToTimeStr, timeStrToMinutes } from "../utils/timeFormatting";
import { SolarCalculatedData } from "../types/timekeeping";

interface SunTimeSliderProps {
  minutesSinceMidnight: number;
  onTimeChange: (mins: number) => void;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  solarData: SolarCalculatedData;
  timezone: string;
}

export function SunTimeSlider({
  minutesSinceMidnight,
  onTimeChange,
  isPlaying,
  onTogglePlayback,
  playbackSpeed,
  onSpeedChange,
  solarData,
  timezone,
}: SunTimeSliderProps) {
  const currentFormattedTime = minutesToTimeStr(minutesSinceMidnight, true);

  // Keyboard navigation on slider input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onTimeChange(e.shiftKey ? minutesSinceMidnight - 15 : minutesSinceMidnight - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onTimeChange(e.shiftKey ? minutesSinceMidnight + 15 : minutesSinceMidnight + 1);
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        onTogglePlayback();
      }
    },
    [minutesSinceMidnight, onTimeChange, onTogglePlayback],
  );

  return (
    <div className="w-full rounded-2xl border border-gold/30 bg-background/90 p-4 shadow-xl backdrop-blur-md sm:p-5">
      {/* Top Row: Digital Readout & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/15 pb-4">
        {/* Left: Digital Clock & Active Prahara/Ghati badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-3.5 py-1.5 shadow-inner">
            <Clock className="h-4 w-4 text-gold animate-spin-slow" />
            <span className="font-mono text-2xl font-bold tracking-wider text-gold-light sm:text-3xl">
              {currentFormattedTime}
            </span>
            <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[10px] font-semibold text-gold-soft uppercase">
              {timezone.replace("Asia/", "").replace("_", " ")}
            </span>
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="font-deva text-xs font-semibold text-gold">
              {solarData.prahar_hindi}
            </span>
            <span className="font-sans text-[11px] text-muted-foreground">
              {solarData.ghati_elapsed} घटी {solarData.pala_elapsed} पल (Traditional)
            </span>
          </div>
        </div>

        {/* Right: Playback Buttons and Speed Switcher */}
        <div className="flex items-center gap-2">
          {/* Play / Pause Button */}
          <button
            onClick={onTogglePlayback}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-sans text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? "bg-amber-400 text-slate-950 hover:bg-amber-300"
                : "bg-gold-gradient text-slate-950 hover:opacity-95 shadow-gold/20"
            }`}
            title={isPlaying ? "Pause Sun simulation (Space)" : "Play Sun motion (Space)"}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-slate-950" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current text-slate-950" />
                <span>Play Simulation</span>
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="flex rounded-lg border border-gold/25 bg-background/70 p-0.5 text-[11px]">
            {[1, 5, 15, 60].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`rounded px-2 py-1 font-mono transition-colors ${
                  playbackSpeed === s
                    ? "bg-gold/30 font-bold text-amber-200"
                    : "text-slate-300 hover:text-amber-100"
                }`}
                title={`Playback speed ${s} minutes per second`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Reset to Solar Noon */}
          <button
            onClick={() => {
              if (solarData.solar_noon_local) {
                onTimeChange(timeStrToMinutes(solarData.solar_noon_local));
              } else {
                onTimeChange(720);
              }
            }}
            className="rounded-lg border border-gold/20 p-2 text-gold-soft hover:bg-gold/10 hover:text-gold transition-colors"
            title="Reset to local Solar Noon"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Middle Row: Prominent Sun Slider */}
      <div className="mt-4">
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={1439}
            step={1}
            value={Math.round(minutesSinceMidnight)}
            onChange={(e) => onTimeChange(parseFloat(e.target.value))}
            onKeyDown={handleKeyDown}
            className="w-full h-3 bg-gradient-to-r from-indigo-950 via-amber-700/80 via-yellow-500/90 via-amber-700/80 to-indigo-950 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none focus:ring-2 focus:ring-gold/50 shadow-inner"
            aria-label="Time of day slider for simulated Sun position"
          />
        </div>

        {/* Hour Ticks & Key Solar Markers */}
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-slate-300 font-medium select-none">
          <span>00:00</span>
          <span>03:00</span>
          <span>06:00</span>
          <span>09:00</span>
          <span className="text-amber-300 font-bold">12:00</span>
          <span>15:00</span>
          <span>18:00</span>
          <span>21:00</span>
          <span>23:59</span>
        </div>
      </div>

      {/* Bottom Row: Quick-Select Event Shortcuts */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="font-sans text-[11px] font-medium text-gold/80 mr-1">Quick Jump:</span>

        {/* Midnight */}
        <button
          onClick={() => onTimeChange(0)}
          className="flex items-center gap-1 rounded-md border border-gold/15 bg-background/50 px-2.5 py-1 font-sans text-xs text-gold-soft hover:bg-gold/15 hover:text-gold transition-colors"
        >
          <Moon className="h-3 w-3 text-slate-400" />
          <span>Midnight (00:00)</span>
        </button>

        {/* Dynamic Sunrise */}
        {solarData.sunrise_local && (
          <button
            onClick={() => onTimeChange(timeStrToMinutes(solarData.sunrise_local!))}
            className="flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-sans text-xs text-amber-300 hover:bg-amber-500/20 transition-colors"
            title={`Local sunrise calculated for ${solarData.sunrise_local}`}
          >
            <Sunrise className="h-3 w-3 text-amber-400" />
            <span>Sunrise ({solarData.sunrise_local})</span>
          </button>
        )}

        {/* Morning */}
        <button
          onClick={() => onTimeChange(540)}
          className="flex items-center gap-1 rounded-md border border-gold/15 bg-background/50 px-2.5 py-1 font-sans text-xs text-gold-soft hover:bg-gold/15 hover:text-gold transition-colors"
        >
          <Sun className="h-3 w-3 text-amber-300" />
          <span>Morning (09:00)</span>
        </button>

        {/* Dynamic Solar Noon */}
        {solarData.solar_noon_local && (
          <button
            onClick={() => onTimeChange(timeStrToMinutes(solarData.solar_noon_local!))}
            className="flex items-center gap-1 rounded-md border border-gold/40 bg-gold/20 px-2.5 py-1 font-sans text-xs font-semibold text-gold-light hover:bg-gold/30 transition-colors shadow-sm"
            title={`Local solar transit / noon calculated for ${solarData.solar_noon_local}`}
          >
            <Sun className="h-3.5 w-3.5 text-gold fill-current" />
            <span>Solar Noon ({solarData.solar_noon_local})</span>
          </button>
        )}

        {/* Afternoon */}
        <button
          onClick={() => onTimeChange(900)}
          className="flex items-center gap-1 rounded-md border border-gold/15 bg-background/50 px-2.5 py-1 font-sans text-xs text-gold-soft hover:bg-gold/15 hover:text-gold transition-colors"
        >
          <Sun className="h-3 w-3 text-amber-300" />
          <span>Afternoon (15:00)</span>
        </button>

        {/* Dynamic Sunset */}
        {solarData.sunset_local && (
          <button
            onClick={() => onTimeChange(timeStrToMinutes(solarData.sunset_local!))}
            className="flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-sans text-xs text-amber-300 hover:bg-amber-500/20 transition-colors"
            title={`Local sunset calculated for ${solarData.sunset_local}`}
          >
            <Sunset className="h-3 w-3 text-amber-400" />
            <span>Sunset ({solarData.sunset_local})</span>
          </button>
        )}

        {/* Evening */}
        <button
          onClick={() => onTimeChange(1110)}
          className="flex items-center gap-1 rounded-md border border-gold/15 bg-background/50 px-2.5 py-1 font-sans text-xs text-gold-soft hover:bg-gold/15 hover:text-gold transition-colors"
        >
          <Moon className="h-3 w-3 text-indigo-300" />
          <span>Evening (18:30)</span>
        </button>
      </div>
    </div>
  );
}
