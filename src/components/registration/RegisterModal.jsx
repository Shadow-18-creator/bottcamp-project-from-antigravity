import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Calendar, MapPin, AlertCircle, CheckCircle2, Ticket } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { DEPARTMENTS, YEARS_OF_STUDY } from '../../utils/constants';
import { useRegistrations } from '../../hooks/useRegistrations';
import { useRole } from '../../context/RoleContext';
import { useToast } from '../../context/ToastContext';

export function RegisterModal({ isOpen, onClose, event, onSuccessTicket }) {
  const { studentProfile } = useRole();
  const { registerForEvent, isUserRegistered } = useRegistrations();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    department: DEPARTMENTS[0],
    year: YEARS_OF_STUDY[2],
  });

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync with default simulated student profile on open
  useEffect(() => {
    if (isOpen && studentProfile) {
      setFormData({
        name: studentProfile.name || '',
        email: studentProfile.email || '',
        rollNo: studentProfile.rollNo || '',
        department: studentProfile.department || DEPARTMENTS[0],
        year: studentProfile.year || YEARS_OF_STUDY[2],
      });
      setFormError('');
    }
  }, [isOpen, studentProfile]);

  if (!event) return null;

  const isFull = event.registeredCount >= event.capacity;
  const alreadyRegistered =
    isUserRegistered(event.id, formData.email) ||
    isUserRegistered(event.id, formData.rollNo);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.rollNo.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    // Basic email validation
    if (!formData.email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    try {
      setSubmitting(true);
      const ticket = registerForEvent(event.id, formData);
      success(`Successfully registered for ${event.title}!`);
      onClose();
      if (onSuccessTicket) {
        onSuccessTicket(ticket);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to complete registration.');
      toastError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register for Event" maxWidth="max-w-xl">
      {/* Event Summary Header */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-6">
        <h4 className="font-bold text-slate-900 text-sm mb-1">{event.title}</h4>
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
          <span className="flex items-center gap-1 text-indigo-600 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(event.startDate)} • {formatTime(event.startDate)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {event.venue}
          </span>
        </div>
      </div>

      {/* Warning if already registered or full */}
      {alreadyRegistered && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Already Registered:</strong> You already hold a confirmed registration for this event under your student ID or email.
          </div>
        </div>
      )}

      {isFull && !alreadyRegistered && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong>Capacity Reached:</strong> This event has filled all {event.capacity} seats. Registrations are currently closed.
          </div>
        </div>
      )}

      {formError && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Alex Johnson"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Roll Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student Roll / ID No. <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
              placeholder="e.g. CS-2023-042"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* College Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              College Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. alex@student.edu"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Year of Study */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Year of Study <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {YEARS_OF_STUDY.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Ticket}
            disabled={submitting || isFull || alreadyRegistered}
          >
            {submitting ? 'Confirming...' : 'Confirm Registration'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
