/**
 * TypeScript Type Definitions for Module 2: Solar Calendar & Solar Festivals.
 */

import {
  SolarEventsResponse,
  ModernPlanetsResponse,
  SolarComparisonResponse,
} from "@/services/astronomy-api";

export interface ObservatoryPreset {
  id: string;
  name: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  timezone: string;
}

export interface RashiDetail {
  index: number; // 1 to 12
  sanskritName: string;
  englishName: string;
  symbol: string;
  element: string;
  rulingGraha: string;
  startDeg: number;
  endDeg: number;
  solarMonthNorth: string;
  solarMonthTamil: string;
  solarMonthBengali: string;
  solarMonthMalayalam: string;
  solarMonthOdia: string;
  approximateDateRange: string;
  associatedFestivals: string[];
  culturalSignificance: string;
  dayBoundaryRule: string;
}

export interface AstronomicalStationEvent {
  id:
    | "vernal-equinox"
    | "summer-solstice"
    | "autumnal-equinox"
    | "winter-solstice"
    | "perihelion"
    | "aphelion";
  name: string;
  sanskritName: string;
  approximateDate: string;
  tropicalLongitudeDeg: number;
  declinationDeg: number;
  orbitAngleRad: number; // angle on 3D orbit
  description: string;
  hemisphereSignificance: string;
  indianAstronomicalContext: string;
  defaultDate: { month: number; day: number };
}

export type FestivalRegion = "All India" | "North" | "South" | "East" | "West";
export type FestivalCategory =
  "Sankranti Ingress" | "Solar New Year" | "Harvest / Seasonal" | "Solar Reverence";
export type FestivalTradition = "Sidereal Nirayana" | "Tropical Sayana" | "Lunisolar Solar-Tithi";

export interface SolarFestivalItem {
  id: string;
  name: string;
  sanskritName: string;
  regionalName: string;
  region: FestivalRegion;
  category: FestivalCategory;
  tradition: FestivalTradition;
  approximateGregorian: string;
  solarTarget: string;
  astronomicalBasis: string;
  culturalSignificance: string;
  observanceRule: string;
  defaultDate: { month: number; day: number };
}

export interface SolarCalculatedValues {
  dayOfYear: number;
  fractionOfDay: number;
  totalDaysInYear: number;
  isLeapYear: boolean;
  fractionOfYear: number;
  meanAnomalyDeg: number;
  trueAnomalyDeg: number;
  earthSunDistanceAU: number;
  earthSunDistanceKm: number;
  sunTropicalLongitudeDeg: number;
  sunSiderealLongitudeDeg: number;
  ayanamshaDeg: number;
  ayanamshaName: string;
  solarDeclinationDeg: number;
  equationOfCenterDeg: number;
  earthOrbitX: number;
  earthOrbitZ: number;
  indianRitu: string;
  indianRituSanskrit: string;
  tropicalSeason: string;
  currentRashi: RashiDetail;
  nextRashi: RashiDetail;
  degInRashi: number;
  solarDayInMonth: number;
  remainingDegToSankranti: number;
  approxDaysToSankranti: number;
  isNearStation: boolean;
  activeStation: AstronomicalStationEvent | null;
}

export interface SolarCalendarApiState {
  planetsData: ModernPlanetsResponse | null;
  solarEvents: SolarEventsResponse | null;
  comparisonData: SolarComparisonResponse | null;
  isLoading: boolean;
  isBackendConnected: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface SolarInfoMetric {
  id: string;
  title: string;
  plainSummary: string;
  formula: string;
  steps: string[];
  units: string;
  source: string;
  assumptions: string[];
  limitations: string[];
}
