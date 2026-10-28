/**
 * components/LunarCalendarMonthView.tsx
 * Section G: Full Monthly Lunar Calendar Grid.
 * Correlates Gregorian dates with Indian Tithis, Nakshatras, and Festivals.
 * Features:
 * 1. Amanta (Mukhya Mana) vs Purnimanta (Gauna Mana) toggle.
 * 2. Visual comparison of fortnight alignments between North and South India.
 * 3. Educational explanation of Adhika Masa (Leap Month / Purushottama Masa).
 * 4. Interactive day cells that update the entire simulation.
 */

import React, { useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  Moon,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { generateMonthlyLunarGrid } from "../utils/lunarCalculations";
import type { LunarCalendarGridDay, LunarMonthState } from "../types/lunarCalendar";

interface LunarCalendarMonthViewProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  monthViewMode: "amanta" | "purnimanta";
  setMonthViewMode: (mode: "amanta" | "purnimanta") => void;
  lunarMonth: LunarMonthState;
  onOpenInfo: (key: string) => void;
}

const WEEKDAY_NAMES = [
  "Sun (रवि)",
  "Mon (सोम)",
  "Tue (मङ्गल)",
  "Wed (बुध)",
  "Thu (गुरु)",
  "Fri (शुक्र)",
  "Sat (शनि)",
];

