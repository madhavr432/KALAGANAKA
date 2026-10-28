import { createFileRoute } from "@tanstack/react-router";
import { SolarCalendarPage } from "@/modules/solar-calendar/SolarCalendarPage";

export const Route = createFileRoute("/saur-panchang")({
  head: () => ({
    meta: [
      { title: "The Solar Year & Solar Festivals — सौर संवत्सर | KalaGanaka" },
      {
        name: "description",
        content:
          "Interactive 3D Solar Orbit, Earth axial tilt, seasonal stations, Indian solar calendars (Saur Mana), Sankranti ingress, and regional solar festivals.",
      },
      { property: "og:title", content: "The Solar Year & Solar Festivals — KalaGanaka" },
      {
        property: "og:description",
        content:
          "Explore the Sun's annual journey across the ecliptic, 12 Nirayana Rashis, Ayanamsha precession, and verified Indian solar festival traditions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SolarCalendarPage,
});
