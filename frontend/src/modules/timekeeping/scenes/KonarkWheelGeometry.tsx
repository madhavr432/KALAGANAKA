/**
 * Procedural 3D Geometry and Materials for the Konark Sun Temple Chakra.
 * Models:
 * - 8 Major Spokes (Mukhya Aras) at 45° intervals (3-hour Praharas)
 * - 8 Minor Spokes (Laghu Aras) at 22.5° offsets (1.5-hour half-Praharas)
 * - 30 Carved Beads per sector (16 sectors × 30 = 480 beads total, 3 min/bead)
 * - Real-time Gnomon Pin Cast Shadow tracking time and solar position
 * - Active Bead Luminous Highlight aligning with the shadow
 */

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { EducationalHotspot } from "../types/timekeeping";
import { KONARK_HOTSPOTS } from "../constants/timekeepingConstants";
import { calculateKonarkWheelReading } from "../utils/konarkWheelMath";

export { KONARK_HOTSPOTS };

interface KonarkWheelGeometryProps {
  onSelectHotspot?: (hotspot: EducationalHotspot) => void;
  selectedHotspotId?: string | null;
  minutesSinceMidnight?: number;
  altitudeDeg?: number;
  azimuthDeg?: number;
  isSunUp?: boolean;
}

export function KonarkWheelGeometry({
  onSelectHotspot,
  selectedHotspotId,
  minutesSinceMidnight = 720,
  altitudeDeg = 45,
  azimuthDeg = 180,
  isSunUp = true,
}: KonarkWheelGeometryProps) {
  // Shared procedural materials
  const materials = useMemo(() => {
    // Weathered warm sandstone
    const sandstone = new THREE.MeshStandardMaterial({
      color: "#bf9468",
      roughness: 0.85,
      metalness: 0.05,
      bumpScale: 0.02,
    });

    // Darker relief stone for recessed channels
    const sandstoneDark = new THREE.MeshStandardMaterial({
      color: "#8c6540",
      roughness: 0.92,
      metalness: 0.02,
    });

    // Golden ochre for medallions and rim bead highlights
    const ochreAccent = new THREE.MeshStandardMaterial({
      color: "#d4a76a",
      roughness: 0.78,
      metalness: 0.08,
    });

    // Central axle gnomon pin (dark bronze/iron weathered finish)
    const axlePin = new THREE.MeshStandardMaterial({
      color: "#4a3b2c",
      roughness: 0.65,
      metalness: 0.35,
    });

    // Temple plinth platform
    const plinthStone = new THREE.MeshStandardMaterial({
      color: "#9e7852",
      roughness: 0.9,
      metalness: 0.02,
    });

    // Luminous active bead material
    const activeBeadMat = new THREE.MeshStandardMaterial({
      color: "#fbbf24",
      emissive: "#f59e0b",
      emissiveIntensity: 3.5,
      roughness: 0.1,
      metalness: 0.2,
    });

    return { sandstone, sandstoneDark, ochreAccent, axlePin, plinthStone, activeBeadMat };
  }, []);

  // Compute shadow angle and active bead coordinates
  const { shadowAngleRad, activeBeadX, activeBeadY, reading } = useMemo(() => {
    // Hour angle H (degrees from solar noon, 15° per hour = 0.25° per minute)
    // 06:00 = -90°, 12:00 = 0°, 18:00 = +90°
    const normMin = ((minutesSinceMidnight % 1440) + 1440) % 1440;
    const hourAngleDeg = (normMin - 720) * 0.25;
    const angleRad = (hourAngleDeg * Math.PI) / 180;

    // Radius of beads on the rim channel
    const beadRadius = 3.68;
    // Active shadow direction on vertical face (pointing down at noon)
    const bx = beadRadius * Math.sin(angleRad);
    const by = -beadRadius * Math.cos(angleRad);

    const r = calculateKonarkWheelReading(minutesSinceMidnight);

    return {
      shadowAngleRad: angleRad,
      activeBeadX: bx,
      activeBeadY: by,
      reading: r,
    };
  }, [minutesSinceMidnight]);

  // 480 beads instanced mesh reference (16 sectors × 30 beads per sector)
  const beadsInstancedRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!beadsInstancedRef.current) return;
    const tempObj = new THREE.Object3D();
    const beadRadius = 3.68;
    let idx = 0;

    // 16 sectors around the wheel (between each major and minor spoke, 22.5° each)
    for (let s = 0; s < 16; s++) {
      const sectorStart = (s * Math.PI) / 8; // 22.5°
      const sectorSpan = Math.PI / 8;
      // 30 beads inside this sector
      for (let b = 0; b < 30; b++) {
        // Leave slight margin near the spoke shafts
        const beadFrac = (b + 0.6) / 31.2;
        const angle = sectorStart + beadFrac * sectorSpan;
        const bx = beadRadius * Math.cos(angle);
        const by = beadRadius * Math.sin(angle);

        tempObj.position.set(bx, by, 0.235);
        tempObj.scale.set(1, 1, 1);
        tempObj.updateMatrix();
        beadsInstancedRef.current.setMatrixAt(idx, tempObj.matrix);
        idx++;
      }
    }
    beadsInstancedRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  // Hotspot pulse animation ref
  const pulseGroupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (pulseGroupRef.current) {
      const s = 1 + 0.12 * Math.sin(clock.getElapsedTime() * 3.5);
      pulseGroupRef.current.children.forEach((child) => {
        child.scale.set(s, s, s);
      });
    }
  });

  return (
    <group name="konark-wheel-root" position={[0, 0, 0]}>
      {/* 1. Stone Temple Plinth / Wall Plaque behind the wheel */}
      <mesh position={[0, 0, -0.45]} receiveShadow material={materials.plinthStone}>
        <boxGeometry args={[10.5, 9.8, 0.4]} />
      </mesh>

      {/* Decorative plinth mouldings (top and bottom cornice) */}
      <mesh position={[0, 4.8, -0.2]} castShadow receiveShadow material={materials.sandstoneDark}>
        <boxGeometry args={[10.8, 0.4, 0.55]} />
      </mesh>
      <mesh position={[0, -4.8, -0.2]} castShadow receiveShadow material={materials.sandstoneDark}>
        <boxGeometry args={[10.8, 0.4, 0.55]} />
      </mesh>

      {/* 2. Outer Rim (Tire) */}
      {/* Main outer rim cylinder */}
      <mesh castShadow receiveShadow material={materials.sandstone}>
        <cylinderGeometry args={[4.2, 4.2, 0.5, 64, 1, true]} />
      </mesh>
      {/* Outer front face ring */}
      <mesh position={[0, 0, 0.25]} castShadow receiveShadow material={materials.sandstone}>
        <ringGeometry args={[3.8, 4.2, 64]} />
      </mesh>
      {/* Rim inner recess band */}
      <mesh position={[0, 0, 0.2]} castShadow receiveShadow material={materials.sandstoneDark}>
        <ringGeometry args={[3.55, 3.8, 64]} />
      </mesh>
      {/* Inner rim border ring */}
      <mesh position={[0, 0, 0.24]} castShadow receiveShadow material={materials.sandstone}>
        <ringGeometry args={[3.35, 3.55, 64]} />
      </mesh>

      {/* 3. The 480 Carved Rim Beads (30 beads per major/minor sector) via InstancedMesh */}
      <instancedMesh
        ref={beadsInstancedRef}
        args={[undefined, undefined, 480]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial color="#d4a76a" roughness={0.75} metalness={0.1} />
      </instancedMesh>

      {/* Highlighted Active Bead where the shadow currently falls */}
      <group position={[activeBeadX, activeBeadY, 0.26]}>
        <mesh material={materials.activeBeadMat}>
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
        {/* Pulsating beacon ring on the active bead */}
        <mesh>
          <ringGeometry args={[0.1, 0.14, 16]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* 4. Intermediate Concentric Ring connecting the spokes */}
      <mesh position={[0, 0, 0.18]} castShadow receiveShadow material={materials.sandstone}>
        <ringGeometry args={[2.35, 2.55, 64]} />
      </mesh>
      <mesh position={[0, 0, 0.15]} castShadow receiveShadow material={materials.sandstoneDark}>
        <ringGeometry args={[2.28, 2.35, 64]} />
      </mesh>

      {/* 5. Central Hub (Nabhi) */}
      <mesh
        position={[0, 0, 0.15]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
        material={materials.sandstone}
      >
        <cylinderGeometry args={[1.15, 1.25, 0.45, 48]} />
      </mesh>
      {/* Hub ornamental ring */}
      <mesh position={[0, 0, 0.38]} castShadow receiveShadow material={materials.ochreAccent}>
        <ringGeometry args={[0.7, 1.15, 48]} />
      </mesh>
      {/* Lotus medallion on hub face */}
      <mesh
        position={[0, 0, 0.42]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
        material={materials.sandstoneDark}
      >
        <cylinderGeometry args={[0.65, 0.72, 0.15, 32]} />
      </mesh>
      {/* 16 carved lotus petals radiating on hub */}
      {Array.from({ length: 16 }).map((_, i) => {
        const petalAngle = (i * (2 * Math.PI)) / 16;
        const px = 0.5 * Math.cos(petalAngle);
        const py = 0.5 * Math.sin(petalAngle);
        return (
          <mesh
            key={`petal-${i}`}
            position={[px, py, 0.48]}
            rotation={[0, 0, petalAngle]}
            castShadow
            material={materials.sandstone}
          >
            <coneGeometry args={[0.08, 0.22, 4]} />
          </mesh>
        );
      })}

      {/* 6. Central Gnomon Axle Pin (casts the shadow) */}
      <mesh
        position={[0, 0, 0.85]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        material={materials.axlePin}
      >
        <cylinderGeometry args={[0.12, 0.18, 1.2, 24]} />
      </mesh>
      {/* Axle pin conical ornamental tip */}
      <mesh
        position={[0, 0, 1.5]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        material={materials.axlePin}
      >
        <coneGeometry args={[0.13, 0.25, 24]} />
      </mesh>

      {/* 7. Realistic Gnomon Cast Shadow (छाया) on the wheel face */}
      {isSunUp && (
        <group rotation={[0, 0, shadowAngleRad]} position={[0, 0, 0.255]}>
          {/* Penumbra shadow fan */}
          <mesh position={[0, -1.85, 0]}>
            <planeGeometry args={[0.22, 3.7]} />
            <meshBasicMaterial color="#0d0804" transparent opacity={0.65} depthWrite={false} />
          </mesh>
          {/* Core sharp umbra shadow line */}
          <mesh position={[0, -1.85, 0.005]}>
            <planeGeometry args={[0.08, 3.7]} />
            <meshBasicMaterial color="#050301" transparent opacity={0.85} depthWrite={false} />
          </mesh>
        </group>
      )}

      {/* 8. The 8 Major Spokes (Mukhya Aras) at 45° intervals (3-hour Praharas) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const innerLen = 1.0;
        const innerCenter = 1.05 + innerLen / 2;
        const outerLen = 1.35;
        const outerCenter = 2.05 + outerLen / 2;

        return (
          <group key={`major-spoke-${i}`} rotation={[0, 0, angle]}>
            {/* Inner shaft */}
            <mesh
              position={[0, innerCenter, 0.18]}
              castShadow
              receiveShadow
              material={materials.sandstone}
            >
              <boxGeometry args={[0.26, innerLen, 0.22]} />
            </mesh>

            {/* Carved Medallion disc on major spoke */}
            <group position={[0, 2.05, 0.22]}>
              <mesh castShadow receiveShadow material={materials.ochreAccent}>
                <cylinderGeometry args={[0.38, 0.42, 0.16, 24]} rotation={[Math.PI / 2, 0, 0]} />
              </mesh>
              {/* Inner relief figure on medallion */}
              <mesh position={[0, 0, 0.09]} material={materials.sandstoneDark}>
                <cylinderGeometry args={[0.26, 0.28, 0.05, 16]} rotation={[Math.PI / 2, 0, 0]} />
              </mesh>
              {/* Medallion border rivets */}
              {Array.from({ length: 8 }).map((_, rIdx) => {
                const rAngle = (rIdx * Math.PI) / 4;
                return (
                  <mesh
                    key={`rivet-${rIdx}`}
                    position={[0.32 * Math.cos(rAngle), 0.32 * Math.sin(rAngle), 0.09]}
                    material={materials.sandstone}
                  >
                    <sphereGeometry args={[0.035, 8, 8]} />
                  </mesh>
                );
              })}
            </group>

            {/* Outer shaft */}
            <mesh
              position={[0, outerCenter, 0.18]}
              castShadow
              receiveShadow
              material={materials.sandstone}
            >
              <boxGeometry args={[0.22, outerLen, 0.22]} />
            </mesh>

            {/* Decorative rim clamp bracket where spoke meets outer rim */}
            <mesh position={[0, 3.42, 0.22]} castShadow material={materials.sandstoneDark}>
              <boxGeometry args={[0.32, 0.14, 0.24]} />
            </mesh>
          </group>
        );
      })}

      {/* 9. The 8 Minor Spokes (Laghu Aras) at 22.5° offsets (1.5-hour half-Praharas) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4 + Math.PI / 8;
        const spokeLen = 2.45;
        const centerDist = 1.05 + spokeLen / 2;

        return (
          <group key={`minor-spoke-${i}`} rotation={[0, 0, angle]}>
            {/* Slender tapered minor spoke */}
            <mesh
              position={[0, centerDist, 0.15]}
              castShadow
              receiveShadow
              material={materials.sandstone}
            >
              <boxGeometry args={[0.13, spokeLen, 0.16]} />
            </mesh>
            {/* Small decorative bead ring at mid-length */}
            <mesh position={[0, 2.05, 0.16]} castShadow material={materials.ochreAccent}>
              <sphereGeometry args={[0.12, 12, 12]} />
            </mesh>
            {/* Rim attachment collar */}
            <mesh position={[0, 3.35, 0.18]} castShadow material={materials.sandstoneDark}>
              <boxGeometry args={[0.18, 0.1, 0.18]} />
            </mesh>
          </group>
        );
      })}

      {/* 10. Educational Hotspots Interactive 3D Markers */}
      <group ref={pulseGroupRef} name="hotspot-markers">
        {KONARK_HOTSPOTS.map((hotspot) => {
          const isSelected = selectedHotspotId === hotspot.id;
          return (
            <group
              key={hotspot.id}
              position={hotspot.position}
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot?.(hotspot);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "auto";
              }}
            >
              {/* Glowing inner core */}
              <mesh>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial
                  color={isSelected ? "#38bdf8" : "#fbbf24"}
                  emissive={isSelected ? "#0284c7" : "#d97706"}
                  emissiveIntensity={2.5}
                  roughness={0.2}
                />
              </mesh>
              {/* Outer pulsating halo */}
              <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial
                  color={isSelected ? "#38bdf8" : "#fbbf24"}
                  transparent
                  opacity={0.35}
                  wireframe
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
