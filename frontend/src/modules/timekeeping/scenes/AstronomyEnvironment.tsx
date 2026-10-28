/**
 * Procedural cosmic environment for KalaGanaka 3D scenes.
 * Renders subtle star particles and celestial depth without heavy textures or distraction.
 */

import React, { useMemo } from "react";
import * as THREE from "three";

export function AstronomyEnvironment() {
  // Generate random sparse stars on a distant celestial sphere
  const [starPositions, starColors] = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const goldColor = new THREE.Color("#d4af37");
    const whiteColor = new THREE.Color("#e2e8f0");
    const blueColor = new THREE.Color("#93c5fd");

    for (let i = 0; i < count; i++) {
      // Uniform distribution on sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const radius = 90 + Math.random() * 20;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Star color variation
      const rand = Math.random();
      const c = rand > 0.85 ? goldColor : rand > 0.4 ? whiteColor : blueColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return [positions, colors];
  }, []);

  return (
    <group name="astronomy-environment">
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.65} vertexColors transparent opacity={0.7} sizeAttenuation />
      </points>
    </group>
  );
}
