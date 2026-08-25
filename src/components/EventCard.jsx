import React, { useRef } from 'react';
import { Trophy, Clock, MapPin, Users, ArrowUpRight, Sparkles, Ticket } from 'lucide-react';
import gsap from 'gsap';
import { useSound } from './SoundController';

export default function EventCard({ event, onSelect, onRegister }) {
  const { playHover, playClick } = useSound();
  const cardRef = useRef(null);

  // 3D Pointer Tilt Physics
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8; // Tilt deg
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  // Status Badge Styling
  const getStatusBadge = (status) => {
    if (status === 'SEATS FILLING FAST') {
      return (
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          SEATS FILLING FAST
        </span>
      );
    }
    if (status === 'INVITE ONLY') {
      return (
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          INVITE ONLY
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        REGISTRATION OPEN
      </span>
    );
  };

  const isFeatured = event.featured;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={playHover}
      onClick={() => {
        playClick();
        if (onSelect) onSelect(event);
      }}
      className={`event-card glass-hud p-6 rounded-2xl border transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(0,245,212,0.25)] ${
        isFeatured
          ? 'border-cyan-400/80 bg-gradient-to-b from-cyan-950/30 via-slate-900/90 to-purple-950/30 hud-bracket shadow-[0_0_20px_rgba(0,245,212,0.15)]'
          : 'border-cyan-500/20 hover:border-cyan-400/60'
      }`}
    >
      {/* Background Accent Gradient Flare */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 rounded-full blur-[45px] group-hover:bg-cyan-500/15 transition-all pointer-events-none" />

      <div>
        {/* Top Spec Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-cyan-500/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="status-pill text-[10px] uppercase">{event.category}</span>
            {isFeatured && (
              <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded bg-pink-500/15 text-pink-400 border border-pink-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />
                FLAGSHIP ARENA
              </span>
            )}
          </div>

          {getStatusBadge(event.status)}
        </div>

        {/* Event Title */}
        <h3
          className={`font-display font-black text-white group-hover:text-cyan-300 transition-colors mb-2 leading-tight ${
            isFeatured ? 'text-2xl text-gradient-cyan-white' : 'text-xl'
          }`}
        >
          {event.name || event.title}
        </h3>

        {/* Short Description */}
        <p className="text-slate-300 text-xs font-body line-clamp-2 mb-5 leading-relaxed">
          {event.shortDescription || event.subtitle}
        </p>

        {/* Meta Info (Date/Time & Venue) */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 mb-6 p-2.5 rounded-lg bg-slate-950/60 border border-cyan-500/10">
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Footer Specs & Action */}
      <div>
        {/* Tags & Prize Pool */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>{event.prizePool}</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>{event.teamSize}</span>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center gap-2 pt-3 border-t border-cyan-500/15">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              if (onRegister) onRegister(event);
            }}
            className="flex-1 btn-cyber-primary py-2 text-xs justify-center shadow-[0_0_15px_rgba(0,245,212,0.2)]"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>REGISTER</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              if (onSelect) onSelect(event);
            }}
            className="px-3 py-2 rounded-lg glass-hud border border-cyan-500/20 text-xs font-mono text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all"
            title="View full event details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
