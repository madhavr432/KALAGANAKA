/**
 * SolarOrbitScene.tsx
 * Interactive 3D visualization of Earth's annual revolution around the Sun.
 * Illustrates:
 * 1. Central radiant Sun emitting physical light.
 * 2. Elliptical orbit with Perihelion (~Jan 3) and Aphelion (~Jul 4).
 * 3. Earth globe at current date with day/night terminator and 23.44° axial tilt.
 * 4. Constant axial tilt orientation in space (pointing towards Polaris).
 * 5. Interactive Equinox and Solstice event markers.
 * 6. Graceful 2D Canvas fallback if WebGL fails.
 */

import React, { useRef, useMemo, useEffect, useState, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { installR3fSafety } from "../../timekeeping/scenes/r3fSafety";
import { ASTRONOMICAL_STATIONS } from "../constants/solarConstants";
import { AstronomicalStationEvent, SolarCalculatedValues } from "../types/solarCalendar";
import { RotateCcw, AlertTriangle, Compass, Sun as SunIcon } from "lucide-react";

installR3fSafety();

interface SolarOrbitSceneProps {
  solarValues: SolarCalculatedValues;
  selectedDate: string;
  isPlaying?: boolean;
  playbackSpeed?: number;
  onSelectStation: (station: AstronomicalStationEvent) => void;
  cameraResetTrigger: number;
}

// Visual orbital parameters
const ORBIT_SEMI_MAJOR = 8.5;
const VISUAL_ECCENTRICITY = 0.07;
const AXIAL_TILT_RAD = (23.43929 * Math.PI) / 180; // 23.44°

export const SolarOrbitScene = React.memo(function SolarOrbitScene({
  solarValues,
  selectedDate,
  isPlaying = false,
  playbackSpeed = 5,
  onSelectStation,
  cameraResetTrigger,
}: SolarOrbitSceneProps) {
  const [webglError, setWebglError] = useState(false);

  if (webglError) {
    return (
      <SolarOrbit2DFallback
        solarValues={solarValues}
        selectedDate={selectedDate}
        onSelectStation={onSelectStation}
      />
    );
  }

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-gold/25 bg-[#060a12] shadow-2xl sm:h-[480px] lg:h-[520px]">
      <CanvasErrorBoundary onError={() => setWebglError(true)}>
        <Canvas
          camera={{ position: [0, 18, 22], fov: 42 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#060a12"]} />

          {/* Camera Controller with reset support */}
          <CameraController resetTrigger={cameraResetTrigger} />

          {/* Celestial Lights */}
          <ambientLight intensity={0.25} color="#cbd5e1" />
          <pointLight
            position={[0, 0, 0]}
            intensity={4.5}
            distance={50}
            decay={1.5}
            color="#fff8db"
          />

          {/* Deep Space Starfield & Subtle Ecliptic Grid */}
          <SpaceBackground />
          <EclipticPlaneGrid />

          {/* Central Sun */}
          <SunCenter />

          {/* Earth's Orbit Path */}
          <OrbitalPath />

          {/* Perihelion & Aphelion Markers */}
          <ApsidesMarkers />

          {/* Equinox & Solstice Markers */}
          {ASTRONOMICAL_STATIONS.filter(
            (s) => s.id.includes("equinox") || s.id.includes("solstice"),
          ).map((station) => (
            <StationMarker
              key={station.id}
              station={station}
              onSelect={() => onSelectStation(station)}
              isActive={solarValues.activeStation?.id === station.id && solarValues.isNearStation}
            />
          ))}

          {/* 3D Earth Globe with Day/Night Terminator and Axial Tilt */}
          <EarthGlobe
            position={[solarValues.earthOrbitX, 0, solarValues.earthOrbitZ]}
            solarValues={solarValues}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
          />
        </Canvas>
      </CanvasErrorBoundary>

      {/* Floating Orbital Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex flex-wrap gap-2 text-[10px] text-muted-foreground bg-[#0a101d]/85 p-2 rounded-xl border border-gold/20 backdrop-blur-sm sm:text-xs">
        <span className="flex items-center gap-1.5 text-amber-200">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span>Central Sun (सूर्य)</span>
        </span>
        <span className="flex items-center gap-1.5 text-sky-200">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          <span>Earth (भू-मण्डल) • 23.44° Fixed Tilt</span>
        </span>
        <span className="flex items-center gap-1.5 text-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Equinoxes & Solstices</span>
        </span>
      </div>

      {/* Tilt Notice Badge */}
      <div className="pointer-events-none absolute top-3 right-3 z-10 rounded-lg border border-gold/25 bg-[#0a101d]/90 px-3 py-1.5 text-right font-sans text-[11px] text-gold-light backdrop-blur-sm shadow-lg">
        <span className="block font-semibold text-gold">Axial Tilt: 23.44° (अक्षीय झुकाव)</span>
        <span className="text-[10px] text-muted-foreground">
          Orientation constant toward Polaris (ध्रुव तारा)
        </span>
      </div>
    </div>
  );
});

/** Camera Controller handling reset camera orientation. */
function CameraController({ resetTrigger }: { resetTrigger: number }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(0, 18, 22);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetTrigger]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      minDistance={7}
      maxDistance={35}
      maxPolarAngle={Math.PI / 2 + 0.05} // Keep slightly above or at orbital plane
      dampingFactor={0.05}
    />
  );
}

/** Central Sun with emissive photosphere and radiant corona. */
function SunCenter() {
  const coronaRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (coronaRef.current) {
      coronaRef.current.rotation.y += delta * 0.15;
    }
    if (flareRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.04;
      flareRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sun Photosphere Sphere */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#ffcc33" />
      </mesh>

      {/* Corona Inner Glow */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[1.35, 32, 32]} />
        <meshBasicMaterial color="#ffa500" transparent opacity={0.35} side={THREE.BackSide} />
      </mesh>

      {/* Outer Atmospheric Corona Ring with subtle pulsing flare */}
      <mesh ref={flareRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.25, 2.5, 32]} />
        <meshBasicMaterial color="#ffb703" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>

      {/* Sun Center HTML Label */}
      <Html distanceFactor={22} position={[0, 1.7, 0]} center>
        <div className="pointer-events-none select-none rounded bg-[#090e18]/85 px-1.5 py-0.5 text-center font-deva text-[10px] font-bold text-amber-300 border border-amber-400/30 whitespace-nowrap shadow">
          सूर्य (The Sun)
        </div>
      </Html>
    </group>
  );
}

