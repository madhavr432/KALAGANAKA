/**
 * Modern Astronomical Machine Scene (React Three Fiber).
 * A sleek, scientific 3D armillary/celestial instrument visualizing:
 * - Reference Horizon & Cardinal Directions (N, E, S, W)
 * - Celestial Meridian and Celestial Equator
 * - Solar Altitude and Azimuth Coordinate Vectors
 * - Independent OrbitControls and Camera Reset
 */

import React, { useRef, useMemo, useImperativeHandle, forwardRef, useState } from "react";
import "./r3fSafety";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Line, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { AstronomyEnvironment } from "./AstronomyEnvironment";
import { formatDegrees, getAzimuthDirection } from "../utils/angleFormatting";

export interface ModernSceneRef {
  resetCamera: () => void;
}

interface ModernTimeMachineSceneProps {
  altitudeDeg: number;
  altitudeRefractedDeg: number;
  azimuthDeg: number;
  latitude: number;
  isSunUp: boolean;
  className?: string;
}

export const ModernTimeMachineScene = forwardRef<ModernSceneRef, ModernTimeMachineSceneProps>(
  function ModernTimeMachineScene(
    { altitudeDeg, altitudeRefractedDeg, azimuthDeg, latitude, isSunUp, className = "" },
    ref,
  ) {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const [showCelestialEquator, setShowCelestialEquator] = useState(true);
    const [showAltitudeArc, setShowAltitudeArc] = useState(true);

    const defaultCameraPos: [number, number, number] = [8.5, 6.2, 8.5];
    const defaultTarget: [number, number, number] = [0, 0, 0];

    useImperativeHandle(ref, () => ({
      resetCamera: () => {
        if (controlsRef.current) {
          controlsRef.current.object.position.set(...defaultCameraPos);
          controlsRef.current.target.set(...defaultTarget);
          controlsRef.current.update();
        }
      },
    }));

    // Calculate Cartesian position of the Sun on the celestial sphere
    const { sunPos, groundProjPos, altitudeArcPoints, azimuthArcPoints } = useMemo(() => {
      const radius = 5.2;
      const altRad = (altitudeDeg * Math.PI) / 180;
      const azRad = (azimuthDeg * Math.PI) / 180;

      // In Three.js:
      // North = -Z, East = +X, South = +Z, West = -X
      const x = radius * Math.cos(altRad) * Math.sin(azRad);
      const y = radius * Math.sin(altRad);
      const z = -radius * Math.cos(altRad) * Math.cos(azRad);

      const sun: [number, number, number] = [x, y, z];
      const groundProj: [number, number, number] = [x, 0, z];

      // Generate points for the vertical altitude arc
      const altPoints: [number, number, number][] = [];
      const altSteps = 24;
      for (let i = 0; i <= altSteps; i++) {
        const stepAlt = (altRad * i) / altSteps;
        const px = radius * Math.cos(stepAlt) * Math.sin(azRad);
        const py = radius * Math.sin(stepAlt);
        const pz = -radius * Math.cos(stepAlt) * Math.cos(azRad);
        altPoints.push([px, py, pz]);
      }

      // Generate points for the horizontal azimuth arc (starting from North at [0, 0, -radius])
      const azPoints: [number, number, number][] = [];
      const azSteps = 36;
      const azArcRadius = 2.8;
      for (let i = 0; i <= azSteps; i++) {
        const stepAz = (azRad * i) / azSteps;
        const px = azArcRadius * Math.sin(stepAz);
        const pz = -azArcRadius * Math.cos(stepAz);
        azPoints.push([px, 0.02, pz]);
      }

      return {
        sunPos: sun,
        groundProjPos: groundProj,
        altitudeArcPoints: altPoints,
        azimuthArcPoints: azPoints,
      };
    }, [altitudeDeg, azimuthDeg]);

    // Celestial Equator ring tilt: tilted by (90 - latitude) degrees relative to horizon
    const equatorTiltRad = useMemo(() => {
      return ((90 - latitude) * Math.PI) / 180;
    }, [latitude]);

    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} className="w-full h-full">
          <PerspectiveCamera
            makeDefault
            fov={44}
            position={defaultCameraPos}
            near={0.1}
            far={150}
          />

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={3.5}
            maxDistance={25}
            target={defaultTarget}
          />

          {/* Background Stars */}
          <AstronomyEnvironment />

          {/* Neutral scientific ambient and key light */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 15, 10]} intensity={1.2} />

          {/* Group: Modern Astronomical Instrument */}
          <group name="modern-instrument">
            {/* 1. Reference Horizon Ring (Altitude 0°) */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[4.9, 5.2, 72]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Horizon Inner Disc (Day/Night dividing plane) */}
            <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[4.9, 64]} />
              <meshStandardMaterial color="#0f172a" transparent opacity={0.65} roughness={0.9} />
            </mesh>

            {/* 2. Cardinal Direction Markers */}
            <CardinalMarker
              position={[0, 0.1, -5.35]}
              label="N"
              sublabel="0° True North"
              color="#38bdf8"
            />
            <CardinalMarker
              position={[5.35, 0.1, 0]}
              label="E"
              sublabel="90° East"
              color="#fbbf24"
            />
            <CardinalMarker
              position={[0, 0.1, 5.35]}
              label="S"
              sublabel="180° South"
              color="#94a3b8"
            />
            <CardinalMarker
              position={[-5.35, 0.1, 0]}
              label="W"
              sublabel="270° West"
              color="#fbbf24"
            />

            {/* 3. Celestial Meridian Ring (North-Zenith-South Vertical Arc) */}
            <group rotation={[0, 0, 0]}>
              {/* Semicircle arc in Y-Z plane */}
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[5.2, 0.035, 16, 72, Math.PI]} />
                <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
              </mesh>
            </group>

            {/* 4. Celestial Equator Ring (Tilted by 90° - lat) */}
            {showCelestialEquator && (
              <group rotation={[equatorTiltRad, 0, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[5.2, 0.03, 16, 72]} />
                  <meshStandardMaterial
                    color="#d97706"
                    emissive="#b45309"
                    emissiveIntensity={0.6}
                    metalness={0.5}
                    roughness={0.4}
                  />
                </mesh>
              </group>
            )}

            {/* 5. Observer Platform & Zenith Pointer */}
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.5, 0.6, 0.1, 24]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Plumb Line to Zenith (+Y) */}
            <Line
              points={[
                [0, 0, 0],
                [0, 5.3, 0],
              ]}
              color="#38bdf8"
              lineWidth={1.5}
              dashed
              dashScale={2}
            />
            {/* Zenith Marker Pin */}
            <mesh position={[0, 5.3, 0]}>
              <octahedronGeometry args={[0.12]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>

            {/* 6. The Sun Marker in 3D Space */}
            <group position={sunPos}>
              {/* Glowing Sun Core */}
              <mesh>
                <sphereGeometry args={[0.3, 24, 24]} />
                <meshStandardMaterial
                  color={isSunUp ? "#fbbf24" : "#64748b"}
                  emissive={isSunUp ? "#f59e0b" : "#334155"}
                  emissiveIntensity={isSunUp ? 3.0 : 0.5}
                  roughness={0.1}
                />
              </mesh>
              {/* Outer Coronal Halo */}
              {isSunUp && (
                <mesh>
                  <sphereGeometry args={[0.5, 16, 16]} />
                  <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} wireframe />
                </mesh>
              )}
              {/* Floating 3D Tooltip with Real-time Coordinates */}
              <Html distanceFactor={12} position={[0, 0.55, 0]} center>
                <div className="pointer-events-none select-none rounded bg-background/90 px-2 py-1 text-center font-mono text-[10px] text-gold shadow-lg border border-gold/30 backdrop-blur-sm whitespace-nowrap">
                  <div>Alt: {formatDegrees(altitudeRefractedDeg, 1)}</div>
                  <div>
                    Az: {formatDegrees(azimuthDeg, 1)} ({getAzimuthDirection(azimuthDeg)})
                  </div>
                </div>
              </Html>
            </group>

            {/* 7. Collimated Solar Ray (Observer Center -> Sun) */}
            <Line
              points={[[0, 0, 0], sunPos]}
              color={isSunUp ? "#fbbf24" : "#475569"}
              lineWidth={2}
            />

            {/* 8. Vertical Altitude Drop Line (Sun -> Ground Projection) */}
            <Line
              points={[sunPos, groundProjPos]}
              color="#94a3b8"
              lineWidth={1}
              dashed
              dashScale={4}
            />

            {/* 9. Azimuth Ground Vector (Center -> Ground Projection) */}
            <Line points={[[0, 0.01, 0], groundProjPos]} color="#38bdf8" lineWidth={2} />

            {/* 10. Visual Altitude Arc */}
            {showAltitudeArc && altitudeArcPoints.length > 1 && (
              <Line points={altitudeArcPoints} color="#f59e0b" lineWidth={2.5} />
            )}

            {/* 11. Visual Azimuth Arc on Ground */}
            {azimuthArcPoints.length > 1 && (
              <Line points={azimuthArcPoints} color="#38bdf8" lineWidth={2} />
            )}
          </group>
        </Canvas>

        {/* Scientific Guides Toggle Overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2 text-[11px] bg-[#0c1322]/90 p-1.5 rounded-lg border border-gold/30 backdrop-blur-sm">
          <button
            onClick={() => setShowCelestialEquator((v) => !v)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              showCelestialEquator
                ? "bg-amber-500/30 text-amber-200 border border-amber-400/60 font-semibold shadow-sm"
                : "bg-black/40 text-slate-200 border border-gold/15 hover:text-amber-100 hover:border-gold/30"
            }`}
          >
            Celestial Equator
          </button>
          <button
            onClick={() => setShowAltitudeArc((v) => !v)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              showAltitudeArc
                ? "bg-sky-500/30 text-sky-200 border border-sky-400/60 font-semibold shadow-sm"
                : "bg-black/40 text-slate-200 border border-gold/15 hover:text-amber-100 hover:border-gold/30"
            }`}
          >
            Altitude Arc
          </button>
        </div>
      </div>
    );
  },
);

function CardinalMarker({
  position,
  label,
  sublabel,
  color,
}: {
  position: [number, number, number];
  label: string;
  sublabel: string;
  color: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Html distanceFactor={14} position={[0, 0.25, 0]} center>
        <div className="pointer-events-none select-none text-center leading-none">
          <span className="font-bold text-xs" style={{ color }}>
            {label}
          </span>
          <span className="block text-[9px] text-amber-100 font-medium whitespace-nowrap drop-shadow">
            {sublabel}
          </span>
        </div>
      </Html>
    </group>
  );
}
