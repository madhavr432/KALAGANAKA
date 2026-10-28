/**
 * SolarCalendarPage.tsx
 * Master Page Component for Module 2: Solar Calendar & Solar Festivals.
 * Integrates:
 * 1. Hero with editorial context and navigation CTAs.
 * 2. 3D Solar Orbit centerpiece (Earth revolution, constant 23.44° axial tilt, equinoxes/solstices).
 * 3. Temporal & geographic controls with observatory presets.
 * 4. 12-sign Nirayana Rashi calendar explorer with regional names.
 * 5. Solar festivals discovery with multi-filters and detail modals.
 * 6. Traditional Surya Siddhanta vs Modern JPL DE421 ephemeris comparison.
 * 7. Beginner-friendly astronomical learning panel.
 * 8. "ⓘ" calculation explanation modals.
 */

import React, { useRef } from "react";
import { NavigationHeader } from "@/components/NavigationHeader";
import { SolarYearHero } from "./components/SolarYearHero";
import { SolarOrbitContainer } from "./components/SolarOrbitContainer";
import { SolarDateControls } from "./components/SolarDateControls";
import { SolarCalendarExplorer } from "./components/SolarCalendarExplorer";
import { SolarFestivalExplorer } from "./components/SolarFestivalExplorer";
import { TraditionalModernComparison } from "./components/TraditionalModernComparison";
import { AstronomyLearningPanel } from "./components/AstronomyLearningPanel";
import { SolarCalculationInfoModal } from "./components/SolarCalculationInfo";
import { useSolarCalendarState } from "./hooks/useSolarCalendarState";
import { useSolarCalendarApi } from "./hooks/useSolarCalendarApi";
import { X, Sparkles, Compass, Calendar, ArrowRight } from "lucide-react";

