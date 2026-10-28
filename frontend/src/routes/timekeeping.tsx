import { createFileRoute } from "@tanstack/react-router";
import { TimekeepingPage } from "@/modules/timekeeping/TimekeepingPage";

export const Route = createFileRoute("/timekeeping")({
  head: () => ({
    meta: [
      { title: "Ancient vs Modern Timekeeping — काल-गणना | KalaGanaka" },
      {
        name: "description",
        content:
          "Interactive 3D Konark Sun Temple Chakra and modern astronomical timekeeping simulator. Compare solar shadow geometry, Prahara timekeeping, and live ephemeris solar coordinates.",
      },
      { property: "og:title", content: "Ancient vs Modern Timekeeping — KalaGanaka" },
      {
        property: "og:description",
        content:
          "Explore the Konark Sun Temple Chakra and modern astronomical calculations in a synchronized 3D laboratory.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TimekeepingPage,
});
