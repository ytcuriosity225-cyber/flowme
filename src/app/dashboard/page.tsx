"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import gsap from "gsap";

export default function Dashboard() {
  const { isUnlocked } = useApp();
  const [scores, setScores] = useState({
    business: 0,
    study: 0,
    tech: 0
  });

  useEffect(() => {
    if (!isUnlocked) return;
    fetchDashboardData();
  }, [isUnlocked]);

  async function fetchDashboardData() {
    try {
      // For dashboard, we get the latest scores or current week average
      const [busRes, studyRes, techRes] = await Promise.all([
        fetch('/api/business'),
        fetch('/api/study'),
        fetch('/api/tech')
      ]);

      const busData = await busRes.json();
      const studyData = await studyRes.json();
      const techData = await techRes.json();

      // Calculation logic for summary scores
      const latestBus = busData.length > 0 ? (busData[0]?.is_success ? 100 : 0) : 0;
      const avgStudy = studyData.length > 0 ? Math.round(studyData.reduce((a: any, b: any) => a + (b.score || 0), 0) / studyData.length) : 0;
      const techCompletedCount = techData.filter((p: any) => p.is_completed).length;
      const techScore = Math.round((techCompletedCount / 13) * 100);

      setScores({
        business: latestBus,
        study: avgStudy,
        tech: techScore
      });

      // Animate cards
      gsap.from('.score-card', { 
        y: 20, 
        opacity: 0, 
        stagger: 0.2, 
        duration: 0.8, 
        ease: 'power3.out' 
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (!isUnlocked) return null;

  return (
    <InternalLayout>
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
          FlowMe Command Center
        </h1>
        <p className="text-text-muted mt-2">Unified Performance Matrix</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Business Score */}
        <Link href="/business" className="score-card bg-bg-card border border-red-500/10 p-8 rounded-3xl relative overflow-hidden group hover:border-red-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          </div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">Business Momentum</span>
          <div className="text-6xl font-black text-white mb-4">{scores.business}%</div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${scores.business}%` }} />
          </div>
        </Link>

        {/* Study Score */}
        <Link href="/study" className="score-card bg-bg-card border border-blue-500/10 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block mb-1">Study War Mode</span>
          <div className="text-6xl font-black text-white mb-4">{scores.study}%</div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${scores.study}%` }} />
          </div>
        </Link>

        {/* Tech Score */}
        <Link href="/tech" className="score-card bg-bg-card border border-emerald-500/10 p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-1">Tech Beast Progress</span>
          <div className="text-6xl font-black text-white mb-4">{scores.tech}%</div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${scores.tech}%` }} />
          </div>
        </Link>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Execution Calendar", href: "/calendar" },
          { label: "Performance Analytics", href: "/analytics" },
          { label: "Systems Settings", href: "/settings" },
        ].map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className="p-10 bg-white/5 border border-white/5 rounded-3xl hover:bg-white hover:text-black transition-all group flex flex-col justify-center items-center text-center gap-2"
          >
            <span className="text-sm font-black uppercase tracking-[0.2em]">{item.label}</span>
          </Link>
        ))}
      </div>
    </InternalLayout>
  );
}
