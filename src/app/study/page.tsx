"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { StudyWeek, StudyTask } from '@/types';
import { gsap } from 'gsap';
import { InternalLayout } from '@/components/InternalLayout';

const MAY_STUDY_PLAN = [
  {
    week: 1,
    title: "Week 1: Brain Exposure",
    tasks: ["Subject Scan", "Light Understanding", "Goal: Flow over perfection"]
  },
  {
    week: 2,
    title: "Week 2: Strategic Preparation",
    tasks: ["Important Topics (Scheme wise)", "Formula Memorization", "Methodology Review"]
  },
  {
    week: 3,
    title: "Week 3: War Phase",
    tasks: ["Deep Preparation", "Weak Area Fixing", "Past Paper Analysis"]
  },
  {
    week: 4,
    title: "Week 4: Final Assault",
    tasks: ["Self Testing (Sendups)", "Daily Revision", "Final Polish"]
  }
];

export default function StudyPage() {
  const { isUnlocked } = useApp();
  const [activeWeek, setActiveWeek] = useState(1);
  const [weekData, setWeekData] = useState<StudyWeek>({
    week_number: 1,
    month_name: 'May',
    tasks: [],
    score: 0
  });
  const [loading, setLoading] = useState(true);

  const isMay = new Date().getMonth() === 4; // 0-indexed, May is 4
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
        // Initialize new week data
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

    // Save to API
    await fetch('/api/study', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedWeek),
    });
  }

  return (
    <InternalLayout>
      {isAfterMay ? (
        <div className="p-8 text-center bg-card border border-border rounded-3xl">
          <h2 className="text-2xl font-bold text-text-muted italic uppercase">Study Season Over.</h2>
          <p className="mt-2 text-text-dim uppercase tracking-widest text-xs">Check calendar for results.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter bg-linear-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            WAR MODE: STUDY
          </h1>
          <p className="text-text-muted font-mono text-sm mt-1">Status: Active (Month: May)</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-black text-white">{weekData.score || 0}%</div>
          <div className="text-xs uppercase font-bold text-blue-500">Weekly Score</div>
        </div>
      </header>

      {/* Week Navigation */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((w) => (
          <button
            key={w}
            onClick={() => setActiveWeek(w)}
            className={`p-4 rounded-xl border font-bold transition-all ${
              activeWeek === w 
                ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-bg-card border-white/5 text-text-muted hover:border-white/20'
            }`}
          >
            WEEK {w}
          </button>
        ))}
      </div>

      {/* active week detail */}
      <div className="bg-bg-card border border-white/5 rounded-2xl p-8 study-card shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 italic text-white flex items-center gap-3">
          <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
          {MAY_STUDY_PLAN.find(p => p.week === activeWeek)?.title}
        </h2>

        <div className="space-y-4">
          {weekData.tasks?.map((task) => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-6 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                task.completed 
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                  : 'bg-white/5 border-white/5 text-text-muted hover:border-white/10'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                task.completed ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/20'
              }`}>
                {task.completed && '✓'}
              </div>
              <span className={`text-lg font-medium ${task.completed ? 'line-through opacity-50' : ''}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 text-sm text-blue-400 font-mono italic">
        "War is not about who is right, it's about who is left. Prepare accordingly."
      </div>
        </div>
      )}
    </InternalLayout>
  );
}
