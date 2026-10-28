/**
 * Calculation Information Definitions and Interactive Modal.
 * Implements the ⓘ information system explaining how astronomical values
 * are computed, their plain-language meanings, mathematical formulas, steps,
 * units, assumptions, and scientific citations.
 */

import React from "react";
import { SolarCalculatedData } from "../types/timekeeping";
import { CALCULATION_METRICS } from "../constants/timekeepingConstants";
import { X, Info, BookOpen, Layers, AlertTriangle } from "lucide-react";

interface CalculationInfoModalProps {
  metricKey: string | null;
  onClose: () => void;
  solarData: SolarCalculatedData;
}

export function CalculationInfoModal({ metricKey, onClose, solarData }: CalculationInfoModalProps) {
  if (!metricKey) return null;
  const metric = CALCULATION_METRICS[metricKey] || CALCULATION_METRICS.altitude;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gold/40 bg-background/95 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gold/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg border border-gold/30 bg-gold/10 p-2 text-gold">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-deva text-xl text-gold-gradient">{metric.title}</h3>
              <p className="font-sans text-xs text-muted-foreground">
                Scientific & Traditional Mathematical Methodology
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gold/20 p-1.5 text-gold-soft hover:bg-gold/10 hover:text-gold transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5 text-left text-xs leading-relaxed">
          {/* Plain Language Summary */}
          <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
            <h4 className="flex items-center gap-1.5 font-sans font-semibold text-gold text-xs uppercase tracking-wider mb-1.5">
              <Info className="h-3.5 w-3.5" />
              <span>Beginner-Friendly Explanation</span>
            </h4>
            <p className="text-foreground/90 font-serif text-sm sm:text-base leading-relaxed">
              {metric.plainSummary}
            </p>
          </div>

          {/* Mathematical Formula */}
          <div>
            <h4 className="font-sans font-semibold text-gold-soft uppercase tracking-wider text-[11px] mb-1.5">
              Governing Mathematical Formula
            </h4>
            <div className="rounded-lg border border-gold/20 bg-background/80 p-3 font-mono text-xs text-amber-200 overflow-x-auto shadow-inner">
              <code>{metric.formula}</code>
            </div>
          </div>

          {/* Derivation Steps */}
          <div>
            <h4 className="flex items-center gap-1.5 font-sans font-semibold text-gold-soft uppercase tracking-wider text-[11px] mb-2">
              <Layers className="h-3.5 w-3.5 text-gold" />
              <span>Calculation Steps</span>
            </h4>
            <ul className="space-y-1.5 font-sans text-muted-foreground pl-1">
              {metric.steps.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Units and Assumptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded-lg border border-gold/15 bg-background/60 p-3">
              <span className="block font-semibold text-gold-soft text-[11px] uppercase tracking-wider mb-1">
                Standard Units
              </span>
              <p className="font-mono text-muted-foreground">{metric.units}</p>
            </div>

            <div className="rounded-lg border border-gold/15 bg-background/60 p-3">
              <span className="block font-semibold text-gold-soft text-[11px] uppercase tracking-wider mb-1">
                Source & Authority
              </span>
              <p className="text-muted-foreground text-[11px]">{metric.source}</p>
            </div>
          </div>

          {/* Assumptions & Limitations */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <h4 className="flex items-center gap-1.5 font-semibold text-amber-300 text-[11px] uppercase tracking-wider mb-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Assumptions & Known Limitations</span>
            </h4>
            <ul className="space-y-1 text-muted-foreground text-[11px]">
              {metric.assumptions.map((a, i) => (
                <li key={`a-${i}`}>• {a}</li>
              ))}
              {metric.limitations.map((l, i) => (
                <li key={`l-${i}`}>• {l}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-gold/15 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gold-gradient px-4 py-2 font-sans text-xs font-bold text-slate-950 shadow-md hover:opacity-90"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
}

export function InfoButton({
  metricKey,
  onOpenInfo,
}: {
  metricKey: string;
  onOpenInfo: (key: string) => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onOpenInfo(metricKey);
      }}
      className="inline-flex items-center justify-center rounded-full p-1 text-gold/70 hover:bg-gold/15 hover:text-gold transition-colors focus:outline-none focus:ring-1 focus:ring-gold"
      title="Understand how this value is calculated"
      aria-label={`Calculation details for ${metricKey}`}
    >
      <Info className="h-3.5 w-3.5" />
    </button>
  );
}
