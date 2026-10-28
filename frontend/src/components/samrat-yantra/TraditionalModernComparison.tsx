import React from "react";
import { type TraditionalSolarResponse, type ComparisonResponse } from "@/services/astronomy-api";
import { Scale, AlertCircle, BookOpen, CheckCircle2 } from "lucide-react";

interface TraditionalModernComparisonProps {
  traditionalSolar: TraditionalSolarResponse | null;
  comparisonResult: ComparisonResponse | null;
  modernSolarLongitudeDeg?: number | null;
  isLoading: boolean;
  error?: string | null;
}

export function TraditionalModernComparison({
  traditionalSolar,
  comparisonResult,
  modernSolarLongitudeDeg,
  isLoading,
  error,
}: TraditionalModernComparisonProps) {
  const sunComparison = comparisonResult?.comparisons.find((c) => c.body.toLowerCase() === "sun");

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold/15 pb-3">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-gold" />
          <h3 className="font-deva text-xl text-gold-gradient sm:text-2xl">
            पारम्परिक एवं आधुनिक तुलना (Traditional vs Modern Comparison)
          </h3>
        </div>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-sans text-xs text-gold-soft">
          Surya Siddhanta ↔ JPL DE421
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8 text-gold-soft">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent mr-3" />
          <span>तुलना गणना प्रगति पर है (Fetching astronomical comparison)...</span>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <div>
              <strong className="font-semibold">तुलना अनुपलब्ध (Comparison Unavailable):</strong>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      ) : traditionalSolar && (sunComparison || modernSolarLongitudeDeg != null) ? (
        <div className="flex flex-col gap-4">
          {/* Side by Side Comparison Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Traditional Card */}
            <div className="rounded-lg border border-gold/25 bg-gold/5 p-4">
              <div className="flex items-center justify-between text-xs text-gold">
                <span className="font-deva font-semibold">सूर्य सिद्धान्त (Traditional)</span>
                <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[10px]">Preliminary</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Mean Solar Longitude (मध्यम सूर्य)
              </p>
              <div className="mt-3">
                <span className="font-mono text-2xl font-bold text-gold-light">
                  {traditionalSolar.longitude_deg.toFixed(4)}°
                </span>
              </div>
              <p className="mt-2 text-[11px] text-gold-soft">
                Ref: {traditionalSolar.reference_location} (Epoch {traditionalSolar.reference_date})
              </p>
            </div>

            {/* Modern Card */}
            <div className="rounded-lg border border-blue-400/25 bg-blue-500/5 p-4">
              <div className="flex items-center justify-between text-xs text-blue-300">
                <span className="font-deva font-semibold">आधुनिक खगोलिकी (Modern)</span>
                <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px]">JPL DE421</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Apparent Geocentric Longitude</p>
              <div className="mt-3">
                <span className="font-mono text-2xl font-bold text-blue-200">
                  {sunComparison
                    ? `${sunComparison.modern_deg.toFixed(4)}°`
                    : modernSolarLongitudeDeg != null
                      ? `${modernSolarLongitudeDeg.toFixed(4)}°`
                      : "—"}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-blue-300">
                Standard: TT / UTC True Ecliptic of Date
              </p>
            </div>

            {/* Difference / Antaram Card */}
            <div className="rounded-lg border border-purple-400/25 bg-purple-500/5 p-4">
              <div className="flex items-center justify-between text-xs text-purple-300">
                <span className="font-deva font-semibold">अन्तर (Difference $\Delta$)</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Traditional − Modern</p>
              <div className="mt-3">
                <span className="font-mono text-2xl font-bold text-purple-200">
                  {sunComparison
                    ? `${sunComparison.difference_deg >= 0 ? "+" : ""}${sunComparison.difference_deg.toFixed(4)}°`
                    : modernSolarLongitudeDeg != null
                      ? `${(traditionalSolar.longitude_deg - modernSolarLongitudeDeg).toFixed(4)}°`
                      : "—"}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-purple-300">
                Angular separation along the ecliptic
              </p>
            </div>
          </div>

          {/* Scientific Context & Limitations Accordion/Notice */}
          <div className="rounded-lg border border-gold/15 bg-background/50 p-4 text-xs">
            <div className="flex items-start gap-2.5">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <div className="space-y-1.5 text-muted-foreground leading-relaxed">
                <p className="font-semibold text-gold">
                  वैज्ञानिक एवं ऐतिहासिक व्याख्या (Scientific Clarification):
                </p>
                <p>
                  1. <strong>Ecliptic Longitude vs Sundial Reading:</strong> The Samrat Yantra
                  physically measures local apparent solar time (hour angle $H$) through topocentric
                  shadow projection on an equinoctial quadrant. The comparison above evaluates the
                  Sun's <em>orbital position (ecliptic longitude)</em> between traditional
                  mathematical models and modern ephemerides.
                </p>
                <p>
                  2. <strong>Preliminary Mean Model:</strong> As documented by the backend, the
                  Surya Siddhanta calculation currently models the{" "}
                  <em>mean solar longitude (मध्यम मान)</em> without applying the traditional
                  equation of the apsis (मन्दफल / solar equation of center, which accounts for
                  orbital eccentricity and produces true longitude).
                </p>
                {traditionalSolar.limitations && traditionalSolar.limitations.length > 0 && (
                  <div className="mt-2 rounded border border-gold/10 bg-gold/5 p-2 text-[11px] text-gold-soft">
                    <strong className="text-gold">Backend Reported Limitations:</strong>
                    <ul className="mt-1 list-disc list-inside space-y-0.5">
                      {traditionalSolar.limitations.map((lim, i) => (
                        <li key={i}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gold/15 bg-gold/5 p-4 text-center text-xs text-gold-soft">
          Select date and coordinates to load live traditional and modern planetary comparisons.
        </div>
      )}
    </div>
  );
}
