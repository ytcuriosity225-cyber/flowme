"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { playBlip, playChirp } from "@/lib/audio";

const NAV_ITEMS = [
  { label: "OS_CORE", href: "/dashboard", Icon: DashboardIcon },
  { label: "BIZ_STRATEGY", href: "/business", Icon: BusinessIcon },
  { label: "WAR_ROOM", href: "/study", Icon: StudyIcon },
  { label: "TECH_STACK", href: "/tech", Icon: TechIcon },
  { label: "TIMELINE", href: "/calendar", Icon: CalendarIcon },
  { label: "TELEMETRY", href: "/analytics", Icon: AnalyticsIcon },
  { label: "SYS_CONFIG", href: "/settings", Icon: SettingsIcon },
];

export function HUD() {
  const pathname = usePathname();
  const { lock } = useApp();
  const hudRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = React.useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    if (hudRef.current) {
      gsap.fromTo(
        hudRef.current,
        { y: 100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out", delay: 0.5 }
      );
    }
  }, { scope: hudRef });

  return (
    <nav 
      ref={hudRef}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 group"
    >
      {/* Background HUD Glass */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-3xl border border-[var(--neon-border)] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] -z-10"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      />
      
      {/* HUD Telemetry - Left */}
      <div className="hidden lg:flex flex-col items-end pr-6 gap-1 border-r border-[var(--neon-border)] h-12 justify-center opacity-70">
        <div className="text-[10px] font-black tracking-widest text-[var(--neon-primary)]">NEURO-FLOW_OS</div>
        <div className="text-[12px] font-mono text-white/80">{time}</div>
      </div>

      {/* Navigation Items */}
      <div className="flex items-center p-2 gap-1 md:gap-2">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} isActive={pathname === item.href} />
        ))}
        
        <div className="h-8 w-[1px] bg-[var(--neon-border)] mx-1 md:mx-2 opacity-50" />

        <button
          onClick={() => {
            playChirp();
            lock();
          }}
          onMouseEnter={playBlip}
          className="relative w-12 h-12 flex items-center justify-center rounded-lg text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all group/btn"
        >
          <LogOutIcon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-all scale-75 group-hover/btn:scale-100">
             <div className="bg-red-500 text-black text-[9px] font-black px-2 py-1 uppercase tracking-tighter whitespace-nowrap skew-x-[-15deg]">
               TERMINATE_SESSION
             </div>
          </div>
        </button>
      </div>

      {/* HUD Telemetry - Right */}
      <div className="hidden lg:flex flex-col items-start pl-6 gap-1 border-l border-[var(--neon-border)] h-12 justify-center opacity-70">
        <div className="flex items-center gap-2">
            <span className="status-dot scale-75" />
            <div className="text-[9px] font-black tracking-widest text-[var(--neon-accent)] uppercase">Biometric: Active</div>
        </div>
        <div className="text-[8px] font-mono text-white/40 uppercase tracking-tighter">Encrypted-Tunnel: V3.02</div>
      </div>

      {/* Decorative HUD corners */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[var(--neon-primary)] opacity-50" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[var(--neon-primary)] opacity-50" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[var(--neon-primary)] opacity-50" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[var(--neon-primary)] opacity-50" />
    </nav>
  );
}

function NavItem({ item, isActive }: { item: typeof NAV_ITEMS[0], isActive: boolean }) {
  const labelRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    playBlip();
    if (labelRef.current) {
      gsap.to(labelRef.current, {
        y: -4,
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(2)",
      });
    }
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.2,
        filter: "brightness(1.5) drop-shadow(0 0 8px var(--neon-primary))",
        duration: 0.2,
      });
    }
  };

  const handleMouseLeave = () => {
    if (labelRef.current) {
      gsap.to(labelRef.current, {
        y: 10,
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: "power2.in",
      });
    }
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1,
        filter: "brightness(1) drop-shadow(0 0 0px transparent)",
        duration: 0.2,
      });
    }
  };

  return (
    <Link
      href={item.href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={playChirp}
      className={`relative w-14 h-14 flex items-center justify-center rounded-lg transition-all group/item ${
        isActive 
          ? "bg-[var(--neon-dim)] text-[var(--neon-primary)] shadow-[inset_0_0_15px_var(--neon-glow)]" 
          : "text-[var(--color-text-muted)] hover:text-[var(--neon-primary)]"
      }`}
    >
      <div ref={iconRef}>
        <item.Icon className={`w-6 h-6 ${isActive ? "drop-shadow-[0_0_10px_var(--neon-primary)]" : ""}`} />
      </div>

      {/* Holographic Label */}
      <div 
        ref={labelRef}
        className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none"
      >
        <div className="relative">
          <div className="bg-[var(--neon-primary)] text-bg text-[10px] font-black px-3 py-1 uppercase tracking-[0.2em] skew-x-[-15deg] shadow-[0_0_20px_var(--neon-glow-strong)]">
            {item.label}
          </div>
          {/* Label Glow Tail */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[1px] h-4 bg-gradient-to-b from-[var(--neon-primary)] to-transparent" />
        </div>
      </div>

      {/* Active Indicator Underline */}
      {isActive && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[var(--neon-primary)] shadow-[0_0_10px_var(--neon-primary)]" />
      )}
    </Link>
  );
}

// Icons (Upgraded for HUD)
function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  );
}
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  );
}
function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  );
}
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}
function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
  );
}
function BusinessIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  );
}
function StudyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  );
}
function TechIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  );
}
