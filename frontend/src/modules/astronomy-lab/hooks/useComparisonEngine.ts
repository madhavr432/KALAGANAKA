/**
 * hooks/useComparisonEngine.ts
 * Communicates with backend endpoints for real-time astronomical comparisons
 * and multi-day time-series residual data.
 */

import { useState, useEffect, useCallback } from "react";
import {
  fetchSolarComparison,
  fetchSolarTimeSeries,
  fetchModernPlanets,
  checkBackendHealth,
  type SolarComparisonResponse,
  type SolarTimeSeriesResponse,
  type ModernPlanetsResponse,
} from "@/services/astronomy-api";

interface UseComparisonEngineParams {
  compareDate: string;
  compareTime: string;
  timeSeriesStartDate: string;
  timeSeriesDays: number;
}

export function useComparisonEngine({
  compareDate,
  compareTime,
  timeSeriesStartDate,
  timeSeriesDays,
}: UseComparisonEngineParams) {
  // Backend availability
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  // Single date comparison state
  const [comparisonResult, setComparisonResult] = useState<SolarComparisonResponse | null>(null);
  const [isComparisonLoading, setIsComparisonLoading] = useState<boolean>(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);

  // Time-series graph state
  const [timeSeriesResult, setTimeSeriesResult] = useState<SolarTimeSeriesResponse | null>(null);
  const [isTimeSeriesLoading, setIsTimeSeriesLoading] = useState<boolean>(false);
  const [timeSeriesError, setTimeSeriesError] = useState<string | null>(null);

  // Modern planetary coordinates state
  const [planetaryData, setPlanetaryData] = useState<ModernPlanetsResponse | null>(null);

  // Check backend health
  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then((online) => {
      if (mounted) setIsBackendOnline(online);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch single date comparison
  const executeComparison = useCallback(async () => {
    setIsComparisonLoading(true);
    setComparisonError(null);

    try {
      const instantStr = `${compareDate}T${compareTime}:00Z`;
      const [compRes, planetsRes] = await Promise.allSettled([
        fetchSolarComparison(compareDate),
        fetchModernPlanets(instantStr),
      ]);

      if (compRes.status === "fulfilled") {
        setComparisonResult(compRes.value);
        setIsBackendOnline(true);
      } else {
        setComparisonError(compRes.reason?.message || "Failed to fetch solar comparison");
      }

      if (planetsRes.status === "fulfilled") {
        setPlanetaryData(planetsRes.value);
      }
    } catch (err) {
      setComparisonError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setIsComparisonLoading(false);
    }
  }, [compareDate, compareTime]);

  // Fetch time-series data
  const executeTimeSeries = useCallback(async () => {
    setIsTimeSeriesLoading(true);
    setTimeSeriesError(null);

    try {
      const tsRes = await fetchSolarTimeSeries({
        start_date: timeSeriesStartDate,
        days: timeSeriesDays,
        step_days: 1,
      });
      setTimeSeriesResult(tsRes);
      setIsBackendOnline(true);
    } catch (err) {
      setTimeSeriesError(err instanceof Error ? err.message : "Failed to fetch time series");
    } finally {
      setIsTimeSeriesLoading(false);
    }
  }, [timeSeriesStartDate, timeSeriesDays]);

  // Execute on parameter change
  useEffect(() => {
    executeComparison();
  }, [executeComparison]);

  useEffect(() => {
    executeTimeSeries();
  }, [executeTimeSeries]);

  return {
    isBackendOnline,
    comparisonResult,
    isComparisonLoading,
    comparisonError,
    executeComparison,
    timeSeriesResult,
    isTimeSeriesLoading,
    timeSeriesError,
    executeTimeSeries,
    planetaryData,
  };
}
