import { useState, useEffect, useCallback } from 'react';
import { registrationService } from '../services/registrationService';

export function useRegistrations() {
  const [registrations, setRegistrations] = useState(() => registrationService.getAll());

  const refreshRegistrations = useCallback(() => {
    setRegistrations(registrationService.getAll());
  }, []);

  useEffect(() => {
    const handleStorage = () => refreshRegistrations();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshRegistrations]);

  const registerForEvent = useCallback((eventId, studentData) => {
    const newReg = registrationService.register(eventId, studentData);
    refreshRegistrations();
    return newReg;
  }, [refreshRegistrations]);

  const cancelRegistration = useCallback((registrationId) => {
    const success = registrationService.cancel(registrationId);
    refreshRegistrations();
    return success;
  }, [refreshRegistrations]);

  const isUserRegistered = useCallback((eventId, identifier) => {
    return registrationService.isRegistered(eventId, identifier);
  }, []);

  const getRegistrationsForEvent = useCallback((eventId) => {
    return registrationService.getByEventId(eventId);
  }, []);

  return {
    registrations,
    registerForEvent,
    cancelRegistration,
    isUserRegistered,
    getRegistrationsForEvent,
    refreshRegistrations,
    totalRegistrations: registrations.length,
  };
}
