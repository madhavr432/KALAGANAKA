/**
 * High-precision astronomical algorithms for solar position, time calculations,
 * and civil vs solar time relationships (based on Jean Meeus Astronomical Algorithms
 * and NOAA Solar Calculator standards).
 *
 * This provides the local real-time simulation engine that drives the 3D scene smoothly
 * at 60 FPS while user moves the slider, providing an instant visual response.
 */

import { SolarCalculatedData } from "../types/timekeeping";
import { decimalHoursToTimeStr, getPraharaInfo } from "./timeFormatting";

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Calculate Julian Day Number from year, month, day, and fractional day in UTC
 */
export function getJulianDay(year: number, month: number, day: number, utcHours: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const dayFraction = day + utcHours / 24;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFraction + b - 1524.5;
}

/**
 * Calculate standard atmospheric refraction in degrees given true altitude in degrees.
 * Based on Saemundsson / Bennett formula.
 */
export function getAtmosphericRefraction(trueAltitudeDeg: number): number {
  if (trueAltitudeDeg < -1.0) return 0;
  // Bennett formula with Sæmundsson modification
  const h = Math.max(-0.5, trueAltitudeDeg);
  const rArcmin = 1.02 / Math.tan((h + 10.3 / (h + 5.11)) * DEG_TO_RAD);
  return rArcmin / 60.0;
}

/**
 * Parse an IANA timezone or offset string into fractional hours offset from UTC.
 * E.g. "Asia/Kolkata" -> 5.5, "+05:30" -> 5.5, "UTC" -> 0
 */
export function getTimezoneOffsetHours(dateStr: string, timezone: string): number {
  if (timezone === "UTC" || timezone === "Z") return 0;
  if (timezone === "Asia/Kolkata" || timezone === "IST") return 5.5;

  // Direct regex check for numeric offset e.g. +05:30 or -04:00
  const match = timezone.match(/^([+-])(\d{1,2}):?(\d{2})?$/);
  if (match) {
    const sign = match[1] === "-" ? -1 : 1;
    const h = parseInt(match[2], 10);
    const m = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (h + m / 60);
  }

  // Use Intl.DateTimeFormat parts for IANA names like "America/New_York"
  try {
    const d = new Date(`${dateStr}T12:00:00Z`);
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const parts = formatter.formatToParts(d);
    const getPart = (type: string) =>
      parseInt(parts.find((p) => p.type === type)?.value || "0", 10);
    const year = getPart("year");
    const month = getPart("month") - 1;
    const day = getPart("day");
    const hour = getPart("hour");
    const minute = getPart("minute");

    const targetUtcEpoch = Date.UTC(year, month, day, hour, minute);
    return (targetUtcEpoch - d.getTime()) / (1000 * 60 * 60);
  } catch {
    // Default fallback to Indian Standard Time (IST = +5.5) if unrecognized
    return 5.5;
  }
}

export interface SolarPositionResult {
  altitudeDeg: number;
  altitudeRefractedDeg: number;
  azimuthDeg: number;
  declinationDeg: number;
  rightAscensionDeg: number;
  equationOfTimeMin: number;
  solarNoonUtcHours: number;
  sunriseUtcHours: number | null;
  sunsetUtcHours: number | null;
  distanceAu: number;
  isSunUp: boolean;
}

/**
 * Computes high-precision solar coordinates and events using standard NOAA astronomical formulas.
 */
