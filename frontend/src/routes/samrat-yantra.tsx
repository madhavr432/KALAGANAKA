import { createFileRoute } from "@tanstack/react-router";
import { SamratYantraWorkspace } from "@/components/samrat-yantra/SamratYantraWorkspace";
import { NavigationHeader } from "@/components/NavigationHeader";

export const Route = createFileRoute("/samrat-yantra")({
  head: () => ({
    meta: [
      { title: "Samrat Yantra Simulator — सम्राट यन्त्र | KalaGanaka" },
      {
        name: "description",
        content:
          "Interactive Samrat Yantra equinoctial sundial simulator exploring traditional Indian astronomical instruments, solar shadow geometry, Ghati timekeeping, and JPL DE421 ephemeris calculations.",
      },
      { property: "og:title", content: "Samrat Yantra Simulator — KalaGanaka" },
      {
        property: "og:description",
        content:
          "Explore the architectural astronomy of Maharaja Sawai Jai Singh's giant sundial at Jantar Mantar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SamratYantraPage,
});

function SamratYantraPage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      {/* Background Subtle Stars */}
      <div className="stars pointer-events-none fixed inset-0 opacity-40" aria-hidden />

      {/* Shared Navigation Header */}
      <NavigationHeader
        currentFeature="samrat-yantra"
        title="सम्राट यन्त्र"
        subtitle="Samrat Yantra Simulator"
      />

      {/* Main Content Workspace Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <SamratYantraWorkspace />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold/15 bg-background/90 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
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
