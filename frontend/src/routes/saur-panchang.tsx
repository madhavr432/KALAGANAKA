import { createFileRoute } from "@tanstack/react-router";
import { SaurPanchangWorkspace } from "@/components/saur-panchang/SaurPanchangWorkspace";
import { NavigationHeader } from "@/components/NavigationHeader";

export const Route = createFileRoute("/saur-panchang")({
  head: () => ({
    meta: [
      { title: "Saur Panchang — सौर पञ्चाङ्ग | KalaGanaka" },
      {
        name: "description",
        content:
          "Traditional Indian solar calendar (Saur Mana) tracking Nirayana solar months, the 12 Rashis, Sankranti ingress, and regional calendar conventions.",
      },
      { property: "og:title", content: "Saur Panchang — KalaGanaka" },
      {
        property: "og:description",
        content:
          "Explore traditional Indian solar months, zodiac transits, and Sankranti calculations with JPL DE421 ephemeris.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SaurPanchangPage,
});

function SaurPanchangPage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      {/* Background Subtle Stars */}
      <div className="stars pointer-events-none fixed inset-0 opacity-40" aria-hidden />

      {/* Shared Navigation Header */}
      <NavigationHeader
        currentFeature="saur-panchang"
        title="सौर पञ्चाङ्ग"
        subtitle="Solar Calendar"
      />

      {/* Main Content Workspace Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <SaurPanchangWorkspace />
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
