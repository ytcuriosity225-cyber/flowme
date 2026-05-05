"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { BusinessWeek } from '@/types';
import { formatDate } from '@/lib/utils';
import { gsap } from 'gsap';

import { InternalLayout } from '@/components/InternalLayout';

export default function BusinessPage() {
  const { isUnlocked } = useApp();
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
        gsap.fromTo('.success-badge', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out' });
      }
    } catch (err) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <InternalLayout>
      <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Business Weekly Tracker
        </h1>
        <p className="text-text-muted mt-2">Scale the engine. Track the growth.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Card: KPI */}
        <div className="bg-bg-card p-8 rounded-2xl border border-white/5 shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Core KPI
          </h2>
          <div className="space-y-4">
            <label className="block text-sm text-text-muted">Bottles Sold</label>
            <input
              type="number"
              value={weekData.bottles_sold}
              onChange={(e) => setWeekData({ ...weekData, bottles_sold: parseInt(e.target.value) || 0 })}
              className="w-full bg-bg p-4 rounded-xl border border-white/10 text-3xl font-bold focus:border-red-500/50 transition-colors"
              placeholder="0"
            />
          </div>
        </div>

        {/* Right Card: Checklist */}
        <div className="bg-bg-card p-8 rounded-2xl border border-white/5 shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            Weekly Protocol
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span>3 Creatives Produced</span>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    onClick={() => setWeekData({ ...weekData, creatives_count: i === weekData.creatives_count ? i - 1 : i })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      weekData.creatives_count >= i ? 'bg-red-500 text-white' : 'bg-white/5 text-text-muted'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Landing Page Test</span>
              <button
                onClick={() => setWeekData({ ...weekData, landing_page_test: !weekData.landing_page_test })}
                className={`px-4 py-2 rounded-lg transition-all ${
                  weekData.landing_page_test ? 'bg-orange-500 text-white' : 'bg-white/5 text-text-muted'
                }`}
              >
                {weekData.landing_page_test ? 'Done' : 'Pending'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span>3 Insights Found</span>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    onClick={() => setWeekData({ ...weekData, insights_count: i === weekData.insights_count ? i - 1 : i })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      weekData.insights_count >= i ? 'bg-red-500 text-white' : 'bg-white/5 text-text-muted'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>System Improvement</span>
              <button
                onClick={() => setWeekData({ ...weekData, system_improvement: !weekData.system_improvement })}
                className={`px-4 py-2 rounded-lg transition-all ${
                  weekData.system_improvement ? 'bg-orange-500 text-white' : 'bg-white/5 text-text-muted'
                }`}
              >
                {weekData.system_improvement ? 'Implements' : 'Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input 
            type="date" 
            value={weekData.week_start_date}
            onChange={(e) => setWeekData({ ...weekData, week_start_date: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-lg p-2 text-sm"
          />
          {weekData.is_success && (
            <div className="success-badge px-4 py-1 bg-green-500/20 text-green-500 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-widest">
              Success Week ✓
            </div>
          )}
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-12 py-4 bg-white text-black font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Weekly Log'}
        </button>
      </div>
      </div>
    </InternalLayout>
  );
}
