"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import { CalendarLog } from "@/types";

export default function CalendarPage() {
  const { isUnlocked } = useApp();
  const [logs, setLogs] = useState<CalendarLog[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarLog | null>(null);

  useEffect(() => {
    if (isUnlocked) fetchLogs();
  }, [isUnlocked]);

  async function fetchLogs() {
    try {
      const res = await fetch('/api/calendar');
      const data = await res.json();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  // Generate days for current month (May 2026 for example)
  const daysInMonth = 31;
  const monthName = "May 2026";
  const startDayPadding = 5; // May 1 2026 is Friday (Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5)

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `2026-05-${day.toString().padStart(2, "0")}`;
    const log = logs.find((l) => l.log_date === dateStr);
    return { day, dateStr, log };
  });

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  if (!isUnlocked) return null;

  return (
    <InternalLayout>
      <div className="space-y-12">
        <header className="flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <p className="text-text-dim text-xs font-black uppercase tracking-widest">Execution History</p>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">{monthName}</h1>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-text-dim uppercase">Business</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-text-dim uppercase">Study</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-text-dim uppercase">Tech</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((wd) => (
            <div key={wd} className="text-center py-4 text-[10px] font-black text-text-dim tracking-widest">
              {wd}
            </div>
          ))}

          {Array.from({ length: startDayPadding }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square bg-white/2 border border-white/5 rounded-2xl opacity-20" />
          ))}

          {calendarDays.map(({ day, log }) => {
            return (
              <button
                key={day}
                onClick={() => log && setSelectedDay(log)}
                className={`aspect-square rounded-2xl border transition-all flex flex-col p-4 group relative overflow-hidden bg-white/3 border-white/5 hover:border-white/20`}
              >
                <span className="text-lg font-black text-white">{day}</span>
                
                <div className="mt-auto flex gap-1 items-center">
                  {log?.business_score ? <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> : null}
                  {log?.study_score ? <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> : null}
                  {log?.tech_score ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
          <div className="bg-bg-card border border-white/10 w-full max-w-xl rounded-3xl p-10 shadow-2xl relative">
            <button onClick={() => setSelectedDay(null)} className="absolute top-6 right-6 text-white hover:text-red-500">
               ✕
            </button>
            
            <h2 className="text-3xl font-black text-white italic uppercase mb-8">{selectedDay.log_date}</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-red-500">Business Score</span>
                <span className="text-2xl font-black text-white">{selectedDay.business_score}%</span>
              </div>
              <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-blue-500">Study Score</span>
                <span className="text-2xl font-black text-white">{selectedDay.study_score}%</span>
              </div>
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-emerald-500">Tech Score</span>
                <span className="text-2xl font-black text-white">{selectedDay.tech_score}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </InternalLayout>
  );
}
