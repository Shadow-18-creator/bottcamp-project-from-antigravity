import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CATEGORIES } from '../../utils/constants';
import { Calendar, Save, Image, Sparkles } from 'lucide-react';

const SAMPLE_BANNERS = [
  { label: 'Tech / Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cultural / Concert', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sports', url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Workshop / AI', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Seminar', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Social / Comedy', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80' },
];

export function EventFormModal({ isOpen, onClose, onSubmit, initialEvent = null }) {
  const isEditing = Boolean(initialEvent);

  const getInitialFormState = () => ({
    title: initialEvent?.title || '',
    tagline: initialEvent?.tagline || '',
    description: initialEvent?.description || '',
    category: initialEvent?.category || 'Technical',
    tags: initialEvent?.tags ? initialEvent.tags.join(', ') : 'Campus, Student',
    bannerUrl: initialEvent?.bannerUrl || SAMPLE_BANNERS[0].url,
    venue: initialEvent?.venue || '',
    organizerName: initialEvent?.organizerName || 'College Student Council',
    organizerContact: initialEvent?.organizerContact || 'events@campusconnect.edu',
    capacity: initialEvent?.capacity || 100,
    startDate: initialEvent?.startDate
      ? new Date(initialEvent.startDate).toISOString().slice(0, 16)
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 16),
    endDate: initialEvent?.endDate
      ? new Date(initialEvent.endDate).toISOString().slice(0, 16)
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 3).toISOString().slice(0, 16),
    eligibility: initialEvent?.eligibility || 'Open to all enrolled students',
    prerequisites: initialEvent?.prerequisites || 'Carry valid College Student ID Card.',
    featured: initialEvent?.featured || false,
  });

  const [formData, setFormData] = useState(getInitialFormState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setError('');
    }
  }, [isOpen, initialEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.venue.trim() || !formData.description.trim()) {
      setError('Please fill in all mandatory fields (Title, Venue, and Description).');
      return;
    }

    if (Number(formData.capacity) <= 0) {
      setError('Capacity must be a positive integer greater than 0.');
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      venue: formData.venue.trim(),
      capacity: Number(formData.capacity),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Campus Event' : 'Create New Campus Event'}
      maxWidth="max-w-2xl"
    >
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Event Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. National Hackathon 2026"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tagline / Subheading
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="Short catchy summary for the event card"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.filter((c) => c.id !== 'All').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seat Capacity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="5000"
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Date & Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Start Date & Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* End Date & Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              End Date & Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Venue */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Venue / Hall Location <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            placeholder="e.g. Main Auditorium / CS Lab 3"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Banner Image URL & Presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Banner Image URL
          </label>
          <input
            type="url"
            value={formData.bannerUrl}
            onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          />

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
            <span>Quick presets:</span>
            {SAMPLE_BANNERS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setFormData({ ...formData, bannerUrl: preset.url })}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Organizer info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organizer Club / Dept
            </label>
            <input
              type="text"
              value={formData.organizerName}
              onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.organizerContact}
              onChange={(e) => setFormData({ ...formData, organizerContact: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Event Description & Agenda <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Comprehensive description of activities, schedule, and guest speakers..."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Hackathon, AI, WebDev, Cash Prizes"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Save}>
            {isEditing ? 'Save Changes' : 'Publish Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
