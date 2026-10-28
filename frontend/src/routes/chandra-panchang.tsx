import { createFileRoute } from "@tanstack/react-router";
import { LunarCalendarPage } from "@/modules/lunar-calendar/LunarCalendarPage";

export const Route = createFileRoute("/chandra-panchang")({
  head: () => ({
    meta: [
      { title: "Lunar Calendar, Panchang & Lunar Festivals — चन्द्र पञ्चाङ्ग | KalaGanaka" },
      {
        name: "description",
        content:
          "Interactive 3D Moon explorer, five Panchang limbs (Tithi, Vara, Nakshatra, Yoga, Karana), 30 Tithis, 27 Nakshatras, monthly calendar with Amanta/Purnimanta systems, and verified Indian lunar festivals.",
      },
      { property: "og:title", content: "Lunar Calendar & Panchang — KalaGanaka" },
      {
        property: "og:description",
        content:
          "Explore traditional Indian lunar astronomy, 3D lunar phase illumination, Tithi transitions, and sacred festivals calibrated against NASA JPL DE421 ephemeris.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LunarCalendarPage,
});
