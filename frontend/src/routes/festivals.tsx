import { createFileRoute } from "@tanstack/react-router";
import { FestivalCalendarWorkspace } from "@/components/festivals/FestivalCalendarWorkspace";
import { NavigationHeader } from "@/components/NavigationHeader";

export const Route = createFileRoute("/festivals")({
  head: () => ({
    meta: [
      { title: "Festivals & Panchang Intelligence — पर्व एवं उत्सव | KalaGanaka" },
      {
        name: "description",
        content:
          "Traditional Indian festival calendar explaining astronomical tithi rules, regional observance variations (Amanta vs Purnimanta), and Dharmashastra principles.",
      },
      { property: "og:title", content: "Festivals — KalaGanaka" },
      {
        property: "og:description",
        content:
          "Explore traditional Indian festivals, their astronomical determination rules, and regional Panchang conventions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FestivalsPage,
});

function FestivalsPage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      {/* Background Subtle Stars */}
      <div className="stars pointer-events-none fixed inset-0 opacity-40" aria-hidden />

      {/* Shared Navigation Header */}
      <NavigationHeader
        currentFeature="festivals"
        title="पर्व एवं उत्सव"
        subtitle="Festival Calendar"
      />

      {/* Main Content Workspace Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <FestivalCalendarWorkspace />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold/15 bg-background/90 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
          <p className="font-deva text-gold-soft">
            कलागणक (KalaGanaka) • Traditional Indian Astronomy & Modern Ephemeris
          </p>
          <p className="font-sans text-[11px] text-muted-foreground">
            Curated according to Dharmasindhu, Nirnayasindhu, and Surya Siddhanta principles
          </p>
        </div>
      </footer>
    </div>
  );
}
