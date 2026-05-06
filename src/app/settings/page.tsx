"use client";

import { useApp, ThemeCode } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HackerPanel } from "@/components/HackerPanel";
import { GlitchText } from "@/components/GlitchText";
import { CyberToggle } from "@/components/CyberToggle";
import { startAmbientHum, stopAmbientHum, setAudioPreferences } from "@/lib/audio";

const THEMES: { id: ThemeCode; name: string; color: string; description: string }[] = [
  { id: "cyber-green", name: "CODE_GREEN", color: "#00FF41", description: "Classic Matrix Protocol" },
  { id: "plasma-blue", name: "CODE_BLUE", color: "#00D4FF", description: "Police/Security Mode" },
  { id: "red-sector", name: "CODE_RED", color: "#FF003C", description: "War Mode / Alert State" },
  { id: "amber-alert", name: "CODE_AMBER", color: "#FFB000", description: "Warning / Standby" },
];

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData, lock, theme, setTheme } = useApp();
  const router = useRouter();

  const [password, setPassword] = useState(settings.password);
  const [goalSales, setGoalSales] = useState(settings.goalSales.toString());
  const [goalDays, setGoalDays] = useState(settings.goalDays.toString());
  const [isSaved, setIsSaved] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [themeTransition, setThemeTransition] = useState(false);

  // Sync audio preferences when settings change
  useEffect(() => {
    setAudioPreferences({
      uiFeedbackSounds: settings.audio.uiFeedbackSounds,
      aiVoiceNarrator: settings.audio.aiVoiceNarrator,
    });
  }, [settings.audio]);

  const handleThemeChange = (newTheme: ThemeCode) => {
    setThemeTransition(true);
    setTimeout(() => {
      setTheme(newTheme);
      setTimeout(() => setThemeTransition(false), 600);
    }, 300);
  };

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

  const handleAmbientToggle = (enabled: boolean) => {
    updateSettings({ audio: { ...settings.audio, ambientHum: enabled } });
    if (enabled) {
      startAmbientHum();
    } else {
      stopAmbientHum();
    }
  };

  return (
    <InternalLayout>
      {/* Theme transition overlay */}
      {themeTransition && (
        <div className="fixed inset-0 z-9998 bg-black pointer-events-none animate-pulse" />
      )}

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
          {/* Access Code (Theme Selector) */}
          <HackerPanel label="NEURAL::ACCESS_CODE_ENGINE" glow>
            <div className="space-y-3">
              <p className="text-[9px] font-mono text-text-dim mb-4 uppercase tracking-widest">
                Select operational color matrix. Persists via localStorage.
              </p>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`group relative w-full h-20 border px-6 flex items-center justify-between transition-all overflow-hidden ${
                    theme === t.id
                      ? "border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      : "bg-black/40 border-(--neon-border) hover:border-white/20"
                  }`}
                  style={theme === t.id ? { backgroundColor: `${t.color}10`, borderColor: `${t.color}60` } : {}}
                >
                  {/* Color bar on left */}
                  <div
                    className="absolute left-0 inset-y-0 w-1 transition-all"
                    style={{ backgroundColor: theme === t.id ? t.color : "transparent" }}
                  />

                  <div className="flex items-center gap-4 pl-4">
                    <div
                      className="w-4 h-4 rounded-full shadow-[0_0_12px_currentColor] transition-all"
                      style={{ color: t.color, backgroundColor: t.color }}
                    />
                    <div className="text-left">
                      <span
                        className={`text-xs font-black uppercase tracking-widest block ${
                          theme === t.id ? "text-white" : "text-text-muted"
                        }`}
                      >
                        {t.name}
                      </span>
                      <span className="text-[8px] font-mono text-text-dim uppercase">
                        {t.description}
                      </span>
                    </div>
                  </div>

                  {theme === t.id ? (
                    <span
                      className="text-[9px] font-black italic animate-pulse uppercase tracking-widest"
                      style={{ color: t.color }}
                    >
                      ACTIVE
                    </span>
                  ) : (
                    <span className="text-[8px] font-mono text-text-dim opacity-0 group-hover:opacity-100 transition-opacity">
                      [ SELECT ]
                    </span>
                  )}
                </button>
              ))}
            </div>
          </HackerPanel>

          <div className="space-y-10">
            {/* System Audio Section */}
            <HackerPanel label="AUDIO::NEURO_SENSORY" glow>
              <div className="space-y-6">
                <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest mb-4">
                  Configure system audio and haptic feedback channels.
                </p>

                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 bg-black/30 border border-(--neon-border)">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/80 block">
                        Ambient System Hum
                      </span>
                      <span className="text-[8px] font-mono text-text-dim">
                        40Hz low-frequency focus loop
                      </span>
                    </div>
                    <CyberToggle
                      checked={settings.audio.ambientHum}
                      onChange={handleAmbientToggle}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/30 border border-(--neon-border)">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/80 block">
                        UI Feedback Sounds
                      </span>
                      <span className="text-[8px] font-mono text-text-dim">
                        Blips, chirps, and mechanical clicks
                      </span>
                    </div>
                    <CyberToggle
                      checked={settings.audio.uiFeedbackSounds}
                      onChange={(v) => {
                        updateSettings({ audio: { ...settings.audio, uiFeedbackSounds: v } });
                        setAudioPreferences({ uiFeedbackSounds: v });
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/30 border border-(--neon-border)">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/80 block">
                        AI Voice Narrator
                      </span>
                      <span className="text-[8px] font-mono text-text-dim">
                        Biometric greeting and system announcements
                      </span>
                    </div>
                    <CyberToggle
                      checked={settings.audio.aiVoiceNarrator}
                      onChange={(v) => {
                        updateSettings({ audio: { ...settings.audio, aiVoiceNarrator: v } });
                        setAudioPreferences({ aiVoiceNarrator: v });
                      }}
                    />
                  </div>
                </div>
              </div>
            </HackerPanel>

            {/* Access & Auth */}
            <HackerPanel label="SECURITY::VERIFICATION">
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em] mb-2 block">
                    System Passcode
                  </label>
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
                <label className="text-[9px] font-black text-text-dim uppercase tracking-widest block">
                  Target Units
                </label>
                <input
                  type="number"
                  value={goalSales}
                  onChange={(e) => setGoalSales(e.target.value)}
                  className="w-full bg-black/50 border border-(--neon-border) px-4 py-3 rounded-none text-white font-black italic text-2xl focus:outline-none focus:border-(--neon-primary) transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-text-dim uppercase tracking-widest block">
                  Timeline (Days)
                </label>
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
                isSaved
                  ? "bg-green-500 border-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                  : "bg-white text-black border-white hover:bg-black hover:text-white"
              }`}
            >
              <span className="relative z-10">
                {isSaved ? "SYNC_COMPLETE ✓" : "[ EXECUTE_CONFIG_SYNC ]"}
              </span>
              {!isSaved && (
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform z-0" />
              )}
            </button>

            <div className="border border-red-500/20 bg-red-500/5 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">
                  Danger Zone
                </h2>
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
