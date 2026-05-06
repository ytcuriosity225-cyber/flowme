"use client";

import React, { ReactNode } from "react";

interface HackerPanelProps {
  children: ReactNode;
  label?: string;
  version?: string;
  className?: string;
  glow?: boolean;
}

/**
 * HackerPanel — Reusable HUD-style container with angular corners, 
 * neon borders, and holographic label tags.
 */
export function HackerPanel({ 
  children, 
  label = "SYS::MODULE", 
  version = "v3.02", 
  className = "",
  glow = false
}: HackerPanelProps) {
  return (
    <div 
      className={`relative group/panel bg-(--bg-panel) backdrop-blur-md border border-(--neon-border) transition-all duration-500 ${
        glow ? "shadow-[0_0_20px_var(--neon-dim)]" : ""
      } hover:border-(--neon-primary) hover:shadow-[0_0_30px_var(--neon-glow)] ${className}`}
      style={{
        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
    >
      {/* Top Label Tag */}
      <div className="absolute top-0 left-0 flex items-center">
        <div className="bg-(--neon-primary) px-3 py-0.5 text-[8px] font-black text-black uppercase tracking-widest skew-x-[-15deg] origin-top-left">
          {label}
        </div>
        <div className="w-8 h-px bg-(--neon-primary) origin-left scale-x-50 group-hover/panel:scale-x-100 transition-transform duration-500" />
      </div>

      {/* Content Area */}
      <div className="p-8 pt-10">
        {children}
      </div>

      {/* Bottom Version Tag */}
      <div className="absolute bottom-1 right-3 text-[7px] font-mono text-text-dim uppercase tracking-tighter opacity-50">
        {version} // NEURO-FLOW_OS
      </div>

      {/* Decorative inner corners */}
      <div className="absolute top-4 right-4 w-1.5 h-1.5 border-t border-r border-(--neon-border) opacity-30 group-hover/panel:opacity-100 transition-opacity" />
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 border-b border-l border-(--neon-border) opacity-30 group-hover/panel:opacity-100 transition-opacity" />
    </div>
  );
}
