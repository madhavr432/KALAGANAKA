import React from "react";
import { Sun, Compass } from "lucide-react";

export interface RashiInfo {
  index: number;
  sanskritName: string;
  englishName: string;
  symbol: string;
  element: string;
  startDeg: number;
  endDeg: number;
  solarMonthName: string;
}

export const RASHIS: RashiInfo[] = [
  {
    index: 1,
    sanskritName: "मेष (Mesha)",
    englishName: "Aries",
    symbol: "♈",
    element: "Agni (Fire)",
    startDeg: 0,
    endDeg: 30,
    solarMonthName: "Chaitra / Chithirai / Baishakh",
  },
  {
    index: 2,
    sanskritName: "वृषभ (Vrishabha)",
    englishName: "Taurus",
    symbol: "♉",
    element: "Prithvi (Earth)",
    startDeg: 30,
    endDeg: 60,
    solarMonthName: "Vaishakha / Vaikasi / Jyeshtha",
  },
  {
    index: 3,
    sanskritName: "मिथुन (Mithuna)",
    englishName: "Gemini",
    symbol: "♊",
    element: "Vayu (Air)",
    startDeg: 60,
    endDeg: 90,
    solarMonthName: "Jyeshtha / Aani / Ashadha",
  },
  {
    index: 4,
    sanskritName: "कर्क (Karka)",
    englishName: "Cancer",
    symbol: "♋",
    element: "Jala (Water)",
    startDeg: 90,
    endDeg: 120,
    solarMonthName: "Ashadha / Aadi / Shravan",
  },
  {
    index: 5,
    sanskritName: "सिंह (Simha)",
    englishName: "Leo",
    symbol: "♌",
    element: "Agni (Fire)",
    startDeg: 120,
    endDeg: 150,
    solarMonthName: "Shravana / Aavani / Bhadra",
  },
  {
    index: 6,
    sanskritName: "कन्या (Kanya)",
    englishName: "Virgo",
    symbol: "♍",
    element: "Prithvi (Earth)",
    startDeg: 150,
    endDeg: 180,
    solarMonthName: "Bhadrapada / Purattasi / Ashwin",
  },
  {
    index: 7,
    sanskritName: "तुला (Tula)",
    englishName: "Libra",
    symbol: "♎",
    element: "Vayu (Air)",
    startDeg: 180,
    endDeg: 210,
    solarMonthName: "Ashwina / Aipasi / Kartik",
  },
  {
    index: 8,
    sanskritName: "वृश्चिक (Vrischika)",
    englishName: "Scorpio",
    symbol: "♏",
    element: "Jala (Water)",
    startDeg: 210,
    endDeg: 240,
    solarMonthName: "Kartika / Karthigai / Agrahayana",
  },
  {
    index: 9,
    sanskritName: "धनु (Dhanu)",
    englishName: "Sagittarius",
    symbol: "♐",
    element: "Agni (Fire)",
    startDeg: 240,
    endDeg: 270,
    solarMonthName: "Margashirsha / Margazhi / Pousha",
  },
  {
    index: 10,
    sanskritName: "मकर (Makara)",
    englishName: "Capricorn",
    symbol: "♑",
    element: "Prithvi (Earth)",
    startDeg: 270,
    endDeg: 300,
    solarMonthName: "Pausha / Thai / Magha",
  },
  {
    index: 11,
    sanskritName: "कुम्भ (Kumbha)",
    englishName: "Aquarius",
    symbol: "♒",
    element: "Vayu (Air)",
    startDeg: 300,
    endDeg: 330,
    solarMonthName: "Magha / Maasi / Phalguna",
  },
  {
    index: 12,
    sanskritName: "मीन (Meena)",
    englishName: "Pisces",
    symbol: "♓",
    element: "Jala (Water)",
    startDeg: 330,
    endDeg: 360,
    solarMonthName: "Phalguna / Panguni / Chaitra",
  },
];

interface RashiSolarWheelProps {
  sunSiderealLongitudeDeg: number;
  sunTropicalLongitudeDeg: number;
}

