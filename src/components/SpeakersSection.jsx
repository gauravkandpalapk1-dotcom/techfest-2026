import React, { useEffect, useRef } from 'react';
import { UserCheck, Sparkles, Globe, Code, MessageSquare } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SPEAKERS_DATA } from '../data/speakersData';
import { useSound } from './SoundController';

gsap.registerPlugin(ScrollTrigger);

export default function SpeakersSection() {
  const { playHover, playClick } = useSound();
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.speaker-card',
        { opacity: 0, y: 35, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.speakers-grid',
            start: 'top 80%'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="speakers" className="relative py-28 px-4 sm:px-8 border-t border-cyan-500/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header Metadata Tag */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00F5D4]" />
          <span>// 04. KEYNOTE SPEAKERS & INDUSTRY MENTORS</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight">
              KEYNOTE <span className="text-gradient-cyan-purple">PIONEERS</span>
            </h2>
          </div>
          <p className="max-w-md text-slate-300 font-body text-sm sm:text-base leading-relaxed">
            Learn from senior AI researchers, quantum architects, and red-team leaders driving technological breakthroughs at global labs.
          </p>
        </div>

        {/* Speakers Cards Grid */}
        <div className="speakers-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPEAKERS_DATA.map((speaker) => (
            <div
              key={speaker.id}
              onMouseEnter={playHover}
              className="speaker-card glass-hud p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/80 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:-translate-y-1.5 hud-bracket"
            >
              {/* Top Avatar Header */}
              <div>
                <div className="relative w-20 h-20 rounded-xl overflow-hidden mb-5 border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors shadow-[0_0_20px_rgba(0,245,212,0.2)]">
                  <img
                    src={speaker.avatar}
                    alt={speaker.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>

                <h3 className="font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors mb-1">
                  {speaker.name}
                </h3>

                <div className="text-xs font-mono text-cyan-400 font-semibold mb-1">
                  {speaker.role}
                </div>

                <div className="text-xs font-mono text-slate-400 mb-4">
                  @ {speaker.company}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/15 mb-6 text-xs font-mono text-slate-300 leading-normal">
                  <span className="text-[10px] text-cyan-400 font-bold block mb-1 uppercase tracking-wider">// KEYNOTE TOPIC</span>
                  "{speaker.topic}"
                </div>
              </div>

              {/* Tags & Footer */}
              <div>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-cyan-500/15">
                  {speaker.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 border border-cyan-500/15 text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
