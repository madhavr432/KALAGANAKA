/**
 * AstronomyLabPage.tsx
 * Module 5: Ancient vs Modern Astronomy Lab Master Page.
 * Connects all analytical sections, live ephemeris services, formula sources,
 * instrument galleries, and interactive comparison calculators.
 */

import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { NavigationHeader } from "@/components/NavigationHeader";
import { LabHero } from "./components/LabHero";
import { FormulaSourceExplorer } from "./components/FormulaSourceExplorer";
import { AncientInstrumentGallery } from "./components/AncientInstrumentGallery";
import { ModernInstrumentGallery } from "./components/ModernInstrumentGallery";
import { SideBySideComparison } from "./components/SideBySideComparison";
import { NumericalComparisonEngine } from "./components/NumericalComparisonEngine";
import { DifferenceAnalysisGraph } from "./components/DifferenceAnalysisGraph";
import { UnitCompatibilitySection } from "./components/UnitCompatibilitySection";
import { LabScienceInfoModal } from "./components/LabScienceInfoModal";

import { useAstronomyLabState } from "./hooks/useAstronomyLabState";
import { useComparisonEngine } from "./hooks/useComparisonEngine";
import {
  VERIFIED_FORMULAS,
  ANCIENT_INSTRUMENTS,
  MODERN_INSTRUMENTS,
  INSTRUMENT_COMPARISONS,
} from "./constants/labConstants";
import {
  BookOpen,
  Compass,
  Telescope,
  Scale,
  Binary,
  LineChart,
  Layers,
  HelpCircle,
  Home,
} from "lucide-react";

