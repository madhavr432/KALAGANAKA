/**
 * hooks/useLunarCalendarState.ts
 * Manages reactive temporal, geographic, playback, and selection state for Module 3.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import {
  LUNAR_OBSERVATION_PRESETS,
  LUNAR_FESTIVALS,
  ALL_TITHIS,
  ALL_NAKSHATRAS,
} from "../constants/lunarConstants";
import type {
  LunarObservationPreset,
  LunarFestival,
  TithiDefinition,
  NakshatraDefinition,
} from "../types/lunarCalendar";

export function useLunarCalendarState() {
  const today = new Date();
  const defaultDateStr = today.toISOString().split("T")[0];
  const defaultTimeStr = "06:00"; // Traditional sunrise reference instant

  // Temporal & Geographic State
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTime, setSelectedTime] = useState<string>(defaultTimeStr);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("ujjain");

  const currentPreset =
    LUNAR_OBSERVATION_PRESETS.find((p) => p.id === selectedPresetId) ??
    LUNAR_OBSERVATION_PRESETS[0];

  const [latitude, setLatitude] = useState<number>(currentPreset.latitude);
  const [longitude, setLongitude] = useState<number>(currentPreset.longitude);
  const [elevation_m, setElevation_m] = useState<number>(currentPreset.elevation_m);
  const [timezone, setTimezone] = useState<string>(currentPreset.timezone);

  // Playback Simulation State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // days per second
  const [cameraResetTrigger, setCameraResetTrigger] = useState<number>(0);

  // Calendar System Mode (Amanta vs Purnimanta)
  const [monthViewMode, setMonthViewMode] = useState<"amanta" | "purnimanta">("amanta");

  // Exploratory Selection State
  const [selectedTithiIndex, setSelectedTithiIndex] = useState<number>(1);
  const [selectedNakshatraIndex, setSelectedNakshatraIndex] = useState<number>(1);
  const [selectedFestival, setSelectedFestival] = useState<LunarFestival | null>(null);
  const [activeInfoMetricKey, setActiveInfoMetricKey] = useState<string | null>(null);

  // Festival Filters & Search
  const [festivalSearchQuery, setFestivalSearchQuery] = useState<string>("");
  const [selectedFestivalMonthFilter, setSelectedFestivalMonthFilter] = useState<string>("all");
  const [selectedFestivalPakshaFilter, setSelectedFestivalPakshaFilter] = useState<string>("all");
  const [selectedFestivalTraditionFilter, setSelectedFestivalTraditionFilter] =
    useState<string>("all");

  // Handle Preset Selection
  const applyPreset = useCallback((presetId: string) => {
    const preset = LUNAR_OBSERVATION_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(preset.id);
    setLatitude(preset.latitude);
    setLongitude(preset.longitude);
    setElevation_m(preset.elevation_m);
    setTimezone(preset.timezone);
  }, []);

  // Step Date by Days
  const stepDay = useCallback((deltaDays: number) => {
    setSelectedDate((prev) => {
      const d = new Date(`${prev}T12:00:00Z`);
      d.setUTCDate(d.getUTCDate() + deltaDays);
      return d.toISOString().split("T")[0];
    });
  }, []);

  // Step Date by Months
  const stepMonth = useCallback((deltaMonths: number) => {
    setSelectedDate((prev) => {
      const d = new Date(`${prev}T12:00:00Z`);
      d.setUTCMonth(d.getUTCMonth() + deltaMonths);
      return d.toISOString().split("T")[0];
    });
  }, []);

  // Step Time by Hours
  const stepHours = useCallback((deltaHours: number) => {
    setSelectedTime((prev) => {
      const [h, m] = prev.split(":").map(Number);
      const newH = (h + deltaHours + 24) % 24;
      return `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    });
  }, []);

  // Reset to Current Today
  const resetToToday = useCallback(() => {
    const now = new Date();
    setSelectedDate(now.toISOString().split("T")[0]);
    setSelectedTime("06:00");
  }, []);

  // Reset 3D Camera
  const resetCamera = useCallback(() => {
    setCameraResetTrigger((c) => c + 1);
  }, []);

  // Jump Date directly
  const jumpToDate = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
  }, []);

  // Jump to specific festival
  const jumpToFestival = useCallback((festival: LunarFestival) => {
    setSelectedFestival(festival);
    if (festival.jumpDate) {
      setSelectedDate(festival.jumpDate);
    }
  }, []);

  // Jump to a specific principal lunar phase
  const jumpToPhase = useCallback((targetElongationDeg: number) => {
    // Estimate date difference needed based on current date's approximate elongation
    setSelectedDate((prev) => {
      const d = new Date(`${prev}T12:00:00Z`);
      // A full synodic month is ~29.53 days, ~12.19 degrees per day
      // We will step day by day (up to 30 days) to find closest matching elongation
      const target = ((targetElongationDeg % 360) + 360) % 360;
      let bestDate = prev;
      let minDiff = 999;

      for (let offset = -15; offset <= 15; offset++) {
        const testD = new Date(d);
        testD.setUTCDate(d.getUTCDate() + offset);
        const testDateStr = testD.toISOString().split("T")[0];
        // simple test diff
        const dayFraction = (testD.getTime() / 86400000) % 29.530588;
        const testElong = (dayFraction / 29.530588) * 360;
        let diff = Math.abs(testElong - target);
        if (diff > 180) diff = 360 - diff;
        if (diff < minDiff) {
          minDiff = diff;
          bestDate = testDateStr;
        }
      }
      return bestDate;
    });
  }, []);

  // Playback timer loop
  const animFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      const dtSeconds = (now - lastTickRef.current) / 1000;
      // playbackSpeed is days per second (e.g. 1 = 1 day every second)
      if (dtSeconds >= 0.1) {
        lastTickRef.current = now;
        const daysToAdvance = dtSeconds * playbackSpeed;
        stepDay(daysToAdvance >= 1 ? Math.round(daysToAdvance) : 1);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, stepDay]);

  const togglePlayback = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Filtered Festivals
  const filteredFestivals = LUNAR_FESTIVALS.filter((f) => {
    if (festivalSearchQuery) {
      const q = festivalSearchQuery.toLowerCase();
      const match =
        f.name.toLowerCase().includes(q) ||
        f.nameHindi.toLowerCase().includes(q) ||
        f.nameSanskrit.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.culturalSignificance.toLowerCase().includes(q) ||
        f.lunarMonth.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedFestivalMonthFilter !== "all" && f.lunarMonth !== selectedFestivalMonthFilter) {
      return false;
    }
    if (selectedFestivalPakshaFilter !== "all" && f.paksha !== selectedFestivalPakshaFilter) {
      return false;
    }
    if (
      selectedFestivalTraditionFilter !== "all" &&
      f.tradition !== selectedFestivalTraditionFilter
    ) {
      return false;
    }
    return true;
  });

  const selectedTithiDef: TithiDefinition =
    ALL_TITHIS.find((t) => t.index === selectedTithiIndex) ?? ALL_TITHIS[0];

  const selectedNakshatraDef: NakshatraDefinition =
    ALL_NAKSHATRAS.find((n) => n.index === selectedNakshatraIndex) ?? ALL_NAKSHATRAS[0];

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
    setElevation_m,
    timezone,
    setTimezone,
    isPlaying,
    togglePlayback,
    playbackSpeed,
    setPlaybackSpeed,
    cameraResetTrigger,
    resetCamera,
    monthViewMode,
    setMonthViewMode,
    selectedTithiIndex,
    setSelectedTithiIndex,
    selectedTithiDef,
    selectedNakshatraIndex,
    setSelectedNakshatraIndex,
    selectedNakshatraDef,
    selectedFestival,
    setSelectedFestival,
    activeInfoMetricKey,
    setActiveInfoMetricKey,
    festivalSearchQuery,
    setFestivalSearchQuery,
    selectedFestivalMonthFilter,
    setSelectedFestivalMonthFilter,
    selectedFestivalPakshaFilter,
    setSelectedFestivalPakshaFilter,
    selectedFestivalTraditionFilter,
    setSelectedFestivalTraditionFilter,
    filteredFestivals,
    stepDay,
    stepMonth,
    stepHours,
    resetToToday,
    jumpToDate,
    jumpToFestival,
    jumpToPhase,
    presets: LUNAR_OBSERVATION_PRESETS,
    allFestivals: LUNAR_FESTIVALS,
  };
}
