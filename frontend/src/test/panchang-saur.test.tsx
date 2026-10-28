import { describe, expect, it } from "vitest";
import { RASHIS } from "@/components/saur-panchang/RashiSolarWheel";

describe("Saur Panchang & Rashi Solar Wheel Computations", () => {
  it("contains all 12 Rashis with correct 30-degree sector spans", () => {
    expect(RASHIS).toHaveLength(12);

    RASHIS.forEach((rashi, idx) => {
      expect(rashi.index).toBe(idx + 1);
      expect(rashi.startDeg).toBe(idx * 30);
      expect(rashi.endDeg).toBe((idx + 1) * 30);
      expect(rashi.sanskritName).toBeDefined();
      expect(rashi.englishName).toBeDefined();
      expect(rashi.symbol).toBeDefined();
    });

    // Check specific landmark Rashis
    expect(RASHIS[0].englishName).toBe("Aries"); // Mesha
    expect(RASHIS[3].englishName).toBe("Cancer"); // Karka
    expect(RASHIS[6].englishName).toBe("Libra"); // Tula
    expect(RASHIS[9].englishName).toBe("Capricorn"); // Makara
  });

  it("calculates illumination percentage from angular elongation accurately", () => {
    // Helper formula: (1 - cos(rad)) / 2 * 100
    const calcIllum = (deg: number) => {
      const rad = (deg * Math.PI) / 180;
      return Math.round(((1 - Math.cos(rad)) / 2) * 100);
    };

    // 0° = Amavasya (0% illumination)
    expect(calcIllum(0)).toBe(0);

    // 180° = Purnima (100% illumination)
    expect(calcIllum(180)).toBe(100);

    // 90° = First Quarter (50% illumination)
    expect(calcIllum(90)).toBe(50);

    // 270° = Last Quarter (50% illumination)
    expect(calcIllum(270)).toBe(50);
  });
});
