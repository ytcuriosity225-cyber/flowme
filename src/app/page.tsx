"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import gsap from "gsap";

export default function LockScreen() {
  const [password, setPassword] = useState("");
  const { unlock, isUnlocked } = useApp();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUnlocked) {
      router.push("/dashboard");
    }
  }, [isUnlocked, router]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlock(password);

    if (success) {
      gsap.to(cardRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => router.push("/dashboard"),
      });
    } else {
      gsap.fromTo(
        cardRef.current,
        { x: -10 },
        {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.set(cardRef.current, { x: 0 });
            setPassword("");
            inputRef.current?.focus();
          },
        }
      );
    }
  };

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--color-card-hover)_0%,_var(--color-bg)_100%)]">
      <div
        ref={cardRef}
        className="w-full max-w-md bg-card border border-border p-10 rounded-2xl shadow-2xl space-y-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            FLOWME SALES
          </h1>
          <p className="text-text-muted text-sm uppercase tracking-[0.2em]">
            Personal Execution Control
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Verification Required
            </label>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER PASSCODE"
              className="w-full bg-bg border border-border px-4 py-4 rounded-lg focus:outline-none focus:border-accent text-center text-2xl font-mono tracking-[1em] transition-all"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-bg font-bold py-4 rounded-lg hover:bg-opacity-90 active:scale-[0.98] transition-all cursor-pointer text-sm uppercase tracking-widest"
          >
            Unlock Dashboard
          </button>
        </form>

        <div className="text-center">
          <p className="text-text-dim text-[10px] uppercase tracking-widest">
            Security Layer Alpha-01
          </p>
        </div>
      </div>
    </main>
  );
}
