"use client";

import { InternalLayout } from "@/components/InternalLayout";
import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";

interface ResourceLink {
  title: string;
  url: string;
  icon: string;
  description?: string;
}

interface Book {
  title: string;
  author: string;
  concept: string;
}

export default function RoadmapPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll(".roadmap-card"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, []);

  const businessBooks: Book[] = [
    {
      title: "Building a StoryBrand",
      author: "Donald Miller",
      concept: "Narrative Marketing & Customer Messaging Framework",
    },
    {
      title: "Sell Like Crazy",
      author: "Sabri Suby",
      concept: "Direct Response Copywriting & High-Converting Sales Funnels",
    },
    {
      title: "22 Immutable Laws of Marketing",
      author: "Al Ries & Jack Trout",
      concept: "Market Positioning & Competitive Strategy",
    },
  ];

  const youtubeResources: ResourceLink[] = [
    {
      title: "JavaScript Masterclass",
      url: "https://www.youtube.com/watch?v=a-wVHL0lpb0",
      icon: "▶",
      description: "Complete JS fundamentals and advanced patterns",
    },
    {
      title: "Logic Building & Problem Solving",
      url: "https://www.youtube.com/watch?v=YTFFXJejOpg",
      icon: "🧩",
      description: "Algorithm design and critical thinking",
    },
    {
      title: "Backend Master Series",
      url: "https://www.youtube.com/playlist?list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH",
      icon: "⚙",
      description: "Backend architecture, databases, APIs",
    },
    {
      title: "Advanced Backend One Shot",
      url: "https://www.youtube.com/watch?v=0IciwnJ6PJI",
      icon: "🚀",
      description: "Production-ready backend systems",
    },
  ];

  const devTools: ResourceLink[] = [
    {
      title: "Google Colab",
      url: "https://colab.research.google.com/",
      icon: "📓",
      description: "Cloud-based notebook for Python & ML",
    },
    {
      title: "Replit",
      url: "https://replit.com/",
      icon: "💻",
      description: "Online IDE for rapid prototyping",
    },
    {
      title: "GitHub Codespaces",
      url: "https://github.com/codespaces",
      icon: "🌩",
      description: "Cloud development environment",
    },
  ];

  return (
    <InternalLayout>
      <div ref={containerRef} className="space-y-16">
        {/* Header */}
        <div className="border-b border-white/5 pb-8">
          <div className="space-y-2">
            <p className="text-text-dim text-xs font-black uppercase tracking-[0.2em]">
              Strategic Learning Path
            </p>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Syllabus & Roadmap
            </h1>
            <p className="text-sm text-text-muted pt-4 max-w-2xl">
              A comprehensive learning framework combining business mastery with technical excellence. Execute daily, learn systematically, build relentlessly.
            </p>
          </div>
        </div>

        {/* Business Core Section */}
        <div className="roadmap-card space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              📊 Business Core
            </h2>
            <p className="text-sm text-text-muted">
              Master the principles of marketing, copywriting, and business strategy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {businessBooks.map((book, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest">
                    Book {idx + 1}
                  </p>
                  <div>
                    <h3 className="text-lg font-black text-white mb-1">{book.title}</h3>
                    <p className="text-xs text-text-dim font-medium">by {book.author}</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-sm text-text-muted leading-relaxed">
                      <strong className="text-white">Concept:</strong> {book.concept}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-sm text-text-muted mb-4">
              <strong className="text-white">Core Topics to Master:</strong>
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-text-muted">
              <li className="flex items-start gap-2">
                <span className="text-accent font-black">✓</span>
                <span>Direct Response Copywriting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-black">✓</span>
                <span>A/B Testing & Optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-black">✓</span>
                <span>Conversion Rate Optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-black">✓</span>
                <span>Customer Psychology</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-black">✓</span>
                <span>Sales Funnel Architecture</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-black">✓</span>
                <span>Market Positioning</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tech Beast Section */}
        <div className="roadmap-card space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              ⚡ Tech Beast
            </h2>
            <p className="text-sm text-text-muted">
              Deep dive into JavaScript, backend systems, and software architecture
            </p>
          </div>

          <div className="space-y-4">
            {youtubeResources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-card border border-border rounded-lg p-6 hover:border-white/20 hover:shadow-lg hover:shadow-white/10 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{resource.icon}</span>
                      <h3 className="text-lg font-black text-white group-hover:text-accent transition-colors">
                        {resource.title}
                      </h3>
                    </div>
                    <p className="text-sm text-text-muted">{resource.description}</p>
                  </div>
                  <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-sm text-text-muted mb-4">
              <strong className="text-white">Competencies to Build:</strong>
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-text-muted">
              <li className="flex items-start gap-2">
                <span className="text-green font-black">→</span>
                <span>JavaScript ES6+ & Modern Patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green font-black">→</span>
                <span>Algorithm & Data Structures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green font-black">→</span>
                <span>Backend Systems Design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green font-black">→</span>
                <span>Database Architecture</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green font-black">→</span>
                <span>REST & GraphQL APIs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green font-black">→</span>
                <span>Production Deployment</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Dev Tools Section */}
        <div className="roadmap-card space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              🛠 Dev Tools & Environments
            </h2>
            <p className="text-sm text-text-muted">
              Quick access to essential development platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {devTools.map((tool, idx) => (
              <a
                key={idx}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card border border-border rounded-lg p-6 hover:border-white/30 hover:shadow-lg hover:shadow-white/10 transition-all group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{tool.icon}</span>
                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-accent transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">{tool.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Execution Strategy */}
        <div className="roadmap-card bg-gradient-to-br from-accent/10 to-transparent border border-accent/30 rounded-lg p-8 space-y-4">
          <p className="text-[10px] font-black text-accent uppercase tracking-widest">
            Execution Strategy
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-lg font-black text-white">Week 1-2</h4>
              <p className="text-sm text-text-muted">
                Read one business book. Watch JS fundamentals. Start daily execution tracking.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-white">Week 3-4</h4>
              <p className="text-sm text-text-muted">
                Master StoryBrand concepts. Deep dive into backend series. Build micro-projects.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-white">Ongoing</h4>
              <p className="text-sm text-text-muted">
                Daily execution, weekly reviews, monthly assessments. Iterate and scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </InternalLayout>
  );
}
