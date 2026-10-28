import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

describe("App routing for all six KalaGanaka features", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it("matches landing page route for /", () => {
    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/");
  });

  it("matches Feature 1 route for /samrat-yantra", () => {
    const matches = router.matchRoutes("/samrat-yantra");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/samrat-yantra");
  });

  it("matches Feature 2 route for /chandra-panchang", () => {
    const matches = router.matchRoutes("/chandra-panchang");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/chandra-panchang");
  });

  it("matches Feature 3 route for /saur-panchang", () => {
    const matches = router.matchRoutes("/saur-panchang");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/saur-panchang");
  });

  it("matches Feature 4 route for /planetary-explorer", () => {
    const matches = router.matchRoutes("/planetary-explorer");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/planetary-explorer");
  });

  it("matches Feature 5 route for /festivals", () => {
    const matches = router.matchRoutes("/festivals");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/festivals");
  });

  it("matches Feature 6 route for /assistant", () => {
    const matches = router.matchRoutes("/assistant");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/assistant");
  });

  it("rejects non-existent routes with root / not found", () => {
    const matches = router.matchRoutes("/non-existent-module-path");
    expect(matches.at(-1)?.routeId).toBe(rootRouteId);
  });
});
