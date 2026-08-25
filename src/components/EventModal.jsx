import React, { useEffect } from 'react';
import { X, Trophy, MapPin, Calendar, Users, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSound } from './SoundController';

export default function EventModal({ event, onClose, onRegister }) {
  const { playClick } = useSound();

  // Escape key close listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-hud rounded-2xl border border-cyan-500/40 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] hud-bracket">
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all focus-visible:outline-2 focus-visible:outline-cyan-400"
          aria-label="Close Event Specifications Overlay"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="status-pill text-xs font-mono">{event.category.toUpperCase()}</span>
          <span className="text-xs font-mono text-slate-400">EVENT_ID: #{event.id}</span>
        </div>

        {/* Title */}
        <h2 id="event-modal-title" className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-3">
          {event.name || event.title}
        </h2>
        <p className="text-slate-300 text-sm font-body mb-6 leading-relaxed">
          {event.description || event.shortDescription}
        </p>

        {/* Meta Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 mb-8 font-mono text-xs">
          <div>
            <div className="text-slate-400 mb-1">TEAM SIZE</div>
            <div className="text-cyan-400 font-bold flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {event.teamSize}
            </div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">DURATION / TIME</div>
            <div className="text-white font-bold">{event.time || event.duration}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">VENUE</div>
            <div className="text-cyan-400 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {event.venue}
            </div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">STATUS</div>
            <div className="text-emerald-400 font-bold">{event.status || 'REGISTRATION OPEN'}</div>
          </div>
        </div>

        {/* Prize Pool Breakdown */}
        {event.prizeBreakdown && (
          <div className="mb-8">
            <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> PRIZE POOL BREAKDOWN ({event.prizePool})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                <div className="text-[10px] font-mono text-amber-400 font-bold">1ST PLACE (GOLD)</div>
                <div className="font-mono text-xl font-extrabold text-white mt-1">
                  {event.prizeBreakdown.first}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-300/10 border border-slate-300/30 text-center">
                <div className="text-[10px] font-mono text-slate-300 font-bold">2ND PLACE (SILVER)</div>
                <div className="font-mono text-xl font-extrabold text-white mt-1">
                  {event.prizeBreakdown.second}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-700/10 border border-amber-700/30 text-center">
                <div className="text-[10px] font-mono text-amber-500 font-bold">3RD PLACE (BRONZE)</div>
                <div className="font-mono text-xl font-extrabold text-white mt-1">
                  {event.prizeBreakdown.third}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problem Statements */}
        {event.problemStatements && (
          <div className="mb-8">
            <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-3">
              // PROBLEM TRACKS
            </h3>
            <ul className="space-y-2">
              {event.problemStatements.map((statement, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs font-mono text-slate-300 p-3 rounded-lg bg-slate-900/60 border border-cyan-500/10"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{statement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Event Rules */}
        {event.rules && (
          <div className="mb-8">
            <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-3">
              // RULES & EVALUATION
            </h3>
            <ul className="space-y-1.5 text-xs font-mono text-slate-400 list-disc list-inside">
              {event.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Registration CTA Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-cyan-500/20">
          <div className="text-xs font-mono text-slate-400">
            SEATS REMAINING: <span className="text-cyan-400 font-bold">{event.seatsLeft || 14} / {event.totalSeats || 100}</span>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
              if (onRegister) onRegister(event);
            }}
            className="btn-cyber-primary text-xs py-3 px-6 shadow-[0_0_20px_rgba(0,245,212,0.4)]"
          >
            <span>REGISTER FOR THIS TRACK</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
