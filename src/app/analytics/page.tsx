"use client";

import { useApp } from "@/context/AppContext";
import { InternalLayout } from "@/components/InternalLayout";
import { useMemo } from "react";
import { getScoreColor } from "@/lib/utils";

export default function AnalyticsPage() {
  const { logs } = useApp();

  const stats = useMemo(() => {
    // Sort logs purely by date
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime()
    );

    let currentStreak = 0;
    let bestStreak = 0;
    let failDaysCount = 0;

    let tempStreak = 0;
    for (const log of sortedLogs) {
      if (log.score >= 70) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        failDaysCount++;
        tempStreak = 0;
      }
    }

    // Current streak from the most recent day backwards
    let streakCount = 0;
    for (let i = sortedLogs.length - 1; i >= 0; i--) {
      if (sortedLogs[i].score >= 70) {
        streakCount++;
      } else {
        break;
      }
    }
    currentStreak = streakCount;

    // 7-Day Average
    const last7Logs = sortedLogs.slice(-7);
    const avgScore7Days =
      last7Logs.length > 0
        ? Math.round(
            last7Logs.reduce((acc, log) => acc + log.score, 0) /
              last7Logs.length
          )
        : 0;

    return {
      sortedLogs,
      currentStreak,
      bestStreak,
      failDaysCount,
      avgScore7Days,
    };
  }, [logs]);

  // SVG Chart Setup
  const chartHeight = 300;
  const chartWidth = 1000;
  const yPadding = 40; // padding top and bottom

  const chartData = stats.sortedLogs;
  const pathData = useMemo(() => {
    if (chartData.length === 0) return "";
    if (chartData.length === 1) {
      // Just put it in the middle if there's only 1 point
      const y = chartHeight - yPadding - (chartData[0].score / 100) * (chartHeight - 2 * yPadding);
      return `M ${chartWidth / 2} ${y} L ${chartWidth / 2} ${y}`;
    }

    const dx = chartWidth / (chartData.length - 1);
    
    return chartData
      .map((log, i) => {
        const x = i * dx;
        // Map score 0-100 to y coordinate (flipped, so 100 is at top)
        const y = chartHeight - yPadding - (log.score / 100) * (chartHeight - 2 * yPadding);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [chartData, chartHeight, chartWidth, yPadding]);

  const fillPathData = useMemo(() => {
    if (!pathData || chartData.length < 2) return "";
    return `${pathData} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
  }, [pathData, chartData, chartWidth, chartHeight]);

  return (
    <InternalLayout>
      <div className="space-y-12">
        <div className="flex justify-between items-end border-b border-white/5 pb-8">
          <div className="space-y-1">
            <p className="text-text-dim text-xs font-black uppercase tracking-[0.2em]">
              Performance Telemetry
            </p>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              Analytics
            </h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            label="Avg Score (7d)"
            value={stats.avgScore7Days.toString()}
            subtext="Performance Index"
            color={getScoreColor(stats.avgScore7Days)}
          />
          <StatCard
            label="Current Streak"
            value={stats.currentStreak.toString()}
            subtext="Consecutive passes"
            color="#22c55e"
          />
          <StatCard
            label="Best Streak"
            value={stats.bestStreak.toString()}
            subtext="All-time high"
            color="#eab308"
          />
          <StatCard
            label="Fail Days"
            value={stats.failDaysCount.toString()}
            subtext="Below threshold"
            color="#ef4444"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-card border border-border p-8 rounded-2xl space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
              Score Trajectory
            </h3>
            <div className="text-[10px] font-black uppercase tracking-widest text-text-dim flex gap-4">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-border" /> Performance Base Line</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> Index Score</span>
            </div>
          </div>

          <div className="relative w-full h-[300px] border border-white/5 bg-bg/50 rounded-xl overflow-hidden">
            {chartData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-text-dim font-bold uppercase tracking-widest text-xs">
                Insufficient Data for Telemetry
              </div>
            ) : (
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
                className="overflow-visible"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Threshold lines */}
                <line x1="0" y1={chartHeight - yPadding - 0.7 * (chartHeight - 2 * yPadding)} x2={chartWidth} y2={chartHeight - yPadding - 0.7 * (chartHeight - 2 * yPadding)} stroke="currentColor" className="text-yellow/30" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1={chartHeight - yPadding - 0.85 * (chartHeight - 2 * yPadding)} x2={chartWidth} y2={chartHeight - yPadding - 0.85 * (chartHeight - 2 * yPadding)} stroke="currentColor" className="text-green/30" strokeWidth="1" strokeDasharray="4 4" />

                {/* Area Fill */}
                {chartData.length >= 2 && (
                  <path
                    d={fillPathData}
                    fill="url(#chartGradient)"
                  />
                )}

                {/* Line */}
                {pathData && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Points */}
                {chartData.map((log, i) => {
                  const x = chartData.length === 1 ? chartWidth / 2 : i * (chartWidth / (chartData.length - 1));
                  const y = chartHeight - yPadding - (log.score / 100) * (chartHeight - 2 * yPadding);
                  
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="var(--color-bg)"
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            )}
            
            {/* Overlay grid lines / purely decorative UI details */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
            <div className="absolute inset-y-0 left-0 w-px bg-white/10" />
          </div>
        </div>
      </div>
    </InternalLayout>
  );
}

function StatCard({ label, value, subtext, color }: { label: string; value: string; subtext: string; color: string }) {
  return (
    <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between group hover:border-white/10 transition-colors">
       <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">{label}</span>
       <div className="mt-4 mb-1">
         <span className="text-4xl font-black tabular-nums tracking-tighter" style={{ color }}>{value}</span>
       </div>
       <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-tight">{subtext}</span>
    </div>
  );
}
