/**
 * KalaGanaka - Samrat Yantra Mathematical & Astronomical Utilities
 *
 * Provides validated calculations for:
 * 1. Traditional Indian time units (Ghati, Pala, Vipala, Ishtakala).
 * 2. Local Apparent Solar Time (LAT) and Hour Angle (H).
 * 3. Equinoctial quadrant shadow angles for the Samrat Yantra.
 * 4. Coordinate and date/time validation against JPL DE421 ephemeris boundaries.
 */

export interface ObservatoryPreset {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  timezone: string;
  historicalNote: string;
  gnomonHeightMeters?: number;
}

export const OBSERVATORY_PRESETS: ObservatoryPreset[] = [
  {
    id: "jaipur",
    name: "Jantar Mantar, Jaipur",
    city: "Jaipur, Rajasthan",
    latitude: 26.9248,
    longitude: 75.8246,
    elevation_m: 430,
    timezone: "Asia/Kolkata",
    gnomonHeightMeters: 27.0,
    historicalNote:
      "Home to the Vrihat Samrat Yantra (built c. 1734 by Maharaja Sawai Jai Singh II), the largest stone sundial in the world. Its gnomon stands 27 meters tall with a scale calibrated to an accuracy of 2 seconds.",
  },
  {
    id: "delhi",
    name: "Jantar Mantar, New Delhi",
    city: "New Delhi",
    latitude: 28.6271,
    longitude: 77.2166,
    elevation_m: 216,
    timezone: "Asia/Kolkata",
    gnomonHeightMeters: 20.7,
    historicalNote:
      "Constructed in 1724, this was the first of the five monumental observatories erected by Jai Singh II to correct discrepancies in contemporary Mughal and European tables.",
  },
  {
    id: "ujjain",
    name: "Vedha Shala, Ujjain",
    city: "Ujjain, Madhya Pradesh",
    latitude: 23.1765,
    longitude: 75.7685,
    elevation_m: 490,
    timezone: "Asia/Kolkata",
    gnomonHeightMeters: 6.7,
    historicalNote:
      "Ujjain is the historic Greenwich of ancient Indian astronomy—the intersection of the zero meridian (Madhyarekha) and the Tropic of Cancer celebrated in the Surya Siddhanta and Aryabhatiya.",
  },
  {
    id: "varanasi",
    name: "Maan Mandir Observatory, Varanasi",
    city: "Varanasi, Uttar Pradesh",
    latitude: 25.3109,
    longitude: 83.0107,
    elevation_m: 80,
    timezone: "Asia/Kolkata",
    gnomonHeightMeters: 4.5,
    historicalNote:
      "Built on the terrace of Man Mahal Palace along the sacred Ganga ghats, offering astronomical alignments overlooking the eastern horizon.",
  },
  {
    id: "mathura",
    name: "Jantar Mantar, Mathura",
    city: "Mathura, Uttar Pradesh",
    latitude: 27.4924,
    longitude: 77.6737,
    elevation_m: 170,
    timezone: "Asia/Kolkata",
    gnomonHeightMeters: 5.0,
    historicalNote:
      "Constructed atop the historic Kans Qila fort in Mathura around 1728. Although partially dismantled in the 19th century, its coordinates remain an essential node of Jai Singh's northern Indian observatory network.",
  },
];

export interface TraditionalTime {
  ghati: number;
  pala: number;
  vipala: number;
  totalGhatiDecimal: number;
  formatted: string;
}

export interface ShadowGeometry {
  hourAngleDeg: number;
  quadrant: "western" | "eastern" | "meridian" | "none";
  quadrantAngleDeg: number;
  isSunUp: boolean;
  shadowLengthRatio: number | null;
  approxDeclinationDeg: number;
  readingHours: number;
  readingMinutes: number;
  readingSeconds: number;
  traditionalReading: TraditionalTime;
  description: string;
}

