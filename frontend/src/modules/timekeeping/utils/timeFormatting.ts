/**
 * Utility functions for formatting time, minutes since midnight, and traditional Indian time units.
 */

export function minutesToTimeStr(totalMinutes: number, includeSeconds = false): string {
  const normalized = ((Math.floor(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const seconds = Math.floor((totalMinutes - Math.floor(totalMinutes)) * 60);

  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");

  if (includeSeconds) {
    const ss = seconds.toString().padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  return `${hh}:${mm}`;
}

export function timeStrToMinutes(timeStr: string): number {
  const parts = timeStr.split(":");
  if (parts.length < 2) return 720;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parts.length > 2 ? parseInt(parts[2], 10) || 0 : 0;
  return hours * 60 + minutes + seconds / 60;
}

/**
 * Format decimal hours (e.g. 12.5) to HH:mm:ss
 */
export function decimalHoursToTimeStr(decimalHours: number): string {
  const normalized = ((decimalHours % 24) + 24) % 24;
  const hours = Math.floor(normalized);
  const remMinutes = (normalized - hours) * 60;
  const minutes = Math.floor(remMinutes);
  const seconds = Math.floor((remMinutes - minutes) * 60);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Extracts a local HH:mm display from an ISO-8601 string or returns fallback.
 */
export function formatIsoToTime(isoStr: string | null | undefined, fallback = "--:--"): string {
  if (!isoStr) return fallback;
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) {
      // Attempt manual extraction if timezone string suffix is present
      const match = isoStr.match(/T(\d{2}):(\d{2})/);
      return match ? `${match[1]}:${match[2]}` : fallback;
    }
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return fallback;
  }
}

/**
 * Convert minutes elapsed since sunrise (or midnight) into Ghatis and Palas.
 * 1 Solar Day (24 hours) = 60 Ghatis (1 Ghati = 24 minutes)
 * 1 Ghati = 60 Palas (1 Pala = 24 seconds = 0.4 minutes)
 */
export function minutesToGhatiPala(minutesFromReference: number): {
  ghati: number;
  pala: number;
  formatted: string;
} {
  const normalized = Math.max(0, minutesFromReference);
  const totalGhatis = normalized / 24;
  const ghati = Math.floor(totalGhatis) % 60;
  const pala = Math.floor((totalGhatis - Math.floor(totalGhatis)) * 60);

  return {
    ghati,
    pala,
    formatted: `${ghati} घटी ${pala} पल (${ghati} Gh ${pala} Pa)`,
  };
}

/**
 * Determine the traditional Prahara (1 of 8 watch periods in a 24-hour cycle)
 * Praharas 1-4 are diurnal (day), 5-8 are nocturnal (night).
 */
export function getPraharaInfo(minutesSinceMidnight: number): {
  index: number;
  name: string;
  hindiName: string;
  description: string;
} {
  const normalized = ((minutesSinceMidnight % 1440) + 1440) % 1440;
  // Each Prahara is 3 hours (180 minutes)
  // Day starts around 6 AM (360 mins) traditionally, but standard 8 praharas from 6 AM:
  // Prahara 1: 06:00 - 09:00 (Pratham Prahara)
  // Prahara 2: 09:00 - 12:00 (Dvitiya Prahara / Madhyanha)
  // Prahara 3: 12:00 - 15:00 (Tritiya Prahara / Aparanha)
  // Prahara 4: 15:00 - 18:00 (Chaturtha Prahara / Sayankala)
  // Prahara 5: 18:00 - 21:00 (Pradosha)
  // Prahara 6: 21:00 - 00:00 (Nisitha / Ratri)
  // Prahara 7: 00:00 - 03:00 (Triyama)
  // Prahara 8: 03:00 - 06:00 (Brahma Muhurta / Usha)

  let index = Math.floor(((normalized - 360 + 1440) % 1440) / 180) + 1;
  if (index < 1 || index > 8) index = 1;

  const PRAHARAS = [
    {
      index: 1,
      name: "Pratham Prahara (Morning)",
      hindiName: "प्रथम प्रहर (प्रातः)",
      description: "06:00 - 09:00 • Dawn and morning rituals",
    },
    {
      index: 2,
      name: "Dvitiya Prahara (Midday)",
      hindiName: "द्वितीय प्रहर (मध्याह्न)",
      description: "09:00 - 12:00 • Ascending Sun toward zenith",
    },
    {
      index: 3,
      name: "Tritiya Prahara (Afternoon)",
      hindiName: "तृतीय प्रहर (अपराह्न)",
      description: "12:00 - 15:00 • Post-solar noon descent",
    },
    {
      index: 4,
      name: "Chaturtha Prahara (Evening)",
      hindiName: "चतुर्थ प्रहर (सायंकाल)",
      description: "15:00 - 18:00 • Late afternoon to sunset",
    },
    {
      index: 5,
      name: "Pancham Prahara (Dusk)",
      hindiName: "पञ्चम प्रहर (प्रदोष)",
      description: "18:00 - 21:00 • Twilight and early night",
    },
    {
      index: 6,
      name: "Shashta Prahara (Midnight)",
      hindiName: "षष्ठ प्रहर (निशीथ)",
      description: "21:00 - 00:00 • Deep midnight watch",
    },
    {
      index: 7,
      name: "Saptam Prahara (Night)",
      hindiName: "सप्तम प्रहर (त्रियामा)",
      description: "00:00 - 03:00 • Third quarter of the night",
    },
    {
      index: 8,
      name: "Ashtam Prahara (Pre-dawn)",
      hindiName: "अष्टम प्रहर (ब्रह्ममुहूर्त)",
      description: "03:00 - 06:00 • Sacred pre-dawn hour of contemplation",
    },
  ];

  return PRAHARAS[index - 1] || PRAHARAS[0];
}
