import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onRegister }) {
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>30);
    window.addEventListener('scroll',fn); return ()=>window.removeEventListener('scroll',fn);
  },[]);
  const links=[['ABOUT','#about'],['EVENTS','#events'],['SCHEDULE','#schedule'],['REGISTER','#register']];
  const go=(href)=>{ setOpen(false); document.querySelector(href)?.scrollIntoView({behavior:'smooth'}); };
  return (
    <header className={`nav ${scrolled?'nav-scrolled':''}`}>
      <div className="container nav-inner">
        <a className="brand" href="#">
          <span className="brand-symbol">TF</span>
          <span><b>TECH</b>FEST <small>2026</small></span>
        </a>
        <nav className="desktop-nav">
          {links.map(([label,href])=><a key={label} href={href} onClick={e=>{e.preventDefault();go(href)}}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <button className="nav-register" onClick={onRegister}>REGISTER <ArrowUpRight size={14}/></button>
          <button className="menu-btn" onClick={()=>setOpen(!open)} aria-label="menu">{open?<X/>:<Menu/>}</button>
        </div>
      </div>
      {open && <div className="mobile-nav">
        {links.map(([label,href])=><a key={label} href={href} onClick={e=>{e.preventDefault();go(href)}}>{label}</a>)}
        <button className="btn btn-primary" onClick={()=>{setOpen(false);onRegister()}}>REGISTER NOW</button>
      </div>}
    </header>
  );
}
