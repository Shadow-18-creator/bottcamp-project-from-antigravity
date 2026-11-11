import { STORAGE_KEYS } from '../utils/constants';
import { getStorageItem, setStorageItem, initializeStorage } from './storage';

export const eventService = {
  /**
   * Retrieves all events from storage.
   */
  getAll() {
    initializeStorage();
    return getStorageItem(STORAGE_KEYS.EVENTS, []);
  },

  /**
   * Retrieves a single event by its unique ID.
   */
  getById(id) {
    const events = this.getAll();
    return events.find((evt) => evt.id === id) || null;
  },

  /**
   * Creates a new event (Admin).
   */
  create(eventData) {
    const events = this.getAll();
    const newEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedEvents = [newEvent, ...events];
    setStorageItem(STORAGE_KEYS.EVENTS, updatedEvents);
    return newEvent;
  },

  /**
   * Updates an existing event (Admin).
   */
  update(id, updatedFields) {
    const events = this.getAll();
    const index = events.findIndex((evt) => evt.id === id);
    if (index === -1) {
      throw new Error(`Event with ID "${id}" not found.`);
    }

    const updatedEvent = {
      ...events[index],
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    events[index] = updatedEvent;
    setStorageItem(STORAGE_KEYS.EVENTS, events);
    return updatedEvent;
  },

  /**
   * Deletes an event by ID (Admin).
   */
  delete(id) {
    const events = this.getAll();
    const filteredEvents = events.filter((evt) => evt.id !== id);
    setStorageItem(STORAGE_KEYS.EVENTS, filteredEvents);

    // Also clean up registrations and bookmarks associated with this event
    const registrations = getStorageItem(STORAGE_KEYS.REGISTRATIONS, []);
    const filteredRegistrations = registrations.filter((reg) => reg.eventId !== id);
    setStorageItem(STORAGE_KEYS.REGISTRATIONS, filteredRegistrations);

    const bookmarks = getStorageItem(STORAGE_KEYS.BOOKMARKS, []);
    const filteredBookmarks = bookmarks.filter((bookmarkedId) => bookmarkedId !== id);
    setStorageItem(STORAGE_KEYS.BOOKMARKS, filteredBookmarks);

    return true;
  },

  /**
   * Increments the registered count for an event.
   */
  incrementRegistration(id) {
    const events = this.getAll();
    const event = events.find((evt) => evt.id === id);
    if (event) {
      event.registeredCount = (event.registeredCount || 0) + 1;
      setStorageItem(STORAGE_KEYS.EVENTS, events);
    }
    return event;
  },

  /**
   * Decrements the registered count for an event (e.g., if registration cancelled).
   */
  decrementRegistration(id) {
    const events = this.getAll();
    const event = events.find((evt) => evt.id === id);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      setStorageItem(STORAGE_KEYS.EVENTS, events);
    }
    return event;
  },
};