/** Elliptical Orbital Path of Earth around the Sun. */
function OrbitalPath() {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r =
        ORBIT_SEMI_MAJOR *
        ((1 - VISUAL_ECCENTRICITY * VISUAL_ECCENTRICITY) /
          (1 + VISUAL_ECCENTRICITY * Math.cos(angle - 0.2)));
      pts.push([-r * Math.cos(angle), 0, -r * Math.sin(angle)]);
    }
    return pts;
  }, []);

  return (
    <group>
      <Line points={points} color="#e5c07b" lineWidth={1.5} transparent opacity={0.5} />
      {/* Direction Arrows on Orbit */}
      <OrbitDirectionMarker angleRad={Math.PI / 4} />
      <OrbitDirectionMarker angleRad={(3 * Math.PI) / 4} />
      <OrbitDirectionMarker angleRad={(5 * Math.PI) / 4} />
      <OrbitDirectionMarker angleRad={(7 * Math.PI) / 4} />
    </group>
  );
}

function OrbitDirectionMarker({ angleRad }: { angleRad: number }) {
  const pos = useMemo<[number, number, number]>(() => {
    const r = ORBIT_SEMI_MAJOR;
    return [-r * Math.cos(angleRad), 0, -r * Math.sin(angleRad)];
  }, [angleRad]);

  return (
    <mesh position={pos} rotation={[0, -angleRad + Math.PI / 2, 0]}>
      <coneGeometry args={[0.12, 0.35, 8]} />
      <meshBasicMaterial color="#f6ad55" />
    </mesh>
  );
}

/** Perihelion and Aphelion Markers on Orbit. */
function ApsidesMarkers() {
  // Perihelion (~Jan 3, nearest to Sun)
  const periPos: [number, number, number] = [
    -ORBIT_SEMI_MAJOR * (1 - VISUAL_ECCENTRICITY) * Math.cos(4.93),
    0,
    -ORBIT_SEMI_MAJOR * (1 - VISUAL_ECCENTRICITY) * Math.sin(4.93),
  ];

  // Aphelion (~Jul 4, furthest from Sun)
  const aphPos: [number, number, number] = [
    -ORBIT_SEMI_MAJOR * (1 + VISUAL_ECCENTRICITY) * Math.cos(1.79),
    0,
    -ORBIT_SEMI_MAJOR * (1 + VISUAL_ECCENTRICITY) * Math.sin(1.79),
  ];

  return (
    <group>
      <group position={periPos}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <Html distanceFactor={22} position={[0, -0.4, 0]} center>
          <div className="pointer-events-none select-none rounded bg-[#090e18]/80 px-1 py-0.5 text-[9px] text-amber-200 border border-amber-500/20 whitespace-nowrap">
            Perihelion (~Jan 3: 147.1M km)
          </div>
        </Html>
      </group>

      <group position={aphPos}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <Html distanceFactor={22} position={[0, -0.4, 0]} center>
          <div className="pointer-events-none select-none rounded bg-[#090e18]/80 px-1 py-0.5 text-[9px] text-sky-200 border border-sky-500/20 whitespace-nowrap">
            Aphelion (~Jul 4: 152.1M km)
          </div>
        </Html>
      </group>
    </group>
  );
}

