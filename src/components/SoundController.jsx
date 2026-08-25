import React, { createContext, useContext, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const SoundContext = createContext({
  muted: true,
  toggleSound: () => {},
  playHover: () => {},
  playClick: () => {},
  playSuccess: () => {}
});

export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem('pulse_sound_muted') === 'true';
  });

  const toggleSound = () => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem('pulse_sound_muted', String(next));
      return next;
    });
  };

  // Synthesized audio generators using Web Audio API
  const playHover = () => {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Audio context ignored if uninitialized by gesture
    }
  };

  const playClick = () => {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  };

  const playSuccess = () => {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  return (
    <SoundContext.Provider value={{ muted, toggleSound, playHover, playClick, playSuccess }}>
      {children}
    </SoundContext.Provider>
  );
}

export function SoundToggle() {
  const { muted, toggleSound } = useSound();

  return (
    <button
      onClick={toggleSound}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-slate-900/80 border border-cyan-500/30 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all"
      title={muted ? 'Enable UI Audio Effects' : 'Mute UI Audio'}
      aria-label="Toggle Sound Effects"
    >
      {muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
      <span className="hidden sm:inline">{muted ? 'AUDIO: OFF' : 'AUDIO: ON'}</span>
    </button>
  );
}