export function calculateSolarPhysics(
  dateStr: string,
  localMinutesSinceMidnight: number,
  latitude: number,
  longitude: number,
  timezone: string,
): SolarPositionResult {
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = parseInt(yearStr, 10) || 2026;
  const month = parseInt(monthStr, 10) || 10;
  const day = parseInt(dayStr, 10) || 27;

  const tzOffsetHours = getTimezoneOffsetHours(dateStr, timezone);
  const localDecimalHours = localMinutesSinceMidnight / 60;
  let utcDecimalHours = localDecimalHours - tzOffsetHours;

  let jdDayOffset = 0;
  if (utcDecimalHours < 0) {
    utcDecimalHours += 24;
    jdDayOffset = -1;
  } else if (utcDecimalHours >= 24) {
    utcDecimalHours -= 24;
    jdDayOffset = 1;
  }

  const jd = getJulianDay(year, month, day + jdDayOffset, utcDecimalHours);
  const t = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0

  // Geometric mean longitude of the Sun (degrees)
  let l0 = 280.46646 + t * (36000.76983 + 0.0003032 * t);
  l0 = ((l0 % 360) + 360) % 360;

  // Mean anomaly of the Sun (degrees)
  let m = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  m = ((m % 360) + 360) % 360;
  const mRad = m * DEG_TO_RAD;

  // Orbit eccentricity
  const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);

  // Sun equation of the center (degrees)
  const c =
    Math.sin(mRad) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * mRad) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * mRad) * 0.000289;

  // Sun true longitude (degrees)
  const sunTrueLong = l0 + c;

  // Sun apparent longitude (degrees, corrected for aberration and nutation)
  const omega = 125.04 - 1934.136 * t;
  const sunAppLong = sunTrueLong - 0.00569 - 0.00478 * Math.sin(omega * DEG_TO_RAD);
  const sunAppLongRad = sunAppLong * DEG_TO_RAD;

  // Mean obliquity of the ecliptic (degrees)
  const eps0 = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813)))) / 60;
  // Corrected obliquity
  const obliq = eps0 + 0.00256 * Math.cos(omega * DEG_TO_RAD);
  const obliqRad = obliq * DEG_TO_RAD;

  // Solar declination (degrees)
  const sinDec = Math.sin(obliqRad) * Math.sin(sunAppLongRad);
  const decRad = Math.asin(sinDec);
  const declinationDeg = decRad * RAD_TO_DEG;

  // Right Ascension (degrees)
  const yRa = Math.cos(obliqRad) * Math.sin(sunAppLongRad);
  const xRa = Math.cos(sunAppLongRad);
  const raRad = Math.atan2(yRa, xRa);
  const rightAscensionDeg = (((raRad * RAD_TO_DEG) % 360) + 360) % 360;

  // Distance in AU
  const vRad = (m + c) * DEG_TO_RAD;
  const distanceAu = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(vRad));

  // Equation of Time (minutes)
  const y = Math.tan(obliqRad / 2) * Math.tan(obliqRad / 2);
  const l0Rad = l0 * DEG_TO_RAD;
  const eotRad =
    y * Math.sin(2 * l0Rad) -
    2 * e * Math.sin(mRad) +
    4 * e * y * Math.sin(mRad) * Math.cos(2 * l0Rad) -
    0.5 * y * y * Math.sin(4 * l0Rad) -
    1.25 * e * e * Math.sin(2 * mRad);
  const equationOfTimeMin = 4 * eotRad * RAD_TO_DEG;

  // Solar Noon in UTC hours:
  // Solar Noon occurs when apparent solar time = 12:00
  // Solar Noon (UTC minutes) = 720 - 4 * longitude - equationOfTimeMin
  const solarNoonUtcMinutes = 720 - 4 * longitude - equationOfTimeMin;
  const solarNoonUtcHours = (((solarNoonUtcMinutes / 60) % 24) + 24) % 24;

  // Calculate True Solar Time in minutes
  // True Solar Time = Local Civil Time + 4 * longitude - 60 * tzOffsetHours + equationOfTimeMin
  const trueSolarTimeMin =
    localMinutesSinceMidnight + 4 * longitude - 60 * tzOffsetHours + equationOfTimeMin;
  const trueSolarTimeNorm = ((trueSolarTimeMin % 1440) + 1440) % 1440;

  // Hour Angle H (degrees, negative before solar noon, positive after solar noon)
  // At solar noon (720 min), H = 0. Each minute = 0.25 degrees (15 deg/hr)
  let hourAngleDeg = trueSolarTimeNorm / 4 - 180;
  if (hourAngleDeg < -180) hourAngleDeg += 360;
  const hourAngleRad = hourAngleDeg * DEG_TO_RAD;

  // Solar Altitude calculation
  const latRad = latitude * DEG_TO_RAD;
  const sinAlt =
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngleRad);
  const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const altitudeDeg = altRad * RAD_TO_DEG;

  // Atmospheric refraction
  const refractionDeg = getAtmosphericRefraction(altitudeDeg);
  const altitudeRefractedDeg = altitudeDeg + refractionDeg;

  // Solar Azimuth (degrees clockwise from True North: 0 = N, 90 = E, 180 = S, 270 = W)
  const yAz = -Math.sin(hourAngleRad) * Math.cos(decRad);
  const xAz =
    Math.cos(latRad) * Math.sin(decRad) -
    Math.sin(latRad) * Math.cos(decRad) * Math.cos(hourAngleRad);
  const azRad = Math.atan2(yAz, xAz);
  const azimuthDeg = (((azRad * RAD_TO_DEG) % 360) + 360) % 360;

  // Sunrise and Sunset calculations
  // Standard solar depression at horizon = -0.8333 degrees (-50 arcmin)
  const h0Rad = -0.8333 * DEG_TO_RAD;
  const cosH0 =
    (Math.sin(h0Rad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));

  let sunriseUtcHours: number | null = null;
  let sunsetUtcHours: number | null = null;

  if (cosH0 >= -1 && cosH0 <= 1) {
    const h0Deg = Math.acos(cosH0) * RAD_TO_DEG;
    const halfDayMinutes = h0Deg * 4;
    sunriseUtcHours = ((((solarNoonUtcMinutes - halfDayMinutes) / 60) % 24) + 24) % 24;
    sunsetUtcHours = ((((solarNoonUtcMinutes + halfDayMinutes) / 60) % 24) + 24) % 24;
  }

  const isSunUp = altitudeRefractedDeg >= -0.8333;

  return {
    altitudeDeg,
    altitudeRefractedDeg,
    azimuthDeg,
    declinationDeg,
    rightAscensionDeg,
    equationOfTimeMin,
    solarNoonUtcHours,
    sunriseUtcHours,
    sunsetUtcHours,
    distanceAu,
    isSunUp,
  };
}

