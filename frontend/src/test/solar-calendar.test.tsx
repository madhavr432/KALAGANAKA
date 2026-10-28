/**
 * Unit Test Suite for Module 2: Solar Calendar & Solar Festivals.
 * Validates astronomical mechanics, leap-year handling, Ayanamsha precession,
 * Rashi boundaries, and solar festival datasets.
 */

import { describe, expect, it } from "vitest";
import {
  isLeapYear,
  getDaysInYear,
  getDayOfYear,
  getDateFromDayOfYear,
  calculateSolarValues,
  formatDegrees,
  formatDMS,
  getIndianRitu,
  getTropicalSeason,
} from "@/modules/solar-calendar/utils/solarCalculations";
import {
  SOLAR_RASHIS,
  ASTRONOMICAL_STATIONS,
  SOLAR_FESTIVALS,
  SOLAR_INFO_METRICS,
} from "@/modules/solar-calendar/constants/solarConstants";

describe("Module 2: Calendar & Leap-Year Arithmetic", () => {
  it("correctly identifies leap years across centuries", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2026)).toBe(false);
    expect(isLeapYear(2000)).toBe(true); // Century divisible by 400
    expect(isLeapYear(1900)).toBe(false); // Century not divisible by 400
    expect(isLeapYear(2028)).toBe(true);
  });

  it("returns 366 days for leap years and 365 for regular years", () => {
    expect(getDaysInYear(2024)).toBe(366);
    expect(getDaysInYear(2026)).toBe(365);
    expect(getDaysInYear(2000)).toBe(366);
    expect(getDaysInYear(2100)).toBe(365);
  });

  it("calculates day of year accurately and roundtrips with getDateFromDayOfYear", () => {
    const jan1 = new Date(Date.UTC(2026, 0, 1));
    expect(getDayOfYear(jan1)).toBe(1);

    const feb28 = new Date(Date.UTC(2026, 1, 28));
    expect(getDayOfYear(feb28)).toBe(59);

    const mar1Regular = new Date(Date.UTC(2026, 2, 1));
    expect(getDayOfYear(mar1Regular)).toBe(60);

    const mar1Leap = new Date(Date.UTC(2024, 2, 1));
    expect(getDayOfYear(mar1Leap)).toBe(61); // Due to Feb 29

    // Roundtrip verification
    const recoveredDate = getDateFromDayOfYear(2026, 60);
    expect(recoveredDate.getUTCMonth()).toBe(2); // March
    expect(recoveredDate.getUTCDate()).toBe(1);
  });
});

describe("Module 2: Keplerian Solar Coordinates & Seasonal Stations", () => {
  it("calculates Vernal Equinox near ~March 20 with tropical longitude close to 0°", () => {
    const res = calculateSolarValues("2026-03-20", "12:00");
    // Vernal Equinox Sun is right at 0° Tropical (within 2° boundary)
    const isCloseToZero = res.sunTropicalLongitudeDeg <= 2 || res.sunTropicalLongitudeDeg >= 358;
    expect(isCloseToZero).toBe(true);
    expect(Math.abs(res.solarDeclinationDeg)).toBeLessThan(1.5); // Near celestial equator
  });

  it("calculates Summer Solstice near ~June 21 with tropical longitude close to 90° and +23.44° declination", () => {
    const res = calculateSolarValues("2026-06-21", "12:00");
    expect(res.sunTropicalLongitudeDeg).toBeGreaterThanOrEqual(88);
    expect(res.sunTropicalLongitudeDeg).toBeLessThanOrEqual(92);
    expect(res.solarDeclinationDeg).toBeGreaterThan(22.5); // Peak northward declination
    expect(res.tropicalSeason).toContain("Summer");
  });

  it("calculates Winter Solstice near ~December 21 with tropical longitude close to 270° and -23.44° declination", () => {
    const res = calculateSolarValues("2026-12-21", "12:00");
    expect(res.sunTropicalLongitudeDeg).toBeGreaterThanOrEqual(268);
    expect(res.sunTropicalLongitudeDeg).toBeLessThanOrEqual(272);
    expect(res.solarDeclinationDeg).toBeLessThan(-22.5); // Peak southward declination

    // By Dec 22, the Sun has fully crossed into Astronomical Winter (λ_trop >= 270°)
    const resWinter = calculateSolarValues("2026-12-22", "12:00");
    expect(resWinter.tropicalSeason).toContain("Winter");
  });

  it("demonstrates why Makar Sankranti does NOT coincide with the Winter Solstice due to Ayanamsha", () => {
    // On December 21 (Winter Solstice), Tropical Sun is at 270°
    const solstice = calculateSolarValues("2026-12-21", "12:00");
    expect(solstice.sunTropicalLongitudeDeg).toBeGreaterThanOrEqual(269);

    // But Sidereal Sun is only at ~245.8° (Dhanu), NOT Makara (270°)!
    expect(solstice.sunSiderealLongitudeDeg).toBeLessThan(250);
    expect(solstice.currentRashi.englishName).toBe("Sagittarius"); // Dhanu

    // On January 14 (Makar Sankranti), Sidereal Sun reaches Makara (270°)!
    const makarSankranti = calculateSolarValues("2026-01-14", "12:00");
    expect(makarSankranti.sunSiderealLongitudeDeg).toBeGreaterThanOrEqual(268.5);
    expect(makarSankranti.sunSiderealLongitudeDeg).toBeLessThan(275);
    expect(makarSankranti.currentRashi.englishName).toBe("Capricorn"); // Makara
  });

  it("confirms Earth is closest to Sun in January (Perihelion) and farthest in July (Aphelion)", () => {
    const perihelion = calculateSolarValues("2026-01-03", "12:00");
    const aphelion = calculateSolarValues("2026-07-04", "12:00");

    // Earth-Sun distance in AU
    expect(perihelion.earthSunDistanceAU).toBeLessThan(0.985);
    expect(aphelion.earthSunDistanceAU).toBeGreaterThan(1.014);
    expect(perihelion.earthSunDistanceAU).toBeLessThan(aphelion.earthSunDistanceAU);
  });
});

