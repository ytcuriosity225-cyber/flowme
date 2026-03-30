"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import {
  formatDate,
  formatDisplayDate,
  getDayNumber,
  getProjection,
  getScoreLabel,
  getScoreStatus,
} from "@/lib/utils";
import gsap from "gsap";

export default function Dashboard() {
  const { todayScore, todayLog, totalSales, settings, logs } = useApp();
  const scoreRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const today = formatDate(new Date());
  const dayNum = getDayNumber(settings.startDate, today);
  const salesProgress = (totalSales / settings.goalSales) * 100;
  const projection = getProjection(
    totalSales,
    dayNum,
    settings.goalDays,
    settings.goalSales
  );

  useEffect(() => {
    // Number count-up animation
    const ctx = gsap.context(() => {
      gsap.to({}, {
        duration: 1.5,
        ease: "power3.out",
        onUpdate: function() {
          const progress = this.progress();
          setAnimatedScore(Math.round(progress * todayScore));
        }
      });

      // Progress bar animation
      gsap.fromTo(
        progressBarRef.current,
        { width: "0%" },
        { width: `${Math.min(100, salesProgress)}%`, duration: 1.5, ease: "power3.out", delay: 0.2 }
      );
    });

    return () => ctx.revert();
  }, [todayScore, salesProgress]);

  const scoreStatus = getScoreStatus(todayScore);

  return (
    <InternalLayout>
      {/* Header Stat */}
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div className="space-y-1">
          <p className="text-text-dim text-xs font-bold uppercase tracking-[0.2em]">
            Timeline Status
          </p>
          <h1 className="text-2xl font-black text-white">
            {formatDisplayDate(today)}
          </h1>
        </div>
        <div className="text-right space-y-1">
          <p className="text-text-dim text-xs font-bold uppercase tracking-[0.2em]">
            Execution Phase
          </p>
          <p className="text-2xl font-black text-white">
            DAY {dayNum} <span className="text-text-dim text-lg">/ {settings.goalDays}</span>
          </p>
        </div>
      </div>

      {/* Goal Section */}
      <div className="bg-card border border-border p-8 rounded-2xl space-y-6 relative overflow-hidden group">
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h3 className="text-white font-bold text-lg tracking-tight">
              {settings.goalSales} Sales Target
            </h3>
            <p className="text-text-muted text-sm tracking-wide">
              {totalSales} units secured so far
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-white">
              {Math.floor(salesProgress)}%
            </span>
          </div>
        </div>
        
        <div className="h-3 bg-bg rounded-full overflow-hidden border border-white/5 relative z-10">
          <div
            ref={progressBarRef}
            className="h-full bg-accent relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/5 blur-[100px] rounded-full group-hover:bg-accent/10 transition-colors duration-700" />
      </div>

      {/* Main Score Focus */}
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-text-dim text-xs font-bold uppercase tracking-[0.3em]">
          Daily Performance Index
        </p>
        <div className="text-[12rem] font-black leading-none tracking-tighter text-white tabular-nums flex items-baseline">
          <span ref={scoreRef}>{animatedScore}</span>
        </div>
        
        <div className={`px-6 py-2 rounded-full border text-sm font-black tracking-[0.2em] uppercase transition-colors duration-500 ${
          scoreStatus === "pass" 
            ? "border-green/30 bg-green/10 text-green" 
            : "border-red/30 bg-red/10 text-red"
        }`}>
          {getScoreLabel(todayScore)}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-8 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-text-dim text-xs font-bold uppercase tracking-widest mb-1">
              Sales Today
            </p>
            <p className="text-3xl font-black text-white">{todayLog.sales}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted"><path d="m12 15 2 2 4-4"/><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h1"/></svg>
          </div>
        </div>

        <div className="bg-card border border-border p-8 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-text-dim text-xs font-bold uppercase tracking-widest mb-1">
              Total Sales
            </p>
            <p className="text-3xl font-black text-white">{totalSales}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71.59-.59"/></svg>
          </div>
        </div>
      </div>

      {/* Projection Box */}
      <div className="bg-card border border-border p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-4 flex-1">
          <p className="text-text-dim text-xs font-bold uppercase tracking-widest">
            30-Day Forecast
          </p>
          <p className="text-xl font-bold text-white max-w-md">
            At current velocity, you are projected to reach <span className="text-accent underline decoration-accent/30 underline-offset-4">{projection.projected}</span> total sales.
          </p>
        </div>
        
        <div className={`px-8 py-4 rounded-xl border-2 flex flex-col items-center justify-center min-w-[160px] ${
          projection.status === "on-track" 
            ? "border-green/20 bg-green/5 text-green" 
            : projection.status === "behind"
            ? "border-yellow/20 bg-yellow/5 text-yellow"
            : "border-red/20 bg-red/5 text-red"
        }`}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Status</span>
          <span className="text-lg font-black uppercase tracking-tighter">
            {projection.status.replace("-", " ")}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-8">
        <Link 
          href="/day" 
          className="w-full bg-white text-bg font-black py-6 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all group shadow-xl"
        >
          <span className="uppercase tracking-[0.2em] text-sm">Start / Continue Execution</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>
    </InternalLayout>
  );
}
