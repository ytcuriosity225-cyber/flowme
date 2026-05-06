"use client";

import React from "react";
import { playBlip, playChirp } from "@/lib/audio";

interface CyberToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

/**
 * CyberToggle — Industrial/Cyberpunk lever-style toggle switch.
 */
export function CyberToggle({ checked, onChange, label, disabled = false }: CyberToggleProps) {
  return (
    <label className={`flex items-center gap-4 cursor-pointer group ${disabled ? 'opacity-30 pointer-events-none' : ''}`}>
      {label && (
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] group-hover:text-white transition-colors">
          {label}
        </span>
      )}
      
      <div 
        className="relative w-14 h-6 bg-black/40 border border-[var(--neon-border)] transition-all group-hover:border-[var(--neon-primary)]"
        onMouseEnter={playBlip}
        onClick={() => {
          playChirp();
          onChange(!checked);
        }}
      >
        {/* Lever Track */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <span className={`text-[8px] font-bold ${!checked ? 'text-red-500' : 'text-[var(--color-text-dim)]'}`}>OFF</span>
          <span className={`text-[8px] font-bold ${checked ? 'text-[var(--neon-primary)]' : 'text-[var(--color-text-dim)]'}`}>ON</span>
        </div>

        {/* Dynamic Lever/Knob */}
        <div 
          className={`absolute top-0.5 bottom-0.5 w-6 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
            checked 
              ? "left-[calc(100%-1.65rem)] bg-[var(--neon-primary)] shadow-[0_0_15px_var(--neon-glow-strong)]" 
              : "left-0.5 bg-[var(--color-text-dim)]"
          }`}
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", // Optional: make it angular
          }}
        />

        {/* Status Indicator Bar */}
        <div 
          className={`absolute -bottom-[2px] left-0 h-[1px] transition-all duration-500 ${
            checked ? "w-full bg-[var(--neon-primary)] shadow-[0_0_5px_var(--neon-primary)]" : "w-0 bg-transparent"
          }`} 
        />
      </div>
    </label>
  );
}
