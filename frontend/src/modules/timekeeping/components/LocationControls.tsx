/**
 * Location and Date Configuration Panel.
 * Supports location presets (Konark, Ujjain, Delhi, Jaipur, Greenwich),
 * manual coordinate entry with bounds validation, and IANA timezone selection.
 */

import React, { useState } from "react";
import { LocationPreset } from "../types/timekeeping";
import { MapPin, Calendar, Globe, AlertCircle, Compass } from "lucide-react";

interface LocationControlsProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  latitude: number;
  onLatitudeChange: (lat: number) => void;
  longitude: number;
  onLongitudeChange: (lon: number) => void;
  elevation_m: number;
  onElevationChange: (elev: number) => void;
  timezone: string;
  onTimezoneChange: (tz: string) => void;
  presets: LocationPreset[];
}

export function LocationControls({
  selectedDate,
  onDateChange,
  selectedPresetId,
  onSelectPreset,
  latitude,
  onLatitudeChange,
  longitude,
  onLongitudeChange,
  elevation_m,
  onElevationChange,
  timezone,
  onTimezoneChange,
  presets,
}: LocationControlsProps) {
  const [latError, setLatError] = useState<string | null>(null);
  const [lonError, setLonError] = useState<string | null>(null);

  const handleLatInput = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setLatError("Please enter a valid number");
      return;
    }
    if (num < -90 || num > 90) {
      setLatError("Latitude must be between -90° and +90°");
      return;
    }
    setLatError(null);
    onLatitudeChange(num);
  };

  const handleLonInput = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setLonError("Please enter a valid number");
      return;
    }
    if (num < -180 || num > 180) {
      setLonError("Longitude must be between -180° and +180°");
      return;
    }
    setLonError(null);
    onLongitudeChange(num);
  };

  return (
    <div className="rounded-2xl border border-gold/25 bg-background/80 p-4 shadow-xl backdrop-blur-md sm:p-5">
      <div className="flex items-center gap-2 border-b border-gold/15 pb-3">
        <MapPin className="h-4 w-4 text-gold" />
        <h3 className="font-deva text-base font-semibold text-gold-gradient">
          स्थान एवं दिनांक विन्यास (Observer Location & Date)
        </h3>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Date Selector */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-gold mb-1.5">
            <Calendar className="h-3.5 w-3.5 text-gold" />
            <span>Observation Date</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full rounded-lg border border-gold/30 bg-[#0c1322] px-3 py-2 font-mono text-xs text-amber-100 [color-scheme:dark] focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <span className="block mt-1 text-[10px] text-slate-300">
            Ephemeris range: 1900 - 2053
          </span>
        </div>

        {/* Location Presets */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-gold mb-1.5">
            <Compass className="h-3.5 w-3.5 text-gold" />
            <span>Observatory Preset</span>
          </label>
          <select
            value={selectedPresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="w-full rounded-lg border border-gold/30 bg-[#0c1322] px-3 py-2 font-sans text-xs text-amber-100 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0c1322] text-amber-100">
                {p.name} ({p.hindiName})
              </option>
            ))}
            <option value="custom" className="bg-[#0c1322] text-amber-100">
              Custom Coordinates...
            </option>
          </select>
          <span className="block mt-1 text-[10px] text-slate-300 truncate">
            {presets.find((p) => p.id === selectedPresetId)?.description ||
              "User defined coordinates"}
          </span>
        </div>

        {/* Latitude & Longitude Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gold mb-1.5">Latitude (°)</label>
            <input
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => handleLatInput(e.target.value)}
              className={`w-full rounded-lg border px-2.5 py-2 font-mono text-xs bg-[#0c1322] text-amber-100 focus:outline-none ${
                latError ? "border-red-500 focus:ring-red-500" : "border-gold/30 focus:border-gold"
              }`}
            />
            {latError && (
              <span className="flex items-center gap-1 mt-1 text-[9px] text-red-400">
                <AlertCircle className="h-2.5 w-2.5" />
                {latError}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gold mb-1.5">Longitude (°)</label>
            <input
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => handleLonInput(e.target.value)}
              className={`w-full rounded-lg border px-2.5 py-2 font-mono text-xs bg-[#0c1322] text-amber-100 focus:outline-none ${
                lonError ? "border-red-500 focus:ring-red-500" : "border-gold/30 focus:border-gold"
              }`}
            />
            {lonError && (
              <span className="flex items-center gap-1 mt-1 text-[9px] text-red-400">
                <AlertCircle className="h-2.5 w-2.5" />
                {lonError}
              </span>
            )}
          </div>
        </div>

        {/* Timezone Selector */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-gold mb-1.5">
            <Globe className="h-3.5 w-3.5 text-gold" />
            <span>Timezone (IANA)</span>
          </label>
          <select
            value={timezone}
            onChange={(e) => onTimezoneChange(e.target.value)}
            className="w-full rounded-lg border border-gold/30 bg-[#0c1322] px-3 py-2 font-mono text-xs text-amber-100 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          >
            <option value="Asia/Kolkata" className="bg-[#0c1322] text-amber-100">
              Asia/Kolkata (IST, UTC+05:30)
            </option>
            <option value="UTC" className="bg-[#0c1322] text-amber-100">
              UTC (Universal Time, UTC+00:00)
            </option>
            <option value="Europe/London" className="bg-[#0c1322] text-amber-100">
              Europe/London (GMT/BST)
            </option>
            <option value="America/New_York" className="bg-[#0c1322] text-amber-100">
              America/New_York (EST/EDT)
            </option>
            <option value="America/Los_Angeles" className="bg-[#0c1322] text-amber-100">
              America/Los_Angeles (PST/PDT)
            </option>
          </select>
          <span className="block mt-1 text-[10px] text-slate-300">
            Standard civil reference timezone
          </span>
        </div>
      </div>
    </div>
  );
}
