/**
 * components/LunarCalculationInfoModal.tsx
 * Section J: Accessible Calculation Explanatory Modals for "ⓘ" buttons.
 * Displays mathematical formulas, rigorous scientific definitions, classical citations,
 * and modern astronomical ephemeris standards.
 */

import React, { useEffect } from "react";
import { X, BookOpen, Calculator, Compass, Scale, CheckCircle } from "lucide-react";
import { LUNAR_CALCULATION_METRICS } from "../constants/lunarConstants";
import type { LunarCalculationMetric } from "../types/lunarCalendar";

interface LunarCalculationInfoModalProps {
  activeMetricKey: string | null;
  onClose: () => void;
}

export function LunarCalculationInfoModal({
  activeMetricKey,
  onClose,
}: LunarCalculationInfoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (activeMetricKey) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMetricKey, onClose]);

  if (!activeMetricKey) return null;

  const metric: LunarCalculationMetric | undefined =
    LUNAR_CALCULATION_METRICS.find((m) => m.id === activeMetricKey) ?? LUNAR_CALCULATION_METRICS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gold/40 bg-midnight p-6 shadow-2xl sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          aria-label="Close calculation explanation modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-light">
              <Calculator className="h-3.5 w-3.5" />
              <span>Astronomical Formulation</span>
            </div>
            <h3 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
              {metric.title}
            </h3>
            <p className="font-deva text-base text-gold-soft">{metric.titleSanskrit}</p>
          </div>

          {/* Formula Display Box */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mathematical Reduction Formula
            </span>
            <div className="overflow-x-auto rounded-2xl border border-gold/30 bg-black/60 p-4 font-mono text-sm font-semibold text-gold-light">
              {metric.formulaLatex}
            </div>
          </div>

          {/* Formal Definition */}
          <div className="space-y-1.5 text-xs">
            <span className="font-semibold uppercase tracking-wider text-muted-foreground">
              Scientific Definition
            </span>
            <p className="leading-relaxed text-slate-200">{metric.definition}</p>
          </div>

          {/* Astronomical Significance */}
          <div className="space-y-1.5 text-xs">
            <span className="font-semibold uppercase tracking-wider text-muted-foreground">
              Physical & Astronomical Significance
            </span>
            <p className="leading-relaxed text-slate-300">{metric.astronomicalSignificance}</p>
          </div>

          {/* Units */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
            <span className="text-muted-foreground">Measurement Units: </span>
            <strong className="text-white">{metric.units}</strong>
          </div>

          {/* Dual Classical & Modern Citations */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1 rounded-2xl border border-gold/20 bg-gold/5 p-3.5 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-gold-light">
                <BookOpen className="h-3.5 w-3.5" /> Classical Siddhantic Source
              </span>
              <p className="text-slate-300">{metric.classicalReference}</p>
            </div>

            <div className="space-y-1 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Compass className="h-3.5 w-3.5 text-silver" /> Modern Ephemeris Citation
              </span>
              <p className="text-slate-300">{metric.modernReference}</p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gold/40 bg-gold/20 px-5 py-2 text-xs font-semibold text-gold-light hover:bg-gold/30"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
