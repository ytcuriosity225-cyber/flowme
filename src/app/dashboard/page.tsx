"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import { HackerPanel } from "@/components/HackerPanel";
import { NeonGauge } from "@/components/NeonGauge";
import { GlitchText } from "@/components/GlitchText";
import gsap from "gsap";

export default function Dashboard() {
  const { isUnlocked, settings } = useApp();
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
      const [busRes, studyRes, techRes] = await Promise.all([
        fetch('/api/business'),
        fetch('/api/study'),
        fetch('/api/tech')
      ]);

      const busData = await busRes.json();
      const studyData = await studyRes.json();
      const techData = await techRes.json();

      const latestBus = busData.length > 0 ? (busData[0]?.is_success ? 100 : 0) : 0;
      const avgStudy = studyData.length > 0 
        ? Math.round(studyData.reduce((a: number, b: { score?: number }) => a + (b.score || 0), 0) / studyData.length) 
        : 0;
      const techCompletedCount = techData.filter((p: { is_completed: boolean }) => p.is_completed).length;
      const techScore = Math.round((techCompletedCount / 13) * 100);

      setScores({
        business: latestBus,
        study: avgStudy,
        tech: techScore
      });

      if (settings.animationsEnabled) {
          gsap.from('.dashboard-section', { 
            y: 40, 
            opacity: 0, 
            stagger: 0.2, 
            duration: 1.2, 
            ease: 'expo.out' 
          });
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (!isUnlocked) return null;

  return (
    <InternalLayout>
      <header className="mb-16 dashboard-section">
        <div className="flex items-center gap-3 mb-2">
            <span className="status-dot" />
            <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.4em]">
                NEURO-FLOW_OS // CORE_INTERFACE
            </p>
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-white italic uppercase">
          <GlitchText>COMMAND CENTER</GlitchText>
        </h1>
        <div className="h-[2px] w-32 bg-linear-to-r from-(--neon-primary) to-transparent mt-4 opacity-50" />
      </header>

      {/* Main Stats Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16 dashboard-section">
        {/* Business Momentum */}
        <Link href="/business" className="block group/card">
            <HackerPanel 
                label="SYS::REVENUE_ENGINE" 
                className="h-full"
                glow
            >
                <div className="flex flex-col items-center">
                    <NeonGauge 
                        value={scores.business} 
                        label="BUSINESS MOMENTUM" 
                        subLabel="TARGET_REACHED"
                        color="var(--sys-business)"
                        size={220}
                    />
                    <div className="mt-8 w-full border-t border-(--neon-border) pt-6 flex justify-between items-center opacity-70 group-hover/card:opacity-100 transition-opacity">
                        <span className="text-[10px] font-mono text-text-muted italic uppercase">Status: </span>
                        <span className={`text-[10px] font-black ${scores.business >= 100 ? 'text-green-500' : 'text-red-500'} uppercase`}>
                            {scores.business >= 100 ? 'OPERATIONAL_EXCELLENCE' : 'UNDER_PERFORMANCE'}
                        </span>
                    </div>
                </div>
            </HackerPanel>
        </Link>

        {/* Study War Mode */}
        <Link href="/study" className="block group/card">
            <HackerPanel 
                label="SYS::WAR_MODE" 
                className="h-full"
                glow
            >
                <div className="flex flex-col items-center">
                    <NeonGauge 
                        value={scores.study} 
                        label="STUDY PROGRESS" 
                        subLabel="MASTERY_LVL"
                        color="var(--sys-study)"
                        size={220}
                    />
                    <div className="mt-8 w-full border-t border-(--neon-border) pt-6 flex justify-between items-center opacity-70 group-hover/card:opacity-100 transition-opacity">
                        <span className="text-[10px] font-mono text-text-muted italic uppercase">Protocol: </span>
                        <span className="text-[10px] font-black text-blue-500 uppercase">ACTIVE_LEARNING</span>
                    </div>
                </div>
            </HackerPanel>
        </Link>

        {/* Tech Beast */}
        <Link href="/tech" className="block group/card">
            <HackerPanel 
                label="SYS::TECH_STACK" 
                className="h-full"
                glow
            >
                <div className="flex flex-col items-center">
                    <NeonGauge 
                        value={scores.tech} 
                        label="TECH BEAST SCORE" 
                        subLabel="SYSTEM_UNLOCK"
                        color="var(--sys-tech)"
                        size={220}
                    />
                    <div className="mt-8 w-full border-t border-(--neon-border) pt-6 flex justify-between items-center opacity-70 group-hover/card:opacity-100 transition-opacity">
                        <span className="text-[10px] font-mono text-text-muted italic uppercase">Uptime: </span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase">100%_CONCENTRATION</span>
                    </div>
                </div>
            </HackerPanel>
        </Link>
      </div>

      {/* Secondary Telemetry Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 dashboard-section">
          {/* Neural Load */}
          <HackerPanel label="STAT::NEURAL_LOAD" className="h-40">
              <div className="flex flex-col justify-between h-full">
                  <div className="flex justify-between items-end">
                      <span className="text-2xl font-black italic text-white">42.8<span className="text-xs ml-1 opacity-50">THz</span></span>
                      <span className="text-[9px] font-mono text-green-500 animate-pulse">OPTIMAL</span>
                  </div>
                  <div className="space-y-1">
                      <div className="h-1 bg-white/5 w-full">
                          <div className="h-full bg-(--neon-primary) w-2/3 shadow-[0_0_10px_var(--neon-primary)]" />
                      </div>
                      <div className="text-[7px] font-mono text-text-dim uppercase flex justify-between">
                          <span>0%</span>
                          <span>LOAD_DISTRIBUTION</span>
                          <span>100%</span>
                      </div>
                  </div>
              </div>
          </HackerPanel>

          {/* Sync Latency */}
          <HackerPanel label="STAT::SYNC_LATENCY" className="h-40">
              <div className="flex flex-col justify-between h-full">
                  <div className="flex justify-between items-end">
                      <span className="text-2xl font-black italic text-white">12<span className="text-xs ml-1 opacity-50">ms</span></span>
                      <span className="text-[9px] font-mono text-(--neon-accent)">STABLE</span>
                  </div>
                  <div className="flex items-end gap-1 h-12">
                      {[15, 30, 45, 20, 60, 40, 30, 25, 50, 40].map((h, i) => (
                          <div 
                              key={i} 
                              className="flex-1 bg-(--neon-accent) opacity-40 hover:opacity-100 transition-opacity" 
                              style={{ height: `${h}%` }} 
                          />
                      ))}
                  </div>
              </div>
          </HackerPanel>

          {/* Cognitive Uptime */}
          <HackerPanel label="STAT::UPTIME" className="h-40">
              <div className="flex flex-col justify-between h-full text-center">
                  <div className="pt-2">
                       <span className="text-3xl font-black italic text-white tracking-widest">
                           18:42<span className="text-[10px] ml-1 text-red-500">HRS</span>
                       </span>
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted border-t border-(--neon-border) pt-2">
                      CONTINUOUS_STRATEGY_PUMP
                  </div>
              </div>
          </HackerPanel>

          {/* AI Buffer */}
          <HackerPanel label="STAT::BUFFER" className="h-40">
              <div className="flex items-center justify-center h-full">
                  <div className="w-12 h-12 rounded-full border-4 border-(--neon-primary) border-t-transparent animate-spin shadow-[0_0_15px_var(--neon-glow)]" />
                  <div className="ml-4 flex flex-col">
                      <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">Processing</span>
                      <span className="text-[10px] font-black text-(--neon-primary) animate-pulse">NODE_01_FEED</span>
                  </div>
              </div>
          </HackerPanel>
      </div>

      {/* Tertiary Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 dashboard-section pt-10">
          <HackerPanel label="ALGORITHM::FEED" className="min-h-[250px] lg:col-span-2">
              <div className="space-y-4">
                  {[
                      { id: 'LOG_283', msg: 'Syncing neural nodes with Supabase...', status: 'DONE' },
                      { id: 'LOG_284', msg: 'Calculating productivity entropy...', status: 'PENDING' },
                      { id: 'LOG_285', msg: 'Optimizing execution pathways...', status: 'ACTIVE' },
                  ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-(--neon-border) pb-2 opacity-60 hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-3">
                              <span className="text-[9px] font-mono text-(--neon-primary)">[{item.id}]</span>
                              <span className="text-[11px] font-mono text-white/80">{item.msg}</span>
                          </div>
                          <span className={`text-[9px] font-black uppercase ${item.status === 'DONE' ? 'text-green-500' : 'text-yellow-500 animate-pulse'}`}>
                              {item.status}
                          </span>
                      </div>
                  ))}
              </div>
          </HackerPanel>

          <HackerPanel label="SYS::DIAGNOSTIC" className="min-h-[200px]">
              <div className="flex flex-col h-full justify-between">
                  <div>
                      <p className="text-[11px] font-mono text-text-muted mb-4 leading-relaxed">
                          System diagnostics indicate peak cognitive performance levels. 
                          All performance matrices are currently being streamed to the unified dashboard.
                      </p>
                  </div>
                  <div className="flex gap-2">
                       <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                           <div className="h-full bg-(--neon-primary) w-3/4 animate-pulse" />
                       </div>
                       <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                           <div className="h-full bg-(--neon-accent) w-1/2 animate-pulse" style={{ animationDelay: '0.5s' }} />
                       </div>
                       <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                           <div className="h-full bg-red-500 w-1/4 animate-pulse" style={{ animationDelay: '1s' }} />
                       </div>
                  </div>
              </div>
          </HackerPanel>
      </div>

    </InternalLayout>
  );
}
