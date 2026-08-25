import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
export default function CTA({onRegister}){
  return <section id="register" className="section cta">
    <div className="container">
      <div className="cta-box">
        <div className="cta-glow"/>
        <span className="eyebrow">04 · YOUR MOVE</span>
        <h2>Ready to build<br/><em>what's next?</em></h2>
        <p>Choose an arena, gather your people and step into the weekend.</p>
        <button className="btn btn-primary" onClick={onRegister}>Register now <ArrowUpRight size={17}/></button>
        <div className="cta-mark"><Sparkles size={22}/><span>TECHFEST<br/><b>2026</b></span></div>
      </div>
    </div>
  </section>
}
