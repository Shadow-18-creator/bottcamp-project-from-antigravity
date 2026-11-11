import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Eye,
  RotateCcw,
  Calendar,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useRegistrations } from '../hooks/useRegistrations';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatCards } from '../components/admin/StatCards';
import { EventFormModal } from '../components/admin/EventFormModal';
import { DeleteConfirmModal } from '../components/admin/DeleteConfirmModal';
import { AttendeeListModal } from '../components/admin/AttendeeListModal';
import { formatDate, formatTime } from '../utils/dateUtils';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { events, createEvent, updateEvent, deleteEvent, resetAllToSeed } = useEvents();
  const { totalRegistrations } = useRegistrations();
  const { success } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState(null);

  const filteredEvents = events.filter((evt) => {
    const matchCat = categoryFilter === 'All' || evt.category === categoryFilter;
    const matchQuery =
      !search.trim() ||
      evt.title?.toLowerCase().includes(search.toLowerCase()) ||
      evt.venue?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setFormModalOpen(true);
  };

  const handleOpenDelete = (evt) => {
    setEventToDelete(evt);
    setDeleteModalOpen(true);
  };

  const handleOpenAttendees = (evt) => {
    setSelectedEventForAttendees(evt);
    setAttendeeModalOpen(true);
  };

  const handleFormSubmit = (payload) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, payload);
      success(`Updated "${payload.title}" successfully!`);
    } else {
      createEvent(payload);
      success(`Published "${payload.title}" successfully!`);
    }
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      success(`Deleted "${eventToDelete.title}" and associated data.`);
      setEventToDelete(null);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all events and registrations back to default sample data?')) {
      resetAllToSeed();
      success('Database restored to original state!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Event Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage college events, view student attendance, and regulate hall capacities.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            icon={RotateCcw}
            onClick={handleResetData}
            title="Reset sample data"
          >
            Reset Data
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-initial"
          >
            Create New Event
          </Button>
        </div>
      </div>

      {/* Aggregate Statistics */}
      <StatCards events={events} totalRegistrations={totalRegistrations} />

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or venue..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">Filter Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Social">Social</option>
          </select>
        </div>
      </div>

      {/* Events Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No events found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Event</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date & Location</th>
                  <th className="py-3.5 px-4">Capacity / RSVPs</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((evt) => {
                  const isFull = evt.registeredCount >= evt.capacity;
                  const capacityPercent = Math.min(
                    100,
                    Math.round(((evt.registeredCount || 0) / (evt.capacity || 1)) * 100)
                  );

                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/70 transition">
                      {/* Title & Banner thumbnail */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.bannerUrl}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div>
                            <Link
                              to={`/events/${evt.id}`}
                              className="font-bold text-slate-900 hover:text-indigo-600 transition block leading-snug line-clamp-1"
                            >
                              {evt.title}
                            </Link>
                            <span className="text-xs text-slate-400 block line-clamp-1">
                              {evt.tagline || evt.organizerName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge variant={evt.category} size="sm">
                          {evt.category}
                        </Badge>
                      </td>

                      {/* Date & Venue */}
                      <td className="py-4 px-4 text-xs whitespace-nowrap">
                        <div className="font-medium text-slate-800 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{formatDate(evt.startDate)}</span>
                        </div>
                        <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-44">{evt.venue}</span>
                        </div>
                      </td>

                      {/* Capacity / RSVPs */}
                      <td className="py-4 px-4 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-800">
                            {evt.registeredCount || 0} / {evt.capacity}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              isFull
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {capacityPercent}%
                          </span>
                        </div>
                        <div className="w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              isFull ? 'bg-rose-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${capacityPercent}%` }}
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAttendees(evt)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="View registered attendees"
                          >
                            <Users className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(evt)}
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Edit event"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenDelete(evt)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Form Modal */}
      <EventFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialEvent={editingEvent}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        eventTitle={eventToDelete?.title}
      />

      {/* Attendee Roster Modal */}
      <AttendeeListModal
        isOpen={attendeeModalOpen}
        onClose={() => setAttendeeModalOpen(false)}
        event={selectedEventForAttendees}
      />
    </div>
  );
}
