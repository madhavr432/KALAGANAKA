import { describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import {
  hoursToTraditionalTime,
  calculateSamratYantraShadow,
  validateDateRange,
  validateTimeString,
  validateCoordinates,
  formatTimezoneAwareInstant,
  OBSERVATORY_PRESETS,
} from "@/services/samrat-yantra-math";

describe("Samrat Yantra Mathematical & Astronomical Models", () => {
  it("converts decimal hours to traditional Indian time units (Ghati, Pala, Vipala)", () => {
    // 24 hours = exactly 60 Ghatis
    const fullDay = hoursToTraditionalTime(24);
    expect(fullDay.ghati).toBe(0); // modulo 24 is 0h = 0 Ghatis
    expect(fullDay.totalGhatiDecimal).toBe(0);

    // 12 hours (solar noon) = exactly 30 Ghatis
    const noon = hoursToTraditionalTime(12);
    expect(noon.ghati).toBe(30);
    expect(noon.pala).toBe(0);
    expect(noon.vipala).toBe(0);
    expect(noon.totalGhatiDecimal).toBe(30);

    // 1 hour = 2.5 Ghatis = 2 Ghatis and 30 Palas
    const oneHour = hoursToTraditionalTime(1);
    expect(oneHour.ghati).toBe(2);
    expect(oneHour.pala).toBe(30);
    expect(oneHour.vipala).toBe(0);
    expect(oneHour.totalGhatiDecimal).toBe(2.5);

    // 24 seconds = 1 Pala
    const twentyFourSec = hoursToTraditionalTime(24 / 3600);
    expect(twentyFourSec.ghati).toBe(0);
    expect(twentyFourSec.pala).toBe(1);
  });

  it("calculates shadow quadrant geometry for forenoon (Western Quadrant)", () => {
    // 9:00 AM (3 hours before 12:00 noon) => Hour Angle = -45°
    const shadow = calculateSamratYantraShadow({
      altitudeDeg: 35.0,
      azimuthDeg: 120.0,
      latitudeDeg: 26.9248, // Jaipur
      isSunUp: true,
      currentInstantLocal: "2026-10-28T09:00:00+05:30",
      solarNoonLocal: "2026-10-28T12:00:00+05:30",
    });

    expect(shadow.isSunUp).toBe(true);
    expect(shadow.hourAngleDeg).toBeCloseTo(-45.0, 1);
    expect(shadow.quadrant).toBe("western");
    expect(shadow.readingHours).toBe(9);
    expect(shadow.readingMinutes).toBe(0);
  });

  it("calculates shadow quadrant geometry for afternoon (Eastern Quadrant)", () => {
    // 15:00 PM (3 hours after 12:00 noon) => Hour Angle = +45°
    const shadow = calculateSamratYantraShadow({
      altitudeDeg: 35.0,
      azimuthDeg: 240.0,
      latitudeDeg: 26.9248, // Jaipur
      isSunUp: true,
      currentInstantLocal: "2026-10-28T15:00:00+05:30",
      solarNoonLocal: "2026-10-28T12:00:00+05:30",
    });

    expect(shadow.isSunUp).toBe(true);
    expect(shadow.hourAngleDeg).toBeCloseTo(45.0, 1);
    expect(shadow.quadrant).toBe("eastern");
    expect(shadow.readingHours).toBe(15);
    expect(shadow.readingMinutes).toBe(0);
  });

  it("marks instrument inactive when Sun is below horizon (nighttime)", () => {
    const shadow = calculateSamratYantraShadow({
      altitudeDeg: -15.0,
      azimuthDeg: 10.0,
      latitudeDeg: 28.6271, // Delhi
      isSunUp: false,
      currentInstantLocal: "2026-10-28T23:00:00+05:30",
    });

    expect(shadow.isSunUp).toBe(false);
    expect(shadow.quadrant).toBe("none");
    expect(shadow.shadowLengthRatio).toBeNull();
  });

  it("validates dates strictly against JPL DE421 ephemeris range (1899-07-29 to 2053-10-08)", () => {
    expect(validateDateRange("2026-10-28").valid).toBe(true);
    expect(validateDateRange("1950-01-01").valid).toBe(true);
    expect(validateDateRange("2050-05-15").valid).toBe(true);

    // Invalid format
    expect(validateDateRange("28-10-2026").valid).toBe(false);
    expect(validateDateRange("invalid-date").valid).toBe(false);

    // Impossible calendar dates
    expect(validateDateRange("2026-02-30").valid).toBe(false);

    // Out of ephemeris bounds
    expect(validateDateRange("1850-01-01").valid).toBe(false);
    expect(validateDateRange("2075-01-01").valid).toBe(false);
  });

  it("validates time formats (HH:mm)", () => {
    expect(validateTimeString("12:00").valid).toBe(true);
    expect(validateTimeString("00:00").valid).toBe(true);
    expect(validateTimeString("23:59").valid).toBe(true);

    expect(validateTimeString("24:00").valid).toBe(false);
    expect(validateTimeString("12:60").valid).toBe(false);
    expect(validateTimeString("9:00").valid).toBe(false);
    expect(validateTimeString("invalid").valid).toBe(false);
  });

  it("validates geographical coordinates", () => {
    expect(validateCoordinates(26.9248, 75.8246, 430).valid).toBe(true);
    expect(validateCoordinates(90, 180, 0).valid).toBe(true);
    expect(validateCoordinates(-90, -180, 0).valid).toBe(true);

    // Out of bounds
    expect(validateCoordinates(95, 75).valid).toBe(false);
    expect(validateCoordinates(26, 195).valid).toBe(false);
    expect(validateCoordinates(26, 75, -1000).valid).toBe(false);
    expect(validateCoordinates(26, 75, 20000).valid).toBe(false);
  });

  it("formats timezone-aware ISO instant strings for the backend", () => {
    const formatted = formatTimezoneAwareInstant("2026-10-28", "12:00", "+05:30");
    expect(formatted).toBe("2026-10-28T12:00:00+05:30");

    const kolkata = formatTimezoneAwareInstant("2026-10-28", "14:30", "Asia/Kolkata");
    expect(kolkata).toBe("2026-10-28T14:30:00+05:30");

    const utc = formatTimezoneAwareInstant("2026-10-28", "06:30", "UTC");
    expect(utc).toBe("2026-10-28T06:30:00Z");
  });

  it("includes all five historic Jantar Mantar observatory presets", () => {
    const ids = OBSERVATORY_PRESETS.map((p) => p.id);
    expect(ids).toContain("jaipur");
    expect(ids).toContain("delhi");
    expect(ids).toContain("ujjain");
    expect(ids).toContain("varanasi");
    expect(ids).toContain("mathura");
  });
});

describe("App Routing with Samrat Yantra", () => {
  it("matches route for /", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/");
  });

  it("matches route for /samrat-yantra without falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes("/samrat-yantra");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/samrat-yantra");
  });
});

describe("Samrat Yantra Educational Component", () => {
  it("renders educational content without runtime errors", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { SamratYantraEducational } =
      await import("@/components/samrat-yantra/SamratYantraEducational");

    const { container } = render(<SamratYantraEducational />);
    expect(container).toBeDefined();
    expect(screen.getAllByText(/Ghati/).length).toBeGreaterThan(0);
    expect(screen.getByText(/1\/60th of a solar day/)).toBeDefined();
    expect(screen.getAllByText(/Konark/).length).toBeGreaterThan(0);
  });
});
