/**
 * hooks/useAstronomyLabState.ts
 * Manages tab navigation, selection, date-range, and inspection state for Module 5.
 */

import { useState, useCallback } from "react";
import {
  VERIFIED_FORMULAS,
  ANCIENT_INSTRUMENTS,
  MODERN_INSTRUMENTS,
  INSTRUMENT_COMPARISONS,
} from "../constants/labConstants";

export type LabTabId =
  | "formulas"
  | "ancient-instruments"
  | "modern-instruments"
  | "instrument-comparison"
  | "numerical-engine"
  | "difference-analysis"
  | "unit-compatibility";

export function useAstronomyLabState() {
  const today = new Date();
  const defaultDateStr = today.toISOString().split("T")[0];

  // Active Tab
  const [activeTab, setActiveTab] = useState<LabTabId>("formulas");

  // Selection states
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>(VERIFIED_FORMULAS[0].id);
  const [selectedAncientInstrumentId, setSelectedAncientInstrumentId] = useState<string>(
    ANCIENT_INSTRUMENTS[0].id,
  );
  const [selectedModernInstrumentId, setSelectedModernInstrumentId] = useState<string>(
    MODERN_INSTRUMENTS[0].id,
  );
  const [selectedComparisonId, setSelectedComparisonId] = useState<string>(
    INSTRUMENT_COMPARISONS[0].id,
  );

  // Numerical comparison controls
  const [compareDate, setCompareDate] = useState<string>(defaultDateStr);
  const [compareTime, setCompareTime] = useState<string>("00:00");
  const [selectedBody, setSelectedBody] = useState<string>("Sun");

  // Time-series graph controls
  const [timeSeriesStartDate, setTimeSeriesStartDate] = useState<string>(defaultDateStr);
  const [timeSeriesDays, setTimeSeriesDays] = useState<number>(14);

  // ⓘ Info modal state
  const [activeInfoFaqId, setActiveInfoFaqId] = useState<string | null>(null);

  const selectedFormula =
    VERIFIED_FORMULAS.find((f) => f.id === selectedFormulaId) ?? VERIFIED_FORMULAS[0];

  const selectedAncientInstrument =
    ANCIENT_INSTRUMENTS.find((i) => i.id === selectedAncientInstrumentId) ?? ANCIENT_INSTRUMENTS[0];

  const selectedModernInstrument =
    MODERN_INSTRUMENTS.find((i) => i.id === selectedModernInstrumentId) ?? MODERN_INSTRUMENTS[0];

  const selectedComparison =
    INSTRUMENT_COMPARISONS.find((c) => c.id === selectedComparisonId) ?? INSTRUMENT_COMPARISONS[0];

  const stepCompareDate = useCallback((deltaDays: number) => {
    setCompareDate((prev) => {
      const d = new Date(`${prev}T12:00:00Z`);
      d.setUTCDate(d.getUTCDate() + deltaDays);
      return d.toISOString().split("T")[0];
    });
  }, []);

  return {
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
    selectedComparisonId,
    setSelectedComparisonId,
    selectedComparison,
    compareDate,
    setCompareDate,
    compareTime,
    setCompareTime,
    selectedBody,
    setSelectedBody,
    timeSeriesStartDate,
    setTimeSeriesStartDate,
    timeSeriesDays,
    setTimeSeriesDays,
    activeInfoFaqId,
    setActiveInfoFaqId,
    stepCompareDate,
    allFormulas: VERIFIED_FORMULAS,
    allAncientInstruments: ANCIENT_INSTRUMENTS,
    allModernInstruments: MODERN_INSTRUMENTS,
    allComparisons: INSTRUMENT_COMPARISONS,
  };
}
