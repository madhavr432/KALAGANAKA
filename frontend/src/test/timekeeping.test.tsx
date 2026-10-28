import { describe, expect, it } from "vitest";
import {
  calculateSolarPhysics,
  buildCalculatedSolarData,
  getAtmosphericRefraction,
  getJulianDay,
  getTimezoneOffsetHours,
} from "../modules/timekeeping/utils/solarCalculations";
import {
  minutesToTimeStr,
  timeStrToMinutes,
  minutesToGhatiPala,
  getPraharaInfo,
  decimalHoursToTimeStr,
} from "../modules/timekeeping/utils/timeFormatting";
import {
  formatDegrees,
  formatDMS,
  formatLatitude,
  formatLongitude,
  getAzimuthDirection,
} from "../modules/timekeeping/utils/angleFormatting";
import { formatInstantIso } from "../modules/timekeeping/services/timekeepingApi";
import {
  calculateKonarkBeadState,
  KONARK_WHEEL_CONFIG,
} from "../modules/timekeeping/utils/konarkWheelMath";
import {
  CALCULATION_METRICS,
  KONARK_HOTSPOTS,
} from "../modules/timekeeping/constants/timekeepingConstants";

describe("Timekeeping Solar Physics & Astronomical Calculations", () => {
  it("calculates Julian Day correctly for standard J2000 epoch", () => {
    // 2000-01-01 at 12:00 UTC is exactly JD 2451545.0
    const jd = getJulianDay(2000, 1, 1, 12);
    expect(jd).toBeCloseTo(2451545.0, 4);
  });

  it("calculates atmospheric refraction: greater near horizon, near zero at high altitude", () => {
    const horizonRefraction = getAtmosphericRefraction(0);
    const zenithRefraction = getAtmosphericRefraction(80);

    // Near horizon, refraction is ~0.56° (34 arcminutes)
    expect(horizonRefraction).toBeGreaterThan(0.4);
    expect(horizonRefraction).toBeLessThan(0.7);
    // Near zenith, refraction is negligible (< 0.01°)
    expect(zenithRefraction).toBeLessThan(0.01);
  });

  it("correctly identifies daytime vs nighttime solar altitude", () => {
    // At Konark Sun Temple (lat 19.8876, lon 86.0945) on 2026-10-27
    // Midday (720 min = 12:00 PM IST)
    const midday = calculateSolarPhysics("2026-10-27", 720, 19.8876, 86.0945, "Asia/Kolkata");
    expect(midday.altitudeDeg).toBeGreaterThan(45); // Sun is high in tropical sky
    expect(midday.isSunUp).toBe(true);

    // Midnight (0 min = 12:00 AM IST)
    const midnight = calculateSolarPhysics("2026-10-27", 0, 19.8876, 86.0945, "Asia/Kolkata");
    expect(midnight.altitudeDeg).toBeLessThan(-30); // Sun is far below horizon
    expect(midnight.isSunUp).toBe(false);
  });

  it("calculates solar azimuth with correct quadrant orientation", () => {
    // Morning Sun rises in eastern hemisphere (azimuth between 60° and 120°)
    const morning = calculateSolarPhysics("2026-10-27", 480, 19.8876, 86.0945, "Asia/Kolkata"); // 08:00 AM
    expect(morning.azimuthDeg).toBeGreaterThan(60);
    expect(morning.azimuthDeg).toBeLessThan(140);

    // Afternoon Sun moves to western hemisphere (azimuth between 200° and 280°)
    const afternoon = calculateSolarPhysics("2026-10-27", 960, 19.8876, 86.0945, "Asia/Kolkata"); // 16:00 PM
    expect(afternoon.azimuthDeg).toBeGreaterThan(200);
    expect(afternoon.azimuthDeg).toBeLessThan(280);
  });

  it("builds complete structured solar data payload with LMST and LAST", () => {
    const data = buildCalculatedSolarData("2026-10-27", 720, 19.8876, 86.0945, "Asia/Kolkata");

    expect(data.source).toBe("illustrative");
    expect(data.altitude_deg).toBeDefined();
    expect(data.azimuth_deg).toBeDefined();
    expect(data.local_mean_solar_time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(data.local_apparent_solar_time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(data.prahar_index).toBeGreaterThanOrEqual(1);
    expect(data.prahar_index).toBeLessThanOrEqual(8);
    expect(data.ghati_elapsed).toBeGreaterThanOrEqual(0);
    expect(data.ghati_elapsed).toBeLessThan(60);
  });

  it("calculates timezone offsets accurately for IANA and UTC", () => {
    expect(getTimezoneOffsetHours("2026-10-27", "UTC")).toBe(0);
    expect(getTimezoneOffsetHours("2026-10-27", "+05:30")).toBe(5.5);
    expect(getTimezoneOffsetHours("2026-10-27", "Asia/Kolkata")).toBe(5.5);
  });
});

describe("Time & Traditional Unit Formatting", () => {
  it("formats minutes since midnight to HH:mm and HH:mm:ss", () => {
    expect(minutesToTimeStr(0)).toBe("00:00");
    expect(minutesToTimeStr(720)).toBe("12:00");
    expect(minutesToTimeStr(1439)).toBe("23:59");
    expect(minutesToTimeStr(720.5, true)).toBe("12:00:30");
  });

  it("handles wraparound for minutes since midnight", () => {
    expect(minutesToTimeStr(-60)).toBe("23:00");
    expect(minutesToTimeStr(1500)).toBe("01:00");
  });

  it("converts time string back to minutes", () => {
    expect(timeStrToMinutes("12:00")).toBe(720);
    expect(timeStrToMinutes("00:00")).toBe(0);
    expect(timeStrToMinutes("06:30")).toBe(390);
  });

  it("converts decimal hours to formatted string", () => {
    expect(decimalHoursToTimeStr(12.5)).toBe("12:30:00");
    expect(decimalHoursToTimeStr(6.25)).toBe("06:15:00");
  });

  it("converts minutes to traditional Ghatis and Palas", () => {
    // 24 minutes = 1 Ghati 0 Palas
    const oneGhati = minutesToGhatiPala(24);
    expect(oneGhati.ghati).toBe(1);
    expect(oneGhati.pala).toBe(0);

    // 60 minutes = 2 Ghatis 30 Palas (2.5 Ghatis)
    const sixtyMin = minutesToGhatiPala(60);
    expect(sixtyMin.ghati).toBe(2);
    expect(sixtyMin.pala).toBe(30);
  });

  it("determines correct Prahara based on time of day", () => {
    // 07:00 AM (420 min) is Pratham Prahara (06:00 - 09:00)
    expect(getPraharaInfo(420).index).toBe(1);
    // 10:30 AM (630 min) is Dvitiya Prahara (09:00 - 12:00)
    expect(getPraharaInfo(630).index).toBe(2);
    // 13:00 PM (780 min) is Tritiya Prahara (12:00 - 15:00)
    expect(getPraharaInfo(780).index).toBe(3);
    // 00:30 AM (30 min) is Saptam Prahara (00:00 - 03:00)
    expect(getPraharaInfo(30).index).toBe(7);
  });
});

describe("Angle & Coordinate Formatting", () => {
  it("formats degrees and DMS", () => {
    expect(formatDegrees(45.6789, 2)).toBe("45.68°");
    expect(formatDMS(45.5)).toBe("45° 30' 0\"");
  });

  it("formats latitude and longitude with cardinal indicators", () => {
    expect(formatLatitude(19.8876)).toBe("19.8876° N");
    expect(formatLatitude(-33.8688)).toBe("33.8688° S");
    expect(formatLongitude(86.0945)).toBe("86.0945° E");
    expect(formatLongitude(-74.006)).toBe("74.0060° W");
  });

  it("identifies azimuth cardinal directions correctly", () => {
    expect(getAzimuthDirection(0)).toBe("N");
    expect(getAzimuthDirection(90)).toBe("E");
    expect(getAzimuthDirection(180)).toBe("S");
    expect(getAzimuthDirection(270)).toBe("W");
    expect(getAzimuthDirection(45)).toBe("NE");
    expect(getAzimuthDirection(225)).toBe("SW");
  });
});

describe("API Service Instant ISO Formatter", () => {
  it("formats instant ISO with timezone offset", () => {
    const iso = formatInstantIso("2026-10-27", 720, "Asia/Kolkata");
    expect(iso).toBe("2026-10-27T12:00:00+05:30");

    const utcIso = formatInstantIso("2026-10-27", 720, "UTC");
    expect(utcIso).toBe("2026-10-27T12:00:00Z");
  });
});

describe("Educational Information System & Hotspots", () => {
  it("provides comprehensive calculation metrics with plain summaries and formulas", () => {
    expect(CALCULATION_METRICS.altitude).toBeDefined();
    expect(CALCULATION_METRICS.altitude.plainSummary).toContain("horizon");
    expect(CALCULATION_METRICS.altitude.formula).toContain("sin");

    expect(CALCULATION_METRICS.azimuth).toBeDefined();
    expect(CALCULATION_METRICS.azimuth.units).toContain("degrees");

    expect(CALCULATION_METRICS.last).toBeDefined();
    expect(CALCULATION_METRICS.last.formula).toContain("EoT");

    expect(CALCULATION_METRICS.prahar).toBeDefined();
    expect(CALCULATION_METRICS.prahar.steps.length).toBeGreaterThan(3);
  });

  it("provides documented Konark hotspots with positions and descriptions", () => {
    expect(KONARK_HOTSPOTS.length).toBeGreaterThanOrEqual(5);
    const hub = KONARK_HOTSPOTS.find((h) => h.id === "hub");
    expect(hub).toBeDefined();
    expect(hub?.description).toContain("Mount Meru");
    expect(hub?.position).toHaveLength(3);

    const majorSpoke = KONARK_HOTSPOTS.find((h) => h.id === "major-spoke");
    expect(majorSpoke).toBeDefined();
    expect(majorSpoke?.timekeepingRole).toContain("Prahara");
  });

  it("provides comprehensive konarkWheel educational metric definition", () => {
    const metric = CALCULATION_METRICS.konarkWheel;
    expect(metric).toBeDefined();
    expect(metric.plainSummary).toContain("30 beads");
    expect(metric.plainSummary).toContain("3 minutes");
    expect(metric.formula).toContain("90 min / 30 beads");
    expect(metric.steps.length).toBeGreaterThanOrEqual(4);
    expect(metric.limitations.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Konark Sun Temple Wheel Horological Math (8 Praharas, 16 Sectors, 30 Beads)", () => {
  it("verifies architectural configuration constants", () => {
    expect(KONARK_WHEEL_CONFIG.totalWheels).toBe(24);
    expect(KONARK_WHEEL_CONFIG.wheelsPerSide).toBe(12);
    expect(KONARK_WHEEL_CONFIG.majorSpokes).toBe(8);
    expect(KONARK_WHEEL_CONFIG.minorSpokes).toBe(8);
    expect(KONARK_WHEEL_CONFIG.totalSectors).toBe(16);
    expect(KONARK_WHEEL_CONFIG.beadsPerSector).toBe(30);
    expect(KONARK_WHEEL_CONFIG.totalBeads).toBe(480);
    expect(KONARK_WHEEL_CONFIG.minutesPerMajorSector).toBe(180);
    expect(KONARK_WHEEL_CONFIG.minutesPerMinorSector).toBe(90);
    expect(KONARK_WHEEL_CONFIG.minutesPerBead).toBe(3);
  });

  it("calculates bead state accurately at Sunrise (06:00 AM = 360 min)", () => {
    const state = calculateKonarkBeadState(360);
    expect(state.praharaIndex).toBe(1);
    expect(state.praharaName).toContain("Prathama");
    expect(state.sectorType).toBe("major_to_minor");
    expect(state.minutesIntoSector).toBe(0);
    expect(state.activeBeadIndex).toBe(1); // 1st bead
    expect(state.subBeadThird).toBe(0); // exactly on bead
  });

  it("calculates bead state halfway through first minor sector (06:45 AM = 405 min)", () => {
    // 405 min is 45 minutes past 06:00
    // 45 minutes / 3 min per bead = 15 full beads completed -> active bead is 16 (0 min into bead 16)
    const state = calculateKonarkBeadState(405);
    expect(state.praharaIndex).toBe(1);
    expect(state.sectorType).toBe("major_to_minor");
    expect(state.minutesIntoSector).toBe(45);
    expect(state.activeBeadIndex).toBe(16);
    expect(state.subBeadThird).toBe(0);
    expect(state.formulaBreakdown).toContain("Bead #16");
  });

  it("calculates sub-bead single-minute precision (06:46 AM = 406 min)", () => {
    // 46 minutes into sector: 46 / 3 = 15.333 -> bead 16, +1 minute remainder
    const state = calculateKonarkBeadState(406);
    expect(state.praharaIndex).toBe(1);
    expect(state.minutesIntoSector).toBe(46);
    expect(state.activeBeadIndex).toBe(16);
    expect(state.subBeadThird).toBe(1); // +1 min into the 3-min bead
    expect(state.estimatedMinuteOfHour).toBe(46);
  });

  it("switches to minor_to_major sector after 90 minutes (07:30 AM = 450 min)", () => {
    // At 07:30, 90 minutes have elapsed since 06:00.
    // That completes the 1st sector (major_to_minor). Now entering 2nd sector (minor_to_major).
    const state = calculateKonarkBeadState(450);
    expect(state.praharaIndex).toBe(1);
    expect(state.sectorType).toBe("minor_to_major");
    expect(state.minutesIntoSector).toBe(0);
    expect(state.activeBeadIndex).toBe(1);
  });

  it("reaches Solar Midday at start of 3rd Prahara (12:00 PM = 720 min)", () => {
    // 6 hours = 360 min past 06:00 -> 2 full Praharas elapsed (360 min = 2 x 180 min)
    // Entering Prahara 3 (Tritiya Prahar / Madhyahna)
    const state = calculateKonarkBeadState(720);
    expect(state.praharaIndex).toBe(3);
    expect(state.praharaName).toContain("Tritiya");
    expect(state.sectorType).toBe("major_to_minor");
    expect(state.activeBeadIndex).toBe(1);
  });

  it("computes shadow angle consistently with 24-hour cycle (360 deg in 1440 min)", () => {
    const sunrise = calculateKonarkBeadState(360);
    const midday = calculateKonarkBeadState(720);
    const sunset = calculateKonarkBeadState(1080);

    // 6 hours between sunrise (360) and midday (720) = 90 degrees
    const diffSunriseMidday = (midday.shadowAngleDeg - sunrise.shadowAngleDeg + 360) % 360;
    expect(diffSunriseMidday).toBeCloseTo(90, 1);

    // 6 hours between midday (720) and sunset (1080) = 90 degrees
    const diffMiddaySunset = (sunset.shadowAngleDeg - midday.shadowAngleDeg + 360) % 360;
    expect(diffMiddaySunset).toBeCloseTo(90, 1);
  });
});