/**
 * Converts decimal hours to Ghati, Pala, and Vipala.
 * 1 Solar Day (24 hours) = 60 Ghatis.
 * 1 Ghati = 24 minutes = 60 Palas.
 * 1 Pala = 24 seconds = 60 Vipalas.
 * 1 Vipala = 0.4 seconds.
 */
export function hoursToTraditionalTime(hours: number): TraditionalTime {
  const normalizedHours = ((hours % 24) + 24) % 24;
  const totalGhatiDecimal = normalizedHours * 2.5;
  const ghati = Math.floor(totalGhatiDecimal);
  const remainingGhatiFraction = totalGhatiDecimal - ghati;
  const totalPalaDecimal = remainingGhatiFraction * 60;
  const pala = Math.floor(totalPalaDecimal);
  const remainingPalaFraction = totalPalaDecimal - pala;
  const vipala = Math.round(remainingPalaFraction * 60);

  return {
    ghati,
    pala,
    vipala,
    totalGhatiDecimal,
    formatted: `${ghati} घटी ${pala} पल ${vipala} विपल (${totalGhatiDecimal.toFixed(2)} Gh)`,
  };
}

/**
 * Parse an ISO-8601 timestamp string into hours, minutes, and seconds in the given timezone offset.
 */
export function parseLocalTimeString(isoString: string): {
  hours: number;
  minutes: number;
  seconds: number;
  totalHours: number;
} | null {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return null;
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    return {
      hours,
      minutes,
      seconds,
      totalHours: hours + minutes / 60 + seconds / 3600,
    };
  } catch {
    return null;
  }
}

/**
 * Calculate the Samrat Yantra shadow geometry from solar altitude, azimuth, latitude, and solar noon time.
 */
