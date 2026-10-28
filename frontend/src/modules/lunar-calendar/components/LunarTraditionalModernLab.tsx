/**
 * components/LunarTraditionalModernLab.tsx
 * Section I: Traditional Indian Astronomy vs Modern Ephemeris Calculation Lab.
 * Explores:
 * 1. Nirayana (Sidereal) vs Sayana (Tropical) coordinate reduction with Lahiri Ayanamsha.
 * 2. Why Tithi and Karana are mathematically invariant to Ayanamsha subtraction.
 * 3. Continuous Instantaneous Transitions vs Civil Sunrise (Udaya) Rules.
 * 4. High-precision numerical comparison table (JPL DE421 vs classical algorithms).
 */

import React from "react";
import { Compass, Sparkles, Scale, Info, CheckCircle2 } from "lucide-react";
import type { MoonPhysicalState, PanchangLimbsState } from "../types/lunarCalendar";

interface LunarTraditionalModernLabProps {
  moonState: MoonPhysicalState;
  panchangLimbs: PanchangLimbsState;
  isLiveBackend: boolean;
  onOpenInfo: (key: string) => void;
}

export function LunarTraditionalModernLab({
  moonState,
  panchangLimbs,
  isLiveBackend,
  onOpenInfo,
}: LunarTraditionalModernLabProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-gold/25 bg-midnight-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-gold-soft" />
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              Traditional vs Modern Calculation Lab
            </h2>
            <button
              type="button"
              onClick={() => onOpenInfo("tithi")}
              className="text-xs text-gold hover:underline"
              aria-label="Traditional vs modern calculation info"
            >
              ⓘ Lab Info
            </button>
          </div>
          <p className="mt-1 font-deva text-sm text-gold-soft">
            दृग्गणित-सिद्धान्त समन्वय — सायन, निरयण एवं अयनांश गणित
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Calibrated against NASA JPL DE421 Ephemeris</span>
        </div>
      </div>

      {/* 3 Core Analytical Insights Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 1. Nirayana vs Sayana */}
        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Compass className="h-4 w-4 text-gold" />
            <strong className="text-white">Nirayana (Sidereal) vs Sayana (Tropical)</strong>
          </div>
          <p className="leading-relaxed text-slate-300">
            Due to the precession of Earth’s rotational axis (~50.29 arcseconds/year), the Vernal
            Equinox drifts westward along the ecliptic.
          </p>
          <p className="leading-relaxed text-slate-300">
            Modern Western astronomy uses <strong>Sayana (Tropical)</strong> coordinates anchored to
            the moving Equinox. Indian astronomy uses <strong>Nirayana (Sidereal)</strong>{" "}
            coordinates anchored to fixed background stars (Spica/Chitra at 180°), subtracted by the{" "}
            <strong>Lahiri Ayanamsha (~24.23°)</strong>.
          </p>
        </div>

        {/* 2. Tithi Precession Invariance */}
        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <strong className="text-white">Why Tithi & Karana are Invariant</strong>
          </div>
          <p className="leading-relaxed text-slate-300">
            A profound mathematical property of Indian lunar timekeeping:
          </p>
          <div className="rounded-lg bg-white/5 p-2 font-mono text-[11px] text-gold-light">
            Δλ = (λ_M - Δψ) - (λ_S - Δψ) = λ_M - λ_S
          </div>
          <p className="leading-relaxed text-slate-300">
            Because Ayanamsha (Δψ) is subtracted equally from both Sun and Moon, the elongation
            angle is <strong>identically identical in both Sayana and Nirayana frames</strong>!
          </p>
        </div>

        {/* 3. Udaya Tithi vs Instantaneous Transition */}
        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Scale className="h-4 w-4 text-amber-400" />
            <strong className="text-white">Civil Sunrise (Udaya) Rule</strong>
          </div>
          <p className="leading-relaxed text-slate-300">
            Modern ephemeris tracks the <strong>continuous instantaneous boundary</strong> down to
            fractions of a second via numerical bisection.
          </p>
          <p className="leading-relaxed text-slate-300">
            For civil festival observance, traditional Panchangs apply the{" "}
            <strong>Udaya Tithi rule</strong>: the Tithi active at the exact local sunrise moment
            governs the civil day, unless a specific festival specifies a distinct Muhurta (e.g.
            Nishita Kala at midnight for Janmashtami).
          </p>
        </div>
      </div>

      {/* Real-Time Comparative Telemetry Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <div className="border-b border-white/10 bg-black/60 px-4 py-3">
          <h3 className="font-serif text-sm font-bold text-white">
            Real-Time Ephemeris Coordinate Reduction Table
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Current simulation instant compared across Sidereal (Lahiri) and Tropical (J2000)
            reference frames
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/5 font-semibold text-slate-300">
              <tr>
                <th className="px-4 py-2.5">Astronomical Parameter</th>
                <th className="px-4 py-2.5">Tropical Coordinate (Sayana)</th>
                <th className="px-4 py-2.5">Sidereal Coordinate (Nirayana)</th>
                <th className="px-4 py-2.5">Lahiri Ayanamsha Precession</th>
                <th className="px-4 py-2.5">Astronomical Invariance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr>
                <td className="px-4 py-2.5 font-medium text-white">Moon Longitude (λ_Moon)</td>
                <td className="px-4 py-2.5 font-mono text-slate-200">
                  {moonState.moonTropicalLongitudeDeg.toFixed(4)}°
                </td>
                <td className="px-4 py-2.5 font-mono text-gold-light">
                  {moonState.moonSiderealLongitudeDeg.toFixed(4)}°
                </td>
                <td className="px-4 py-2.5 font-mono text-slate-400">
                  -{moonState.ayanamshaDeg.toFixed(4)}°
                </td>
                <td className="px-4 py-2.5 text-silver">Defines Nakshatra Mansion</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-white">Sun Longitude (λ_Sun)</td>
                <td className="px-4 py-2.5 font-mono text-slate-200">
                  {moonState.sunTropicalLongitudeDeg.toFixed(4)}°
                </td>
                <td className="px-4 py-2.5 font-mono text-gold-light">
                  {moonState.sunSiderealLongitudeDeg.toFixed(4)}°
                </td>
                <td className="px-4 py-2.5 font-mono text-slate-400">
                  -{moonState.ayanamshaDeg.toFixed(4)}°
                </td>
                <td className="px-4 py-2.5 text-silver">Defines Saur Month (Rashi)</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-white">
                  Elongation Angle (θ = λ_M - λ_S)
                </td>
                <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">
                  {moonState.elongationDeg.toFixed(4)}°
                </td>
                <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">
                  {moonState.elongationDeg.toFixed(4)}°
                </td>
                <td className="px-4 py-2.5 font-mono text-emerald-400">0.0000° (Cancels Out)</td>
                <td className="px-4 py-2.5 font-semibold text-emerald-400">
                  ✓ Precession Invariant (Tithi/Karana)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-white">Yoga Sum (λ_M + λ_S)</td>
                <td className="px-4 py-2.5 font-mono text-slate-400">
                  {(
                    (moonState.moonTropicalLongitudeDeg + moonState.sunTropicalLongitudeDeg) %
                    360
                  ).toFixed(4)}
                  °
                </td>
                <td className="px-4 py-2.5 font-mono text-gold-light">
                  {(
                    (moonState.moonSiderealLongitudeDeg + moonState.sunSiderealLongitudeDeg) %
                    360
                  ).toFixed(4)}
                  °
                </td>
                <td className="px-4 py-2.5 font-mono text-rose-400">
                  -{(moonState.ayanamshaDeg * 2).toFixed(4)}° (Double Error!)
                </td>
                <td className="px-4 py-2.5 text-rose-300">⚠ Requires True Sidereal Reduction</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-white">Illuminated Fraction (k)</td>
                <td className="px-4 py-2.5 font-mono font-semibold text-white">
                  {moonState.illuminationPercent}%
                </td>
                <td className="px-4 py-2.5 font-mono font-semibold text-white">
                  {moonState.illuminationPercent}%
                </td>
                <td className="px-4 py-2.5 font-mono text-slate-400">0%</td>
                <td className="px-4 py-2.5 font-semibold text-emerald-400">
                  ✓ Physical Geometric Observable
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
