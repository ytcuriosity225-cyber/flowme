"use client";

import { useApp } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import { useState, useEffect, useMemo } from "react";
import { CalendarLog } from "@/types";

export default function AnalyticsPage() {
  const { isUnlocked } = useApp();
  const [logs, setLogs] = useState<CalendarLog[]>([]);

  useEffect(() => {
    if (isUnlocked) {
      fetch('/api/calendar')
        .then(res => res.json())
        .then(data => setLogs(data || []));
    }
  }, [isUnlocked]);

  const stats = useMemo(() => {
    if (logs.length === 0) return { avgBus: 0, avgStudy: 0, avgTech: 0, totalDays: 0 };
    
    const sumBus = logs.reduce((acc, l) => acc + (l.business_score || 0), 0);
    const sumStudy = logs.reduce((acc, l) => acc + (l.study_score || 0), 0);
    const sumTech = logs.reduce((acc, l) => acc + (l.tech_score || 0), 0);

    return {
      avgBus: Math.round(sumBus / logs.length),
      avgStudy: Math.round(sumStudy / logs.length),
      avgTech: Math.round(sumTech / logs.length),
      totalDays: logs.length
    };
  }, [logs]);

  if (!isUnlocked) return null;

  return (
    <InternalLayout>
      <div className="space-y-12">
        <div className="flex justify-between items-end border-b border-white/5 pb-8">
          <div className="space-y-1">
            <p className="text-text-dim text-xs font-black uppercase tracking-[0.2em]">
              Performance Telemetry v3.0
            </p>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              Analytics
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard 
            label="Avg Business Momentum"
            value={`${stats.avgBus}%`}
            color="#ef4444"
          />
          <StatCard 
            label="Avg Study Progress"
            value={`${stats.avgStudy}%`}
            color="#3b82f6"
          />
          <StatCard 
            label="Avg Tech Beast Score"
            value={`${stats.avgTech}%`}
            color="#10b981"
          />
        </div>

        <div className="bg-card border border-border p-12 rounded-3xl text-center">
          <p className="text-text-dim text-xs font-black uppercase tracking-[0.3em] mb-4">Data Coverage</p>
          <div className="text-5xl font-black text-white">{stats.totalDays} Days Recorded</div>
        </div>
      </div>
    </InternalLayout>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-card border border-border p-10 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-white/10 transition-all">
       <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] mb-4">{label}</span>
       <div className="text-6xl font-black tracking-tighter" style={{ color }}>{value}</div>
    </div>
  );
}