export function calculateSamratYantraShadow(params: {
  altitudeDeg: number;
  azimuthDeg: number;
  latitudeDeg: number;
  isSunUp: boolean;
  currentInstantLocal: string; // "YYYY-MM-DDTHH:mm:ss+HH:MM"
  solarNoonLocal?: string | null;
  sunriseLocal?: string | null;
}): ShadowGeometry {
  const { altitudeDeg, azimuthDeg, latitudeDeg, isSunUp, currentInstantLocal, solarNoonLocal } =
    params;

  if (!isSunUp || altitudeDeg <= 0) {
    return {
      hourAngleDeg: 0,
      quadrant: "none",
      quadrantAngleDeg: 0,
      isSunUp: false,
      shadowLengthRatio: null,
      approxDeclinationDeg: 0,
      readingHours: 0,
      readingMinutes: 0,
      readingSeconds: 0,
      traditionalReading: {
        ghati: 0,
        pala: 0,
        vipala: 0,
        totalGhatiDecimal: 0,
        formatted: "रात्रि (सूर्योदय पूर्व / सूर्यास्त पश्चात्)",
      },
      description:
        "Sun is below the horizon. The Samrat Yantra is inactive during nighttime as no shadow is cast.",
    };
  }

  // Calculate Hour Angle H:
  // If solar noon local time is available from backend:
  // H (degrees) = (Current Local Time - Solar Noon Local Time) in hours * 15°
  let hourAngleDeg = 0;
  let latHours = 12;

  const currentLocal = parseLocalTimeString(currentInstantLocal);
  const noonLocal = solarNoonLocal ? parseLocalTimeString(solarNoonLocal) : null;

  if (currentLocal && noonLocal) {
    let diffHours = currentLocal.totalHours - noonLocal.totalHours;
    // Normalize to [-12, 12]
    if (diffHours > 12) diffHours -= 24;
    if (diffHours < -12) diffHours += 24;
    hourAngleDeg = diffHours * 15;
    latHours = 12 + diffHours;
  } else {
    // Trigonometric approximation from Altitude (h), Azimuth (A), and Latitude (phi):
    // sin(h) = sin(phi) sin(delta) + cos(phi) cos(delta) cos(H)
    // sin(A) = -cos(delta) sin(H) / cos(h)   (with A measured clockwise from North)
    // If Azimuth < 180° (East): H is negative (forenoon / morning)
    // If Azimuth > 180° (West): H is positive (afternoon)
    const phi = (latitudeDeg * Math.PI) / 180;
    const h = (altitudeDeg * Math.PI) / 180;
    const A = (azimuthDeg * Math.PI) / 180;

    // sin(delta) = sin(phi) sin(h) + cos(phi) cos(h) cos(A)
    const sinDelta = Math.sin(phi) * Math.sin(h) + Math.cos(phi) * Math.cos(h) * Math.cos(A);
    const cosDelta = Math.sqrt(Math.max(0, 1 - sinDelta * sinDelta));

    if (cosDelta > 0.001) {
      // cos(H) = (sin(h) - sin(phi) sin(delta)) / (cos(phi) cos(delta))
      let cosH = (Math.sin(h) - Math.sin(phi) * sinDelta) / (Math.cos(phi) * cosDelta);
      cosH = Math.max(-1, Math.min(1, cosH));
      const H = Math.acos(cosH) * (180 / Math.PI);
      hourAngleDeg = azimuthDeg < 180 ? -H : H;
    }
    latHours = 12 + hourAngleDeg / 15;
  }

  // Approximate solar declination from altitude and azimuth
  const phiRad = (latitudeDeg * Math.PI) / 180;
  const hRad = (altitudeDeg * Math.PI) / 180;
  const aRad = (azimuthDeg * Math.PI) / 180;
  const sinDelta =
    Math.sin(phiRad) * Math.sin(hRad) + Math.cos(phiRad) * Math.cos(hRad) * Math.cos(aRad);
  const approxDeclinationDeg = (Math.asin(Math.max(-1, Math.min(1, sinDelta))) * 180) / Math.PI;

  // Samrat Yantra Quadrant Determination:
  // Before solar noon (H < 0, Sun in the East): Shadow falls on the WESTERN quadrant.
  // After solar noon (H > 0, Sun in the West): Shadow falls on the EASTERN quadrant.
  // At solar noon (|H| < 0.1°): Shadow lies along the meridian base of the gnomon.
  let quadrant: "western" | "eastern" | "meridian" = "meridian";
  if (hourAngleDeg < -0.1) {
    quadrant = "western";
  } else if (hourAngleDeg > 0.1) {
    quadrant = "eastern";
  }

  const quadrantAngleDeg = Math.abs(hourAngleDeg);
  const normalizedLatHours = ((latHours % 24) + 24) % 24;
  const readingHours = Math.floor(normalizedLatHours);
  const minDec = (normalizedLatHours - readingHours) * 60;
  const readingMinutes = Math.floor(minDec);
  const readingSeconds = Math.round((minDec - readingMinutes) * 60);

  // Traditional time from solar noon or sunrise
  // Ishtakala: Ghatis elapsed since sunrise if sunrise is known
  let traditionalReading: TraditionalTime;
  const sunrise = params.sunriseLocal ? parseLocalTimeString(params.sunriseLocal) : null;
  if (sunrise && currentLocal) {
    let elapsedFromSunrise = currentLocal.totalHours - sunrise.totalHours;
    if (elapsedFromSunrise < 0) elapsedFromSunrise += 24;
    traditionalReading = hoursToTraditionalTime(elapsedFromSunrise);
  } else {
    // Time from solar noon in Ghatis (Madhyahna Antara)
    traditionalReading = hoursToTraditionalTime(Math.abs(hourAngleDeg) / 15);
  }

  // Ratio of shadow length on a standard gnomon = cot(altitude)
  const shadowLengthRatio = altitudeDeg > 0.5 ? 1 / Math.tan(hRad) : 100;

  const description =
    quadrant === "western"
      ? `Forenoon (पूर्वाह्न): Sun is east of the meridian. The shadow of the gnomon edge falls on the Western Equinoctial Quadrant at ${quadrantAngleDeg.toFixed(2)}° from the meridian, reading Local Apparent Time ${String(readingHours).padStart(2, "0")}:${String(readingMinutes).padStart(2, "0")}:${String(readingSeconds).padStart(2, "0")}.`
      : quadrant === "eastern"
        ? `Afternoon (अपराह्न): Sun is west of the meridian. The shadow of the gnomon edge falls on the Eastern Equinoctial Quadrant at ${quadrantAngleDeg.toFixed(2)}° from the meridian, reading Local Apparent Time ${String(readingHours).padStart(2, "0")}:${String(readingMinutes).padStart(2, "0")}:${String(readingSeconds).padStart(2, "0")}.`
        : `Solar Noon (मध्याह्न): The Sun crosses the local celestial meridian. The shadow aligns directly along the gnomon base, marking Local Apparent Time 12:00:00 (Zero Hour Angle).`;

  return {
    hourAngleDeg,
    quadrant,
    quadrantAngleDeg,
    isSunUp: true,
    shadowLengthRatio,
    approxDeclinationDeg,
    readingHours,
    readingMinutes,
    readingSeconds,
    traditionalReading,
    description,
  };
}

