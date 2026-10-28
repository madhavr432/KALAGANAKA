/**
 * components/TithiExplorer.tsx
 * Section E: Interactive 30-Tithi Explorer.
 * Features:
 * 1. Shukla & Krishna Paksha tabbed / side-by-side progression.
 * 2. 5 classical categories (Nanda, Bhadra, Jaya, Rikta, Poorna).
 * 3. Deep dive into selected Tithi (ruling deity, degree range, ritual practices).
 * 4. Educational breakdown of Tithi duration variability (19 to 26 hours, Kepler's 2nd Law).
 * 5. Jump 3D Moon to selected Tithi.
 */

import React, { useState } from "react";
import { ALL_TITHIS } from "../constants/lunarConstants";
import type { TithiDefinition } from "../types/lunarCalendar";
import { Sparkles, Compass, CheckCircle2, AlertCircle, ArrowRight, BookOpen } from "lucide-react";

interface TithiExplorerProps {
  selectedTithiIndex: number;
  onSelectTithiIndex: (index: number) => void;
  onJumpToPhase: (elongationDeg: number) => void;
  onOpenInfo: (key: string) => void;
}

export function TithiExplorer({
  selectedTithiIndex,
  onSelectTithiIndex,
  onJumpToPhase,
  onOpenInfo,
}: TithiExplorerProps) {
  const [activePakshaTab, setActivePakshaTab] = useState<"Shukla" | "Krishna">("Shukla");

  const selectedTithi: TithiDefinition =
    ALL_TITHIS.find((t) => t.index === selectedTithiIndex) ?? ALL_TITHIS[0];

  const shuklaTithis = ALL_TITHIS.slice(0, 15);
  const krishnaTithis = ALL_TITHIS.slice(15, 30);

  const displayedTithis = activePakshaTab === "Shukla" ? shuklaTithis : krishnaTithis;

  const handleJumpToTithi = (tithi: TithiDefinition) => {
    onSelectTithiIndex(tithi.index);
    // Midpoint of Tithi elongation
    const midElong = (tithi.startElongationDeg + tithi.endElongationDeg) / 2;
    onJumpToPhase(midElong);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-gold/25 bg-midnight-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              30 Tithi Progression Explorer
            </h2>
            <button
              type="button"
              onClick={() => onOpenInfo("tithi")}
              className="text-xs text-gold hover:underline"
              aria-label="Tithi calculation formula"
            >
              ⓘ Formula
            </button>
          </div>
          <p className="mt-1 font-deva text-sm text-gold-soft">
            त्रिंशत् तिथयः — शुक्लपक्षे पञ्चदश, कृष्णपक्षे पञ्चदश
          </p>
        </div>

        {/* Paksha Switcher Tabs */}
        <div className="flex items-center rounded-2xl border border-white/15 bg-black/60 p-1">
          <button
            type="button"
            onClick={() => setActivePakshaTab("Shukla")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activePakshaTab === "Shukla"
                ? "bg-gold/30 text-gold-light shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Shukla Paksha (शुक्ल 1–15)
          </button>
          <button
            type="button"
            onClick={() => setActivePakshaTab("Krishna")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activePakshaTab === "Krishna"
                ? "bg-silver/30 text-silver shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Krishna Paksha (कृष्ण 16–30)
          </button>
        </div>
      </div>

      {/* Main Grid: Tithi Selector Buttons + Detail Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Tithi Grid (15 buttons) */}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:col-span-7">
          {displayedTithis.map((t) => {
            const isSelected = t.index === selectedTithiIndex;

            return (
              <button
                key={t.index}
                type="button"
                onClick={() => onSelectTithiIndex(t.index)}
                className={`flex flex-col items-start justify-between rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-gold bg-gradient-to-b from-gold/20 to-black/80 shadow-lg shadow-gold/15"
                    : "border-white/10 bg-black/40 hover:border-gold/30 hover:bg-black/60"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    #{t.tithiInPaksha}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-semibold ${
                      t.category === "Nanda"
                        ? "bg-emerald-950/60 text-emerald-300"
                        : t.category === "Bhadra"
                          ? "bg-blue-950/60 text-blue-300"
                          : t.category === "Jaya"
                            ? "bg-purple-950/60 text-purple-300"
                            : t.category === "Rikta"
                              ? "bg-rose-950/60 text-rose-300"
                              : "bg-amber-950/60 text-amber-300"
                    }`}
                  >
                    {t.category}
                  </span>
                </div>

                <div className="mt-2">
                  <strong className="block text-xs text-white">{t.nameEnglish}</strong>
                  <span className="font-deva text-[11px] text-gold-soft">{t.nameSanskrit}</span>
                </div>

                <span className="mt-1 font-mono text-[10px] text-slate-400">
                  {t.startElongationDeg}°–{t.endElongationDeg}°
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Tithi Detail Card */}
        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-gold/30 bg-black/50 p-6 lg:col-span-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-soft">
                  Tithi #{selectedTithi.index} • {selectedTithi.paksha} Paksha #
                  {selectedTithi.tithiInPaksha}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {selectedTithi.nameEnglish}
                </h3>
                <p className="font-deva text-base text-gold-soft">
                  {selectedTithi.nameSanskrit} ({selectedTithi.nameHindi})
                </p>
              </div>

              <div className="text-right">
                <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-light">
                  {selectedTithi.category}
                </span>
              </div>
            </div>

            {/* Core Tithi Attributes */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between rounded-lg bg-white/5 p-2.5">
                <span className="text-slate-400">Angular Separation Span:</span>
                <span className="font-mono font-semibold text-gold-light">
                  {selectedTithi.startElongationDeg}° to {selectedTithi.endElongationDeg}°
                </span>
              </div>

              <div className="flex justify-between rounded-lg bg-white/5 p-2.5">
                <span className="text-slate-400">Presiding Divinity (Devata):</span>
                <span className="font-medium text-white">
                  {selectedTithi.rulingDeity} ({selectedTithi.rulingDeitySanskrit})
                </span>
              </div>

              <div className="flex justify-between rounded-lg bg-white/5 p-2.5">
                <span className="text-slate-400">Category Archetype:</span>
                <span className="font-medium text-slate-200">{selectedTithi.categoryMeaning}</span>
              </div>
            </div>

            {/* Ritual Significance */}
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-slate-300">Ritual & Cultural Significance:</span>
              <p className="leading-relaxed text-slate-300">{selectedTithi.ritualSignificance}</p>
            </div>

            {/* Auspicious Activities */}
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-slate-300">Traditionally Favorable For:</span>
              <ul className="list-inside list-disc space-y-1 text-slate-300">
                {selectedTithi.auspiciousActivities.map((act) => (
                  <li key={act}>{act}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Jump Moon Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleJumpToTithi(selectedTithi)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/20 py-2.5 text-xs font-semibold text-gold-light transition-all hover:bg-gold/30"
            >
              <Compass className="h-4 w-4" />
              <span>
                Jump 3D Moon to {selectedTithi.nameEnglish} (θ = {selectedTithi.startElongationDeg}
                °)
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Educational Deep Dive: Tithi Duration Variability */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <BookOpen className="h-4 w-4 text-gold-soft" />
          <h3 className="font-serif text-lg font-bold text-white">
            Why Do Tithis Vary Between 19 and 26 Hours?
          </h3>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-4 text-xs leading-relaxed text-slate-300 md:grid-cols-3">
          <div className="space-y-1.5 rounded-xl bg-white/5 p-3">
            <strong className="block text-gold-light">1. Keplerian Orbital Eccentricity</strong>
            <p>
              The Moon orbits Earth in an elliptical orbit (eccentricity <em>e</em> ≈ 0.0549). At
              perigee (closest), the Moon races at <strong>15.3° per day</strong>. At apogee
              (farthest), it slows down to <strong>11.8° per day</strong>.
            </p>
          </div>

          <div className="space-y-1.5 rounded-xl bg-white/5 p-3">
            <strong className="block text-gold-light">2. Differential Solar Motion</strong>
            <p>
              The Earth also moves around the Sun in an ellipse, changing apparent solar motion
              between <strong>0.95°/day</strong> in July and <strong>1.02°/day</strong> in January.
              Because a Tithi measures relative separation (Δ = λ_M - λ_S), their speeds compound.
            </p>
          </div>

          <div className="space-y-1.5 rounded-xl bg-white/5 p-3">
            <strong className="block text-gold-light">3. Kshaya & Vriddhi Tithis</strong>
            <p>
              A Tithi spanning 19 hours can begin after sunrise and end before the next sunrise,
              resulting in a <strong>Kshaya Tithi</strong> (omitted in civil calendar). A long
              26-hour Tithi spanning two consecutive sunrises becomes a{" "}
              <strong>Vriddhi Tithi</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
