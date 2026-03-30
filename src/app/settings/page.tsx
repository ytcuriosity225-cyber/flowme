"use client";

import { useApp } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData, lock } = useApp();
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

  const handleToggleAnimations = () => {
    updateSettings({ animationsEnabled: !settings.animationsEnabled });
  };

  const handleReset = () => {
    resetAllData();
    lock();
    router.push("/");
  };

  return (
    <InternalLayout>
      <div className="space-y-12">
        <div className="flex justify-between items-end border-b border-white/5 pb-8">
          <div className="space-y-1">
            <p className="text-text-dim text-xs font-black uppercase tracking-[0.2em]">
              System Configuration
            </p>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              Settings
            </h1>
          </div>
        </div>

        <div className="space-y-8 max-w-2xl">
           <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
             <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-4">
               Access & Authentication
             </h2>
             
             <div className="space-y-2">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest block">System Passcode</label>
                <input 
                  type="text" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg border border-border px-4 py-3 rounded-lg text-white font-mono tracking-[0.2em] focus:outline-none focus:border-accent"
                />
             </div>
           </div>

           <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
             <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-4">
               Operational Targets
             </h2>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-dim uppercase tracking-widest block">Target Units (Sales)</label>
                  <input 
                    type="number" 
                    value={goalSales}
                    onChange={(e) => setGoalSales(e.target.value)}
                    className="w-full bg-bg border border-border px-4 py-3 rounded-lg text-white font-bold tracking-widest focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-dim uppercase tracking-widest block">Timeline (Days)</label>
                  <input 
                    type="number" 
                    value={goalDays}
                    onChange={(e) => setGoalDays(e.target.value)}
                    className="w-full bg-bg border border-border px-4 py-3 rounded-lg text-white font-bold tracking-widest focus:outline-none focus:border-accent"
                  />
                </div>
             </div>
           </div>

           <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
             <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-4">
               Interface
             </h2>
             
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white tracking-widest uppercase">GSAP Animations</p>
                  <p className="text-xs text-text-dim uppercase tracking-widest mt-1">Enable functional transitions</p>
                </div>
                <button 
                  onClick={handleToggleAnimations}
                  className={`w-14 h-8 rounded-full border-2 transition-colors relative ${settings.animationsEnabled ? "border-green bg-green/10" : "border-border bg-bg"}`}
                >
                  <div className={`w-5 h-5 rounded-full absolute top-[4px] transition-transform ${settings.animationsEnabled ? "bg-green translate-x-[26px]" : "bg-text-dim translate-x-[4px]"}`} />
                </button>
             </div>
           </div>

           <button 
             onClick={handleSave}
             className={`w-full py-5 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2 ${
               isSaved ? "bg-green text-bg" : "bg-white text-bg hover:scale-[1.01] active:scale-[0.99]"
             }`}
           >
             {isSaved ? "Configuration Updated" : "Save Configuration"}
           </button>

           <div className="pt-12">
             <div className="bg-red/5 border border-red/20 rounded-2xl p-8 space-y-6">
                <div className="space-y-1">
                  <h2 className="text-sm font-black text-red uppercase tracking-[0.2em]">
                    Danger Zone
                  </h2>
                  <p className="text-xs text-text-dim uppercase tracking-widest leading-relaxed">
                    This will permanently wipe all execution logs, revenue data, and timeline progress.
                  </p>
                </div>

                {!showConfirmReset ? (
                  <button 
                    onClick={() => setShowConfirmReset(true)}
                    className="w-full bg-bg border-2 border-red/30 text-red font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-red/10 transition-colors"
                  >
                    Initiate System Reset
                  </button>
                ) : (
                  <div className="flex gap-4">
                     <button 
                      onClick={handleReset}
                      className="flex-1 bg-red text-bg font-black py-4 rounded-xl uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Confirm Reset
                    </button>
                     <button 
                      onClick={() => setShowConfirmReset(false)}
                      className="px-8 bg-bg border border-border text-white font-bold rounded-xl uppercase tracking-widest hover:bg-white/5 transition-colors"
                    >
                      Cancel
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
