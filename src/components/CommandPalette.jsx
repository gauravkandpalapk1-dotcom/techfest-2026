import React, { useState, useEffect } from 'react';
import { Search, X, Cpu, Trophy, Calendar, Ticket, ChevronRight } from 'lucide-react';
import { EVENTS_DATA } from '../data/eventsData';
import { useSound } from './SoundController';

export default function CommandPalette({ isOpen, onClose, onSelectEvent, onOpenRegister }) {
  const { playClick, playHover } = useSound();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = EVENTS_DATA.filter(
    (e) =>
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.category.toLowerCase().includes(query.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl glass-hud rounded-2xl border border-cyan-500/40 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-cyan-500/20 mb-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search tracks (e.g. hackathon, CTF, AI)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent font-mono text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Quick Links */}
        {!query && (
          <div className="mb-4 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 px-3 py-1">QUICK ACTIONS</div>
            <button
              onClick={() => {
                playClick();
                onClose();
                if (onOpenRegister) onOpenRegister();
              }}
              onMouseEnter={playHover}
              className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-cyan-500/10 text-left font-mono text-xs text-slate-200"
            >
              <span className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-cyan-400" />
                Claim Digital Ticket Pass
              </span>
              <span className="text-[10px] text-cyan-400">ENTER ↵</span>
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-64 overflow-y-auto space-y-1">
          <div className="text-[10px] font-mono text-slate-400 px-3 py-1">MATCHING TRACKS ({filtered.length})</div>
          {filtered.map((event) => (
            <button
              key={event.id}
              onClick={() => {
                playClick();
                onClose();
                if (onSelectEvent) onSelectEvent(event);
              }}
              onMouseEnter={playHover}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-cyan-500/30 text-left transition-all"
            >
              <div>
                <div className="font-display text-xs font-bold text-white">{event.title}</div>
                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="text-cyan-400">{event.category.toUpperCase()}</span>
                  <span>•</span>
                  <span>Prize: {event.prizePool}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
