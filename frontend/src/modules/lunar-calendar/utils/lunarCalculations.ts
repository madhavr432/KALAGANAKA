/**
 * utils/lunarCalculations.ts
 * Pure mathematical algorithms and astronomical reduction formulas for Module 3.
 */

import {
  LUNAR_PHASES,
  ALL_TITHIS,
  ALL_NAKSHATRAS,
  ALL_YOGAS,
  ALL_KARANAS,
  LUNAR_FESTIVALS,
  TITHI_SPAN_DEG,
  NAKSHATRA_SPAN_DEG,
  PADA_SPAN_DEG,
  KARANA_SPAN_DEG,
  LUNAR_SYNODIC_MONTH_DAYS,
} from "../constants/lunarConstants";
import type {
  LunarPhaseDefinition,
  MoonPhysicalState,
  PanchangLimbsState,
  LunarMonthState,
  LunarCalendarGridDay,
  TithiCategory,
} from "../types/lunarCalendar";

/**
 * Normalize an angle into [0, 360) degrees.
 */
export function normalizeDeg(deg: number): number {
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

/**
 * Calculate the Moon's illuminated fraction k = (1 - cos(theta)) / 2
 * @param elongationDeg Ecliptic elongation Moon - Sun in degrees [0, 360)
 */
export function calcIlluminatedFraction(elongationDeg: number): number {
  const norm = normalizeDeg(elongationDeg);
  const rad = (norm * Math.PI) / 180;
  return (1 - Math.cos(rad)) / 2;
}

/**
 * Determine the closest principal lunar phase from elongation.
 */
export function getPhaseDefinition(elongationDeg: number): LunarPhaseDefinition {
  const norm = normalizeDeg(elongationDeg);

  if (norm >= 354 || norm < 6) return LUNAR_PHASES[0]; // New Moon
  if (norm >= 6 && norm < 84) return LUNAR_PHASES[1]; // Waxing Crescent
  if (norm >= 84 && norm <= 96) return LUNAR_PHASES[2]; // First Quarter
  if (norm > 96 && norm < 174) return LUNAR_PHASES[3]; // Waxing Gibbous
  if (norm >= 174 && norm <= 186) return LUNAR_PHASES[4]; // Full Moon
  if (norm > 186 && norm < 264) return LUNAR_PHASES[5]; // Waning Gibbous
  if (norm >= 264 && norm <= 276) return LUNAR_PHASES[6]; // Third Quarter
  return LUNAR_PHASES[7]; // Waning Crescent
}

/**
 * Calculate Tithi limb from Sun-Moon elongation.
 */
export function calcTithiFromElongation(elongationDeg: number) {
  const norm = normalizeDeg(elongationDeg);
  const rawIndex = Math.floor(norm / TITHI_SPAN_DEG); // 0 to 29
  const index = rawIndex + 1; // 1 to 30
  const elapsedDeg = norm - rawIndex * TITHI_SPAN_DEG;
  const fractionElapsed = elapsedDeg / TITHI_SPAN_DEG;

  const tithiDef = ALL_TITHIS[rawIndex];
  const paksha: "Shukla" | "Krishna" = index <= 15 ? "Shukla" : "Krishna";
  const tithiInPaksha = index <= 15 ? index : index - 15;

  return {
    index,
    name: tithiDef ? tithiDef.nameEnglish : `Tithi ${index}`,
    nameSanskrit: tithiDef ? tithiDef.nameSanskrit : `तिथि ${index}`,
    paksha,
    tithiInPaksha,
    category: (tithiDef ? tithiDef.category : "Poorna") as TithiCategory,
    rulingDeity: tithiDef ? tithiDef.rulingDeity : "Surya",
    fractionElapsed: Math.min(1.0, Math.max(0.0, fractionElapsed)),
    elapsedDeg,
  };
}

/**
 * Calculate Nakshatra limb from Moon's sidereal longitude.
 */
export function calcNakshatraFromSidereal(moonSiderealDeg: number) {
  const norm = normalizeDeg(moonSiderealDeg);
  const rawIndex = Math.floor(norm / NAKSHATRA_SPAN_DEG); // 0 to 26
  const index = (rawIndex % 27) + 1; // 1 to 27
  const elapsedDeg = norm - rawIndex * NAKSHATRA_SPAN_DEG;
  const fractionElapsed = elapsedDeg / NAKSHATRA_SPAN_DEG;

  const rawPada = Math.floor(elapsedDeg / PADA_SPAN_DEG); // 0 to 3
  const pada = (rawPada % 4) + 1; // 1 to 4

  const def = ALL_NAKSHATRAS[rawIndex % 27];

  return {
    index,
    name: def ? def.nameEnglish : `Nakshatra ${index}`,
    nameSanskrit: def ? def.nameSanskrit : `नक्षत्र ${index}`,
    pada,
    fractionElapsed: Math.min(1.0, Math.max(0.0, fractionElapsed)),
    elapsedDeg,
    rulingDeity: def ? def.rulingDeity : "Vedic Deity",
    planetaryLord: def ? def.planetaryLord : "Graha",
    symbol: def ? def.symbol : "Star",
    yogataraWesternName: def ? def.yogataraWesternName : "Anchor Star",
  };
}

/**
 * Calculate Yoga limb from (Moon_sidereal + Sun_sidereal).
 */
export function calcYogaFromSidereal(moonSiderealDeg: number, sunSiderealDeg: number) {
  const sum = normalizeDeg(moonSiderealDeg + sunSiderealDeg);
  const rawIndex = Math.floor(sum / NAKSHATRA_SPAN_DEG); // 0 to 26
  const index = (rawIndex % 27) + 1; // 1 to 27
  const elapsedDeg = sum - rawIndex * NAKSHATRA_SPAN_DEG;
  const fractionElapsed = elapsedDeg / NAKSHATRA_SPAN_DEG;

  const def = ALL_YOGAS[rawIndex % 27];

  return {
    index,
    name: def ? def.nameEnglish : `Yoga ${index}`,
    nameSanskrit: def ? def.nameSanskrit : `योग ${index}`,
    nature: def ? def.nature : ("Auspicious" as const),
    fractionElapsed: Math.min(1.0, Math.max(0.0, fractionElapsed)),
    rulingDeity: def ? def.rulingDeity : "Vishnu",
  };
}

/**
 * Calculate Karana (half-tithi) limb from elongation.
 * 60 Karana divisions in a month:
 * 1: Kimstughna (Sthira)
 * 2..57: 8 cycles of the 7 Chara Karanas (Bava to Vishti)
 * 58: Shakuni (Sthira)
 * 59: Chatushpada (Sthira)
 * 60: Naga (Sthira)
 */
export function calcKaranaFromElongation(elongationDeg: number) {
  const norm = normalizeDeg(elongationDeg);
  const sequenceIndex = Math.floor(norm / KARANA_SPAN_DEG) + 1; // 1 to 60
  const elapsedDeg = norm % KARANA_SPAN_DEG;
  const fractionElapsed = elapsedDeg / KARANA_SPAN_DEG;

  let karanaIndex11 = 1;
  if (sequenceIndex === 1) {
    karanaIndex11 = 11; // Kimstughna
  } else if (sequenceIndex >= 2 && sequenceIndex <= 57) {
    karanaIndex11 = ((sequenceIndex - 2) % 7) + 1; // 1 to 7 (Bava to Vishti)
  } else if (sequenceIndex === 58) {
    karanaIndex11 = 8; // Shakuni
  } else if (sequenceIndex === 59) {
    karanaIndex11 = 9; // Chatushpada
  } else {
    karanaIndex11 = 10; // Naga
  }

  const def = ALL_KARANAS[karanaIndex11 - 1];

  return {
    index: karanaIndex11,
    sequenceIndex,
    name: def ? def.nameEnglish : `Karana ${karanaIndex11}`,
    nameSanskrit: def ? def.nameSanskrit : `करण ${karanaIndex11}`,
    category: def ? def.category : ("Chara" as const),
    nature: def ? def.nature : ("Auspicious" as const),
    rulingDeity: def ? def.rulingDeity : "Indra",
    fractionElapsed: Math.min(1.0, Math.max(0.0, fractionElapsed)),
  };
}

/**
 * Calculate Vara (Day Lord) from date string.
 */
export function calcVaraFromDate(dateStr: string) {
  const d = new Date(`${dateStr}T12:00:00Z`);
  const dayIndex = isNaN(d.getTime()) ? 0 : d.getUTCDay(); // 0 Sun to 6 Sat

  const VARAS = [
    {
      nameEnglish: "Ravivara (Sunday)",
      nameSanskrit: "रविवार / भानुवासर",
      rulingPlanet: "Sun",
      rulingPlanetSanskrit: "सूर्य",
      deity: "Surya Bhagavan",
    },
    {
      nameEnglish: "Somavara (Monday)",
      nameSanskrit: "सोमवार / इन्दुवासर",
      rulingPlanet: "Moon",
      rulingPlanetSanskrit: "चन्द्र",
      deity: "Chandra / Shiva",
    },
    {
      nameEnglish: "Mangalavara (Tuesday)",
      nameSanskrit: "मङ्गलवार / भौमवासर",
      rulingPlanet: "Mars",
      rulingPlanetSanskrit: "मङ्गल",
      deity: "Hanuman / Kartikeya",
    },
    {
      nameEnglish: "Budhavara (Wednesday)",
      nameSanskrit: "बुधवार / सौम्यवासर",
      rulingPlanet: "Mercury",
      rulingPlanetSanskrit: "बुध",
      deity: "Vishnu / Ganesha",
    },
    {
      nameEnglish: "Guruvara (Thursday)",
      nameSanskrit: "गुरुवार / बृहस्पतिवासर",
      rulingPlanet: "Jupiter",
      rulingPlanetSanskrit: "बृहस्पति",
      deity: "Brihaspati / Dakshinamurti",
    },
    {
      nameEnglish: "Shukravara (Friday)",
      nameSanskrit: "शुक्रवार / भृगुवासर",
      rulingPlanet: "Venus",
      rulingPlanetSanskrit: "शुक्र",
      deity: "Mahalakshmi / Durga",
    },
    {
      nameEnglish: "Shanivara (Saturday)",
      nameSanskrit: "शनिवार / मन्दवासर",
      rulingPlanet: "Saturn",
      rulingPlanetSanskrit: "शनि",
      deity: "Shani Deva / Kalabhairava",
    },
  ];

  const vara = VARAS[dayIndex];
  return {
    index: dayIndex,
    nameEnglish: vara.nameEnglish,
    nameSanskrit: vara.nameSanskrit,
    rulingPlanet: vara.rulingPlanet,
    rulingPlanetSanskrit: vara.rulingPlanetSanskrit,
    deity: vara.deity,
  };
}

/**
 * 12 Solar/Lunar Months correspondence.
 */
const TRADITIONAL_MONTHS = [
  { amanta: "Chaitra", purnimanta: "Chaitra", sanskrit: "चैत्र", ritu: "Vasanta (Spring)" },
  { amanta: "Vaishakha", purnimanta: "Vaishakha", sanskrit: "वैशाख", ritu: "Vasanta (Spring)" },
  { amanta: "Jyeshtha", purnimanta: "Jyeshtha", sanskrit: "ज्येष्ठ", ritu: "Grishma (Summer)" },
  { amanta: "Ashadha", purnimanta: "Ashadha", sanskrit: "आषाढ़", ritu: "Grishma (Summer)" },
  { amanta: "Shravana", purnimanta: "Shravana", sanskrit: "श्रावण", ritu: "Varsha (Monsoon)" },
  { amanta: "Bhadrapada", purnimanta: "Bhadrapada", sanskrit: "भाद्रपद", ritu: "Varsha (Monsoon)" },
  { amanta: "Ashvina", purnimanta: "Ashvina", sanskrit: "आश्विन", ritu: "Sharad (Autumn)" },
  { amanta: "Kartika", purnimanta: "Kartika", sanskrit: "कार्तिक", ritu: "Sharad (Autumn)" },
  {
    amanta: "Margashirsha",
    purnimanta: "Margashirsha",
    sanskrit: "मार्गशीर्ष",
    ritu: "Hemanta (Pre-Winter)",
  },
  { amanta: "Pausha", purnimanta: "Pausha", sanskrit: "पौष", ritu: "Hemanta (Pre-Winter)" },
  { amanta: "Magha", purnimanta: "Magha", sanskrit: "माघ", ritu: "Shishira (Winter)" },
  { amanta: "Phalguna", purnimanta: "Phalguna", sanskrit: "फाल्गुन", ritu: "Shishira (Winter)" },
];

/**
 * Determine Amanta and Purnimanta month names.
 * In Indian astronomy, a lunar month is named after the solar Sankranti (Rashi) in which the Amavasya occurs.
 * In Amanta, month = [Amavasya, next Amavasya).
 * In Purnimanta, Krishna Paksha is 15 days ahead (belongs to the upcoming Amanta month).
 */
export function getAmantaAndPurnimantaMonthNames(
  sunSiderealLongitudeDeg: number,
  paksha: "Shukla" | "Krishna",
): {
  amantaMonthName: string;
  amantaMonthSanskrit: string;
  purnimantaMonthName: string;
  purnimantaMonthSanskrit: string;
  monthIndex: number;
  rituNameEnglish: string;
  rituNameSanskrit: string;
  ayana: "Uttarayana" | "Dakshinayana";
} {
  const norm = normalizeDeg(sunSiderealLongitudeDeg);
  const rashiIndex = Math.floor(norm / 30); // 0 Mesha -> Vaishakha, 11 Mina -> Chaitra

  // Sun in Mesha (0°) defines Vaishakha (index 1), Sun in Mina (330°) defines Chaitra (index 0)
  const amantaIndex = (rashiIndex + 1) % 12;

  // In Purnimanta, Shukla Paksha is the SAME as Amanta.
  // Krishna Paksha in Purnimanta is named after the UPCOMING full month (i.e. +1).
  const purnimantaIndex = paksha === "Shukla" ? amantaIndex : (amantaIndex + 1) % 12;

  const amantaDef = TRADITIONAL_MONTHS[amantaIndex];
  const purnimantaDef = TRADITIONAL_MONTHS[purnimantaIndex];

  // Ayana determination
  // Uttarayana: Makar Sankranti (~270°) to Karka Sankranti (~90°)
  const isUttarayana = norm >= 270 || norm < 90;

  return {
    amantaMonthName: amantaDef.amanta,
    amantaMonthSanskrit: amantaDef.sanskrit,
    purnimantaMonthName: purnimantaDef.purnimanta,
    purnimantaMonthSanskrit: purnimantaDef.sanskrit,
    monthIndex: amantaIndex + 1,
    rituNameEnglish: amantaDef.ritu,
    rituNameSanskrit: amantaDef.ritu.split(" ")[0],
    ayana: isUttarayana ? "Uttarayana" : "Dakshinayana",
  };
}

/**
 * High-precision Keplerian orbital reduction for Sun and Moon longitudes.
 * Used as instantaneous offline fallback matching JPL DE421 within tenths of a degree.
 */
export function approximateSunMoonLongitudes(dateStr: string, timeStr = "12:00") {
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const [hourStr, minStr] = timeStr.split(":");
  const y = parseInt(yearStr, 10);
  const m = parseInt(monthStr, 10);
  const d = parseInt(dayStr, 10);
  const h = parseInt(hourStr || "12", 10) + parseInt(minStr || "0", 10) / 60;

  // Julian Day Number
  let Y = y;
  let M = m;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD =
    Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + h / 24.0 + B - 1524.5;

  const T = (JD - 2451545.0) / 36525.0; // Julian centuries from J2000.0

  // Sun Mean Longitude and Anomaly
  const L0 = normalizeDeg(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M_sun = normalizeDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const M_sun_rad = (M_sun * Math.PI) / 180;

  // Sun Equation of the Center
  const C_sun =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M_sun_rad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M_sun_rad) +
    0.000289 * Math.sin(3 * M_sun_rad);

  const sunTropical = normalizeDeg(L0 + C_sun);

  // Moon Mean Elements (Meeus Ch. 47)
  const L_moon = normalizeDeg(218.3164477 + 481267.88123421 * T);
  const D = normalizeDeg(297.8501921 + 445267.1114034 * T); // Mean elongation
  const M_moon = normalizeDeg(134.9633964 + 477198.8675055 * T); // Moon mean anomaly
  const F = normalizeDeg(93.272095 + 483202.0175233 * T); // Moon argument of latitude

  const D_rad = (D * Math.PI) / 180;
  const M_m_rad = (M_moon * Math.PI) / 180;
  const F_rad = (F * Math.PI) / 180;

  // Principal periodic terms for Moon's longitude
  const moonPerturbations =
    6.288774 * Math.sin(M_m_rad) +
    1.274027 * Math.sin(2 * D_rad - M_m_rad) + // Evection
    0.658314 * Math.sin(2 * D_rad) + // Variation
    0.213618 * Math.sin(2 * M_m_rad) -
    0.185116 * Math.sin(M_sun_rad) - // Annual equation
    0.114332 * Math.sin(2 * F_rad) +
    0.058793 * Math.sin(2 * D_rad - 2 * M_m_rad) +
    0.057066 * Math.sin(2 * D_rad - M_sun_rad - M_m_rad);

  const moonTropical = normalizeDeg(L_moon + moonPerturbations);

  // Lahiri Chitrapaksha Ayanamsha (~24.23° in 2026)
  // Epoch J2000.0 Lahiri = 23° 51' 11" = 23.853056° + 50.29"/year
  const ayanamsha = 23.853056 + 1.3963 * T;

  const sunSidereal = normalizeDeg(sunTropical - ayanamsha);
  const moonSidereal = normalizeDeg(moonTropical - ayanamsha);

  const elongation = normalizeDeg(moonTropical - sunTropical);

  // Distance estimation in km
  const distanceKm =
    384400.0 - 20905.0 * Math.cos(M_m_rad) - 3699.0 * Math.cos(2 * D_rad - M_m_rad);

  return {
    sunTropical,
    moonTropical,
    sunSidereal,
    moonSidereal,
    ayanamsha,
    elongation,
    distanceKm,
  };
}

/**
 * Generate a complete 35-day grid for the Lunar Calendar view.
 */
export function generateMonthlyLunarGrid(
  year: number,
  month: number, // 1 to 12
  selectedDateStr: string,
): LunarCalendarGridDay[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // 0 Sun to 6 Sat

  const todayStr = new Date().toISOString().split("T")[0];
  const grid: LunarCalendarGridDay[] = [];

  // Previous month trailing days
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const dStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const { elongation, moonSidereal } = approximateSunMoonLongitudes(dStr, "06:00");
    const tithi = calcTithiFromElongation(elongation);
    const nakshatra = calcNakshatraFromSidereal(moonSidereal);
    const fraction = calcIlluminatedFraction(elongation);

    grid.push({
      dateStr: dStr,
      dayOfMonth: dayNum,
      dayOfWeek: new Date(Date.UTC(prevYear, prevMonth - 1, dayNum)).getUTCDay(),
      isCurrentMonth: false,
      isSelectedDate: dStr === selectedDateStr,
      isToday: dStr === todayStr,
      tithiIndex: tithi.index,
      tithiName: tithi.name,
      tithiInPaksha: tithi.tithiInPaksha,
      paksha: tithi.paksha,
      nakshatraName: nakshatra.name,
      illuminatedFraction: fraction,
      isAmavasya: tithi.index === 30,
      isPurnima: tithi.index === 15,
      festivals: LUNAR_FESTIVALS.filter((f) => f.jumpDate === dStr),
    });
  }

  // Current month days
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dStr = `${year}-${String(month).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const { elongation, moonSidereal } = approximateSunMoonLongitudes(dStr, "06:00");
    const tithi = calcTithiFromElongation(elongation);
    const nakshatra = calcNakshatraFromSidereal(moonSidereal);
    const fraction = calcIlluminatedFraction(elongation);

    grid.push({
      dateStr: dStr,
      dayOfMonth: dayNum,
      dayOfWeek: new Date(Date.UTC(year, month - 1, dayNum)).getUTCDay(),
      isCurrentMonth: true,
      isSelectedDate: dStr === selectedDateStr,
      isToday: dStr === todayStr,
      tithiIndex: tithi.index,
      tithiName: tithi.name,
      tithiInPaksha: tithi.tithiInPaksha,
      paksha: tithi.paksha,
      nakshatraName: nakshatra.name,
      illuminatedFraction: fraction,
      isAmavasya: tithi.index === 30,
      isPurnima: tithi.index === 15,
      festivals: LUNAR_FESTIVALS.filter((f) => f.jumpDate === dStr),
    });
  }

  // Next month leading days to complete full weeks (up to 35 or 42 cells)
  const remainingCells = (7 - (grid.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const dStr = `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const { elongation, moonSidereal } = approximateSunMoonLongitudes(dStr, "06:00");
    const tithi = calcTithiFromElongation(elongation);
    const nakshatra = calcNakshatraFromSidereal(moonSidereal);
    const fraction = calcIlluminatedFraction(elongation);

    grid.push({
      dateStr: dStr,
      dayOfMonth: i,
      dayOfWeek: new Date(Date.UTC(nextYear, nextMonth - 1, i)).getUTCDay(),
      isCurrentMonth: false,
      isSelectedDate: dStr === selectedDateStr,
      isToday: dStr === todayStr,
      tithiIndex: tithi.index,
      tithiName: tithi.name,
      tithiInPaksha: tithi.tithiInPaksha,
      paksha: tithi.paksha,
      nakshatraName: nakshatra.name,
      illuminatedFraction: fraction,
      isAmavasya: tithi.index === 30,
      isPurnima: tithi.index === 15,
      festivals: LUNAR_FESTIVALS.filter((f) => f.jumpDate === dStr),
    });
  }

  return grid;
}

