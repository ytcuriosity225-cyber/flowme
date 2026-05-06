"use client";

import { useApp } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import { CalendarLog } from "@/types";
import React, { useState, useEffect, useRef } from "react";
import { HackerPanel } from "@/components/HackerPanel";
import { GlitchText } from "@/components/GlitchText";
import gsap from "gsap";

interface CalendarDayProps {
    day: number;
    log?: CalendarLog;
    isLocked?: boolean;
    onClick: () => void;
}

function CalendarDay({ day, log, isLocked, onClick }: CalendarDayProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !innerRef.current) return;
        
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to(innerRef.current, {
            rotationY: x * 20,
            rotationX: -y * 20,
            transformPerspective: 1000,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        if (!innerRef.current) return;
        gsap.to(innerRef.current, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.6,
            ease: "power3.out"
        });
    };

    return (
        <div 
            ref={cardRef}
            className="perspective-1000 h-32 w-full cursor-pointer group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            <div 
                ref={innerRef}
                className={`relative w-full h-full p-3 border transition-all duration-300 transform-style-3d ${
                    isLocked 
                        ? 'bg-black/40 border-white/5 opacity-40' 
                        : 'bg-(--bg-panel) border-(--neon-border) group-hover:border-(--neon-primary)/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]'
                }`}
            >
                {/* Mesh Overlay for locked days */}
                {isLocked && (
                    <div className="absolute inset-0 pointer-events-none opacity-20"
                         style={{ backgroundImage: 'radial-gradient(circle, var(--neon-border) 1px, transparent 1px)', backgroundSize: '4px 4px' }} 
                    />
                )}

                <div className="flex justify-between items-start">
                    <span className={`text-xl font-black italic ${!isLocked ? 'text-white' : 'text-text-dim'}`}>
                        {day < 10 ? `0${day}` : day}
                    </span>
                    {!isLocked && log && (
                         <div className="w-1.5 h-1.5 rounded-full bg-(--neon-primary) animate-pulse shadow-[0_0_8px_var(--neon-glow)]" />
                    )}
                </div>

                {/* Micro-data bars */}
                {!isLocked && log && (
                    <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 h-1 px-1">
                        <div className="bg-sys-business h-full" style={{ width: `${log.business_score}%` }} />
                        <div className="bg-sys-study h-full" style={{ width: `${log.study_score}%` }} />
                        <div className="bg-sys-tech h-full" style={{ width: `${log.tech_score}%` }} />
                    </div>
                )}
                
                {/* Holographic scanner effect on hover */}
                {!isLocked && (
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-(--neon-primary) to-transparent opacity-0 group-hover:opacity-10 h-1 top-0 animate-scan pointer-events-none" />
                )}
            </div>
        </div>
    );
}

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

  const daysInMonth = 31;
  const monthName = "MAY_2026";
  const startDayPadding = 5; 

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `2026-05-${day.toString().padStart(2, "0")}`;
    const log = logs.find((l) => l.log_date === dateStr);
    const dateObj = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    const isLocked = dateObj > today;
    return { day, dateStr, log, isLocked };
  });

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  if (!isUnlocked) return null;

  return (
    <InternalLayout>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <header className="mb-12">
            <div className="flex items-center gap-3 mb-2">
                <span className="status-dot" />
                <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.4em]">
                    SYS_MODULE // ARCHIVE_DATALINK
                </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                   <h1 className="text-5xl font-black tracking-tighter text-white italic uppercase">
                        <GlitchText>{monthName}</GlitchText>
                    </h1>
                    <div className="h-px w-48 bg-linear-to-r from-(--neon-primary) to-transparent mt-4 opacity-50" />
                </div>
                
                <div className="flex gap-8 border-l border-(--neon-border) pl-8 opacity-60">
                    <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase text-sys-business tracking-widest">Revenue</p>
                        <div className="w-12 h-1 bg-sys-business/30 overflow-hidden"><div className="h-full bg-sys-business w-2/3" /></div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase text-sys-study tracking-widest">Cognition</p>
                        <div className="w-12 h-1 bg-sys-study/30 overflow-hidden"><div className="h-full bg-sys-study w-1/2" /></div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase text-sys-tech tracking-widest">Aura</p>
                        <div className="w-12 h-1 bg-sys-tech/30 overflow-hidden"><div className="h-full bg-sys-tech w-3/4" /></div>
                    </div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((wd) => (
            <div key={wd} className="text-center py-4 text-[9px] font-black text-text-dim tracking-[0.5em] border-b border-white/5 uppercase">
              {wd}
            </div>
          ))}

          {Array.from({ length: startDayPadding }).map((_, i) => (
            <div key={`pad-${i}`} className="h-32 w-full bg-white/2 border border-white/5 opacity-10" 
                 style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }} />
          ))}

          {calendarDays.map((dayData) => (
            <CalendarDay 
                key={dayData.day} 
                {...dayData} 
                onClick={() => dayData.log && setSelectedDay(dayData.log)} 
            />
          ))}
        </div>
      </div>

      {selectedDay && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-3xl bg-black/90">
             <HackerPanel label={`DATA_EXTRACT::${selectedDay.log_date}`} className="w-full max-w-2xl p-10 relative" glow>
                 <button 
                    onClick={() => setSelectedDay(null)} 
                    className="absolute top-6 right-6 text-text-dim hover:text-white transition-colors"
                >
                    [ DISMISS ]
                </button>
                
                <h2 className="text-4xl font-black text-white italic uppercase mb-12 tracking-tighter">
                   <GlitchText>{selectedDay.log_date}</GlitchText>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-sys-business/5 border border-sys-business/20 text-center space-y-4">
                        <span className="text-[10px] font-black text-sys-business uppercase tracking-widest block">REVENUE_OUT</span>
                        <span className="text-4xl font-black text-white italic">{selectedDay.business_score}%</span>
                    </div>
                    <div className="p-6 bg-sys-study/5 border border-sys-study/20 text-center space-y-4">
                        <span className="text-[10px] font-black text-sys-study uppercase tracking-widest block">COGNITIVE_UP</span>
                        <span className="text-4xl font-black text-white italic">{selectedDay.study_score}%</span>
                    </div>
                    <div className="p-6 bg-sys-tech/5 border border-sys-tech/20 text-center space-y-4">
                        <span className="text-[10px] font-black text-sys-tech uppercase tracking-widest block">TECH_MASTERY</span>
                        <span className="text-4xl font-black text-white italic">{selectedDay.tech_score}%</span>
                    </div>
                </div>

                <div className="mt-12 p-4 bg-white/5 border-l-2 border-white/20 italic text-[11px] text-text-muted">
                    Telemetry analysis complete. No core anomalies detected in this execution block.
                </div>
             </HackerPanel>
        </div>
      )}
    </InternalLayout>
  );
}
