/**
 * types/lunarCalendar.ts
 * Type definitions for Module 3: Lunar Calendar, Panchang & Lunar Festivals.
 */

export interface LunarObservationPreset {
  id: string;
  name: string;
  nameHindi: string;
  locationName: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  timezone: string;
  description: string;
  isHistoricalMeridian?: boolean;
}

export type LunarPhaseId =
  | "new-moon"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full-moon"
  | "waning-gibbous"
  | "third-quarter"
  | "waning-crescent";

export interface LunarPhaseDefinition {
  id: LunarPhaseId;
  nameEnglish: string;
  nameSanskrit: string;
  nameHindi: string;
  elongationNominalDeg: number;
  elongationMinDeg: number;
  elongationMaxDeg: number;
  illuminationNominal: number;
  paksha: "Shukla" | "Krishna";
  description: string;
  spiritualMeaning: string;
}

export type TithiCategory = "Nanda" | "Bhadra" | "Jaya" | "Rikta" | "Poorna";

export interface TithiDefinition {
  index: number; // 1 to 30
  nameEnglish: string;
  nameSanskrit: string;
  nameHindi: string;
  paksha: "Shukla" | "Krishna";
  tithiInPaksha: number; // 1 to 15
  category: TithiCategory;
  categoryMeaning: string;
  rulingDeity: string;
  rulingDeitySanskrit: string;
  startElongationDeg: number;
  endElongationDeg: number;
  auspiciousActivities: string[];
  ritualSignificance: string;
}

export interface NakshatraDefinition {
  index: number; // 1 to 27
  nameEnglish: string;
  nameSanskrit: string;
  nameHindi: string;
  startDeg: number; // Sidereal ecliptic longitude start
  endDeg: number;
  yogataraWesternName: string;
  yogataraBayer: string;
  rulingDeity: string;
  rulingDeitySanskrit: string;
  planetaryLord: string; // Graha lord (Vimshottari Dasha)
  planetaryLordSanskrit: string;
  symbol: string;
  symbolMeaning: string;
  guna: "Sattva" | "Rajas" | "Tamas";
  gana: "Deva" | "Manushya" | "Rakshasa";
  characteristics: string;
}

export interface YogaDefinition {
  index: number; // 1 to 27
  nameEnglish: string;
  nameSanskrit: string;
  nature: "Auspicious" | "Inauspicious" | "Neutral";
  rulingDeity: string;
  description: string;
}

export interface KaranaDefinition {
  index: number; // 1 to 11
  nameEnglish: string;
  nameSanskrit: string;
  category: "Chara" | "Sthira"; // Chara (movable, occurs 8 times), Sthira (fixed, occurs once in month)
  rulingDeity: string;
  nature: "Auspicious" | "Inauspicious" | "Neutral";
  description: string;
}

export interface MoonPhysicalState {
  elongationDeg: number; // [0, 360) Moon - Sun
  phaseAngleDeg: number; // [0, 180] Earth - Moon - Sun
  illuminatedFraction: number; // [0.0, 1.0] k = (1 - cos(elongation)) / 2
  illuminationPercent: number; // [0, 100]
  isWaxing: boolean;
  phaseId: LunarPhaseId;
  phaseNameEnglish: string;
  phaseNameSanskrit: string;
  sunTropicalLongitudeDeg: number;
  moonTropicalLongitudeDeg: number;
  sunSiderealLongitudeDeg: number;
  moonSiderealLongitudeDeg: number;
  ayanamshaDeg: number;
  distanceKm: number;
  synodicDay: number; // [0, 29.530588)
}

export interface PanchangLimbsState {
  tithi: {
    index: number;
    name: string;
    nameSanskrit: string;
    paksha: "Shukla" | "Krishna";
    tithiInPaksha: number;
    category: TithiCategory;
    rulingDeity: string;
    fractionElapsed: number;
    elapsedDeg: number;
    remainingHours?: number;
    transitionTimeLocal?: string;
  };
  vara: {
    index: number;
    nameEnglish: string;
    nameSanskrit: string;
    rulingPlanet: string;
    rulingPlanetSanskrit: string;
    deity: string;
  };
  nakshatra: {
    index: number;
    name: string;
    nameSanskrit: string;
    pada: number; // 1 to 4
    fractionElapsed: number;
    rulingDeity: string;
    planetaryLord: string;
    symbol: string;
    yogataraWesternName: string;
    remainingHours?: number;
    transitionTimeLocal?: string;
  };
  yoga: {
    index: number;
    name: string;
    nameSanskrit: string;
    nature: "Auspicious" | "Inauspicious" | "Neutral";
    fractionElapsed: number;
    rulingDeity: string;
    remainingHours?: number;
    transitionTimeLocal?: string;
  };
  karana: {
    index: number; // 1 to 11
    name: string;
    nameSanskrit: string;
    category: "Chara" | "Sthira";
    nature: "Auspicious" | "Inauspicious" | "Neutral";
    rulingDeity: string;
    remainingHours?: number;
    transitionTimeLocal?: string;
  };
}

export interface LunarMonthState {
  amantaMonthName: string;
  amantaMonthSanskrit: string;
  purnimantaMonthName: string;
  purnimantaMonthSanskrit: string;
  monthIndex: number; // 1 to 12
  isAdhikaMasa: boolean;
  rituNameEnglish: string;
  rituNameSanskrit: string;
  ayana: "Uttarayana" | "Dakshinayana";
  kaliyugaYear: number;
  vikramaSamvat: number;
  shakaSamvat: number;
}

export interface LunarFestival {
  id: string;
  name: string;
  nameHindi: string;
  nameSanskrit: string;
  lunarMonth: string;
  paksha: "Shukla" | "Krishna";
  tithi: string;
  tithiIndex: number; // 1 to 30
  calculatedDate?: string;
  timingKala: "Madhyahna" | "Nishita" | "Aparahna" | "Pradosha" | "Arunodaya" | "All Day";
  timingKalaSanskrit: string;
  description: string;
  culturalSignificance: string;
  astronomicalSignificance: string;
  ritualPractices: string[];
  region: string;
  tradition: "Pan-Indian" | "North Indian" | "South Indian" | "Eastern Indian" | "Western Indian";
  iconName: string;
  jumpDate: string; // ISO date YYYY-MM-DD
}

export interface LunarCalendarGridDay {
  dateStr: string; // YYYY-MM-DD
  dayOfMonth: number;
  dayOfWeek: number; // 0 Sun to 6 Sat
  isCurrentMonth: boolean;
  isSelectedDate: boolean;
  isToday: boolean;
  tithiIndex: number;
  tithiName: string;
  tithiInPaksha: number;
  paksha: "Shukla" | "Krishna";
  nakshatraName: string;
  illuminatedFraction: number;
  isAmavasya: boolean;
  isPurnima: boolean;
  festivals: LunarFestival[];
}

export interface LunarCalculationMetric {
  id: string;
  title: string;
  titleSanskrit: string;
  formulaLatex: string;
  definition: string;
  astronomicalSignificance: string;
  units: string;
  classicalReference: string;
  modernReference: string;
}
