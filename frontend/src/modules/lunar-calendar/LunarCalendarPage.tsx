/**
 * LunarCalendarPage.tsx
 * Master Page Component for Module 3: Lunar Calendar, Panchang & Lunar Festivals.
 * Integrates:
 * 1. Section A: Hero with editorial context, quick status badges, and navigation jump links.
 * 2. Section B: Interactive 3D Moon centerpiece with synodic scrubber and physical sunlight.
 * 3. Section C: The 8 Principal Lunar Phases timeline with jump-to-phase buttons.
 * 4. Section D: The 5 Limbs of Panchang (Tithi, Vara, Nakshatra, Yoga, Karana).
 * 5. Section E: 30 Tithi progression explorer and duration variability explainer.
 * 6. Section F: 27 Nakshatras lunar mansions explorer.
 * 7. Section G: Full monthly lunar calendar view with Amanta vs Purnimanta toggle.
 * 8. Section H: Lunar festival explorer with timing Kala rules and jump controls.
 * 9. Section I: Traditional Siddhantic vs Modern JPL DE421 ephemeris comparison lab.
 * 10. Section J: "ⓘ" calculation explanation modals.
 */

import React, { useRef } from "react";
import { NavigationHeader } from "@/components/NavigationHeader";
import { LunarHero } from "./components/LunarHero";
import { MoonExplorerContainer } from "./components/MoonExplorerContainer";
import { LunarPhaseTimeline } from "./components/LunarPhaseTimeline";
import { TithiExplorer } from "./components/TithiExplorer";
import { NakshatraExplorer } from "./components/NakshatraExplorer";
import { LunarCalendarMonthView } from "./components/LunarCalendarMonthView";
import { LunarFestivalExplorer } from "./components/LunarFestivalExplorer";
import { LunarTraditionalModernLab } from "./components/LunarTraditionalModernLab";
import { LunarCalculationInfoModal } from "./components/LunarCalculationInfoModal";
import { useLunarCalendarState } from "./hooks/useLunarCalendarState";
import { useLunarCalendarApi } from "./hooks/useLunarCalendarApi";

