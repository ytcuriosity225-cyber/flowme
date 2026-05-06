"use client";

import { useApp } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import { useState, useEffect, useMemo } from "react";
import { CalendarLog } from "@/types";
import { HackerPanel } from "@/components/HackerPanel";
import { GlitchText } from "@/components/GlitchText";
import { NeonGauge } from "@/components/NeonGauge";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with Recharts
const TelemetryChart = dynamic(() => import("@/components/TelemetryChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-(--neon-primary) border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function AnalyticsPage() {
  const { isUnlocked } = useApp();
  const [logs, setLogs] = useState<CalendarLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isUnlocked) {
      Promise.all([
        fetch("/api/calendar").then((r) => r.json()),
      ])
        .then(([calData]) => {
          setLogs(calData || []);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isUnlocked]);

  const stats = useMemo(() => {
    if (logs.length === 0) return { avgBus: 0, avgStudy: 0, avgTech: 0, totalDays: 0, combined: 0 };

    const sumBus = logs.reduce((acc, l) => acc + (l.business_score || 0), 0);
    const sumStudy = logs.reduce((acc, l) => acc + (l.study_score || 0), 0);
    const sumTech = logs.reduce((acc, l) => acc + (l.tech_score || 0), 0);

    const avgBus = Math.round(sumBus / logs.length);
    const avgStudy = Math.round(sumStudy / logs.length);
    const avgTech = Math.round(sumTech / logs.length);

    return {
      avgBus,
      avgStudy,
      avgTech,
      totalDays: logs.length,
      combined: Math.round((avgBus + avgStudy + avgTech) / 3),
    };
  }, [logs]);

  // Generate synthetic streaming data for visual effect when no real data
  const chartData = useMemo(() => {
    if (logs.length > 0) {
      return logs.map((log) => ({
        date: log.log_date.substring(5), // MM-DD
        business: log.business_score || 0,
        study: log.study_score || 0,
        tech: log.tech_score || 0,
      }));
    }
    // Generate placeholder data for demo
    return Array.from({ length: 14 }, (_, i) => ({
      date: `05-${String(i + 1).padStart(2, "0")}`,
      business: Math.floor(Math.random() * 40 + 30),
      study: Math.floor(Math.random() * 50 + 20),
      tech: Math.floor(Math.random() * 60 + 10),
    }));
  }, [logs]);

  if (!isUnlocked) return null;

  return (
    <InternalLayout>
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="status-dot" />
            <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.4em]">
              SYS_MODULE // TELEMETRY_CORE
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
                <GlitchText>PERFORMANCE TELEMETRY</GlitchText>
              </h1>
              <div className="h-px w-32 bg-linear-to-r from-(--neon-primary) to-transparent mt-4 opacity-50" />
            </div>
            <div className="hidden md:block">
              <NeonGauge
                value={stats.combined}
                label="OVERALL INDEX"
                subLabel="SYSTEM"
                color="var(--neon-primary)"
                size={120}
              />
            </div>
          </div>
        </header>

        {/* Primary Gauge Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <HackerPanel label="TELEMETRY::REVENUE" glow>
            <div className="flex flex-col items-center py-4">
              <NeonGauge
                value={stats.avgBus}
                label="BUSINESS"
                subLabel="MOMENTUM"
                color="var(--sys-business)"
                size={160}
              />
            </div>
          </HackerPanel>

          <HackerPanel label="TELEMETRY::COGNITION" glow>
            <div className="flex flex-col items-center py-4">
              <NeonGauge
                value={stats.avgStudy}
                label="STUDY"
                subLabel="PROGRESS"
                color="var(--sys-study)"
                size={160}
              />
            </div>
          </HackerPanel>

          <HackerPanel label="TELEMETRY::MASTERY" glow>
            <div className="flex flex-col items-center py-4">
              <NeonGauge
                value={stats.avgTech}
                label="TECH BEAST"
                subLabel="SCORE"
                color="var(--sys-tech)"
                size={160}
              />
            </div>
          </HackerPanel>
        </div>

        {/* Live Streaming Telemetry Chart */}
        <HackerPanel label="STREAM::LIVE_TELEMETRY_GRAPH" glow>
          <div className="h-[350px]">
            <TelemetryChart data={chartData} />
          </div>
        </HackerPanel>

        {/* Data Overview Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <HackerPanel label="STAT::COVERAGE">
            <div className="text-center py-4">
              <div className="text-4xl font-black text-white italic">{stats.totalDays}</div>
              <div className="text-[9px] font-black text-text-dim uppercase tracking-widest mt-2">
                DAYS RECORDED
              </div>
            </div>
          </HackerPanel>

          <HackerPanel label="STAT::PEAK_BUS">
            <div className="text-center py-4">
              <div className="text-4xl font-black text-sys-business italic">
                {logs.length > 0 ? Math.max(...logs.map((l) => l.business_score || 0)) : 0}%
              </div>
              <div className="text-[9px] font-black text-text-dim uppercase tracking-widest mt-2">
                PEAK REVENUE
              </div>
            </div>
          </HackerPanel>

          <HackerPanel label="STAT::PEAK_STUDY">
            <div className="text-center py-4">
              <div className="text-4xl font-black text-sys-study italic">
                {logs.length > 0 ? Math.max(...logs.map((l) => l.study_score || 0)) : 0}%
              </div>
              <div className="text-[9px] font-black text-text-dim uppercase tracking-widest mt-2">
                PEAK COGNITION
              </div>
            </div>
          </HackerPanel>

          <HackerPanel label="STAT::PEAK_TECH">
            <div className="text-center py-4">
              <div className="text-4xl font-black text-sys-tech italic">
                {logs.length > 0 ? Math.max(...logs.map((l) => l.tech_score || 0)) : 0}%
              </div>
              <div className="text-[9px] font-black text-text-dim uppercase tracking-widest mt-2">
                PEAK MASTERY
              </div>
            </div>
          </HackerPanel>
        </div>

        {/* System Status */}
        <div className="bg-black/60 border-l-4 border-(--neon-primary) p-8 backdrop-blur-xl">
          <div className="flex gap-4 items-center">
            <div className="text-xl" style={{ color: "var(--neon-primary)" }}>
              {">> "}
            </div>
            <div className="text-sm font-black italic text-text-muted tracking-wide">
              {loading
                ? "Streaming telemetry data from NEURO-FLOW OS neural buffers..."
                : logs.length === 0
                  ? "No performance data recorded yet. Complete tasks in Business, Study, or Tech to start building your telemetry profile."
                  : `Telemetry feed active. ${stats.totalDays} data points captured. System operating at ${stats.combined}% aggregate efficiency.`}
            </div>
          </div>
        </div>
      </div>
    </InternalLayout>
  );
}
