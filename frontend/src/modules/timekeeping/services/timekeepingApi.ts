/**
 * Timekeeping Module API Service
 * Handles communication with the FastAPI backend for solar position and events.
 * Provides abortable requests, graceful error handling, and offline fallback tracking.
 */

import { SolarCalculatedData } from "../types/timekeeping";
import { buildCalculatedSolarData } from "../utils/solarCalculations";
import { formatIsoToTime, minutesToTimeStr } from "../utils/timeFormatting";

const API_BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : "http://127.0.0.1:8000";

let activeAbortController: AbortController | null = null;

export interface BackendSolarEventsResponse {
  date: string;
  observer: {
    latitude: number;
    longitude: number;
    elevation_m: number;
    timezone: string;
  };
  sunrise: {
    time_local: string | null;
    time_utc: string | null;
    available: boolean;
    reason: string | null;
  };
  sunset: {
    time_local: string | null;
    time_utc: string | null;
    available: boolean;
    reason: string | null;
  };
  solar_noon: {
    time_local: string | null;
    time_utc: string | null;
    available: boolean;
    reason: string | null;
  };
  day_length_hours: number | null;
  conventions?: Record<string, string>;
  assumptions?: string[];
}

export interface BackendSolarPositionResponse {
  instant: string;
  observer: {
    latitude: number;
    longitude: number;
    elevation_m: number;
    timezone?: string;
  };
  altitude_deg: number;
  altitude_refracted_deg: number;
  azimuth_deg: number;
  distance_au: number;
  distance_km: number;
  is_sun_up: boolean;
  conventions?: Record<string, string>;
}

/**
 * Formats local date and minutes into an ISO-8601 string with appropriate timezone offset.
 * Example: 2026-10-27 + 720 mins + Asia/Kolkata -> "2026-10-27T12:00:00+05:30"
 */
export function formatInstantIso(
  dateStr: string,
  minutesSinceMidnight: number,
  timezone: string,
): string {
  const timeStr = minutesToTimeStr(minutesSinceMidnight, true);

  // If timezone is a direct offset like "+05:30"
  if (/^[+-]\d{2}:\d{2}$/.test(timezone)) {
    return `${dateStr}T${timeStr}${timezone}`;
  }
  if (timezone === "UTC" || timezone === "Z") {
    return `${dateStr}T${timeStr}Z`;
  }

  // Common offset lookup for Indian Standard Time
  if (timezone === "Asia/Kolkata") {
    return `${dateStr}T${timeStr}+05:30`;
  }

  // Calculate offset using Intl
  try {
    const d = new Date(`${dateStr}T${timeStr}Z`);
    const inv = new Date(d.toLocaleString("en-US", { timeZone: timezone }));
    const diffMin = Math.round((inv.getTime() - d.getTime()) / (1000 * 60));
    const sign = diffMin >= 0 ? "+" : "-";
    const absMin = Math.abs(diffMin);
    const h = Math.floor(absMin / 60)
      .toString()
      .padStart(2, "0");
    const m = (absMin % 60).toString().padStart(2, "0");
    return `${dateStr}T${timeStr}${sign}${h}:${m}`;
  } catch {
    return `${dateStr}T${timeStr}+05:30`;
  }
}

/**
 * Fetch authoritative solar calculations from the backend.
 * Merges position and events when available. If backend is offline,
 * smoothly returns high-precision illustrative data clearly marked as "illustrative".
 */
export async function fetchSolarCalculation(
  dateStr: string,
  minutesSinceMidnight: number,
  latitude: number,
  longitude: number,
  elevation_m: number,
  timezone: string,
): Promise<{
  data: SolarCalculatedData;
  isBackendConnected: boolean;
  errorMessage?: string;
}> {
  // Cancel any prior in-flight fetch request
  if (activeAbortController) {
    activeAbortController.abort();
  }
  activeAbortController = new AbortController();
  const signal = activeAbortController.signal;

  // Always build illustrative baseline first for immediate visual continuity
  const localData = buildCalculatedSolarData(
    dateStr,
    minutesSinceMidnight,
    latitude,
    longitude,
    timezone,
  );

  const instantIso = formatInstantIso(dateStr, minutesSinceMidnight, timezone);

  try {
    // Attempt concurrent request to backend /solar/position and /solar/events
    const positionUrl = `${API_BASE_URL}/solar/position?instant=${encodeURIComponent(
      instantIso,
    )}&latitude=${latitude}&longitude=${longitude}&elevation_m=${elevation_m}`;

    const eventsUrl = `${API_BASE_URL}/solar/events?date=${encodeURIComponent(
      dateStr,
    )}&latitude=${latitude}&longitude=${longitude}&elevation_m=${elevation_m}&timezone=${encodeURIComponent(
      timezone,
    )}`;

    const [posRes, evRes] = await Promise.all([
      fetch(positionUrl, { signal, headers: { Accept: "application/json" } }),
      fetch(eventsUrl, { signal, headers: { Accept: "application/json" } }),
    ]);

    if (!posRes.ok) {
      throw new Error(`Solar position endpoint returned status ${posRes.status}`);
    }

    const posData: BackendSolarPositionResponse = await posRes.json();
    let eventsData: BackendSolarEventsResponse | null = null;
    if (evRes.ok) {
      eventsData = await evRes.json();
    }

    // Merge backend results into authoritative data structure
    const mergedData: SolarCalculatedData = {
      ...localData,
      altitude_deg: posData.altitude_deg,
      altitude_refracted_deg: posData.altitude_refracted_deg,
      azimuth_deg: posData.azimuth_deg,
      distance_au: posData.distance_au,
      distance_km: posData.distance_km,
      is_sun_up: posData.is_sun_up,
      sunrise_local: eventsData?.sunrise?.time_local
        ? formatIsoToTime(eventsData.sunrise.time_local)
        : localData.sunrise_local,
      sunset_local: eventsData?.sunset?.time_local
        ? formatIsoToTime(eventsData.sunset.time_local)
        : localData.sunset_local,
      solar_noon_local: eventsData?.solar_noon?.time_local
        ? formatIsoToTime(eventsData.solar_noon.time_local)
        : localData.solar_noon_local,
      day_length_hours:
        eventsData?.day_length_hours !== undefined
          ? eventsData.day_length_hours
          : localData.day_length_hours,
      source: "backend",
      method_name: "JPL DE421 Ephemeris / Skyfield Topocentric Calculation",
      conventions: posData.conventions || localData.conventions,
      assumptions: eventsData?.assumptions || [
        "Apparent coordinates include light-travel time correction and stellar aberration.",
        "Refraction computed from Sæmundsson standard atmospheric model.",
      ],
    };

    return {
      data: mergedData,
      isBackendConnected: true,
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      // Aborted by newer user input, return local baseline
      return {
        data: localData,
        isBackendConnected: false,
      };
    }
    // Network failure or backend not running: return illustrative data with truthful label
    return {
      data: {
        ...localData,
        source: "illustrative",
        method_name: "Jean Meeus / NOAA Solar Position Algorithm (Illustrative)",
      },
      isBackendConnected: false,
      errorMessage: err instanceof Error ? err.message : "Backend unreachable",
    };
  }
}
