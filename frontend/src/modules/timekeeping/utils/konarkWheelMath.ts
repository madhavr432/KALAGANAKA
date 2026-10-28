/**
 * Mathematical calculations and horological logic for the Konark Sun Temple Wheel.
 * Models:
 * - 24 Wheels of the temple (12 on each side) representing 24 hours / 24 Pakshas
 * - 8 Major Spokes dividing the 24-hour cycle into 8 Praharas of 3 hours (180 minutes) each
 * - 8 Minor Spokes dividing each Prahara into 1.5 hours (90 minutes)
 * - 30 Carved Beads between each major and minor spoke, representing 3 minutes per bead
 * - Sub-division of each bead into thirds to estimate down to single minutes
 */

export const KONARK_WHEEL_CONFIG = {
  totalWheels: 24,
  wheelsPerSide: 12,
  majorSpokes: 8,
  minorSpokes: 8,
  totalSectors: 16,
  beadsPerSector: 30,
  totalBeads: 480,
  minutesPerMajorSector: 180,
  minutesPerMinorSector: 90,
  minutesPerBead: 3,
};

export interface KonarkBeadState {
  praharaIndex: number;
  praharaName: string;
  praharaHindi: string;
  sectorType: "major_to_minor" | "minor_to_major";
  minutesIntoSector: number;
  activeBeadIndex: number;
  subBeadThird: number;
  estimatedMinuteOfHour: number;
  formulaBreakdown: string;
  shadowAngleDeg: number;
}

export interface KonarkWheelReading {
  praharaIndex: number; // 1 to 8
  praharaName: string;
  praharaHindi: string;
  praharaTimeRange: string;
  isFirstHalf: boolean; // true = Major -> Minor (0-90 min), false = Minor -> Major (90-180 min)
  sectorLabel: string;
  beadIndex: number; // 1 to 30
  beadThird: number; // 1, 2, or 3
  beadThirdLabel: string;
  exactMinuteOffset: number; // 0 to 89
  calculatedTimeFormatted: string;
  shadowAngleDeg: number; // 0 to 360 degrees on the wheel face
}

/**
 * Calculates the exact Konark Chakra spoke, bead, and minute reading
 * for a given time in minutes since midnight (0 to 1439).
 */
export function calculateKonarkBeadState(minutesSinceMidnight: number): KonarkBeadState {
  const normMinutes = ((minutesSinceMidnight % 1440) + 1440) % 1440;

  // Traditional day starts at dawn (06:00 = 360 min)
  const elapsedSinceSunrise = (normMinutes - 360 + 1440) % 1440;
  const prahara0Indexed = Math.floor(elapsedSinceSunrise / 180);
  const praharaIndex = prahara0Indexed + 1;

  const PRAHARA_NAMES = [
    { name: "Prathama Prahara (Morning)", hindi: "प्रथम प्रहर (प्रातः)" },
    { name: "Dvitiya Prahara (Forenoon)", hindi: "द्वितीय प्रहर (संगव)" },
    { name: "Tritiya Prahara (Midday/Afternoon)", hindi: "तृतीय प्रहर (मध्याह्न)" },
    { name: "Chaturtha Prahara (Late Afternoon)", hindi: "चतुर्थ प्रहर (अपराह्न)" },
    { name: "Panchama Prahara (Dusk)", hindi: "पञ्चम प्रहर (प्रदोष)" },
    { name: "Shashta Prahara (Midnight)", hindi: "षष्ठ प्रहर (निशीथ)" },
    { name: "Saptama Prahara (Deep Night)", hindi: "सप्तम प्रहर (त्रियामा)" },
    { name: "Ashtama Prahara (Brahma Muhurta)", hindi: "अष्टम प्रहर (उषाकाल)" },
  ];

  const praharaInfo = PRAHARA_NAMES[prahara0Indexed] || PRAHARA_NAMES[0];
  const elapsedInPrahara = elapsedSinceSunrise % 180;

  const isMajorToMinor = elapsedInPrahara < 90;
  const sectorType: "major_to_minor" | "minor_to_major" = isMajorToMinor
    ? "major_to_minor"
    : "minor_to_major";
  const minutesIntoSector = isMajorToMinor ? elapsedInPrahara : elapsedInPrahara - 90;

  // 30 beads in a 90-minute sector -> 3 minutes per bead (1 to 30)
  const bead0 = Math.floor(minutesIntoSector / 3);
  const activeBeadIndex = Math.min(30, Math.max(1, bead0 + 1));
  const subBeadThird = Math.floor(minutesIntoSector % 3);

  const estimatedMinuteOfHour = Math.floor(normMinutes % 60);

  const formulaBreakdown = `Sector: ${
    isMajorToMinor ? "Major → Minor" : "Minor → Major"
  } (${minutesIntoSector}m / 90m) | Bead #${activeBeadIndex} × 3m + ${subBeadThird}m`;

  // Shadow angle on wheel face: 360 degrees per 1440 minutes (0.25 deg/min)
  const shadowAngleDeg = (((normMinutes - 360) / 1440) * 360 + 360) % 360;

  return {
    praharaIndex,
    praharaName: praharaInfo.name,
    praharaHindi: praharaInfo.hindi,
    sectorType,
    minutesIntoSector,
    activeBeadIndex,
    subBeadThird,
    estimatedMinuteOfHour,
    formulaBreakdown,
    shadowAngleDeg,
  };
}

