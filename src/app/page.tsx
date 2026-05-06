"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { NeuralFace } from "@/components/NeuralFace";
import {
  playMechanicalClick,
  playBootSound,
  playAccessGrantedSound,
  speakGreeting,
  preloadVoices,
} from "@/lib/audio";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { playBlip, playChirp } from "@/lib/audio";

// Decryption scroll lines
const DECRYPT_LINES = [
  "SYS::INIT > Loading kernel modules...",
  "NET::HANDSHAKE > Establishing secure tunnel...",
  "CRYPTO::AES256 > Decrypting biometric signature...",
  "AUTH::VERIFY > Cross-referencing neural pattern...",
  "DB::CONNECT > Supabase cluster online [latency: 12ms]",
  "SYS::FIREWALL > Intrusion detection: CLEAR",
  "MEM::ALLOC > Allocating 2.4GB execution buffer...",
  "GPU::INIT > Rendering pipeline: ACTIVE",
  "AI::CORE > Loading neural inference engine...",
  "SYS::READY > All subsystems nominal.",
  "AUTH::RESULT > ██████████████████████ MATCH FOUND",
  "",
  ">> ACCESS GRANTED",
  ">> Welcome back, Mashal.",
  ">> Loading NEURO-FLOW OS...",
];

// Typewriter boot text
const BOOT_LINES = [
  { text: "> NEURO-FLOW OS v3.0.2", delay: 0 },
  { text: "> INITIALIZING SYSTEM...", delay: 600 },
  { text: "> SECURITY LAYER: ALPHA-01", delay: 1200 },
  { text: "> STATUS: AWAITING BIOMETRIC INPUT", delay: 1800 },
];