export function LunarCalendarMonthView({
  selectedDate,
  onSelectDate,
  monthViewMode,
  setMonthViewMode,
  lunarMonth,
  onOpenInfo,
}: LunarCalendarMonthViewProps) {
  const [yearStr, monthStr] = selectedDate.split("-");
  const currentYear = parseInt(yearStr, 10);
  const currentMonth = parseInt(monthStr, 10);

  const gridDays = useMemo(() => {
    return generateMonthlyLunarGrid(currentYear, currentMonth, selectedDate);
  }, [currentYear, currentMonth, selectedDate]);

  const handlePrevMonth = () => {
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    onSelectDate(`${prevYear}-${String(prevMonth).padStart(2, "0")}-01`);
  };

  const handleNextMonth = () => {
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    onSelectDate(`${nextYear}-${String(nextMonth).padStart(2, "0")}-01`);
  };

  const monthLabel = new Date(currentYear, currentMonth - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="space-y-6 rounded-3xl border border-gold/25 bg-midnight-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header with Navigation and Amanta/Purnimanta Switcher */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              Monthly Lunar Calendar Grid
            </h2>
            <button
              type="button"
              onClick={() => onOpenInfo("amanta-purnimanta")}
              className="text-xs text-gold hover:underline"
              aria-label="Amanta vs Purnimanta explanation"
            >
              ⓘ Systems
            </button>
          </div>
          <p className="mt-1 font-deva text-sm text-gold-soft">
            चान्द्रमास दर्शिका — सौर एवं चान्द्र तिथियों का समन्वय
          </p>
        </div>

        {/* Controls: Prev/Next Month & Amanta Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Amanta vs Purnimanta System Toggle */}
          <div className="flex items-center rounded-2xl border border-white/15 bg-black/60 p-1 text-xs">
            <button
              type="button"
              onClick={() => setMonthViewMode("amanta")}
              className={`rounded-xl px-3 py-1.5 font-semibold transition-all ${
                monthViewMode === "amanta"
                  ? "bg-gold/30 text-gold-light"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Amanta (अमान्त)
            </button>
            <button
              type="button"
              onClick={() => setMonthViewMode("purnimanta")}
              className={`rounded-xl px-3 py-1.5 font-semibold transition-all ${
                monthViewMode === "purnimanta"
                  ? "bg-gold/30 text-gold-light"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Purnimanta (पूर्णिमान्त)
            </button>
          </div>

          {/* Month Stepper */}
          <div className="flex items-center gap-1 rounded-2xl border border-white/15 bg-black/60 p-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="rounded-xl p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[120px] text-center font-serif text-xs font-bold text-white">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded-xl p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active System Indicator Banner */}
      <div className="flex flex-col justify-between gap-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-muted-foreground">Active Tradition: </span>
          <strong className="text-gold-light">
            {monthViewMode === "amanta"
              ? "Amanta (Mukhya Mana) — South India, Maharashtra, Gujarat"
              : "Purnimanta (Gauna Mana) — North India (UP, Bihar, Rajasthan, MP)"}
          </strong>
        </div>
        <div className="text-slate-400">
          Current Month:{" "}
          <strong className="text-white">
            {monthViewMode === "amanta"
              ? lunarMonth.amantaMonthName
              : lunarMonth.purnimantaMonthName}
          </strong>{" "}
          (
          <span className="font-deva text-gold-soft">
            {monthViewMode === "amanta"
              ? lunarMonth.amantaMonthSanskrit
              : lunarMonth.purnimantaMonthSanskrit}
          </span>
          )
        </div>
      </div>

      {/* 7-Column Calendar Grid */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
        {/* Weekday Header */}
        <div className="grid grid-cols-7 border-b border-white/10 bg-black/60 text-center text-[11px] font-semibold text-slate-300">
          {WEEKDAY_NAMES.map((w) => (
            <div key={w} className="py-2.5">
              {w}
            </div>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-white/10 text-xs">
          {gridDays.map((cell) => {
            const hasFestivals = cell.festivals.length > 0;

            return (
              <div
                key={cell.dateStr}
                onClick={() => onSelectDate(cell.dateStr)}
                className={`group relative flex min-h-[96px] cursor-pointer flex-col justify-between p-2 transition-all ${
                  cell.isSelectedDate
                    ? "bg-gold/15 ring-2 ring-gold"
                    : cell.isToday
                      ? "bg-blue-950/30"
                      : cell.isCurrentMonth
                        ? "bg-black/20 hover:bg-white/5"
                        : "bg-black/60 opacity-40 hover:opacity-70"
                }`}
              >
                {/* Top Row: Gregorian Day + Tithi Number */}
                <div className="flex items-center justify-between">
                  <span
                    className={`font-serif text-sm font-bold ${
                      cell.isSelectedDate
                        ? "text-gold-light"
                        : cell.isToday
                          ? "text-blue-400"
                          : "text-white"
                    }`}
                  >
                    {cell.dayOfMonth}
                  </span>

                  {/* Illumination mini indicator */}
                  <span className="font-mono text-[10px] text-slate-400">
                    {Math.round(cell.illuminatedFraction * 100)}%
                  </span>
                </div>

                {/* Middle: Tithi Name and Paksha */}
                <div className="my-1 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        cell.paksha === "Shukla" ? "bg-amber-400" : "bg-slate-400"
                      }`}
                    />
                    <strong className="truncate text-[11px] text-slate-200">
                      {cell.tithiName}
                    </strong>
                  </div>
                  <span className="block truncate text-[10px] text-muted-foreground">
                    {cell.nakshatraName}
                  </span>
                </div>

                {/* Bottom: Special Marker (Amavasya, Purnima, or Festival Pill) */}
                <div>
                  {cell.isAmavasya && (
                    <span className="inline-block rounded bg-black px-1.5 py-0.5 text-[9px] font-semibold text-slate-300 border border-slate-700">
                      अमावस्या (New Moon)
                    </span>
                  )}
                  {cell.isPurnima && (
                    <span className="inline-block rounded bg-gold/20 px-1.5 py-0.5 text-[9px] font-semibold text-gold-light border border-gold/40">
                      पूर्णिमा (Full Moon)
                    </span>
                  )}
                  {hasFestivals && !cell.isAmavasya && !cell.isPurnima && (
                    <span className="inline-block truncate rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300 border border-amber-500/30">
                      {cell.festivals[0].name.split("/")[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Card: Amanta vs Purnimanta & Adhika Masa */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Card 1: Amanta vs Purnimanta Alignment */}
        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Layers className="h-4 w-4 text-gold" />
            <strong className="text-white">Amanta vs Purnimanta System Harmony</strong>
          </div>
          <p className="leading-relaxed text-slate-300">
            A common source of confusion is whether North and South India celebrate festivals on
            different days. In reality,{" "}
            <strong>
              all festivals occurring during Shukla Paksha (e.g. Rama Navami, Ganesh Chaturthi,
              Dussehra) fall on the EXACT same day
            </strong>{" "}
            in both systems!
          </p>
          <p className="leading-relaxed text-slate-300">
            The only difference is that North Indian Purnimanta begins the month 15 days earlier at
            Krishna Pratipada. Thus, Diwali is observed on <em>Kartika Amavasya</em> in Amanta, and
            on <em>Ashvina Amavasya</em> or <em>Kartika Amavasya</em> depending on regional
            phrasing, but on the exact same astronomical night!
          </p>
        </div>

        {/* Card 2: Adhika Masa (Leap Month) Mechanics */}
        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <strong className="text-white">Adhika Masa (Malamasa / Leap Month)</strong>
          </div>
          <p className="leading-relaxed text-slate-300">
            A solar year is <strong>365.242 days</strong>, while 12 lunar synodic months span only{" "}
            <strong>354.367 days</strong>. This creates an annual deficit of{" "}
            <strong>~10.87 days</strong>.
          </p>
          <p className="leading-relaxed text-slate-300">
            Every ~32.5 months (approximately 2.7 years), this deficit equals one complete lunar
            cycle (~30 days). When a lunar month occurs with <strong>no solar Sankranti</strong>{" "}
            (the Sun stays within the same zodiac sign), that month is doubled as an{" "}
            <strong>Adhika Masa</strong>, synchronizing the lunar calendar back with solar
            agricultural seasons!
          </p>
        </div>
      </div>
    </section>
  );
}
