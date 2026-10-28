import React, { useState, useEffect, useCallback } from "react";
import {
  fetchPanchangInstant,
  fetchNextTransition,
  fetchTransitionsInterval,
  checkBackendHealth,
  type PanchangInstantResponse,
  type NextTransitionResponse,
  type TransitionsIntervalResponse,
  AstronomyApiError,
} from "@/services/astronomy-api";
import {
  validateDateRange,
  validateTimeString,
  formatTimezoneAwareInstant,
} from "@/services/samrat-yantra-math";
import { MoonPhaseVisualizer } from "./MoonPhaseVisualizer";
import { PanchangAngaCards } from "./PanchangAngaCards";
import { PanchangEducational } from "./PanchangEducational";
import {
  Calendar,
  Clock,
  Compass,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  ListFilter,
  ArrowRight,
} from "lucide-react";

const TIMEZONE_OPTIONS = [
  { label: "India Standard Time (+05:30) — Asia/Kolkata", value: "Asia/Kolkata" },
  { label: "Coordinated Universal Time (UTC) — UTC", value: "UTC" },
  { label: "US Eastern Time — America/New_York", value: "America/New_York" },
  { label: "UK Time — Europe/London", value: "Europe/London" },
  { label: "Japan Standard Time — Asia/Tokyo", value: "Asia/Tokyo" },
];

const WEEKDAY_NAMES_SANSKRIT = [
  "रविवार / भानुवासर (Ravivara)",
  "सोमवार / इन्दुवासर (Somavara)",
  "मङ्गलवार / भौमवासर (Mangalavara)",
  "बुधवार / सौम्यवासर (Budhavara)",
  "गुरुवार / बृहस्पतिवासर (Guruvara)",
  "शुक्रवार / भृगुवासर (Shukravara)",
  "शनिवार / मन्दवासर (Shanivara)",
];

