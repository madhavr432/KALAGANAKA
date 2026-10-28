import React, { useState, useEffect, useCallback } from "react";
import {
  fetchModernPlanets,
  fetchTraditionalSolarPosition,
  comparePlanetaryPositions,
  checkBackendHealth,
  type ModernPlanetsResponse,
  type TraditionalSolarResponse,
  type ComparisonResponse,
  AstronomyApiError,
} from "@/services/astronomy-api";
import {
  validateDateRange,
  validateTimeString,
  formatTimezoneAwareInstant,
} from "@/services/samrat-yantra-math";
import { CelestialZodiacSkyMap, type PlanetVisualItem } from "./CelestialZodiacSkyMap";
import { PlanetaryComparisonPanel } from "./PlanetaryComparisonPanel";
import { RASHIS } from "../saur-panchang/RashiSolarWheel";
import {
  Globe2,
  Calendar,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FastForward,
  Rewind,
  Sparkles,
} from "lucide-react";

const PLANET_CONFIG: Record<string, { sanskritName: string; symbol: string; color: string }> = {
  Sun: { sanskritName: "सूर्य (Surya)", symbol: "☉", color: "#f59e0b" },
  Moon: { sanskritName: "चन्द्र (Chandra)", symbol: "☽", color: "#e2e8f0" },
  Mars: { sanskritName: "मङ्गल (Mangala)", symbol: "♂", color: "#ef4444" },
  Mercury: { sanskritName: "बुध (Budha)", symbol: "☿", color: "#10b981" },
  Jupiter: { sanskritName: "गुरु (Guru / Brihaspati)", symbol: "♃", color: "#eab308" },
  Venus: { sanskritName: "शुक्र (Shukra)", symbol: "♀", color: "#ec4899" },
  Saturn: { sanskritName: "शनि (Shani)", symbol: "♄", color: "#8b5cf6" },
};

