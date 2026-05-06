"use client";

import { useEffect } from "react";
import { MatrixRain } from "./MatrixRain";
import { ScanlineOverlay } from "./ScanlineOverlay";
import { playBlip, playChirp } from "@/lib/audio";

/**
 * GlobalEffects — Renders the Matrix Rain background and CRT Scanline overlay.
 * Must be placed inside AppProvider since these components read settings.
 */
export function GlobalEffects() {
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("button, a, input[type='checkbox'], input[type='radio']");
      if (interactive) {
        playChirp();
      }
    };

    const handleGlobalMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("button, a, label");
      if (interactive) {
        playBlip();
      }
    };

    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("mouseover", handleGlobalMouseOver);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("mouseover", handleGlobalMouseOver);
    };
  }, []);

  return (
    <>
      <MatrixRain />
      <ScanlineOverlay />
    </>
  );
}
