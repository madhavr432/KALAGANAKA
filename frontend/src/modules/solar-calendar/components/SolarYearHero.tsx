/**
 * SolarYearHero.tsx
 * Hero Section for Module 2: The Solar Year (सौर संवत्सर).
 * Provides editorial introduction, navigation CTAs, and live celestial telemetry badges.
 */

import React from "react";
import { Sun, Calendar, Flame, Compass, ChevronDown, Sparkles } from "lucide-react";
import { SolarCalculatedValues } from "../types/solarCalendar";

interface SolarYearHeroProps {
  solarValues: SolarCalculatedValues;
  onExploreCalendar: () => void;
  onDiscoverFestivals: () => void;
}

export function SolarYearHero({
  solarValues,
  onExploreCalendar,
  onDiscoverFestivals,
}: SolarYearHeroProps) {
  return (
    <section className="relative w-full text-center space-y-6 pt-4 pb-2">
      {/* Module Pill Indicator */}
      <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 font-sans text-xs font-medium text-gold-soft shadow-sm">
        <Sun className="h-3.5 w-3.5 text-gold animate-spin-slow" />
        <span>Module 2 • सौर संवत्सर एवं सौर पञ्चाङ्ग (The Solar Year)</span>
      </div>

      {/* Main Editorial Heading */}
      <div className="space-y-2">
        <h1 className="font-deva text-4xl font-normal tracking-wide text-gold-gradient drop-shadow-gold sm:text-5xl lg:text-6xl">
          The Solar Year
        </h1>
        <h2 className="font-deva text-2xl text-gold-light sm:text-3xl">
          सौर संवत्सर, अयनांश एवं पारम्परिक सौर उत्सव
        </h2>
      </div>

      {/* Descriptive Subtitle */}
      <p className="mx-auto max-w-3xl font-serif text-sm text-gold-soft/90 sm:text-base leading-relaxed">
        Explore the Sun&rsquo;s annual journey across the ecliptic, observe how Earth&rsquo;s 23.44°
        axial tilt creates the seasons, and discover the astronomical foundations behind
        India&rsquo;s regional solar calendars, Sankranti transitions, and solar New Year
        celebrations.
      </p>

      {/* Primary & Secondary Action CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onExploreCalendar}
          className="flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-2.5 font-sans text-xs font-bold text-slate-950 shadow-lg shadow-gold/20 hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calendar className="h-4 w-4" />
          <span>Explore Solar Calendar</span>
        </button>

        <button
          type="button"
          onClick={onDiscoverFestivals}
          className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-6 py-2.5 font-sans text-xs font-semibold text-gold-soft hover:bg-gold/20 hover:text-gold transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Flame className="h-4 w-4 text-amber-400" />
          <span>Discover Solar Festivals</span>
        </button>
      </div>

      {/* Telemetry Summary Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left">
        <div className="rounded-xl border border-gold/20 bg-background/60 p-3 shadow-md backdrop-blur-sm">
          <span className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground">
            Active Solar Month
          </span>
          <span className="font-deva text-base font-bold text-gold-light block mt-0.5">
            {solarValues.currentRashi.sanskritName.split(" ")[0]} {solarValues.solarDayInMonth}
          </span>
          <span className="text-[10px] text-gold-soft block">
            Day {solarValues.solarDayInMonth} of {solarValues.currentRashi.englishName}
          </span>
        </div>

        <div className="rounded-xl border border-gold/20 bg-background/60 p-3 shadow-md backdrop-blur-sm">
          <span className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground">
            Current Indian Ritu
          </span>
          <span className="font-deva text-base font-bold text-amber-300 block mt-0.5">
            {solarValues.indianRituSanskrit}
          </span>
          <span className="text-[10px] text-muted-foreground block">{solarValues.indianRitu}</span>
        </div>

        <div className="rounded-xl border border-gold/20 bg-background/60 p-3 shadow-md backdrop-blur-sm">
          <span className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground">
            Ayanamsha (Lahiri)
          </span>
          <span className="font-mono text-base font-bold text-gold-light block mt-0.5">
            {solarValues.ayanamshaDeg.toFixed(2)}°
          </span>
          <span className="text-[10px] text-muted-foreground block">
            Trop − Sid Precession Offset
          </span>
        </div>

        <div className="rounded-xl border border-gold/20 bg-background/60 p-3 shadow-md backdrop-blur-sm">
          <span className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground">
            Next Sankranti Ingress
          </span>
          <span className="font-deva text-base font-bold text-amber-300 block mt-0.5">
            {solarValues.nextRashi.sanskritName.split(" ")[0]} संक्रान्ति
          </span>
          <span className="text-[10px] text-gold-soft block">
            ~{solarValues.remainingDegToSankranti.toFixed(1)}° ({solarValues.approxDaysToSankranti}{" "}
            days)
          </span>
        </div>
      </div>
    </section>
  );
}