export function RashiSolarWheel({
  sunSiderealLongitudeDeg,
  sunTropicalLongitudeDeg,
}: RashiSolarWheelProps) {
  // Determine active Rashi
  const activeRashiIndex = Math.floor(sunSiderealLongitudeDeg / 30);
  const activeRashi = RASHIS[activeRashiIndex] || RASHIS[0];
  const elapsedInRashi = sunSiderealLongitudeDeg % 30;
  const fractionElapsed = elapsedInRashi / 30;

  // Determine Ayana (Uttarayana: from Makara Sankranti ~270° sidereal to Karka Sankranti ~90° sidereal)
  const isUttarayana = sunSiderealLongitudeDeg >= 270 || sunSiderealLongitudeDeg < 90;
  const ayanaName = isUttarayana
    ? "उत्तरायण (Uttarayana — Northward Solar Progression)"
    : "दक्षिणायन (Dakshinayana — Southward Solar Progression)";

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
      {/* Visual SVG Zodiac Wheel */}
      <div className="relative flex shrink-0 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl" />
        <svg
          viewBox="0 0 240 240"
          className="h-56 w-56 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          aria-label="Solar Zodiac Wheel showing 12 Rashis"
        >
          {/* Outer Ring */}
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="#0d1117"
            stroke="rgba(245, 158, 11, 0.3)"
            strokeWidth="1.5"
          />
          <circle
            cx="120"
            cy="120"
            r="85"
            fill="#161b22"
            stroke="rgba(245, 158, 11, 0.2)"
            strokeWidth="1"
          />

          {/* 12 Rashi Sectors */}
          {RASHIS.map((r, i) => {
            const angleDeg = i * 30 - 90; // Start at top (0° = top)
            const rad = (angleDeg * Math.PI) / 180;
            const x1 = 120 + 85 * Math.cos(rad);
            const y1 = 120 + 85 * Math.sin(rad);
            const x2 = 120 + 110 * Math.cos(rad);
            const y2 = 120 + 110 * Math.sin(rad);

            // Label Position
            const midAngle = angleDeg + 15;
            const midRad = (midAngle * Math.PI) / 180;
            const tx = 120 + 98 * Math.cos(midRad);
            const ty = 120 + 98 * Math.sin(midRad);

            const isActive = i === activeRashiIndex;

            return (
              <g key={r.index}>
                {/* Sector Divider */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(245, 158, 11, 0.25)"
                  strokeWidth="1"
                />

                {/* Highlight active sector */}
                {isActive && (
                  <circle
                    cx={tx}
                    cy={ty}
                    r="9"
                    fill="rgba(245, 158, 11, 0.25)"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                )}

                {/* Symbol / Short text */}
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fill={isActive ? "#fbbf24" : "rgba(253, 230, 138, 0.7)"}
                  fontWeight={isActive ? "bold" : "normal"}
                >
                  {r.symbol}
                </text>
              </g>
            );
          })}

          {/* Center Sun Indicator */}
          <circle cx="120" cy="120" r="28" fill="#1c1917" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="120" cy="120" r="16" fill="#f59e0b" opacity="0.8" />
          <circle cx="120" cy="120" r="8" fill="#fef3c7" />

          {/* Pointer needle towards current sidereal degree */}
          {(() => {
            const needleAngle = sunSiderealLongitudeDeg - 90;
            const nRad = (needleAngle * Math.PI) / 180;
            const nx = 120 + 78 * Math.cos(nRad);
            const ny = 120 + 78 * Math.sin(nRad);
            return (
              <line
                x1="120"
                y1="120"
                x2={nx}
                y2={ny}
                stroke="#e11d48"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_6px_rgba(225,29,72,0.8)]"
              />
            );
          })()}
        </svg>
      </div>

      {/* Rashi & Solar Information */}
      <div className="flex flex-1 flex-col gap-3 text-center lg:text-left">
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            <Sun className="h-3.5 w-3.5 text-gold" />
            <span>सौर राशि (Active Solar Rashi): #{activeRashi.index} / 12</span>
          </span>
          <span className="rounded-full border border-gold/20 bg-background/50 px-3 py-1 text-xs font-sans text-gold-soft">
            {ayanaName}
          </span>
        </div>

        <div>
          <h3 className="font-deva text-3xl font-bold text-gold-gradient sm:text-4xl">
            {activeRashi.sanskritName} • {activeRashi.englishName}
          </h3>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            Element: <span className="text-gold-soft">{activeRashi.element}</span> • Solar Month:{" "}
            <span className="text-gold-light">{activeRashi.solarMonthName}</span>
          </p>
        </div>

        {/* Progress bar in active Rashi */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Rashi Progress (Solar Month Elapsed):</span>
            <span className="font-mono text-gold-light">
              {elapsedInRashi.toFixed(2)}° / 30.00° (Day ~{Math.floor(elapsedInRashi) + 1} of Month)
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gold/10">
            <div
              className="h-full rounded-full bg-gold-gradient transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, fractionElapsed * 100))}%` }}
            />
          </div>
        </div>

        {/* Longitude Comparison */}
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-gold/15 bg-gold/5 p-2.5">
            <span className="text-muted-foreground">Nirayana (Sidereal Sun): </span>
            <span className="font-mono font-bold text-gold-light">
              {sunSiderealLongitudeDeg.toFixed(3)}°
            </span>
          </div>
          <div className="rounded-lg border border-gold/15 bg-gold/5 p-2.5">
            <span className="text-muted-foreground">Sayana (Tropical Sun): </span>
            <span className="font-mono font-bold text-gold-soft">
              {sunTropicalLongitudeDeg.toFixed(3)}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