export function SolarCalendarPage() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const festivalsRef = useRef<HTMLDivElement>(null);

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
    selectedRashiIndex,
    setSelectedRashiIndex,
    selectedFestival,
    setSelectedFestival,
    activeInfoMetricKey,
    setActiveInfoMetricKey,
    activeStationModal,
    setActiveStationModal,
    festivalSearchQuery,
    setFestivalSearchQuery,
    selectedRegionFilter,
    setSelectedRegionFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedTraditionFilter,
    setSelectedTraditionFilter,
    stepDay,
    stepMonth,
    setDayOfYear,
    resetToToday,
    jumpToStation,
    jumpToFestival,
    presets,
    allFestivals,
  } = useSolarCalendarState();

  const { apiState, solarValues } = useSolarCalendarApi({
    selectedDate,
    selectedTime,
    latitude,
    longitude,
    elevation_m,
    timezone,
    isPlaying,
  });

  const handleExploreCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDiscoverFestivals = () => {
    festivalsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground antialiased selection:bg-gold/30 selection:text-gold-light">
      {/* Background Subtle Stars */}
      <div className="stars pointer-events-none fixed inset-0 opacity-40" aria-hidden />

      {/* Main Responsive Navigation Bar */}
      <NavigationHeader
        currentFeature="saur-panchang"
        title="सौर संवत्सर"
        subtitle="Solar Calendar & Festivals"
      />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 pb-16 pt-4">
        {/* Section A: Hero */}
        <SolarYearHero
          solarValues={solarValues}
          onExploreCalendar={handleExploreCalendar}
          onDiscoverFestivals={handleDiscoverFestivals}
        />

        {/* Section B: Centerpiece Interactive Solar-Year Orbit Explorer */}
        <SolarOrbitContainer
          solarValues={solarValues}
          selectedDate={selectedDate}
          isPlaying={isPlaying}
          onTogglePlayback={togglePlayback}
          playbackSpeed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          onDayOfYearChange={setDayOfYear}
          onSelectStation={jumpToStation}
          onResetCamera={resetCamera}
          onOpenInfo={setActiveInfoMetricKey}
        />

        {/* Section C: Date, Time & Location Controls */}
        <SolarDateControls
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedTime={selectedTime}
          onTimeChange={setSelectedTime}
          selectedPresetId={selectedPresetId}
          onPresetChange={applyPreset}
          presets={presets}
          onStepDay={stepDay}
          onStepMonth={stepMonth}
          onResetToday={resetToToday}
          apiState={apiState}
        />

        {/* Section D: Solar Calendar & 12-Sign Zodiac Explorer */}
        <div ref={calendarRef} className="scroll-mt-20">
          <SolarCalendarExplorer
            solarValues={solarValues}
            selectedRashiIndex={selectedRashiIndex}
            onSelectRashiIndex={setSelectedRashiIndex}
            onOpenInfo={setActiveInfoMetricKey}
          />
        </div>

        {/* Section E: Solar Festivals Explorer */}
        <div ref={festivalsRef} className="scroll-mt-20">
          <SolarFestivalExplorer
            festivals={allFestivals}
            selectedFestival={selectedFestival}
            onSelectFestival={setSelectedFestival}
            onJumpToFestival={jumpToFestival}
            searchQuery={festivalSearchQuery}
            onSearchChange={setFestivalSearchQuery}
            regionFilter={selectedRegionFilter}
            onRegionChange={setSelectedRegionFilter}
            categoryFilter={selectedCategoryFilter}
            onCategoryChange={setSelectedCategoryFilter}
            traditionFilter={selectedTraditionFilter}
            onTraditionChange={setSelectedTraditionFilter}
            onOpenInfo={setActiveInfoMetricKey}
          />
        </div>

        {/* Section F: Traditional vs Modern Astronomy Comparison */}
        <TraditionalModernComparison
          comparisonData={apiState.comparisonData}
          solarValues={solarValues}
          selectedDate={selectedDate}
          isBackendConnected={apiState.isBackendConnected}
          onOpenInfo={setActiveInfoMetricKey}
        />

        {/* Section G: Beginner-Friendly Learning Panel */}
        <AstronomyLearningPanel />
      </main>

      {/* "ⓘ" Calculation Information Modal */}
      <SolarCalculationInfoModal
        metricKey={activeInfoMetricKey}
        onClose={() => setActiveInfoMetricKey(null)}
      />

      {/* Astronomical Station Event Modal (Equinox/Solstice click) */}
      {activeStationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveStationModal(null)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gold/40 bg-[#090e18] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gold/20 pb-3">
              <div>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                  Tropical {activeStationModal.tropicalLongitudeDeg}° •{" "}
                  {activeStationModal.approximateDate}
                </span>
                <h3 className="font-deva text-xl text-gold-gradient mt-1">
                  {activeStationModal.name}
                </h3>
                <p className="font-deva text-xs text-gold-soft">
                  {activeStationModal.sanskritName}
                </p>
              </div>
              <button
                onClick={() => setActiveStationModal(null)}
                className="rounded-full border border-gold/20 p-1.5 text-gold-soft hover:bg-gold/10 hover:text-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-muted-foreground">
              <div className="rounded-xl border border-gold/15 bg-gold/5 p-3.5">
                <strong className="text-gold block font-sans mb-1 uppercase tracking-wider text-[11px]">
                  Physical & Astronomical Event
                </strong>
                <p className="text-foreground/90">{activeStationModal.description}</p>
              </div>

              <div className="rounded-xl border border-gold/15 bg-[#0c1424] p-3.5">
                <strong className="text-gold-soft block font-sans mb-1 uppercase tracking-wider text-[11px]">
                  Seasonal & Hemisphere Significance
                </strong>
                <p>{activeStationModal.hemisphereSignificance}</p>
              </div>

              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3.5">
                <strong className="text-sky-300 block font-sans mb-1 uppercase tracking-wider text-[11px]">
                  Indian Astronomical Context (सिद्धान्त ग्रन्थ)
                </strong>
                <p>{activeStationModal.indianAstronomicalContext}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end border-t border-gold/15 pt-3">
              <button
                onClick={() => setActiveStationModal(null)}
                className="rounded-lg bg-gold-gradient px-4 py-1.5 font-sans text-xs font-bold text-slate-950 shadow-md hover:opacity-90"
              >
                Close Station
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold/15 bg-background/90 py-8 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div>
            <p className="font-deva text-gold-soft text-sm">
              कलागणक (KalaGanaka) • सौर संवत्सर एवं सौर पञ्चाङ्ग
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Traditional Indian Saur Mana calibrated with NASA JPL DE421 Ephemeris and Lahiri
              Ayanamsha
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="rounded bg-gold/10 border border-gold/20 px-2 py-0.5 text-amber-200">
              Module 2: Complete
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
