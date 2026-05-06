"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { HUD } from "./HUD";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { playBlip, playChirp } from "@/lib/audio";

export function InternalLayout({ children }: { children: React.ReactNode }) {
  const { isUnlocked, settings } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isUnlocked) {
      router.push("/");
    } else {
      setShouldRender(true);
    }
  }, [isUnlocked, router]);

  useGSAP(() => {
    if (shouldRender && settings.animationsEnabled) {
      gsap.fromTo(
        ".page-content",
        { opacity: 0, y: 15, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "expo.out" }
      );
    }
  }, { dependencies: [pathname, shouldRender, settings.animationsEnabled] });

  if (!shouldRender) return null;

  return (
    <div className="min-h-screen relative flex flex-col" style={{ zIndex: 1 }}>
      <main className="flex-1 overflow-y-auto page-content p-6 md:p-12">
        <div className="max-w-7xl mx-auto space-y-12 pb-32">
          {children}
        </div>
      </main>

      {/* Floating HUD Navigation */}
      <HUD />

      {/* Global Grain/Noise Overlay handled by Layout body class */}
    </div>
  );
}
