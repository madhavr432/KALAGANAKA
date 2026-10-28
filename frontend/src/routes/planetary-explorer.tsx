import { createFileRoute } from "@tanstack/react-router";
import { PlanetaryExplorerWorkspace } from "@/components/planetary-explorer/PlanetaryExplorerWorkspace";
import { NavigationHeader } from "@/components/NavigationHeader";

export const Route = createFileRoute("/planetary-explorer")({
  head: () => ({
    meta: [
      { title: "Planetary Explorer — ग्रह मण्डल वेधशाला | KalaGanaka" },
      {
        name: "description",
        content:
          "Interactive 7 classical Grahas planetary explorer and time travel observatory comparing modern NASA/JPL DE421 ephemeris with traditional Surya Siddhanta calculations.",
      },
      { property: "og:title", content: "Planetary Explorer — KalaGanaka" },
      {
        property: "og:description",
        content:
          "Explore the 7 classical planets across time with side-by-side Surya Siddhanta and modern ephemeris comparisons.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanetaryExplorerPage,
});

function PlanetaryExplorerPage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      {/* Background Subtle Stars */}
      <div className="stars pointer-events-none fixed inset-0 opacity-40" aria-hidden />

      {/* Shared Navigation Header */}
      <NavigationHeader
        currentFeature="planetary-explorer"
        title="ग्रह मण्डल वेधशाला"
        subtitle="Planetary Explorer"
      />

      {/* Main Content Workspace Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <PlanetaryExplorerWorkspace />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold/15 bg-background/90 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
          <p className="font-deva text-gold-soft">
            कलागणक (KalaGanaka) • Traditional Indian Astronomy & Modern Ephemeris
          </p>
          <p className="font-sans text-[11px] text-muted-foreground">
            Calibrated against JPL DE421 Ephemeris and Surya Siddhanta Principles
          </p>
        </div>
      </footer>
    </div>
  );
}
