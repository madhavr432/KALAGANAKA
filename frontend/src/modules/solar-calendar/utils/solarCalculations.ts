/**
 * High-Precision Astronomical Calculations for Module 2: Solar Calendar.
 * Computes Keplerian Earth-Sun orbital coordinates, tropical (Sayana) and
 * sidereal (Nirayana) solar longitudes, Ayanamsha, declination, and seasons.
 */

import { SOLAR_RASHIS, ASTRONOMICAL_STATIONS } from "../constants/solarConstants";
import {
  SolarCalculatedValues,
  RashiDetail,
  AstronomicalStationEvent,
} from "../types/solarCalendar";

/** Check if a Gregorian year is a leap year. */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Get total number of days in a given year. */
export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/** Compute 1-based day of the year (1 to 365 or 366). */
export function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/** Construct Date from year and 1-based day of year. */
export function getDateFromDayOfYear(year: number, dayOfYear: number): Date {
  const date = new Date(Date.UTC(year, 0, 1));
  date.setUTCDate(dayOfYear);
  return date;
}

/** Format degrees as decimal string with symbol. */
export function formatDegrees(deg: number, precision = 2): string {
  const norm = ((deg % 360) + 360) % 360;
  return `${norm.toFixed(precision)}°`;
}

/** Format degrees into traditional Degrees, Minutes, Seconds (DMS). */
export function formatDMS(deg: number): string {
  const norm = ((deg % 360) + 360) % 360;
  const d = Math.floor(norm);
  const mFloat = (norm - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}° ${m.toString().padStart(2, "0")}' ${s.toString().padStart(2, "0")}"`;
}

/** Determine the traditional 6 Indian Ritus (Seasons). */
export function getIndianRitu(siderealDeg: number): { name: string; sanskrit: string } {
  // 12 Rashis / 6 Ritus = 2 Rashis (60°) per Ritu
  // 330° (Meena) to 30° (Mesha) = Vasant
  // 30° (Vrishabha) to 90° (Mithuna) = Grishma
  // 90° (Karka) to 150° (Simha) = Varsha
  // 150° (Kanya) to 210° (Tula) = Sharad
  // 210° (Vrischika) to 270° (Dhanu) = Hemanta
  // 270° (Makara) to 330° (Kumbha) = Shishira
  const norm = ((siderealDeg % 360) + 360) % 360;
  if (norm >= 330 || norm < 30) {
    return { name: "Vasant (Spring)", sanskrit: "वसन्त ऋतु" };
  } else if (norm >= 30 && norm < 90) {
    return { name: "Grishma (Summer)", sanskrit: "ग्रीष्म ऋतु" };
  } else if (norm >= 90 && norm < 150) {
    return { name: "Varsha (Monsoon)", sanskrit: "वर्षा ऋतु" };
  } else if (norm >= 150 && norm < 210) {
    return { name: "Sharad (Autumn)", sanskrit: "शरद् ऋतु" };
  } else if (norm >= 210 && norm < 270) {
    return { name: "Hemanta (Pre-Winter)", sanskrit: "हेमन्त ऋतु" };
  } else {
    return { name: "Shishira (Late Winter)", sanskrit: "शिशिर ऋतु" };
  }
}

/** Determine Western Tropical Season. */
export function getTropicalSeason(tropicalDeg: number): string {
  const norm = ((tropicalDeg % 360) + 360) % 360;
  if (norm >= 0 && norm < 90) return "Astronomical Spring (Vernal)";
  if (norm >= 90 && norm < 180) return "Astronomical Summer (Estival)";
  if (norm >= 180 && norm < 270) return "Astronomical Autumn (Autumnal)";
  return "Astronomical Winter (Hibernal)";
}

/**
 * Primary calculation engine: Computes the complete solar and orbital parameters
 * for any given date and time.
 */
