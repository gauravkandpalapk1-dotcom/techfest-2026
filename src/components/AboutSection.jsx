import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Cpu, Shield, Bot, Palette } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function AboutSection(){
  const ref=useRef(null);
  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.fromTo('.reveal',{y:45,opacity:0},{y:0,opacity:1,duration:.7,stagger:.08,scrollTrigger:{trigger:ref.current,start:'top 75%'}});
    },ref); return ()=>ctx.revert();
  },[]);
  const pillars=[
    [Cpu,'AI & INTELLIGENCE','Build agents, models and systems that think with you.'],
    [Shield,'CYBER & SECURITY','Break, defend and redesign the systems we depend on.'],
    [Bot,'ROBOTICS & HARDWARE','Turn code into machines and ideas into motion.'],
    [Palette,'DESIGN & PRODUCT','Make technology useful, beautiful and memorable.']
  ];
  return <section id="about" ref={ref} className="section section-line about">
    <div className="container">
      <div className="about-head reveal">
        <div><span className="eyebrow">01 · THE IDEA</span><h2 className="section-title">Not just a fest.<br/><em>A launchpad.</em></h2></div>
        <p>One weekend. Dozens of challenges. Thousands of curious minds. TECHFEST is designed around one simple idea: give ambitious students a place to build something worth talking about.</p>
      </div>
      <div className="stat-strip reveal">
        {[
          ['12K+','PARTICIPANTS'],['45+','EVENTS'],['₹15L+','PRIZE POOL'],['80+','COLLEGES']
        ].map(([n,l])=><div key={l}><strong>{n}</strong><span>{l}</span></div>)}
      </div>
      <div className="pillar-grid">
        {pillars.map(([Icon,title,desc],i)=><article className="pillar reveal" key={title}>
          <span className="pillar-num">0{i+1}</span><Icon size={22}/><h3>{title}</h3><p>{desc}</p><ArrowUpRight size={18}/>
        </article>)}
      </div>
    </div>
  </section>
}
