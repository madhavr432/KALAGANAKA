import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";

import {
  circularAngularDifference,
  absoluteAngularSeparation,
  formatDMS,
  formatRashiDMS,
  degreesToArcminutes,
  degreesToArcseconds,
  degreesToRadians,
  radiansToDegrees,
  ghatisToMinutes,
  minutesToGhatis,
  palasToSeconds,
  secondsToPalas,
  checkCoordinateCompatibility,
} from "../modules/astronomy-lab/utils/astronomyMath";

import {
  VERIFIED_FORMULAS,
  ANCIENT_INSTRUMENTS,
  MODERN_INSTRUMENTS,
  INSTRUMENT_COMPARISONS,
  SCIENTIFIC_FAQS,
} from "../modules/astronomy-lab/constants/labConstants";

import { FormulaSourceExplorer } from "../modules/astronomy-lab/components/FormulaSourceExplorer";
import { AncientInstrumentGallery } from "../modules/astronomy-lab/components/AncientInstrumentGallery";
import { ModernInstrumentGallery } from "../modules/astronomy-lab/components/ModernInstrumentGallery";
import { SideBySideComparison } from "../modules/astronomy-lab/components/SideBySideComparison";
import { UnitCompatibilitySection } from "../modules/astronomy-lab/components/UnitCompatibilitySection";
import { NumericalComparisonEngine } from "../modules/astronomy-lab/components/NumericalComparisonEngine";
import { DifferenceAnalysisGraph } from "../modules/astronomy-lab/components/DifferenceAnalysisGraph";

describe("Module 5: Astronomy Lab - Mathematical & Angular Utilities", () => {
  it("circularAngularDifference calculates standard and wrapped differences accurately", () => {
    // Normal cases
    expect(circularAngularDifference(100, 90)).toBeCloseTo(10.0, 5);
    expect(circularAngularDifference(90, 100)).toBeCloseTo(-10.0, 5);

    // Critical Wraparound: 359° and 1° must be 2° apart, NOT 358°
    const diff1 = circularAngularDifference(1, 359);
    expect(diff1).toBeCloseTo(2.0, 5);

    const diff2 = circularAngularDifference(359, 1);
    expect(diff2).toBeCloseTo(-2.0, 5);

    // 0° and 355°
    expect(circularAngularDifference(0, 355)).toBeCloseTo(5.0, 5);
    expect(circularAngularDifference(355, 0)).toBeCloseTo(-5.0, 5);
  });

  it("absoluteAngularSeparation is symmetric and never exceeds 180°", () => {
    expect(absoluteAngularSeparation(359, 1)).toBeCloseTo(2.0, 5);
    expect(absoluteAngularSeparation(1, 359)).toBeCloseTo(2.0, 5);
    expect(absoluteAngularSeparation(0, 360)).toBeCloseTo(0.0, 5);
    expect(absoluteAngularSeparation(10, 190)).toBeCloseTo(180.0, 5);
    expect(absoluteAngularSeparation(10, 200)).toBeCloseTo(170.0, 5);
  });

  it("formatDMS accurately formats degrees, arcminutes, and arcseconds", () => {
    const formatted = formatDMS(190.8715);
    expect(formatted).toContain("190°");
    expect(formatted).toContain("52'");
  });

  it("formatRashiDMS correctly determines Zodiac signs", () => {
    expect(formatRashiDMS(15)).toContain("Mesha");
    expect(formatRashiDMS(45)).toContain("Vrishabha");
    expect(formatRashiDMS(192)).toContain("Tula");
    expect(formatRashiDMS(280)).toContain("Makara");
  });

  it("unit conversion functions provide exact mathematical equivalents", () => {
    // Angle
    expect(degreesToArcminutes(1.5)).toBeCloseTo(90.0, 5);
    expect(degreesToArcseconds(1.0)).toBeCloseTo(3600.0, 5);
    expect(degreesToRadians(180.0)).toBeCloseTo(Math.PI, 5);
    expect(radiansToDegrees(Math.PI)).toBeCloseTo(180.0, 5);

    // Traditional time
    // 1 Ghati = 24 minutes
    expect(ghatisToMinutes(1.0)).toBeCloseTo(24.0, 5);
    expect(ghatisToMinutes(2.5)).toBeCloseTo(60.0, 5);
    expect(minutesToGhatis(24.0)).toBeCloseTo(1.0, 5);

    // 1 Pala = 24 seconds
    expect(palasToSeconds(1.0)).toBeCloseTo(24.0, 5);
    expect(secondsToPalas(24.0)).toBeCloseTo(1.0, 5);
  });

  it("checkCoordinateCompatibility enforces valid comparison constraints", () => {
    // Same frame is valid
    const validCheck = checkCoordinateCompatibility("nirayana", "nirayana");
    expect(validCheck.compatible).toBe(true);

    // Sayana vs Nirayana requires Ayanamsha correction
    const ayanCheck = checkCoordinateCompatibility("sayana", "nirayana");
    expect(ayanCheck.compatible).toBe(false);
    expect(ayanCheck.reason).toContain("Ayanamsha");

    // Topocentric vs Geocentric requires Parallax correction
    const topoCheck = checkCoordinateCompatibility("topocentric", "geocentric");
    expect(topoCheck.compatible).toBe(false);
    expect(topoCheck.reason).toContain("parallax");
  });
});

