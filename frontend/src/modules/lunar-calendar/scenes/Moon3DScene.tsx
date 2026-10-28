/**
 * scenes/Moon3DScene.tsx
 * High-fidelity Three.js / React Three Fiber interactive 3D Moon centerpiece.
 * Features:
 * 1. Procedural cratered lunar surface (maria basins, Tycho/Copernicus rays, regolith roughness).
 * 2. Physically accurate directional sunlight driven by Moon-Sun elongation angle.
 * 3. Earthshine ambient illumination on the unlit hemisphere.
 * 4. Interactive OrbitControls (rotate, tilt, zoom, auto-rotation support).
 * 5. Sun direction beacon and celestial orientation.
 * 6. Resilient 2D SVG fallback.
 */

import React, { useMemo, useRef, useEffect, useState, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { installR3fSafety } from "@/modules/timekeeping/scenes/r3fSafety";
import { Compass, RotateCw } from "lucide-react";

// Ensure R3F proxy safety is installed in client browser
installR3fSafety();

interface Moon3DSceneProps {
  elongationDeg: number; // [0, 360)
  illuminatedFraction: number; // [0.0, 1.0]
  phaseName: string;
  isWaxing: boolean;
  cameraResetTrigger: number;
}

/**
 * Generate in-memory procedural lunar diffuse and bump canvas textures.
 */
function createProceduralLunarTextures(): {
  colorTexture: THREE.CanvasTexture;
  bumpTexture: THREE.CanvasTexture;
} {
  const width = 1024;
  const height = 512;

  // 1. Color / Albedo Canvas
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = width;
  colorCanvas.height = height;
  const ctx = colorCanvas.getContext("2d")!;

  // Base highland lunar soil (pale silver-gray)
  ctx.fillStyle = "#b8bac4";
  ctx.fillRect(0, 0, width, height);

  // Pseudo-random noise for regolith grain
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain + 2));
  }
  ctx.putImageData(imgData, 0, 0);

  // Maria Basins (Lunar Seas) coordinates (normalized x: [0, 1], y: [0, 1], radius, intensity)
  const mariaBasins = [
    { x: 0.38, y: 0.42, r: 85, color: "rgba(55, 58, 66, 0.78)" }, // Oceanus Procellarum
    { x: 0.48, y: 0.35, r: 50, color: "rgba(50, 52, 60, 0.82)" }, // Mare Imbrium
    { x: 0.56, y: 0.38, r: 40, color: "rgba(52, 55, 62, 0.80)" }, // Mare Serenitatis
    { x: 0.62, y: 0.44, r: 42, color: "rgba(48, 50, 58, 0.85)" }, // Mare Tranquillitatis
    { x: 0.68, y: 0.42, r: 30, color: "rgba(54, 56, 64, 0.80)" }, // Mare Crisium
    { x: 0.65, y: 0.54, r: 35, color: "rgba(56, 58, 66, 0.75)" }, // Mare Fecunditatis
    { x: 0.44, y: 0.55, r: 38, color: "rgba(58, 60, 68, 0.72)" }, // Mare Nubium
    { x: 0.52, y: 0.58, r: 25, color: "rgba(55, 57, 65, 0.75)" }, // Mare Nectaris
  ];

  mariaBasins.forEach((basin) => {
    const cx = basin.x * width;
    const cy = basin.y * height;
    const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, basin.r);
    grad.addColorStop(0, basin.color);
    grad.addColorStop(0.7, basin.color.replace("0.8", "0.5").replace("0.7", "0.4"));
    grad.addColorStop(1, "rgba(184, 186, 196, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, basin.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Major rayed impact craters
  const craters = [
    { x: 0.48, y: 0.75, r: 16, name: "Tycho" },
    { x: 0.42, y: 0.42, r: 14, name: "Copernicus" },
    { x: 0.36, y: 0.44, r: 12, name: "Kepler" },
    { x: 0.58, y: 0.68, r: 18, name: "Clavius" },
    { x: 0.5, y: 0.3, r: 13, name: "Plato" },
    { x: 0.65, y: 0.34, r: 11, name: "Posidonius" },
  ];

  // Draw bright ray systems (especially Tycho)
  const tycho = craters[0];
  const tychoX = tycho.x * width;
  const tychoY = tycho.y * height;
  ctx.strokeStyle = "rgba(240, 242, 255, 0.45)";
  ctx.lineWidth = 1.5;
  for (let angle = 0; angle < Math.PI * 2; angle += 0.28) {
    ctx.beginPath();
    ctx.moveTo(tychoX, tychoY);
    const rayLen = 140 + Math.sin(angle * 7) * 40;
    ctx.lineTo(tychoX + Math.cos(angle) * rayLen, tychoY + Math.sin(angle) * rayLen);
    ctx.stroke();
  }

  // Draw crater rims & shadows
  craters.forEach((crater) => {
    const cx = crater.x * width;
    const cy = crater.y * height;

    // Rim highlight
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, crater.r, 0, Math.PI * 2);
    ctx.stroke();

    // Central peak
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();

    // Crater floor shadow
    ctx.fillStyle = "rgba(40, 42, 48, 0.65)";
    ctx.beginPath();
    ctx.arc(cx - 1.5, cy - 1.5, crater.r - 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // 2. Bump / Heightmap Canvas
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext("2d")!;

  // Neutral mid-gray base
  bCtx.fillStyle = "#808080";
  bCtx.fillRect(0, 0, width, height);

  // Maria are depressions (darker gray)
  mariaBasins.forEach((basin) => {
    const cx = basin.x * width;
    const cy = basin.y * height;
    const grad = bCtx.createRadialGradient(cx, cy, 5, cx, cy, basin.r);
    grad.addColorStop(0, "rgba(60, 60, 60, 0.6)");
    grad.addColorStop(1, "rgba(128, 128, 128, 0)");
    bCtx.fillStyle = grad;
    bCtx.beginPath();
    bCtx.arc(cx, cy, basin.r, 0, Math.PI * 2);
    bCtx.fill();
  });

  // Crater rims are elevated ridges (white) with depressed floors (black)
  craters.forEach((crater) => {
    const cx = crater.x * width;
    const cy = crater.y * height;

    // Rim ridge
    bCtx.strokeStyle = "#ffffff";
    bCtx.lineWidth = 3;
    bCtx.beginPath();
    bCtx.arc(cx, cy, crater.r, 0, Math.PI * 2);
    bCtx.stroke();

    // Floor depression
    bCtx.fillStyle = "#202020";
    bCtx.beginPath();
    bCtx.arc(cx, cy, crater.r - 2, 0, Math.PI * 2);
    bCtx.fill();
  });

  const colorTexture = new THREE.CanvasTexture(colorCanvas);
  colorTexture.wrapS = THREE.RepeatWrapping;
  colorTexture.wrapT = THREE.ClampToEdgeWrapping;

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.ClampToEdgeWrapping;

  return { colorTexture, bumpTexture };
}

/**
 * Procedural Moon Mesh inside Three.js Canvas
 */
function ProceduralMoonMesh({ elongationDeg }: { elongationDeg: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { colorTexture, bumpTexture } = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        colorTexture: new THREE.Texture(),
        bumpTexture: new THREE.Texture(),
      };
    }
    return createProceduralLunarTextures();
  }, []);

  // Direction of incident sunlight derived from Sun-Moon elongation angle
  // When elongation = 0° (New Moon), Sun is behind Moon (-Z).
  // When elongation = 90° (First Quarter), Sun is to the West (+X).
  // When elongation = 180° (Full Moon), Sun is directly facing Earth-facing side (+Z).
  // When elongation = 270° (Third Quarter), Sun is to the East (-X).
  const sunLightDirection = useMemo(() => {
    // Ecliptic angle in radians
    const rad = (elongationDeg * Math.PI) / 180;
    const distance = 16.0;
    // Direction vector of sunlight
    const x = Math.sin(rad) * distance;
    const z = -Math.cos(rad) * distance;
    return new THREE.Vector3(x, 0.4, z);
  }, [elongationDeg]);

  // Slow natural lunar axial rotation (tidally locked to Earth in real life, but subtle spin adds life)
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      {/* Dynamic Directional Sunlight */}
      <directionalLight
        position={sunLightDirection}
        intensity={3.8}
        color="#fff9ea"
        castShadow={false}
      />

      {/* Earthshine Ambient Light on the dark side (cool soft bluish-grayDa Vinci glow) */}
      <ambientLight intensity={0.12} color="#a6b8d4" />

      {/* Subtle fill light opposite to sun to prevent absolute 0-Kelvin darkness */}
      <directionalLight
        position={[-sunLightDirection.x * 0.4, -0.2, -sunLightDirection.z * 0.4]}
        intensity={0.06}
        color="#8898b0"
      />

      {/* 3D Lunar Sphere */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          map={colorTexture}
          bumpMap={bumpTexture}
          bumpScale={0.06}
          roughness={0.92} // Lunar regolith has high back-scattering roughness
          metalness={0.02}
        />
      </mesh>

      {/* Sun Direction Vector Indicator Marker */}
      <group position={[sunLightDirection.x * 0.28, 0, sunLightDirection.z * 0.28]}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Camera and Controls Controller
 */
function SceneController({ cameraResetTrigger }: { cameraResetTrigger: number }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [cameraResetTrigger]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={3.8}
      maxDistance={9.0}
      dampingFactor={0.08}
      rotateSpeed={0.8}
    />
  );
}

/**
 * 2D Canvas Fallback Component
 */
function Lunar2DFallback({
  elongationDeg,
  illuminatedFraction,
  phaseName,
}: {
  elongationDeg: number;
  illuminatedFraction: number;
  phaseName: string;
}) {
  const rad = (elongationDeg * Math.PI) / 180;
  const isWaxing = elongationDeg <= 180;
  const norm = Math.cos(rad);
  const r = 80;
  const cx = 95;
  const cy = 95;

  const sweep = isWaxing ? 1 : 0;
  const terminatorRadiusX = Math.max(1, Math.abs(norm) * r);
  const terminatorSweep = norm >= 0 ? (isWaxing ? 0 : 1) : isWaxing ? 1 : 0;

  const illuminatedPath = `
    M ${cx} ${cy - r}
    A ${r} ${r} 0 0 ${sweep} ${cx} ${cy + r}
    A ${terminatorRadiusX} ${r} 0 0 ${terminatorSweep} ${cx} ${cy - r}
    Z
  `;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
      <svg width="190" height="190" viewBox="0 0 190 190" className="drop-shadow-2xl">
        {/* Dark unlit lunar body */}
        <circle cx={cx} cy={cy} r={r} fill="#1e222d" stroke="#475569" strokeWidth="2" />
        {/* Maria faint patches */}
        <circle cx={cx - 15} cy={cy - 10} r="22" fill="#141720" opacity="0.6" />
        <circle cx={cx + 20} cy={cy + 15} r="26" fill="#141720" opacity="0.6" />
        {/* Illuminated portion */}
        <path d={illuminatedPath} fill="#f1f5f9" opacity="0.95" />
      </svg>
      <p className="mt-4 font-serif text-lg font-semibold text-slate-100">{phaseName}</p>
      <p className="text-xs text-muted-foreground">
        Illumination: {Math.round(illuminatedFraction * 100)}% • Elongation:{" "}
        {elongationDeg.toFixed(1)}°
      </p>
    </div>
  );
}

