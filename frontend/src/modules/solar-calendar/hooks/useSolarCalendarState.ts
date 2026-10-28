/**
 * Central State Management Hook for Module 2: Solar Calendar & Solar Festivals.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import {
  SOLAR_OBSERVATORY_PRESETS,
  SOLAR_RASHIS,
  SOLAR_FESTIVALS,
} from "../constants/solarConstants";
import {
  getDayOfYear,
  getDateFromDayOfYear,
  getDaysInYear,
  isLeapYear,
} from "../utils/solarCalculations";
import {
  AstronomicalStationEvent,
  SolarFestivalItem,
  FestivalRegion,
  FestivalCategory,
  FestivalTradition,
} from "../types/solarCalendar";

export function useSolarCalendarState() {
  const today = new Date();
  const defaultDateStr = today.toISOString().split("T")[0];

  // Core temporal & geographic state
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTime, setSelectedTime] = useState<string>("12:00");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("ujjain");
  const [latitude, setLatitude] = useState<number>(SOLAR_OBSERVATORY_PRESETS[0].latitude);
  const [longitude, setLongitude] = useState<number>(SOLAR_OBSERVATORY_PRESETS[0].longitude);
  const [elevation_m, setElevation] = useState<number>(SOLAR_OBSERVATORY_PRESETS[0].elevation_m);
  const [timezone, setTimezone] = useState<string>(SOLAR_OBSERVATORY_PRESETS[0].timezone);

  // Animation & simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(5); // days per second
  const [cameraResetTrigger, setCameraResetTrigger] = useState<number>(0);

  // Inspector & selection state
  const [selectedRashiIndex, setSelectedRashiIndex] = useState<number>(0);
  const [selectedFestival, setSelectedFestival] = useState<SolarFestivalItem | null>(null);
  const [activeInfoMetricKey, setActiveInfoMetricKey] = useState<string | null>(null);
  const [activeStationModal, setActiveStationModal] = useState<AstronomicalStationEvent | null>(
    null,
  );

  // Festival filters & search
  const [festivalSearchQuery, setFestivalSearchQuery] = useState<string>("");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<FestivalRegion | "All">("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<FestivalCategory | "All">(
    "All",
  );
  const [selectedTraditionFilter, setSelectedTraditionFilter] = useState<FestivalTradition | "All">(
    "All",
  );

  // Observatory preset selection
  const applyPreset = useCallback((presetId: string) => {
    setSelectedPresetId(presetId);
    const p = SOLAR_OBSERVATORY_PRESETS.find((preset) => preset.id === presetId);
    if (p) {
      setLatitude(p.latitude);
      setLongitude(p.longitude);
      setElevation(p.elevation_m);
      setTimezone(p.timezone);
    }
  }, []);

  // Step day by delta (+1, -1, +7, etc.)
  const stepDay = useCallback((delta: number) => {
    setSelectedDate((prevDate) => {
      const parts = prevDate.split("-").map(Number);
      const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
      d.setUTCDate(d.getUTCDate() + delta);
      return d.toISOString().split("T")[0];
    });
  }, []);

  // Step month by delta (+1, -1)
  const stepMonth = useCallback((delta: number) => {
    setSelectedDate((prevDate) => {
      const parts = prevDate.split("-").map(Number);
      const targetYear = parts[0];
      const targetMonth = parts[1] - 1 + delta;
      const targetDay = parts[2];
      const d = new Date(Date.UTC(targetYear, targetMonth, targetDay));
      return d.toISOString().split("T")[0];
    });
  }, []);

  // Set day of year (1..365/366)
  const setDayOfYear = useCallback((dayOfYear: number) => {
    setSelectedDate((prevDate) => {
      const year = parseInt(prevDate.split("-")[0], 10) || 2026;
      const total = getDaysInYear(year);
      const clamped = Math.max(1, Math.min(total, Math.round(dayOfYear)));
      const d = getDateFromDayOfYear(year, clamped);
      return d.toISOString().split("T")[0];
    });
  }, []);

  // Reset to today
  const resetToToday = useCallback(() => {
    const now = new Date();
    setSelectedDate(now.toISOString().split("T")[0]);
    setSelectedTime("12:00");
  }, []);

  // Jump to specific astronomical event (Equinox/Solstice)
  const jumpToStation = useCallback((station: AstronomicalStationEvent) => {
    setSelectedDate((prevDate) => {
      const year = parseInt(prevDate.split("-")[0], 10) || 2026;
      const monthStr = station.defaultDate.month.toString().padStart(2, "0");
      const dayStr = station.defaultDate.day.toString().padStart(2, "0");
      return `${year}-${monthStr}-${dayStr}`;
    });
    setActiveStationModal(station);
  }, []);

  // Jump to a specific solar festival date
  const jumpToFestival = useCallback((festival: SolarFestivalItem) => {
    setSelectedDate((prevDate) => {
      const year = parseInt(prevDate.split("-")[0], 10) || 2026;
      const monthStr = festival.defaultDate.month.toString().padStart(2, "0");
      const dayStr = festival.defaultDate.day.toString().padStart(2, "0");
      return `${year}-${monthStr}-${dayStr}`;
    });
    setSelectedFestival(festival);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const resetCamera = useCallback(() => {
    setCameraResetTrigger((prev) => prev + 1);
  }, []);

  // Playback timer loop: advances the date smoothly when playing
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
      return;
    }

    let accumulatedDays = 0;

    const loop = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const deltaTimeSec = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Advance by playbackSpeed days per second
      accumulatedDays += deltaTimeSec * playbackSpeed;

      if (accumulatedDays >= 1) {
        const fullDays = Math.floor(accumulatedDays);
        accumulatedDays -= fullDays;

        setSelectedDate((prev) => {
          const parts = prev.split("-").map(Number);
          const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
          d.setUTCDate(d.getUTCDate() + fullDays);
          return d.toISOString().split("T")[0];
        });
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedPresetId,
    applyPreset,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    elevation_m,
    setElevation,
    timezone,
    setTimezone,
    isPlaying,
    togglePlayback,
    playbackSpeed,
    setPlaybackSpeed,
    cameraResetTrigger,
    resetCamera,
    selectedRashiIndex,
    setSelectedRashiIndex,
    selectedFestival,
    setSelectedFestival,
    activeInfoMetricKey,
    setActiveInfoMetricKey,
    activeStationModal,
    setActiveStationModal,
    festivalSearchQuery,
    setFestivalSearchQuery,
    selectedRegionFilter,
    setSelectedRegionFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedTraditionFilter,
    setSelectedTraditionFilter,
    stepDay,
    stepMonth,
    setDayOfYear,
    resetToToday,
    jumpToStation,
    jumpToFestival,
    presets: SOLAR_OBSERVATORY_PRESETS,
    allRashis: SOLAR_RASHIS,
    allFestivals: SOLAR_FESTIVALS,
  };
}
