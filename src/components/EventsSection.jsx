import React, { useEffect, useRef, useState } from 'react';
import { Search, ArrowUpRight, X, Trophy, Users, Clock, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { EVENTS_DATA, EVENT_CATEGORIES } from '../data/eventsData';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function EventsSection({onRegister}){
  const ref=useRef(null);
  const [category,setCategory]=useState('all');
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState(null);
  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.fromTo('.event-intro',{y:40,opacity:0},{y:0,opacity:1,duration:.7,scrollTrigger:{trigger:ref.current,start:'top 75%'}});
    },ref); return ()=>ctx.revert();
  },[]);
  const list=EVENTS_DATA.filter(e=>
    (category==='all'||e.category===category) &&
    `${e.name} ${e.shortDescription} ${e.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())
  );
  return <section id="events" ref={ref} className="section section-line events">
    <div className="container">
      <div className="event-intro">
        <span className="eyebrow">02 · CHOOSE YOUR CHALLENGE</span>
        <div className="events-title-row"><h2 className="section-title">Find your <em>arena.</em></h2><div className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search events"/></div></div>
        <div className="filters">
          {EVENT_CATEGORIES.slice(0,7).map(c=><button key={c.id} className={category===c.id?'active':''} onClick={()=>setCategory(c.id)}>{c.id==='all'?'ALL':c.name.replace('FLAGSHIP ','').replace('COMPETITIVE ','').replace(' & BOTWARS','').replace(' & GAMING','').replace(' & IOT','')}</button>)}
        </div>
      </div>
      <div className="events-grid">
        {list.map((event,i)=><article className={`event-card ${event.featured?'featured':''}`} key={event.id} onClick={()=>setSelected(event)}>
          <div className="event-card-top"><span>0{(i%9)+1}</span><span>{event.category.toUpperCase()}</span></div>
          <div><h3>{event.name.split(':')[0]}</h3><p>{event.shortDescription}</p></div>
          <div className="event-meta"><span><Trophy size={14}/>{event.prizePool}</span><span><Users size={14}/>{event.teamSize}</span></div>
          <div className="event-card-bottom"><span>{event.date}</span><button aria-label="view event"><ArrowUpRight size={18}/></button></div>
        </article>)}
      </div>
    </div>
    {selected && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setSelected(null)}>
      <div className="event-modal">
        <button className="modal-close" onClick={()=>setSelected(null)}><X/></button>
        <span className="eyebrow">{selected.category} · {selected.status}</span>
        <h2>{selected.name}</h2>
        <p className="modal-lead">{selected.description}</p>
        <div className="modal-stats"><div><Trophy/><b>{selected.prizePool}</b><span>PRIZE</span></div><div><Users/><b>{selected.teamSize}</b><span>TEAM</span></div><div><Clock/><b>{selected.time}</b><span>TIME</span></div><div><MapPin/><b>{selected.venue}</b><span>VENUE</span></div></div>
        <div className="modal-rules"><h4>WHAT TO EXPECT</h4><ul>{selected.rules?.map(r=><li key={r}>{r}</li>)}</ul></div>
        <button className="btn btn-accent modal-cta" onClick={()=>{setSelected(null);onRegister(selected)}}>REGISTER FOR THIS EVENT <ArrowUpRight size={16}/></button>
      </div>
    </div>}
  </section>
}
