"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface NeonGaugeProps {
  value: number;
  label: string;
  subLabel?: string;
  color?: string;
  size?: number;
}

/**
 * NeonGauge — Circular SVG progress indicator with neon glow and 
 * animated count-up numbers.
 */
export function NeonGauge({ 
  value, 
  label, 
  subLabel, 
  color = "var(--neon-primary)", 
  size = 200 
}: NeonGaugeProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  useGSAP(() => {
    if (circleRef.current) {
        // SVG Stroke animation
        gsap.fromTo(
            circleRef.current,
            { strokeDashoffset: circumference },
            { 
                strokeDashoffset: offset, 
                duration: 1.5, 
                ease: "power2.out",
                delay: 0.2
            }
        );
    }

    if (textRef.current) {
        // Count up number
        const obj = { val: 0 };
        gsap.to(obj, {
            val: value,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.2,
            onUpdate: () => {
                if (textRef.current) textRef.current.innerText = `${Math.round(obj.val)}%`;
            }
        });
    }

    if (containerRef.current) {
        gsap.fromTo(
            containerRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }
        );
    }
  }, { dependencies: [value, circumference, offset], scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Track */}
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 200 200" 
            className="-rotate-90 opacity-10"
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-text-muted"
          />
        </svg>

        {/* Pulsing Glow Track (Hidden layer for extra bloom) */}
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 200 200" 
            className="absolute inset-0 -rotate-90 blur-md opacity-30"
        >
          <circle
            ref={circleRef}
            cx="100"
            cy="100"
            r={radius}
            stroke={color}
            strokeWidth="14"
            strokeDasharray={circumference}
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>

        {/* Primary Progress Track */}
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 200 200" 
            className="absolute inset-0 -rotate-90"
        >
          <circle
            ref={circleRef}
            cx="100"
            cy="100"
            r={radius}
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div 
            ref={textRef} 
            className="text-4xl font-black italic tracking-tighter"
            style={{ color, textShadow: `0 0 10px ${color}` }}
          >
            0%
          </div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted mt-1">
            {subLabel || "COMPLETION"}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">
            {label}
        </h3>
      </div>
    </div>
  );
}
