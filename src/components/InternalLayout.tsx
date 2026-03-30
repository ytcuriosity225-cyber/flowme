"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "./Sidebar";
import gsap from "gsap";

export function InternalLayout({ children }: { children: React.ReactNode }) {
  const { isUnlocked } = useApp();
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

  useEffect(() => {
    if (shouldRender) {
      gsap.fromTo(
        ".page-content",
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [pathname, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto page-content p-10">
        <div className="max-w-6xl mx-auto space-y-12 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
