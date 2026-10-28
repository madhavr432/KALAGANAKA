/**
 * ViewModeSelector.tsx
 * Allows toggling between:
 * - Ancient (Konark Sun Temple Chakra)
 * - Modern (Astronomical Coordinates Machine)
 * - Compare (Synchronized side-by-side view)
 */

import React from "react";
import { TimekeepingViewMode } from "../types/timekeeping";
import { Compass, Eye, Columns } from "lucide-react";

interface ViewModeSelectorProps {
  viewMode: TimekeepingViewMode;
  onViewModeChange: (mode: TimekeepingViewMode) => void;
  synchronized: boolean;
  onToggleSynchronized: (val: boolean) => void;
}

export function ViewModeSelector({
  viewMode,
  onViewModeChange,
  synchronized,
  onToggleSynchronized,
}: ViewModeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/20 bg-background/70 p-2 backdrop-blur-md">
      {/* View Mode Buttons */}
      <div className="flex rounded-lg border border-gold/15 bg-background/50 p-1">
        <button
          onClick={() => onViewModeChange("konark")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-sans text-xs transition-all ${
            viewMode === "konark"
              ? "bg-gold-gradient text-slate-950 font-bold shadow-md"
              : "text-amber-200/80 hover:bg-gold/15 hover:text-amber-100"
          }`}
          aria-pressed={viewMode === "konark"}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>१. कोणार्क चक्र (Ancient)</span>
        </button>

        <button
          onClick={() => onViewModeChange("modern")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-sans text-xs transition-all ${
            viewMode === "modern"
              ? "bg-gold-gradient text-slate-950 font-bold shadow-md"
              : "text-amber-200/80 hover:bg-gold/15 hover:text-amber-100"
          }`}
          aria-pressed={viewMode === "modern"}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>२. Modern Machine</span>
        </button>

        <button
          onClick={() => onViewModeChange("compare")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-sans text-xs transition-all ${
            viewMode === "compare"
              ? "bg-gold-gradient text-slate-950 font-bold shadow-md"
              : "text-amber-200/80 hover:bg-gold/15 hover:text-amber-100"
          }`}
          aria-pressed={viewMode === "compare"}
        >
          <Columns className="h-3.5 w-3.5" />
          <span>३. Compare Both (तुलना)</span>
        </button>
      </div>

      {/* Synchronized Simulation Toggle */}
      {viewMode === "compare" && (
        <div className="flex items-center gap-2 px-2 text-xs text-gold-soft">
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={synchronized}
              onChange={(e) => onToggleSynchronized(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gold/40 text-gold focus:ring-gold"
            />
            <span className="font-sans text-[11px] text-slate-200 font-medium">
              Synchronized Sun Simulation
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
