import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { DAYS_DATA, SCHEDULE_DATA } from '../data/scheduleData';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function Schedule(){
  const ref=useRef(null); const [day,setDay]=useState('day-1');
  useEffect(()=>{const ctx=gsap.context(()=>gsap.fromTo('.schedule-item',{x:-30,opacity:0},{x:0,opacity:1,duration:.6,stagger:.1,scrollTrigger:{trigger:ref.current,start:'top 70%'}}),ref);return()=>ctx.revert()},[]);
  return <section id="schedule" ref={ref} className="section section-line schedule">
    <div className="container">
      <span className="eyebrow">03 · THE WEEKEND</span>
      <div className="schedule-head"><h2 className="section-title">Make a <em>day</em> of it.</h2><p>From opening keynote to final trophy. Pick a day and see what is happening across the campus.</p></div>
      <div className="day-tabs">{DAYS_DATA.map(d=><button key={d.id} className={day===d.id?'active':''} onClick={()=>setDay(d.id)}><span>{d.label}</span><b>{d.theme}</b><small>{d.date}</small></button>)}</div>
      <div className="schedule-list">
        {SCHEDULE_DATA[day].map((item,i)=><article className="schedule-item" key={item.title}>
          <div className="schedule-time">{item.time}</div><div className="schedule-dot"/><div className="schedule-info"><span>{item.track}</span><h3>{item.title}</h3><p>{item.description}</p><div><small><MapPin size={13}/>{item.venue}</small><small><Clock size={13}/>{item.speaker}</small></div></div><ArrowUpRight className="schedule-arrow"/>
        </article>)}
      </div>
    </div>
  </section>
}
