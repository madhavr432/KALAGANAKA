/**
 * hooks/useLunarCalendarApi.ts
 * Integrates live FastAPI ephemeris endpoints with debounced requests and robust offline reduction fallbacks.
 */

import { useState, useEffect, useRef, useMemo } from "react";
import {
  fetchPanchangInstant,
  fetchNextTransition,
  fetchSolarEvents,
  checkBackendHealth,
  type PanchangInstantResponse,
  type NextTransitionResponse,
  type SolarEventsResponse,
} from "@/services/astronomy-api";
import { computeCompleteLunarState } from "../utils/lunarCalculations";
import type {
  MoonPhysicalState,
  PanchangLimbsState,
  LunarMonthState,
} from "../types/lunarCalendar";

interface UseLunarCalendarApiParams {
  selectedDate: string;
  selectedTime: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  timezone: string;
  isPlaying: boolean;
}

export function useLunarCalendarApi({
  selectedDate,
  selectedTime,
  latitude,
  longitude,
  elevation_m,
  timezone,
  isPlaying,
}: UseLunarCalendarApiParams) {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [instantPanchang, setInstantPanchang] = useState<PanchangInstantResponse | null>(null);
  const [nextTithiTransition, setNextTithiTransition] = useState<NextTransitionResponse | null>(
    null,
  );
  const [solarEvents, setSolarEvents] = useState<SolarEventsResponse | null>(null);

  // Health check on mount
  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then((online) => {
      if (mounted) setIsBackendOnline(online);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Debounced API fetcher
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If playing, skip remote API network spam to keep 60 FPS smooth
    if (isPlaying) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true);
      setApiError(null);

      const instantStr = `${selectedDate}T${selectedTime}:00`;

      try {
        const [panchangRes, transitionRes, solarRes] = await Promise.allSettled([
          fetchPanchangInstant({ instant: instantStr, timezone }),
          fetchNextTransition({ instant: instantStr, anga_type: "tithi", timezone }),
          fetchSolarEvents({
            date: selectedDate,
            observer: { latitude, longitude, elevation_m, timezone },
          }),
        ]);

        if (panchangRes.status === "fulfilled") {
          setInstantPanchang(panchangRes.value);
          setIsBackendOnline(true);
        } else {
          setIsBackendOnline(false);
        }

        if (transitionRes.status === "fulfilled") {
          setNextTithiTransition(transitionRes.value);
        } else {
          setNextTithiTransition(null);
        }

        if (solarRes.status === "fulfilled") {
          setSolarEvents(solarRes.value);
        } else {
          setSolarEvents(null);
        }
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Calculation failed");
        setIsBackendOnline(false);
      } finally {
        setIsLoading(false);
      }
    }, 180); // 180ms debounce

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [selectedDate, selectedTime, latitude, longitude, elevation_m, timezone, isPlaying]);

  // Compute unified lunar and Panchang values
  const lunarValues = useMemo<{
    moonState: MoonPhysicalState;
    panchangLimbs: PanchangLimbsState;
    lunarMonth: LunarMonthState;
  }>(() => {
    if (instantPanchang) {
      // Overrides from live JPL ephemeris
      const tithiData = instantPanchang.tithi;
      return computeCompleteLunarState(selectedDate, selectedTime, {
        elongationDeg: tithiData.angular_separation_deg,
        sunTropicalDeg: instantPanchang.sun_apparent_tropical_longitude_deg,
        moonTropicalDeg: instantPanchang.moon_apparent_tropical_longitude_deg,
        sunSiderealDeg: instantPanchang.sun_apparent_sidereal_longitude_deg,
        moonSiderealDeg: instantPanchang.moon_apparent_sidereal_longitude_deg,
        ayanamshaDeg: instantPanchang.ayanamsha_deg,
        tithiRemainingHours: nextTithiTransition?.hours_remaining,
        tithiTransitionLocal: nextTithiTransition?.next_transition?.transition_time_local,
      });
    }

    // High-accuracy fallback
    return computeCompleteLunarState(selectedDate, selectedTime);
  }, [instantPanchang, nextTithiTransition, selectedDate, selectedTime]);

  return {
    apiState: {
      isLoading,
      isBackendOnline,
      apiError,
      solarEvents,
      nextTithiTransition,
      instantPanchang,
    },
    lunarValues,
    isLiveBackend: Boolean(isBackendOnline && instantPanchang),
  };
}
