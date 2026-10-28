/**
 * components/NakshatraExplorer.tsx
 * Section F: The 27 Nakshatras (Lunar Mansions) Interactive Explorer.
 * Explores the sidereal zodiac divisions of 13° 20', ruling Devatas, planetary lords,
 * sacred symbols, Western astronomical anchor stars (Yogataras), and 4 Padas.
 */

import React, { useState } from "react";
import { ALL_NAKSHATRAS } from "../constants/lunarConstants";
import type { NakshatraDefinition } from "../types/lunarCalendar";
import { Sparkles, Star, Compass, ArrowRight, BookOpen } from "lucide-react";

interface NakshatraExplorerProps {
  selectedNakshatraIndex: number;
  onSelectNakshatraIndex: (index: number) => void;
  onJumpToPhase: (elongationDeg: number) => void;
  onOpenInfo: (key: string) => void;
}

export function NakshatraExplorer({
  selectedNakshatraIndex,
  onSelectNakshatraIndex,
  onJumpToPhase,
  onOpenInfo,
}: NakshatraExplorerProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const selectedNakshatra: NakshatraDefinition =
    ALL_NAKSHATRAS.find((n) => n.index === selectedNakshatraIndex) ?? ALL_NAKSHATRAS[0];

  const filteredNakshatras = ALL_NAKSHATRAS.filter((n) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      n.nameEnglish.toLowerCase().includes(q) ||
      n.nameHindi.toLowerCase().includes(q) ||
      n.rulingDeity.toLowerCase().includes(q) ||
      n.planetaryLord.toLowerCase().includes(q) ||
      n.yogataraWesternName.toLowerCase().includes(q)
    );
  });

  return (
    <section className="space-y-6 rounded-3xl border border-silver/25 bg-midnight-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-silver animate-pulse" />
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              The 27 Sidereal Nakshatras
            </h2>
            <button
              type="button"
              onClick={() => onOpenInfo("nakshatra")}
              className="text-xs text-gold hover:underline"
              aria-label="Nakshatra calculation formula"
            >
              ⓘ Formula
            </button>
          </div>
          <p className="mt-1 font-deva text-sm text-silver">
            सप्तविंशति नक्षत्राणि — १३° २०' प्रति नक्षत्रम्
          </p>
        </div>

        {/* Search Filter */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search star, deity, graha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-silver"
          />
        </div>
      </div>

      {/* Main Layout: Nakshatra Grid & Selected Nakshatra Detail */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Scrollable Grid of 27 Nakshatras */}
        <div className="max-h-[460px] overflow-y-auto pr-1 sm:pr-2 lg:col-span-7">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {filteredNakshatras.map((n) => {
              const isSelected = n.index === selectedNakshatraIndex;

              return (
                <button
                  key={n.index}
                  type="button"
                  onClick={() => onSelectNakshatraIndex(n.index)}
                  className={`flex flex-col items-start justify-between rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-silver bg-gradient-to-b from-silver/20 to-black/80 shadow-lg shadow-silver/10"
                      : "border-white/10 bg-black/40 hover:border-silver/40 hover:bg-black/60"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">#{n.index}</span>
                    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-silver">
                      {n.planetaryLord.split(" ")[0]}
                    </span>
                  </div>

                  <div className="mt-2">
                    <strong className="block text-xs text-white">{n.nameEnglish}</strong>
                    <span className="font-deva text-[11px] text-silver">{n.nameSanskrit}</span>
                  </div>

                  <div className="mt-1 text-[10px] text-slate-400">
                    {n.startDeg.toFixed(1)}°–{n.endDeg.toFixed(1)}°
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Nakshatra Detail Card */}
        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-silver/30 bg-black/50 p-6 lg:col-span-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-silver">
                  Nakshatra #{selectedNakshatra.index} of 27
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {selectedNakshatra.nameEnglish}
                </h3>
                <p className="font-deva text-base text-silver">
                  {selectedNakshatra.nameSanskrit} ({selectedNakshatra.nameHindi})
                </p>
              </div>

              <div className="text-right">
                <span className="rounded-full border border-silver/30 bg-silver/10 px-3 py-1 text-xs font-semibold text-silver">
                  {selectedNakshatra.symbol}
                </span>
              </div>
            </div>

            {/* Core Attributes */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between rounded-lg bg-white/5 p-2.5">
                <span className="text-slate-400">Sidereal Ecliptic Span:</span>
                <span className="font-mono font-semibold text-silver">
                  {selectedNakshatra.startDeg.toFixed(2)}° to {selectedNakshatra.endDeg.toFixed(2)}°
                  (13°20')
                </span>
              </div>

              <div className="flex justify-between rounded-lg bg-white/5 p-2.5">
                <span className="text-slate-400">Western Yogatara Star:</span>
                <span className="font-mono font-semibold text-white">
                  {selectedNakshatra.yogataraWesternName} ({selectedNakshatra.yogataraBayer})
                </span>
              </div>

              <div className="flex justify-between rounded-lg bg-white/5 p-2.5">
                <span className="text-slate-400">Presiding Divinity (Devata):</span>
                <span className="font-medium text-white">
                  {selectedNakshatra.rulingDeity} ({selectedNakshatra.rulingDeitySanskrit})
                </span>
              </div>

              <div className="flex justify-between rounded-lg bg-white/5 p-2.5">
                <span className="text-slate-400">Vimshottari Dasha Lord:</span>
                <span className="font-medium text-gold-light">
                  {selectedNakshatra.planetaryLord} ({selectedNakshatra.planetaryLordSanskrit})
                </span>
              </div>

              <div className="flex justify-between rounded-lg bg-white/5 p-2.5">
                <span className="text-slate-400">Symbolic Archetype:</span>
                <span className="font-medium text-slate-200">
                  {selectedNakshatra.symbolMeaning}
                </span>
              </div>
            </div>

            {/* Four Padas */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300">
                Four Quarters (4 Padas of 3°20' each):
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                {[1, 2, 3, 4].map((pada) => (
                  <div key={pada} className="rounded-lg border border-white/10 bg-white/5 py-1.5">
                    <span className="block font-semibold text-silver">Pada {pada}</span>
                    <span className="font-mono text-slate-400">
                      {(selectedNakshatra.startDeg + (pada - 1) * 3.333).toFixed(1)}°
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Characteristics */}
            <div className="space-y-1 text-xs text-slate-300">
              <span className="font-semibold text-slate-200">Cosmic Temperament:</span>
              <p className="leading-relaxed text-slate-300">{selectedNakshatra.characteristics}</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/5 p-2.5 text-[11px] text-slate-400">
            Anchor Star:{" "}
            <strong className="text-white">{selectedNakshatra.yogataraWesternName}</strong> serves
            as the astronomical Yogatara calibrating the Lahiri sidereal frame.
          </div>
        </div>
      </div>
    </section>
  );
}
