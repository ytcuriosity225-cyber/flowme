"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { TechProgress } from '@/types';
import { InternalLayout } from '@/components/InternalLayout';
import { HackerPanel } from '@/components/HackerPanel';
import { GlitchText } from '@/components/GlitchText';
import { NeonGauge } from '@/components/NeonGauge';
import gsap from 'gsap';

const PHASES = [
  {
    id: 1,
    title: "PHASE_01 // BACKEND_FOUNDATION",
    items: [
      { id: "v1", title: "Sheriyan Backend Project", youtubeId: "0IciwnJ6PJI", isCertification: false },
      { id: "c1", title: "FreeCodeCamp Backend Course", youtubeId: "", isCertification: true, requiresCert: true }
    ]
  },
  {
    id: 2,
    title: "PHASE_02 // FRONTEND_ANIMATIONS",
    items: [
      { id: "v2", title: "React + GSAP Animated Websites", youtubeId: "NjqjakgPL84", isCertification: false },
      { id: "c2", title: "FreeCodeCamp Frontend Course", youtubeId: "", isCertification: true, requiresCert: true }
    ]
  },
  {
    id: 3,
    title: "PHASE_03 // JAVASCRIPT_MASTERY",
    items: [
      { id: "v3", title: "JavaScript Full Mastery", youtubeId: "a-wVHL0lpb0", isCertification: false },
      { id: "c3", title: "FreeCodeCamp JavaScript Certificate", youtubeId: "", isCertification: true, requiresCert: true }
    ]
  },
// ... truncated phases for brief demonstration or keep them all if needed
  {
    id: 4,
    title: "PHASE_04 // PYTHON_DATA_SYSTEMS",
    items: [
      { id: "v4", title: "Python Learning", youtubeId: "_aWbUudZ5Yo", isCertification: false },
      { id: "c4", title: "FreeCodeCamp Python Certificate", youtubeId: "", isCertification: true, requiresCert: true },
      { id: "v5", title: "NumPy Mastery", youtubeId: "Utgwk0r9Zq4", isCertification: false }
    ]
  },
  {
    id: 5,
    title: "PHASE_05 // GENERATIVE_AI_PROTOCOL",
    items: [
      { id: "v6", title: "GenAI Project 1", youtubeId: "vwncYfhxbR0", isCertification: false },
      { id: "v7", title: "GenAI Project 2", youtubeId: "yodh-oEFnb4", isCertification: false },
      { id: "v8", title: "GenAI Project 3", youtubeId: "CUDT5E6jz84", isCertification: false }
    ]
  },
  {
    id: 6,
    title: "PHASE_06 // ADVANCED_AGENT_ARCH",
    items: [
      { id: "v9", title: "Multi-Agent Systems (LangChain)", youtubeId: "P22qI2RnNjA", isCertification: false }
    ]
  }
];

