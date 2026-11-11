import { STORAGE_KEYS } from '../utils/constants';
import { INITIAL_EVENTS } from './seedData';

/**
 * Safely reads from localStorage with JSON parsing and fallback.
 */
export function getStorageItem(key, fallback = null) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

/**
 * Safely writes to localStorage.
 */
export function setStorageItem(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Initializes localStorage with seed events if not previously seeded.
 */
export function initializeStorage() {
  const isInitialized = getStorageItem(STORAGE_KEYS.INITIALIZED, false);
  const existingEvents = getStorageItem(STORAGE_KEYS.EVENTS, null);

  if (!isInitialized || !existingEvents || existingEvents.length === 0) {
    setStorageItem(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    setStorageItem(STORAGE_KEYS.REGISTRATIONS, []);
    setStorageItem(STORAGE_KEYS.BOOKMARKS, []);
    setStorageItem(STORAGE_KEYS.INITIALIZED, true);
    return INITIAL_EVENTS;
  }

  return existingEvents;
}

/**
 * Force resets storage back to default initial seed events.
 */
export function resetStorageToDefaults() {
  setStorageItem(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  setStorageItem(STORAGE_KEYS.REGISTRATIONS, []);
  setStorageItem(STORAGE_KEYS.BOOKMARKS, []);
  setStorageItem(STORAGE_KEYS.INITIALIZED, true);
  return INITIAL_EVENTS;
}
