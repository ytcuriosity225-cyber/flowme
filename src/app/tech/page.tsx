"use client";

import React, { useState, useEffect, useRef } from 'react';
import { TechProgress } from '@/types';
import { InternalLayout } from '@/components/InternalLayout';

const PHASES = [
  {
    id: 1,
    title: "PHASE 1 — Backend Foundation",
    items: [
      { id: "v1", title: "Sheriyan Backend Project", youtubeId: "0IciwnJ6PJI", isCertification: false },
      { id: "c1", title: "FreeCodeCamp Backend Course", youtubeId: "", isCertification: true, requiresCert: true }
    ]
  },
  {
    id: 2,
    title: "PHASE 2 — Frontend + Animations",
    items: [
      { id: "v2", title: "React + GSAP Animated Websites", youtubeId: "NjqjakgPL84", isCertification: false },
      { id: "c2", title: "FreeCodeCamp Frontend Course", youtubeId: "", isCertification: true, requiresCert: true }
    ]
  },
  {
    id: 3,
    title: "PHASE 3 — JavaScript Mastery",
    items: [
      { id: "v3", title: "JavaScript Full Mastery", youtubeId: "a-wVHL0lpb0", isCertification: false },
      { id: "c3", title: "FreeCodeCamp JavaScript Certificate", youtubeId: "", isCertification: true, requiresCert: true }
    ]
  },
  {
    id: 4,
    title: "PHASE 4 — Python + Data",
    items: [
      { id: "v4", title: "Python Learning", youtubeId: "_aWbUudZ5Yo", isCertification: false },
      { id: "c4", title: "FreeCodeCamp Python Certificate", youtubeId: "", isCertification: true, requiresCert: true },
      { id: "v5", title: "NumPy Mastery", youtubeId: "Utgwk0r9Zq4", isCertification: false }
    ]
  },
  {
    id: 5,
    title: "PHASE 5 — Generative AI Projects",
    items: [
      { id: "v6", title: "GenAI Project 1", youtubeId: "vwncYfhxbR0", isCertification: false },
      { id: "v7", title: "GenAI Project 2", youtubeId: "yodh-oEFnb4", isCertification: false },
      { id: "v8", title: "GenAI Project 3", youtubeId: "CUDT5E6jz84", isCertification: false }
    ]
  },
  {
    id: 6,
    title: "PHASE 6 — Advanced Systems",
    items: [
      { id: "v9", title: "Multi-Agent Systems (LangChain)", youtubeId: "P22qI2RnNjA", isCertification: false }
    ]
  }
];

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function TechPage() {
  const { isUnlocked } = useApp();
  const [progress, setProgress] = useState<TechProgress[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string, youtubeId: string, title: string, isCert: boolean } | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    fetchProgress();
    loadYouTubeAPI();
  }, []);

  function loadYouTubeAPI() {
    if (!window.YT) {
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
    if (selectedVideo && selectedVideo.youtubeId && window.YT && window.YT.Player) {
      setVideoEnded(false);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: selectedVideo.youtubeId,
        playerVars: {
          'autoplay': 1,
          'controls': 1,
          'rel': 0,
          'modestbranding': 1
        },
        events: {
          'onStateChange': (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setVideoEnded(true);
            }
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
      console.error("Failed to mark complete:", err);
    }
  }

  function isItemCompleted(videoId: string) {
    return progress.some(p => p.video_id === videoId && p.is_completed);
  }

  function isPhaseUnlocked(phaseId: number) {
    if (phaseId === 1) return true;
    const prevPhase = PHASES.find(p => p.id === phaseId - 1);
    if (!prevPhase) return true;
    
    // All items in previous phase must be completed
    return prevPhase.items.every(item => isItemCompleted(item.id));
  }

  return (
    <InternalLayout>
      <div className="max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Tech Beast LMS
        </h1>
        <p className="text-text-muted mt-2">Master the stack. Build the future.</p>
      </header>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl">
             <button 
                onClick={() => {
                  setSelectedVideo(null);
                  if (playerRef.current) playerRef.current.destroy();
                }}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-all font-bold"
              >
                ✕
              </button>
              
              {selectedVideo.youtubeId ? (
                <div id="youtube-player" className="w-full h-full"></div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-bg-card">
                  <div className="text-6xl mb-6">📜</div>
                  <h2 className="text-3xl font-bold text-white mb-4">Certification Checklist</h2>
                  <p className="text-text-muted mb-8 max-w-md">Complete the external course and obtain your certificate. Once you have it, you can mark this as finished.</p>
                  <button 
                    onClick={() => handleMarkComplete(selectedVideo.id, 0, true)}
                    className="px-12 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:scale-105 transition-transform"
                  >
                    I have the certificate
                  </button>
                </div>
              )}

              {videoEnded && (
                <div className="absolute inset-0 bg-emerald-500/90 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500 z-40">
                  <div className="text-6xl mb-6">🏆</div>
                  <h2 className="text-4xl font-black text-black mb-4 italic uppercase">Video Complete!</h2>
                  <p className="text-black/80 mb-8 max-w-md font-medium">Excellent work. You've finished this training module.</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleMarkComplete(selectedVideo.id, 0, false)}
                      className="px-12 py-4 bg-black text-white font-bold rounded-xl hover:scale-105 transition-transform"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Phase List */}
      <div className="space-y-20">
        {PHASES.map((phase) => {
          const unlocked = isPhaseUnlocked(phase.id);
          return (
            <section key={phase.id} className={`${unlocked ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`text-xs font-black px-3 py-1 rounded ${unlocked ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'}`}>
                  {unlocked ? 'ACTIVE' : 'LOCKED'}
                </div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">{phase.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {phase.items.map((item) => {
                  const completed = isItemCompleted(item.id);
                  return (
                    <div 
                      key={item.id}
                      className={`group bg-bg-card border-2 rounded-3xl p-6 transition-all duration-500 ${
                        completed ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-black">
                        {item.youtubeId ? (
                          <>
                            <img 
                              src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => setSelectedVideo({ id: item.id, youtubeId: item.youtubeId, title: item.title, isCert: false })}
                                className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center text-xl shadow-2xl transform scale-90 group-hover:scale-100 transition-transform"
                              >
                                ▶
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <span className="text-4xl grayscale group-hover:grayscale-0 transition-all">📜</span>
                          </div>
                        )}
                        
                        {completed && (
                          <div className="absolute top-4 right-4 bg-emerald-500 text-black text-[10px] font-black px-3 py-1 rounded shadow-lg">
                            COMPLETED
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white mb-6 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>

                      {!completed ? (
                        item.youtubeId ? (
                          <button 
                            onClick={() => setSelectedVideo({ id: item.id, youtubeId: item.youtubeId, title: item.title, isCert: false })}
                            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                          >
                            Watch & Complete
                          </button>
                        ) : (
                          <button 
                             onClick={() => setSelectedVideo({ id: item.id, youtubeId: "", title: item.title, isCert: true })}
                             className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                          >
                            Verify Certificate
                          </button>
                        )
                      ) : (
                        <div className="w-full py-4 bg-emerald-500/20 text-emerald-500 text-center rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-500/30">
                          Validated ✓
                        </div>
                      )}
                    </div>
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