const WEEKDAY_NAMES_ENGLISH = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function ChandraPanchangWorkspace() {
  const today = new Date();
  const defaultDateStr = today.toISOString().split("T")[0];
  const defaultTimeStr = "06:00"; // Morning sunrise instant is traditional Panchang reference

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTime, setSelectedTime] = useState<string>(defaultTimeStr);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("Asia/Kolkata");

  // Data State
  const [panchangInstant, setPanchangInstant] = useState<PanchangInstantResponse | null>(null);
  const [nextTithiTransition, setNextTithiTransition] = useState<NextTransitionResponse | null>(
    null,
  );
  const [nextNakshatraTransition, setNextNakshatraTransition] =
    useState<NextTransitionResponse | null>(null);
  const [nextYogaTransition, setNextYogaTransition] = useState<NextTransitionResponse | null>(null);
  const [nextKaranaTransition, setNextKaranaTransition] = useState<NextTransitionResponse | null>(
    null,
  );
  const [intervalTransitions, setIntervalTransitions] =
    useState<TransitionsIntervalResponse | null>(null);
  const [showIntervalTable, setShowIntervalTable] = useState<boolean>(false);

  // Status State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  // Derive Weekday from Selected Date
  const dateObj = new Date(`${selectedDate}T12:00:00Z`);
  const dayIndex = isNaN(dateObj.getTime()) ? 0 : dateObj.getUTCDay();
  const weekdayEnglish = WEEKDAY_NAMES_ENGLISH[dayIndex];
  const weekdaySanskrit = WEEKDAY_NAMES_SANSKRIT[dayIndex];

  // Primary Data Loading Routine
  const runPanchangCalculation = useCallback(async () => {
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
    const instantIso = formatTimezoneAwareInstant(selectedDate, selectedTime, selectedTimezone);

    try {
      const online = await checkBackendHealth();
      setIsBackendOnline(online);

      if (!online) {
        throw new AstronomyApiError(
          "Backend server is offline. Run 'python -m uvicorn app.main:app --port 8000' in backend/",
          0,
        );
      }

      // Fetch instantaneous Panchang
      const instantRes = await fetchPanchangInstant({
        instant: instantIso,
        timezone: selectedTimezone,
      });
      setPanchangInstant(instantRes);

      // Parallel fetch transitions for each Anga
      const [tithiTrans, nakTrans, yogaTrans, karanaTrans] = await Promise.all([
        fetchNextTransition({
          instant: instantIso,
          anga_type: "tithi",
          timezone: selectedTimezone,
        }).catch(() => null),
        fetchNextTransition({
          instant: instantIso,
          anga_type: "nakshatra",
          timezone: selectedTimezone,
        }).catch(() => null),
        fetchNextTransition({
          instant: instantIso,
          anga_type: "yoga",
          timezone: selectedTimezone,
        }).catch(() => null),
        fetchNextTransition({
          instant: instantIso,
          anga_type: "karana",
          timezone: selectedTimezone,
        }).catch(() => null),
      ]);

      setNextTithiTransition(tithiTrans);
      setNextNakshatraTransition(nakTrans);
      setNextYogaTransition(yogaTrans);
      setNextKaranaTransition(karanaTrans);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Error connecting to Panchang backend";
      setBackendError(errMsg);
      setIsBackendOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedTime, selectedTimezone]);

  // Fetch 7-day interval transitions
  const loadIntervalTransitions = async () => {
    try {
      const startIso = formatTimezoneAwareInstant(selectedDate, "00:00", selectedTimezone);
      const startDateObj = new Date(selectedDate);
      startDateObj.setDate(startDateObj.getDate() + 7);
      const endDateStr = startDateObj.toISOString().split("T")[0];
      const endIso = formatTimezoneAwareInstant(endDateStr, "00:00", selectedTimezone);

      const res = await fetchTransitionsInterval({
        start: startIso,
        end: endIso,
        timezone: selectedTimezone,
        limit: 40,
      });
      setIntervalTransitions(res);
      setShowIntervalTable(true);
    } catch (err) {
      console.warn("Could not load interval transitions:", err);
    }
  };

  useEffect(() => {
    runPanchangCalculation();
  }, [runPanchangCalculation]);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Title Header */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 self-center sm:self-start rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-medium text-gold-soft">
          <Moon className="h-3.5 w-3.5 text-gold" />
          <span>Feature 2 • पारम्परिक चन्द्र पञ्चाङ्ग (Lunar Panchang Engine)</span>
        </div>
        <h1 className="font-deva text-4xl text-gold-gradient drop-shadow-gold sm:text-5xl lg:text-6xl">
          चन्द्र पञ्चाङ्ग
        </h1>
        <h2 className="font-serif text-xl text-gold-soft sm:text-2xl">
          Chandra Panchang — The Five Limbs of Vedic Lunar Time
        </h2>
        <p className="max-w-3xl font-sans text-sm text-muted-foreground leading-relaxed">
          Calculate the true instantaneous <strong>Pancha-Angas</strong> (Tithi, Nakshatra, Yoga,
          Karana, and Vara) derived from apparent geocentric Sun and Moon positions using NASA/JPL
          DE421 ephemeris and the standard Lahiri (Chitrapaksha) Ayanamsha.
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
            <span>KalaGanaka Panchang Engine Online • JPL DE421 + Lahiri PAC Ayanamsha</span>
          </span>
          <span className="font-mono text-[11px] text-emerald-400">127.0.0.1:8000</span>
        </div>
      )}

      {/* Date, Time & Timezone Controls */}
      <section className="rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-gold" />
            <h3 className="font-deva text-lg font-semibold text-gold">
              काल एवं देश चयन (Temporal & Location Parameters)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
                setSelectedTime(nowTime);
                setSelectedDate(now.toISOString().split("T")[0]);
              }}
              className="rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-gold-soft hover:bg-gold/15 hover:text-gold"
            >
              Current Instant
            </button>
            <button
              type="button"
              onClick={() => setSelectedTime("06:00")}
              className="rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-gold-soft hover:bg-gold/15 hover:text-gold"
            >
              Sunrise (06:00)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Date Picker */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="date-input"
              className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
            >
              <Calendar className="h-3.5 w-3.5 text-gold" />
              <span>दिनाङ्क (Gregorian Date):</span>
            </label>
            <input
              id="date-input"
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
              htmlFor="time-input"
              className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
            >
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span>समय (Local Time, 24-hr):</span>
            </label>
            <input
              id="time-input"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="rounded-lg border border-gold/25 bg-background/70 px-3 py-2 font-mono text-sm text-gold-light focus:border-gold focus:outline-none"
            />
          </div>

          {/* Timezone Selector */}
          <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="tz-select"
              className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
            >
              <Compass className="h-3.5 w-3.5 text-gold" />
              <span>समय-मण्डल (Timezone):</span>
            </label>
            <select
              id="tz-select"
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="rounded-lg border border-gold/25 bg-background/70 px-3 py-2 text-xs text-gold-light focus:border-gold focus:outline-none"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value} className="bg-background text-foreground">
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
            {validationError}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => runPanchangCalculation()}
            className="flex items-center gap-2 rounded-lg bg-gold-gradient px-5 py-2 font-sans text-xs font-semibold text-background shadow-md hover:opacity-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>
              {isLoading ? "संगणना क्रियते (Calculating...)" : "पञ्चाङ्ग गणना (Compute Panchang)"}
            </span>
          </button>
        </div>
      </section>

      {/* Visualizer & Anga Cards */}
      {panchangInstant && (
        <>
          {/* Moon Phase & Elongation Visualizer */}
          <MoonPhaseVisualizer
            angularSeparationDeg={panchangInstant.tithi.angular_separation_deg}
            tithiName={panchangInstant.tithi.name}
            paksha={panchangInstant.tithi.paksha}
            tithiInPaksha={panchangInstant.tithi.tithi_in_paksha}
          />

          {/* The 5 Angas */}
          <PanchangAngaCards
            tithi={panchangInstant.tithi}
            nakshatra={panchangInstant.nakshatra}
            yoga={panchangInstant.yoga}
            karana={panchangInstant.karana}
            weekdayName={weekdayEnglish}
            weekdaySanskrit={weekdaySanskrit}
            nextTithiTransition={nextTithiTransition}
            nextNakshatraTransition={nextNakshatraTransition}
            nextYogaTransition={nextYogaTransition}
            nextKaranaTransition={nextKaranaTransition}
          />

          {/* Ephemeris Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gold/20 bg-gold/5 p-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-gold">
              <Sun className="h-4 w-4" />
              <span>
                Sun Sidereal:{" "}
                <strong className="text-gold-light">
                  {panchangInstant.sun_sidereal_longitude_deg.toFixed(2)}°
                </strong>{" "}
                (Sayana: {panchangInstant.sun_tropical_longitude_deg.toFixed(2)}°)
              </span>
            </div>
            <div className="flex items-center gap-2 text-gold">
              <Moon className="h-4 w-4" />
              <span>
                Moon Sidereal:{" "}
                <strong className="text-gold-light">
                  {panchangInstant.moon_sidereal_longitude_deg.toFixed(2)}°
                </strong>{" "}
                (Sayana: {panchangInstant.moon_tropical_longitude_deg.toFixed(2)}°)
              </span>
            </div>
            <div className="text-gold-soft">
              Lahiri Ayanamsha:{" "}
              <strong className="text-gold-light">
                {panchangInstant.ayanamsha_deg.toFixed(4)}°
              </strong>
            </div>
          </div>

          {/* Multi-day Interval Transitions Accordion / Toggle */}
          <div className="rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListFilter className="h-4 w-4 text-gold" />
                <h4 className="font-deva text-base font-semibold text-gold">
                  आगामी ७ दिनेषु पञ्चाङ्ग सङ्क्रमणाणि (Upcoming 7-Day Transitions)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!showIntervalTable) loadIntervalTransitions();
                  else setShowIntervalTable(false);
                }}
                className="flex items-center gap-1.5 rounded-md border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs text-gold-light hover:bg-gold/20"
              >
                <span>
                  {showIntervalTable ? "Hide Transitions" : "View 7-Day Boundary Crossings"}
                </span>
                <ArrowRight
                  className={`h-3 w-3 transition-transform ${showIntervalTable ? "rotate-90" : ""}`}
                />
              </button>
            </div>

            {showIntervalTable && intervalTransitions && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-gold/20 text-gold-soft">
                      <th className="py-2 pr-3">Anga Type</th>
                      <th className="py-2 px-3">From</th>
                      <th className="py-2 px-3">To (Subsequent)</th>
                      <th className="py-2 px-3">Local Transition Time</th>
                      <th className="py-2 pl-3">Degrees Boundary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {intervalTransitions.transitions.map((trans, idx) => (
                      <tr key={idx} className="hover:bg-gold/5 font-mono">
                        <td className="py-2.5 pr-3 capitalize font-sans text-gold">
                          {trans.anga_type}
                        </td>
                        <td className="py-2.5 px-3 text-gold-soft">
                          {trans.from_name} (#{trans.from_index})
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-gold-light">
                          {trans.to_name} (#{trans.to_index})
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {trans.transition_time_local.replace("T", " ")}
                        </td>
                        <td className="py-2.5 pl-3 text-muted-foreground">
                          {trans.boundary_deg.toFixed(1)}°
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Educational Principles */}
          <PanchangEducational />
        </>
      )}
    </div>
  );
}
