/**
 * r3fSafety.ts
 * Shields React Three Fiber from reconciler crashes caused by devtools or test harnesses
 * injecting pierced data- attributes (such as data-tsd-source) into Three.js JSX nodes.
 *
 * R3F attempts to pierce dashes in props (e.g. data-tsd-source -> node.data.tsd.source).
 * Since Three.js objects do not have a .data property by default, R3F throws:
 * "Error: R3F: Cannot set 'data-tsd-source'. Ensure it is an object before setting 'source'."
 *
 * By attaching a benign recursive Proxy to the prototype of Object3D, Material, and
 * BufferGeometry, any pierced data- attributes are absorbed safely without throwing or
 * affecting the Three.js scene graph.
 */

import * as THREE from "three";

function createSafeDeepProxy(): Record<string, unknown> {
  const handler: ProxyHandler<Record<string, unknown>> = {
    get(target, prop) {
      if (
        prop === "__r3f" ||
        prop === "constructor" ||
        prop === "prototype" ||
        typeof prop === "symbol"
      ) {
        return undefined;
      }
      return safeProxy;
    },
    set() {
      return true;
    },
  };
  const safeProxy: Record<string, unknown> = new Proxy({}, handler);
  return safeProxy;
}

export function installR3fSafety(): void {
  if (typeof window === "undefined") return;

  const safeProxy = createSafeDeepProxy();
  const prototypes = [
    THREE.Object3D.prototype,
    THREE.Material.prototype,
    THREE.BufferGeometry.prototype,
  ];

  for (const proto of prototypes) {
    if (proto && !(proto as { __r3fSafetyInstalled?: boolean }).__r3fSafetyInstalled) {
      try {
        Object.defineProperty(proto, "data", {
          value: safeProxy,
          writable: true,
          configurable: true,
          enumerable: false,
        });
        (proto as { __r3fSafetyInstalled?: boolean }).__r3fSafetyInstalled = true;
      } catch {
        // Fallback for strict environments
        (proto as Record<string, unknown>).data = safeProxy;
      }
    }
  }
}

// Automatically install upon module import
installR3fSafety();