/** Equinox & Solstice Event Markers along the Orbit. */
function StationMarker({
  station,
  onSelect,
  isActive,
}: {
  station: AstronomicalStationEvent;
  onSelect: () => void;
  isActive: boolean;
}) {
  const rad = (station.tropicalLongitudeDeg * Math.PI) / 180;
  const pos: [number, number, number] = [
    -ORBIT_SEMI_MAJOR * Math.cos(rad),
    0,
    -ORBIT_SEMI_MAJOR * Math.sin(rad),
  ];

  return (
    <group position={pos}>
      {/* Vertical post connecting orbital plane to flag */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshBasicMaterial color={isActive ? "#34d399" : "#60a5fa"} />
      </mesh>

      {/* Clickable Marker Node */}
      <mesh position={[0, 0.8, 0]} onClick={onSelect}>
        <sphereGeometry args={[isActive ? 0.22 : 0.16, 16, 16]} />
        <meshBasicMaterial color={isActive ? "#10b981" : "#3b82f6"} />
      </mesh>

      {/* Marker HTML Label Badge */}
      <Html distanceFactor={20} position={[0, 1.25, 0]} center>
        <button
          onClick={onSelect}
          className={`flex flex-col items-center rounded-lg px-2 py-1 text-center transition-all shadow-lg ${
            isActive
              ? "bg-emerald-950/95 text-emerald-200 border-2 border-emerald-400 scale-110 ring-2 ring-emerald-500/40"
              : "bg-[#0b1220]/90 text-slate-200 border border-gold/30 hover:border-gold hover:text-amber-200 hover:scale-105"
          }`}
        >
          <span className="font-deva text-[10px] font-bold leading-tight whitespace-nowrap">
            {station.sanskritName.split(" ")[0]}
          </span>
          <span className="text-[9px] font-sans text-muted-foreground whitespace-nowrap">
            {station.approximateDate}
          </span>
        </button>
      </Html>
    </group>
  );
}

/**
 * 3D Earth Globe with Day/Night Illumination Terminator & 23.44° Axial Tilt.
 * The rotational axis is permanently tilted in space towards Polaris (constant direction).
 */
function EarthGlobe({
  position,
  solarValues,
  isPlaying = false,
  playbackSpeed = 1,
}: {
  position: [number, number, number];
  solarValues: SolarCalculatedValues;
  isPlaying?: boolean;
  playbackSpeed?: number;
}) {
  const earthRadius = 0.55;
  const earthSpinRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (earthSpinRef.current) {
      // Axial diurnal spin: faster during playback, smooth continuous gentle spin when paused
      const spinSpeed = isPlaying ? Math.max(1.8, playbackSpeed * 0.75) : 0.35;
      earthSpinRef.current.rotation.y += delta * spinSpeed;
    }
  });

  return (
    <group position={position}>
      {/* Sun-pointing Vector (light rays from central Sun) */}
      <Line
        points={[
          [0, 0, 0],
          [-position[0], -position[1], -position[2]],
        ]}
        color="#ffd166"
        lineWidth={1}
        transparent
        opacity={0.25}
        dashed
      />

      {/* Earth Tilted Subtree (tilted by 23.44° towards +Z, constant orientation) */}
      <group rotation={[AXIAL_TILT_RAD, 0, 0]}>
        {/* Rotational Axis passing through North and South Poles */}
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, earthRadius * 2.8, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* North Celestial Pole Arrow / Marker */}
        <mesh position={[0, earthRadius * 1.45, 0]}>
          <coneGeometry args={[0.08, 0.2, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Equator Ring on Earth */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[earthRadius * 1.01, earthRadius * 1.06, 32]} />
          <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>

        {/* Spinning Earth Globe (Ocean sphere + Continents) */}
        <group ref={earthSpinRef}>
          {/* Earth Physical Sphere Lit by the Central Sun PointLight */}
          <mesh receiveShadow castShadow>
            <sphereGeometry args={[earthRadius, 32, 32]} />
            <meshStandardMaterial
              color="#1e3a8a" // Ocean blue
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Procedural Continent Landmasses (Layered green-brown meshes) */}
          <EarthContinents radius={earthRadius} />
        </group>
      </group>

      {/* Earth Current Date Floating Label */}
      <Html distanceFactor={18} position={[0, earthRadius + 0.9, 0]} center>
        <div className="pointer-events-none select-none rounded-lg bg-[#070d18]/95 px-2.5 py-1 text-center font-sans text-[11px] text-amber-100 border border-gold/40 shadow-xl whitespace-nowrap">
          <div className="font-deva font-bold text-gold-light">
            पृथ्वी (Earth) • {solarValues.currentRashi.sanskritName.split(" ")[0]}{" "}
            {solarValues.solarDayInMonth}
          </div>
          <div className="text-[10px] text-slate-300 font-mono">
            {solarValues.sunTropicalLongitudeDeg.toFixed(1)}° Trop •{" "}
            {solarValues.sunSiderealLongitudeDeg.toFixed(1)}° Sid
          </div>
        </div>
      </Html>
    </group>
  );
}