/**
 * Compute the complete state of the Moon and Panchang limbs from given parameters.
 */
export function computeCompleteLunarState(
  dateStr: string,
  timeStr: string,
  overrides?: {
    elongationDeg?: number;
    sunTropicalDeg?: number;
    moonTropicalDeg?: number;
    sunSiderealDeg?: number;
    moonSiderealDeg?: number;
    ayanamshaDeg?: number;
    tithiRemainingHours?: number;
    tithiTransitionLocal?: string;
  },
): {
  moonState: MoonPhysicalState;
  panchangLimbs: PanchangLimbsState;
  lunarMonth: LunarMonthState;
} {
  const approx = approximateSunMoonLongitudes(dateStr, timeStr);

  const elongationDeg = overrides?.elongationDeg ?? approx.elongation;
  const sunTropical = overrides?.sunTropicalDeg ?? approx.sunTropical;
  const moonTropical = overrides?.moonTropicalDeg ?? approx.moonTropical;
  const sunSidereal = overrides?.sunSiderealDeg ?? approx.sunSidereal;
  const moonSidereal = overrides?.moonSiderealDeg ?? approx.moonSidereal;
  const ayanamsha = overrides?.ayanamshaDeg ?? approx.ayanamsha;

  const illuminatedFraction = calcIlluminatedFraction(elongationDeg);
  const phaseDef = getPhaseDefinition(elongationDeg);
  const isWaxing = elongationDeg < 180;
  const synodicDay = (elongationDeg / 360.0) * LUNAR_SYNODIC_MONTH_DAYS;

  const tithiCalc = calcTithiFromElongation(elongationDeg);
  const nakshatraCalc = calcNakshatraFromSidereal(moonSidereal);
  const yogaCalc = calcYogaFromSidereal(moonSidereal, sunSidereal);
  const karanaCalc = calcKaranaFromElongation(elongationDeg);
  const varaCalc = calcVaraFromDate(dateStr);

  const monthInfo = getAmantaAndPurnimantaMonthNames(sunSidereal, tithiCalc.paksha);

  // Approximate Samvat years for 2026
  const kaliyugaYear = 5127;
  const vikramaSamvat = 2083;
  const shakaSamvat = 1948;

  const moonState: MoonPhysicalState = {
    elongationDeg,
    phaseAngleDeg: Math.abs(180 - elongationDeg),
    illuminatedFraction,
    illuminationPercent: Math.round(illuminatedFraction * 100),
    isWaxing,
    phaseId: phaseDef.id,
    phaseNameEnglish: phaseDef.nameEnglish,
    phaseNameSanskrit: phaseDef.nameSanskrit,
    sunTropicalLongitudeDeg: sunTropical,
    moonTropicalLongitudeDeg: moonTropical,
    sunSiderealLongitudeDeg: sunSidereal,
    moonSiderealLongitudeDeg: moonSidereal,
    ayanamshaDeg: ayanamsha,
    distanceKm: approx.distanceKm,
    synodicDay,
  };

  const panchangLimbs: PanchangLimbsState = {
    tithi: {
      index: tithiCalc.index,
      name: tithiCalc.name,
      nameSanskrit: tithiCalc.nameSanskrit,
      paksha: tithiCalc.paksha,
      tithiInPaksha: tithiCalc.tithiInPaksha,
      category: tithiCalc.category,
      rulingDeity: tithiCalc.rulingDeity,
      fractionElapsed: tithiCalc.fractionElapsed,
      elapsedDeg: tithiCalc.elapsedDeg,
      remainingHours: overrides?.tithiRemainingHours,
      transitionTimeLocal: overrides?.tithiTransitionLocal,
    },
    vara: varaCalc,
    nakshatra: {
      index: nakshatraCalc.index,
      name: nakshatraCalc.name,
      nameSanskrit: nakshatraCalc.nameSanskrit,
      pada: nakshatraCalc.pada,
      fractionElapsed: nakshatraCalc.fractionElapsed,
      rulingDeity: nakshatraCalc.rulingDeity,
      planetaryLord: nakshatraCalc.planetaryLord,
      symbol: nakshatraCalc.symbol,
      yogataraWesternName: nakshatraCalc.yogataraWesternName,
    },
    yoga: {
      index: yogaCalc.index,
      name: yogaCalc.name,
      nameSanskrit: yogaCalc.nameSanskrit,
      nature: yogaCalc.nature,
      fractionElapsed: yogaCalc.fractionElapsed,
      rulingDeity: yogaCalc.rulingDeity,
    },
    karana: {
      index: karanaCalc.index,
      name: karanaCalc.name,
      nameSanskrit: karanaCalc.nameSanskrit,
      category: karanaCalc.category,
      nature: karanaCalc.nature,
      rulingDeity: karanaCalc.rulingDeity,
    },
  };

  const lunarMonth: LunarMonthState = {
    amantaMonthName: monthInfo.amantaMonthName,
    amantaMonthSanskrit: monthInfo.amantaMonthSanskrit,
    purnimantaMonthName: monthInfo.purnimantaMonthName,
    purnimantaMonthSanskrit: monthInfo.purnimantaMonthSanskrit,
    monthIndex: monthInfo.monthIndex,
    isAdhikaMasa: false,
    rituNameEnglish: monthInfo.rituNameEnglish,
    rituNameSanskrit: monthInfo.rituNameSanskrit,
    ayana: monthInfo.ayana,
    kaliyugaYear,
    vikramaSamvat,
    shakaSamvat,
  };

  return { moonState, panchangLimbs, lunarMonth };
}