export function AstronomyLabPage() {
  const {
    activeTab,
    setActiveTab,
    selectedFormulaId,
    setSelectedFormulaId,
    selectedFormula,
    selectedAncientInstrumentId,
    setSelectedAncientInstrumentId,
    selectedAncientInstrument,
    selectedModernInstrumentId,
    setSelectedModernInstrumentId,
    selectedModernInstrument,
    compareDate,
    setCompareDate,
    compareTime,
    setCompareTime,
    timeSeriesStartDate,
    timeSeriesDays,
    setTimeSeriesDays,
    activeInfoFaqId,
    setActiveInfoFaqId,
  } = useAstronomyLabState();

  const {
    isBackendOnline,
    comparisonResult,
    isComparisonLoading,
    comparisonError,
    executeComparison,
    timeSeriesResult,
    isTimeSeriesLoading,
    timeSeriesError,
    executeTimeSeries,
  } = useComparisonEngine({
    compareDate,
    compareTime,
    timeSeriesStartDate,
    timeSeriesDays,
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenInfoModal = (topicId?: string) => {
    if (topicId) {
      setActiveInfoFaqId(topicId);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-midnight text-slate-100 antialiased selection:bg-gold/30 selection:text-gold-light">
      {/* Background Subtle Stars */}
      <div className="stars pointer-events-none fixed inset-0 opacity-40" aria-hidden />

      {/* Main Responsive Navigation Bar with Home Button */}
      <NavigationHeader
        currentFeature="astronomy-lab"
        title="वेधशाला प्रयोगशाला"
        subtitle="Ancient vs Modern Analysis Lab"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 space-y-8 sm:px-6 lg:px-8">
        {/* Module Hero Banner */}
        <LabHero
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isBackendOnline={isBackendOnline}
          onOpenInfo={(faqId) => handleOpenInfoModal(faqId)}
        />

        {/* Dynamic Tab Sub-View */}
        <main className="space-y-8 animate-in fade-in duration-300">
          {activeTab === "formulas" && (
            <FormulaSourceExplorer
              formulas={VERIFIED_FORMULAS}
              selectedFormula={selectedFormula}
              onSelectFormula={setSelectedFormulaId}
            />
          )}

          {activeTab === "ancient-instruments" && (
            <AncientInstrumentGallery
              instruments={ANCIENT_INSTRUMENTS}
              selectedInstrument={selectedAncientInstrument}
              onSelectInstrument={setSelectedAncientInstrumentId}
            />
          )}

          {activeTab === "modern-instruments" && (
            <ModernInstrumentGallery
              instruments={MODERN_INSTRUMENTS}
              selectedInstrument={selectedModernInstrument}
              onSelectInstrument={setSelectedModernInstrumentId}
            />
          )}

          {activeTab === "instrument-comparison" && (
            <SideBySideComparison comparisons={INSTRUMENT_COMPARISONS} />
          )}

          {activeTab === "numerical-engine" && (
            <NumericalComparisonEngine
              date={compareDate}
              time={compareTime}
              onDateChange={setCompareDate}
              onTimeChange={setCompareTime}
              comparisonResult={comparisonResult}
              isLoading={isComparisonLoading}
              error={comparisonError}
              onRefresh={executeComparison}
              onOpenInfoModal={handleOpenInfoModal}
            />
          )}

          {activeTab === "difference-analysis" && (
            <DifferenceAnalysisGraph
              timeSeriesData={timeSeriesResult}
              selectedDays={timeSeriesDays}
              onSelectDays={setTimeSeriesDays}
              isLoading={isTimeSeriesLoading}
              error={timeSeriesError}
              onOpenInfoModal={handleOpenInfoModal}
            />
          )}

          {activeTab === "unit-compatibility" && <UnitCompatibilitySection />}
        </main>

        {/* Quick-Jump Section Navigator */}
        <footer className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h4 className="font-serif text-sm font-bold text-white">
                Laboratory Navigation Index
              </h4>
              <p className="font-deva text-xs text-gold-soft">अनुसन्धान अनुभाग त्वरित चयन</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/15 px-3 py-1.5 text-xs font-semibold text-gold-light hover:bg-gold/25 hover:text-white transition-all shadow-sm"
                title="Return to KalaGanaka Home Page"
              >
                <Home className="h-3.5 w-3.5 text-gold" />
                <span>Home (मुख्य पृष्ठ)</span>
              </Link>
              <button
                type="button"
                onClick={() => handleOpenInfoModal()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/15 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/25"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Reference Q&A / FAQs</span>
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("formulas")}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                activeTab === "formulas"
                  ? "border-gold bg-gold/20 text-white"
                  : "border-white/5 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="h-4 w-4 mb-1 text-gold" />
              <div className="font-semibold">Formulas</div>
              <div className="text-[10px] text-slate-400">Sources & Proofs</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ancient-instruments")}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                activeTab === "ancient-instruments"
                  ? "border-gold bg-gold/20 text-white"
                  : "border-white/5 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="h-4 w-4 mb-1 text-gold" />
              <div className="font-semibold">Ancient</div>
              <div className="text-[10px] text-slate-400">Historic Dials</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("modern-instruments")}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                activeTab === "modern-instruments"
                  ? "border-cyan-400 bg-cyan-950/40 text-white"
                  : "border-white/5 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Telescope className="h-4 w-4 mb-1 text-cyan-400" />
              <div className="font-semibold">Modern</div>
              <div className="text-[10px] text-slate-400">Lasers & Atomic</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("instrument-comparison")}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                activeTab === "instrument-comparison"
                  ? "border-indigo-400 bg-indigo-950/40 text-white"
                  : "border-white/5 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Scale className="h-4 w-4 mb-1 text-indigo-400" />
              <div className="font-semibold">Matrix</div>
              <div className="text-[10px] text-slate-400">Side-by-Side</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("numerical-engine")}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                activeTab === "numerical-engine"
                  ? "border-gold bg-gold/20 text-white"
                  : "border-white/5 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Binary className="h-4 w-4 mb-1 text-gold" />
              <div className="font-semibold">Engine</div>
              <div className="text-[10px] text-slate-400">Live Numerical</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("difference-analysis")}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                activeTab === "difference-analysis"
                  ? "border-purple-400 bg-purple-950/40 text-white"
                  : "border-white/5 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <LineChart className="h-4 w-4 mb-1 text-purple-400" />
              <div className="font-semibold">Residuals</div>
              <div className="text-[10px] text-slate-400">Time-Series</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("unit-compatibility")}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                activeTab === "unit-compatibility"
                  ? "border-emerald-400 bg-emerald-950/40 text-white"
                  : "border-white/5 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4 mb-1 text-emerald-400" />
              <div className="font-semibold">Units</div>
              <div className="text-[10px] text-slate-400">Frames & Tests</div>
            </button>
          </div>
        </footer>
      </div>

      {/* Scientific Knowledge / FAQ Modal */}
      <LabScienceInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTopicId={activeInfoFaqId || undefined}
      />
    </div>
  );
}
