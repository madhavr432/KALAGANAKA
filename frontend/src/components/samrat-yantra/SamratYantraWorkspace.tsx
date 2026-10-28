import React, { useState, useEffect, useCallback } from "react";
import {
  OBSERVATORY_PRESETS,
  type ObservatoryPreset,
  calculateSamratYantraShadow,
  formatTimezoneAwareInstant,
  validateDateRange,
  validateTimeString,
  validateCoordinates,
  type ShadowGeometry,
} from "@/services/samrat-yantra-math";
import {
  fetchSolarPosition,
  fetchSolarEvents,
  fetchTraditionalSolarPosition,
  fetchModernPlanets,
  comparePlanetaryPositions,
  checkBackendHealth,
  type SolarPositionResponse,
  type SolarEventsResponse,
  type TraditionalSolarResponse,
  type ComparisonResponse,
  AstronomyApiError,
} from "@/services/astronomy-api";
import { SamratYantraVisualizer } from "./SamratYantraVisualizer";
import { AstronomyInfoPanel } from "./AstronomyInfoPanel";
import { TraditionalModernComparison } from "./TraditionalModernComparison";
import { SamratYantraEducational } from "./SamratYantraEducational";
import {
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Play,
  RotateCcw,
  Sun,
  Sliders,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export function SamratYantraWorkspace() {
  // Current date defaults
  const today = new Date();
  const defaultDateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const defaultTimeStr = "12:00"; // Default to solar noon for initial visual impact

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTime, setSelectedTime] = useState<string>(defaultTimeStr);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("jaipur");
  const [latitude, setLatitude] = useState<number>(OBSERVATORY_PRESETS[0].latitude);
  const [longitude, setLongitude] = useState<number>(OBSERVATORY_PRESETS[0].longitude);
  const [elevation, setElevation] = useState<number>(OBSERVATORY_PRESETS[0].elevation_m);
  const [timezone, setTimezone] = useState<string>("Asia/Kolkata");

  // Backend Data State
  const [solarPosition, setSolarPosition] = useState<SolarPositionResponse | null>(null);
  const [solarEvents, setSolarEvents] = useState<SolarEventsResponse | null>(null);
  const [traditionalSolar, setTraditionalSolar] = useState<TraditionalSolarResponse | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResponse | null>(null);
  const [modernSolarLongitudeDeg, setModernSolarLongitudeDeg] = useState<number | null>(null);

  // Status & Validation State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);

  // Time scrubber / animation state
  const [timeSliderMinutes, setTimeSliderMinutes] = useState<number>(720); // 12:00 = 720 mins
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Handle Preset Change
  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === "custom") return;

    const preset = OBSERVATORY_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setLatitude(preset.latitude);
      setLongitude(preset.longitude);
      setElevation(preset.elevation_m);
      setTimezone(preset.timezone);
    }
  };

  // Convert Slider Minutes to HH:mm string
  const minutesToTimeString = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  // Time Slider Change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mins = Number(e.target.value);
    setTimeSliderMinutes(mins);
    setSelectedTime(minutesToTimeString(mins));
  };

  // Primary Data Loading Routine
  const runCalculation = useCallback(
    async (overrideTime?: string) => {
      const activeTime = overrideTime ?? selectedTime;
      setValidationError(null);
      setBackendError(null);

      // 1. Client-Side Validations
      const dateVal = validateDateRange(selectedDate);
      if (!dateVal.valid) {
        setValidationError(dateVal.error ?? "Invalid date");
        return;
      }

      const timeVal = validateTimeString(activeTime);
      if (!timeVal.valid) {
        setValidationError(timeVal.error ?? "Invalid time");
        return;
      }

      const coordVal = validateCoordinates(latitude, longitude, elevation);
      if (!coordVal.valid) {
        setValidationError(coordVal.error ?? "Invalid coordinates");
        return;
      }

      setIsLoading(true);

      const instantIso = formatTimezoneAwareInstant(selectedDate, activeTime, timezone);

      try {
        // Attempt backend health check
        const online = await checkBackendHealth();
        setIsBackendOnline(online);

        if (!online) {
          throw new AstronomyApiError(
            "Backend server is offline. Run 'python -m uvicorn app.main:app --port 8000' in backend/",
            0,
          );
        }

        // Parallel Fetch for Solar Position, Solar Events, and Traditional Position
        const [posRes, eventsRes, tradRes] = await Promise.all([
          fetchSolarPosition({
            instant: instantIso,
            latitude,
            longitude,
            elevation_m: elevation,
          }),
          fetchSolarEvents({
            date: selectedDate,
            latitude,
            longitude,
            elevation_m: elevation,
            timezone,
          }),
          fetchTraditionalSolarPosition(selectedDate).catch((e) => {
            console.warn("Traditional position fetch error:", e);
            return null;
          }),
        ]);

        setSolarPosition(posRes);
        setSolarEvents(eventsRes);
        setTraditionalSolar(tradRes);
        setIsOfflineFallback(false);

        // Fetch Modern Planetary Ephemeris for Comparison if traditional data is present
        if (tradRes) {
          try {
            const modernRes = await fetchModernPlanets(instantIso);
            const modernSunLong =
              modernRes.positions_tropical_deg?.Sun ??
              modernRes.positions_sidereal_deg?.Sun ??
              null;
            setModernSolarLongitudeDeg(modernSunLong);

            if (modernSunLong != null) {
              const compRes = await comparePlanetaryPositions({
                traditional_positions: { Sun: tradRes.longitude_deg },
                modern_positions: { Sun: modernSunLong },
                traditional_method: "Surya Siddhanta (Preliminary Mean Longitude)",
                modern_method: "JPL DE421 Apparent Ecliptic Longitude",
                coordinate_system: "Ecliptic coordinates of date",
                instant: instantIso,
              });
              setComparisonResult(compRes);
            }
          } catch (compErr) {
            console.warn("Comparison call non-fatal warning:", compErr);
          }
        }
      } catch (err) {
        console.warn("Calculation fallback triggered due to backend status:", err);
        const errMsg =
          err instanceof Error ? err.message : "Error connecting to calculation backend";
        setBackendError(errMsg);
        setIsBackendOnline(false);

        // Compute validated mathematical client-side solar coordinates as an offline preview
        // so the user can still experience the instrument's interactive geometry
        const approxHours =
          Number(activeTime.split(":")[0]) + Number(activeTime.split(":")[1]) / 60;
        const hourAngleDeg = (approxHours - 12) * 15;
        const latRad = (latitude * Math.PI) / 180;
        const haRad = (hourAngleDeg * Math.PI) / 180;

        // Approximate solar altitude
        const approxAltDeg = Math.max(
          -10,
          (Math.asin(
            Math.sin(latRad) * Math.sin(0.1) + Math.cos(latRad) * Math.cos(0.1) * Math.cos(haRad),
          ) *
            180) /
            Math.PI,
        );

        // Approximate azimuth (180° = South, 90° = East, 270° = West)
        const approxAzDeg = hourAngleDeg < 0 ? 180 + hourAngleDeg * 0.9 : 180 + hourAngleDeg * 0.9;

        setSolarPosition({
          instant: instantIso,
          observer: { latitude, longitude, elevation_m: elevation, timezone },
          altitude_deg: approxAltDeg,
          altitude_refracted_deg: approxAltDeg,
          azimuth_deg: (approxAzDeg + 360) % 360,
          distance_au: 0.993,
          distance_km: 148500000,
          is_sun_up: approxAltDeg > 0,
        });

        setSolarEvents({
          date: selectedDate,
          observer: { latitude, longitude, elevation_m: elevation, timezone },
          sunrise: {
            time_local: `${selectedDate}T06:28:00+05:30`,
            time_utc: `${selectedDate}T00:58:00Z`,
            available: true,
            reason: null,
          },
          sunset: {
            time_local: `${selectedDate}T17:42:00+05:30`,
            time_utc: `${selectedDate}T12:12:00Z`,
            available: true,
            reason: null,
          },
          solar_noon: {
            time_local: `${selectedDate}T12:05:00+05:30`,
            time_utc: `${selectedDate}T06:35:00Z`,
            available: true,
            reason: null,
          },
          day_length_hours: 11.23,
        });

        setIsOfflineFallback(true);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedDate, selectedTime, latitude, longitude, elevation, timezone],
  );

  // Initial Calculation on Mount
  useEffect(() => {
    runCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Time-lapse play animation effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeSliderMinutes((prev) => {
        const next = prev >= 1140 ? 360 : prev + 10; // Cycle 6:00 AM to 7:00 PM
        const timeStr = minutesToTimeString(next);
        setSelectedTime(timeStr);
        runCalculation(timeStr);
        return next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isPlaying, runCalculation]);

  // Derive Current Shadow Geometry
  const activeInstantLocal = formatTimezoneAwareInstant(selectedDate, selectedTime, timezone);
  const shadowGeometry: ShadowGeometry = calculateSamratYantraShadow({
    altitudeDeg: solarPosition?.altitude_deg ?? 45,
    azimuthDeg: solarPosition?.azimuth_deg ?? 180,
    latitudeDeg: latitude,
    isSunUp: solarPosition?.is_sun_up ?? true,
    currentInstantLocal: activeInstantLocal,
    solarNoonLocal: solarEvents?.solar_noon.time_local,
    sunriseLocal: solarEvents?.sunrise.time_local,
  });

  const selectedPresetObj = OBSERVATORY_PRESETS.find((p) => p.id === selectedPresetId);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Page Title & Intro */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 self-center sm:self-start rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-medium text-gold-soft">
          <Sun className="h-3.5 w-3.5 text-gold animate-spin-slow" />
          <span>Feature 1 • खगोलीय यन्त्र वेधशाला (Astronomical Observatory)</span>
        </div>
        <h1 className="font-deva text-4xl text-gold-gradient drop-shadow-gold sm:text-5xl lg:text-6xl">
          सम्राट यन्त्र अनुकारक
        </h1>
        <h2 className="font-serif text-xl text-gold-soft sm:text-2xl">
          Samrat Yantra Simulator — The Giant Equinoctial Sundial
        </h2>
        <p className="max-w-3xl font-sans text-sm text-muted-foreground leading-relaxed">
          Explore the monumental stone sundial designed by Maharaja Sawai Jai Singh II. Simulate the
          Sun&rsquo;s apparent celestial transit, observe the shadow cast across the equinoctial
          quadrants, and bridge traditional Indian timekeeping (Ghati, Pala, Ishtakala) with modern
          JPL DE421 ephemeris calculations.
        </p>
      </div>

      {/* Backend Status Alert / Diagnostic Notification */}
      {isBackendOnline === false && (
        <div className="flex flex-col gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <strong className="font-semibold text-amber-300">
                  Backend API Offline (स्थानीय बैकएंड सर्वर निष्क्रिय):
                </strong>{" "}
                {backendError}
                <p className="mt-1 text-muted-foreground">
                  The visualizer is currently demonstrating the mathematical shadow model in{" "}
                  <em>Offline Interactive Mode</em>. To connect live calculations via FastAPI:
                </p>
                <div className="mt-2 rounded bg-black/50 p-2 font-mono text-[11px] text-gold-light select-all">
                  python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
                </div>
              </div>
            </div>
            <button
              onClick={() => runCalculation()}
              className="flex shrink-0 items-center gap-1 rounded border border-amber-400/30 bg-amber-500/20 px-2.5 py-1 text-amber-200 hover:bg-amber-500/30"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {isBackendOnline === true && isOfflineFallback === false && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>Connected to KalaGanaka FastAPI Astronomical Engine (JPL DE421 Active)</span>
          </span>
          <span className="font-mono text-[11px] text-emerald-400">127.0.0.1:8000</span>
        </div>
      )}

      {/* Control Panel / Observatory Settings Card */}
      <section className="rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-gold" />
            <h3 className="font-deva text-lg font-semibold text-gold">
              वेधशाला एवं समय निर्धारक (Observatory & Temporal Controls)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
                setSelectedTime(nowTime);
                setTimeSliderMinutes(now.getHours() * 60 + now.getMinutes());
                runCalculation(nowTime);
              }}
              className="rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-gold-soft hover:bg-gold/15 hover:text-gold"
            >
              Set Current Time
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTime("12:00");
                setTimeSliderMinutes(720);
                runCalculation("12:00");
              }}
              className="rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-gold-soft hover:bg-gold/15 hover:text-gold"
            >
              Set Solar Noon
            </button>
          </div>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Observatory Preset Selector */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="preset-select"
              className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
            >
              <MapPin className="h-3.5 w-3.5 text-gold" />
              <span>वेधशाला (Historic Observatory)</span>
            </label>
            <select
              id="preset-select"
              value={selectedPresetId}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="rounded-lg border border-gold/30 bg-background/90 px-3 py-2 font-sans text-xs text-foreground focus:border-gold focus:outline-none"
            >
              {OBSERVATORY_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-background text-foreground">
                  {p.name} ({p.city})
                </option>
              ))}
              <option value="custom" className="bg-background text-foreground">
                Custom Coordinates (ऐच्छिक निर्देशांक)
              </option>
            </select>
          </div>

          {/* 2. Date Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="date-input"
              className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
            >
              <Calendar className="h-3.5 w-3.5 text-gold" />
              <span>दिनाङ्क (Observation Date)</span>
            </label>
            <input
              id="date-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-gold/30 bg-background/90 px-3 py-2 font-mono text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          {/* 3. Time Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="time-input"
              className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
            >
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span>स्थानीय समय (Local Time, 24h)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="time-input"
                type="time"
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  const [h, m] = e.target.value.split(":").map(Number);
                  if (!isNaN(h) && !isNaN(m)) setTimeSliderMinutes(h * 60 + m);
                }}
                className="w-full rounded-lg border border-gold/30 bg-background/90 px-3 py-2 font-mono text-xs text-foreground focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          {/* 4. Action Button */}
          <div className="flex flex-col justify-end gap-1.5">
            <button
              type="button"
              onClick={() => runCalculation()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-4 py-2.5 font-sans text-xs font-semibold text-background shadow transition-all hover:opacity-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "गणन जारी..." : "गणना करें (Calculate Position)"}</span>
            </button>
          </div>
        </div>

        {/* Custom Coordinates Inputs (Shown if custom or editable) */}
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gold/10 pt-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="lat-input" className="text-[11px] text-muted-foreground">
              Latitude $\phi$ (अक्षांश) [−90° to +90°]
            </label>
            <input
              id="lat-input"
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => {
                setSelectedPresetId("custom");
                setLatitude(parseFloat(e.target.value) || 0);
              }}
              className="rounded-md border border-gold/20 bg-background/60 px-2.5 py-1.5 font-mono text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="lon-input" className="text-[11px] text-muted-foreground">
              Longitude $\lambda$ (रेखांश) [−180° to +180°]
            </label>
            <input
              id="lon-input"
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => {
                setSelectedPresetId("custom");
                setLongitude(parseFloat(e.target.value) || 0);
              }}
              className="rounded-md border border-gold/20 bg-background/60 px-2.5 py-1.5 font-mono text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="elev-input" className="text-[11px] text-muted-foreground">
              Elevation (समुद्र तल से ऊँचाई, meters)
            </label>
            <input
              id="elev-input"
              type="number"
              step="1"
              value={elevation}
              onChange={(e) => {
                setSelectedPresetId("custom");
                setElevation(parseFloat(e.target.value) || 0);
              }}
              className="rounded-md border border-gold/20 bg-background/60 px-2.5 py-1.5 font-mono text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Validation Errors Notice */}
        {validationError && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Interactive Solar Transit Scrubber (Slider) */}
        <div className="mt-5 rounded-lg border border-gold/20 bg-gold/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-deva font-semibold text-gold">
              दिनकालीन सूर्य-गति चक्र (Daylight Solar Transit Time-Slider):
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-gold-light">{selectedTime}</span>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="flex items-center gap-1 rounded-md border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs text-gold hover:bg-gold/20"
                aria-label="Play/Pause daylight time lapse"
              >
                {isPlaying ? <RotateCcw className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                <span>{isPlaying ? "Pause" : "Play Transit"}</span>
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="font-mono text-[11px] text-muted-foreground">06:00 (Dawn)</span>
            <input
              type="range"
              min="360"
              max="1140"
              step="5"
              value={timeSliderMinutes}
              onChange={handleSliderChange}
              onMouseUp={() => runCalculation()}
              onTouchEnd={() => runCalculation()}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gold/20 accent-gold"
              aria-label="Solar transit time slider"
            />
            <span className="font-mono text-[11px] text-muted-foreground">19:00 (Dusk)</span>
          </div>
        </div>

        {/* Observatory Historical Note */}
        {selectedPresetObj?.historicalNote && (
          <p className="mt-3 text-xs text-muted-foreground italic">
            &ldquo;{selectedPresetObj.historicalNote}&rdquo;
          </p>
        )}
      </section>

      {/* Main Interactive Visualization */}
      <SamratYantraVisualizer
        shadowGeometry={shadowGeometry}
        latitude={latitude}
        altitudeDeg={solarPosition?.altitude_deg ?? 45}
        azimuthDeg={solarPosition?.azimuth_deg ?? 180}
        isSunUp={solarPosition?.is_sun_up ?? true}
        observatoryName={
          selectedPresetObj?.name ?? `Lat ${latitude.toFixed(2)}°, Lon ${longitude.toFixed(2)}°`
        }
      />

      {/* Astronomy Information Panel */}
      <AstronomyInfoPanel
        solarPosition={solarPosition}
        solarEvents={solarEvents}
        shadowGeometry={shadowGeometry}
        localTimeDisplay={`${selectedDate} ${selectedTime} (${timezone})`}
      />

      {/* Traditional vs Modern Comparison */}
      <TraditionalModernComparison
        traditionalSolar={traditionalSolar}
        comparisonResult={comparisonResult}
        modernSolarLongitudeDeg={modernSolarLongitudeDeg}
        isLoading={isLoading}
        error={
          backendError
            ? "Backend comparison service unavailable (Start backend to compare live)."
            : null
        }
      />

      {/* Educational Section */}
      <SamratYantraEducational />
    </div>
  );
}
