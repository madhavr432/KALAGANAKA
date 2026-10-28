/**
 * SceneContainer.tsx
 * Orchestrates the 3D rendering views (Konark, Modern, Compare),
 * handles SSR safety (mounting check), WebGL fallback,
 * and provides independent camera reset triggers.
 */

import React, { useState, useEffect, useRef } from "react";
import "./r3fSafety";
import { KonarkChakraScene, KonarkSceneRef } from "./KonarkChakraScene";
import { ModernTimeMachineScene, ModernSceneRef } from "./ModernTimeMachineScene";
import { TimekeepingViewMode, EducationalHotspot } from "../types/timekeeping";
import { RotateCcw, AlertTriangle, Sparkles, Compass, Eye } from "lucide-react";

interface SceneContainerProps {
  viewMode: TimekeepingViewMode;
  altitudeDeg: number;
  altitudeRefractedDeg: number;
  azimuthDeg: number;
  latitude: number;
  isSunUp: boolean;
  minutesSinceMidnight?: number;
  onSelectHotspot: (hotspot: EducationalHotspot) => void;
  selectedHotspotId: string | null;
}

export function SceneContainer({
  viewMode,
  altitudeDeg,
  altitudeRefractedDeg,
  azimuthDeg,
  latitude,
  isSunUp,
  minutesSinceMidnight = 720,
  onSelectHotspot,
  selectedHotspotId,
}: SceneContainerProps) {
  const [isClient, setIsClient] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Mobile sub-tab for compare mode on very narrow screens
  const [mobileCompareTab, setMobileCompareTab] = useState<"konark" | "modern">("konark");

  const konarkRef = useRef<KonarkSceneRef>(null);
  const modernRef = useRef<ModernSceneRef>(null);

  useEffect(() => {
    setIsClient(true);
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!isClient) {
    // Elegant dark cosmic loading placeholder during SSR
    return (
      <div className="flex h-[480px] sm:h-[580px] w-full items-center justify-center rounded-2xl border border-gold/20 bg-background/60 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 text-gold-soft">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <span className="font-deva text-base text-gold-gradient">खगोलीय वेधशाला लोडिंग...</span>
          <span className="font-sans text-xs text-muted-foreground">
            Initializing Three.js Astronomical Laboratory
          </span>
        </div>
      </div>
    );
  }

  if (!webglSupported) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
        <div className="max-w-md">
          <AlertTriangle className="mx-auto h-10 w-10 text-amber-400" />
          <h3 className="mt-3 font-semibold text-foreground">
            WebGL is not supported or disabled in your browser
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            To explore the 3D Konark Chakra and Modern Astronomical Machine, please ensure WebGL and
            hardware acceleration are enabled in your browser settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl border border-gold/25 bg-background/80 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Compare Mode Header bar on mobile */}
      {viewMode === "compare" && (
        <div className="flex items-center justify-between border-b border-gold/15 bg-background/90 px-4 py-2 lg:hidden">
          <div className="text-xs font-medium text-gold-soft flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-gold" />
            <span>Synchronized Comparison View</span>
          </div>
          <div className="flex rounded-lg border border-gold/20 p-0.5 bg-background/50">
            <button
              onClick={() => setMobileCompareTab("konark")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                mobileCompareTab === "konark"
                  ? "bg-gold/20 text-gold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Konark Chakra
            </button>
            <button
              onClick={() => setMobileCompareTab("modern")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                mobileCompareTab === "modern"
                  ? "bg-gold/20 text-gold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Modern Machine
            </button>
          </div>
        </div>
      )}

      {/* Main 3D View Area */}
      <div className="relative h-[480px] sm:h-[580px] w-full">
        {/* MODE A: Konark Chakra View */}
        {viewMode === "konark" && (
          <div className="relative h-full w-full">
            <KonarkChakraScene
              ref={konarkRef}
              altitudeDeg={altitudeDeg}
              azimuthDeg={azimuthDeg}
              isSunUp={isSunUp}
              minutesSinceMidnight={minutesSinceMidnight}
              onSelectHotspot={onSelectHotspot}
              selectedHotspotId={selectedHotspotId}
            />
            {/* View Title & Camera Reset Button */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="rounded-md border border-gold/20 bg-background/80 px-2.5 py-1 font-deva text-xs text-gold backdrop-blur-sm">
                कोणार्क सूर्य मन्दिर चक्र (Konark Sun Temple Chakra)
              </span>
            </div>
            <button
              onClick={() => konarkRef.current?.resetCamera()}
              className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-lg border border-gold/25 bg-background/85 px-2.5 py-1.5 font-sans text-xs text-gold-soft hover:bg-gold/20 hover:text-gold transition-colors backdrop-blur-sm"
              title="Reset ancient wheel camera view"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset View</span>
            </button>
          </div>
        )}

        {/* MODE B: Modern Machine View */}
        {viewMode === "modern" && (
          <div className="relative h-full w-full">
            <ModernTimeMachineScene
              ref={modernRef}
              altitudeDeg={altitudeDeg}
              altitudeRefractedDeg={altitudeRefractedDeg}
              azimuthDeg={azimuthDeg}
              latitude={latitude}
              isSunUp={isSunUp}
            />
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="rounded-md border border-gold/20 bg-background/80 px-2.5 py-1 font-sans text-xs text-gold backdrop-blur-sm">
                Modern Astronomical Machine (Solar Altitude & Azimuth Coordinates)
              </span>
            </div>
            <button
              onClick={() => modernRef.current?.resetCamera()}
              className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-lg border border-gold/25 bg-background/85 px-2.5 py-1.5 font-sans text-xs text-gold-soft hover:bg-gold/20 hover:text-gold transition-colors backdrop-blur-sm"
              title="Reset modern machine camera view"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset View</span>
            </button>
          </div>
        )}

        {/* MODE C: Compare Both */}
        {viewMode === "compare" && (
          <div className="relative h-full w-full">
            {/* Desktop / Tablet: Side-by-side split columns */}
            <div className="hidden lg:grid h-full w-full grid-cols-2 divide-x divide-gold/20">
              {/* Left Column: Konark Chakra */}
              <div className="relative h-full w-full">
                <KonarkChakraScene
                  ref={konarkRef}
                  altitudeDeg={altitudeDeg}
                  azimuthDeg={azimuthDeg}
                  isSunUp={isSunUp}
                  minutesSinceMidnight={minutesSinceMidnight}
                  onSelectHotspot={onSelectHotspot}
                  selectedHotspotId={selectedHotspotId}
                />
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="rounded-md border border-gold/20 bg-background/85 px-2 py-1 font-deva text-[11px] text-gold-soft backdrop-blur-sm">
                    १. कोणार्क चक्र (Ancient Wheel)
                  </span>
                </div>
                <button
                  onClick={() => konarkRef.current?.resetCamera()}
                  className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-md border border-gold/20 bg-background/85 px-2 py-1 text-[11px] text-gold-soft hover:bg-gold/20 transition-colors backdrop-blur-sm"
                  title="Reset Ancient View"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Right Column: Modern Machine */}
              <div className="relative h-full w-full">
                <ModernTimeMachineScene
                  ref={modernRef}
                  altitudeDeg={altitudeDeg}
                  altitudeRefractedDeg={altitudeRefractedDeg}
                  azimuthDeg={azimuthDeg}
                  latitude={latitude}
                  isSunUp={isSunUp}
                />
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="rounded-md border border-gold/20 bg-background/85 px-2 py-1 font-sans text-[11px] text-gold-soft backdrop-blur-sm">
                    २. Modern Astronomical Coordinates
                  </span>
                </div>
                <button
                  onClick={() => modernRef.current?.resetCamera()}
                  className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-md border border-gold/20 bg-background/85 px-2 py-1 text-[11px] text-gold-soft hover:bg-gold/20 transition-colors backdrop-blur-sm"
                  title="Reset Modern View"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Mobile / Narrow Screen: Responsive single machine with quick tab switcher */}
            <div className="lg:hidden h-full w-full">
              {mobileCompareTab === "konark" ? (
                <div className="relative h-full w-full">
                  <KonarkChakraScene
                    ref={konarkRef}
                    altitudeDeg={altitudeDeg}
                    azimuthDeg={azimuthDeg}
                    isSunUp={isSunUp}
                    minutesSinceMidnight={minutesSinceMidnight}
                    onSelectHotspot={onSelectHotspot}
                    selectedHotspotId={selectedHotspotId}
                  />
                  <button
                    onClick={() => konarkRef.current?.resetCamera()}
                    className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md border border-gold/20 bg-background/85 px-2 py-1 text-[11px] text-gold-soft"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <ModernTimeMachineScene
                    ref={modernRef}
                    altitudeDeg={altitudeDeg}
                    altitudeRefractedDeg={altitudeRefractedDeg}
                    azimuthDeg={azimuthDeg}
                    latitude={latitude}
                    isSunUp={isSunUp}
                  />
                  <button
                    onClick={() => modernRef.current?.resetCamera()}
                    className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md border border-gold/20 bg-background/85 px-2 py-1 text-[11px] text-gold-soft"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
