/**
 * KalaGanaka - Astronomical & Observational Mathematics Utilities
 *
 * Provides shared, validated calculations for:
 * 1. Traditional Indian time units (Ghati, Pala, Vipala, Ishtakala).
 * 2. Observatory presets and geographic coordinates across India.
 * 3. Validation for date and time inputs against JPL DE421 ephemeris boundaries.
 * 4. Timezone-aware ISO string formatting.
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
    id: "konark",
    name: "Sun Temple, Konark",
    city: "Konark, Odisha",
    latitude: 19.8876,
    longitude: 86.0945,
    elevation_m: 5,
    timezone: "Asia/Kolkata",
    historicalNote:
      "13th-century Surya Deula constructed by King Narasimhadeva I of the Eastern Ganga dynasty. Features 24 monumental carved stone chariot wheels functioning as precision sundials.",
  },
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
      "UNESCO World Heritage stone observatory built c. 1734 by Maharaja Sawai Jai Singh II.",
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
      "Constructed in 1724, the first of the five monumental northern Indian observatories erected by Jai Singh II.",
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
      "Historical Greenwich of ancient Indian astronomy—the intersection of the zero meridian (Madhyarekha) and Tropic of Cancer celebrated in the Surya Siddhanta.",
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
];

export interface TraditionalTime {
  ghati: number;
  pala: number;
  vipala: number;
  totalGhatiDecimal: number;
  formatted: string;
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
 * Parse an ISO-8601 timestamp string into hours, minutes, and seconds.
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
  let offset = tzOffset;
  if (tzOffset === "Asia/Kolkata" || tzOffset === "IST") {
    offset = "+05:30";
  } else if (tzOffset === "UTC" || tzOffset === "Z") {
    offset = "Z";
  } else if (!/^[+-]\d{2}:\d{2}$/.test(tzOffset) && tzOffset !== "Z") {
    offset = "+05:30";
  }
  return `${dateStr}T${timeStr}:${seconds}${offset}`;
}
