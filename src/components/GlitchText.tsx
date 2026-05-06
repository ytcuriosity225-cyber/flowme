"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { playBlip } from "@/lib/audio";

interface GlitchTextProps {
  children: string;
  className?: string;
  speed?: number;
}

/**
 * GlitchText — Text component that triggers a brief RGB-split 
 * glitch animation using GSAP when hovered.
 */
export function GlitchText({ children, className = "", speed = 0.15 }: GlitchTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseEnter = contextSafe(() => {
    if (!textRef.current) return;

    playBlip();

    const tl = gsap.timeline();
    tl.to(textRef.current, {
      x: () => (Math.random() - 0.5) * 10,
      y: () => (Math.random() - 0.5) * 5,
      scaleY: 1.2,
      skewX: 10,
      duration: speed,
      color: "var(--neon-accent)",
      textShadow: "2px 0 var(--neon-primary), -2px 0 #ff003c",
    })
    .to(textRef.current, {
      x: 0,
      y: 0,
      scaleY: 1,
      skewX: 0,
      duration: speed,
      color: "inherit",
      textShadow: "0 0 0px transparent",
    });
  });

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`relative inline-block cursor-default ${className}`}
    >
      <span ref={textRef} className="block transition-colors duration-300">
        {children}
      </span>
      {/* Decorative scanline overlay specifically for this text */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 bg-linear-to-b from-transparent via-(--neon-primary) to-transparent h-px top-1/2 animate-scan" />
    </div>
  );
}
