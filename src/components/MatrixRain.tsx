"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";

const CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const FONT_SIZE = 14;
const DROP_SPEED = 0.6;
const REPULSION_RADIUS = 120;
const REPULSION_STRENGTH = 8;

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const dropsRef = useRef<number[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const { settings } = useApp();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(settings.animationsEnabled);
  }, [settings.animationsEnabled]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

      const columns = Math.floor(canvas.width / FONT_SIZE);
      dropsRef.current = Array.from({ length: columns }, () =>
        Math.random() * -100
      );
    }

    resize();
    window.addEventListener("resize", resize);

    const FRAME_INTERVAL = 1000 / 24;

    function draw(timestamp: number) {
      if (!ctx || !canvas) return;

      const elapsed = timestamp - lastFrameTimeRef.current;
      if (elapsed < FRAME_INTERVAL) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      const computedStyle = getComputedStyle(document.documentElement);
      const charColor = computedStyle.getPropertyValue("--matrix-char-color").trim() || "#00FF41";

      // Trailing fade effect
      ctx.fillStyle = "rgba(5, 5, 8, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

      const drops = dropsRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const baseX = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        // Calculate distance from mouse for repulsion
        const dx = baseX - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let offsetX = 0;
        let offsetY = 0;
        let alphaMultiplier = 1;

        if (dist < REPULSION_RADIUS && dist > 0) {
          const force = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH;
          offsetX = (dx / dist) * force;
          offsetY = (dy / dist) * force * 0.5;
          // Fade characters near the cursor
          alphaMultiplier = 0.2 + (dist / REPULSION_RADIUS) * 0.8;
        }

        const x = baseX + offsetX;

        // Head character: bright
        ctx.fillStyle = charColor;
        ctx.globalAlpha = 0.9 * alphaMultiplier;
        ctx.fillText(char, x, y + offsetY);

        // Trail character: dimmer
        if (drops[i] > 1) {
          const prevChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.globalAlpha = 0.15 * alphaMultiplier;
          ctx.fillText(prevChar, x, (drops[i] - 1) * FONT_SIZE + offsetY);
        }

        ctx.globalAlpha = 1;

        // Move drop down
        drops[i] += DROP_SPEED;

        // Reset drop when it goes off screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.random() * -20;
        }
      }

      // Draw a subtle glow circle at cursor position
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, REPULSION_RADIUS
        );
        gradient.addColorStop(0, `${charColor}08`);
        gradient.addColorStop(0.5, `${charColor}03`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(
          mouse.x - REPULSION_RADIUS,
          mouse.y - REPULSION_RADIUS,
          REPULSION_RADIUS * 2,
          REPULSION_RADIUS * 2
        );
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
