/**
 * Hook for coordinating immediate local solar simulation with debounced
 * authoritative FastAPI backend queries.
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { CalculationStatus, SolarCalculatedData } from "../types/timekeeping";
import { buildCalculatedSolarData } from "../utils/solarCalculations";
import { fetchSolarCalculation } from "../services/timekeepingApi";

interface UseSolarCalculationParams {
  selectedDate: string;
  minutesSinceMidnight: number;
  latitude: number;
  longitude: number;
  elevation_m: number;
  timezone: string;
}

export function useSolarCalculation({
  selectedDate,
  minutesSinceMidnight,
  latitude,
  longitude,
  elevation_m,
  timezone,
}: UseSolarCalculationParams) {
  // Compute immediate synchronous physics so 3D scene responds instantly at 60 FPS
  const immediateData = useMemo(() => {
    return buildCalculatedSolarData(
      selectedDate,
      minutesSinceMidnight,
      latitude,
      longitude,
      timezone,
    );
  }, [selectedDate, minutesSinceMidnight, latitude, longitude, timezone]);

  const [authoritativeData, setAuthoritativeData] = useState<SolarCalculatedData | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [calculationStatus, setCalculationStatus] = useState<CalculationStatus>("illustrative");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // When inputs change, start debounced query to backend
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setCalculationStatus((prev) => (prev === "calculated" ? "loading" : prev));

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const result = await fetchSolarCalculation(
          selectedDate,
          minutesSinceMidnight,
          latitude,
          longitude,
          elevation_m,
          timezone,
        );

        setIsBackendConnected(result.isBackendConnected);
        if (result.isBackendConnected) {
          setAuthoritativeData(result.data);
          setCalculationStatus("calculated");
          setErrorMessage(null);
        } else {
          setAuthoritativeData(null);
          setCalculationStatus("illustrative");
          setErrorMessage(result.errorMessage || null);
        }
      } catch (err: unknown) {
        setIsBackendConnected(false);
        setCalculationStatus("illustrative");
        setErrorMessage(err instanceof Error ? err.message : "Error contacting backend");
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [selectedDate, minutesSinceMidnight, latitude, longitude, elevation_m, timezone]);

  // Use authoritative backend metadata and sunrise/sunset events when available,
  // while ensuring real-time simulation coordinates (altitude, azimuth, time, prahara)
  // update smoothly on every frame tick during playback and slider dragging:
  const activeSolarData: SolarCalculatedData = useMemo(() => {
    if (authoritativeData && authoritativeData.source === "backend") {
      return {
        ...authoritativeData,
        // Dynamic simulation properties driven by the current frame:
        altitude_deg: immediateData.altitude_deg,
        altitude_refracted_deg: immediateData.altitude_refracted_deg,
        azimuth_deg: immediateData.azimuth_deg,
        distance_au: immediateData.distance_au,
        distance_km: immediateData.distance_km,
        is_sun_up: immediateData.is_sun_up,
        local_mean_solar_time: immediateData.local_mean_solar_time,
        local_apparent_solar_time: immediateData.local_apparent_solar_time,
        hour_angle_deg: immediateData.hour_angle_deg,
        prahar_index: immediateData.prahar_index,
        prahar_name: immediateData.prahar_name,
        prahar_hindi: immediateData.prahar_hindi,
        ghati_elapsed: immediateData.ghati_elapsed,
        pala_elapsed: immediateData.pala_elapsed,
      };
    }
    return immediateData;
  }, [authoritativeData, immediateData]);

  return {
    solarData: activeSolarData,
    calculationStatus,
    isBackendConnected,
    errorMessage,
  };
}
