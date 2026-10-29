import { createFileRoute } from "@tanstack/react-router";
import { AstronomyLabPage } from "@/modules/astronomy-lab/AstronomyLabPage";

export const Route = createFileRoute("/analysis-lab")({
  head: () => ({
    meta: [
      { title: "Analysis Lab — वेधशाला प्रयोगशाला | KalaGanaka" },
      {
        name: "description",
        content:
          "Ancient vs Modern Analysis Lab for KalaGanaka, comparing traditional Indian astronomy and NASA JPL DE421 ephemeris.",
      },
    ],
  }),
  component: AstronomyLabPage,
});
