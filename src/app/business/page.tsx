"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { BusinessWeek } from '@/types';
import { InternalLayout } from '@/components/InternalLayout';
import { HackerPanel } from '@/components/HackerPanel';
import { GlitchText } from '@/components/GlitchText';
import { CyberToggle } from '@/components/CyberToggle';
import { gsap } from 'gsap';

export default function BusinessPage() {
  const { isUnlocked, settings } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weekData, setWeekData] = useState<Omit<BusinessWeek, 'id' | 'created_at'>>({
    week_start_date: getCurrentMonday(),
    bottles_sold: 0,
    creatives_count: 0,
    landing_page_test: false,
    insights_count: 0,
    system_improvement: false,
    is_success: false,
  });

  function getCurrentMonday() {
    const d = new Date();
    const day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  useEffect(() => {
    fetchWeekData();
  }, [weekData.week_start_date]);

  async function fetchWeekData() {
    try {
      const res = await fetch(`/api/business?monday=${weekData.week_start_date}`);
      if (res.ok) {
        const data = await res.json();
        if (data) setWeekData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weekData),
      });
      if (res.ok) {
        const data = await res.json();
        setWeekData(data);
        if (settings.animationsEnabled) {
            gsap.fromTo('.success-badge', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out' });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (!isUnlocked) return null;

  return (
    <InternalLayout>
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="mb-12">
            <div className="flex items-center gap-3 mb-2">
                <span className="status-dot" />
                <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.4em]">
                    SYS_MODULE // REVENUE_ENGINE
                </p>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
                <GlitchText>BUSINESS PROTOCOL</GlitchText>
            </h1>
            <div className="h-px w-32 bg-linear-to-r from-red-500 to-transparent mt-4 opacity-50" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Core KPI Panel */}
          <HackerPanel label="ALGO::CORE_KPI" glow>
            <div className="space-y-8">
                <div>
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-4 block">
                        <GlitchText>BOTTLES_SOLD_OUTPUT</GlitchText>
                    </label>
                    <input
                        type="number"
                        value={weekData.bottles_sold}
                        onChange={(e) => setWeekData({ ...weekData, bottles_sold: parseInt(e.target.value) || 0 })}
                        className="w-full bg-black/40 p-6 rounded-none border border-(--neon-border) text-5xl font-black italic focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all outline-none"
                        style={{ color: 'var(--sys-business)' }}
                        placeholder="000"
                    />
                </div>
                
                <div className="p-4 bg-red-500/5 border-l-2 border-red-500/30">
                    <p className="text-[11px] font-mono text-text-muted leading-relaxed">
                        Scale established. Tracking distribution volume for current cycle. 
                        Target optimization pending...
                    </p>
                </div>
            </div>
          </HackerPanel>

          {/* Weekly Protocol Panel */}
          <HackerPanel label="INIT::WEEKLY_STACK" glow>
            <div className="space-y-10 py-4">
                {/* 3 Creatives */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
                        <GlitchText>3 Creatives Produced</GlitchText>
                    </span>
                    <span className="text-[10px] font-mono text-red-500">[{weekData.creatives_count}/3]</span>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <CyberToggle 
                        key={i}
                        label={`NODE_0${i}`}
                        checked={weekData.creatives_count >= i}
                        onChange={(v) => setWeekData({ ...weekData, creatives_count: v ? i : i - 1 })}
                      />
                    ))}
                  </div>
                </div>

                <div className="h-px bg-(--neon-border) opacity-20" />

                <div className="space-y-8">
                    <CyberToggle 
                        label="Landing Page Test"
                        checked={weekData.landing_page_test}
                        onChange={(v) => setWeekData({...weekData, landing_page_test: v})}
                    />

                    {/* 3 Insights */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
                                <GlitchText>3 Performance Insights</GlitchText>
                            </span>
                            <span className="text-[10px] font-mono text-white">[{weekData.insights_count}/3]</span>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                            <CyberToggle 
                                key={i}
                                label={`DATA_0${i}`}
                                checked={weekData.insights_count >= i}
                                onChange={(v) => setWeekData({ ...weekData, insights_count: v ? i : i - 1 })}
                            />
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-(--neon-border) opacity-20" />

                    <CyberToggle 
                        label="System Improvement"
                        checked={weekData.system_improvement}
                        onChange={(v) => setWeekData({...weekData, system_improvement: v})}
                    />
                </div>
            </div>
          </HackerPanel>
        </div>

        {/* Global Action Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-(--neon-border)">
          <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-text-dim">CYCLE_DATE</label>
                <input 
                    type="date" 
                    value={weekData.week_start_date}
                    onChange={(e) => setWeekData({ ...weekData, week_start_date: e.target.value })}
                    className="bg-black/50 border border-(--neon-border) text-(--neon-primary) rounded-none px-4 py-2 font-mono text-xs focus:border-(--neon-primary) outline-none"
                />
              </div>
              
              {weekData.is_success && (
                <div className="success-badge px-6 py-2 bg-green-500/10 text-green-500 border border-green-500/30 font-black italic text-[10px] uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  ✓ SUCCESS_WEEK_VALIDATED
                </div>
              )}
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="group relative px-16 py-5 bg-transparent border border-red-500/50 text-red-500 font-black italic uppercase tracking-[0.3em] hover:bg-red-500 hover:text-black transition-all disabled:opacity-50 overflow-hidden"
          >
            <span className="relative z-10">{saving ? 'UPLOADING...' : '[ EXECUTE_SAVE ]'}</span>
            <div className="absolute inset-0 bg-red-500/20 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>
        </div>
      </div>
    </InternalLayout>
  );
}
