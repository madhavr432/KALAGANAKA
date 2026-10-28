/**
 * Hero Section for Module 1: Ancient vs Modern Timekeeping.
 * Features editorial typography, dark cosmic styling, and CTAs.
 */

import React from "react";
import { Compass, Eye, Sparkles, ChevronDown } from "lucide-react";
import { TimekeepingViewMode } from "../types/timekeeping";

interface TimekeepingHeaderProps {
  onExploreChakra: () => void;
  onCompareTimekeeping: () => void;
}

export function TimekeepingHeader({
  onExploreChakra,
  onCompareTimekeeping,
}: TimekeepingHeaderProps) {
  return (
    <section className="relative pt-6 pb-10 text-center sm:pt-10 sm:pb-14">
      {/* Module Pill Identifier */}
      <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-medium text-gold backdrop-blur-sm">
        <Sparkles className="h-3.5 w-3.5 text-gold animate-pulse" />
        <span className="font-deva">विभाग १: काल-गणना वेधशाला</span>
        <span className="text-gold/50">•</span>
        <span className="font-sans tracking-wide uppercase text-[10px] text-gold-soft">
          Module 1: Timekeeping Observatory
        </span>
      </div>

      {/* Editorial Main Heading */}
      <h1 className="mt-4 font-deva text-4xl font-normal tracking-wide text-gold-gradient sm:text-5xl md:text-6xl drop-shadow-gold">
        Ancient vs Modern Timekeeping
      </h1>

      {/* Descriptive Subtitle */}
      <p className="mx-auto mt-4 max-w-3xl font-serif text-lg text-gold-soft/90 sm:text-xl md:text-2xl leading-relaxed">
        Explore how the movement of the Sun connects historical temple timekeeping with modern
        astronomical calculations.
      </p>

      {/* Brief educational overview */}
      <p className="mx-auto mt-3 max-w-2xl font-sans text-xs text-muted-foreground sm:text-sm leading-relaxed">
        Observe the 13th-century stone wheel of the Konark Sun Temple as sunlight and shadow sweep
        across its 8 major Praharas, alongside a modern scientific celestial coordinate machine
        displaying real-time solar altitude, azimuth, and apparent solar time.
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onExploreChakra}
          className="flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-2.5 font-sans text-xs font-bold text-slate-950 shadow-lg shadow-gold/20 hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Eye className="h-4 w-4" />
          <span>Explore the Chakra</span>
        </button>

        <button
          onClick={onCompareTimekeeping}
          className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/5 px-6 py-2.5 font-sans text-xs font-semibold text-gold-soft hover:bg-gold/15 hover:text-gold transition-all"
        >
          <Compass className="h-4 w-4 text-gold" />
          <span>Compare Timekeeping</span>
        </button>
      </div>

      {/* Subtle Scroll Cue */}
      <div className="mt-8 flex justify-center text-gold/40 animate-bounce">
        <ChevronDown className="h-4 w-4" />
      </div>
    </section>
  );
}
