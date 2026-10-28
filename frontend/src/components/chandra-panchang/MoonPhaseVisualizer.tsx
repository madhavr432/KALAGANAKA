import React from "react";
import { Moon, Sparkles } from "lucide-react";

interface MoonPhaseVisualizerProps {
  angularSeparationDeg: number;
  tithiName: string;
  paksha: "Shukla" | "Krishna";
  tithiInPaksha: number;
}

export function MoonPhaseVisualizer({
  angularSeparationDeg,
  tithiName,
  paksha,
  tithiInPaksha,
}: MoonPhaseVisualizerProps) {
  // Illumination calculation: (1 - cos(theta)) / 2 * 100
  const rad = (angularSeparationDeg * Math.PI) / 180;
  const illuminationPercent = Math.round(((1 - Math.cos(rad)) / 2) * 100);

  // Phase naming
  let phaseName = "";
  if (angularSeparationDeg < 6 || angularSeparationDeg > 354) {
    phaseName = "Amavasya / New Moon (दर्श / अमावस्या)";
  } else if (angularSeparationDeg >= 174 && angularSeparationDeg <= 186) {
    phaseName = "Purnima / Full Moon (पूर्ण चन्द्र / पूर्णिमा)";
  } else if (paksha === "Shukla") {
    if (angularSeparationDeg < 90) {
      phaseName = "Shukla Paksha Waxing Crescent (बालचन्द्र / शुक्ल प्रतिपदा-सप्तमी)";
    } else if (angularSeparationDeg <= 96) {
      phaseName = "First Quarter (शुक्ल अष्टमी)";
    } else {
      phaseName = "Shukla Paksha Waxing Gibbous (शुक्ल नवमी-चतुर्दशी)";
    }
  } else {
    if (angularSeparationDeg < 270) {
      phaseName = "Krishna Paksha Waning Gibbous (कृष्ण प्रतिपदा-सप्तमी)";
    } else if (angularSeparationDeg <= 276) {
      phaseName = "Last Quarter (कृष्ण अष्टमी)";
    } else {
      phaseName = "Krishna Paksha Waning Crescent (कृष्ण नवमी-चतुर्दशी)";
    }
  }

  // Visual SVG curvature calculation for moon shadow
  // Normalized illumination: -1 (Amavasya) to +1 (Purnima)
  const norm = Math.cos(rad);
  const r = 50;
  const cx = 60;
  const cy = 60;

  // Path for moon crescent/gibbous
  // We draw a base dark circle, and then an illuminated path
  const isWaxing = angularSeparationDeg <= 180;
  const sweep = isWaxing ? 1 : 0;
  // d-curve for terminator arc
  const terminatorRadiusX = Math.abs(norm) * r;
  const terminatorSweep = norm >= 0 ? (isWaxing ? 0 : 1) : isWaxing ? 1 : 0;

  const illuminatedPath = `
    M ${cx} ${cy - r}
    A ${r} ${r} 0 0 ${sweep} ${cx} ${cy + r}
    A ${terminatorRadiusX} ${r} 0 0 ${terminatorSweep} ${cx} ${cy - r}
    Z
  `;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
      {/* SVG Moon Disc */}
      <div className="relative flex shrink-0 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-xl" />
        <svg
          viewBox="0 0 120 120"
          className="h-28 w-28 drop-shadow-[0_0_15px_rgba(251,191,36,0.25)]"
          aria-label={`Moon phase representation showing ${illuminationPercent}% illumination`}
        >
          <defs>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="1" />
              <stop offset="70%" stopColor="#fde68a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
            </radialGradient>
            <radialGradient id="darkSide" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#090a16" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Dark Disc Base */}
          <circle cx={cx} cy={cy} r={r} fill="url(#darkSide)" stroke="#b45309" strokeWidth="1" />

          {/* Craters subtle detail */}
          <circle cx={cx - 15} cy={cy - 10} r="6" fill="#17153b" opacity="0.6" />
          <circle cx={cx + 10} cy={cy + 15} r="9" fill="#17153b" opacity="0.5" />
          <circle cx={cx - 8} cy={cy + 22} r="5" fill="#17153b" opacity="0.4" />

          {/* Illuminated Portion */}
          <path d={illuminatedPath} fill="url(#moonGlow)" opacity="0.95" />

          {/* Outer Border Glow */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(245, 158, 11, 0.4)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Moon Details Info */}
      <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
            <Moon className="h-3 w-3 text-gold" />
            {paksha} Paksha ({paksha === "Shukla" ? "शुक्ल पक्ष • Waxing" : "कृष्ण पक्ष • Waning"})
          </span>
          <span className="rounded-full border border-gold/20 bg-background/50 px-2.5 py-0.5 text-xs font-mono text-gold-soft">
            {illuminationPercent}% Illuminated
          </span>
        </div>

        <h4 className="font-deva text-xl text-gold-gradient sm:text-2xl">
          {tithiName} (तिथि {tithiInPaksha})
        </h4>

        <p className="font-sans text-xs text-muted-foreground">{phaseName}</p>

        <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-gold-soft/80">
          <div>
            <span className="text-muted-foreground">Moon-Sun Elongation (Δλ): </span>
            <span className="text-gold font-semibold">{angularSeparationDeg.toFixed(2)}°</span>
          </div>
          <div>
            <span className="text-muted-foreground">Phase Angle: </span>
            <span>{(180 - angularSeparationDeg).toFixed(2)}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
