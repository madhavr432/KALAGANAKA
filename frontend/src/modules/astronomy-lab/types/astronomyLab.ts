/**
 * types/astronomyLab.ts
 * Type definitions for Module 5: Ancient vs Modern Analysis Lab.
 */

export type CalculationCategory =
  "solar-motion" | "planetary-orbit" | "timekeeping" | "lunar-panchang" | "precession";

export interface FormulaVariable {
  symbol: string;
  name: string;
  unit: string;
  range?: string;
  description: string;
}

export interface FormulaProvenance {
  sourceType:
    | "explicit-historical-text"
    | "modern-mathematical-interpretation"
    | "developer-implementation"
    | "simplified-approximation";
  historicalSourceText: string;
  historicalVerseOrChapter: string;
  historicalAuthor: string;
  historicalTranslator?: string;
  historicalYear: string;
  historicalUrl?: string;
  modernScholarlyRef: string;
  modernScholarlyUrl?: string;
}

export interface TraditionalFormulaDefinition {
  id: string;
  name: string;
  nameSanskrit: string;
  category: CalculationCategory;
  formulaLatex: string;
  formulaCodeSnippet: string;
  provenance: FormulaProvenance;
  variableDefinitions: FormulaVariable[];
  inputUnits: string;
  outputUnits: string;
  timeConventions: string;
  coordinateSystem: string;
  referenceEpoch: string;
  assumptionsAndLimitations: string[];
  beginnerExplanation: string;
  stepByStepExplanation: string[];
}

export interface AstronomicalInstrument {
  id: string;
  name: string;
  nameHindi: string;
  nameSanskrit?: string;
  type: "ancient" | "modern";
  location: string;
  eraOrYear: string;
  builderOrInstitution: string;
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  imageAttribution: string;
  imageLicense: string;
  imageLicenseUrl?: string;
  imageSourceUrl: string;
  primaryPurpose: string;
  measurementPrinciple: string;
  inputsMeasured: string;
  outputsProduced: string;
  units: string;
  precisionOrUncertainty: string;
  relationToSoftware: string;
  isDirectFormulaSource: boolean;
  references: Array<{
    title: string;
    source: string;
    url?: string;
  }>;
  strengths: string[];
  limitations: string[];
}

export interface InstrumentSideBySideComparison {
  id: string;
  title: string;
  ancientInstrumentId: string;
  modernInstrumentId: string;
  conceptualBridge: string;
  fields: Array<{
    fieldLabel: string;
    ancientText: string;
    modernText: string;
    scientificCommentary?: string;
  }>;
}

export interface ScientificFaqItem {
  id: string;
  question: string;
  questionHindi: string;
  answer: string;
  technicalDetails?: string;
  scientificCitations: string[];
}
