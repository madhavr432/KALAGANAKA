/**
 * Module 1: Ancient vs Modern Timekeeping — Main Master Experience.
 * Brings together the procedural 3D Konark Sun Temple Chakra, the modern
 * celestial coordinate machine, the shared Sun-position slider, location controls,
 * calculation information popovers, and educational narratives.
 */

import React, { useRef } from "react";
import { NavigationHeader } from "@/components/NavigationHeader";
import { TimekeepingHeader } from "./components/TimekeepingHeader";
import { ViewModeSelector } from "./components/ViewModeSelector";
import { SunTimeSlider } from "./components/SunTimeSlider";
import { LocationControls } from "./components/LocationControls";
import { CalculationResults } from "./components/CalculationResults";
import { KonarkBeadCalculator } from "./components/KonarkBeadCalculator";
import { EducationalPanel } from "./components/EducationalPanel";
import { CalculationInfoModal } from "./components/CalculationInfo";
import { HotspotModal } from "./components/HotspotModal";
import { SceneContainer } from "./scenes/SceneContainer";
import { useTimekeepingState } from "./hooks/useTimekeepingState";
import { useSolarCalculation } from "./hooks/useSolarCalculation";

export function TimekeepingPage() {
  const labRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);

  const {
    selectedDate,
    setSelectedDate,
    minutesSinceMidnight,
    setMinutesSinceMidnight,
    selectedPresetId,
    applyPreset,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    elevation_m,
    setElevation,
    timezone,
    setTimezone,
    viewMode,
    setViewMode,
    synchronized,
    setSynchronized,
    isPlaying,
    togglePlayback,
    playbackSpeed,
    setPlaybackSpeed,
    selectedHotspot,
    setSelectedHotspot,
    activeInfoMetricKey,
    setActiveInfoMetricKey,
    presets,
  } = useTimekeepingState();

  const { solarData, calculationStatus, isBackendConnected } = useSolarCalculation({
    selectedDate,
    minutesSinceMidnight,
    latitude,
    longitude,
    elevation_m,
    timezone,
  });

  const handleExploreChakra = () => {
    setViewMode("konark");
    labRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCompareTimekeeping = () => {
    setViewMode("compare");
    labRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground antialiased selection:bg-gold/30 selection:text-gold-light">
      {/* Background Subtle Stars */}
      <div className="stars pointer-events-none fixed inset-0 opacity-40" aria-hidden />

      {/* Main Responsive Navigation Bar */}
      <NavigationHeader
        currentFeature="timekeeping"
        title="काल-गणना"
        subtitle="Ancient vs Modern Timekeeping"
      />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        {/* Hero Section */}
        <TimekeepingHeader
          onExploreChakra={handleExploreChakra}
          onCompareTimekeeping={handleCompareTimekeeping}
        />

        {/* Section C: Main Interactive Laboratory */}
        <section ref={labRef} className="space-y-5 scroll-mt-20">
          {/* View Mode Selector */}
          <ViewModeSelector
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            synchronized={synchronized}
            onToggleSynchronized={setSynchronized}
          />

          {/* Time Slider & Playback Controls */}
          <SunTimeSlider
            minutesSinceMidnight={minutesSinceMidnight}
            onTimeChange={setMinutesSinceMidnight}
            isPlaying={isPlaying}
            onTogglePlayback={togglePlayback}
            playbackSpeed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            solarData={solarData}
            timezone={timezone}
          />

          {/* 3D Scene Viewport */}
          <SceneContainer
            viewMode={viewMode}
            minutesSinceMidnight={minutesSinceMidnight}
            altitudeDeg={solarData.altitude_deg}
            altitudeRefractedDeg={solarData.altitude_refracted_deg}
            azimuthDeg={solarData.azimuth_deg}
            latitude={latitude}
            isSunUp={solarData.is_sun_up}
            onSelectHotspot={setSelectedHotspot}
            selectedHotspotId={selectedHotspot?.id || null}
          />

          {/* Konark 30-Bead Real-Time Calculator & Horological Indicator */}
          <KonarkBeadCalculator
            minutesSinceMidnight={minutesSinceMidnight}
            onOpenInfo={setActiveInfoMetricKey}
          />

          {/* Date and Location Controls */}
          <LocationControls
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedPresetId={selectedPresetId}
            onSelectPreset={applyPreset}
            latitude={latitude}
            onLatitudeChange={setLatitude}
            longitude={longitude}
            onLongitudeChange={setLongitude}
            elevation_m={elevation_m}
            onElevationChange={setElevation}
            timezone={timezone}
            onTimezoneChange={setTimezone}
            presets={presets}
          />

          {/* Calculation Results Area */}
          <div ref={compareRef}>
            <CalculationResults
              solarData={solarData}
              calculationStatus={calculationStatus}
              isBackendConnected={isBackendConnected}
              selectedDate={selectedDate}
              minutesSinceMidnight={minutesSinceMidnight}
              latitude={latitude}
              longitude={longitude}
              timezone={timezone}
              onOpenInfo={setActiveInfoMetricKey}
            />
          </div>
        </section>

        {/* Section D: Educational Narrative Curriculum */}
        <EducationalPanel />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold/15 bg-background/90 py-8 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-deva text-base text-gold-gradient">कलागणक (KalaGanaka)</span>
            <span className="text-[11px] text-muted-foreground">
              Educational Platform Exploring Ancient Indian Astronomy & Modern Computational Science
            </span>
          </div>

          <p className="text-[11px] text-center sm:text-right max-w-md">
            Konark Chakra procedural 3D model is an educational visualization inspired by the
            13th-century Surya Deula at Konark, Odisha. Solar position calculations reference
            standard NOAA / JPL DE421 ephemerides.
          </p>
        </div>
      </footer>

      {/* Interactive Modals */}
      <CalculationInfoModal
        metricKey={activeInfoMetricKey}
        onClose={() => setActiveInfoMetricKey(null)}
        solarData={solarData}
      />

      <HotspotModal hotspot={selectedHotspot} onClose={() => setSelectedHotspot(null)} />
    </div>
  );
}
