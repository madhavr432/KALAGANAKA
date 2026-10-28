/**
 * components/LunarFestivalExplorer.tsx
 * Section H: Comprehensive Indian Lunar Festival Explorer.
 * Features:
 * 1. Rich database of traditional festivals (Diwali, Holi, Maha Shivaratri, Janmashtami, Rama Navami, etc.).
 * 2. Multi-dimensional filtering by Month, Paksha, Tradition, and Keyword search.
 * 3. Timing Kala indicators (Madhyahna, Nishita, Pradosha, Arunodaya).
 * 4. "Jump Moon to Festival" button updating the 3D Moon and date.
 * 5. In-depth detail modal with astronomical and ritual breakdowns.
 */

import React, { useState } from "react";
import {
  Flame,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  X,
  Compass,
  CheckCircle,
} from "lucide-react";
import type { LunarFestival } from "../types/lunarCalendar";

interface LunarFestivalExplorerProps {
  festivals: LunarFestival[];
  selectedFestival: LunarFestival | null;
  onSelectFestival: (festival: LunarFestival | null) => void;
  onJumpToFestival: (festival: LunarFestival) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  monthFilter: string;
  setMonthFilter: (m: string) => void;
  pakshaFilter: string;
  setPakshaFilter: (p: string) => void;
  traditionFilter: string;
  setTraditionFilter: (t: string) => void;
}

const LUNAR_MONTH_OPTIONS = [
  "all",
  "Chaitra",
  "Vaishakha",
  "Ashadha",
  "Shravana",
  "Bhadrapada",
  "Ashvina",
  "Kartika",
  "Margashirsha",
  "Phalguna",
];

const TRADITION_OPTIONS = [
  "all",
  "Pan-Indian",
  "North Indian",
  "South Indian",
  "Western Indian",
  "Eastern Indian",
];

export function LunarFestivalExplorer({
  festivals,
  selectedFestival,
  onSelectFestival,
  onJumpToFestival,
  searchQuery,
  setSearchQuery,
  monthFilter,
  setMonthFilter,
  pakshaFilter,
  setPakshaFilter,
  traditionFilter,
  setTraditionFilter,
}: LunarFestivalExplorerProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-gold/25 bg-midnight-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-400" />
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              Lunar Festivals of Bharat
            </h2>
          </div>
          <p className="mt-1 font-deva text-sm text-gold-soft">
            चान्द्रमासोत्सवाः — तिथिनक्षत्रसम्बद्धाः उत्सवाः
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <strong className="text-white">{festivals.length}</strong> verified lunar festival
          traditions
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4">
        {/* Search Input */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search festival name, deity, ritual..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/60 py-1.5 pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-gold"
          />
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <label htmlFor="lunar-festival-month-filter" className="text-muted-foreground">
            Month:
          </label>
          <select
            id="lunar-festival-month-filter"
            aria-label="Filter by month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="rounded-xl border border-white/15 bg-black/60 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-gold"
          >
            {LUNAR_MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m === "all" ? "All Months" : m}
              </option>
            ))}
          </select>
        </div>

        {/* Paksha Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <label htmlFor="lunar-festival-paksha-filter" className="text-muted-foreground">
            Fortnight:
          </label>
          <select
            id="lunar-festival-paksha-filter"
            aria-label="Filter by fortnight"
            value={pakshaFilter}
            onChange={(e) => setPakshaFilter(e.target.value)}
            className="rounded-xl border border-white/15 bg-black/60 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-gold"
          >
            <option value="all">All Pakshas</option>
            <option value="Shukla">Shukla (Waxing)</option>
            <option value="Krishna">Krishna (Waning)</option>
          </select>
        </div>

        {/* Tradition Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <label htmlFor="lunar-festival-tradition-filter" className="text-muted-foreground">
            Tradition:
          </label>
          <select
            id="lunar-festival-tradition-filter"
            aria-label="Filter by tradition"
            value={traditionFilter}
            onChange={(e) => setTraditionFilter(e.target.value)}
            className="rounded-xl border border-white/15 bg-black/60 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-gold"
          >
            {TRADITION_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Traditions" : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Festival Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {festivals.map((festival) => (
          <div
            key={festival.id}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-5 transition-all duration-200 hover:border-gold/40 hover:bg-black/60"
          >
            <div className="space-y-3">
              {/* Header Badge Row */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold text-gold-light border border-gold/20">
                  {festival.lunarMonth} {festival.paksha} {festival.tithi}
                </span>

                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">
                  {festival.timingKala}
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className="font-serif text-lg font-bold text-white">{festival.name}</h3>
                <p className="font-deva text-xs text-gold-soft">
                  {festival.nameHindi} • {festival.nameSanskrit}
                </p>
              </div>

              {/* Description */}
              <p className="line-clamp-2 text-xs leading-relaxed text-slate-300">
                {festival.description}
              </p>

              {/* Astronomical Significance Callout */}
              <div className="rounded-xl border border-white/5 bg-white/5 p-2 text-[11px] text-slate-400">
                <strong className="text-slate-200">Astro Rule: </strong>
                {festival.astronomicalSignificance}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => onSelectFestival(festival)}
                className="text-xs font-semibold text-slate-300 hover:text-white"
              >
                View Lore & Rules
              </button>

              <button
                type="button"
                onClick={() => onJumpToFestival(festival)}
                className="flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
              >
                <span>Jump Moon</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Festival Detail Modal */}
      {selectedFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gold/40 bg-midnight p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => onSelectFestival(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Close festival details"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-5">
              {/* Modal Header */}
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-light">
                    {selectedFestival.lunarMonth} {selectedFestival.paksha} {selectedFestival.tithi}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                    {selectedFestival.tradition}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
                  {selectedFestival.name}
                </h3>
                <p className="font-deva text-base text-gold-soft">
                  {selectedFestival.nameHindi} • {selectedFestival.nameSanskrit}
                </p>
              </div>

              {/* Timing Kala & Precision Requirements */}
              <div className="rounded-2xl border border-gold/20 bg-gold/5 p-4 text-xs">
                <div className="flex items-center gap-2 font-semibold text-gold-light">
                  <Clock className="h-4 w-4" />
                  <span>
                    Optimal Astronomical Observance Window: {selectedFestival.timingKala} (
                    {selectedFestival.timingKalaSanskrit})
                  </span>
                </div>
                <p className="mt-1 text-slate-300">
                  Calculated against the local solar noon, midnight, or sunrise according to
                  classical Dharma Shastra rules.
                </p>
              </div>

              {/* Cultural Significance */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                  Cultural & Puranic Heritage
                </span>
                <p className="leading-relaxed text-slate-200">
                  {selectedFestival.culturalSignificance}
                </p>
              </div>

              {/* Astronomical Alignment */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                  Astronomical Alignment
                </span>
                <p className="leading-relaxed text-slate-200">
                  {selectedFestival.astronomicalSignificance}
                </p>
              </div>

              {/* Ritual Practices Checklist */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                  Traditional Ritual Practices
                </span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {selectedFestival.ritualPractices.map((practice) => (
                    <div
                      key={practice}
                      className="flex items-center gap-2 rounded-xl bg-white/5 p-2.5"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-gold" />
                      <span className="text-slate-200">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer CTAs */}
              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => onSelectFestival(null)}
                  className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onJumpToFestival(selectedFestival);
                    onSelectFestival(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/20 px-4 py-2 text-xs font-semibold text-gold-light hover:bg-gold/30"
                >
                  <Compass className="h-4 w-4" />
                  <span>Jump Moon & Date to {selectedFestival.name.split("/")[0]}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
