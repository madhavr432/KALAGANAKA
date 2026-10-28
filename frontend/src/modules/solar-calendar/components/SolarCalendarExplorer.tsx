/**
 * SolarCalendarExplorer.tsx
 * Interactive Solar Calendar & 12-Rashi Zodiac Explorer.
 * Features:
 * - Live Sayana (Tropical) vs Nirayana (Sidereal) Longitudes.
 * - Current Solar Month, Solar Day, and Upcoming Sankranti countdown.
 * - Interactive 12-sign Rashi Wheel & card sequence.
 * - Comprehensive regional solar month names (Tamil, Bengali, Malayalam, Odia, North).
 * - "ⓘ" information modals for astronomical concepts.
 */

import React, { useState } from "react";
import {
  Sun,
  Compass,
  Calendar,
  Flame,
  Layers,
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { SOLAR_RASHIS } from "../constants/solarConstants";
import { SolarCalculatedValues, RashiDetail } from "../types/solarCalendar";

interface SolarCalendarExplorerProps {
  solarValues: SolarCalculatedValues;
  selectedRashiIndex: number;
  onSelectRashiIndex: (index: number) => void;
  onOpenInfo: (key: string) => void;
}

export function SolarCalendarExplorer({
  solarValues,
  selectedRashiIndex,
  onSelectRashiIndex,
  onOpenInfo,
}: SolarCalendarExplorerProps) {
  const inspectedRashi: RashiDetail = SOLAR_RASHIS[selectedRashiIndex] || SOLAR_RASHIS[0];
  const activeRashi = solarValues.currentRashi;

  return (
    <section className="w-full space-y-6 rounded-2xl border border-gold/25 bg-background/85 p-5 shadow-2xl backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-gold" />
            <h3 className="font-deva text-xl text-gold-gradient sm:text-2xl">
              सौर पञ्चाङ्ग एवं १२ राशि मण्डल (Solar Calendar & 12-Sign Explorer)
            </h3>
          </div>
          <p className="font-sans text-xs text-muted-foreground mt-0.5">
            Saur Mana calendar system tracking the Sun&rsquo;s ingress through the 12 Nirayana
            Rashis
          </p>
        </div>

        {/* Info button explaining Tropical vs Sidereal */}
        <button
          type="button"
          onClick={() => onOpenInfo("tropicalLongitude")}
          className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs font-sans text-gold-soft hover:bg-gold/15 hover:text-gold transition-colors"
        >
          <Info className="h-3.5 w-3.5" />
          <span>Tropical vs Sidereal Longitude</span>
        </button>
      </div>

      {/* 4 Telemetry Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Solar Date & Elapsed Days */}
        <div className="rounded-xl border border-gold/20 bg-[#090e18]/80 p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-gold/15 pb-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-deva text-gold">
              <Sun className="h-4 w-4 text-gold" />
              सौर मास एवं प्रविष्टे
            </span>
            <button
              onClick={() => onOpenInfo("sankranti")}
              className="text-gold-soft hover:text-gold"
              title="Calculation Details"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3">
            <span className="font-deva text-2xl font-bold text-gold-light block">
              {activeRashi.sanskritName.split(" ")[0]} {solarValues.solarDayInMonth}
            </span>
            <span className="text-xs text-amber-200 mt-1 block">
              Day {solarValues.solarDayInMonth} of {activeRashi.englishName} (
              {activeRashi.solarMonthTamil.split(" ")[0]})
            </span>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground font-mono">
            {solarValues.degInRashi.toFixed(2)}° elapsed in current sign
          </p>
        </div>

        {/* 2. Sidereal Solar Longitude (Nirayana) */}
        <div className="rounded-xl border border-gold/20 bg-[#090e18]/80 p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-gold/15 pb-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-sans text-gold font-medium">
              <Compass className="h-4 w-4 text-gold" />
              Nirayana (Sidereal) Longitude
            </span>
            <button
              onClick={() => onOpenInfo("siderealLongitude")}
              className="text-gold-soft hover:text-gold"
              title="Calculation Details"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3">
            <span className="font-mono text-2xl font-bold text-amber-300 block">
              {solarValues.sunSiderealLongitudeDeg.toFixed(2)}°
            </span>
            <span className="text-xs text-gold-soft mt-1 block">
              {activeRashi.symbol} {activeRashi.englishName} sector ({activeRashi.startDeg}° to{" "}
              {activeRashi.endDeg}°)
            </span>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Governing Lord: {activeRashi.rulingGraha}
          </p>
        </div>

        {/* 3. Sayana (Tropical) Longitude */}
        <div className="rounded-xl border border-gold/20 bg-[#090e18]/80 p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-gold/15 pb-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-sans text-gold font-medium">
              <Compass className="h-4 w-4 text-sky-400" />
              Sayana (Tropical) Longitude
            </span>
            <button
              onClick={() => onOpenInfo("tropicalLongitude")}
              className="text-gold-soft hover:text-gold"
              title="Calculation Details"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3">
            <span className="font-mono text-2xl font-bold text-sky-300 block">
              {solarValues.sunTropicalLongitudeDeg.toFixed(2)}°
            </span>
            <span className="text-xs text-sky-200 mt-1 block">{solarValues.tropicalSeason}</span>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground font-mono">
            Offset = Ayanamsha: {solarValues.ayanamshaDeg.toFixed(2)}°
          </p>
        </div>

        {/* 4. Upcoming Sankranti Ingress */}
        <div className="rounded-xl border border-gold/20 bg-[#090e18]/80 p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-gold/15 pb-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-deva text-gold">
              <Flame className="h-4 w-4 text-amber-400" />
              आगामी सङ्क्रान्ति (Next Ingress)
            </span>
            <button
              onClick={() => onOpenInfo("sankranti")}
              className="text-gold-soft hover:text-gold"
              title="Calculation Details"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3">
            <span className="font-deva text-xl font-bold text-gold-light block">
              {solarValues.nextRashi.sanskritName.split(" ")[0]} संक्रान्ति
            </span>
            <span className="text-xs text-amber-300 mt-1 block font-mono">
              ~{solarValues.remainingDegToSankranti.toFixed(2)}° remaining
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-300">
            Estimated in approx.{" "}
            <strong className="text-amber-300">{solarValues.approxDaysToSankranti} days</strong>
          </p>
        </div>
      </div>

      {/* 12-Sign Interactive Zodiac Selector Strip */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="font-deva text-base font-semibold text-gold flex items-center gap-2">
            <Layers className="h-4 w-4 text-gold" />
            <span>द्वादश राशि मण्डल (12 Sidereal Solar Signs)</span>
          </h4>
          <span className="text-xs text-muted-foreground">
            Click any Rashi to inspect its regional month names and festivals
          </span>
        </div>

        {/* Scrollable / Grid Rashi Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {SOLAR_RASHIS.map((rashi, idx) => {
            const isCurrentlyOccupied = rashi.index === activeRashi.index;
            const isInspected = rashi.index === inspectedRashi.index;

            return (
              <button
                key={rashi.index}
                type="button"
                onClick={() => onSelectRashiIndex(idx)}
                className={`relative flex flex-col items-start rounded-xl p-3 text-left transition-all ${
                  isInspected
                    ? "bg-gold/20 text-gold-light border-2 border-gold shadow-lg shadow-gold/20"
                    : isCurrentlyOccupied
                      ? "bg-amber-500/10 text-amber-200 border border-amber-400/60"
                      : "bg-[#090e18]/60 text-slate-300 border border-gold/15 hover:border-gold/40 hover:bg-[#0c1424]"
                }`}
              >
                {/* Active Indicator Badge */}
                {isCurrentlyOccupied && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                  </span>
                )}

                <div className="flex items-center gap-1.5 text-base">
                  <span className="text-gold font-bold">{rashi.symbol}</span>
                  <span className="font-deva font-semibold text-sm">
                    {rashi.sanskritName.split(" ")[0]}
                  </span>
                </div>

                <span className="text-[11px] font-sans text-muted-foreground">
                  {rashi.englishName} ({rashi.startDeg}°–{rashi.endDeg}°)
                </span>

                <span className="text-[10px] text-gold-soft/80 mt-1">
                  {rashi.approximateDateRange}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Rashi Deep-Dive Panel */}
      <div className="rounded-xl border border-gold/30 bg-[#080d17] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl text-gold font-bold">{inspectedRashi.symbol}</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-deva text-xl font-bold text-gold-gradient">
                  {inspectedRashi.sanskritName} ({inspectedRashi.englishName})
                </h4>
                <span className="rounded-full bg-gold/10 border border-gold/30 px-2 py-0.5 text-[10px] font-mono text-amber-200">
                  {inspectedRashi.startDeg}° to {inspectedRashi.endDeg}° Nirayana
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Sign #{inspectedRashi.index} • Element: {inspectedRashi.element} • Ruling Graha:{" "}
                {inspectedRashi.rulingGraha}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-gold-soft font-mono block">
              Annual Window: {inspectedRashi.approximateDateRange}
            </span>
            {inspectedRashi.index === activeRashi.index ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Currently Active Sign</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* Regional Calendar Month Names Grid */}
        <div>
          <span className="font-deva text-xs font-semibold text-gold-soft uppercase tracking-wider block mb-2">
            क्षेत्रीय सौर मास नाम (Regional Solar Month Names):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="rounded-lg border border-gold/15 bg-background/50 p-2.5">
              <span className="text-[10px] text-muted-foreground block font-sans">
                North (Bikrami / Sanskrit)
              </span>
              <strong className="text-gold-light font-deva text-sm block mt-0.5">
                {inspectedRashi.solarMonthNorth}
              </strong>
            </div>

            <div className="rounded-lg border border-gold/15 bg-background/50 p-2.5">
              <span className="text-[10px] text-muted-foreground block font-sans">
                Tamil (தமிழ் सौर)
              </span>
              <strong className="text-gold-light text-sm block mt-0.5">
                {inspectedRashi.solarMonthTamil}
              </strong>
            </div>

            <div className="rounded-lg border border-gold/15 bg-background/50 p-2.5">
              <span className="text-[10px] text-muted-foreground block font-sans">
                Bengali (বাংলা सौर)
              </span>
              <strong className="text-gold-light text-sm block mt-0.5">
                {inspectedRashi.solarMonthBengali}
              </strong>
            </div>

            <div className="rounded-lg border border-gold/15 bg-background/50 p-2.5">
              <span className="text-[10px] text-muted-foreground block font-sans">
                Malayalam (Kollam Era)
              </span>
              <strong className="text-gold-light text-sm block mt-0.5">
                {inspectedRashi.solarMonthMalayalam}
              </strong>
            </div>

            <div className="rounded-lg border border-gold/15 bg-background/50 p-2.5">
              <span className="text-[10px] text-muted-foreground block font-sans">
                Odia (ଓଡ଼ିଆ ସୌର)
              </span>
              <strong className="text-gold-light text-sm block mt-0.5">
                {inspectedRashi.solarMonthOdia}
              </strong>
            </div>
          </div>
        </div>

        {/* Cultural Significance & Associated Festivals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div className="rounded-lg border border-gold/15 bg-background/40 p-3">
            <span className="font-semibold text-gold-soft block mb-1">
              Cultural & Astronomical Significance:
            </span>
            <p className="text-muted-foreground leading-relaxed">
              {inspectedRashi.culturalSignificance}
            </p>
          </div>

          <div className="rounded-lg border border-gold/15 bg-background/40 p-3">
            <span className="font-semibold text-gold-soft block mb-1">
              Day 1 Civil Boundary Convention:
            </span>
            <p className="text-muted-foreground leading-relaxed font-sans">
              {inspectedRashi.dayBoundaryRule}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
