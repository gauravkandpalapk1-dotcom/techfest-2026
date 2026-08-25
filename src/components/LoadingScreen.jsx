import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const progressBarRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING_QUANTUM_CORE...');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Fade out container smoothly with GSAP
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.03,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: () => {
              if (onComplete) onComplete();
            }
          });
        }
      });

      // 1. Logo Mark Scale-In
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }
      )
      // 2. Progress Bar Fill Animation (Fast 0.5s initialization)
      .fromTo(
        progressBarRef.current,
        { width: '0%' },
        {
          width: '100%',
          duration: 0.5,
          ease: 'power2.inOut',
          onUpdate: function () {
            const p = Math.round(this.progress() * 100);
            setProgress(p);
            if (p > 70) {
              setStatusText('PULSE_2026_SYSTEMS_ONLINE');
            } else if (p > 35) {
              setStatusText('INITIALIZING_WEBGL_SHADERS...');
            }
          }
        },
        '-=0.1'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] text-cyan-400 font-mono select-none"
    >
      {/* Subtle Cyber Matrix Grid Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />

      {/* Ambient Radial Center Glow */}
      <div className="absolute w-[280px] h-[280px] bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 w-[90%] max-w-sm p-6 glass-hud rounded-xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,245,212,0.2)] hud-bracket">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>PULSE_BOOTLOADER_v4.2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <span className="w-2 h-2 rounded-full bg-green-500/80" />
          </div>
        </div>

        {/* Logo Mark */}
        <div ref={logoRef} className="flex items-center gap-3 mb-5 opacity-0">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_15px_rgba(0,245,212,0.3)]">
            <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h1 className="font-display font-black text-xl text-white tracking-wider">
              PULSE <span className="text-cyan-400">2026</span>
            </h1>
            <p className="text-[9px] text-slate-400 tracking-widest uppercase">QUANTUM CONVERGENCE</p>
          </div>
        </div>

        {/* Diagnostic Status Message */}
        <div className="h-6 flex items-center gap-2 text-[11px] text-cyan-300 font-mono mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{statusText}</span>
        </div>

        {/* Progress Bar Track */}
        <div className="relative w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20 mb-3">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(0,245,212,0.8)]"
          />
        </div>

        {/* Counter Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>STATUS: LOAD_OK</span>
          <span className="text-cyan-400 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
