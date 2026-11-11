import { STORAGE_KEYS } from '../utils/constants';
import { getStorageItem, setStorageItem } from './storage';

export const bookmarkService = {
  /**
   * Retrieves all bookmarked event IDs.
   */
  getAll() {
    return getStorageItem(STORAGE_KEYS.BOOKMARKS, []);
  },

  /**
   * Checks whether an event is currently bookmarked.
   */
  isBookmarked(eventId) {
    const bookmarks = this.getAll();
    return bookmarks.includes(eventId);
  },

  /**
   * Toggles bookmark state for an event. Returns boolean indicating new state.
   */
  toggle(eventId) {
    const bookmarks = this.getAll();
    let updated;
    let isNowBookmarked = false;

    if (bookmarks.includes(eventId)) {
      updated = bookmarks.filter((id) => id !== eventId);
      isNowBookmarked = false;
    } else {
      updated = [eventId, ...bookmarks];
      isNowBookmarked = true;
    }

    setStorageItem(STORAGE_KEYS.BOOKMARKS, updated);
    return isNowBookmarked;
  },

  /**
   * Removes a bookmark directly.
   */
  remove(eventId) {
    const bookmarks = this.getAll();
    const updated = bookmarks.filter((id) => id !== eventId);
    setStorageItem(STORAGE_KEYS.BOOKMARKS, updated);
  },
};
