import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import WebGLScene from './WebGLScene';

export default function Hero({ onRegister }) {
  const ref = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ d: 12, h: 8, m: 42, s: 16 });

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        let { d,h,m,s } = t; s -= 1;
        if (s < 0) { s=59; m-=1; }
        if (m < 0) { m=59; h-=1; }
        if (h < 0) { h=23; d-=1; }
        return { d:Math.max(0,d), h:Math.max(0,h), m:Math.max(0,m), s:Math.max(0,s) };
      });
    },1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults:{ ease:'power3.out' } });
      tl.fromTo('.hero-kicker',{y:18,opacity:0},{y:0,opacity:1,duration:.55})
        .fromTo('.hero-title .line',{y:80,opacity:0},{y:0,opacity:1,duration:.8,stagger:.08},'-=.15')
        .fromTo('.hero-copy',{y:25,opacity:0},{y:0,opacity:1,duration:.6},'-=.35')
        .fromTo('.hero-actions',{y:20,opacity:0},{y:0,opacity:1,duration:.5},'-=.3')
        .fromTo('.hero-stats',{y:20,opacity:0},{y:0,opacity:1,duration:.5},'-=.2');
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="hero">
      <WebGLScene />
      <div className="hero-grid" />
      <div className="hero-orb orb-a" />
      <div className="hero-orb orb-b" />

      <div className="container hero-inner">
        <div className="hero-content">
          <div className="hero-kicker eyebrow">
            TECHNICAL FEST · 2026 · DELHI NCR
          </div>

          <h1 className="hero-title">
            <span className="line">BUILD.</span>
            <span className="line gradient-text">BREAK.</span>
            <span className="line">REDEFINE.</span>
          </h1>

          <p className="hero-copy">
            A high-energy playground for builders, hackers, designers and
            problem-solvers. <strong>Compete, create and leave a mark.</strong>
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onRegister}>
              Enter the arena <ArrowUpRight size={16} />
            </button>
            <a className="btn btn-dark" href="#events">
              Explore events <ArrowDown size={16} />
            </a>
          </div>

          <div className="hero-stats">
            <div><strong>45+</strong><span>EVENTS</span></div>
            <div><strong>₹15L+</strong><span>PRIZES</span></div>
            <div><strong>12K+</strong><span>MAKERS</span></div>
            <div><strong>36H</strong><span>FLAGSHIP</span></div>
          </div>
        </div>

        <aside className="hero-panel glass">
          <div className="panel-top">
            <span><i /> LIVE COUNTDOWN</span>
            <span>24.10.26</span>
          </div>
          <div className="countdown">
            {[
              ['DAYS',timeLeft.d],['HRS',timeLeft.h],['MIN',timeLeft.m],['SEC',timeLeft.s]
            ].map(([label,value]) => (
              <div className="time-cell" key={label}>
                <strong>{String(value).padStart(2,'0')}</strong><span>{label}</span>
              </div>
            ))}
          </div>
          <div className="panel-feature">
            <div className="feature-mark"><Sparkles size={18}/></div>
            <div>
              <span>FEATURED EVENT</span>
              <strong>NEURAL HACK · 36H</strong>
              <small>₹5,00,000 prize pool · teams of 2–4</small>
            </div>
          </div>
          <div className="panel-footer">
            <span>REGISTRATION OPEN</span>
            <span>01 / 04</span>
          </div>
        </aside>
      </div>

      <div className="hero-bottom container">
        <span>SCROLL TO EXPLORE</span>
        <div className="scroll-line"><i /></div>
        <span>01 — 05</span>
      </div>
    </section>
  );
}
