/**
 * components/LunarPhaseTimeline.tsx
 * Section C: Interactive 8 Principal Lunar Phases Timeline.
 * Shows visual discs, elongation angles, illuminated percentage, Sanskrit names,
 * and enables jumping the 3D Moon directly to any phase.
 */

import React from "react";
import { LUNAR_PHASES } from "../constants/lunarConstants";
import type { LunarPhaseDefinition, LunarPhaseId } from "../types/lunarCalendar";
import { Sparkles, ArrowRight, Compass } from "lucide-react";

interface LunarPhaseTimelineProps {
  currentPhaseId: LunarPhaseId;
  currentElongationDeg: number;
  onJumpToPhase: (elongationDeg: number) => void;
  onOpenInfo: (key: string) => void;
}

/**
 * Render a mini SVG Moon disc with exact terminator curvature.
 */
function MiniMoonDisc({
  elongationDeg,
  size = 54,
  isActive = false,
}: {
  elongationDeg: number;
  size?: number;
  isActive?: boolean;
}) {
  const r = size * 0.42;
  const cx = size / 2;
  const cy = size / 2;

  const rad = (elongationDeg * Math.PI) / 180;
  const isWaxing = elongationDeg <= 180;
  const norm = Math.cos(rad);

  const sweep = isWaxing ? 1 : 0;
  const terminatorRadiusX = Math.max(0.5, Math.abs(norm) * r);
  const terminatorSweep = norm >= 0 ? (isWaxing ? 0 : 1) : isWaxing ? 1 : 0;

  const illuminatedPath = `
    M ${cx} ${cy - r}
    A ${r} ${r} 0 0 ${sweep} ${cx} ${cy + r}
    A ${terminatorRadiusX} ${r} 0 0 ${terminatorSweep} ${cx} ${cy - r}
    Z
  `;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`transition-transform duration-300 ${
        isActive
          ? "scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]"
          : "opacity-80 group-hover:opacity-100"
      }`}
    >
      {/* Base Dark Hemisphere */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="#181c26"
        stroke={isActive ? "#fbbf24" : "#475569"}
        strokeWidth={isActive ? "2" : "1"}
      />
      {/* Illuminated Path */}
      {elongationDeg > 4 && elongationDeg < 356 && <path d={illuminatedPath} fill="#f8fafc" />}
      {/* Special Full Moon full circle fill */}
      {elongationDeg >= 174 && elongationDeg <= 186 && (
        <circle cx={cx} cy={cy} r={r} fill="#f8fafc" />
      )}
    </svg>
  );
}

export function LunarPhaseTimeline({
  currentPhaseId,
  currentElongationDeg,
  onJumpToPhase,
  onOpenInfo,
}: LunarPhaseTimelineProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-gold/20 bg-midnight-card/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-silver animate-pulse" />
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              The 8 Principal Lunar Phases
            </h2>
            <button
              type="button"
              onClick={() => onOpenInfo("phase-illumination")}
              className="text-xs text-gold hover:underline"
              aria-label="Phase illumination formula"
            >
              ⓘ
            </button>
          </div>
          <p className="mt-1 font-deva text-sm text-gold-soft">
            अष्टौ चन्द्रकलाः — दर्शतः पूर्णचन्द्रपर्यन्तम्
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          Click any phase card to jump the 3D Moon directly to its nominal angle
        </div>
      </div>

      {/* Grid of 8 Phase Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {LUNAR_PHASES.map((phase) => {
          const isActive = phase.id === currentPhaseId;

          return (
            <div
              key={phase.id}
              onClick={() => onJumpToPhase(phase.elongationNominalDeg)}
              className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${
                isActive
                  ? "border-gold/60 bg-gradient-to-b from-gold/15 to-black/60 shadow-lg shadow-gold/10"
                  : "border-white/10 bg-black/40 hover:border-gold/30 hover:bg-black/60"
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute right-3 top-3 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-gold-light border border-gold/30">
                  Current
                </div>
              )}

              {/* Top Row: Mini Moon SVG + Phase Angle */}
              <div className="flex items-center gap-3">
                <MiniMoonDisc
                  elongationDeg={phase.elongationNominalDeg}
                  size={52}
                  isActive={isActive}
                />
                <div>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-gold-light">
                    {phase.nameEnglish.split("/")[0]}
                  </h3>
                  <p className="font-deva text-xs text-gold-soft">
                    {phase.nameSanskrit.split("/")[0]}
                  </p>
                  <span className="font-mono text-[11px] text-slate-400">
                    θ = {phase.elongationNominalDeg}° •{" "}
                    {Math.round(phase.illuminationNominal * 100)}%
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-[11px] leading-relaxed text-slate-300">{phase.description}</p>

              {/* Spiritual Significance */}
              <div className="mt-3 border-t border-white/5 pt-2 text-[10px] italic text-silver">
                {phase.spiritualMeaning}
              </div>

              {/* Jump Pill */}
              <div className="mt-3 flex items-center justify-end text-[11px] font-semibold text-gold opacity-80 group-hover:opacity-100">
                <span>Jump Orbit</span>
                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
