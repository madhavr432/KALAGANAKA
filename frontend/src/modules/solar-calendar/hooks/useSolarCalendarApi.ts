/**
 * API Integration and Ephemeris Synchronization Hook for Module 2.
 * Coordinates JPL DE421 ephemeris queries, sunrise/sunset events, and traditional
 * solar comparison with debouncing and resilient offline math fallback.
 */

import { useState, useEffect, useRef, useMemo } from "react";
import {
  fetchModernPlanets,
  fetchSolarEvents,
  fetchSolarComparison,
  checkBackendHealth,
  ModernPlanetsResponse,
  SolarEventsResponse,
  SolarComparisonResponse,
} from "@/services/astronomy-api";
import { calculateSolarValues } from "../utils/solarCalculations";
import { SolarCalculatedValues, SolarCalendarApiState } from "../types/solarCalendar";

interface UseSolarCalendarApiProps {
  selectedDate: string;
  selectedTime: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  timezone: string;
  isPlaying: boolean;
}

export function useSolarCalendarApi({
  selectedDate,
  selectedTime,
  latitude,
  longitude,
  elevation_m,
  timezone,
  isPlaying,
}: UseSolarCalendarApiProps) {
  const [apiState, setApiState] = useState<SolarCalendarApiState>({
    planetsData: null,
    solarEvents: null,
    comparisonData: null,
    isLoading: false,
    isBackendConnected: false,
    error: null,
    lastUpdated: null,
  });

  // In-memory LRU cache to prevent redundant network fetches
  const cacheRef = useRef<
    Map<
      string,
      {
        planets: ModernPlanetsResponse;
        events: SolarEventsResponse;
        comparison: SolarComparisonResponse;
      }
    >
  >(new Map());

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If playing continuous animation, skip live API calls to preserve 60fps rendering
    // and rely on the Keplerian mathematical calculation engine.
    if (isPlaying) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce 250ms when user scrubs or picks dates
    debounceTimerRef.current = setTimeout(async () => {
      const cacheKey = `${selectedDate}_${selectedTime}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;

      if (cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey)!;
        setApiState((prev) => ({
          ...prev,
          planetsData: cached.planets,
          solarEvents: cached.events,
          comparisonData: cached.comparison,
          isLoading: false,
          isBackendConnected: true,
          error: null,
          lastUpdated: new Date().toLocaleTimeString(),
        }));
        return;
      }

      setApiState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const isOnline = await checkBackendHealth();
        if (!isOnline) {
          setApiState((prev) => ({
            ...prev,
            isLoading: false,
            isBackendConnected: false,
          }));
          return;
        }

        const instantIso = `${selectedDate}T${selectedTime}:00+05:30`;

        const [planetsRes, eventsRes, comparisonRes] = await Promise.all([
          fetchModernPlanets(instantIso),
          fetchSolarEvents({
            date: selectedDate,
            latitude,
            longitude,
            elevation_m,
            timezone,
          }),
          fetchSolarComparison(selectedDate).catch(
            () => null as unknown as SolarComparisonResponse,
          ),
        ]);

        if (planetsRes && eventsRes) {
          cacheRef.current.set(cacheKey, {
            planets: planetsRes,
            events: eventsRes,
            comparison: comparisonRes,
          });

          // Keep cache size bounded
          if (cacheRef.current.size > 100) {
            const firstKey = cacheRef.current.keys().next().value;
            if (firstKey) cacheRef.current.delete(firstKey);
          }
        }

        setApiState({
          planetsData: planetsRes,
          solarEvents: eventsRes,
          comparisonData: comparisonRes,
          isLoading: false,
          isBackendConnected: true,
          error: null,
          lastUpdated: new Date().toLocaleTimeString(),
        });
      } catch (err) {
        setApiState((prev) => ({
          ...prev,
          isLoading: false,
          isBackendConnected: false,
          error: err instanceof Error ? err.message : "Error connecting to ephemeris backend",
        }));
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [selectedDate, selectedTime, latitude, longitude, elevation_m, timezone, isPlaying]);

  // Compute derived solar values integrating live ephemeris overrides when available
  const solarValues: SolarCalculatedValues = useMemo(() => {
    // Only use backend ephemeris override if not actively animating and the data belongs to the selected date
    const dateMatches = apiState.planetsData?.instant?.startsWith(selectedDate);
    const override =
      !isPlaying && dateMatches && apiState.planetsData?.positions_tropical_deg
        ? {
            tropicalLong: apiState.planetsData.positions_tropical_deg["Sun"],
            siderealLong: apiState.planetsData.positions_sidereal_deg["Sun"],
            ayanamsha: apiState.planetsData.ayanamsha_deg,
          }
        : undefined;

    return calculateSolarValues(selectedDate, selectedTime, override);
  }, [selectedDate, selectedTime, apiState.planetsData, isPlaying]);

  return {
    apiState,
    solarValues,
  };
}