/**
 * Calculates the exact Konark Chakra spoke, bead, and minute reading
 * for a given time in minutes since midnight (0 to 1439).
 */
export function calculateKonarkWheelReading(minutesSinceMidnight: number): KonarkWheelReading {
  const normMinutes = ((minutesSinceMidnight % 1440) + 1440) % 1440;

  // The 8 Praharas of traditional Indian timekeeping (3 hours = 180 minutes each)
  // Traditional day starts at dawn (~06:00 / 360 min):
  // Prahara 1: 06:00 - 09:00 (Pratham Prahara / Morning)
  // Prahara 2: 09:00 - 12:00 (Dvitiya Prahara / Midday)
  // Prahara 3: 12:00 - 15:00 (Tritiya Prahara / Afternoon)
  // Prahara 4: 15:00 - 18:00 (Chaturtha Prahara / Evening)
  // Prahara 5: 18:00 - 21:00 (Pancham Prahara / Dusk)
  // Prahara 6: 21:00 - 00:00 (Shashta Prahara / Midnight)
  // Prahara 7: 00:00 - 03:00 (Saptam Prahara / Night)
  // Prahara 8: 03:00 - 06:00 (Ashtam Prahara / Pre-dawn)

  const PRAHARAS_CONFIG = [
    {
      index: 1,
      startMin: 360,
      name: "Pratham Prahara (Morning)",
      hindi: "प्रथम प्रहर (प्रातः)",
      range: "06:00 – 09:00",
    },
    {
      index: 2,
      startMin: 540,
      name: "Dvitiya Prahara (Forenoon)",
      hindi: "द्वितीय प्रहर (संगव)",
      range: "09:00 – 12:00",
    },
    {
      index: 3,
      startMin: 720,
      name: "Tritiya Prahara (Midday/Afternoon)",
      hindi: "तृतीय प्रहर (मध्याह्न)",
      range: "12:00 – 15:00",
    },
    {
      index: 4,
      startMin: 900,
      name: "Chaturtha Prahara (Late Afternoon)",
      hindi: "चतुर्थ प्रहर (अपराह्न)",
      range: "15:00 – 18:00",
    },
    {
      index: 5,
      startMin: 1080,
      name: "Pancham Prahara (Dusk/Pradosha)",
      hindi: "पञ्चम प्रहर (प्रदोष)",
      range: "18:00 – 21:00",
    },
    {
      index: 6,
      startMin: 1260,
      name: "Shashta Prahara (Midnight/Nisitha)",
      hindi: "षष्ठ प्रहर (निशीथ)",
      range: "21:00 – 00:00",
    },
    {
      index: 7,
      startMin: 0,
      name: "Saptam Prahara (Deep Night)",
      hindi: "सप्तम प्रहर (त्रियामा)",
      range: "00:00 – 03:00",
    },
    {
      index: 8,
      startMin: 180,
      name: "Ashtam Prahara (Brahma Muhurta)",
      hindi: "अष्टम प्रहर (उषाकाल)",
      range: "03:00 – 06:00",
    },
  ];

  // Determine which prahara
  let praharaConfig = PRAHARAS_CONFIG[0];
  let elapsedInPrahara = 0;

  for (const p of PRAHARAS_CONFIG) {
    const endMin = (p.startMin + 180) % 1440;
    if (p.startMin < endMin) {
      if (normMinutes >= p.startMin && normMinutes < endMin) {
        praharaConfig = p;
        elapsedInPrahara = normMinutes - p.startMin;
        break;
      }
    } else {
      // Wraparound across midnight (e.g. 21:00 to 00:00)
      if (normMinutes >= p.startMin || normMinutes < endMin) {
        praharaConfig = p;
        elapsedInPrahara = (normMinutes - p.startMin + 1440) % 1440;
        break;
      }
    }
  }

  // Each Prahara has two halves of 90 minutes each:
  // First half: Major Spoke -> Minor Spoke (0 to 89 min)
  // Second half: Minor Spoke -> Next Major Spoke (90 to 179 min)
  const isFirstHalf = elapsedInPrahara < 90;
  const minuteInSegment = isFirstHalf ? elapsedInPrahara : elapsedInPrahara - 90;
  const sectorLabel = isFirstHalf
    ? "Major Spoke → Minor Spoke (0 – 90 mins)"
    : "Minor Spoke → Next Major Spoke (90 – 180 mins)";

  // 30 Beads in this 90-minute segment:
  // 90 minutes / 30 beads = exactly 3 minutes per bead!
  const rawBead = Math.floor(minuteInSegment / 3);
  const beadIndex = Math.min(30, Math.max(1, rawBead + 1));

  // Remainder in minutes within the active bead (0, 1, or 2):
  // 0 min remainder = 1st third (outer edge, +0 min)
  // 1 min remainder = 2nd third (bead center, +1 min)
  // 2 min remainder = 3rd third (inner edge, +2 min)
  const remainderMinutes = Math.floor(minuteInSegment % 3);
  const beadThird = remainderMinutes + 1;
  const beadThirdLabel =
    remainderMinutes === 0
      ? "1st Third (+0 min)"
      : remainderMinutes === 1
        ? "2nd Third / Center (+1 min)"
        : "3rd Third (+2 min)";

  // Format the calculated time
  const calculatedHours = Math.floor(normMinutes / 60);
  const calculatedMins = Math.floor(normMinutes % 60);
  const calculatedTimeFormatted = `${calculatedHours.toString().padStart(2, "0")}:${calculatedMins
    .toString()
    .padStart(2, "0")}`;

  // Shadow angle on wheel face:
  // Major Spoke 1 (06:00) is at 180° (bottom, where dawn shadow lands)
  // At 12:00 (Solar Noon), shadow points straight up (90° / top spoke)
  // Angle rotates counter-clockwise or clockwise across 360° for 24h
  // In Three.js XY plane:
  // Let 06:00 = -Math.PI / 2 (-90° / bottom)
  // 12:00 = Math.PI / 2 (+90° / top)
  // Total rotation: (normMinutes - 360) / 1440 * 360 degrees
  const shadowAngleDeg = (((normMinutes - 360) / 1440) * 360 + 360) % 360;

  return {
    praharaIndex: praharaConfig.index,
    praharaName: praharaConfig.name,
    praharaHindi: praharaConfig.hindi,
    praharaTimeRange: praharaConfig.range,
    isFirstHalf,
    sectorLabel,
    beadIndex,
    beadThird,
    beadThirdLabel,
    exactMinuteOffset: Math.floor(minuteInSegment),
    calculatedTimeFormatted,
    shadowAngleDeg,
  };
}
