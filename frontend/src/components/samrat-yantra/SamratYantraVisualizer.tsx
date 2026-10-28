import React, { useId, useState } from "react";
import { type ShadowGeometry } from "@/services/samrat-yantra-math";
import { Compass, Info, Moon, Sun as SunIcon, Eye } from "lucide-react";

interface SamratYantraVisualizerProps {
  shadowGeometry: ShadowGeometry;
  latitude: number;
  altitudeDeg: number;
  azimuthDeg: number;
  isSunUp: boolean;
  observatoryName: string;
}

export function SamratYantraVisualizer({
  shadowGeometry,
  latitude,
  altitudeDeg,
  azimuthDeg,
  isSunUp,
  observatoryName,
}: SamratYantraVisualizerProps) {
  const gradientId = useId();
  const [viewMode, setViewMode] = useState<"architectural" | "equatorial">("architectural");
  const [showGuide, setShowGuide] = useState(true);

  // Clamp latitude for visual stability (10° to 70°)
  const visualLat = Math.max(10, Math.min(65, latitude));
  const latRad = (visualLat * Math.PI) / 180;

  // Geometry for Architectural Side-Elevation & Quadrant Projection:
  // Base origin: (center X = 450, ground Y = 360)
  const originX = 450;
  const groundY = 360;
  const gnomonBaseLength = 260;
  const gnomonHeight = Math.tan(latRad) * gnomonBaseLength;
  const clampedHeight = Math.min(220, Math.max(70, gnomonHeight));
  const gnomonTopX = originX + gnomonBaseLength;
  const gnomonTopY = groundY - clampedHeight;

  // Quadrant scale radius (equinoctial wing arcs)
  const quadrantRadius = 240;

  // Sun visual placement in architectural view
  // altitude in [0, 90], azimuth in [0, 360]
  const sunElevationAngleRad = (Math.max(0, altitudeDeg) * Math.PI) / 180;
  // If azimuth is East (<180), Sun is to the right in sky; if West (>180), to the left
  const sunHorizontalDirection = azimuthDeg <= 180 ? 1 : -1;
  const sunDistance = 280;
  const sunVisualX =
    originX + sunHorizontalDirection * Math.cos(sunElevationAngleRad) * sunDistance * 0.9;
  const sunVisualY = groundY - Math.sin(sunElevationAngleRad) * (sunDistance * 0.85 + 40);

  // Shadow projection angle on the equinoctial quadrant
  // Hour angle H runs from -90° (6 AM) to +90° (6 PM)
  const clampedHourAngle = Math.max(-90, Math.min(90, shadowGeometry.hourAngleDeg));

  // Western quadrant: H < 0 (forenoon). Arc extends to left.
  // Eastern quadrant: H > 0 (afternoon). Arc extends to right.
  // Arc angle from meridian (center):
  const shadowArcDeg = Math.abs(clampedHourAngle);

  // Coordinates on the curved quadrant scale
  // Scale center is midpoint of hypotenuse or gnomon root
  const scaleCenter = { x: originX, y: groundY - 40 };
  const shadowScaleAngleRad = ((90 - clampedHourAngle) * Math.PI) / 180;
  const shadowPointX = scaleCenter.x + quadrantRadius * Math.cos(shadowScaleAngleRad);
  const shadowPointY = scaleCenter.y - quadrantRadius * Math.sin(shadowScaleAngleRad) * 0.45;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-gold/25 bg-background/80 p-4 shadow-2xl backdrop-blur-md sm:p-6">
      {/* Header Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-deva text-xl text-gold-gradient sm:text-2xl">
              यन्त्र-प्रतिरूप (Instrument Visualization)
            </span>
            <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-sans text-xs font-medium text-gold-soft">
              {viewMode === "architectural" ? "Isometric Elevation" : "Equinoctial Dial Plane"}
            </span>
          </div>
          <p className="mt-0.5 font-sans text-xs text-muted-foreground">
            {observatoryName} • Gnomon Inclination $\phi$ = {latitude.toFixed(2)}° N
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setViewMode((m) => (m === "architectural" ? "equatorial" : "architectural"))
            }
            className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/5 px-3 py-1.5 font-sans text-xs font-medium text-gold transition-colors hover:bg-gold/15"
            aria-label="Toggle visualizer view angle"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>
              Switch to {viewMode === "architectural" ? "Equinoctial Dial" : "Side Elevation"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowGuide((g) => !g)}
            className="flex items-center gap-1 rounded-lg border border-gold/20 bg-background/60 px-2.5 py-1.5 font-sans text-xs text-gold-soft hover:text-gold"
            aria-label="Toggle diagram legend guide"
          >
            <Info className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Legend</span>
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <div className="relative aspect-[16/10] w-full min-h-[340px] max-h-[560px] select-none rounded-lg bg-gradient-to-b from-background via-black/40 to-background/90 p-2">
        <svg
          viewBox="0 0 900 500"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Interactive Samrat Yantra visualization at ${observatoryName}. Sun altitude ${altitudeDeg.toFixed(1)} degrees, azimuth ${azimuthDeg.toFixed(1)} degrees.`}
        >
          <defs>
            {/* Sun Glow Filter */}
            <filter id={`sun-glow-${gradientId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur1" />
              <feGaussianBlur stdDeviation="16" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear gradient for stone masonry */}
            <linearGradient id={`stone-gradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.35 0.05 70)" />
              <stop offset="50%" stopColor="oklch(0.24 0.03 65)" />
              <stop offset="100%" stopColor="oklch(0.18 0.02 60)" />
            </linearGradient>

            {/* Gold Edge Gradient */}
            <linearGradient id={`gold-edge-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--gold-soft)" />
              <stop offset="50%" stopColor="var(--gold)" />
              <stop offset="100%" stopColor="var(--gold-light)" />
            </linearGradient>

            {/* Shadow overlay gradient */}
            <linearGradient id={`shadow-fill-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 0, 0, 0.75)" />
              <stop offset="100%" stopColor="rgba(10, 5, 2, 0.85)" />
            </linearGradient>
          </defs>

          {/* Background Stars / Cosmic backdrop grid */}
          <g className="opacity-35" aria-hidden>
            <circle cx="120" cy="80" r="1.5" fill="var(--gold-light)" />
            <circle cx="280" cy="50" r="1" fill="var(--gold-soft)" />
            <circle cx="680" cy="70" r="1.8" fill="var(--gold-light)" />
            <circle cx="820" cy="110" r="1.2" fill="var(--gold-soft)" />
            <circle cx="450" cy="40" r="2.2" fill="var(--gold)" />
            <text
              x="450"
              y="26"
              textAnchor="middle"
              fill="var(--gold-soft)"
              fontSize="11"
              fontFamily="var(--font-serif)"
              letterSpacing="1"
            >
              ध्रुवतारा (CELESTIAL NORTH POLE)
            </text>
            {/* North Pole reference axis line */}
            <line
              x1={originX}
              y1={groundY}
              x2={originX}
              y2={45}
              stroke="var(--gold-soft)"
              strokeWidth="0.8"
              strokeDasharray="3 4"
              opacity="0.4"
            />
          </g>

          {viewMode === "architectural" ? (
            /* ================= ARCHITECTURAL ELEVATION VIEW ================= */
            <g id="architectural-view">
              {/* Ground Horizon / Plinth Foundation */}
              <line
                x1="80"
                y1={groundY}
                x2="820"
                y2={groundY}
                stroke="var(--gold-soft)"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <rect
                x="140"
                y={groundY}
                width="620"
                height="45"
                fill={`url(#stone-gradient-${gradientId})`}
                stroke="var(--gold)"
                strokeWidth="0.8"
                opacity="0.85"
                rx="3"
              />
              <text
                x="160"
                y={groundY + 28}
                fill="var(--gold-soft)"
                fontSize="12"
                fontFamily="var(--font-sans)"
                opacity="0.7"
              >
                दक्षिण (South)
              </text>
              <text
                x="710"
                y={groundY + 28}
                fill="var(--gold-soft)"
                fontSize="12"
                fontFamily="var(--font-sans)"
                opacity="0.7"
              >
                उत्तर (North)
              </text>

              {/* Equinoctial Quadrants (Curved Wing Arcs on East & West) */}
              {/* Western Quadrant (Forenoon / पूर्वाह्न) */}
              <path
                d={`M ${originX - 220} ${groundY} A ${quadrantRadius} ${quadrantRadius * 0.45} 0 0 1 ${originX} ${groundY - 140}`}
                fill="none"
                stroke="var(--gold-soft)"
                strokeWidth="4"
                strokeDasharray="4 2"
                opacity="0.75"
              />
              {/* Eastern Quadrant (Afternoon / अपराह्न) */}
              <path
                d={`M ${originX} ${groundY - 140} A ${quadrantRadius} ${quadrantRadius * 0.45} 0 0 1 ${originX + 220} ${groundY}`}
                fill="none"
                stroke="var(--gold-soft)"
                strokeWidth="4"
                strokeDasharray="4 2"
                opacity="0.75"
              />

              {/* Quadrant Calibrated Tick Marks */}
              {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((deg) => {
                const rad = ((90 - deg) * Math.PI) / 180;
                const tx = originX + quadrantRadius * Math.cos(rad);
                const ty = groundY - 40 - quadrantRadius * Math.sin(rad) * 0.45;
                const hourLabel = 12 + deg / 15;
                return (
                  <g key={deg} opacity="0.7">
                    <circle cx={tx} cy={ty} r="2" fill="var(--gold)" />
                    <text
                      x={tx}
                      y={ty + 14}
                      fill="var(--gold-soft)"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="var(--font-sans)"
                    >
                      {hourLabel === 12 ? "12h (Noon)" : `${hourLabel}h`}
                    </text>
                  </g>
                );
              })}

              {/* The Great Triangular Gnomon Wall (फलक / Phalak) */}
              <polygon
                points={`${originX},${groundY} ${gnomonTopX},${groundY} ${gnomonTopX},${gnomonTopY}`}
                fill={`url(#stone-gradient-${gradientId})`}
                stroke="var(--gold)"
                strokeWidth="1.8"
                className="drop-shadow-lg"
              />

              {/* Hypothetical Internal Staircase lines typical of Jai Singh's design */}
              <line
                x1={originX + 50}
                y1={groundY}
                x2={gnomonTopX}
                y2={gnomonTopY + 30}
                stroke="var(--gold)"
                strokeWidth="0.6"
                strokeDasharray="2 3"
                opacity="0.4"
              />

              {/* Hypotenuse Gnomon Edge (points to Celestial Pole) */}
              <line
                x1={originX}
                y1={groundY}
                x2={gnomonTopX}
                y2={gnomonTopY}
                stroke={`url(#gold-edge-${gradientId})`}
                strokeWidth="3.5"
              />

              {/* Latitude Angle Arc Indication */}
              <path
                d={`M ${originX + 70} ${groundY} A 70 70 0 0 0 ${originX + 70 * Math.cos(latRad)} ${groundY - 70 * Math.sin(latRad)}`}
                fill="none"
                stroke="var(--gold-light)"
                strokeWidth="1.5"
              />
              <text
                x={originX + 85}
                y={groundY - 18}
                fill="var(--gold-light)"
                fontSize="12"
                fontFamily="var(--font-serif)"
                fontWeight="bold"
              >
                $\phi$ = {latitude.toFixed(1)}°
              </text>

              {/* Labels on the Instrument Components */}
              <text
                x={(originX + gnomonTopX) / 2 - 10}
                y={(groundY + gnomonTopY) / 2 - 12}
                fill="var(--gold)"
                fontSize="12"
                fontFamily="var(--font-deva)"
                transform={`rotate(${-visualLat}, ${(originX + gnomonTopX) / 2}, ${(groundY + gnomonTopY) / 2})`}
              >
                शंकु-फलक (Gnomon Edge)
              </text>

              {/* Active Shadow Representation */}
              {isSunUp ? (
                <g id="shadow-ray-group">
                  {/* Sun Disc */}
                  <g
                    transform={`translate(${sunVisualX}, ${sunVisualY})`}
                    filter={`url(#sun-glow-${gradientId})`}
                  >
                    <circle cx="0" cy="0" r="16" fill="var(--gold-light)" />
                    <circle cx="0" cy="0" r="24" fill="var(--gold)" opacity="0.35" />
                    {/* Solar Ray Corona */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <line
                        key={angle}
                        x1="0"
                        y1="0"
                        x2={28 * Math.cos((angle * Math.PI) / 180)}
                        y2={28 * Math.sin((angle * Math.PI) / 180)}
                        stroke="var(--gold-light)"
                        strokeWidth="1.5"
                        opacity="0.8"
                      />
                    ))}
                    <text
                      x="0"
                      y="-30"
                      fill="var(--gold-light)"
                      fontSize="11"
                      textAnchor="middle"
                      fontFamily="var(--font-serif)"
                      fontWeight="bold"
                    >
                      सूर्य (Sun: {altitudeDeg.toFixed(1)}°)
                    </text>
                  </g>

                  {/* Incident Sun Beam from Sun towards Gnomon Top */}
                  <line
                    x1={sunVisualX}
                    y1={sunVisualY}
                    x2={gnomonTopX}
                    y2={gnomonTopY}
                    stroke="var(--gold-light)"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />

                  {/* Cast Shadow along the Quadrant Scale */}
                  {shadowGeometry.quadrant !== "none" && (
                    <g>
                      {/* Shadow Beam from Hypotenuse Center to Scale Contact */}
                      <line
                        x1={(originX + gnomonTopX) / 2}
                        y1={(groundY + gnomonTopY) / 2}
                        x2={shadowPointX}
                        y2={shadowPointY}
                        stroke="rgba(255, 215, 0, 0.85)"
                        strokeWidth="2.5"
                        className="animate-pulse"
                      />

                      {/* Cast Shadow Contact Point on Scale */}
                      <circle
                        cx={shadowPointX}
                        cy={shadowPointY}
                        r="6"
                        fill="oklch(0.95 0.15 85)"
                        stroke="oklch(0.15 0.05 60)"
                        strokeWidth="2"
                      />

                      {/* Glow Ring */}
                      <circle
                        cx={shadowPointX}
                        cy={shadowPointY}
                        r="12"
                        fill="none"
                        stroke="var(--gold-light)"
                        strokeWidth="1"
                        opacity="0.6"
                      />

                      {/* Shadow Reading Banner Callout */}
                      <g transform={`translate(${shadowPointX}, ${shadowPointY - 32})`}>
                        <rect
                          x="-65"
                          y="-22"
                          width="130"
                          height="26"
                          rx="4"
                          fill="oklch(0.15 0.04 260 / 90%)"
                          stroke="var(--gold)"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="-5"
                          textAnchor="middle"
                          fill="var(--gold-light)"
                          fontSize="11"
                          fontFamily="var(--font-sans)"
                          fontWeight="bold"
                        >
                          छाया: {String(shadowGeometry.readingHours).padStart(2, "0")}:
                          {String(shadowGeometry.readingMinutes).padStart(2, "0")}:
                          {String(shadowGeometry.readingSeconds).padStart(2, "0")} LAT
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              ) : (
                /* Nighttime State Graphic */
                <g transform="translate(450, 180)" className="opacity-90">
                  <circle
                    cx="0"
                    cy="0"
                    r="42"
                    fill="oklch(0.2 0.03 260 / 60%)"
                    stroke="var(--gold-soft)"
                    strokeWidth="1"
                  />
                  <Moon className="h-8 w-8 text-gold-soft" x="-16" y="-20" />
                  <text
                    x="0"
                    y="32"
                    textAnchor="middle"
                    fill="var(--gold-soft)"
                    fontSize="13"
                    fontFamily="var(--font-deva)"
                  >
                    रात्रि काल — यन्त्र निष्क्रिय
                  </text>
                  <text
                    x="0"
                    y="48"
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize="10"
                    fontFamily="var(--font-sans)"
                  >
                    Sun below horizon • No shadow cast
                  </text>
                </g>
              )}
            </g>
          ) : (
            /* ================= EQUINOCTIAL DIAL PLANE VIEW ================= */
            <g id="equatorial-view" transform="translate(450, 260)">
              {/* Circular Dial Face representing the plane parallel to Earth's Equator */}
              <circle
                cx="0"
                cy="0"
                r="180"
                fill="none"
                stroke="var(--gold-soft)"
                strokeWidth="1.2"
                opacity="0.3"
              />
              <circle
                cx="0"
                cy="0"
                r="160"
                fill="oklch(0.14 0.02 260 / 80%)"
                stroke="var(--gold)"
                strokeWidth="2"
              />

              {/* Equinoctial Dial Quadrants */}
              {/* Hour & Ghati Scale Divisions (from 6h to 18h) */}
              {Array.from({ length: 25 }).map((_, i) => {
                // Each hour is 15°
                const h = 6 + i * 0.5;
                const angleDeg = (h - 12) * 15;
                const rad = (angleDeg * Math.PI) / 180;
                const innerR = h % 1 === 0 ? 135 : 145;
                const x1 = Math.sin(rad) * 160;
                const y1 = -Math.cos(rad) * 160;
                const x2 = Math.sin(rad) * innerR;
                const y2 = -Math.cos(rad) * innerR;

                return (
                  <g key={h}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--gold-soft)"
                      strokeWidth={h % 1 === 0 ? "1.5" : "0.8"}
                    />
                    {h % 1 === 0 && (
                      <text
                        x={Math.sin(rad) * 120}
                        y={-Math.cos(rad) * 120 + 4}
                        textAnchor="middle"
                        fill="var(--gold-light)"
                        fontSize="10"
                        fontFamily="var(--font-sans)"
                      >
                        {h}h
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Central Polar Axis Pin / Cross-section of Gnomon Edge */}
              <circle
                cx="0"
                cy="0"
                r="7"
                fill="var(--gold)"
                stroke="oklch(0.1 0.01 260)"
                strokeWidth="2"
              />
              <text
                x="0"
                y="24"
                textAnchor="middle"
                fill="var(--gold-soft)"
                fontSize="11"
                fontFamily="var(--font-deva)"
              >
                ध्रुव-दण्ड (Polar Gnomon Pin)
              </text>

              {/* Shadow Hand on the Equinoctial Face */}
              {isSunUp ? (
                <g>
                  {/* Shadow Line */}
                  {(() => {
                    const shadowRad = (shadowGeometry.hourAngleDeg * Math.PI) / 180;
                    const sx = Math.sin(shadowRad) * 155;
                    const sy = -Math.cos(shadowRad) * 155;
                    return (
                      <>
                        <line
                          x1="0"
                          y1="0"
                          x2={sx}
                          y2={sy}
                          stroke="oklch(0.9 0.18 85)"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <circle cx={sx} cy={sy} r="5" fill="var(--gold-light)" />
                      </>
                    );
                  })()}
                </g>
              ) : (
                <text
                  x="0"
                  y="-10"
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  fontSize="12"
                >
                  Nighttime — No shadow
                </text>
              )}

              {/* Labels for West / East Quadrants */}
              <text
                x="-120"
                y="80"
                textAnchor="middle"
                fill="var(--gold-soft)"
                fontSize="11"
                fontFamily="var(--font-deva)"
                opacity="0.8"
              >
                पश्चिमी कपाल (Western Arc - Forenoon)
              </text>
              <text
                x="120"
                y="80"
                textAnchor="middle"
                fill="var(--gold-soft)"
                fontSize="11"
                fontFamily="var(--font-deva)"
                opacity="0.8"
              >
                पूर्वी कपाल (Eastern Arc - Afternoon)
              </text>
            </g>
          )}
        </svg>

        {/* Real-time Indicator Badges overlayed on visualizer */}
        <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 rounded-md border border-gold/30 bg-background/90 px-2.5 py-1 text-gold-soft shadow backdrop-blur">
            {isSunUp ? (
              <SunIcon className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-blue-300" />
            )}
            <span className="font-semibold">{isSunUp ? "Daytime (दिन)" : "Night (रात्रि)"}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-gold/30 bg-background/90 px-2.5 py-1 text-gold-soft shadow backdrop-blur">
            <Compass className="h-3.5 w-3.5 text-gold" />
            <span>
              Alt: {altitudeDeg.toFixed(1)}° • Az: {azimuthDeg.toFixed(1)}°
            </span>
          </div>
        </div>

        {/* Quadrant Indicator overlay */}
        <div className="pointer-events-none absolute bottom-3 right-3 text-right">
          <span className="rounded-md border border-gold/30 bg-background/90 px-2.5 py-1 font-sans text-xs font-semibold text-gold shadow backdrop-blur">
            {shadowGeometry.quadrant === "western"
              ? "Western Scale (पूर्वाह्न / AM)"
              : shadowGeometry.quadrant === "eastern"
                ? "Eastern Scale (अपराह्न / PM)"
                : shadowGeometry.quadrant === "meridian"
                  ? "Meridian (मध्याह्न / Noon)"
                  : "Inactive"}
          </span>
        </div>
      </div>

      {/* Explanatory Legend / Guide (collapsible) */}
      {showGuide && (
        <div className="mt-4 rounded-lg border border-gold/15 bg-gold/5 p-3.5 text-xs text-gold-soft">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gold" />
              <div>
                <strong className="text-gold">शंकु फलक (Gnomon Hypothenuse):</strong>
                <p className="text-muted-foreground">
                  Points directly at the North Celestial Pole (ध्रुव). Its elevation equals local
                  latitude $\phi$ ({latitude.toFixed(2)}°).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />
              <div>
                <strong className="text-gold">सूर्य-किरण एवं छाया (Solar Shadow):</strong>
                <p className="text-muted-foreground">
                  The shadow cast across the equinoctial quadrant measures Local Apparent Solar Time
                  at 15° per hour (2.5 Ghatis/hour).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border border-gold bg-transparent" />
              <div>
                <strong className="text-gold">वृत्तांश कपाल (Equinoctial Quadrants):</strong>
                <p className="text-muted-foreground">
                  Two circular stone wings parallel to Earth's equator. Left quadrant reads before
                  noon; right quadrant reads after noon.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
