/**
 * KonarkBeadCalculator.tsx
 * Interactive Horological Instrument showing the Konark Wheel's minute calculation:
 * - 24 Wheels (24 hours / 24 Pakshas)
 * - 8 Major Spokes (3 hours / 180 min Praharas)
 * - 8 Minor Spokes (1.5 hours / 90 min half-Praharas)
 * - 30 Beads between major and minor spoke (3 minutes per bead)
 * - 3 Sub-divisions per bead (single minute precision)
 */

import React, { useMemo } from "react";
import { calculateKonarkWheelReading } from "../utils/konarkWheelMath";
import { InfoButton } from "./CalculationInfo";
import { Compass, Sparkles, Clock, HelpCircle, Layers } from "lucide-react";

interface KonarkBeadCalculatorProps {
  minutesSinceMidnight: number;
  onOpenInfo: (metricKey: string) => void;
  onSelectBeadMinute?: (minutes: number) => void;
}

export function KonarkBeadCalculator({
  minutesSinceMidnight,
  onOpenInfo,
  onSelectBeadMinute,
}: KonarkBeadCalculatorProps) {
  const reading = useMemo(() => {
    return calculateKonarkWheelReading(minutesSinceMidnight);
  }, [minutesSinceMidnight]);

  return (
    <div className="w-full rounded-2xl border border-gold/30 bg-background/90 p-4 shadow-xl backdrop-blur-md sm:p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg border border-gold/30 bg-gold/10 p-2 text-gold">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-deva text-base font-semibold text-gold-gradient sm:text-lg">
                कोणार्क चक्र सूक्ष्म काल-गणना (Konark Wheel Minute Calculator)
              </h3>
              {/* Prominent Information Button */}
              <InfoButton metricKey="konarkWheel" onOpenInfo={onOpenInfo} />
            </div>
            <p className="font-sans text-[11px] text-muted-foreground">
              8 Major Spokes (3h) • 8 Minor Spokes (1.5h) • 30 Beads per Sector (3 min/bead)
            </p>
          </div>
        </div>

        {/* Current Active Spoke & Prahara Tag */}
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-gold/25 bg-gold/10 px-2.5 py-1 font-deva text-xs font-semibold text-gold">
            {reading.praharaHindi} ({reading.praharaTimeRange})
          </span>
        </div>
      </div>

      {/* Main Grid: Sector Info & Active Bead Breakdown */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Column 1: Spoke & Sector Position */}
        <div className="rounded-xl border border-gold/15 bg-background/50 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Active Prahara:</span>
            <span className="font-semibold text-gold">{reading.praharaName.split(" ")[0]}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Prahara Span:</span>
            <span className="font-mono text-foreground">{reading.praharaTimeRange}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground border-t border-gold/10 pt-2">
            <span>Spoke Sector:</span>
            <span
              className="font-semibold text-amber-300 text-right truncate max-w-[170px]"
              title={reading.sectorLabel}
            >
              {reading.isFirstHalf ? "Major → Minor Spoke" : "Minor → Major Spoke"}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Sector Interval:</span>
            <span className="font-mono text-foreground">
              {reading.isFirstHalf ? "0 to 90 min" : "90 to 180 min"}
            </span>
          </div>
        </div>

        {/* Column 2: 30-Bead Reading & Minute Value */}
        <div className="rounded-xl border border-gold/15 bg-background/50 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Active Bead:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              Bead #{reading.beadIndex}{" "}
              <span className="text-[10px] text-muted-foreground">/ 30</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Bead Value:</span>
            <span className="font-mono text-foreground">
              ({reading.beadIndex} − 1) × 3 = {(reading.beadIndex - 1) * 3} min
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground border-t border-gold/10 pt-2">
            <span>Sub-Bead Third:</span>
            <span className="font-semibold text-sky-400">{reading.beadThirdLabel}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Single-Minute Offset:</span>
            <span className="font-mono text-amber-300 font-bold">
              +{reading.exactMinuteOffset} min into sector
            </span>
          </div>
        </div>

        {/* Column 3: Complete Mathematical Formula & Result */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-2 text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gold text-[11px] uppercase tracking-wider">
                Derived Sundial Time
              </span>
              <button
                onClick={() => onOpenInfo("konarkWheel")}
                className="flex items-center gap-1 text-[10px] text-gold hover:underline"
              >
                <HelpCircle className="h-3 w-3" />
                <span>How to read</span>
              </button>
            </div>
            <div className="font-mono text-2xl font-bold text-amber-300">
              {reading.calculatedTimeFormatted}
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              Base + (Bead #{reading.beadIndex} × 3 min) + Third ({reading.beadThird} of 3)
            </p>
          </div>

          <div className="rounded bg-background/60 p-2 text-[10px] font-mono text-amber-200 border border-gold/15">
            90 min ÷ 30 beads = 3 min/bead • 1/3 bead = 1 min
          </div>
        </div>
      </div>

      {/* Interactive 30-Bead Strip (Visual representation of the 30 beads) */}
      <div className="mt-4 pt-3 border-t border-gold/15">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-gold-soft flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-gold" />
            <span>
              30 Beads in Active {reading.isFirstHalf ? "Major → Minor" : "Minor → Major"} Spoke
              Sector:
            </span>
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">Each Bead = 3 Minutes</span>
        </div>

        {/* Beads Row */}
        <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1 sm:gap-1.5">
          {Array.from({ length: 30 }).map((_, i) => {
            const beadNum = i + 1;
            const isActive = beadNum === reading.beadIndex;
            const isPassed = beadNum < reading.beadIndex;
            const minuteValue = (beadNum - 1) * 3;

            return (
              <button
                key={`bead-strip-${beadNum}`}
                type="button"
                className={`relative flex flex-col items-center justify-center rounded py-1 px-0.5 text-[9px] font-mono transition-all ${
                  isActive
                    ? "bg-gradient-to-t from-amber-500 to-amber-300 text-slate-950 font-bold shadow-md shadow-amber-500/40 ring-2 ring-amber-300 scale-110 z-10"
                    : isPassed
                      ? "bg-gold/20 text-amber-100 border border-gold/35 hover:bg-gold/30"
                      : "bg-[#0b1220]/80 text-slate-300 border border-gold/20 hover:text-amber-100 hover:border-gold/40"
                }`}
                title={`Bead #${beadNum}: ${minuteValue} to ${minuteValue + 3} minutes`}
              >
                <span>{beadNum}</span>
              </button>
            );
          })}
        </div>

        {/* Bead Split-into-Thirds Diagram */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gold/15 bg-background/50 px-3 py-2 text-[11px]">
          <span className="text-muted-foreground">
            Active Bead #{reading.beadIndex} Single-Minute Resolution:
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                reading.beadThird === 1
                  ? "bg-sky-500/30 text-sky-200 border border-sky-400/60 font-bold"
                  : "bg-[#0b1220]/80 text-slate-300 border border-gold/15"
              }`}
            >
              1st Third (+0 min)
            </span>
            <span className="text-slate-400">•</span>
            <span
              className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                reading.beadThird === 2
                  ? "bg-sky-500/30 text-sky-200 border border-sky-400/60 font-bold"
                  : "bg-[#0b1220]/80 text-slate-300 border border-gold/15"
              }`}
            >
              2nd Third / Center (+1 min)
            </span>
            <span className="text-slate-400">•</span>
            <span
              className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                reading.beadThird === 3
                  ? "bg-sky-500/30 text-sky-200 border border-sky-400/60 font-bold"
                  : "bg-[#0b1220]/80 text-slate-300 border border-gold/15"
              }`}
            >
              3rd Third (+2 min)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
