const STORAGE_KEY = 'pulse2026_attendees_v1';

export function getAttendees() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveAttendee(attendee) {
  const attendees = getAttendees();
  const next = [attendee, ...attendees.filter((item) => item.id !== attendee.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return attendee;
}

export function updateAttendee(id, patch) {
  const attendees = getAttendees();
  const updated = attendees.map((item) =>
    item.id === id ? { ...item, ...patch } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated.find((item) => item.id === id) || null;
}

export function findAttendee(id) {
  return getAttendees().find((item) => item.id === id) || null;
}

export function makeTicketId() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PLS-${Date.now().toString(36).slice(-4).toUpperCase()}-${random}`;
}

export function makeQrPayload(attendee) {
  return JSON.stringify({
    type: 'PULSE2026_TICKET',
    ticketId: attendee.id,
    eventId: attendee.eventId,
    name: attendee.name
  });
}

export function getStats() {
  const attendees = getAttendees();
  return {
    registered: attendees.length,
    checkedIn: attendees.filter((a) => a.checkIn).length,
    checkedOut: attendees.filter((a) => a.checkOut).length,
  };
}

export { STORAGE_KEY };
