"use client";

import { useApp, ThemeCode } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HackerPanel } from "@/components/HackerPanel";
import { GlitchText } from "@/components/GlitchText";
import { CyberToggle } from "@/components/CyberToggle";

const THEMES: { id: ThemeCode, name: string, color: string }[] = [
  { id: "cyber-green", name: "TECH-NOIR GHOST", color: "#00FF41" },
  { id: "plasma-blue", name: "PLASMA REEF", color: "#00D4FF" },
  { id: "red-sector", name: "ERROR SECTOR", color: "#FF003C" },
  { id: "amber-alert", name: "AMBER WARNING", color: "#FFB000" },
];

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData, lock, theme, setTheme } = useApp();
  const router = useRouter();

  const [password, setPassword] = useState(settings.password);
  const [goalSales, setGoalSales] = useState(settings.goalSales.toString());
  const [goalDays, setGoalDays] = useState(settings.goalDays.toString());
  const [isSaved, setIsSaved] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSave = () => {
    updateSettings({
      password,
      goalSales: parseInt(goalSales) || 300,
      goalDays: parseInt(goalDays) || 30,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    resetAllData();
    lock();
    router.push("/");
  };

  return (
    <InternalLayout>
      <div className="max-w-5xl mx-auto space-y-12 pb-20">
        <header className="mb-12">
            <div className="flex items-center gap-3 mb-2">
                <span className="status-dot" />
                <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.4em]">
                    SYS_MODULE // CONFIGURATION
                </p>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
                <GlitchText>SYSTEM SETTINGS</GlitchText>
            </h1>
            <div className="h-px w-32 bg-linear-to-r from-(--neon-primary) to-transparent mt-4 opacity-50" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Theme Selector */}
            <HackerPanel label="NEURAL::THEME_SELECTION" glow>
                <div className="grid grid-cols-1 gap-4">
                    {THEMES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`group relative h-16 border px-6 flex items-center justify-between transition-all ${
                                theme === t.id 
                                    ? "bg-white/10 border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                                    : "bg-black/40 border-(--neon-border) hover:border-white/30"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: t.color, backgroundColor: t.color }} />
                                <span className={`text-xs font-black uppercase tracking-widest ${theme === t.id ? "text-white" : "text-text-dim"}`}>
                                    {t.name}
                                </span>
                            </div>
                            {theme === t.id && (
                                <span className="text-[9px] font-black italic text-white animate-pulse">ACTIVE_PROTOCOL</span>
                            )}
                        </button>
                    ))}
                </div>
            </HackerPanel>

            <div className="space-y-10">
                {/* Access & Auth */}
                <HackerPanel label="SECURITY::VERIFICATION">
                    <div className="space-y-6">
                        <div>
                            <label className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em] mb-2 block">System Passcode</label>
                            <input 
                                type="text" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-(--neon-border) px-4 py-3 rounded-none text-white font-mono tracking-[0.4em] focus:outline-none focus:border-(--neon-primary) focus:shadow-[0_0_15px_var(--neon-glow)] transition-all"
                            />
                        </div>
                    </div>
                </HackerPanel>

                {/* Interface Toggles */}
                 <HackerPanel label="SYS::INTERFACE">
                    <div className="space-y-6">
                        <CyberToggle 
                            label="GSAP Animations"
                            checked={settings.animationsEnabled}
                            onChange={(v) => updateSettings({ animationsEnabled: v })}
                        />
                    </div>
                </HackerPanel>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Operational Targets */}
            <HackerPanel label="DATA::OBJECTIVES">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-text-dim uppercase tracking-widest block">Target Units</label>
                        <input 
                            type="number" 
                            value={goalSales}
                            onChange={(e) => setGoalSales(e.target.value)}
                            className="w-full bg-black/50 border border-(--neon-border) px-4 py-3 rounded-none text-white font-black italic text-2xl focus:outline-none focus:border-(--neon-primary) transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-text-dim uppercase tracking-widest block">Timeline (Days)</label>
                        <input 
                            type="number" 
                            value={goalDays}
                            onChange={(e) => setGoalDays(e.target.value)}
                            className="w-full bg-black/50 border border-(--neon-border) px-4 py-3 rounded-none text-white font-black italic text-2xl focus:outline-none focus:border-(--neon-primary) transition-all"
                        />
                    </div>
                </div>
            </HackerPanel>

            {/* Action Buttons */}
            <div className="flex flex-col justify-end gap-6">
                <button 
                onClick={handleSave}
                className={`group relative overflow-hidden py-5 font-black text-xs uppercase tracking-[0.4em] italic transition-all border ${
                    isSaved ? "bg-green-500 border-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.4)]" : "bg-white text-black border-white hover:bg-black hover:text-white"
                }`}
                >
                <span className="relative z-10">{isSaved ? "SYNC_COMPLETE" : "[ EXECUTE_CONFIG_SYNC ]"}</span>
                {!isSaved && <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform z-0" />}
                </button>

                <div className="border border-red-500/20 bg-red-500/5 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Danger Zone</h2>
                        <span className="text-[8px] font-mono text-red-500/50">LOGS::WIPE_READY</span>
                    </div>

                    {!showConfirmReset ? (
                        <button 
                            onClick={() => setShowConfirmReset(true)}
                            className="w-full bg-transparent border border-red-500/30 text-red-500/60 font-black py-4 text-[10px] uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all italic"
                        >
                            [ INIT_SYSTEM_RESET ]
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            <button 
                            onClick={handleReset}
                            className="flex-1 bg-red-500 text-black font-black py-4 text-[10px] uppercase tracking-widest italic shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                            >
                            [ CONFIRM_WIPE ]
                            </button>
                            <button 
                            onClick={() => setShowConfirmReset(false)}
                            className="px-8 bg-black border border-white/20 text-white font-black py-4 text-[10px] uppercase tracking-widest"
                            >
                            CANCEL
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </InternalLayout>
  );
}
