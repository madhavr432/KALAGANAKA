/**
 * components/SideBySideComparison.tsx
 * Section 6: Side-by-Side Comparative Matrix.
 * Direct multi-criteria evaluation of Ancient Indian vs Modern Scientific instruments,
 * demonstrating evolution across principle, inputs, precision, units, strengths, and limits.
 */

import React, { useState } from "react";
import {
  Columns,
  Sparkles,
  ArrowRightLeft,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import type { InstrumentSideBySideComparison } from "../types/astronomyLab";

interface SideBySideComparisonProps {
  comparisons: InstrumentSideBySideComparison[];
}

export function SideBySideComparison({ comparisons }: SideBySideComparisonProps) {
  const [selectedId, setSelectedId] = useState<string>(
    comparisons[0]?.id || "sundial-vs-atomic-clock",
  );

  const activeComparison = comparisons.find((c) => c.id === selectedId) || comparisons[0];

  if (!activeComparison) return null;

  return (
    <section className="space-y-6 rounded-3xl border border-gold/25 bg-midnight-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2">
          <Columns className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Side-by-Side Instrument Matrix
          </h2>
        </div>
        <p className="mt-1 font-deva text-sm text-gold-soft">
          प्राचीन एवं आधुनिक यन्त्र तुलना सारणी — सिद्धान्त, यथार्थता एवं मापन इकाइयाँ
        </p>
        <p className="mt-1 text-xs text-slate-300">
          Direct comparative analysis between classical Indian astronomical instruments and modern
          scientific apparatus across physical principles, inputs, precision, and physical limits.
        </p>
      </div>

      {/* Comparison Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {comparisons.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedId(c.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all ${
              selectedId === c.id
                ? "border border-gold bg-gold/20 text-white shadow-lg shadow-gold/15"
                : "border border-white/10 bg-black/40 text-slate-300 hover:border-gold/30 hover:bg-black/60 hover:text-white"
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-gold" />
            <span>{c.title}</span>
          </button>
        ))}
      </div>

      {/* Conceptual Bridge Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-black/50 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/20 p-2 text-indigo-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Conceptual Bridge: Evolutionary Paradigm
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              {activeComparison.conceptualBridge}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Column Headers */}
      <div className="hidden grid-cols-2 gap-6 lg:grid">
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-300">
              Traditional Indian Instrument
            </h4>
          </div>
          <span className="font-deva text-xs text-amber-400">प्राचीन पद्धति</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/20 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
              Modern Scientific Apparatus
            </h4>
          </div>
          <span className="font-deva text-xs text-cyan-300">आधुनिक मानक</span>
        </div>
      </div>

      {/* Comparison Fields Rows */}
      <div className="space-y-4">
        {activeComparison.fields.map((field, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 transition-colors hover:border-white/20 sm:p-5"
          >
            {/* Field Label Header */}
            <div className="mb-3 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gold" />
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                {field.fieldLabel}
              </h5>
            </div>

            {/* Comparison Cards (2 cols on lg, stacked on mobile) */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Ancient Card */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-950/15 p-3.5">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-amber-400 lg:hidden">
                  Traditional:
                </span>
                <p className="text-xs leading-relaxed text-slate-200">{field.ancientText}</p>
              </div>

              {/* Modern Card */}
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/15 p-3.5">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-cyan-400 lg:hidden">
                  Modern:
                </span>
                <p className="text-xs leading-relaxed text-slate-200">{field.modernText}</p>
              </div>
            </div>

            {/* Scientific Commentary Bridge (if provided) */}
            {field.scientificCommentary && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-purple-500/20 bg-purple-950/20 px-3 py-2 text-[11px] text-purple-200">
                <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
                <span>
                  <strong>Scientific Insight:</strong> {field.scientificCommentary}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