/**
 * Error boundary for WebGL failure
 */
class WebGLErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("Three.js WebGL rendering error in Moon3DScene, falling back to 2D:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Master Moon3DScene Component
 */
export function Moon3DScene({
  elongationDeg,
  illuminatedFraction,
  phaseName,
  isWaxing,
  cameraResetTrigger,
}: Moon3DSceneProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const fallback = (
    <Lunar2DFallback
      elongationDeg={elongationDeg}
      illuminatedFraction={illuminatedFraction}
      phaseName={phaseName}
    />
  );

  if (!hasWebGL) {
    return fallback;
  }

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#060a17] via-[#090d1f] to-[#04060d]">
      <WebGLErrorBoundary fallback={fallback}>
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 42 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#050814"]} />
          <Stars
            radius={80}
            depth={40}
            count={1200}
            factor={3.5}
            saturation={0.1}
            fade
            speed={0.4}
          />
          <ProceduralMoonMesh elongationDeg={elongationDeg} />
          <SceneController cameraResetTrigger={cameraResetTrigger} />
        </Canvas>
      </WebGLErrorBoundary>

      {/* Floating HUD Badges */}
      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 rounded-full border border-gold/20 bg-background/80 px-3 py-1 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
          <span className="text-xs font-medium text-gold-light">
            {isWaxing ? "Waxing (शुक्ल पक्ष)" : "Waning (कृष्ण पक्ष)"}
          </span>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-[11px] text-slate-300 backdrop-blur-sm">
          Illumination:{" "}
          <strong className="text-white">{Math.round(illuminatedFraction * 100)}%</strong>
        </div>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-[11px] text-slate-300 backdrop-blur-sm">
        <Compass className="h-3.5 w-3.5 text-gold" />
        <span>
          Elongation: <strong>{elongationDeg.toFixed(1)}°</strong>
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <RotateCw className="h-3 w-3" /> Drag to rotate • Scroll to zoom
        </span>
        <span className="text-gold-soft font-mono">Sun Vector: {elongationDeg.toFixed(0)}°</span>
      </div>
    </div>
  );
}