/** Procedural Continent Shapes across Earth sphere. */
function EarthContinents({ radius }: { radius: number }) {
  // Simple stylized patches on the globe for educational visual grounding
  return (
    <group>
      {/* Eurasia / Africa patch */}
      <mesh position={[0, radius * 0.4, radius * 0.8]} rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[radius * 0.45, 12, 12]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
      </mesh>
      {/* Americas patch */}
      <mesh position={[0, radius * 0.3, -radius * 0.8]} rotation={[-0.3, 0, 0]}>
        <sphereGeometry args={[radius * 0.4, 12, 12]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
      </mesh>
      {/* Polar Ice Caps */}
      <mesh position={[0, radius * 0.94, 0]}>
        <sphereGeometry args={[radius * 0.25, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      <mesh position={[0, -radius * 0.94, 0]}>
        <sphereGeometry args={[radius * 0.25, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Subtle Ecliptic Reference Plane Grid. */
function EclipticPlaneGrid() {
  return (
    <group position={[0, -0.05, 0]}>
      <gridHelper args={[24, 24, "#2a3b5c", "#141e30"]} />
    </group>
  );
}

/** Deep Space Starfield Background. */
function SpaceBackground() {
  const starsPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 400; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const dist = 45 + Math.random() * 10;
      pts.push([
        dist * Math.sin(phi) * Math.cos(theta),
        dist * Math.sin(phi) * Math.sin(theta),
        dist * Math.cos(phi),
      ]);
    }
    return pts;
  }, []);

  return (
    <group>
      {starsPoints.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#ffd166" : "#cbd5e1"} />
        </mesh>
      ))}
    </group>
  );
}

/** Error Boundary for WebGL initialization failure. */
class CanvasErrorBoundary extends Component<
  { onError: () => void; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("SolarOrbitScene: WebGL rendering failed, falling back to 2D Canvas.", error);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/**
 * 2D Canvas Fallback Component.
 * Displays high-contrast orbital geometry, Sun, Earth with axial tilt, and equinox/solstice markers.
 */
function SolarOrbit2DFallback({
  solarValues,
  selectedDate,
  onSelectStation,
}: {
  solarValues: SolarCalculatedValues;
  selectedDate: string;
  onSelectStation: (station: AstronomicalStationEvent) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const rx = width * 0.38;
    const ry = height * 0.32;

    // Clear background
    ctx.fillStyle = "#060a12";
    ctx.fillRect(0, 0, width, height);

    // Ecliptic Orbit Ellipse
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(229, 192, 123, 0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Central Sun
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#ffcc33";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#fef3c7";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("सूर्य (Sun)", cx, cy + 32);

    // Station Markers
    ASTRONOMICAL_STATIONS.filter(
      (s) => s.id.includes("equinox") || s.id.includes("solstice"),
    ).forEach((st) => {
      const rad = (st.tropicalLongitudeDeg * Math.PI) / 180;
      const sx = cx - rx * Math.cos(rad);
      const sy = cy - ry * Math.sin(rad);

      ctx.beginPath();
      ctx.arc(sx, sy, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "10px sans-serif";
      ctx.fillText(st.sanskritName.split(" ")[0], sx, sy - 10);
    });

    // Earth Position
    const earthRad = (solarValues.sunTropicalLongitudeDeg * Math.PI) / 180;
    const ex = cx - rx * Math.cos(earthRad);
    const ey = cy - ry * Math.sin(earthRad);

    // Earth Sun-line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = "rgba(255, 209, 102, 0.3)";
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Earth Body
    ctx.beginPath();
    ctx.arc(ex, ey, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#2563eb";
    ctx.fill();

    // Axial tilt line (23.44°)
    ctx.beginPath();
    ctx.moveTo(ex - 8, ey + 18);
    ctx.lineTo(ex + 8, ey - 18);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#fef3c7";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText(`Earth (${selectedDate})`, ex, ey + 24);
  }, [solarValues, selectedDate]);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-gold/25 bg-[#060a12] p-4 flex flex-col items-center justify-center">
      <div className="absolute top-3 left-3 flex items-center gap-2 rounded bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs text-amber-300">
        <AlertTriangle className="h-4 w-4" />
        <span>2D Fallback Mode Active (WebGL Unavailable)</span>
      </div>
      <canvas ref={canvasRef} width={800} height={420} className="w-full h-full max-w-3xl" />
    </div>
  );
}
