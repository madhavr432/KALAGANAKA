/**
 * Solar lighting setup driven by solar altitude and azimuth.
 * Casts dynamic sunlight and shadows matching the current time and coordinates.
 */

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

interface SolarLightingProps {
  altitudeDeg: number;
  azimuthDeg: number;
  isSunUp: boolean;
}

export function SolarLighting({ altitudeDeg, azimuthDeg, isSunUp }: SolarLightingProps) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  // Convert solar altitude and azimuth to coordinates in front of the wheel (Z > 0)
  // so the central axle pin casts a dynamic Three.js shadow across the wheel face
  const [lightPos, lightColor, lightIntensity] = useMemo(() => {
    const altRad = (Math.max(2, altitudeDeg) * Math.PI) / 180;
    const radius = 25;

    // As Sun traverses from East (azimuth 90°) to South (180°) to West (270°):
    // sweepAngle runs from 0° (East) to 90° (South/Noon) to 180° (West)
    const sweepAngle = (((azimuthDeg - 90) % 360) * Math.PI) / 180;
    const x = radius * Math.cos(altRad) * Math.cos(sweepAngle);
    const y = Math.max(2.0, radius * Math.sin(altRad));
    const z = Math.max(9.0, radius * Math.cos(altRad));

    // Dynamic light color based on solar altitude:
    let color = new THREE.Color("#fff7e6"); // bright midday
    let intensity = 2.2;

    if (!isSunUp || altitudeDeg < 0) {
      // Nighttime: cool faint starlight
      color = new THREE.Color("#2a3b5c");
      intensity = 0.35;
    } else if (altitudeDeg < 12) {
      // Golden hour / sunrise / sunset
      color = new THREE.Color("#ff9933");
      intensity = 1.4 + (altitudeDeg / 12) * 0.6;
    } else if (altitudeDeg < 30) {
      // Morning / afternoon warm sunlight
      color = new THREE.Color("#ffe5b4");
      intensity = 1.8;
    }

    return [[x, y, z] as [number, number, number], color, intensity];
  }, [altitudeDeg, azimuthDeg, isSunUp]);

  // Ensure directional light explicitly targets the wheel center [0, 0, 0]
  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
      lightRef.current.target.updateMatrixWorld();
    }
  }, [lightPos]);

  return (
    <group name="solar-lighting">
      {/* Target object at center of wheel */}
      <object3D ref={targetRef} position={[0, 0, 0]} />

      {/* Soft ambient light to keep stone carving details legible */}
      <ambientLight intensity={isSunUp ? 0.5 : 0.25} color="#f4ede0" />

      {/* Hemisphere light for warm sky fill and cool ground bounce */}
      <hemisphereLight
        args={[
          isSunUp ? "#ffe8d6" : "#1a253a",
          isSunUp ? "#5c4d3c" : "#0d131f",
          isSunUp ? 0.65 : 0.35,
        ]}
      />

      {/* Primary directional sunlight casting crisp real-time shadows */}
      <directionalLight
        ref={lightRef}
        position={lightPos}
        intensity={lightIntensity}
        color={lightColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1.0}
        shadow-camera-far={65}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0006}
      />
    </group>
  );
}
