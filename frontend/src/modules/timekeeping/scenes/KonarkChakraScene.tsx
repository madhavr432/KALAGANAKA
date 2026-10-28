/**
 * Full Three.js Scene for the Konark Sun Temple Chakra.
 * Hosts the procedural wheel, solar lighting, orbit controls,
 * and independent camera reset capabilities.
 */

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import "./r3fSafety";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { KonarkWheelGeometry, KONARK_HOTSPOTS } from "./KonarkWheelGeometry";
import { SolarLighting } from "./SolarLighting";
import { AstronomyEnvironment } from "./AstronomyEnvironment";
import { EducationalHotspot } from "../types/timekeeping";

export interface KonarkSceneRef {
  resetCamera: () => void;
}

interface KonarkChakraSceneProps {
  altitudeDeg: number;
  azimuthDeg: number;
  isSunUp: boolean;
  minutesSinceMidnight?: number;
  onSelectHotspot?: (hotspot: EducationalHotspot) => void;
  selectedHotspotId?: string | null;
  className?: string;
}

export const KonarkChakraScene = forwardRef<KonarkSceneRef, KonarkChakraSceneProps>(
  function KonarkChakraScene(
    {
      altitudeDeg,
      azimuthDeg,
      isSunUp,
      minutesSinceMidnight = 720,
      onSelectHotspot,
      selectedHotspotId,
      className = "",
    },
    ref,
  ) {
    const controlsRef = useRef<OrbitControlsImpl>(null);

    // Initial camera position looking at the wheel at an angle to see 3D depth and shadow
    const defaultCameraPos: [number, number, number] = [0, -0.8, 10.5];
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

    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          className="w-full h-full"
        >
          <PerspectiveCamera
            makeDefault
            fov={48}
            position={defaultCameraPos}
            near={0.1}
            far={150}
          />

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={4}
            maxDistance={22}
            maxPolarAngle={Math.PI / 2 + 0.15}
            target={defaultTarget}
          />

          {/* Procedural Stars */}
          <AstronomyEnvironment />

          {/* Dynamic Sunlight & Shadow */}
          <SolarLighting altitudeDeg={altitudeDeg} azimuthDeg={azimuthDeg} isSunUp={isSunUp} />

          {/* Procedural Konark Stone Wheel with 480 beads & real-time shadow */}
          <KonarkWheelGeometry
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
            minutesSinceMidnight={minutesSinceMidnight}
            altitudeDeg={altitudeDeg}
            azimuthDeg={azimuthDeg}
            isSunUp={isSunUp}
          />
        </Canvas>

        {/* Hotspot legend overlay */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex flex-wrap gap-1.5 text-[11px] text-gold-soft/80 bg-background/80 px-2.5 py-1.5 rounded-lg border border-gold/15 backdrop-blur-sm">
          <span className="font-semibold text-gold">Hotspots:</span>
          {KONARK_HOTSPOTS.map((h) => (
            <button
              key={h.id}
              onClick={() => onSelectHotspot?.(h)}
              className={`pointer-events-auto rounded px-1.5 py-0.5 text-[10px] transition-colors ${
                selectedHotspotId === h.id
                  ? "bg-sky-500/20 text-sky-300 border border-sky-400/40"
                  : "bg-gold/10 text-gold-soft hover:bg-gold/20"
              }`}
            >
              {h.hindiTitle}
            </button>
          ))}
        </div>
      </div>
    );
  },
);
