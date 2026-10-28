import React, { useState, useEffect, useCallback } from "react";
import {
  fetchModernPlanets,
  fetchSolarEvents,
  checkBackendHealth,
  type ModernPlanetsResponse,
  type SolarEventsResponse,
  AstronomyApiError,
} from "@/services/astronomy-api";
import {
  OBSERVATORY_PRESETS,
  validateDateRange,
  validateTimeString,
  formatTimezoneAwareInstant,
} from "@/services/astronomy-math";
import { RashiSolarWheel, RASHIS } from "./RashiSolarWheel";
import { SaurPanchangEducational } from "./SaurPanchangEducational";
import {
  Sun,
  Calendar,
  Compass,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Flame,
  ArrowRight,
} from "lucide-react";

export function SaurPanchangWorkspace() {
  const today = new Date();
  const defaultDateStr = today.toISOString().split("T")[0];
  const defaultTimeStr = "12:00"; // Solar noon default

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTime, setSelectedTime] = useState<string>(defaultTimeStr);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("jaipur");
  const [latitude, setLatitude] = useState<number>(OBSERVATORY_PRESETS[0].latitude);
  const [longitude, setLongitude] = useState<number>(OBSERVATORY_PRESETS[0].longitude);
  const [timezone, setTimezone] = useState<string>("Asia/Kolkata");

  // Data State
  const [planetsData, setPlanetsData] = useState<ModernPlanetsResponse | null>(null);
  const [solarEvents, setSolarEvents] = useState<SolarEventsResponse | null>(null);

  // Status State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = OBSERVATORY_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setLatitude(preset.latitude);
      setLongitude(preset.longitude);
      setTimezone(preset.timezone);
    }
  };

  const runSaurCalculation = useCallback(async () => {
    setValidationError(null);
    setBackendError(null);

    const dateVal = validateDateRange(selectedDate);
    if (!dateVal.valid) {
      setValidationError(dateVal.error ?? "Invalid date");
      return;
    }

    const timeVal = validateTimeString(selectedTime);
    if (!timeVal.valid) {
      setValidationError(timeVal.error ?? "Invalid time");
      return;
    }

    setIsLoading(true);
    const instantIso = formatTimezoneAwareInstant(selectedDate, selectedTime, timezone);

    try {
      const online = await checkBackendHealth();
      setIsBackendOnline(online);

      if (!online) {
        throw new AstronomyApiError(
          "Backend server is offline. Run 'python -m uvicorn app.main:app --port 8000' in backend/",
          0,
        );
      }

      const [pRes, eRes] = await Promise.all([
        fetchModernPlanets(instantIso),
        fetchSolarEvents({
          date: selectedDate,
          latitude,
          longitude,
          timezone,
        }),
      ]);

      setPlanetsData(pRes);
      setSolarEvents(eRes);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Error connecting to Solar backend";
      setBackendError(errMsg);
      setIsBackendOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedTime, timezone, latitude, longitude]);

  useEffect(() => {
    runSaurCalculation();
  }, [runSaurCalculation]);

  // Derived Solar Calculations
  const sunSidereal = planetsData?.positions_sidereal_deg?.Sun ?? 0;
  const sunTropical = planetsData?.positions_tropical_deg?.Sun ?? 0;
  const rashiIdx = Math.floor(sunSidereal / 30);
  const currentRashi = RASHIS[rashiIdx] || RASHIS[0];
  const nextRashi = RASHIS[(rashiIdx + 1) % 12];
  const degInRashi = sunSidereal % 30;
  const solarMonthDay = Math.floor(degInRashi) + 1;

  // Approximate days to next Sankranti: remaining degrees / mean solar motion (~0.9856 deg/day)
  const remainingDegToSankranti = 30 - degInRashi;
  const approxDaysToSankranti = (remainingDegToSankranti / 0.9856).toFixed(1);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Title Header */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 self-center sm:self-start rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-medium text-gold-soft">
          <Sun className="h-3.5 w-3.5 text-gold" />
          <span>Feature 3 • पारम्परिक सौर पञ्चाङ्ग (Solar Calendar & Sankranti)</span>
        </div>
        <h1 className="font-deva text-4xl text-gold-gradient drop-shadow-gold sm:text-5xl lg:text-6xl">
          सौर पञ्चाङ्ग
        </h1>
        <h2 className="font-serif text-xl text-gold-soft sm:text-2xl">
          Saur Panchang — Solar Months, Rashis & Sankranti Ingress
        </h2>
        <p className="max-w-3xl font-sans text-sm text-muted-foreground leading-relaxed">
          Explore the traditional Indian <strong>Saur Mana</strong> (Solar Calendar) based on the
          Sun&rsquo;s apparent transit through the 12 Nirayana Rashis. Track the precise solar
          month, elapsed solar days, and exact Sankranti ingress with transparent documentation of
          regional calendar conventions.
        </p>
      </div>

      {/* Backend Status Alert */}
      {isBackendOnline === false && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <strong className="font-semibold text-amber-300">Backend API Offline:</strong>{" "}
            {backendError}
            <p className="mt-1 text-muted-foreground">
              Please ensure the FastAPI backend is running on port 8000.
            </p>
          </div>
        </div>
      )}

      {isBackendOnline === true && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>KalaGanaka Solar Astronomy Engine Online • JPL DE421 Apparent Coordinates</span>
          </span>
          <span className="font-mono text-[11px] text-emerald-400">127.0.0.1:8000</span>
        </div>
      )}

      {/* Temporal & Location Parameters Card */}
      <section className="rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-gold" />
            <h3 className="font-deva text-lg font-semibold text-gold">
              काल एवं स्थान चयन (Date & Location Parameters)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setSelectedDate(now.toISOString().split("T")[0]);
                setSelectedTime("12:00");
              }}
              className="rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-gold-soft hover:bg-gold/15 hover:text-gold"
            >
              Today at Solar Noon
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Date Picker */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="saur-date"
              className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
            >
              <Calendar className="h-3.5 w-3.5 text-gold" />
              <span>दिनाङ्क (Gregorian Date):</span>
            </label>
            <input
              id="saur-date"
              type="date"
              value={selectedDate}
              min="1899-07-29"
              max="2053-10-08"
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-gold/25 bg-background/70 px-3 py-2 font-mono text-sm text-gold-light focus:border-gold focus:outline-none"
            />
          </div>

          {/* Time Picker */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="saur-time"
              className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
            >
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span>समय (Local Time):</span>
            </label>
            <input
              id="saur-time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="rounded-lg border border-gold/25 bg-background/70 px-3 py-2 font-mono text-sm text-gold-light focus:border-gold focus:outline-none"
            />
          </div>

          {/* Observatory Preset */}
          <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="preset-select"
              className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
            >
              <MapPin className="h-3.5 w-3.5 text-gold" />
              <span>स्थान (Observer Location):</span>
            </label>
            <select
              id="preset-select"
              value={selectedPresetId}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="rounded-lg border border-gold/25 bg-background/70 px-3 py-2 text-xs text-gold-light focus:border-gold focus:outline-none"
            >
              {OBSERVATORY_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-background text-foreground">
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {validationError && (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
            {validationError}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => runSaurCalculation()}
            className="flex items-center gap-2 rounded-lg bg-gold-gradient px-5 py-2 font-sans text-xs font-bold text-slate-950 shadow-md hover:opacity-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>
              {isLoading
                ? "गणना क्रियते (Calculating...)"
                : "सौर पञ्चाङ्ग गणना (Compute Solar Calendar)"}
            </span>
          </button>
        </div>
      </section>

      {/* Main Solar Details */}
      {planetsData && (
        <>
          {/* Visual Zodiac Rashi Wheel */}
          <RashiSolarWheel
            sunSiderealLongitudeDeg={sunSidereal}
            sunTropicalLongitudeDeg={sunTropical}
          />

          {/* Solar Calendar Parameter Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Solar Month & Date */}
            <div className="rounded-xl border border-gold/25 bg-background/80 p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-gold/15 pb-2">
                <span className="flex items-center gap-1.5 font-deva text-gold">
                  <Sun className="h-4 w-4 text-gold" />
                  सौर मास एवं प्रविष्टे (Solar Date)
                </span>
              </div>
              <div className="mt-3">
                <span className="font-deva text-2xl font-bold text-gold-light">
                  {currentRashi.sanskritName.split(" ")[0]} {solarMonthDay}
                </span>
                <p className="text-xs text-gold-soft mt-1">
                  Day {solarMonthDay} of {currentRashi.solarMonthName.split(" / ")[0]}
                </p>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Sun is {degInRashi.toFixed(2)}° through {currentRashi.englishName}
              </p>
            </div>

            {/* 2. Next Sankranti Ingress */}
            <div className="rounded-xl border border-gold/25 bg-background/80 p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-gold/15 pb-2">
                <span className="flex items-center gap-1.5 font-deva text-gold">
                  <Flame className="h-4 w-4 text-amber-400" />
                  आगामी सङ्क्रान्ति (Next Sankranti)
                </span>
              </div>
              <div className="mt-3">
                <span className="font-deva text-xl font-bold text-gold-light">
                  {nextRashi.sanskritName.split(" ")[0]} सङ्क्रान्ति
                </span>
                <p className="text-xs text-gold-soft mt-1">
                  Into {nextRashi.englishName} (at {(rashiIdx + 1) * 30}°)
                </p>
              </div>
              <p className="mt-3 text-[11px] text-gold-soft">
                ~{remainingDegToSankranti.toFixed(2)}° remaining (approx. {approxDaysToSankranti}{" "}
                days)
              </p>
            </div>

            {/* 3. Horizon Events (Sunrise / Sunset) */}
            <div className="rounded-xl border border-gold/25 bg-background/80 p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-gold/15 pb-2">
                <span className="flex items-center gap-1.5 font-deva text-gold">
                  <Clock className="h-4 w-4 text-gold" />
                  दैनिक सूर्योदय (Solar Day Limits)
                </span>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">सूर्योदय (Sunrise):</span>
                  <span className="font-mono font-semibold text-gold-light">
                    {solarEvents?.sunrise.available
                      ? solarEvents.sunrise.time_local?.match(/T(\d{2}:\d{2})/)?.[1]
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">सूर्यास्त (Sunset):</span>
                  <span className="font-mono font-semibold text-gold-light">
                    {solarEvents?.sunset.available
                      ? solarEvents.sunset.time_local?.match(/T(\d{2}:\d{2})/)?.[1]
                      : "—"}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Day length: {solarEvents?.day_length_hours?.toFixed(2)} hrs
              </p>
            </div>

            {/* 4. Ayanamsha & Coordinate Offset */}
            <div className="rounded-xl border border-gold/25 bg-background/80 p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-gold/15 pb-2">
                <span className="flex items-center gap-1.5 font-deva text-gold">
                  <Compass className="h-4 w-4 text-gold" />
                  अयनांश (Precession Offset)
                </span>
              </div>
              <div className="mt-3">
                <span className="font-mono text-2xl font-bold text-gold-light">
                  {planetsData.ayanamsha_deg.toFixed(4)}°
                </span>
                <p className="text-xs text-gold-soft mt-1">{planetsData.ayanamsha_name}</p>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Tropical − Sidereal = {(sunTropical - sunSidereal).toFixed(3)}°
              </p>
            </div>
          </div>

          {/* Regional Solar Calendar Variations Table */}
          <div className="rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
            <h4 className="font-deva text-base font-semibold text-gold border-b border-gold/15 pb-2">
              क्षेत्रीय सौर मास नाम एवं पञ्चाङ्ग विधान (Regional Solar Month Names & Conventions)
            </h4>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-gold/20 text-gold-soft">
                    <th className="py-2 pr-3">Rashi / Ingress</th>
                    <th className="py-2 px-3">Sanskrit / North</th>
                    <th className="py-2 px-3">Tamil (सौर)</th>
                    <th className="py-2 px-3">Bengali (सौर)</th>
                    <th className="py-2 px-3">Malayalam (Kollam)</th>
                    <th className="py-2 pl-3">Day 1 Transition Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  <tr className="hover:bg-gold/5">
                    <td className="py-2.5 pr-3 font-semibold text-gold">
                      Active: {currentRashi.sanskritName.split(" ")[0]} ({currentRashi.englishName})
                    </td>
                    <td className="py-2.5 px-3 text-gold-light">
                      {currentRashi.solarMonthName.split(" / ")[0]}
                    </td>
                    <td className="py-2.5 px-3 text-gold-soft">
                      {currentRashi.solarMonthName.split(" / ")[1] || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-gold-soft">
                      {currentRashi.solarMonthName.split(" / ")[2] || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {currentRashi.englishName} Month
                    </td>
                    <td className="py-2.5 pl-3 text-muted-foreground">
                      If Sankranti before sunset, day 1 = today; else tomorrow
                    </td>
                  </tr>
                  <tr className="hover:bg-gold/5">
                    <td className="py-2.5 pr-3 font-semibold text-gold">
                      Next: {nextRashi.sanskritName.split(" ")[0]} ({nextRashi.englishName})
                    </td>
                    <td className="py-2.5 px-3 text-gold-light">
                      {nextRashi.solarMonthName.split(" / ")[0]}
                    </td>
                    <td className="py-2.5 px-3 text-gold-soft">
                      {nextRashi.solarMonthName.split(" / ")[1] || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-gold-soft">
                      {nextRashi.solarMonthName.split(" / ")[2] || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {nextRashi.englishName} Month
                    </td>
                    <td className="py-2.5 pl-3 text-muted-foreground">
                      Kollam Era uses Madhyanha (noon) rule
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground italic">
              Notice: KalaGanaka maintains scientific and historical transparency by clearly noting
              that regional solar calendars (Tamil, Malayalam, Bengali, Odia) employ distinct civil
              day boundary conventions.
            </p>
          </div>

          {/* Educational Content */}
          <SaurPanchangEducational />
        </>
      )}
    </div>
  );
}
