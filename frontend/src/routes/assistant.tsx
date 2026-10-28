import { createFileRoute } from "@tanstack/react-router";
import { AssistantWorkspace } from "@/components/assistant/AssistantWorkspace";
import { NavigationHeader } from "@/components/NavigationHeader";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Ask KalaGanaka — काल-संवाद सहायक | AI Astronomy Assistant" },
      {
        name: "description",
        content:
          "Bilingual educational AI assistant for traditional Indian astronomy, Surya Siddhanta principles, Panchang algorithms, and astronomical calculations in English and Hindi.",
      },
      { property: "og:title", content: "Ask KalaGanaka AI Assistant" },
      {
        property: "og:description",
        content:
          "Ask questions about traditional Indian astronomy, Sanskrit mathematics, and modern ephemeris comparisons.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      {/* Background Subtle Stars */}
      <div className="stars pointer-events-none fixed inset-0 opacity-40" aria-hidden />

      {/* Shared Navigation Header */}
      <NavigationHeader
        currentFeature="assistant"
        title="काल-संवाद सहायक"
        subtitle="AI Astronomy Assistant"
      />

      {/* Main Content Workspace Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <AssistantWorkspace />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold/15 bg-background/90 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
          <p className="font-deva text-gold-soft">
            कलागणक (KalaGanaka) • Traditional Indian Astronomy & Modern Ephemeris
          </p>
          <p className="font-sans text-[11px] text-muted-foreground">
            Bilingual AI Engine with multi-provider fallback and deterministic astronomical
            grounding
          </p>
        </div>
      </footer>
    </div>
  );
}
