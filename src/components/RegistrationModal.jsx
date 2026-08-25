import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Check, Copy, Mail, MessageCircle, Phone, QrCode, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { EVENTS_DATA } from '../data/eventsData';
import { makeQrPayload, makeTicketId, saveAttendee } from '../utils/attendeeStore';

export default function RegistrationModal({ defaultEvent, onClose }) {
  const [eventId, setEventId] = useState(defaultEvent?.id || '');
  const [done, setDone] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [copied, setCopied] = useState(false);

  const selectedEvent = useMemo(
    () => EVENTS_DATA.find((event) => event.id === eventId),
    [eventId]
  );

  const submit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const attendee = {
      id: makeTicketId(),
      name: String(form.get('name')).trim(),
      email: String(form.get('email')).trim(),
      phone: String(form.get('phone')).trim(),
      college: String(form.get('college')).trim(),
      teamSize: String(form.get('teamSize')).trim(),
      eventId,
      eventName: selectedEvent?.name || 'PULSE 2026',
      registeredAt: new Date().toISOString(),
      checkIn: null,
      checkOut: null,
    };

    saveAttendee(attendee);
    setTicket(attendee);
    setDone(true);
  };

  const qrValue = ticket ? makeQrPayload(ticket) : '';
  const shareText = ticket
    ? `PULSE 2026 registration confirmed. Ticket ${ticket.id}. Event: ${ticket.eventName}. Show your QR ticket at entry.`
    : '';

  const whatsappUrl = ticket
    ? `https://wa.me/${ticket.phone.replace(/\D/g, '')}?text=${encodeURIComponent(shareText)}`
    : '#';

  const smsUrl = ticket
    ? `sms:${ticket.phone}?body=${encodeURIComponent(shareText)}`
    : '#';

  const emailUrl = ticket
    ? `mailto:${ticket.email}?subject=${encodeURIComponent('PULSE 2026 — Registration Confirmed')}&body=${encodeURIComponent(shareText)}`
    : '#';

  const copyTicket = async () => {
    if (!ticket) return;
    try {
      await navigator.clipboard.writeText(ticket.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable in some browsers.
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="register-modal register-modal-enhanced" role="dialog" aria-modal="true" aria-labelledby="register-title">
        <button className="modal-close" onClick={onClose} aria-label="Close registration">
          <X />
        </button>

        {!done ? (
          <>
            <span className="eyebrow">REGISTRATION · 2026</span>
            <h2 id="register-title">Claim your<br /><em>spot.</em></h2>
            <p>Register once and receive a digital QR ticket for event-day check-in.</p>

            <form onSubmit={submit}>
              <label>FULL NAME<input name="name" required placeholder="Your name" /></label>
              <label>EMAIL<input name="email" required type="email" placeholder="you@example.com" /></label>
              <label>PHONE / WHATSAPP<input name="phone" required type="tel" placeholder="+91 98765 43210" /></label>
              <label>COLLEGE<input name="college" required placeholder="College / University" /></label>

              <div className="register-form-grid">
                <label>
                  TEAM SIZE
                  <select name="teamSize" defaultValue="1" required>
                    {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'Member' : 'Members'}</option>)}
                  </select>
                </label>
                <label>
                  EVENT
                  <select required value={eventId} onChange={(e) => setEventId(e.target.value)}>
                    <option value="">Choose an event</option>
                    {EVENTS_DATA.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select>
                </label>
              </div>

              <button className="btn btn-accent" type="submit">
                Generate QR ticket <QrCode size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="ticket-success">
            <div className="success-copy">
              <div className="success-icon"><Check /></div>
              <span className="eyebrow">REGISTRATION CONFIRMED</span>
              <h2>You're<br /><em>inside.</em></h2>
              <p>Save this ticket. The QR code can be scanned by the event team for check-in and check-out.</p>

              <div className="ticket-meta">
                <div><span>ATTENDEE</span><strong>{ticket.name}</strong></div>
                <div><span>EVENT</span><strong>{ticket.eventName}</strong></div>
                <div><span>TICKET ID</span><strong>{ticket.id}</strong></div>
              </div>

              <div className="ticket-actions">
                <a className="btn btn-accent" href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a className="btn btn-dark" href={emailUrl}>
                  <Mail size={16} /> Email
                </a>
                <a className="btn btn-dark" href={smsUrl}>
                  <Phone size={16} /> SMS
                </a>
                <button className="btn btn-dark" onClick={copyTicket}>
                  <Copy size={16} /> {copied ? 'Copied' : 'Copy ID'}
                </button>
              </div>
            </div>

            <div className="qr-ticket">
              <div className="qr-ticket-head">
                <span>PULSE 2026</span>
                <QrCode size={17} />
              </div>
              <div className="qr-box">
                <QRCodeSVG value={qrValue} size={210} bgColor="#ffffff" fgColor="#05050a" includeMargin />
              </div>
              <div className="qr-ticket-id">{ticket.id}</div>
              <small>SCAN AT ENTRY · KEEP THIS TICKET SAFE</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
