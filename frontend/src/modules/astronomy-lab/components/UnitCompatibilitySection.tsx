/**
 * components/UnitCompatibilitySection.tsx
 * Section 7: Astronomical Unit Converter & Coordinate System Compatibility Matrix.
 * Provides interactive conversion tools between traditional sexagesimal and modern SI units,
 * and systematically validates coordinate transformations (Sayana vs Nirayana, Geocentric vs Topocentric).
 */

import React, { useState } from "react";
import {
  Scale,
  Clock,
  Compass,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
} from "lucide-react";
import {
  degreesToArcminutes,
  degreesToArcseconds,
  degreesToRadians,
  radiansToDegrees,
  ghatisToMinutes,
  minutesToGhatis,
  palasToSeconds,
  secondsToPalas,
  checkCoordinateCompatibility,
  type CoordinateSystemType,
} from "../utils/astronomyMath";

export function UnitCompatibilitySection() {
  // Angular converter state
  const [degInput, setDegInput] = useState<string>("30.0");
  const degVal = parseFloat(degInput) || 0;
  const arcminVal = degreesToArcminutes(degVal);
  const arcsecVal = degreesToArcseconds(degVal);
  const radVal = degreesToRadians(degVal);
  const hourVal = degVal / 15; // 1 hr = 15°

  // Traditional time converter state
  const [ghatiInput, setGhatiInput] = useState<string>("2.5");
  const ghatiVal = parseFloat(ghatiInput) || 0;
  const minVal = ghatisToMinutes(ghatiVal);
  const secVal = minVal * 60;
  const palaVal = secondsToPalas(secVal);
  const praharVal = ghatiVal / 7.5; // 1 Prahar = 7.5 Ghatis = 3 hours

  // Coordinate compatibility tester state
  const [sysA, setSysA] = useState<CoordinateSystemType>("sayana");
  const [sysB, setSysB] = useState<CoordinateSystemType>("nirayana");
  const compatResult = checkCoordinateCompatibility(sysA, sysB);

  return (
    <section className="space-y-8 rounded-3xl border border-gold/25 bg-midnight-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Units & Coordinate Compatibility Matrix
          </h2>
        </div>
        <p className="mt-1 font-deva text-sm text-gold-soft">
          खगोलीय मापन इकाइयाँ, अक्षांश-रेखांश रूपान्तरण एवं सायन-निरयण समन्वय
        </p>
        <p className="mt-1 text-xs text-slate-300">
          Scientific unit conversions between traditional Indian base-60 sexagesimal systems and
          modern SI metrics, alongside reference frame compatibility enforcement.
        </p>
      </div>

      {/* Part 1: Interactive Unit Converters */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Angular Units Converter */}
        <div className="space-y-4 rounded-2xl border border-gold/30 bg-black/40 p-5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Compass className="h-4 w-4 text-gold" />
            <h3 className="text-sm font-semibold text-white">
              Angular Units Converter (Degree / Arcmin / Arcsec / Radian)
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400">Input Angle in Decimal Degrees (°):</label>
              <input
                type="number"
                step="0.01"
                value={degInput}
                onChange={(e) => setDegInput(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2 text-sm font-medium text-white shadow-inner focus:border-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <span className="text-[10px] text-slate-400">Arcminutes (Kala '):</span>
                <p className="mt-0.5 font-mono text-sm font-semibold text-amber-300">
                  {arcminVal.toFixed(2)}'
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <span className="text-[10px] text-slate-400">Arcseconds (Vikala "):</span>
                <p className="mt-0.5 font-mono text-sm font-semibold text-amber-300">
                  {arcsecVal.toFixed(1)}"
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <span className="text-[10px] text-slate-400">Radians (rad):</span>
                <p className="mt-0.5 font-mono text-sm font-semibold text-cyan-300">
                  {radVal.toFixed(6)} rad
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <span className="text-[10px] text-slate-400">Hours of Right Ascension:</span>
                <p className="mt-0.5 font-mono text-sm font-semibold text-cyan-300">
                  {hourVal.toFixed(4)}h
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-2.5 text-[11px] text-slate-400">
              <strong>Base Relationship:</strong> 1 Rashi = 30° = 1,800' (Kalas) = 108,000"
              (Vikalas) = π/6 radians.
            </div>
          </div>
        </div>

        {/* Traditional Time Converter */}
        <div className="space-y-4 rounded-2xl border border-gold/30 bg-black/40 p-5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Clock className="h-4 w-4 text-gold" />
            <h3 className="text-sm font-semibold text-white">
              Traditional Indian Time Converter (Ghati / Pala / Prahar)
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400">Input Traditional Ghatis (घटी):</label>
              <input
                type="number"
                step="0.1"
                value={ghatiInput}
                onChange={(e) => setGhatiInput(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2 text-sm font-medium text-white shadow-inner focus:border-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <span className="text-[10px] text-slate-400">Civil Minutes:</span>
                <p className="mt-0.5 font-mono text-sm font-semibold text-amber-300">
                  {minVal.toFixed(2)} min
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <span className="text-[10px] text-slate-400">Palas / Vighatis (पल):</span>
                <p className="mt-0.5 font-mono text-sm font-semibold text-amber-300">
                  {palaVal.toFixed(1)} palas
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <span className="text-[10px] text-slate-400">Civil Seconds:</span>
                <p className="mt-0.5 font-mono text-sm font-semibold text-cyan-300">
                  {secVal.toFixed(0)} s
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <span className="text-[10px] text-slate-400">Prahars (प्रहर):</span>
                <p className="mt-0.5 font-mono text-sm font-semibold text-cyan-300">
                  {praharVal.toFixed(3)} prahar
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-2.5 text-[11px] text-slate-400">
              <strong>Base Relationship:</strong> 1 Solar Day = 60 Ghatis = 3,600 Palas = 216,000
              Vipalas = 8 Prahars = 24 Hours.
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Coordinate System Compatibility Tester */}
      <div className="space-y-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 to-black/50 p-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <ArrowRightLeft className="h-5 w-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            Coordinate System Compatibility Validator
          </h3>
        </div>

        <p className="text-xs text-slate-300">
          Comparing numbers from different coordinate systems without applying their physical
          offsets creates false errors. Select any two reference frames to test whether direct
          mathematical comparison is valid:
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Frame A */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Reference Frame A:</label>
            <select
              value={sysA}
              onChange={(e) => setSysA(e.target.value as CoordinateSystemType)}
              className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2 text-xs font-medium text-white shadow-inner focus:border-indigo-400 focus:outline-none"
            >
              <option value="nirayana">Nirayana (Sidereal - Indian Traditional)</option>
              <option value="sayana">Sayana (Tropical - Western / Equinox of Date)</option>
              <option value="topocentric">Topocentric (Observer Horizon Surface)</option>
              <option value="geocentric">Geocentric (Earth Center Frame)</option>
            </select>
          </div>

          {/* Frame B */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Reference Frame B:</label>
            <select
              value={sysB}
              onChange={(e) => setSysB(e.target.value as CoordinateSystemType)}
              className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2 text-xs font-medium text-white shadow-inner focus:border-indigo-400 focus:outline-none"
            >
              <option value="nirayana">Nirayana (Sidereal - Indian Traditional)</option>
              <option value="sayana">Sayana (Tropical - Western / Equinox of Date)</option>
              <option value="topocentric">Topocentric (Observer Horizon Surface)</option>
              <option value="geocentric">Geocentric (Earth Center Frame)</option>
            </select>
          </div>
        </div>

        {/* Compatibility Test Result Box */}
        <div
          className={`rounded-2xl border p-4 transition-all ${
            compatResult.compatible
              ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-200"
              : "border-amber-500/30 bg-amber-950/20 text-amber-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {compatResult.compatible ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            )}
            <strong className="text-sm">
              Status:{" "}
              {compatResult.compatible
                ? "COMPATIBLE FOR DIRECT COMPARISON"
                : "TRANSFORMATION REQUIRED"}
            </strong>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">{compatResult.reason}</p>
          {compatResult.conversionRequired && (
            <div className="mt-2.5 rounded-xl border border-white/10 bg-black/40 p-2.5 text-xs font-mono text-gold">
              Required Conversion: {compatResult.conversionRequired}
            </div>
          )}
        </div>
      </div>

      {/* Part 3: Foundational Astrometry Rules Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Foundational Reference Frame Equivalencies
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="p-3">Reference Frame</th>
                <th className="p-3">Zero Reference Origin</th>
                <th className="p-3">Governing Precession Motion</th>
                <th className="p-3">Modern Alignment Equation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              <tr>
                <td className="p-3 font-semibold text-amber-300">Nirayana (Sidereal)</td>
                <td className="p-3">Fixed star Spica / Chitra star (opposite 180°)</td>
                <td className="p-3">Invariant relative to stellar background</td>
                <td className="p-3 font-mono text-xs">λ_Nirayana = λ_Sayana - Ayanamsha</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-cyan-300">Sayana (Tropical)</td>
                <td className="p-3">Vernal Equinox (First Point of Aries)</td>
                <td className="p-3">Shifts westward ~50.29 arcseconds/year</td>
                <td className="p-3 font-mono text-xs">λ_Sayana = λ_Nirayana + Ayanamsha</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-purple-300">Topocentric</td>
                <td className="p-3">Observer geographic surface location</td>
                <td className="p-3">Diurnal parallax effect (Moon: ~1°, Sun: ~8.8")</td>
                <td className="p-3 font-mono text-xs">r_topo = r_geo - R_earth</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-emerald-300">Geocentric</td>
                <td className="p-3">Earth center of mass</td>
                <td className="p-3">Standard ephemeris planetary perspective</td>
                <td className="p-3 font-mono text-xs">Barycentric to Geocentric conversion</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