describe("Module 5: Astronomy Lab - Constant Data Integrity", () => {
  it("contains verified historical and modern mathematical formulas", () => {
    expect(VERIFIED_FORMULAS.length).toBeGreaterThanOrEqual(5);

    VERIFIED_FORMULAS.forEach((f) => {
      expect(f.id).toBeTruthy();
      expect(f.name).toBeTruthy();
      expect(f.formulaLatex).toBeTruthy();
      expect(f.formulaCodeSnippet).toBeTruthy();
      expect(f.provenance.historicalSourceText).toBeTruthy();
      expect(f.provenance.modernScholarlyRef).toBeTruthy();
      expect(f.variableDefinitions.length).toBeGreaterThan(0);
      expect(f.assumptionsAndLimitations.length).toBeGreaterThan(0);
      expect(f.stepByStepExplanation.length).toBeGreaterThan(0);
    });
  });

  it("contains verified ancient and modern instruments with genuine attribution", () => {
    expect(ANCIENT_INSTRUMENTS.length).toBeGreaterThanOrEqual(4);
    expect(MODERN_INSTRUMENTS.length).toBeGreaterThanOrEqual(4);

    const allInstruments = [...ANCIENT_INSTRUMENTS, ...MODERN_INSTRUMENTS];
    allInstruments.forEach((inst) => {
      expect(inst.id).toBeTruthy();
      expect(inst.imageUrl).toMatch(/^https?:\/\//);
      expect(inst.imageAttribution).toBeTruthy();
      expect(inst.imageLicense).toBeTruthy();
      expect(inst.measurementPrinciple).toBeTruthy();
      expect(inst.precisionOrUncertainty).toBeTruthy();
      expect(inst.strengths.length).toBeGreaterThan(0);
      expect(inst.limitations.length).toBeGreaterThan(0);
    });
  });

  it("contains structured side-by-side instrument comparisons and scientific FAQs", () => {
    expect(INSTRUMENT_COMPARISONS.length).toBeGreaterThanOrEqual(4);
    INSTRUMENT_COMPARISONS.forEach((comp) => {
      expect(comp.id).toBeTruthy();
      expect(comp.title).toBeTruthy();
      expect(comp.conceptualBridge).toBeTruthy();
      expect(comp.fields.length).toBeGreaterThanOrEqual(5);
    });

    expect(SCIENTIFIC_FAQS.length).toBeGreaterThanOrEqual(4);
    SCIENTIFIC_FAQS.forEach((faq) => {
      expect(faq.id).toBeTruthy();
      expect(faq.question).toBeTruthy();
      expect(faq.answer).toBeTruthy();
      expect(faq.scientificCitations.length).toBeGreaterThan(0);
    });
  });
});

describe("Module 5: Astronomy Lab - React Components Smoke Testing", () => {
  it("renders FormulaSourceExplorer without throwing", () => {
    render(
      <FormulaSourceExplorer
        formulas={VERIFIED_FORMULAS}
        selectedFormula={VERIFIED_FORMULAS[0]}
        onSelectFormula={() => {}}
      />,
    );
    expect(screen.getByText(/Formula and Source Explorer/i)).toBeTruthy();
  });

  it("renders AncientInstrumentGallery with instrument items", () => {
    render(
      <AncientInstrumentGallery
        instruments={ANCIENT_INSTRUMENTS}
        selectedInstrument={ANCIENT_INSTRUMENTS[0]}
        onSelectInstrument={() => {}}
      />,
    );
    expect(screen.getByText(/Ancient Astronomical Instrument Gallery/i)).toBeTruthy();
  });

  it("renders ModernInstrumentGallery with instrument items", () => {
    render(
      <ModernInstrumentGallery
        instruments={MODERN_INSTRUMENTS}
        selectedInstrument={MODERN_INSTRUMENTS[0]}
        onSelectInstrument={() => {}}
      />,
    );
    expect(screen.getByText(/Modern Astronomical Instrument Gallery/i)).toBeTruthy();
  });

  it("renders SideBySideComparison with comparative fields", () => {
    render(<SideBySideComparison comparisons={INSTRUMENT_COMPARISONS} />);
    expect(screen.getByText(/Side-by-Side Instrument Matrix/i)).toBeTruthy();
  });

  it("renders UnitCompatibilitySection and calculates conversions", () => {
    render(<UnitCompatibilitySection />);
    expect(screen.getByText(/Units & Coordinate Compatibility Matrix/i)).toBeTruthy();
    expect(screen.getByText(/Angular Units Converter/i)).toBeTruthy();
  });

  it("renders NumericalComparisonEngine with calculated result cards", () => {
    const mockResult = {
      status: "success",
      is_mock: false,
      traditional_method: "Surya Siddhanta mean motion",
      modern_method: "Skyfield JPL DE421",
      modern_data_source: "NASA JPL",
      coordinate_system: "Nirayana with Lahiri Ayanamsha",
      instant: "2026-10-29T12:00:00Z",
      compared_planets: ["Sun"],
      unmatched_traditional_planets: [],
      unmatched_modern_planets: [],
      results: [
        {
          planet: "Sun",
          traditional_longitude_deg: 190.8715,
          modern_longitude_deg: 192.2152,
          signed_difference_deg: -1.3437,
          absolute_difference_deg: 1.3437,
        },
      ],
      limitations: [],
    };

    render(
      <NumericalComparisonEngine
        date="2026-10-29"
        time="12:00"
        onDateChange={() => {}}
        onTimeChange={() => {}}
        comparisonResult={mockResult}
        isLoading={false}
        error={null}
        onRefresh={() => {}}
      />,
    );

    expect(screen.getByText(/Numerical Comparison Engine/i)).toBeTruthy();
    expect(screen.getByText(/190.8715°/i)).toBeTruthy();
    expect(screen.getByText(/192.2152°/i)).toBeTruthy();
  });

  it("renders DifferenceAnalysisGraph with statistics and SVG container", () => {
    const mockTimeSeries = {
      status: "success",
      start_date: "2026-10-29",
      end_date: "2026-11-04",
      total_points: 7,
      time_series: [
        {
          date: "2026-10-29",
          traditional_longitude_deg: 190.8715,
          modern_longitude_deg: 192.2152,
          signed_difference_deg: -1.3437,
          absolute_difference_deg: 1.3437,
          units: "degrees",
        },
      ],
      summary_statistics: {
        mean_absolute_difference_deg: 1.35,
        max_absolute_difference_deg: 1.38,
        min_absolute_difference_deg: 1.32,
        std_deviation_deg: 0.02,
      },
      traditional_method: "Surya Siddhanta",
      modern_method: "Skyfield DE421",
      units: "degrees",
      limitations: [],
    };

    render(
      <DifferenceAnalysisGraph
        timeSeriesData={mockTimeSeries}
        selectedDays={7}
        onSelectDays={() => {}}
        isLoading={false}
        error={null}
      />,
    );

    expect(screen.getByText(/Multi-Day Difference Analysis Graph/i)).toBeTruthy();
    expect(screen.getByText(/1.3500°/i)).toBeTruthy();
  });
});
