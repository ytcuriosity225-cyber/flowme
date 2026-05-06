"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";

const CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const FONT_SIZE = 14;
const DROP_SPEED = 0.6;

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const dropsRef = useRef<number[]>([]);
  const { settings } = useApp();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(settings.animationsEnabled);
  }, [settings.animationsEnabled]);

  useEffect(() => {
    if (!isVisible) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Reset drops on resize
      const columns = Math.floor(canvas.width / FONT_SIZE);
      dropsRef.current = Array.from({ length: columns }, () =>
        Math.random() * -100
      );
    }

    resize();
    window.addEventListener("resize", resize);

    // Target 24fps = ~41.6ms per frame
    const FRAME_INTERVAL = 1000 / 24;

    function draw(timestamp: number) {
      if (!ctx || !canvas) return;

      const elapsed = timestamp - lastFrameTimeRef.current;
      if (elapsed < FRAME_INTERVAL) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      // Read theme color from CSS variable
      const computedStyle = getComputedStyle(document.documentElement);
      const charColor = computedStyle.getPropertyValue("--matrix-char-color").trim() || "#00FF41";

      // Trailing fade effect
      ctx.fillStyle = "rgba(5, 5, 8, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

      const drops = dropsRef.current;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        // Head character: bright
        ctx.fillStyle = charColor;
        ctx.globalAlpha = 0.9;
        ctx.fillText(char, x, y);

        // Trail character: dimmer
        if (drops[i] > 1) {
          const prevChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.globalAlpha = 0.15;
          ctx.fillText(prevChar, x, (drops[i] - 1) * FONT_SIZE);
        }

        ctx.globalAlpha = 1;

        // Move drop down
        drops[i] += DROP_SPEED;

        // Reset drop when it goes off screen (with random delay)
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.random() * -20;
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: "radial-gradient(ellipse at center, rgba(10,10,15,1) 0%, #050508 100%)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.35 }}
    />
  );
}
