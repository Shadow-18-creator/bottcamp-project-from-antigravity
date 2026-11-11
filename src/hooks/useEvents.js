import { useState, useEffect, useCallback, useMemo } from 'react';
import { eventService } from '../services/eventService';
import { resetStorageToDefaults } from '../services/storage';

export function useEvents(initialCategory = 'All', initialSearch = '') {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('date-asc'); // 'date-asc', 'date-desc', 'popularity', 'capacity'

  const refreshEvents = useCallback(() => {
    try {
      const data = eventService.getAll();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshEvents();

    // Listen to storage events across tabs or local triggers
    const handleStorageChange = () => refreshEvents();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshEvents]);

  // Client-side search and category filtering
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        event.category?.toLowerCase() === selectedCategory.toLowerCase();

      // Search filter (name / title / tagline / tags)
      const cleanQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !cleanQuery ||
        event.title?.toLowerCase().includes(cleanQuery) ||
        event.tagline?.toLowerCase().includes(cleanQuery) ||
        event.venue?.toLowerCase().includes(cleanQuery) ||
        event.tags?.some((tag) => tag.toLowerCase().includes(cleanQuery));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (sortBy === 'date-desc') {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      if (sortBy === 'popularity') {
        return (b.registeredCount || 0) - (a.registeredCount || 0);
      }
      if (sortBy === 'capacity') {
        return (b.capacity || 0) - (a.capacity || 0);
      }
      return 0;
    });
  }, [events, selectedCategory, searchQuery, sortBy]);

  const createEvent = useCallback((eventData) => {
    const created = eventService.create(eventData);
    refreshEvents();
    return created;
  }, [refreshEvents]);

  const updateEvent = useCallback((id, updatedFields) => {
    const updated = eventService.update(id, updatedFields);
    refreshEvents();
    return updated;
  }, [refreshEvents]);

  const deleteEvent = useCallback((id) => {
    const deleted = eventService.delete(id);
    refreshEvents();
    return deleted;
  }, [refreshEvents]);

  const resetAllToSeed = useCallback(() => {
    resetStorageToDefaults();
    refreshEvents();
  }, [refreshEvents]);

  return {
    events,
    filteredEvents,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    refreshEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    resetAllToSeed,
  };
}
