import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ArrowLeft, Check, LogIn, LogOut, QrCode, RefreshCw, ShieldCheck, UserRound, XCircle } from 'lucide-react';
import { findAttendee, getAttendees, getStats, updateAttendee } from '../utils/attendeeStore';

function parseTicket(decodedText) {
  try {
    const payload = JSON.parse(decodedText);
    if (payload?.type === 'PULSE2026_TICKET' && payload.ticketId) return payload;
  } catch {
    // Also accept a plain ticket ID pasted into the scanner.
  }
  if (decodedText.startsWith('PLS-')) return { ticketId: decodedText };
  return null;
}

export default function AdminDashboard() {
  const [attendee, setAttendee] = useState(null);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(getStats());
  const [recent, setRecent] = useState(getAttendees().slice(0, 8));
  const scannerRef = useRef(null);

  const refresh = () => {
    setStats(getStats());
    setRecent(getAttendees().slice(0, 8));
    if (attendee) setAttendee(findAttendee(attendee.id));
  };

  useEffect(() => {
    const scanner = new Html5Qrcode('pulse-qr-reader');
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (decodedText) => {
        const payload = parseTicket(decodedText);
        if (!payload) {
          setMessage('INVALID QR — not a PULSE 2026 ticket.');
          return;
        }
        const found = findAttendee(payload.ticketId);
        if (!found) {
          setMessage('TICKET NOT FOUND — this QR is not registered on this device.');
          return;
        }
        setAttendee(found);
        setMessage('');
      },
      () => {}
    ).catch(() => {
      setMessage('Camera unavailable. You can still use the demo by entering a Ticket ID below.');
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleCheckIn = () => {
    if (!attendee) return;
    if (attendee.checkIn) {
      setMessage(`ALREADY CHECKED IN at ${new Date(attendee.checkIn).toLocaleTimeString()}.`);
      return;
    }
    const updated = updateAttendee(attendee.id, { checkIn: new Date().toISOString() });
    setAttendee(updated);
    setMessage('CHECK-IN SUCCESSFUL');
    refresh();
  };

  const handleCheckOut = () => {
    if (!attendee) return;
    if (!attendee.checkIn) {
      setMessage('CHECK-OUT BLOCKED — attendee has not checked in.');
      return;
    }
    if (attendee.checkOut) {
      setMessage(`ALREADY CHECKED OUT at ${new Date(attendee.checkOut).toLocaleTimeString()}.`);
      return;
    }
    const updated = updateAttendee(attendee.id, { checkOut: new Date().toISOString() });
    setAttendee(updated);
    setMessage('CHECK-OUT SUCCESSFUL');
    refresh();
  };

  const loadById = (e) => {
    e.preventDefault();
    const id = new FormData(e.currentTarget).get('ticketId').trim();
    const found = findAttendee(id);
    setAttendee(found);
    setMessage(found ? '' : 'TICKET NOT FOUND');
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <a href="/" className="admin-brand"><span>TF</span> PULSE / ATTENDANCE CONTROL</a>
        <a href="/" className="admin-back"><ArrowLeft size={15}/> Back to fest</a>
      </header>

      <main className="admin-container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">STAFF CONSOLE · SECURE CHECKPOINT</span>
            <h1>Scan. <em>Verify.</em> Move.</h1>
            <p>QR-based event attendance with duplicate-scan protection and local demo persistence.</p>
          </div>
          <button className="btn btn-dark" onClick={refresh}><RefreshCw size={15}/> Refresh</button>
        </div>

        <section className="admin-stats">
          <div><span>REGISTERED</span><strong>{stats.registered}</strong></div>
          <div><span>CHECKED IN</span><strong>{stats.checkedIn}</strong></div>
          <div><span>CHECKED OUT</span><strong>{stats.checkedOut}</strong></div>
          <div><span>INSIDE NOW</span><strong>{stats.checkedIn - stats.checkedOut}</strong></div>
        </section>

        <section className="admin-grid">
          <div className="scanner-card">
            <div className="scanner-head"><span><QrCode size={16}/> LIVE QR SCANNER</span><i>CAMERA</i></div>
            <div id="pulse-qr-reader" />
            <form className="ticket-lookup" onSubmit={loadById}>
              <input name="ticketId" placeholder="Or enter PLS-XXXX-XXXX" />
              <button className="btn btn-dark" type="submit">Lookup</button>
            </form>
          </div>

          <div className="attendee-card">
            {!attendee ? (
              <div className="empty-attendee"><ShieldCheck size={38}/><h2>Awaiting scan</h2><p>Point the camera at a PULSE QR ticket.</p></div>
            ) : (
              <>
                <div className="verified"><Check size={16}/> VALID TICKET</div>
                <div className="attendee-name"><UserRound size={20}/><div><span>ATTENDEE</span><strong>{attendee.name}</strong></div></div>
                <div className="attendee-details">
                  <div><span>TICKET</span><strong>{attendee.id}</strong></div>
                  <div><span>EVENT</span><strong>{attendee.eventName}</strong></div>
                  <div><span>COLLEGE</span><strong>{attendee.college}</strong></div>
                  <div><span>PHONE</span><strong>{attendee.phone}</strong></div>
                </div>

                <div className="attendance-state">
                  <div className={attendee.checkIn ? 'done' : ''}>
                    <span>CHECK-IN</span>
                    <strong>{attendee.checkIn ? new Date(attendee.checkIn).toLocaleTimeString() : 'PENDING'}</strong>
                  </div>
                  <div className={attendee.checkOut ? 'done' : ''}>
                    <span>CHECK-OUT</span>
                    <strong>{attendee.checkOut ? new Date(attendee.checkOut).toLocaleTimeString() : 'PENDING'}</strong>
                  </div>
                </div>

                <div className="attendance-actions">
                  <button className="btn btn-accent" onClick={handleCheckIn}><LogIn size={16}/> Check in</button>
                  <button className="btn btn-dark" onClick={handleCheckOut}><LogOut size={16}/> Check out</button>
                </div>
              </>
            )}

            {message && (
              <div className={`scan-message ${message.includes('SUCCESSFUL') ? 'success' : 'warning'}`}>
                {message.includes('SUCCESSFUL') ? <Check size={15}/> : <XCircle size={15}/>} {message}
              </div>
            )}
          </div>
        </section>

        <section className="recent-card">
          <div className="recent-head"><span>RECENT REGISTRATIONS</span><small>LOCAL DEMO STORE</small></div>
          {recent.length === 0 ? <p className="recent-empty">No registrations yet. Register an attendee first.</p> : (
            <div className="recent-list">
              {recent.map((item) => (
                <button key={item.id} onClick={() => setAttendee(item)}>
                  <span>{item.name}</span>
                  <small>{item.id} · {item.checkIn ? 'CHECKED IN' : 'NOT CHECKED IN'}</small>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
