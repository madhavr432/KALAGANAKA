import { createFileRoute } from "@tanstack/react-router";
import { AstronomyLabPage } from "@/modules/astronomy-lab/AstronomyLabPage";

export const Route = createFileRoute("/astronomy-lab")({
  head: () => ({
    meta: [
      { title: "Ancient vs Modern Astronomy Lab — वेधशाला प्रयोगशाला | KalaGanaka" },
      {
        name: "description",
        content:
          "Explore how traditional Indian astronomical methods and modern scientific techniques calculate, measure, and interpret celestial phenomena with verified formulas, authentic instruments, and real-time ephemeris comparisons.",
      },
      {
        property: "og:title",
        content: "Ancient vs Modern Astronomy Lab — KalaGanaka",
      },
      {
        property: "og:description",
        content:
          "Side-by-side analysis of Surya Siddhanta mean motion algorithms versus NASA JPL DE421 ephemeris calculations with verified historical sources.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AstronomyLabPage,
});
