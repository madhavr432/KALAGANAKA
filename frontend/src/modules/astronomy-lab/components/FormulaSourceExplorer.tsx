/**
 * components/FormulaSourceExplorer.tsx
 * Section 3: Traditional Astronomy Formula & Source Explorer.
 * Features:
 * 1. Mathematical formula notation with variable definitions.
 * 2. Exact code implementation from repository.
 * 3. Verified historical and modern scholarly citations with external links.
 * 4. Coordinate frame, time convention, and assumption metadata.
 * 5. Expandable "How this formula works" step-by-step breakdown.
 */

import React, { useState } from "react";
import {
  BookOpen,
  Code2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Clock,
  Compass,
} from "lucide-react";
import type { TraditionalFormulaDefinition } from "../types/astronomyLab";

interface FormulaSourceExplorerProps {
  formulas: TraditionalFormulaDefinition[];
  selectedFormula: TraditionalFormulaDefinition;
  onSelectFormula: (id: string) => void;
}

export function FormulaSourceExplorer({
  formulas,
  selectedFormula,
  onSelectFormula,
}: FormulaSourceExplorerProps) {
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(true);
  const [showCodeSnippet, setShowCodeSnippet] = useState<boolean>(false);

  return (
    <section className="space-y-6 rounded-3xl border border-gold/25 bg-midnight-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Formula and Source Explorer
          </h2>
        </div>
        <p className="mt-1 font-deva text-sm text-gold-soft">
          प्रमाणित शास्त्रीय सूत्र, मूल ग्रन्थ सन्दर्भ एवं गणितीय विश्लेषण
        </p>
        <p className="mt-1 text-xs text-slate-300">
          Inspect the exact mathematical algorithms implemented in KalaGanaka with traceable
          historical provenance, variable dictionaries, and scholarly citations.
        </p>
      </div>

      {/* Formula Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {formulas.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelectFormula(f.id)}
            className={`rounded-2xl border px-3.5 py-2 text-xs font-semibold transition-all ${
              selectedFormula.id === f.id
                ? "border-gold bg-gold/20 text-gold-light shadow-md"
                : "border-white/10 bg-black/40 text-slate-300 hover:border-gold/30 hover:bg-black/60"
            }`}
          >
            <span>{f.name}</span>
          </button>
        ))}
      </div>

      {/* Main Detail Card */}
      <div className="space-y-6 rounded-2xl border border-gold/30 bg-black/50 p-6">
        {/* Title & Provenance Classification Badge */}
        <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-soft">
              {selectedFormula.category.replace("-", " ")}
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">{selectedFormula.name}</h3>
            <p className="font-deva text-base text-gold-soft">{selectedFormula.nameSanskrit}</p>
          </div>

          <div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                selectedFormula.provenance.sourceType === "explicit-historical-text"
                  ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                  : selectedFormula.provenance.sourceType === "modern-mathematical-interpretation"
                    ? "border-blue-500/40 bg-blue-950/40 text-blue-300"
                    : "border-amber-500/40 bg-amber-950/40 text-amber-300"
              }`}
            >
              {selectedFormula.provenance.sourceType === "explicit-historical-text"
                ? "✓ Explicit Historical Text"
                : selectedFormula.provenance.sourceType === "modern-mathematical-interpretation"
                  ? "⚛ Modern Mathematical Model"
                  : "⚙ Developer Implementation"}
            </span>
          </div>
        </div>

        {/* Mathematical Formula Box */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mathematical Equation
          </span>
          <div className="overflow-x-auto rounded-2xl border border-gold/30 bg-black/80 p-5 text-center font-mono text-base font-bold text-gold-light shadow-inner">
            {selectedFormula.formulaLatex}
          </div>
        </div>

        {/* Beginner Explanation */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-200">
          <strong className="block text-sm font-semibold text-white">
            Plain-Language Summary:
          </strong>
          <p className="mt-1">{selectedFormula.beginnerExplanation}</p>
        </div>

        {/* Expandable "How this formula works" */}
        <div className="rounded-2xl border border-white/10 bg-black/40">
          <button
            type="button"
            onClick={() => setShowHowItWorks((prev) => !prev)}
            className="flex w-full items-center justify-between p-4 text-left font-serif text-sm font-bold text-white hover:text-gold-light"
          >
            <span>How This Formula Works (Step-by-Step Calculation)</span>
            {showHowItWorks ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showHowItWorks && (
            <div className="border-t border-white/10 p-4 space-y-2 text-xs text-slate-300">
              {selectedFormula.stepStepExplanation
                ? selectedFormula.stepStepExplanation.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="rounded bg-gold/20 px-1.5 py-0.5 font-mono text-[10px] text-gold-light">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))
                : selectedFormula.stepByStepExplanation.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="rounded bg-gold/20 px-1.5 py-0.5 font-mono text-[10px] text-gold-light">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
            </div>
          )}
        </div>

        {/* Variable Definitions Table */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Variable & Constant Definitions
          </span>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 font-semibold text-slate-300">
                <tr>
                  <th className="px-3.5 py-2">Symbol</th>
                  <th className="px-3.5 py-2">Variable / Constant Name</th>
                  <th className="px-3.5 py-2">Unit</th>
                  <th className="px-3.5 py-2">Physical Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {selectedFormula.variableDefinitions.map((v) => (
                  <tr key={v.symbol} className="hover:bg-white/5">
                    <td className="px-3.5 py-2 font-mono font-bold text-gold-light">{v.symbol}</td>
                    <td className="px-3.5 py-2 font-medium text-white">{v.name}</td>
                    <td className="px-3.5 py-2 font-mono text-slate-400">{v.unit}</td>
                    <td className="px-3.5 py-2">{v.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Units, Conventions & Reference Frame */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <span className="text-muted-foreground">Input Units:</span>
            <strong className="block text-white mt-0.5">{selectedFormula.inputUnits}</strong>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <span className="text-muted-foreground">Output Units:</span>
            <strong className="block text-gold-light mt-0.5">{selectedFormula.outputUnits}</strong>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <span className="text-muted-foreground">Coordinate System:</span>
            <strong className="block text-white mt-0.5">{selectedFormula.coordinateSystem}</strong>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <span className="text-muted-foreground">Reference Epoch:</span>
            <strong className="block text-white mt-0.5">{selectedFormula.referenceEpoch}</strong>
          </div>
        </div>

        {/* Dual Primary Historical and Modern Citations */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Historical Source */}
          <div className="space-y-2 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gold-light">📜 Verified Historical Text</span>
              {selectedFormula.provenance.historicalUrl && (
                <a
                  href={selectedFormula.provenance.historicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-gold hover:underline"
                >
                  <span>Primary Scan</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <p className="font-serif text-sm font-bold text-white">
              {selectedFormula.provenance.historicalSourceText}
            </p>
            <p className="text-slate-300">
              <strong>Section / Verse:</strong>{" "}
              {selectedFormula.provenance.historicalVerseOrChapter}
            </p>
            <p className="text-slate-400">
              <strong>Translator / Edition:</strong>{" "}
              {selectedFormula.provenance.historicalTranslator} (
              {selectedFormula.provenance.historicalYear})
            </p>
          </div>

          {/* Modern Scholarly Reference */}
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-cyan-300">🔬 Modern Scholarly Reference</span>
              {selectedFormula.provenance.modernScholarlyUrl && (
                <a
                  href={selectedFormula.provenance.modernScholarlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-cyan-300 hover:underline"
                >
                  <span>Citation Link</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <p className="text-slate-200">{selectedFormula.provenance.modernScholarlyRef}</p>
          </div>
        </div>

        {/* Assumptions and Limitations */}
        <div className="space-y-2 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4 text-xs text-amber-200">
          <div className="flex items-center gap-2 font-semibold text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            <span>Assumptions, Approximations, and Limitations:</span>
          </div>
          <ul className="list-inside list-disc space-y-1 text-slate-300">
            {selectedFormula.assumptionsAndLimitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>
        </div>

        {/* Code Snippet Toggle */}
        <div className="border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => setShowCodeSnippet((prev) => !prev)}
            className="flex items-center gap-2 text-xs font-semibold text-gold hover:underline"
          >
            <Code2 className="h-4 w-4" />
            <span>
              {showCodeSnippet
                ? "Hide Implementation Code"
                : "View Actual Implementation Code in KalaGanaka"}
            </span>
          </button>

          {showCodeSnippet && (
            <pre className="mt-3 overflow-x-auto rounded-xl border border-white/15 bg-black/90 p-4 font-mono text-[11px] leading-relaxed text-slate-200">
              <code>{selectedFormula.formulaCodeSnippet}</code>
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
