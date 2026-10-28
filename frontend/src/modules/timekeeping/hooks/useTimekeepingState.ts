/**
 * Hook for managing the complete Timekeeping Module user input and simulation state.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { TimekeepingViewMode, LocationPreset, EducationalHotspot } from "../types/timekeeping";

export const LOCATION_PRESETS: LocationPreset[] = [
  {
    id: "konark",
    name: "Konark Sun Temple",
    hindiName: "कोणार्क सूर्य मन्दिर",
    latitude: 19.8876,
    longitude: 86.0945,
    elevation_m: 5.0,
    timezone: "Asia/Kolkata",
    description: "13th-century Sun Temple in Odisha featuring 24 carved stone wheels.",
  },
  {
    id: "ujjain",
    name: "Ujjain (Vedh Shala)",
    hindiName: "उज्जैन वेधशाला",
    latitude: 23.1765,
    longitude: 75.7885,
    elevation_m: 491.0,
    timezone: "Asia/Kolkata",
    description: "The historic Prime Meridian of ancient Indian astronomy (Avanti).",
  },
  {
    id: "delhi",
    name: "New Delhi (Jantar Mantar)",
    hindiName: "नई दिल्ली (जंतर मंतर)",
    latitude: 28.6139,
    longitude: 77.209,
    elevation_m: 216.0,
    timezone: "Asia/Kolkata",
    description: "Historic masonry observatory constructed by Maharaja Sawai Jai Singh II.",
  },
  {
    id: "jaipur",
    name: "Jaipur (Jantar Mantar)",
    hindiName: "जयपुर (जंतर मंतर)",
    latitude: 26.9248,
    longitude: 75.8242,
    elevation_m: 431.0,
    timezone: "Asia/Kolkata",
    description: "UNESCO World Heritage site housing the world's largest stone sundial.",
  },
  {
    id: "greenwich",
    name: "Royal Observatory, Greenwich",
    hindiName: "ग्रीनविच वेधशाला",
    latitude: 51.4769,
    longitude: -0.0005,
    elevation_m: 46.0,
    timezone: "UTC",
    description: "Prime Meridian of modern international civil time (GMT / UTC 0°).",
  },
];

export function useTimekeepingState() {
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-27");
  const [minutesSinceMidnight, setMinutesSinceMidnight] = useState<number>(720); // 12:00 PM
  const [selectedPresetId, setSelectedPresetId] = useState<string>("konark");
  const [latitude, setLatitude] = useState<number>(19.8876);
  const [longitude, setLongitude] = useState<number>(86.0945);
  const [elevation_m, setElevation] = useState<number>(5.0);
  const [timezone, setTimezone] = useState<string>("Asia/Kolkata");

  const [viewMode, setViewMode] = useState<TimekeepingViewMode>("compare");
  const [synchronized, setSynchronized] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(15); // minutes per real second

  const [selectedHotspot, setSelectedHotspot] = useState<EducationalHotspot | null>(null);
  const [activeInfoMetricKey, setActiveInfoMetricKey] = useState<string | null>(null);

  // Playback timer loop
  const lastFrameTimeRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const applyPreset = useCallback((presetId: string) => {
    const preset = LOCATION_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      setLatitude(preset.latitude);
      setLongitude(preset.longitude);
      setElevation(preset.elevation_m);
      setTimezone(preset.timezone);
    }
  }, []);

  const setTimeMinutes = useCallback((mins: number) => {
    // Wrap within 0 to 1439.9
    const normalized = ((mins % 1440) + 1440) % 1440;
    setMinutesSinceMidnight(normalized);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const resetToSolarNoon = useCallback(
    (noonLocalTimeStr?: string | null) => {
      if (noonLocalTimeStr) {
        const parts = noonLocalTimeStr.split(":");
        if (parts.length >= 2) {
          const h = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10);
          setTimeMinutes(h * 60 + m);
          return;
        }
      }
      setTimeMinutes(720);
    },
    [setTimeMinutes],
  );

  useEffect(() => {
    if (!isPlaying) {
      lastFrameTimeRef.current = null;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      return;
    }

    const tick = (now: number) => {
      if (lastFrameTimeRef.current !== null) {
        const deltaSeconds = (now - lastFrameTimeRef.current) / 1000;
        // Advance time: deltaSeconds * playbackSpeed (in minutes)
        const advanceMinutes = deltaSeconds * playbackSpeed;
        setMinutesSinceMidnight((prev) => (prev + advanceMinutes) % 1440);
      }
      lastFrameTimeRef.current = now;
      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  return {
    selectedDate,
    setSelectedDate,
    minutesSinceMidnight,
    setMinutesSinceMidnight: setTimeMinutes,
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
    viewMode,
    setViewMode,
    synchronized,
    setSynchronized,
    isPlaying,
    setIsPlaying,
    togglePlayback,
    playbackSpeed,
    setPlaybackSpeed,
    resetToSolarNoon,
    selectedHotspot,
    setSelectedHotspot,
    activeInfoMetricKey,
    setActiveInfoMetricKey,
    presets: LOCATION_PRESETS,
  };
}
