"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TRANSITION_KEY = "hol-route-transition";

export function RouteTransitionController() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    const hasPendingTransition =
      window.sessionStorage.getItem(TRANSITION_KEY) === "1" ||
      root.classList.contains("route-leaving");

    if (!hasPendingTransition) {
      return;
    }

    root.classList.remove("route-leaving");
    root.classList.add("route-transitioning", "route-entering");
    window.sessionStorage.removeItem(TRANSITION_KEY);

    const frameOne = window.requestAnimationFrame(() => {
      const frameTwo = window.requestAnimationFrame(() => {
        root.classList.remove("route-entering");

        window.setTimeout(() => {
          root.classList.remove("route-transitioning");
        }, 700);
      });

      return () => window.cancelAnimationFrame(frameTwo);
    });

    return () => {
      window.cancelAnimationFrame(frameOne);
    };
  }, [pathname]);

  return null;
}
