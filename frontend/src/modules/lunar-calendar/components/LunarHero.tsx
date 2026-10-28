/**
 * components/LunarHero.tsx
 * Section A: Hero with editorial context, quick status badges, and navigation jump links.
 */

import React from "react";
import {
  Moon,
  Sparkles,
  Compass,
  Calendar,
  Layers,
  Flame,
  ArrowRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import type {
  MoonPhysicalState,
  PanchangLimbsState,
  LunarMonthState,
} from "../types/lunarCalendar";

interface LunarHeroProps {
  selectedDate: string;
  moonState: MoonPhysicalState;
  panchangLimbs: PanchangLimbsState;
  lunarMonth: LunarMonthState;
  isLiveBackend: boolean;
  onExploreMoon: () => void;
  onExploreTithi: () => void;
  onExploreCalendar: () => void;
  onExploreFestivals: () => void;
  onOpenInfo: (key: string) => void;
}

export function LunarHero({
  selectedDate,
  moonState,
  panchangLimbs,
  lunarMonth,
  isLiveBackend,
  onExploreMoon,
  onExploreTithi,
  onExploreCalendar,
  onExploreFestivals,
  onOpenInfo,
}: LunarHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-midnight/90 via-midnight-card/80 to-midnight/95 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
      {/* Decorative Celestial Rings */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-gold/10 bg-radial from-violet-900/10 to-transparent blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full border border-silver/10 bg-radial from-blue-900/10 to-transparent blur-xl"
        aria-hidden
      />

      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Module Sub-Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-light">
            <Moon className="h-3.5 w-3.5" />
            <span>Module 3 • चन्द्र पञ्चाङ्ग</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-silver/20 bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
            <Clock className="h-3 w-3 text-silver" />
            <span>Chandra Mana • Synodic Orbit 29.53 Days</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
              isLiveBackend
                ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                : "border-amber-500/30 bg-amber-950/40 text-amber-300"
            }`}
          >
            <CheckCircle className="h-3 w-3" />
            <span>
              {isLiveBackend ? "NASA JPL DE421 Ephemeris Connected" : "Local Ephemeris Simulation"}
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-100 sm:text-5xl lg:text-6xl">
            Explore the{" "}
            <span className="bg-gradient-to-r from-silver via-slate-100 to-gold bg-clip-text text-transparent">
              Lunar Calendar
            </span>
          </h1>
          <p className="font-deva text-lg text-gold-soft sm:text-2xl">
            चन्द्र पञ्चाङ्ग • तिथि, नक्षत्र, योग, करण व चान्द्र मास
          </p>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
          Discover how the ancient sages calibrated time through the Moon’s synodic journey. Unlike
          solar time, Indian lunar timekeeping divides each synodic month into{" "}
          <strong className="text-white">30 dynamic Tithis</strong> and maps the Moon’s passage
          through the <strong className="text-white">27 sidereal Nakshatras</strong>. Observe
          realistic 3D lunar illumination, explore the lunar calendar, discover major lunar
          festivals, and compare traditional algorithms with high-precision NASA JPL ephemerides.
        </p>

        {/* Live Status Summary Card */}
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 sm:grid-cols-4 sm:gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Current Tithi
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base font-bold text-white sm:text-lg">
                {panchangLimbs.tithi.name}
              </span>
              <button
                type="button"
                onClick={() => onOpenInfo("tithi")}
                className="text-xs text-gold hover:underline"
                aria-label="Tithi calculation formula"
              >
                ⓘ
              </button>
            </div>
            <p className="text-xs text-gold-soft font-deva">
              {panchangLimbs.tithi.nameSanskrit} ({panchangLimbs.tithi.paksha} Paksha)
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Moon Illumination
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base font-bold text-white sm:text-lg">
                {moonState.illuminationPercent}%
              </span>
              <button
                type="button"
                onClick={() => onOpenInfo("phase-illumination")}
                className="text-xs text-gold hover:underline"
                aria-label="Phase illumination formula"
              >
                ⓘ
              </button>
            </div>
            <p className="text-xs text-slate-400">
              {moonState.isWaxing ? "Waxing (Shukla)" : "Waning (Krishna)"}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Nakshatra Mansion
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base font-bold text-white sm:text-lg">
                {panchangLimbs.nakshatra.name}
              </span>
              <button
                type="button"
                onClick={() => onOpenInfo("nakshatra")}
                className="text-xs text-gold hover:underline"
                aria-label="Nakshatra calculation formula"
              >
                ⓘ
              </button>
            </div>
            <p className="text-xs text-gold-soft font-deva">
              {panchangLimbs.nakshatra.nameSanskrit} • Pada {panchangLimbs.nakshatra.pada}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Lunar Month
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base font-bold text-white sm:text-lg">
                {lunarMonth.amantaMonthName}
              </span>
              <button
                type="button"
                onClick={() => onOpenInfo("amanta-purnimanta")}
                className="text-xs text-gold hover:underline"
                aria-label="Amanta vs Purnimanta explanation"
              >
                ⓘ
              </button>
            </div>
            <p className="text-xs text-slate-400">{lunarMonth.rituNameEnglish}</p>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onExploreMoon}
            className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/20 px-4 py-2.5 text-sm font-semibold text-gold-light shadow-lg transition-all hover:bg-gold/30 hover:shadow-gold/10"
          >
            <Moon className="h-4 w-4" />
            <span>Interactive 3D Moon</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onExploreTithi}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-white/10"
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span>30 Tithis & 27 Nakshatras</span>
          </button>

          <button
            type="button"
            onClick={onExploreCalendar}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-white/10"
          >
            <Calendar className="h-4 w-4 text-blue-400" />
            <span>Monthly Calendar</span>
          </button>

          <button
            type="button"
            onClick={onExploreFestivals}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-white/10"
          >
            <Flame className="h-4 w-4 text-amber-400" />
            <span>Lunar Festivals</span>
          </button>
        </div>
      </div>
    </section>
  );
}
