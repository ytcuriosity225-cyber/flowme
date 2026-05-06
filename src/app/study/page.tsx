"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { StudyWeek, StudyTask } from '@/types';
import { InternalLayout } from '@/components/InternalLayout';
import { HackerPanel } from '@/components/HackerPanel';
import { NeonGauge } from '@/components/NeonGauge';
import { GlitchText } from '@/components/GlitchText';
import { CyberToggle } from '@/components/CyberToggle';
import { gsap } from 'gsap';

const MAY_STUDY_PLAN = [
  {
    week: 1,
    title: "Week 01: BRAIN_EXPOSURE",
    tasks: ["Subject Scan", "Light Understanding", "Goal: Flow over perfection"]
  },
  {
    week: 2,
    title: "Week 02: STRATEGIC_PREP",
    tasks: ["Important Topics (Scheme wise)", "Formula Memorization", "Methodology Review"]
  },
  {
    week: 3,
    title: "Week 03: WAR_PHASE",
    tasks: ["Deep Preparation", "Weak Area Fixing", "Past Paper Analysis"]
  },
  {
    week: 4,
    title: "Week 04: FINAL_ASSAULT",
    tasks: ["Self Testing (Sendups)", "Daily Revision", "Final Polish"]
  }
];

export default function StudyPage() {
  const { isUnlocked, settings } = useApp();
  const [activeWeek, setActiveWeek] = useState(1);
  const [weekData, setWeekData] = useState<StudyWeek>({
    week_number: 1,
    month_name: 'May',
    tasks: [],
    score: 0
  });
  const [loading, setLoading] = useState(true);

  const isAfterMay = new Date().getMonth() > 4;

  useEffect(() => {
    fetchWeekData();
  }, [activeWeek]);

  async function fetchWeekData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/study?week=${activeWeek}&month=May`);
      const data = await res.json();
      if (data && data.tasks) {
        setWeekData(data);
      } else {
        const plan = MAY_STUDY_PLAN.find(p => p.week === activeWeek);
        setWeekData({
          week_number: activeWeek,
          month_name: 'May',
          tasks: plan?.tasks.map((t, i) => ({ id: `${activeWeek}-${i}`, text: t, completed: false })) || [],
          score: 0
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(taskId: string) {
    if (!weekData || !weekData.tasks) return;
    const newTasks = weekData.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const completedTasks = newTasks.filter(t => t.completed).length;
    const score = Math.round((completedTasks / newTasks.length) * 100);
    
    const updatedWeek = { ...weekData, tasks: newTasks, score };
    setWeekData(updatedWeek);

    await fetch('/api/study', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedWeek),
    });
  }

  if (!isUnlocked) return null;

  return (
    <InternalLayout>
      {isAfterMay ? (
        <HackerPanel label="SYS::END_OF_CYCLE" glow className="max-w-xl mx-auto text-center py-20">
          <h2 className="text-2xl font-black text-text-muted italic uppercase mb-4">Study Season Offline.</h2>
          <p className="text-text-dim uppercase tracking-[0.3em] text-[10px]">OPERATIONAL CYCLE CONCLUDED // CHECK CALENDAR FOR TELEMETRY</p>
        </HackerPanel>
      ) : (
        <div className="max-w-5xl mx-auto space-y-12">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <span className="status-dot animate-pulse bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <p className="text-red-500/80 text-[10px] font-black uppercase tracking-[0.4em]">
                        WAR_MODE // RED_SECTOR_EXECUTION
                    </p>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
                            <GlitchText>WAR MODE: STUDY_PROTOCOL</GlitchText>
                        </h1>
                        <div className="h-px w-32 bg-linear-to-r from-red-600 to-transparent mt-4 opacity-70" />
                    </div>
                    <div className="hidden md:block">
                        <NeonGauge 
                            value={weekData.score || 0} 
                            label="WEEKLY PERFORMANCE" 
                            subLabel="MASTERY" 
                            color="var(--sys-study)"
                            size={120}
                        />
                    </div>
                </div>
            </header>

            {/* Week Selector HUD */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((w) => (
                    <button
                        key={w}
                        onClick={() => setActiveWeek(w)}
                        className={`group relative overflow-hidden h-14 border transition-all ${
                            activeWeek === w 
                                ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(0,212,255,0.2)]' 
                                : 'border-(--neon-border) bg-black/40 hover:border-blue-400/50'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <span className={`text-[10px] font-black ${activeWeek === w ? 'text-blue-400' : 'text-text-dim'}`}>
                                0{w}
                            </span>
                            <span className={`text-xs font-black uppercase tracking-widest ${activeWeek === w ? 'text-white' : 'text-text-muted opacity-50'}`}>
                                WEEK_ACCESS
                            </span>
                        </div>
                        {activeWeek === w && (
                            <div className="absolute inset-0 border-t border-l border-blue-400/50 pointer-events-none" />
                        )}
                    </button>
                ))}
            </div>

            {/* Active Tactical Objectives */}
            <HackerPanel 
                label={`OBJECTIVE::${MAY_STUDY_PLAN.find(p => p.week === activeWeek)?.title.split(': ')[1]}`} 
                glow
            >
                <div className="space-y-4">
                    {weekData.tasks?.map((task) => (
                        <div 
                            key={task.id}
                            className={`group h-20 transition-all border relative overflow-hidden flex items-center justify-between px-8 ${
                                task.completed 
                                    ? 'bg-(--neon-dim) border-(--neon-primary)/30' 
                                    : 'bg-black/20 border-(--neon-border) hover:border-(--neon-primary)/50'
                            }`}
                        >
                            <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-red-500/50 transition-all" />
                            {task.completed && <div className="absolute inset-y-0 left-0 w-1 bg-red-600" />}

                            <div className="flex-1">
                                <div className={`text-sm font-black tracking-widest uppercase transition-all ${
                                    task.completed ? 'text-red-500 opacity-60 line-through' : 'text-white'
                                }`}>
                                    {!task.completed ? <GlitchText>{task.text}</GlitchText> : task.text}
                                </div>
                                <div className="text-[9px] font-mono text-text-dim mt-1 uppercase">
                                    OBJECTIVE_PRIORITY: HIGH_SPECTRAL
                                </div>
                            </div>

                            <CyberToggle 
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                            />
                        </div>
                    ))}
                </div>
            </HackerPanel>

            {/* Motivation Feed */}
            <div className="bg-black/60 border-l-4 border-blue-500 p-8 relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-blue-500/30">ID::TERM_773</div>
                <div className="flex gap-4 items-center">
                    <div className="text-xl text-blue-500">{" >> "}</div>
                    <div className="text-sm font-black italic text-blue-400/80 tracking-wide">
                        "War is not about who is right, it's about who is left. Prepare accordingly."
                    </div>
                </div>
            </div>
        </div>
      )}
    </InternalLayout>
  );
}