export function LunarCalendarPage() {
  const moonRef = useRef<HTMLDivElement>(null);
  const tithiRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const festivalsRef = useRef<HTMLDivElement>(null);
  const labRef = useRef<HTMLDivElement>(null);

  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedPresetId,
    applyPreset,
    latitude,
    longitude,
    elevation_m,
    timezone,
    isPlaying,
    togglePlayback,
    playbackSpeed,
    setPlaybackSpeed,
    cameraResetTrigger,
    resetCamera,
    monthViewMode,
    setMonthViewMode,
    selectedTithiIndex,
    setSelectedTithiIndex,
    selectedNakshatraIndex,
    setSelectedNakshatraIndex,
    selectedFestival,
    setSelectedFestival,
    activeInfoMetricKey,
    setActiveInfoMetricKey,
    festivalSearchQuery,
    setFestivalSearchQuery,
    selectedFestivalMonthFilter,
    setSelectedFestivalMonthFilter,
    selectedFestivalPakshaFilter,
    setSelectedFestivalPakshaFilter,
    selectedFestivalTraditionFilter,
    setSelectedFestivalTraditionFilter,
    filteredFestivals,
    stepDay,
    resetToToday,
    jumpToDate,
    jumpToFestival,
    jumpToPhase,
    presets,
  } = useLunarCalendarState();

  const { apiState, lunarValues, isLiveBackend } = useLunarCalendarApi({
    selectedDate,
    selectedTime,
    latitude,
    longitude,
    elevation_m,
    timezone,
    isPlaying,
  });

  const handleScrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground antialiased selection:bg-gold/30 selection:text-gold-light">
      {/* Background Subtle Stars */}
      <div className="stars pointer-events-none fixed inset-0 opacity-40" aria-hidden />

      {/* Main Responsive Navigation Bar */}
      <NavigationHeader
        currentFeature="chandra-panchang"
        title="चन्द्र पञ्चाङ्ग"
        subtitle="Lunar Panchang & Festivals"
      />

      {/* Main Page Content Flow */}
      <main className="relative z-10 mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* SECTION A — HERO */}
        <LunarHero
          selectedDate={selectedDate}
          moonState={lunarValues.moonState}
          panchangLimbs={lunarValues.panchangLimbs}
          lunarMonth={lunarValues.lunarMonth}
          isLiveBackend={isLiveBackend}
          onExploreMoon={() => handleScrollTo(moonRef)}
          onExploreTithi={() => handleScrollTo(tithiRef)}
          onExploreCalendar={() => handleScrollTo(calendarRef)}
          onExploreFestivals={() => handleScrollTo(festivalsRef)}
          onOpenInfo={(k) => setActiveInfoMetricKey(k)}
        />

        {/* SECTION B — INTERACTIVE 3D MOON EXPLORER (CENTERPIECE) */}
        <div ref={moonRef}>
          <MoonExplorerContainer
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedPresetId={selectedPresetId}
            applyPreset={applyPreset}
            presets={presets}
            isPlaying={isPlaying}
            togglePlayback={togglePlayback}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            cameraResetTrigger={cameraResetTrigger}
            resetCamera={resetCamera}
            stepDay={stepDay}
            resetToToday={resetToToday}
            moonState={lunarValues.moonState}
            panchangLimbs={lunarValues.panchangLimbs}
            onOpenInfo={(k) => setActiveInfoMetricKey(k)}
          />
        </div>

        {/* SECTION C — LUNAR PHASE TIMELINE */}
        <LunarPhaseTimeline
          currentPhaseId={lunarValues.moonState.phaseId}
          currentElongationDeg={lunarValues.moonState.elongationDeg}
          onJumpToPhase={jumpToPhase}
          onOpenInfo={(k) => setActiveInfoMetricKey(k)}
        />

        {/* SECTION D — TITHI EXPLORER */}
        <div ref={tithiRef}>
          <TithiExplorer
            selectedTithiIndex={selectedTithiIndex}
            onSelectTithiIndex={setSelectedTithiIndex}
            onJumpToPhase={jumpToPhase}
            onOpenInfo={(k) => setActiveInfoMetricKey(k)}
          />
        </div>

        {/* SECTION F — NAKSHATRA EXPLORER */}
        <NakshatraExplorer
          selectedNakshatraIndex={selectedNakshatraIndex}
          onSelectNakshatraIndex={setSelectedNakshatraIndex}
          onJumpToPhase={jumpToPhase}
          onOpenInfo={(k) => setActiveInfoMetricKey(k)}
        />

        {/* SECTION G — LUNAR CALENDAR VIEW (MONTHLY GRID) */}
        <div ref={calendarRef}>
          <LunarCalendarMonthView
            selectedDate={selectedDate}
            onSelectDate={jumpToDate}
            monthViewMode={monthViewMode}
            setMonthViewMode={setMonthViewMode}
            lunarMonth={lunarValues.lunarMonth}
            onOpenInfo={(k) => setActiveInfoMetricKey(k)}
          />
        </div>

        {/* SECTION H — LUNAR FESTIVAL EXPLORER */}
        <div ref={festivalsRef}>
          <LunarFestivalExplorer
            festivals={filteredFestivals}
            selectedFestival={selectedFestival}
            onSelectFestival={setSelectedFestival}
            onJumpToFestival={jumpToFestival}
            searchQuery={festivalSearchQuery}
            setSearchQuery={setFestivalSearchQuery}
            monthFilter={selectedFestivalMonthFilter}
            setMonthFilter={setSelectedFestivalMonthFilter}
            pakshaFilter={selectedFestivalPakshaFilter}
            setPakshaFilter={setSelectedFestivalPakshaFilter}
            traditionFilter={selectedFestivalTraditionFilter}
            setTraditionFilter={setSelectedFestivalTraditionFilter}
          />
        </div>

        {/* SECTION I — TRADITIONAL VS MODERN CALCULATION LAB */}
        <div ref={labRef}>
          <LunarTraditionalModernLab
            moonState={lunarValues.moonState}
            panchangLimbs={lunarValues.panchangLimbs}
            isLiveBackend={isLiveBackend}
            onOpenInfo={(k) => setActiveInfoMetricKey(k)}
          />
        </div>
      </main>

      {/* SECTION J — CALCULATION FORMULA & CITATION MODAL */}
      <LunarCalculationInfoModal
        activeMetricKey={activeInfoMetricKey}
        onClose={() => setActiveInfoMetricKey(null)}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold/15 bg-background/90 py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
          <p className="font-deva text-gold-soft">
            कलागणक (KalaGanaka) • Traditional Indian Astronomy & Modern Ephemeris
          </p>
          <p className="font-sans text-[11px] text-muted-foreground">
            Calibrated against JPL DE421 Ephemeris and Lahiri (Chitrapaksha) Ayanamsha
          </p>
        </div>
      </footer>
    </div>
  );
}