export function calculateSolarValues(
  dateStr: string,
  timeStr = "12:00",
  backendOverride?: {
    tropicalLong?: number;
    siderealLong?: number;
    ayanamsha?: number;
  },
): SolarCalculatedValues {
  const parts = dateStr.split("-").map(Number);
  const year = parts[0] || 2026;
  const month = (parts[1] || 1) - 1;
  const day = parts[2] || 1;

  const timeParts = timeStr.split(":").map(Number);
  const hour = timeParts[0] || 12;
  const minute = timeParts[1] || 0;

  const dateObj = new Date(Date.UTC(year, month, day, hour, minute));
  const leap = isLeapYear(year);
  const totalDays = getDaysInYear(year);
  const dayOfYear = getDayOfYear(dateObj);
  const fractionOfDay = (hour + minute / 60) / 24;
  const exactDayNumber = dayOfYear + fractionOfDay;
  const fractionOfYear = exactDayNumber / totalDays;

  // 1. Orbital Mechanics (Keplerian Solar Approximation):
  // Earth's perihelion occurs ~Jan 3 (day 3.25)
  // Mean anomaly M:
  const meanAnomalyRad = ((2 * Math.PI) / totalDays) * (exactDayNumber - 3.25);
  const meanAnomalyDeg = ((meanAnomalyRad * 180) / Math.PI + 360) % 360;

  // Equation of center C (due to orbital eccentricity e = 0.0167):
  const e = 0.0167086;
  const sinM = Math.sin(meanAnomalyRad);
  const sin2M = Math.sin(2 * meanAnomalyRad);
  const equationOfCenterDeg =
    ((2 * e - (e * e * e) / 4) * sinM + (5 / 4) * e * e * sin2M) * (180 / Math.PI);

  // True Anomaly ν:
  const trueAnomalyDeg = (meanAnomalyDeg + equationOfCenterDeg + 360) % 360;
  const trueAnomalyRad = (trueAnomalyDeg * Math.PI) / 180;

  // Earth-Sun distance R:
  // R = a * (1 - e^2) / (1 + e * cos(ν))
  const earthSunDistanceAU = (1 - e * e) / (1 + e * Math.cos(trueAnomalyRad));
  const earthSunDistanceKm = earthSunDistanceAU * 149597870.7;

  // 2. Solar Ecliptic Longitude (Sayana / Tropical):
  // Longitude of perihelion ϖ ≈ 282.94°
  // λ_trop = ν + ϖ
  const perihelionLongDeg = 282.9404 + 0.000047 * (year - 2000);
  let sunTropicalLongitudeDeg = (trueAnomalyDeg + perihelionLongDeg + 360) % 360;

  // 3. Lahiri Ayanamsha:
  // Standard Chitrapaksha formula: 23° 51' 25.53" at J2000.0 + 50.290966"/year
  const tYears = year - 2000 + (dayOfYear + fractionOfDay) / totalDays;
  let ayanamshaDeg = 23.85709 + tYears * (50.290966 / 3600);
  const ayanamshaName = "Lahiri (Chitrapaksha)";

  // 4. Sidereal Solar Longitude (Nirayana):
  // λ_sid = λ_trop - Ayanamsha
  let sunSiderealLongitudeDeg = (sunTropicalLongitudeDeg - ayanamshaDeg + 360) % 360;

  // Override with high-precision JPL DE421 backend results if provided
  if (backendOverride?.tropicalLong !== undefined) {
    sunTropicalLongitudeDeg = backendOverride.tropicalLong;
  }
  if (backendOverride?.ayanamsha !== undefined) {
    ayanamshaDeg = backendOverride.ayanamsha;
  }
  if (backendOverride?.siderealLong !== undefined) {
    sunSiderealLongitudeDeg = backendOverride.siderealLong;
  } else if (
    backendOverride?.tropicalLong !== undefined &&
    backendOverride?.ayanamsha !== undefined
  ) {
    sunSiderealLongitudeDeg =
      (((backendOverride.tropicalLong - backendOverride.ayanamsha) % 360) + 360) % 360;
  }

  // 5. Solar Declination δ:
  // sin(δ) = sin(ε) * sin(λ_trop), where obliquity ε ≈ 23.43929°
  const obliquityRad = (23.43929 * Math.PI) / 180;
  const tropRad = (sunTropicalLongitudeDeg * Math.PI) / 180;
  const sinDeclination = Math.sin(obliquityRad) * Math.sin(tropRad);
  const solarDeclinationDeg = (Math.asin(sinDeclination) * 180) / Math.PI;

  // 6. Earth's Position on 3D Orbit:
  // Earth is directly opposite to the Sun from heliocentric viewpoint:
  // Heliocentric Earth angle = λ_trop + 180°
  // Visual radius (with slight exaggerated eccentricity for educational clarity):
  // Exaggerate eccentricity to e_vis = 0.08 so users can visually appreciate the ellipse
  const visualScale = 8.5;
  const visualEccentricity = 0.07;
  const visualRadius =
    visualScale *
    ((1 - visualEccentricity * visualEccentricity) /
      (1 + visualEccentricity * Math.cos(trueAnomalyRad)));

  // Angle along orbit: Vernal equinox λ_trop = 0° places Earth on negative X axis
  const earthOrbitX = -visualRadius * Math.cos(tropRad);
  const earthOrbitZ = -visualRadius * Math.sin(tropRad);

  // 7. Rashis, Solar Days, and Sankranti:
  const rashiIndex = Math.floor(sunSiderealLongitudeDeg / 30);
  const currentRashi = SOLAR_RASHIS[rashiIndex] || SOLAR_RASHIS[0];
  const nextRashi = SOLAR_RASHIS[(rashiIndex + 1) % 12];
  const degInRashi = sunSiderealLongitudeDeg % 30;
  const solarDayInMonth = Math.floor(degInRashi) + 1;
  const remainingDegToSankranti = 30 - degInRashi;
  // Mean solar motion ≈ 0.9856° / day
  const approxDaysToSankranti = Number((remainingDegToSankranti / 0.9856).toFixed(1));

  // 8. Nearest Astronomical Station:
  let minStationDiff = Infinity;
  let activeStation: AstronomicalStationEvent | null = null;
  for (const station of ASTRONOMICAL_STATIONS) {
    let diff = Math.abs(sunTropicalLongitudeDeg - station.tropicalLongitudeDeg);
    if (diff > 180) diff = 360 - diff;
    if (diff < minStationDiff) {
      minStationDiff = diff;
      activeStation = station;
    }
  }
  const isNearStation = minStationDiff <= 3.5;

  // Seasons:
  const indianRituObj = getIndianRitu(sunSiderealLongitudeDeg);
  const tropicalSeason = getTropicalSeason(sunTropicalLongitudeDeg);

  return {
    dayOfYear,
    totalDaysInYear: totalDays,
    isLeapYear: leap,
    fractionOfYear,
    meanAnomalyDeg,
    trueAnomalyDeg,
    earthSunDistanceAU,
    earthSunDistanceKm,
    sunTropicalLongitudeDeg,
    sunSiderealLongitudeDeg,
    ayanamshaDeg,
    ayanamshaName,
    solarDeclinationDeg,
    equationOfCenterDeg,
    earthOrbitX,
    earthOrbitZ,
    indianRitu: indianRituObj.name,
    indianRituSanskrit: indianRituObj.sanskrit,
    tropicalSeason,
    currentRashi,
    nextRashi,
    degInRashi,
    solarDayInMonth,
    remainingDegToSankranti,
    approxDaysToSankranti,
    isNearStation,
    activeStation,
  };
}
