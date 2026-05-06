"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useEffect, useState } from "react";

interface DataPoint {
  date: string;
  business: number;
  study: number;
  tech: number;
}

interface TelemetryChartProps {
  data: DataPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="p-4 border backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(5, 5, 8, 0.95)",
        borderColor: "var(--neon-border)",
        boxShadow: "0 0 20px var(--neon-glow), inset 0 0 10px rgba(0,0,0,0.5)",
      }}
    >
      <p
        className="text-[10px] font-black tracking-[0.3em] uppercase mb-3"
        style={{ color: "var(--neon-primary)" }}
      >
        DATE: {label}
      </p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex justify-between items-center gap-6 mb-1">
          <span
            className="text-[9px] font-black uppercase tracking-widest"
            style={{ color: entry.color }}
          >
            {entry.name}
          </span>
          <span className="text-sm font-black text-white italic">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function TelemetryChart({ data }: TelemetryChartProps) {
  const [animatedData, setAnimatedData] = useState<DataPoint[]>([]);

  // Animate data streaming in
  useEffect(() => {
    if (data.length === 0) return;

    setAnimatedData([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < data.length) {
        setAnimatedData((prev) => [...prev, data[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={animatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradBusiness" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF003C" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#FF003C" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradStudy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradTech" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00FF41" stopOpacity={0} />
          </linearGradient>
          {/* Neon glow filters */}
          <filter id="glowBus" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#FF003C" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowStudy" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#00D4FF" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowTech" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#00FF41" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          stroke="rgba(255,255,255,0.2)"
          tick={{
            fill: "rgba(255,255,255,0.3)",
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 900,
          }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />

        <YAxis
          stroke="rgba(255,255,255,0.2)"
          tick={{
            fill: "rgba(255,255,255,0.3)",
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 900,
          }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          domain={[0, 100]}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="business"
          name="REVENUE"
          stroke="#FF003C"
          strokeWidth={2}
          fill="url(#gradBusiness)"
          dot={false}
          activeDot={{ r: 4, fill: "#FF003C", stroke: "#fff", strokeWidth: 1 }}
          filter="url(#glowBus)"
          animationDuration={300}
          strokeDasharray="8 4"
        />

        <Area
          type="monotone"
          dataKey="study"
          name="COGNITION"
          stroke="#00D4FF"
          strokeWidth={2}
          fill="url(#gradStudy)"
          dot={false}
          activeDot={{ r: 4, fill: "#00D4FF", stroke: "#fff", strokeWidth: 1 }}
          filter="url(#glowStudy)"
          animationDuration={300}
          strokeDasharray="8 4"
        />

        <Area
          type="monotone"
          dataKey="tech"
          name="MASTERY"
          stroke="#00FF41"
          strokeWidth={2}
          fill="url(#gradTech)"
          dot={false}
          activeDot={{ r: 4, fill: "#00FF41", stroke: "#fff", strokeWidth: 1 }}
          filter="url(#glowTech)"
          animationDuration={300}
          strokeDasharray="8 4"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
