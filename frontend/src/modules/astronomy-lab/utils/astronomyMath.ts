/**
 * utils/astronomyMath.ts
 * Mathematical routines, angular difference with circular wraparound,
 * unit converters, and coordinate system compatibility validators for Module 5.
 */

/**
 * Return signed angular difference (A - B) in [-180, 180) degrees.
 * Handles circular wraparound correctly (e.g. 359° and 1° -> 2° difference, NOT 358°).
 */
export function circularAngularDifference(angleA: number, angleB: number): number {
  if (!Number.isFinite(angleA) || !Number.isFinite(angleB)) {
    return 0;
  }
  const diff = angleA - angleB;
  const wrapped = ((((diff + 180.0) % 360.0) + 360.0) % 360.0) - 180.0;
  return wrapped;
}

/**
 * Return absolute circular angular separation in [0, 180] degrees.
 */
export function absoluteAngularSeparation(angleA: number, angleB: number): number {
  return Math.abs(circularAngularDifference(angleA, angleB));
}

/**
 * Format decimal degrees as Degrees, Arcminutes, and Arcseconds (DD° MM' SS.SS").
 */
export function formatDMS(deg: number): string {
  if (!Number.isFinite(deg)) return "0° 00' 00\"";
  const normalized = ((deg % 360) + 360) % 360;
  const d = Math.floor(normalized);
  const mRemainder = (normalized - d) * 60;
  const m = Math.floor(mRemainder);
  const s = ((mRemainder - m) * 60).toFixed(2);
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(5, "0")}"`;
}

const RASHIS = [
  { name: "Mesha", sanskrit: "मेष", en: "Aries" },
  { name: "Vrishabha", sanskrit: "वृषभ", en: "Taurus" },
  { name: "Mithuna", sanskrit: "मिथुन", en: "Gemini" },
  { name: "Karka", sanskrit: "कर्क", en: "Cancer" },
  { name: "Simha", sanskrit: "सिंह", en: "Leo" },
  { name: "Kanya", sanskrit: "कन्या", en: "Virgo" },
  { name: "Tula", sanskrit: "तुला", en: "Libra" },
  { name: "Vrishchika", sanskrit: "वृश्चिक", en: "Scorpio" },
  { name: "Dhanu", sanskrit: "धनु", en: "Sagittarius" },
  { name: "Makara", sanskrit: "मकर", en: "Capricorn" },
  { name: "Kumbha", sanskrit: "कुम्भ", en: "Aquarius" },
  { name: "Mina", sanskrit: "मीन", en: "Pisces" },
];

/**
 * Format longitude into traditional Rashi + Degrees + Minutes + Seconds.
 */
export function formatRashiDMS(deg: number): string {
  if (!Number.isFinite(deg)) return "0s 0° 00' 00\"";
  const normalized = ((deg % 360) + 360) % 360;
  const rashiIndex = Math.floor(normalized / 30);
  const degreeInRashi = normalized - rashiIndex * 30;
  const d = Math.floor(degreeInRashi);
  const mRemainder = (degreeInRashi - d) * 60;
  const m = Math.floor(mRemainder);
  const s = ((mRemainder - m) * 60).toFixed(1);

  const rashi = RASHIS[rashiIndex] ?? RASHIS[0];
  return `${rashi.name} (${rashi.sanskrit}) ${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(4, "0")}"`;
}

/**
 * Unit conversion functions
 */
export function degreesToArcminutes(deg: number): number {
  return deg * 60;
}

export function degreesToArcseconds(deg: number): number {
  return deg * 3600;
}

export function degreesToRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radiansToDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function degreesToHours(deg: number): number {
  return deg / 15.0; // 360° in 24 hours -> 15° per hour
}

export function hoursToDegrees(hrs: number): number {
  return hrs * 15.0;
}

// Traditional Indian Time Unit Conversions
export function ghatisToMinutes(ghatis: number): number {
  return ghatis * 24.0; // 1 Ghati = 24 minutes (60 Ghatis in a civil day)
}

export function minutesToGhatis(minutes: number): number {
  return minutes / 24.0;
}

export function palasToSeconds(palas: number): number {
  return palas * 24.0; // 1 Pala / Vighati = 24 seconds (60 Palas = 1 Ghati)
}

export function secondsToPalas(seconds: number): number {
  return seconds / 24.0;
}

export function praharsToHours(prahars: number): number {
  return prahars * 3.0; // 1 Prahar = 3 hours (8 Prahars in a 24-hour cycle)
}

export function hoursToPrahars(hours: number): number {
  return hours / 3.0;
}

export type CoordinateSystemType = "sayana" | "nirayana" | "topocentric" | "geocentric" | string;

export interface CompatibilityReport {
  isCompatible: boolean;
  compatible: boolean;
  severity: "valid" | "warning" | "incompatible";
  message: string;
  reason: string;
  adjustmentDescription?: string;
  conversionRequired?: string;
}

/**
 * Verify whether two coordinate conventions can be meaningfully compared directly.
 */
export function checkCoordinateCompatibility(
  tradSystem: string,
  modernSystem: string,
): CompatibilityReport {
  const trad = tradSystem.toLowerCase();
  const modern = modernSystem.toLowerCase();

  // If one is tropical and the other is sidereal (either order)
  if (
    ((trad.includes("tropical") || trad.includes("sayana")) &&
      (modern.includes("sidereal") || modern.includes("nirayana"))) ||
    ((trad.includes("sidereal") || trad.includes("nirayana")) &&
      (modern.includes("tropical") || modern.includes("sayana")))
  ) {
    const msg =
      "Direct comparison is mathematically invalid: Sayana (Tropical) and Nirayana (Sidereal) reference frames differ by the Ayanamsha (~24.23° in 2026).";
    return {
      isCompatible: false,
      compatible: false,
      severity: "incompatible",
      message: msg,
      reason: msg,
      adjustmentDescription:
        "Subtract the Lahiri Ayanamsha from the Tropical value before computing differences: λ_Nirayana = λ_Sayana - Ayanamsha.",
      conversionRequired: "λ_Nirayana = λ_Sayana - Ayanamsha",
    };
  }

  // If one is topocentric and the other is geocentric
  if (
    (trad.includes("topocentric") && modern.includes("geocentric")) ||
    (trad.includes("geocentric") && modern.includes("topocentric"))
  ) {
    const msg =
      "Topocentric and Geocentric frames differ by diurnal parallax (significant for Moon ~1°).";
    return {
      isCompatible: false,
      compatible: false,
      severity: "incompatible",
      message: msg,
      reason: msg,
      adjustmentDescription:
        "Apply diurnal parallax correction (Lambana) to convert between observer horizon and Earth center.",
      conversionRequired: "Apply diurnal parallax correction (Lambana)",
    };
  }

  if (
    (trad.includes("mean") || trad.includes("madhyama")) &&
    (modern.includes("apparent") || modern.includes("spashta") || modern.includes("true"))
  ) {
    const msg =
      "Comparing Mean motion with Apparent (True) motion: Residual includes the Equation of the Center (orbital eccentricity oscillation up to ±1.91°).";
    return {
      isCompatible: true,
      compatible: true,
      severity: "warning",
      message: msg,
      reason: msg,
      adjustmentDescription:
        "This difference is scientifically expected due to elliptical eccentricity.",
      conversionRequired: undefined,
    };
  }

  const validMsg = "Coordinate frames are compatible for mathematical comparison.";
  return {
    isCompatible: true,
    compatible: true,
    severity: "valid",
    message: validMsg,
    reason: validMsg,
  };
}
