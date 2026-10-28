import React from "react";
import { RASHIS } from "../saur-panchang/RashiSolarWheel";

export interface PlanetVisualItem {
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;
  siderealLongitudeDeg: number;
  tropicalLongitudeDeg: number;
  latitudeDeg: number;
  distanceAu: number;
  distanceKm: number;
}

interface CelestialZodiacSkyMapProps {
  planets: PlanetVisualItem[];
  selectedPlanetName: string | null;
  onSelectPlanet: (name: string) => void;
}

export function CelestialZodiacSkyMap({
  planets,
  selectedPlanetName,
  onSelectPlanet,
}: CelestialZodiacSkyMapProps) {
  const cx = 200;
  const cy = 200;
  const outerR = 175;
  const innerR = 140;
  const planetTrackR = 110;

  return (
    <div className="flex flex-col items-center rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
      <div className="flex w-full items-center justify-between border-b border-gold/15 pb-3 mb-2">
        <h3 className="font-deva text-lg font-semibold text-gold">
          राशि-नक्षत्र खगोलीय चक्र (Celestial Zodiac & Graha Positions)
        </h3>
        <span className="text-[11px] font-sans text-muted-foreground">
          Geocentric Sidereal Ecliptic Projection
        </span>
      </div>

      {/* SVG Sky Map */}
      <div className="relative flex items-center justify-center p-2">
        <svg
          viewBox="0 0 400 400"
          className="h-80 w-80 sm:h-96 sm:w-96 drop-shadow-[0_0_20px_rgba(245,158,11,0.15)] select-none"
        >
          <defs>
            <radialGradient id="centerSpace" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0b0f19" stopOpacity="1" />
              <stop offset="80%" stopColor="#030712" stopOpacity="1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Central Space Background */}
          <circle
            cx={cx}
            cy={cy}
            r={outerR}
            fill="url(#centerSpace)"
            stroke="rgba(245, 158, 11, 0.3)"
            strokeWidth="1.5"
          />
          <circle
            cx={cx}
            cy={cy}
            r={innerR}
            fill="none"
            stroke="rgba(245, 158, 11, 0.2)"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
          <circle
            cx={cx}
            cy={cy}
            r={planetTrackR}
            fill="none"
            stroke="rgba(245, 158, 11, 0.15)"
            strokeWidth="0.8"
          />

          {/* Earth at the center */}
          <circle cx={cx} cy={cy} r="18" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r="12" fill="#2563eb" />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="9"
            fill="#e0f2fe"
            fontWeight="bold"
          >
            भू (Earth)
          </text>

          {/* 12 Rashis Sectors */}
          {RASHIS.map((r, i) => {
            const angleDeg = i * 30 - 90;
            const rad = (angleDeg * Math.PI) / 180;
            const x1 = cx + innerR * Math.cos(rad);
            const y1 = cy + innerR * Math.sin(rad);
            const x2 = cx + outerR * Math.cos(rad);
            const y2 = cy + outerR * Math.sin(rad);

            const midAngle = angleDeg + 15;
            const midRad = (midAngle * Math.PI) / 180;
            const lx = cx + ((innerR + outerR) / 2) * Math.cos(midRad);
            const ly = cy + ((innerR + outerR) / 2) * Math.sin(midRad);

            return (
              <g key={r.index}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(245, 158, 11, 0.25)"
                  strokeWidth="1"
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="11"
                  fill="rgba(253, 230, 138, 0.85)"
                  fontWeight="bold"
                >
                  {r.symbol}
                </text>
              </g>
            );
          })}

          {/* 27 Nakshatras Subtle Tick Marks along Inner Ring */}
          {Array.from({ length: 27 }).map((_, i) => {
            const angleDeg = i * (360 / 27) - 90;
            const rad = (angleDeg * Math.PI) / 180;
            const tx1 = cx + (innerR - 6) * Math.cos(rad);
            const ty1 = cy + (innerR - 6) * Math.sin(rad);
            const tx2 = cx + innerR * Math.cos(rad);
            const ty2 = cy + innerR * Math.sin(rad);
            return (
              <line
                key={i}
                x1={tx1}
                y1={ty1}
                x2={tx2}
                y2={ty2}
                stroke="rgba(217, 119, 6, 0.4)"
                strokeWidth="0.8"
              />
            );
          })}

          {/* 7 Classical Grahas mapped along ecliptic */}
          {planets.map((planet, idx) => {
            const angleDeg = planet.siderealLongitudeDeg - 90;
            const rad = (angleDeg * Math.PI) / 180;

            // Stagger radius slightly if two planets are very close
            const staggeredR = planetTrackR + ((idx % 3) - 1) * 14;
            const px = cx + staggeredR * Math.cos(rad);
            const py = cy + staggeredR * Math.sin(rad);

            const isSelected = selectedPlanetName === planet.name;

            return (
              <g
                key={planet.name}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onSelectPlanet(planet.name)}
              >
                {/* Ray line from Earth to Planet */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={px}
                  y2={py}
                  stroke={isSelected ? planet.color : "rgba(255,255,255,0.1)"}
                  strokeWidth={isSelected ? 1.5 : 0.8}
                  strokeDasharray={isSelected ? "none" : "2,2"}
                />

                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={px}
                    cy={py}
                    r="15"
                    fill="none"
                    stroke={planet.color}
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                )}

                {/* Planet Body */}
                <circle
                  cx={px}
                  cy={py}
                  r="9"
                  fill={planet.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Planet Label */}
                <text
                  x={px}
                  y={py - 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#fef08a"
                  fontWeight="bold"
                  className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                >
                  {planet.sanskritName.split(" ")[0]} ({planet.symbol})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 text-center text-xs text-muted-foreground">
        Click on any planet to inspect coordinates, apparent distance, and traditional astronomical
        comparisons.
      </div>
    </div>
  );
}
