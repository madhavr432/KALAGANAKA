/**
 * components/DifferenceAnalysisGraph.tsx
 * Section 3: Interactive Multi-Day Time-Series Difference Graph.
 * Visualizes the residual curve between Surya Siddhanta mean motion and JPL DE421 true motion
 * across 7, 14, 30, or 60 days, demonstrating the physical oscillation of the Equation of the Center.
 */

import React, { useState } from "react";
import { TrendingUp, BarChart3, Calendar, Activity, Layers, Sparkles, Info } from "lucide-react";
import type { SolarTimeSeriesResponse } from "@/services/astronomy-api";

interface DifferenceAnalysisGraphProps {
  timeSeriesData: SolarTimeSeriesResponse | null;
  selectedDays: number;
  onSelectDays: (days: number) => void;
  isLoading: boolean;
  error: string | null;
  onOpenInfoModal?: (topicId?: string) => void;
}

export function DifferenceAnalysisGraph({
  timeSeriesData,
  selectedDays,
  onSelectDays,
  isLoading,
  error,
  onOpenInfoModal,
}: DifferenceAnalysisGraphProps) {
  const [activeView, setActiveView] = useState<"residual" | "dual">("residual");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const series = timeSeriesData?.time_series || [];
  const stats = timeSeriesData?.summary_statistics;

  // Chart dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 25, right: 30, bottom: 40, left: 55 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Compute domains for residual view
  let minDiff = 0;
  let maxDiff = 3;
  if (series.length > 0) {
    const diffs = series.map((p) => p.absolute_difference_deg);
    const minVal = Math.min(...diffs);
    const maxVal = Math.max(...diffs);
    const range = Math.max(maxVal - minVal, 0.1);
    minDiff = Math.max(0, minVal - range * 0.2);
    maxDiff = maxVal + range * 0.2;
  }

  // Generate SVG path for residual curve
  const points = series.map((p, idx) => {
    const x =
      padding.left + (series.length > 1 ? (idx / (series.length - 1)) * plotWidth : plotWidth / 2);
    const yRatio = (p.absolute_difference_deg - minDiff) / (maxDiff - minDiff || 1);
    const y = padding.top + plotHeight - yRatio * plotHeight;
    return { x, y, point: p, idx };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${padding.top + plotHeight} L ${points[0].x} ${padding.top + plotHeight} Z`
      : "";

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <section className="space-y-6 rounded-3xl border border-gold/25 bg-midnight-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                Multi-Day Difference Analysis Graph
              </h2>
            </div>
            <p className="mt-1 font-deva text-sm text-gold-soft">
              कालक्रम विचलन आलेख — सूर्य सिद्धान्त एवं आधुनिक खगोल विज्ञान समय-श्रृंखला
            </p>
          </div>

          {/* Duration Selector Tabs */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-1">
            {[7, 14, 30, 60].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => onSelectDays(days)}
                disabled={isLoading}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedDays === days
                    ? "border border-gold bg-gold/20 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-300">
          Continuous tracking of the angular residual (|Traditional Mean Longitude - Modern Apparent
          Longitude|) over {selectedDays} consecutive days.
        </p>
      </div>

      {/* Summary Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Mean Difference
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-amber-300">
              {stats.mean_absolute_difference_deg.toFixed(4)}°
            </p>
            <span className="text-[10px] text-slate-400">
              ~{(stats.mean_absolute_difference_deg * 60).toFixed(1)} arcmin
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Maximum Residual
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-rose-300">
              {stats.max_absolute_difference_deg.toFixed(4)}°
            </p>
            <span className="text-[10px] text-slate-400">Peak deviation</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Minimum Residual
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-emerald-300">
              {stats.min_absolute_difference_deg.toFixed(4)}°
            </p>
            <span className="text-[10px] text-slate-400">Trough deviation</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Std Deviation (σ)
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-purple-300">
              {stats.std_deviation_deg.toFixed(4)}°
            </p>
            <span className="text-[10px] text-slate-400">Variability factor</span>
          </div>
        </div>
      )}

      {/* SVG Chart Container */}
      <div className="relative rounded-2xl border border-white/10 bg-black/60 p-4 shadow-inner">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-gold">
              <Activity className="h-5 w-5 animate-spin" />
              <span>Computing multi-day ephemeris time-series...</span>
            </div>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full min-w-[600px] h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="residualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const yVal = minDiff + ratio * (maxDiff - minDiff);
              const yPos = padding.top + plotHeight - ratio * plotHeight;
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={yPos}
                    x2={svgWidth - padding.right}
                    y2={yPos}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 10}
                    y={yPos + 4}
                    textAnchor="end"
                    className="fill-slate-400 text-[10px] font-mono"
                  >
                    {yVal.toFixed(2)}°
                  </text>
                </g>
              );
            })}

            {/* Shaded Area under Curve */}
            {areaD && <path d={areaD} fill="url(#residualGradient)" />}

            {/* Main Residual Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Data Points */}
            {points.map((pt) => (
              <circle
                key={pt.idx}
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === pt.idx ? 6 : 3}
                fill={hoveredIndex === pt.idx ? "#ffffff" : "#f59e0b"}
                stroke="#d97706"
                strokeWidth={hoveredIndex === pt.idx ? 2 : 1}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredIndex(pt.idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}

            {/* X-Axis Dates */}
            {points
              .filter((_, idx) => {
                const step = Math.ceil(points.length / 6);
                return idx % step === 0 || idx === points.length - 1;
              })
              .map((pt) => (
                <text
                  key={pt.idx}
                  x={pt.x}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  {pt.point.date.slice(5)}
                </text>
              ))}

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <g
                transform={`translate(${hoveredPoint.x}, ${Math.max(hoveredPoint.y - 75, padding.top)})`}
              >
                <rect
                  x="-75"
                  y="0"
                  width="150"
                  height="65"
                  rx="8"
                  fill="#0b132b"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  className="shadow-xl"
                />
                <text x="0" y="16" textAnchor="middle" className="fill-gold text-[10px] font-bold">
                  {hoveredPoint.point.date}
                </text>
                <text x="0" y="32" textAnchor="middle" className="fill-white text-[10px] font-mono">
                  Diff: {hoveredPoint.point.absolute_difference_deg.toFixed(4)}°
                </text>
                <text
                  x="0"
                  y="46"
                  textAnchor="middle"
                  className="fill-slate-300 text-[9px] font-mono"
                >
                  Trad: {hoveredPoint.point.traditional_longitude_deg.toFixed(2)}° | Mod:{" "}
                  {hoveredPoint.point.modern_longitude_deg.toFixed(2)}°
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Scientific Residual Explanation */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 to-black/50 p-5 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-indigo-300">
          <Sparkles className="h-4 w-4" />
          <span>Physical Significance of the Residual Curve (Equation of the Center)</span>
        </div>
        <p className="leading-relaxed">
          Notice how the difference curve is not random noise, but a continuous smooth oscillation.
          This curve directly reflects the{" "}
          <strong>Equation of the Center (मन्दफल / Mandaphala)</strong>. Earth&apos;s orbit is
          slightly eccentric (e &approx; 0.0167). When Earth is near perihelion (early January), its
          actual speed (&approx; 1.019&deg;/day) exceeds the Surya Siddhanta mean motion
          (0.9856&deg;/day). Near aphelion (early July), Earth slows down (&approx; 0.953&deg;/day).
        </p>
        <p className="leading-relaxed text-slate-400">
          Surya Siddhanta specifically addresses this in <em>Spashtadhikara</em> (Chapter 2) by
          applying epicyclic corrections (Manda-kendra) to convert the mean Sun into the true Sun.
        </p>
      </div>
    </section>
  );
}
