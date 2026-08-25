import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import EventsSection from './components/EventsSection';
import Schedule from './components/Schedule';
import CTA from './components/CTA';
import Footer from './components/Footer';
import RegistrationModal from './components/RegistrationModal';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const isAdmin = new URLSearchParams(window.location.search).get('admin') === '1';
  if (isAdmin) return <AdminDashboard />;
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let frame;
    const raf = (time) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, []);

  const openRegister = (event = null) => {
    setSelectedEvent(event);
    setRegisterOpen(true);
  };

  return (
    <div className="site-shell">
      <Navbar onRegister={() => openRegister()} />
      <main>
        <Hero onRegister={() => openRegister()} />
        <AboutSection />
        <EventsSection onRegister={openRegister} />
        <Schedule />
        <CTA onRegister={() => openRegister()} />
      </main>
      <Footer onRegister={() => openRegister()} />
      {registerOpen && (
        <RegistrationModal
          defaultEvent={selectedEvent}
          onClose={() => { setRegisterOpen(false); setSelectedEvent(null); }}
        />
      )}
    </div>
  );
}
