"use client";

import { useApp } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import { useState } from "react";
import { DayLog } from "@/types";
import { getCompletedTaskLabels, getScoreColor } from "@/lib/utils";

export default function CalendarPage() {
  const { logs, settings } = useApp();
  const [selectedDay, setSelectedDay] = useState<DayLog | null>(null);

  // April 2026
  // Starts on Wednesday (3)
  const daysInMonth = 30;
  const startDayPadding = 3; // Sun=0, Mon=1, Tue=2, Wed=3
  const monthName = "April 2026";

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `2026-04-${day.toString().padStart(2, "0")}`;
    const log = logs.find((l) => l.log_date === dateStr);
    return { day, dateStr, log };
  });

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <InternalLayout>
      <div className="space-y-12">
        <div className="flex justify-between items-end border-b border-white/5 pb-8">
          <div className="space-y-1">
            <p className="text-text-dim text-xs font-black uppercase tracking-[0.2em]">
              Historical Data
            </p>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              {monthName}
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green" />
              <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Pass</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red" />
              <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Fail</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((wd) => (
            <div key={wd} className="text-center py-4 text-[10px] font-black text-text-dim tracking-[0.2em]">
              {wd}
            </div>
          ))}

          {/* Padding for start of month */}
          {Array.from({ length: startDayPadding }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square bg-white/[0.02] border border-white/5 rounded-2xl opacity-20" />
          ))}

          {calendarDays.map(({ day, log }) => {
            const hasData = !!log;
            const isPass = hasData && log.score >= 70;
            const color = hasData ? (isPass ? "bg-green/10 border-green/30" : "bg-red/10 border-red/30") : "bg-white/[0.03] border-white/5";

            return (
              <button
                key={day}
                onClick={() => log && setSelectedDay(log)}
                disabled={!hasData}
                className={`aspect-square rounded-2xl border transition-all flex flex-col p-4 group relative overflow-hidden ${color} ${hasData ? "hover:scale-[1.05] cursor-pointer" : "cursor-default"}`}
              >
                <span className={`text-lg font-black ${hasData ? "text-white" : "text-text-dim"}`}>{day}</span>
                {hasData && (
                  <div className="mt-auto flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-text-muted">
                      Score: {log.score}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-text-dim">
                      {log.sales} Sales
                    </span>
                  </div>
                )}
                {/* Visual indicator for pass/fail */}
                {hasData && (
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${isPass ? "bg-green shadow-[0_0_10px_#22c55e]" : "bg-red shadow-[0_0_10px_#ef4444]"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-bg/80 animate-in fade-in duration-300">
          <div className="bg-card border border-border w-full max-w-xl rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setSelectedDay(null)}
              className="absolute top-6 right-6 text-text-dim hover:text-white transition-colors"
              title="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <div className="space-y-8">
              <div className="space-y-1">
                <p className="text-text-dim text-xs font-black uppercase tracking-[0.2em]">Operational Summary</p>
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{new Date(selectedDay.log_date + "T00:00:00").toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-bg border border-white/5 p-6 rounded-2xl">
                  <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] block mb-2">Performance Index</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{selectedDay.score}</span>
                    <span className="text-text-dim font-bold">/ 100</span>
                  </div>
                  <p className={`mt-2 text-xs font-black uppercase tracking-[0.2em] ${selectedDay.score >= 70 ? "text-green" : "text-red"}`}>
                    Result: {selectedDay.score >= 70 ? "Pass" : "Fail"}
                  </p>
                </div>
                <div className="bg-bg border border-white/5 p-6 rounded-2xl">
                  <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] block mb-2">Revenue Units</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{selectedDay.sales}</span>
                    <span className="text-text-dim font-bold">Sales</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] block">Completed Protocols</span>
                <div className="flex flex-wrap gap-2">
                  {getCompletedTaskLabels(selectedDay.tasks).map(label => (
                    <span key={label} className="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] font-black text-white uppercase tracking-wider">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Background detail */}
            <div
              className="absolute -bottom-20 -right-20 w-80 h-80 opacity-20 blur-[100px] rounded-full"
              style={{ backgroundColor: getScoreColor(selectedDay.score) }}
            />
          </div>
        </div>
      )}
    </InternalLayout>
  );
}
