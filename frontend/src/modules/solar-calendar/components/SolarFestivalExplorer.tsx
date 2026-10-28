/**
 * SolarFestivalExplorer.tsx
 * Dedicated discovery section for Indian Solar Festivals and New Year traditions.
 * Includes search, multi-filter pills, responsive cards, and comprehensive detail modal
 * with "Jump to Festival Date" simulation sync.
 */

import React, { useState, useMemo } from "react";
import {
  Flame,
  Search,
  Filter,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  X,
  Info,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  SolarFestivalItem,
  FestivalRegion,
  FestivalCategory,
  FestivalTradition,
} from "../types/solarCalendar";

interface SolarFestivalExplorerProps {
  festivals: SolarFestivalItem[];
  selectedFestival: SolarFestivalItem | null;
  onSelectFestival: (festival: SolarFestivalItem | null) => void;
  onJumpToFestival: (festival: SolarFestivalItem) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  regionFilter: FestivalRegion | "All";
  onRegionChange: (region: FestivalRegion | "All") => void;
  categoryFilter: FestivalCategory | "All";
  onCategoryChange: (category: FestivalCategory | "All") => void;
  traditionFilter: FestivalTradition | "All";
  onTraditionChange: (tradition: FestivalTradition | "All") => void;
  onOpenInfo: (key: string) => void;
}