/**
 * Validates date string (YYYY-MM-DD) against JPL DE421 ephemeris range: 1899-07-29 to 2053-10-08.
 */
export function validateDateRange(dateStr: string): { valid: boolean; error?: string } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { valid: false, error: "Date must be in 'YYYY-MM-DD' format." };
  }

  const [y, m, d] = dateStr.split("-").map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  if (
    parsed.getUTCFullYear() !== y ||
    parsed.getUTCMonth() !== m - 1 ||
    parsed.getUTCDate() !== d
  ) {
    return { valid: false, error: "Invalid calendar date (e.g. February 30th does not exist)." };
  }

  const minDate = new Date(Date.UTC(1899, 6, 29)); // 1899-07-29
  const maxDate = new Date(Date.UTC(2053, 9, 8)); // 2053-10-08

  if (parsed < minDate || parsed > maxDate) {
    return {
      valid: false,
      error: "Date is outside supported JPL DE421 ephemeris span (1899-07-29 to 2053-10-08 UTC).",
    };
  }

  return { valid: true };
}

/**
 * Validates time string (HH:mm).
 */
export function validateTimeString(timeStr: string): { valid: boolean; error?: string } {
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr)) {
    return { valid: false, error: "Time must be in 24-hour 'HH:mm' format (00:00 to 23:59)." };
  }
  return { valid: true };
}

/**
 * Validates coordinates.
 */
export function validateCoordinates(
  lat: number,
  lon: number,
  elevation = 0,
): { valid: boolean; error?: string } {
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return { valid: false, error: "Latitude must be between -90.0° and +90.0°." };
  }
  if (isNaN(lon) || lon < -180 || lon > 180) {
    return { valid: false, error: "Longitude must be between -180.0° and +180.0°." };
  }
  if (isNaN(elevation) || elevation < -500 || elevation > 12000) {
    return { valid: false, error: "Elevation must be between -500m and 12,000m." };
  }
  return { valid: true };
}

/**
 * Format local date and time into a timezone-aware ISO string.
 * Example: date="2026-10-28", time="12:00", tz="+05:30" => "2026-10-28T12:00:00+05:30"
 */
export function formatTimezoneAwareInstant(
  dateStr: string,
  timeStr: string,
  tzOffset = "+05:30",
): string {
  const seconds = "00";
  // If tzOffset is "Asia/Kolkata", convert to "+05:30" for ISO timestamp
  let offset = tzOffset;
  if (tzOffset === "Asia/Kolkata" || tzOffset === "IST") {
    offset = "+05:30";
  } else if (tzOffset === "UTC" || tzOffset === "Z") {
    offset = "Z";
  } else if (!/^[+-]\d{2}:\d{2}$/.test(tzOffset) && tzOffset !== "Z") {
    // Default safe offset for Indian observatories if unparsed
    offset = "+05:30";
  }
  return `${dateStr}T${timeStr}:${seconds}${offset}`;
}
