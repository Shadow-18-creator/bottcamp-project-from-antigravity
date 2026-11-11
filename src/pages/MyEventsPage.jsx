import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Bookmark, Calendar, ArrowRight, Trash2, Printer } from 'lucide-react';
import { useRegistrations } from '../hooks/useRegistrations';
import { useBookmarks } from '../hooks/useBookmarks';
import { useEvents } from '../hooks/useEvents';
import { DigitalTicket } from '../components/registration/DigitalTicket';
import { EventGrid } from '../components/events/EventGrid';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';

export function MyEventsPage() {
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'bookmarks'
  const { registrations, cancelRegistration } = useRegistrations();
  const { bookmarks } = useBookmarks();
  const { events } = useEvents();
  const { success } = useToast();

  const [activeTicketModal, setActiveTicketModal] = useState(null);

  // Filter bookmarked events
  const bookmarkedEvents = events.filter((e) => bookmarks.includes(e.id));

  const handleCancelTicket = (ticketId, eventTitle) => {
    if (window.confirm(`Are you sure you want to cancel your pass for "${eventTitle}"?`)) {
      cancelRegistration(ticketId);
      if (activeTicketModal?.id === ticketId) {
        setActiveTicketModal(null);
      }
      success(`Pass for "${eventTitle}" cancelled.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Passes & Saved Events
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Access your digital admission passes and track upcoming events you bookmarked.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 pb-3.5 px-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'tickets'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Registered Passes</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
            {registrations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 pb-3.5 px-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'bookmarks'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarked Events</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {bookmarkedEvents.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Registered Passes */}
      {activeTab === 'tickets' && (
        <div>
          {registrations.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No event passes yet"
              description="You haven't registered for any campus events yet. Explore upcoming hackathons, cultural nights, and tournaments to claim your free pass!"
              actionText="Explore Campus Events"
              onAction={() => (window.location.href = '/')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-medium text-indigo-600 mb-2">
                      <span className="bg-indigo-50 px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold">
                        {ticket.id}
                      </span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        Confirmed
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-2">
                      {ticket.eventTitle}
                    </h3>

                    <p className="text-xs text-slate-500 mb-4">
                      {ticket.eventVenue}
                    </p>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Attendee:</span>
                        <strong className="text-slate-800">{ticket.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Roll No:</span>
                        <strong className="text-slate-800">{ticket.rollNo}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setActiveTicketModal(ticket)}
                    >
                      View QR Pass
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleCancelTicket(ticket.id, ticket.eventTitle)}
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      title="Cancel Pass"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Bookmarked Events */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarkedEvents.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No bookmarked events"
              description="Save interesting events by tapping the heart icon on any event card, so you can easily find them later."
              actionText="Browse Events"
              onAction={() => (window.location.href = '/')}
            />
          ) : (
            <EventGrid events={bookmarkedEvents} />
          )}
        </div>
      )}

      {/* Ticket Pass Viewer Modal */}
      <Modal
        isOpen={Boolean(activeTicketModal)}
        onClose={() => setActiveTicketModal(null)}
        title="Official Event Pass"
        maxWidth="max-w-md"
      >
        <DigitalTicket
          ticket={activeTicketModal}
          onCancel={handleCancelTicket}
        />
      </Modal>
    </div>
  );
}
