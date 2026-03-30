"use client";

import { useApp } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import { getTasksByCategory, getScoreColor, getScoreLabel } from "@/lib/utils";
import { TaskKey } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DayExecution() {
  const { todayLog, updateTodayTasks, updateTodaySales, saveDay, todayScore } = useApp();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(todayLog.saved);

  const highImpact = getTasksByCategory("high");
  const mediumImpact = getTasksByCategory("medium");
  const lowImpact = getTasksByCategory("low");

  const handleToggleTask = (key: TaskKey) => {
    updateTodayTasks({
      ...todayLog.tasks,
      [key]: !todayLog.tasks[key],
    });
  };

  const handleSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    updateTodaySales(val);
    
    // Automatically check "Got Sales" task if sales > 0
    if (val > 0 && !todayLog.tasks.gotSales) {
      updateTodayTasks({ ...todayLog.tasks, gotSales: true });
    } else if (val === 0 && todayLog.tasks.gotSales) {
      updateTodayTasks({ ...todayLog.tasks, gotSales: false });
    }
  };

  const handleSave = () => {
    saveDay();
    setIsSaved(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  const scoreColor = getScoreColor(todayScore);

  return (
    <InternalLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="border-b border-white/5 pb-8 flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-text-dim text-xs font-black uppercase tracking-[0.2em]">
              Operational Unit
            </p>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              Daily Execution
            </h1>
          </div>
          <div className="text-right">
             <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest block mb-0.5">Status</span>
                <span className={`text-xs font-black uppercase tracking-widest ${isSaved ? "text-green" : "text-yellow animate-pulse"}`}>
                  {isSaved ? "Synced" : "Draft"}
                </span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 max-w-4xl">
          {/* HIGH IMPACT */}
          <Section title="High Impact Protocol" subtitle="60 Points Potential">
            {highImpact.map((task) => (
              <div key={task.key} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl group hover:border-text-dim transition-all">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={todayLog.tasks[task.key]}
                      onChange={() => handleToggleTask(task.key)}
                      id={task.key}
                      className="peer h-6 w-6 opacity-0 absolute z-10 cursor-pointer"
                    />
                    <div className={`h-6 w-6 border-2 rounded flex items-center justify-center transition-all ${todayLog.tasks[task.key] ? "bg-white border-white" : "border-white/10"}`}>
                      {todayLog.tasks[task.key] && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                  </div>
                  <label htmlFor={task.key} className={`text-lg font-bold tracking-tight transition-colors cursor-pointer ${todayLog.tasks[task.key] ? "text-white" : "text-text-muted group-hover:text-text-dim"}`}>
                    {task.label}
                  </label>
                </div>
                
                <div className="flex items-center gap-6">
                  {task.key === "gotSales" && (
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">Quantity:</span>
                      <input
                        type="number"
                        value={todayLog.sales || ""}
                        onChange={handleSalesChange}
                        placeholder="0"
                        className="w-16 bg-bg border border-white/10 rounded px-2 py-1 text-center font-black text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                  )}
                  <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">+{task.weight} PTS</span>
                </div>
              </div>
            ))}
          </Section>

          {/* MEDIUM IMPACT */}
          <Section title="Baseline Operations" subtitle="28 Points Potential">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediumImpact.map((task) => (
                <TaskCard
                  key={task.key}
                  task={task}
                  checked={todayLog.tasks[task.key]}
                  onToggle={() => handleToggleTask(task.key)}
                />
              ))}
            </div>
          </Section>

          {/* LOW IMPACT */}
          <Section title="Cognitive Maintenance" subtitle="12 Points Potential">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lowImpact.map((task) => (
                <TaskCard
                  key={task.key}
                  task={task}
                  checked={todayLog.tasks[task.key]}
                  onToggle={() => handleToggleTask(task.key)}
                />
              ))}
            </div>
          </Section>
        </div>

        {/* Action Button */}
        <div className="pt-12 pb-32">
          <button
            onClick={handleSave}
            className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 ${
              isSaved 
                ? "bg-green/10 text-green border border-green/20" 
                : "bg-white text-bg hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            {isSaved ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Execution Log Secured
              </>
            ) : "Complete Daily Log"}
          </button>
        </div>
      </div>

      {/* Sticky Score Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
        <div className="max-w-6xl mx-auto flex justify-end">
           <div 
             className="pointer-events-auto bg-card border border-border px-8 py-5 rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] flex items-center gap-8 backdrop-blur-xl"
             style={{ borderTop: `2px solid ${scoreColor}` }}
           >
              <div>
                <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] block mb-1">Pass Threshold: 70</span>
                <div className="flex items-baseline gap-2">
                   <h4 className="text-3xl font-black text-white tabular-nums tracking-tighter">
                     SCORE: {todayScore}
                   </h4>
                   <span className="text-text-dim font-black text-lg">/ 100</span>
                </div>
              </div>
              
              <div className="h-10 w-px bg-white/5" />

              <div className="text-right">
                <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] block mb-1">Index Result</span>
                <span className="text-xl font-black uppercase tracking-widest" style={{ color: scoreColor }}>
                  {getScoreLabel(todayScore)}
                </span>
              </div>
           </div>
        </div>
      </div>
    </InternalLayout>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-4">
        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">{title}</h2>
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest italic">{subtitle}</span>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function TaskCard({ task, checked, onToggle }: { task: any; checked: boolean; onToggle: () => void }) {
  return (
    <div 
      onClick={onToggle}
      className={`p-5 bg-card border border-border rounded-xl cursor-pointer hover:border-white/20 transition-all flex justify-between items-start group ${checked ? "bg-white/5" : ""}`}
    >
      <div className="flex gap-4">
        <div className={`mt-1 h-4 w-4 border-2 rounded transition-all ${checked ? "bg-white border-white" : "border-white/10"}`}>
          {checked && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          )}
        </div>
        <div className="space-y-1">
          <span className={`text-sm font-black uppercase tracking-tight transition-colors ${checked ? "text-white" : "text-text-muted group-hover:text-text-dim"}`}>
            {task.label}
          </span>
        </div>
      </div>
      <span className="text-[9px] font-black text-text-dim uppercase tracking-widest">+{task.weight}</span>
    </div>
  );
}
