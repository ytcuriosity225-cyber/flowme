"use client";

import { useEffect } from "react";
import { MatrixRain } from "./MatrixRain";
import { ScanlineOverlay } from "./ScanlineOverlay";
import { playBlip, playChirp, setAudioPreferences, startAmbientHum } from "@/lib/audio";
import { useApp } from "@/context/AppContext";

/**
 * GlobalEffects — Renders the Matrix Rain background and CRT Scanline overlay.
 * Also manages global sound effects for all interactive elements.
 * Must be placed inside AppProvider since these components read settings.
 */
export function GlobalEffects() {
  const { settings } = useApp();

  // Sync audio preferences from settings
  useEffect(() => {
    setAudioPreferences({
      uiFeedbackSounds: settings.audio.uiFeedbackSounds,
      aiVoiceNarrator: settings.audio.aiVoiceNarrator,
    });

    // Auto-start ambient hum if enabled
    if (settings.audio.ambientHum) {
      startAmbientHum();
    }
  }, [settings.audio]);

  // Global sound effects for all interactive elements
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