export function SolarFestivalExplorer({
  festivals,
  selectedFestival,
  onSelectFestival,
  onJumpToFestival,
  searchQuery,
  onSearchChange,
  regionFilter,
  onRegionChange,
  categoryFilter,
  onCategoryChange,
  traditionFilter,
  onTraditionChange,
  onOpenInfo,
}: SolarFestivalExplorerProps) {
  // Filtered festivals list
  const filteredFestivals = useMemo(() => {
    return festivals.filter((f) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName =
          f.name.toLowerCase().includes(q) ||
          f.sanskritName.toLowerCase().includes(q) ||
          f.regionalName.toLowerCase().includes(q);
        const matchesDesc =
          f.culturalSignificance.toLowerCase().includes(q) ||
          f.astronomicalBasis.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      // Region filter
      if (regionFilter !== "All" && f.region !== regionFilter && f.region !== "All India") {
        return false;
      }

      // Category filter
      if (categoryFilter !== "All" && f.category !== categoryFilter) {
        return false;
      }

      // Tradition filter
      if (traditionFilter !== "All" && f.tradition !== traditionFilter) {
        return false;
      }

      return true;
    });
  }, [festivals, searchQuery, regionFilter, categoryFilter, traditionFilter]);

  const REGIONS: (FestivalRegion | "All")[] = ["All", "All India", "North", "South", "East"];
  const CATEGORIES: (FestivalCategory | "All")[] = [
    "All",
    "Sankranti Ingress",
    "Solar New Year",
    "Harvest / Seasonal",
    "Solar Reverence",
  ];

  return (
    <section className="w-full space-y-6 rounded-2xl border border-gold/25 bg-background/85 p-5 shadow-2xl backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-400" />
            <h3 className="font-deva text-xl text-gold-gradient sm:text-2xl">
              सौर पर्व एवं प्रादेशिक नववर्ष (Indian Solar Festivals & Regional New Years)
            </h3>
          </div>
          <p className="font-sans text-xs text-muted-foreground mt-0.5">
            Discover the astronomical ingress rules and regional cultural observances across India
          </p>
        </div>

        {/* Info on Makar Sankranti vs Solstice */}
        <button
          type="button"
          onClick={() => onOpenInfo("makarPrecession")}
          className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs font-sans text-gold-soft hover:bg-gold/15 hover:text-gold transition-colors"
        >
          <Info className="h-3.5 w-3.5" />
          <span>Why Makar Sankranti ≠ Winter Solstice</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-soft/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search solar festivals (e.g. 'Pongal', 'Vishu', 'Makar Sankranti', 'Chhath')..."
              className="w-full rounded-xl border border-gold/25 bg-[#090e18] pl-9 pr-4 py-2 text-xs text-amber-100 placeholder:text-muted-foreground focus:border-gold focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Region Pills */}
          <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRegionChange(r)}
                className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
                  regionFilter === r
                    ? "bg-gold/25 text-amber-200 font-semibold border border-gold/40 shadow-sm"
                    : "bg-[#0c1322] text-slate-300 border border-gold/15 hover:text-amber-100"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-muted-foreground mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            <span>Category:</span>
          </span>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCategoryChange(c)}
              className={`rounded-lg px-2.5 py-0.5 text-[11px] transition-colors ${
                categoryFilter === c
                  ? "bg-amber-500/25 text-amber-200 font-semibold border border-amber-400/50"
                  : "bg-[#0b1220] text-slate-400 border border-gold/10 hover:text-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Festivals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFestivals.map((festival) => (
          <div
            key={festival.id}
            onClick={() => onSelectFestival(festival)}
            className="group flex flex-col justify-between rounded-xl border border-gold/20 bg-[#080d17]/90 p-4 transition-all hover:border-gold/50 hover:bg-[#0c1424] hover:shadow-xl cursor-pointer"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-deva text-lg font-bold text-gold group-hover:text-amber-200 transition-colors">
                    {festival.name}
                  </h4>
                  <span className="font-deva text-xs text-gold-soft block mt-0.5">
                    {festival.sanskritName} • {festival.regionalName}
                  </span>
                </div>
                <span className="rounded-full bg-gold/10 border border-gold/30 px-2 py-0.5 text-[10px] font-mono text-amber-300 shrink-0">
                  {festival.region}
                </span>
              </div>

              {/* Target / Ingress Badge */}
              <div className="mt-3 rounded-lg border border-gold/15 bg-background/50 p-2 font-mono text-[11px] text-amber-200">
                <span className="text-muted-foreground block text-[9px] uppercase tracking-wider font-sans">
                  Astronomical Target:
                </span>
                <span>{festival.solarTarget}</span>
              </div>

              {/* Cultural Summary */}
              <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {festival.culturalSignificance}
              </p>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-gold/15 flex items-center justify-between text-xs">
              <span className="font-mono text-gold-soft text-[11px] flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gold" />
                <span>{festival.approximateGregorian}</span>
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onJumpToFestival(festival);
                }}
                className="flex items-center gap-1 rounded-lg bg-gold/15 border border-gold/30 px-2.5 py-1 text-[11px] font-sans font-medium text-amber-200 hover:bg-gold/25 hover:text-amber-100 transition-colors"
                title="Synchronize 3D Earth orbit to this festival"
              >
                <span>Jump Orbit</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        {filteredFestivals.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <Flame className="mx-auto h-8 w-8 text-gold/30 mb-2" />
            <p className="font-sans text-sm">No solar festivals match the selected filters.</p>
            <button
              onClick={() => {
                onSearchChange("");
                onRegionChange("All");
                onCategoryChange("All");
                onTraditionChange("All");
              }}
              className="mt-2 text-xs text-gold underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Festival Detail Modal */}
      {selectedFestival && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => onSelectFestival(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gold/40 bg-[#090e18] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gold/20 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gold/15 border border-gold/30 px-2.5 py-0.5 text-xs font-mono text-amber-300">
                    {selectedFestival.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    Region: {selectedFestival.region}
                  </span>
                </div>
                <h3 className="font-deva text-2xl text-gold-gradient mt-1">
                  {selectedFestival.name}
                </h3>
                <p className="font-deva text-xs text-gold-soft">
                  {selectedFestival.sanskritName} • {selectedFestival.regionalName}
                </p>
              </div>

              <button
                onClick={() => onSelectFestival(null)}
                className="rounded-full border border-gold/20 p-1.5 text-gold-soft hover:bg-gold/10 hover:text-gold transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="mt-5 space-y-4 text-left text-xs leading-relaxed">
              {/* Astronomical Foundation */}
              <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
                <span className="flex items-center gap-1.5 font-semibold text-gold text-xs uppercase tracking-wider mb-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  <span>Astronomical Foundation (खगोलीय आधार)</span>
                </span>
                <p className="font-mono text-xs text-amber-200">
                  Target: {selectedFestival.solarTarget}
                </p>
                <p className="text-foreground/90 mt-1 leading-relaxed">
                  {selectedFestival.astronomicalBasis}
                </p>
              </div>

              {/* Cultural Significance */}
              <div className="rounded-xl border border-gold/15 bg-[#0c1424] p-4">
                <span className="flex items-center gap-1.5 font-semibold text-gold-soft text-xs uppercase tracking-wider mb-1.5">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  <span>Cultural & Heritage Traditions</span>
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedFestival.culturalSignificance}
                </p>
              </div>

              {/* Observance Calculation Rule */}
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                <span className="flex items-center gap-1.5 font-semibold text-sky-300 text-xs uppercase tracking-wider mb-1.5">
                  <Clock className="h-3.5 w-3.5 text-sky-400" />
                  <span>Calendar Ingress & Observance Convention</span>
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedFestival.observanceRule}
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gold/15 pt-4">
              <span className="font-mono text-xs text-muted-foreground">
                Typical Observance: {selectedFestival.approximateGregorian}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onJumpToFestival(selectedFestival);
                    onSelectFestival(null);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-gold-gradient px-4 py-2 font-sans text-xs font-bold text-slate-950 shadow-md hover:opacity-95 transition-opacity"
                >
                  <span>Jump 3D Orbit to This Festival</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFestival(null)}
                  className="rounded-lg border border-gold/25 bg-[#0c1322] px-4 py-2 text-xs font-medium text-slate-200 hover:text-amber-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