export default function TechPage() {
  const { isUnlocked, settings } = useApp();
  const [progress, setProgress] = useState<TechProgress[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string, youtubeId: string, title: string, isCert: boolean } | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    fetchProgress();
    loadYouTubeAPI();
  }, []);

  function loadYouTubeAPI() {
    if (typeof window !== 'undefined' && !window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }

  async function fetchProgress() {
    try {
      const res = await fetch('/api/tech');
      const data = await res.json();
      setProgress(data || []);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  }

  useEffect(() => {
    if (selectedVideo && selectedVideo.youtubeId && typeof window !== 'undefined' && window.YT && window.YT.Player) {
      setVideoEnded(false);
      if (playerRef.current) playerRef.current.destroy();
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: selectedVideo.youtubeId,
        playerVars: { 'autoplay': 1, 'controls': 1, 'rel': 0, 'modestbranding': 1 },
        events: {
          'onStateChange': (event: YT.OnStateChangeEvent) => {
            if (event.data === window.YT.PlayerState.ENDED) setVideoEnded(true);
          }
        }
      });
    }
  }, [selectedVideo]);

  async function handleMarkComplete(itemId: string, phaseId: number, isCert: boolean) {
    try {
      const res = await fetch('/api/tech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phaseId, videoId: itemId, isCertification: isCert }),
      });
      if (res.ok) {
        fetchProgress();
        setSelectedVideo(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function isItemCompleted(videoId: string) {
    return progress.some(p => p.video_id === videoId && p.is_completed);
  }

  function isPhaseUnlocked(phaseId: number) {
    if (phaseId === 1) return true;
    const prevPhase = PHASES.find(p => p.id === phaseId - 1);
    if (!prevPhase) return true;
    return prevPhase.items.every(item => isItemCompleted(item.id));
  }

  const overallProgress = Math.round((progress.filter(p => p.is_completed).length / 13) * 100);

  if (!isUnlocked) return null;

  return (
    <InternalLayout>
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="status-dot" />
                    <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.4em]">
                        SYS_MODULE // TECH_LMS
                    </p>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
                    <GlitchText>TECH BEAST LMS</GlitchText>
                </h1>
                <div className="h-px w-32 bg-linear-to-r from-emerald-500 to-transparent mt-4 opacity-50" />
            </div>
            
            <div className="flex items-center gap-8 bg-black/40 p-6 border border-(--neon-border)">
                 <div className="flex flex-col gap-1 pr-8 border-r border-(--neon-border)">
                     <span className="text-[9px] font-black tracking-widest text-text-dim uppercase">SYSTEM_UPTIME</span>
                     <span className="text-xl font-mono text-emerald-500">99.98%</span>
                 </div>
                 <NeonGauge 
                    value={overallProgress} 
                    label="TOTAL PROGRESS" 
                    subLabel="MASTERY" 
                    color="var(--sys-tech)" 
                    size={100} 
                 />
            </div>
        </header>

        {/* Video Modal HUD */}
        {selectedVideo && (
            <div className="fixed inset-0 z-200 bg-black/95 flex items-center justify-center p-4 backdrop-blur-3xl">
                <HackerPanel label={`STREAMING::${selectedVideo.title}`} className="w-full max-w-5xl aspect-video p-0 relative overflow-hidden">
                    <button 
                        onClick={() => { setSelectedVideo(null); if (playerRef.current) playerRef.current.destroy(); }}
                        className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-all font-bold"
                    >
                        ✕
                    </button>
                    
                    {selectedVideo.youtubeId ? (
                        <div id="youtube-player" className="w-full h-full"></div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                            <div className="text-6xl mb-6">📜</div>
                            <h2 className="text-2xl font-black text-white mb-4 italic uppercase tracking-widest">Protocol Verification</h2>
                            <p className="text-text-muted mb-8 max-w-md text-xs uppercase tracking-wider">Acquire certificate from external authority to continue.</p>
                            <button 
                                onClick={() => handleMarkComplete(selectedVideo.id, 0, true)}
                                className="px-12 py-4 border border-emerald-500 text-emerald-500 font-bold uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_20px_var(--neon-glow)]"
                            >
                                [ VALIDATE_CERTIFICATE ]
                            </button>
                        </div>
                    )}

                    {videoEnded && (
                        <div className="absolute inset-0 bg-emerald-500/95 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center z-40 animate-in fade-in zoom-in duration-300">
                            <div className="text-6xl mb-6">🏆</div>
                            <h2 className="text-4xl font-black text-black mb-4 italic uppercase tracking-tighter">PHASE_VALIDATED</h2>
                            <p className="text-black/70 mb-8 max-w-md font-bold uppercase text-xs tracking-widest">Module completion detected. Updating neural buffer...</p>
                            <button 
                                onClick={() => handleMarkComplete(selectedVideo.id, 0, false)}
                                className="px-16 py-5 bg-black text-white font-black italic uppercase tracking-[0.3em] hover:scale-105 transition-transform"
                            >
                                [ UPLOAD_PROGRESS ]
                            </button>
                        </div>
                    )}
                </HackerPanel>
            </div>
        )}

        {/* Phase Timeline HUD */}
        <div className="space-y-24">
            {PHASES.map((phase) => {
                const unlocked = isPhaseUnlocked(phase.id);
                return (
                    <section key={phase.id} className={`transition-all duration-700 ${unlocked ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                        <div className="flex items-center gap-6 mb-12">
                            <div className={`px-4 py-1 skew-x-[-15deg] font-black text-[10px] tracking-[0.2em] ${unlocked ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'}`}>
                                {unlocked ? 'ACTIVE_STATUS' : 'LOCKED_ACCESS'}
                            </div>
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">{phase.title}</h2>
                            <div className="flex-1 h-px bg-linear-to-r from-(--neon-border) to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {phase.items.map((item) => {
                                const completed = isItemCompleted(item.id);
                                return (
                                    <HackerPanel 
                                        key={item.id} 
                                        label={item.youtubeId ? "DATA::STREAM" : "DOC::CERT"} 
                                        className={`transition-all duration-500 ${completed ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}
                                    >
                                        <div className="relative aspect-video rounded-none overflow-hidden mb-6 bg-black group/thumb">
                                            {item.youtubeId ? (
                                                <>
                                                    <img 
                                                        src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`} 
                                                        alt={item.title}
                                                        className="w-full h-full object-cover opacity-60 group-hover/thumb:scale-110 group-hover/thumb:opacity-100 transition-all duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover/thumb:opacity-100 transition-opacity pointer-events-none" />
                                                    <button 
                                                        onClick={() => setSelectedVideo({ id: item.id, youtubeId: item.youtubeId, title: item.title, isCert: false })}
                                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-all"
                                                    >
                                                        <div className="w-14 h-14 bg-emerald-500 text-black flex items-center justify-center text-xl shadow-[0_0_30px_var(--neon-glow)] translate-y-4 group-hover/thumb:translate-y-0 transition-transform">
                                                            ▶
                                                        </div>
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 gap-3">
                                                    <span className="text-4xl opacity-30">📜</span>
                                                    <span className="text-[9px] font-black tracking-widest text-text-dim uppercase">External Protocol</span>
                                                </div>
                                            )}
                                            
                                            {completed && (
                                                <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[8px] font-black px-3 py-1 skew-x-[-15deg] translate-x-2">
                                                    VALIDATED ✓
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-sm font-black text-white hover:text-emerald-400 transition-colors mb-6 line-clamp-1 uppercase tracking-wider">
                                            {item.title}
                                        </h3>

                                        {!completed ? (
                                            <button 
                                                onClick={() => setSelectedVideo({ id: item.id, youtubeId: item.youtubeId || "", title: item.title, isCert: !item.youtubeId })}
                                                className="w-full py-4 bg-transparent border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
                                            >
                                                [ START_ACCESS ]
                                            </button>
                                        ) : (
                                            <div className="w-full py-4 text-emerald-500/50 text-center text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                                                ACCESS_CLOSED // COMPLETE
                                            </div>
                                        )}
                                    </HackerPanel>
                                );
                            })}
                        </div>
                    </section>
                );
            })}
        </div>
      </div>
    </InternalLayout>
  );
}
