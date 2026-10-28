import { createFileRoute } from "@tanstack/react-router";
import { ChandraPanchangWorkspace } from "@/components/chandra-panchang/ChandraPanchangWorkspace";
import { NavigationHeader } from "@/components/NavigationHeader";

export const Route = createFileRoute("/chandra-panchang")({
  head: () => ({
    meta: [
      { title: "Chandra Panchang — चन्द्र पञ्चाङ्ग | KalaGanaka" },
      {
        name: "description",
        content:
          "Traditional Vedic lunar calendar computing Tithi, Nakshatra, Yoga, Karana, and Moon illumination calibrated with JPL DE421 ephemeris and Lahiri Chitrapaksha Ayanamsha.",
      },
      { property: "og:title", content: "Chandra Panchang — KalaGanaka" },
      {
        property: "og:description",
        content:
          "Explore the five limbs of traditional Vedic lunar timekeeping with real-time astronomical transitions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChandraPanchangPage,
});

function ChandraPanchangPage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      {/* Background Subtle Stars */}
      <div className="stars pointer-events-none fixed inset-0 opacity-40" aria-hidden />

      {/* Shared Navigation Header */}
      <NavigationHeader
        currentFeature="chandra-panchang"
        title="चन्द्र पञ्चाङ्ग"
        subtitle="Lunar Panchang"
      />

      {/* Main Content Workspace Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <ChandraPanchangWorkspace />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold/15 bg-background/90 py-6 text-center text-xs text-muted-foreground">
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