export function PlanetaryExplorerWorkspace() {
  const today = new Date();
  const defaultDateStr = today.toISOString().split("T")[0];
  const defaultTimeStr = "12:00";

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTime, setSelectedTime] = useState<string>(defaultTimeStr);
  const [timezone] = useState<string>("Asia/Kolkata");

  // Selection
  const [selectedPlanetName, setSelectedPlanetName] = useState<string>("Sun");

  // Data State
  const [planetsData, setPlanetsData] = useState<ModernPlanetsResponse | null>(null);
  const [traditionalSolar, setTraditionalSolar] = useState<TraditionalSolarResponse | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResponse | null>(null);

  // Status State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  // Time Travel Stepper
  const stepTime = (daysDelta: number) => {
    try {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + daysDelta);
      const newDateStr = d.toISOString().split("T")[0];
      const val = validateDateRange(newDateStr);
      if (val.valid) {
        setSelectedDate(newDateStr);
      }
    } catch (e) {
      console.warn("Date stepping error:", e);
    }
  };

  // Primary Data Loading Routine
  const runPlanetaryCalculation = useCallback(async () => {
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

      const pRes = await fetchModernPlanets(instantIso);
      setPlanetsData(pRes);

      // Traditional Sun comparison
      try {
        const tradRes = await fetchTraditionalSolarPosition(selectedDate);
        setTraditionalSolar(tradRes);

        const modernSun = pRes.positions_tropical_deg?.Sun;
        if (modernSun != null && tradRes) {
          const compRes = await comparePlanetaryPositions({
            traditional_positions: { Sun: tradRes.longitude_deg },
            modern_positions: { Sun: modernSun },
            traditional_method: "Surya Siddhanta (Mean Motion)",
            modern_method: "JPL DE421 Apparent Ecliptic",
            modern_data_source: "provider",
            coordinate_system: "Ecliptic coordinates of date",
            instant: instantIso,
          });
          setComparisonResult(compRes);
        }
      } catch (tradErr) {
        console.warn("Traditional solar fetch non-fatal notice:", tradErr);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Error connecting to Astronomy backend";
      setBackendError(errMsg);
      setIsBackendOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedTime, timezone]);

  useEffect(() => {
    runPlanetaryCalculation();
  }, [runPlanetaryCalculation]);

  // Transform planetsData into PlanetVisualItem array
  const visualPlanets: PlanetVisualItem[] = React.useMemo(() => {
    if (!planetsData) return [];

    const defaultNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

    return defaultNames.map((name) => {
      const config = PLANET_CONFIG[name] || {
        sanskritName: name,
        symbol: "★",
        color: "#ffffff",
      };

      const detailed = planetsData.planets?.find(
        (p) => p.name.toLowerCase() === name.toLowerCase(),
      );

      const sidereal =
        detailed?.sidereal_longitude_deg ?? planetsData.positions_sidereal_deg?.[name] ?? 0;

      const tropical =
        detailed?.tropical_longitude_deg ?? planetsData.positions_tropical_deg?.[name] ?? 0;

      const lat = detailed?.latitude_deg ?? 0;
      const au = detailed?.distance_au ?? (name === "Sun" ? 1.0 : name === "Moon" ? 0.0026 : 1.5);
      const km = detailed?.distance_km ?? au * 149597870.7;

      return {
        name,
        sanskritName: config.sanskritName,
        symbol: config.symbol,
        color: config.color,
        siderealLongitudeDeg: sidereal,
        tropicalLongitudeDeg: tropical,
        latitudeDeg: lat,
        distanceAu: au,
        distanceKm: km,
      };
    });
  }, [planetsData]);

  const activePlanet = visualPlanets.find((p) => p.name === selectedPlanetName) || visualPlanets[0];

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Title Header */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 self-center sm:self-start rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-medium text-gold-soft">
          <Globe2 className="h-3.5 w-3.5 text-gold" />
          <span>Feature 4 • ग्रह मण्डल एवं काल-यात्रा वेधशाला (Planetary Explorer)</span>
        </div>
        <h1 className="font-deva text-4xl text-gold-gradient drop-shadow-gold sm:text-5xl lg:text-6xl">
          ग्रह मण्डल वेधशाला
        </h1>
        <h2 className="font-serif text-xl text-gold-soft sm:text-2xl">
          Planetary Explorer & Time Travel Observatory
        </h2>
        <p className="max-w-3xl font-sans text-sm text-muted-foreground leading-relaxed">
          Explore geocentric positions of the <strong>7 classical Grahas</strong> (Sun, Moon, Mars,
          Mercury, Jupiter, Venus, Saturn) across time using NASA/JPL DE421 ephemeris and compare
          with traditional Surya Siddhanta calculations.
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
            <span>
              KalaGanaka Ephemeris Engine Online • JPL DE421 7-Body Geocentric Coordinates
            </span>
          </span>
          <span className="font-mono text-[11px] text-emerald-400">127.0.0.1:8000</span>
        </div>
      )}

      {/* Time Travel Stepper & Temporal Navigation Controls */}
      <section className="rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" />
            <h3 className="font-deva text-lg font-semibold text-gold">
              काल-यात्रा नियन्त्रक (Time Travel Controls)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setSelectedDate(now.toISOString().split("T")[0]);
              setSelectedTime("12:00");
            }}
            className="rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs text-gold-soft hover:bg-gold/15 hover:text-gold"
          >
            Reset to Today
          </button>
        </div>

        {/* Stepper Buttons Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
          <button
            type="button"
            onClick={() => stepTime(-365)}
            className="flex items-center gap-1 rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs text-gold-soft hover:bg-gold/15"
            title="Step 1 Year Backward"
          >
            <Rewind className="h-3 w-3" /> −1 Year
          </button>
          <button
            type="button"
            onClick={() => stepTime(-30)}
            className="flex items-center gap-1 rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs text-gold-soft hover:bg-gold/15"
            title="Step 30 Days Backward"
          >
            <ChevronLeft className="h-3 w-3" /> −1 Month
          </button>
          <button
            type="button"
            onClick={() => stepTime(-7)}
            className="flex items-center gap-1 rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs text-gold-soft hover:bg-gold/15"
            title="Step 7 Days Backward"
          >
            <ChevronLeft className="h-3 w-3" /> −1 Week
          </button>
          <button
            type="button"
            onClick={() => stepTime(-1)}
            className="flex items-center gap-1 rounded-md border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold hover:bg-gold/20"
            title="Step 1 Day Backward"
          >
            <ChevronLeft className="h-3 w-3" /> −1 Day
          </button>

          <span className="px-2 font-mono text-xs text-gold-light font-bold">
            {selectedDate} {selectedTime}
          </span>

          <button
            type="button"
            onClick={() => stepTime(1)}
            className="flex items-center gap-1 rounded-md border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold hover:bg-gold/20"
            title="Step 1 Day Forward"
          >
            +1 Day <ChevronRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => stepTime(7)}
            className="flex items-center gap-1 rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs text-gold-soft hover:bg-gold/15"
            title="Step 7 Days Forward"
          >
            +1 Week <ChevronRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => stepTime(30)}
            className="flex items-center gap-1 rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs text-gold-soft hover:bg-gold/15"
            title="Step 30 Days Forward"
          >
            +1 Month <ChevronRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => stepTime(365)}
            className="flex items-center gap-1 rounded-md border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs text-gold-soft hover:bg-gold/15"
            title="Step 1 Year Forward"
          >
            +1 Year <FastForward className="h-3 w-3" />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-gold/10">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="explorer-date"
              className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
            >
              <Calendar className="h-3.5 w-3.5 text-gold" />
              <span>Target Date (1899 to 2053):</span>
            </label>
            <input
              id="explorer-date"
              type="date"
              value={selectedDate}
              min="1899-07-29"
              max="2053-10-08"
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-gold/25 bg-background/70 px-3 py-2 font-mono text-sm text-gold-light focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="explorer-time"
              className="flex items-center gap-1.5 text-xs font-medium text-gold-soft"
            >
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span>Target Time (UTC offset {timezone}):</span>
            </label>
            <input
              id="explorer-time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="rounded-lg border border-gold/25 bg-background/70 px-3 py-2 font-mono text-sm text-gold-light focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {validationError && (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
            {validationError}
          </div>
        )}
      </section>

      {/* Main Content Layout: Sky Map & Comparison Panel */}
      {planetsData && visualPlanets.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Sky Map */}
            <CelestialZodiacSkyMap
              planets={visualPlanets}
              selectedPlanetName={selectedPlanetName}
              onSelectPlanet={setSelectedPlanetName}
            />

            {/* Selected Planet Details & Comparison */}
            {activePlanet && (
              <PlanetaryComparisonPanel
                planet={activePlanet}
                traditionalSolar={traditionalSolar}
                comparisonResult={comparisonResult}
              />
            )}
          </div>

          {/* Full 7 Grahas Ephemeris Table */}
          <div className="rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-gold" />
                <h4 className="font-deva text-base font-semibold text-gold">
                  सप्त ग्रह स्थिति सारणी (Seven Classical Grahas Ephemeris)
                </h4>
              </div>
              <span className="font-mono text-xs text-gold-soft">
                Lahiri Ayanamsha: {planetsData.ayanamsha_deg.toFixed(4)}°
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-gold/20 text-gold-soft">
                    <th className="py-2.5 pr-3">Graha (Planet)</th>
                    <th className="py-2.5 px-3">Sidereal Longitude</th>
                    <th className="py-2.5 px-3">Tropical Longitude</th>
                    <th className="py-2.5 px-3">Ecliptic Latitude</th>
                    <th className="py-2.5 px-3">Distance (AU)</th>
                    <th className="py-2.5 px-3">Distance (km)</th>
                    <th className="py-2.5 pl-3">Active Rashi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10 font-mono">
                  {visualPlanets.map((planet) => {
                    const isSelected = planet.name === selectedPlanetName;
                    const rashiIndex = Math.floor(planet.siderealLongitudeDeg / 30);
                    const rashi = RASHIS[rashiIndex] || RASHIS[0];

                    return (
                      <tr
                        key={planet.name}
                        onClick={() => setSelectedPlanetName(planet.name)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-gold/15 font-semibold" : "hover:bg-gold/5"
                        }`}
                      >
                        <td className="py-2.5 pr-3 font-sans text-gold flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: planet.color }}
                          />
                          <span>{planet.sanskritName}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ({planet.symbol})
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-gold-light">
                          {planet.siderealLongitudeDeg.toFixed(3)}°
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {planet.tropicalLongitudeDeg.toFixed(3)}°
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {planet.latitudeDeg.toFixed(4)}°
                        </td>
                        <td className="py-2.5 px-3 text-gold-soft">
                          {planet.distanceAu.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {Number(planet.distanceKm.toFixed(0)).toLocaleString()}
                        </td>
                        <td className="py-2.5 pl-3 font-sans text-gold-light">
                          {rashi.sanskritName.split(" ")[0]} ({rashi.englishName})
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
