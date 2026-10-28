/**
 * lunar-calendar.test.tsx
 * Comprehensive unit test suite for Module 3: Lunar Calendar, Panchang & Lunar Festivals.
 */

import { describe, it, expect } from "vitest";
import {
  normalizeDeg,
  calcIlluminatedFraction,
  getPhaseDefinition,
  calcTithiFromElongation,
  calcNakshatraFromSidereal,
  calcYogaFromSidereal,
  calcKaranaFromElongation,
  calcVaraFromDate,
  getAmantaAndPurnimantaMonthNames,
  approximateSunMoonLongitudes,
  generateMonthlyLunarGrid,
  computeCompleteLunarState,
} from "@/modules/lunar-calendar/utils/lunarCalculations";
import {
  ALL_TITHIS,
  ALL_NAKSHATRAS,
  ALL_YOGAS,
  ALL_KARANAS,
  LUNAR_PHASES,
  LUNAR_FESTIVALS,
} from "@/modules/lunar-calendar/constants/lunarConstants";

describe("Lunar Calendar Mathematical Foundations", () => {
  it("normalizes angles into [0, 360) degrees", () => {
    expect(normalizeDeg(0)).toBe(0);
    expect(normalizeDeg(360)).toBe(0);
    expect(normalizeDeg(725)).toBe(5);
    expect(normalizeDeg(-90)).toBe(270);
    expect(normalizeDeg(-365)).toBe(355);
  });

  it("calculates illuminated fraction k = (1 - cos(theta)) / 2 accurately", () => {
    // New Moon: 0° elongation -> k = 0
    expect(calcIlluminatedFraction(0)).toBeCloseTo(0.0, 5);

    // First Quarter: 90° elongation -> k = 0.5
    expect(calcIlluminatedFraction(90)).toBeCloseTo(0.5, 5);

    // Full Moon: 180° elongation -> k = 1.0
    expect(calcIlluminatedFraction(180)).toBeCloseTo(1.0, 5);

    // Third Quarter: 270° elongation -> k = 0.5
    expect(calcIlluminatedFraction(270)).toBeCloseTo(0.5, 5);
  });

  it("identifies all 8 principal lunar phases correctly", () => {
    expect(getPhaseDefinition(0).id).toBe("new-moon");
    expect(getPhaseDefinition(45).id).toBe("waxing-crescent");
    expect(getPhaseDefinition(90).id).toBe("first-quarter");
    expect(getPhaseDefinition(135).id).toBe("waxing-gibbous");
    expect(getPhaseDefinition(180).id).toBe("full-moon");
    expect(getPhaseDefinition(225).id).toBe("waning-gibbous");
    expect(getPhaseDefinition(270).id).toBe("third-quarter");
    expect(getPhaseDefinition(315).id).toBe("waning-crescent");
  });

  it("calculates Tithi index, Paksha, and elapsed fraction across 30 Tithis", () => {
    // 0° to 12°: Shukla Pratipada (Tithi 1)
    const tithi1 = calcTithiFromElongation(3.0);
    expect(tithi1.index).toBe(1);
    expect(tithi1.name).toBe("Pratipada");
    expect(tithi1.paksha).toBe("Shukla");
    expect(tithi1.tithiInPaksha).toBe(1);
    expect(tithi1.fractionElapsed).toBeCloseTo(3.0 / 12.0, 4);

    // 84° to 96°: Shukla Ashtami (Tithi 8)
    const tithi8 = calcTithiFromElongation(88.0);
    expect(tithi8.index).toBe(8);
    expect(tithi8.name).toBe("Ashtami");
    expect(tithi8.paksha).toBe("Shukla");
    expect(tithi8.tithiInPaksha).toBe(8);

    // 168° to 180°: Purnima (Tithi 15)
    const tithi15 = calcTithiFromElongation(175.0);
    expect(tithi15.index).toBe(15);
    expect(tithi15.name).toBe("Purnima");
    expect(tithi15.paksha).toBe("Shukla");
    expect(tithi15.tithiInPaksha).toBe(15);

    // 180° to 192°: Krishna Pratipada (Tithi 16)
    const tithi16 = calcTithiFromElongation(185.0);
    expect(tithi16.index).toBe(16);
    expect(tithi16.name).toBe("Pratipada");
    expect(tithi16.paksha).toBe("Krishna");
    expect(tithi16.tithiInPaksha).toBe(1);

    // 348° to 360°: Amavasya (Tithi 30)
    const tithi30 = calcTithiFromElongation(355.0);
    expect(tithi30.index).toBe(30);
    expect(tithi30.name).toBe("Amavasya");
    expect(tithi30.paksha).toBe("Krishna");
    expect(tithi30.tithiInPaksha).toBe(15);
  });

  it("calculates Nakshatras and Padas correctly across the 27 sidereal divisions", () => {
    // 0°: Ashwini Pada 1
    const n1 = calcNakshatraFromSidereal(1.0);
    expect(n1.index).toBe(1);
    expect(n1.name).toBe("Ashwini");
    expect(n1.pada).toBe(1);

    // 10°: Ashwini Pada 4 (since 10° > 3 * 3.333°)
    const n1_p4 = calcNakshatraFromSidereal(11.0);
    expect(n1_p4.index).toBe(1);
    expect(n1_p4.pada).toBe(4);

    // 13°20' = 13.333°: Bharani
    const n2 = calcNakshatraFromSidereal(15.0);
    expect(n2.index).toBe(2);
    expect(n2.name).toBe("Bharani");

    // 350°: Revati (Nakshatra 27)
    const n27 = calcNakshatraFromSidereal(350.0);
    expect(n27.index).toBe(27);
    expect(n27.name).toBe("Revati");
  });

  it("calculates Yogas correctly from combined sidereal longitudes", () => {
    // Sum = 5° -> Yoga 1 (Vishkambha)
    const y1 = calcYogaFromSidereal(2.0, 3.0);
    expect(y1.index).toBe(1);
    expect(y1.name).toBe("Vishkambha");

    // Sum = 15° -> Yoga 2 (Priti)
    const y2 = calcYogaFromSidereal(10.0, 5.0);
    expect(y2.index).toBe(2);
    expect(y2.name).toBe("Priti");
  });

  it("calculates Karana half-tithis across Chara and Sthira classes", () => {
    // 0° to 6°: Kimstughna (Sthira, index 11)
    const k1 = calcKaranaFromElongation(3.0);
    expect(k1.index).toBe(11);
    expect(k1.name).toBe("Kimstughna");
    expect(k1.category).toBe("Sthira");

    // 6° to 12°: Bava (Chara, index 1)
    const k2 = calcKaranaFromElongation(8.0);
    expect(k2.index).toBe(1);
    expect(k2.name).toBe("Bava");
    expect(k2.category).toBe("Chara");

    // Krishna Chaturdashi 2nd half (342° to 348°): Shakuni (Sthira, index 8)
    const k58 = calcKaranaFromElongation(345.0);
    expect(k58.index).toBe(8);
    expect(k58.name).toBe("Shakuni");
    expect(k58.category).toBe("Sthira");

    // Amavasya 1st half (348° to 354°): Chatushpada (Sthira, index 9)
    const k59 = calcKaranaFromElongation(350.0);
    expect(k59.index).toBe(9);
    expect(k59.name).toBe("Chatushpada");
    expect(k59.category).toBe("Sthira");

    // Amavasya 2nd half (354° to 360°): Naga (Sthira, index 10)
    const k60 = calcKaranaFromElongation(357.0);
    expect(k60.index).toBe(10);
    expect(k60.name).toBe("Naga");
    expect(k60.category).toBe("Sthira");
  });

  it("determines Vara (Day Lord) accurately", () => {
    // 2026-10-29 is a Thursday (Guruvara)
    const vThu = calcVaraFromDate("2026-10-29");
    expect(vThu.index).toBe(4);
    expect(vThu.nameEnglish).toContain("Thursday");
    expect(vThu.rulingPlanet).toBe("Jupiter");

    // 2026-10-25 is a Sunday (Ravivara)
    const vSun = calcVaraFromDate("2026-10-25");
    expect(vSun.index).toBe(0);
    expect(vSun.nameEnglish).toContain("Sunday");
    expect(vSun.rulingPlanet).toBe("Sun");
  });

  it("resolves Amanta vs Purnimanta month names correctly", () => {
    // When Sun is in Tula (195° sidereal), month is Kartika
    const mShukla = getAmantaAndPurnimantaMonthNames(195, "Shukla");
    expect(mShukla.amantaMonthName).toBe("Kartika");
    expect(mShukla.purnimantaMonthName).toBe("Kartika"); // Identical in Shukla!

    const mKrishna = getAmantaAndPurnimantaMonthNames(195, "Krishna");
    expect(mKrishna.amantaMonthName).toBe("Kartika");
    expect(mKrishna.purnimantaMonthName).toBe("Margashirsha"); // Purnimanta is +1 in Krishna!
  });

  it("computes complete lunar state without errors", () => {
    const res = computeCompleteLunarState("2026-10-29", "06:00");
    expect(res.moonState.distanceKm).toBeGreaterThan(350000);
    expect(res.moonState.distanceKm).toBeLessThan(410000);
    expect(res.panchangLimbs.tithi.index).toBeGreaterThanOrEqual(1);
    expect(res.panchangLimbs.tithi.index).toBeLessThanOrEqual(30);
    expect(res.panchangLimbs.nakshatra.index).toBeGreaterThanOrEqual(1);
    expect(res.panchangLimbs.nakshatra.index).toBeLessThanOrEqual(27);
  });

  it("generates a monthly lunar grid with valid day cells", () => {
    const grid = generateMonthlyLunarGrid(2026, 10, "2026-10-29");
    expect(grid.length).toBeGreaterThanOrEqual(35);
    const selected = grid.find((g) => g.isSelectedDate);
    expect(selected?.dateStr).toBe("2026-10-29");
  });

  it("ensures all constant collections are complete and well-formed", () => {
    expect(ALL_TITHIS).toHaveLength(30);
    expect(ALL_NAKSHATRAS).toHaveLength(27);
    expect(ALL_YOGAS).toHaveLength(27);
    expect(ALL_KARANAS).toHaveLength(11);
    expect(LUNAR_PHASES).toHaveLength(8);
    expect(LUNAR_FESTIVALS.length).toBeGreaterThanOrEqual(15);
  });
});
