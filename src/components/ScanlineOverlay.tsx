"use client";

import { useApp } from "@/context/AppContext";

export function ScanlineOverlay() {
  const { settings } = useApp();

  if (!settings.animationsEnabled) return null;

  return <div className="scanline-overlay" aria-hidden="true" />;
}