export default function LockScreen() {
  const [password, setPassword] = useState("");
  const [phase, setPhase] = useState<"boot" | "idle" | "scanning" | "decrypting" | "granted" | "exit">("boot");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [decryptLines, setDecryptLines] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);

  const { unlock, isUnlocked, settings } = useApp();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const decryptScrollRef = useRef<HTMLDivElement>(null);

  // Redirect if already unlocked
  useEffect(() => {
    if (isUnlocked) {
      router.push("/dashboard");
    }
  }, [isUnlocked, router]);

  // Preload voices on mount
  useEffect(() => {
    preloadVoices();
    // Also preload on first interaction (for Chrome)
    const handler = () => { preloadVoices(); window.removeEventListener("click", handler); };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  // Boot sequence
  useEffect(() => {
    if (phase !== "boot") return;

    if (settings.animationsEnabled) {
      BOOT_LINES.forEach(({ text, delay }) => {
        setTimeout(() => {
          setBootLines((prev) => [...prev, text]);
        }, delay);
      });

      setTimeout(() => {
        setPhase("idle");
        setShowInput(true);
        setTimeout(() => inputRef.current?.focus(), 200);
      }, 2800);
    } else {
      // Skip boot animation
      setBootLines(BOOT_LINES.map((b) => b.text));
      setPhase("idle");
      setShowInput(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [phase, settings.animationsEnabled]);

  // Auto-scroll decrypt terminal
  useEffect(() => {
    if (decryptScrollRef.current) {
      decryptScrollRef.current.scrollTop = decryptScrollRef.current.scrollHeight;
    }
  }, [decryptLines]);

  // Focus input when idle
  useEffect(() => {
    if (phase === "idle" && showInput) {
      inputRef.current?.focus();
    }
  }, [phase, showInput]);

  const runDecryptSequence = useCallback(async () => {
    setPhase("decrypting");

    if (settings.animationsEnabled) {
      playBootSound();
    }

    // Fast-scroll through decrypt lines
    for (let i = 0; i < DECRYPT_LINES.length; i++) {
      await new Promise<void>((resolve) => {
        const delay = i < DECRYPT_LINES.length - 3 ? 120 + Math.random() * 80 : 400;
        setTimeout(() => {
          setDecryptLines((prev) => [...prev, DECRYPT_LINES[i]]);
          resolve();
        }, delay);
      });
    }

    // Grant access
    setPhase("granted");

    if (settings.animationsEnabled) {
      await playMechanicalClick();
      playAccessGrantedSound();
    }

    // AI Voice Greeting
    await speakGreeting(
      "Biometrics verified. Welcome back, Mashal. Loading your Ultimate Focus Suite."
    );

    // Exit animation
    setPhase("exit");

    if (settings.animationsEnabled && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        filter: "blur(10px)",
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => router.push("/dashboard"),
      });
    } else {
      router.push("/dashboard");
    }
  }, [settings.animationsEnabled, router]);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();

    if (phase !== "idle") return;

    playChirp();
    const success = unlock(password);

    if (success) {
      setPhase("scanning");

      // Show scanning for 1.5s, then run decrypt
      setTimeout(() => {
        runDecryptSequence();
      }, 1500);
    } else {
      // Shake + red flash
      if (settings.animationsEnabled && inputRef.current) {
        gsap.fromTo(
          inputRef.current,
          { x: -8 },
          {
            x: 8,
            duration: 0.08,
            repeat: 5,
            yoyo: true,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.set(inputRef.current, { x: 0 });
              setPassword("");
              inputRef.current?.focus();
            },
          }
        );
      } else {
        setPassword("");
        inputRef.current?.focus();
      }
    }
  };

  const isProcessing = phase === "scanning" || phase === "decrypting" || phase === "granted" || phase === "exit";

  return (
    <main
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ zIndex: 1, backgroundColor: "transparent" }}
    >
      {/* Vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: "radial-gradient(ellipse at center, transparent 40%, #050508 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg" style={{ zIndex: 3 }}>

        {/* 3D Neural Face */}
        <div
          className="w-72 h-80 mb-6 relative"
          style={{
            filter: phase === "granted"
              ? "drop-shadow(0 0 30px var(--neon-primary))"
              : phase === "scanning"
              ? "drop-shadow(0 0 15px var(--neon-glow-strong))"
              : "none",
            transition: "filter 0.5s ease",
          }}
        >
          <NeuralFace
            isScanning={phase === "scanning" || phase === "decrypting"}
            isSuccess={phase === "granted"}
            inputActive={phase === "idle" && password.length > 0}
          />

          {/* Scanning label */}
          {phase === "scanning" && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase neon-text-subtle blink">
              SCANNING BIOMETRICS...
            </div>
          )}
        </div>

        {/* Boot Sequence Text */}
        {(phase === "boot" || (phase === "idle" && !isProcessing)) && (
          <div className="w-full mb-6 space-y-1">
            {bootLines.map((line, i) => (
              <div
                key={i}
                className="text-[11px] tracking-widest uppercase"
                style={{
                  color: i === 0 ? "var(--neon-primary)" : "var(--color-text-dim)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {line}
                {i === bootLines.length - 1 && phase === "boot" && (
                  <span className="blink ml-1">█</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Decrypt Terminal */}
        {isProcessing && (
          <div
            ref={decryptScrollRef}
            className="w-full mb-6 max-h-48 overflow-y-auto rounded-lg p-4"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              border: "1px solid var(--neon-border)",
              boxShadow: "0 0 10px var(--neon-dim), inset 0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            {phase === "scanning" && decryptLines.length === 0 && (
              <div
                className="text-[11px] tracking-widest uppercase blink"
                style={{ color: "var(--neon-primary)" }}
              >
                INITIATING NEURAL SCAN...
              </div>
            )}
            {decryptLines.map((line, i) => {
              const isAccess = line.includes("ACCESS GRANTED");
              const isWelcome = line.includes("Welcome back");
              const isLoading = line.includes("Loading NEURO-FLOW");
              const isEmpty = line === "";

              return (
                <div
                  key={i}
                  className={`text-[11px] tracking-wider uppercase ${
                    isEmpty ? "h-2" : ""
                  }`}
                  style={{
                    color: isAccess
                      ? "var(--neon-primary)"
                      : isWelcome || isLoading
                      ? "var(--neon-accent)"
                      : "var(--color-text-dim)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: isAccess ? 700 : 400,
                    textShadow: isAccess
                      ? "0 0 10px var(--neon-glow-strong)"
                      : "none",
                  }}
                >
                  {line}
                </div>
              );
            })}
            {phase === "decrypting" && (
              <span className="blink text-[11px]" style={{ color: "var(--neon-primary)" }}>
                █
              </span>
            )}
          </div>
        )}

        {/* Access Granted Badge */}
        {phase === "granted" && (
          <div
            className="w-full text-center py-4 mb-6 rounded-lg"
            style={{
              backgroundColor: "var(--neon-dim)",
              border: "1px solid var(--neon-primary)",
              boxShadow: "0 0 20px var(--neon-glow-strong), 0 0 60px var(--neon-glow)",
            }}
          >
            <div
              className="text-xl font-bold tracking-[0.3em] uppercase"
              style={{
                color: "var(--neon-primary)",
                textShadow: "0 0 15px var(--neon-glow-strong)",
              }}
            >
              ✓ ACCESS GRANTED
            </div>
            <div
              className="text-[10px] tracking-[0.2em] uppercase mt-1"
              style={{ color: "var(--neon-accent)" }}
            >
              LOADING NEURO-FLOW OS...
            </div>
          </div>
        )}

        {/* Password Input Form */}
        {showInput && !isProcessing && (
          <form onSubmit={handleUnlock} className="w-full space-y-5">
            <div className="space-y-2">
              <label
                className="text-[10px] tracking-[0.3em] uppercase block"
                style={{ color: "var(--neon-primary)", fontFamily: "var(--font-mono)" }}
              >
                {"> ENTER_ACCESS_CODE:"}
              </label>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                className="w-full px-5 py-4 rounded-none text-lg tracking-[0.5em] text-center focus:outline-none transition-all"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "var(--neon-primary)",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "2px solid var(--neon-border)",
                  fontFamily: "var(--font-mono)",
                  caretColor: "var(--neon-primary)",
                  boxShadow: "0 2px 10px var(--neon-dim)",
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = "var(--neon-primary)";
                  e.target.style.boxShadow = "0 2px 20px var(--neon-glow)";
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = "var(--neon-border)";
                  e.target.style.boxShadow = "0 2px 10px var(--neon-dim)";
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 text-[11px] font-bold tracking-[0.3em] uppercase rounded-sm transition-all cursor-pointer bg-transparent text-(--neon-primary) border border-(--neon-border) font-mono hover:bg-(--neon-dim) hover:border-(--neon-primary) hover:shadow-[0_0_15px_var(--neon-glow),inset_0_0_15px_var(--neon-dim)]"
              onMouseEnter={() => {
                playBlip();
              }}
            >
              [ AUTHENTICATE ]
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <div
            className="text-[9px] tracking-[0.3em] uppercase flex items-center justify-center gap-3"
            style={{ color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}
          >
            <span className="status-dot" />
            <span>SYS::SECURITY_LAYER_01</span>
            <span style={{ color: "var(--neon-border)" }}>|</span>
            <span>ENCRYPTED</span>
            <span style={{ color: "var(--neon-border)" }}>|</span>
            <span>v3.0.2</span>
          </div>
        </div>
      </div>
    </main>
  );
}
