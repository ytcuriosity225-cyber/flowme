"use client";

import { useEffect, useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import gsap from "gsap";

interface AnalysisData {
  critique: string;
  advice: string;
  metrics?: {
    avgScore: number;
    avgSales: number;
    strength: string;
    weakness: string;
  };
}

export function AIAnalyst() {
  const { logs, settings } = useApp();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logs,
            userName: "Founder",
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch analysis");
        const data = await response.json();
        setAnalysis(data);

        // Animate card on mount
        if (cardRef.current) {
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setAnalysis({
          critique: "Ready to analyze your performance.",
          advice: "Complete some days of execution to get personalized insights.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [logs]);

  if (loading && !analysis) {
    return (
      <div className="bg-gradient-to-r from-purple/10 to-blue/10 border border-purple/20 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-purple border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-text-dim animate-pulse">AI Analyst is analyzing your performance...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="bg-gradient-to-br from-purple/15 to-blue/10 border border-purple/25 rounded-xl p-6 space-y-4 hover:border-purple/40 transition-all"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-purple animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-purple">AI ANALYST</span>
      </div>

      <div className="space-y-4">
        {/* Critique */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Performance Critique</p>
          <p className="text-sm leading-relaxed text-text-muted italic">{analysis?.critique}</p>
        </div>

        {/* Advice */}
        <div className="space-y-1.5 pt-3 border-t border-purple/20">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Strategic Advice</p>
          <p className="text-sm leading-relaxed text-white font-medium">{analysis?.advice}</p>
        </div>

        {/* Metrics (optional) */}
        {analysis?.metrics && (
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-purple/20">
            <div>
              <p className="text-[8px] font-bold text-text-dim uppercase">Score</p>
              <p className="text-sm font-black text-purple">{analysis.metrics.avgScore}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-text-dim uppercase">Sales</p>
              <p className="text-sm font-black text-purple">{analysis.metrics.avgSales}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-text-dim uppercase">Strong</p>
              <p className="text-[10px] font-bold text-green truncate">
                {analysis.metrics.strength.split(/(?<=[a-z])(?=[A-Z])/)[0]}
              </p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-text-dim uppercase">Weak</p>
              <p className="text-[10px] font-bold text-red truncate">
                {analysis.metrics.weakness.split(/(?<=[a-z])(?=[A-Z])/)[0]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
