import { useState, useEffect, useCallback } from 'react';
import { bookmarkService } from '../services/bookmarkService';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => bookmarkService.getAll());

  const refreshBookmarks = useCallback(() => {
    setBookmarks(bookmarkService.getAll());
  }, []);

  useEffect(() => {
    const handleStorage = () => refreshBookmarks();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshBookmarks]);

  const toggleBookmark = useCallback((eventId) => {
    const isNowBookmarked = bookmarkService.toggle(eventId);
    refreshBookmarks();
    return isNowBookmarked;
  }, [refreshBookmarks]);

  const isBookmarked = useCallback((eventId) => {
    return bookmarks.includes(eventId);
  }, [bookmarks]);

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    refreshBookmarks,
    totalBookmarks: bookmarks.length,
  };
}
