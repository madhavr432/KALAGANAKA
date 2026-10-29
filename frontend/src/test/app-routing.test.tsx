import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

describe("App routing for KalaGanaka features", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it("matches landing page route for /", () => {
    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/");
  });

  it("matches Module 1 Timekeeping route for /timekeeping", () => {
    const matches = router.matchRoutes("/timekeeping");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/timekeeping");
  });

  it("matches Module 2 Lunar route for /chandra-panchang", () => {
    const matches = router.matchRoutes("/chandra-panchang");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/chandra-panchang");
  });

  it("matches Module 3 Solar route for /saur-panchang", () => {
    const matches = router.matchRoutes("/saur-panchang");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/saur-panchang");
  });

  it("matches Module 5 Astronomy Lab route for /astronomy-lab", () => {
    const matches = router.matchRoutes("/astronomy-lab");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/astronomy-lab");
  });

  it("matches Analysis Lab alias route for /analysis-lab", () => {
    const matches = router.matchRoutes("/analysis-lab");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/analysis-lab");
  });

  it("matches AI Assistant route for /assistant", () => {
    const matches = router.matchRoutes("/assistant");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/assistant");
  });

  it("rejects removed routes and non-existent paths with root / not found", () => {
    const matchesPlanets = router.matchRoutes("/planetary-explorer");
    expect(matchesPlanets.at(-1)?.routeId).toBe(rootRouteId);

    const matchesFestivals = router.matchRoutes("/festivals");
    expect(matchesFestivals.at(-1)?.routeId).toBe(rootRouteId);

    const matchesNonExistent = router.matchRoutes("/non-existent-module-path");
    expect(matchesNonExistent.at(-1)?.routeId).toBe(rootRouteId);
  });
});