describe("Module 2: 12-Sign Zodiac & Regional Calendar Systems", () => {
  it("contains all 12 Rashis spanning exactly 360 degrees", () => {
    expect(SOLAR_RASHIS).toHaveLength(12);

    let totalSpan = 0;
    SOLAR_RASHIS.forEach((rashi, idx) => {
      expect(rashi.index).toBe(idx + 1);
      expect(rashi.startDeg).toBe(idx * 30);
      expect(rashi.endDeg).toBe((idx + 1) * 30);
      totalSpan += rashi.endDeg - rashi.startDeg;

      // Verify regional solar month names exist
      expect(rashi.solarMonthNorth).toBeTruthy();
      expect(rashi.solarMonthTamil).toBeTruthy();
      expect(rashi.solarMonthBengali).toBeTruthy();
      expect(rashi.solarMonthMalayalam).toBeTruthy();
      expect(rashi.solarMonthOdia).toBeTruthy();
    });

    expect(totalSpan).toBe(360);
  });

  it("correctly identifies Indian Ritus (Seasons) across the sidereal zodiac", () => {
    expect(getIndianRitu(0).name).toContain("Vasant"); // Mesha 0°
    expect(getIndianRitu(45).name).toContain("Grishma"); // Vrishabha 45°
    expect(getIndianRitu(105).name).toContain("Varsha"); // Karka 105°
    expect(getIndianRitu(165).name).toContain("Sharad"); // Kanya 165°
    expect(getIndianRitu(225).name).toContain("Hemanta"); // Vrischika 225°
    expect(getIndianRitu(285).name).toContain("Shishira"); // Makara 285°
  });
});

describe("Module 2: Solar Festivals Knowledge Dataset", () => {
  it("contains key pan-Indian and regional solar festivals", () => {
    const festivalIds = SOLAR_FESTIVALS.map((f) => f.id);

    expect(festivalIds).toContain("makar-sankranti");
    expect(festivalIds).toContain("pongal");
    expect(festivalIds).toContain("mesha-sankranti");
    expect(festivalIds).toContain("puthandu");
    expect(festivalIds).toContain("vishu");
    expect(festivalIds).toContain("poila-boishakh");
    expect(festivalIds).toContain("pana-sankranti");
    expect(festivalIds).toContain("baisakhi");
    expect(festivalIds).toContain("karka-sankranti");
    expect(festivalIds).toContain("chhath-puja");
    expect(festivalIds).toContain("ratha-saptami");
  });

  it("ensures each festival has verified astronomical basis, cultural notes, and observance rules", () => {
    SOLAR_FESTIVALS.forEach((festival) => {
      expect(festival.name).toBeTruthy();
      expect(festival.sanskritName).toBeTruthy();
      expect(festival.solarTarget).toBeTruthy();
      expect(festival.astronomicalBasis).toBeTruthy();
      expect(festival.culturalSignificance).toBeTruthy();
      expect(festival.observanceRule).toBeTruthy();
      expect(festival.defaultDate.month).toBeGreaterThanOrEqual(1);
      expect(festival.defaultDate.month).toBeLessThanOrEqual(12);
      expect(festival.defaultDate.day).toBeGreaterThanOrEqual(1);
      expect(festival.defaultDate.day).toBeLessThanOrEqual(31);
    });
  });

  it("verifies astronomical info metrics for all key readings", () => {
    expect(SOLAR_INFO_METRICS.tropicalLongitude).toBeDefined();
    expect(SOLAR_INFO_METRICS.siderealLongitude).toBeDefined();
    expect(SOLAR_INFO_METRICS.ayanamsha).toBeDefined();
    expect(SOLAR_INFO_METRICS.sankranti).toBeDefined();
    expect(SOLAR_INFO_METRICS.makarPrecession).toBeDefined();
    expect(SOLAR_INFO_METRICS.seasonsAxialTilt).toBeDefined();

    Object.values(SOLAR_INFO_METRICS).forEach((metric) => {
      expect(metric.title).toBeTruthy();
      expect(metric.plainSummary).toBeTruthy();
      expect(metric.formula).toBeTruthy();
      expect(metric.steps.length).toBeGreaterThan(0);
      expect(metric.source).toBeTruthy();
    });
  });
});
