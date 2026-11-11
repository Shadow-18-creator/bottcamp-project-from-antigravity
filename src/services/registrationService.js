import { STORAGE_KEYS } from '../utils/constants';
import { getStorageItem, setStorageItem } from './storage';
import { eventService } from './eventService';

export const registrationService = {
  /**
   * Retrieves all registrations.
   */
  getAll() {
    return getStorageItem(STORAGE_KEYS.REGISTRATIONS, []);
  },

  /**
   * Retrieves all registrations for a specific event.
   */
  getByEventId(eventId) {
    const all = this.getAll();
    return all.filter((r) => r.eventId === eventId);
  },

  /**
   * Checks if a user is already registered for an event by roll number or email.
   */
  isRegistered(eventId, identifier) {
    if (!identifier) return false;
    const cleanId = identifier.trim().toLowerCase();
    const all = this.getAll();
    return all.some(
      (r) =>
        r.eventId === eventId &&
        (r.email?.trim().toLowerCase() === cleanId || r.rollNo?.trim().toLowerCase() === cleanId)
    );
  },

  /**
   * Registers a student for an event.
   */
  register(eventId, studentData) {
    const event = eventService.getById(eventId);
    if (!event) {
      throw new Error('Event does not exist.');
    }

    if (event.registeredCount >= event.capacity) {
      throw new Error('Registration failed: This event has reached full capacity.');
    }

    const email = studentData.email?.trim().toLowerCase();
    const rollNo = studentData.rollNo?.trim().toUpperCase();

    if (this.isRegistered(eventId, email) || this.isRegistered(eventId, rollNo)) {
      throw new Error(`You are already registered for this event with Roll No "${rollNo}" or Email "${email}".`);
    }

    const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const qrToken = `PASS::${eventId}::${rollNo}::${Date.now()}`;

    const newRegistration = {
      id: ticketId,
      eventId,
      eventTitle: event.title,
      eventDate: event.startDate,
      eventVenue: event.venue,
      name: studentData.name.trim(),
      email,
      rollNo,
      department: studentData.department,
      year: studentData.year,
      registeredAt: new Date().toISOString(),
      qrToken,
      status: 'confirmed',
    };

    const all = this.getAll();
    setStorageItem(STORAGE_KEYS.REGISTRATIONS, [newRegistration, ...all]);

    // Increment event attendee count
    eventService.incrementRegistration(eventId);

    return newRegistration;
  },

  /**
   * Cancels a registration.
   */
  cancel(registrationId) {
    const all = this.getAll();
    const target = all.find((r) => r.id === registrationId);
    if (!target) return false;

    const filtered = all.filter((r) => r.id !== registrationId);
    setStorageItem(STORAGE_KEYS.REGISTRATIONS, filtered);

    // Decrement event counter
    eventService.decrementRegistration(target.eventId);
    return true;
  },
};