/**
 * Builds the complete structured SolarCalculatedData payload.
 */
export function buildCalculatedSolarData(
  dateStr: string,
  minutesSinceMidnight: number,
  latitude: number,
  longitude: number,
  timezone: string,
): SolarCalculatedData {
  const physics = calculateSolarPhysics(
    dateStr,
    minutesSinceMidnight,
    latitude,
    longitude,
    timezone,
  );

  const tzOffsetHours = getTimezoneOffsetHours(dateStr, timezone);

  // Local Mean Solar Time (LMST):
  // UTC time = localTime - tzOffsetHours
  // LMST = UTC + Longitude / 15 hours
  const localDecimalHours = minutesSinceMidnight / 60;
  const utcDecimalHours = (localDecimalHours - (tzOffsetHours % 24) + 24) % 24;
  const lmstDecimalHours = (utcDecimalHours + ((longitude / 15) % 24) + 24) % 24;

  // Local Apparent Solar Time (LAST):
  // LAST = LMST + Equation of Time (in hours)
  const lastDecimalHours = (lmstDecimalHours + ((physics.equationOfTimeMin / 60) % 24) + 24) % 24;

  // Format Solar Noon, Sunrise, Sunset in local civil time
  const solarNoonLocalHours = (physics.solarNoonUtcHours + (tzOffsetHours % 24) + 24) % 24;
  const sunriseLocalHours =
    physics.sunriseUtcHours !== null
      ? (physics.sunriseUtcHours + (tzOffsetHours % 24) + 24) % 24
      : null;
  const sunsetLocalHours =
    physics.sunsetUtcHours !== null
      ? (physics.sunsetUtcHours + (tzOffsetHours % 24) + 24) % 24
      : null;

  const dayLengthHours =
    physics.sunriseUtcHours !== null && physics.sunsetUtcHours !== null
      ? physics.sunsetUtcHours >= physics.sunriseUtcHours
        ? physics.sunsetUtcHours - physics.sunriseUtcHours
        : physics.sunsetUtcHours + 24 - physics.sunriseUtcHours
      : null;

  // Calculate traditional Prahara and Ghati
  const prahar = getPraharaInfo(minutesSinceMidnight);
  const sunriseMinutes = sunriseLocalHours !== null ? sunriseLocalHours * 60 : 360;
  const minutesSinceSunrise =
    minutesSinceMidnight >= sunriseMinutes
      ? minutesSinceMidnight - sunriseMinutes
      : minutesSinceMidnight + 1440 - sunriseMinutes;

  const totalGhatis = (minutesSinceSunrise / 24) % 60;
  const ghatiElapsed = Math.floor(totalGhatis);
  const palaElapsed = Math.floor((totalGhatis - ghatiElapsed) * 60);

  return {
    altitude_deg: physics.altitudeDeg,
    altitude_refracted_deg: physics.altitudeRefractedDeg,
    azimuth_deg: physics.azimuthDeg,
    distance_au: physics.distanceAu,
    distance_km: physics.distanceAu * 149597870.7,
    is_sun_up: physics.isSunUp,
    sunrise_local: sunriseLocalHours !== null ? decimalHoursToTimeStr(sunriseLocalHours) : null,
    sunset_local: sunsetLocalHours !== null ? decimalHoursToTimeStr(sunsetLocalHours) : null,
    solar_noon_local: decimalHoursToTimeStr(solarNoonLocalHours),
    day_length_hours: dayLengthHours,
    equation_of_time_min: physics.equationOfTimeMin,
    local_mean_solar_time: decimalHoursToTimeStr(lmstDecimalHours),
    local_apparent_solar_time: decimalHoursToTimeStr(lastDecimalHours),
    solar_declination_deg: physics.declinationDeg,
    solar_right_ascension_deg: physics.rightAscensionDeg,
    hour_angle_deg: (lastDecimalHours - 12) * 15,
    prahar_index: prahar.index,
    prahar_name: prahar.name,
    prahar_hindi: prahar.hindiName,
    ghati_elapsed: ghatiElapsed,
    pala_elapsed: palaElapsed,
    source: "illustrative",
    method_name: "Jean Meeus / NOAA Solar Position Algorithm",
    conventions: {
      altitude_convention: "Degrees above true horizon [-90°, +90°]",
      azimuth_convention: "Degrees clockwise from True North [0°, 360°)",
      refraction_model: "Sæmundsson atmospheric refraction (1013 mbar, 15°C)",
      apparent_solar_time: "Local Apparent Solar Time (LAST = LMST + EoT)",
    },
    assumptions: [
      "Solar altitude accounts for standard atmospheric refraction at sea level.",
      "Local apparent solar time is computed using NOAA Equation of Time formulation.",
      "Prahara divisions are referenced to solar intervals of the diurnal/nocturnal cycle.",
    ],
  };
}
