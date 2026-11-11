import React, { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { SearchBar } from '../components/events/SearchBar';
import { CategoryFilter } from '../components/events/CategoryFilter';
import { EventGrid } from '../components/events/EventGrid';
import { RegisterModal } from '../components/registration/RegisterModal';
import { DigitalTicket } from '../components/registration/DigitalTicket';
import { Modal } from '../components/common/Modal';
import { Sparkles, Calendar, TrendingUp, Users, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

export function HomePage() {
  const {
    filteredEvents,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    events,
  } = useEvents();

  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [successTicket, setSuccessTicket] = useState(null);

  // Compute event counts per category
  const eventCounts = useMemo(() => {
    const counts = { All: events.length };
    CATEGORIES.forEach((cat) => {
      if (cat.id !== 'All') {
        counts[cat.id] = events.filter(
          (e) => e.category?.toLowerCase() === cat.id.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, [events]);

  const featuredEvent = useMemo(() => {
    return events.find((e) => e.featured) || events[0];
  }, [events]);

  return (
    <div className="min-h-screen">
      {/* Hero Spotlight Section */}
      <section className="bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-700/60 text-indigo-200 text-xs font-semibold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Campus Life • Fall 2026</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
              Discover Every College Event, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-300">
                All In One Campus Feed.
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
              Never miss a hackathon, cultural fest, tournament, or guest seminar again. One unified platform for campus life.
            </p>

            {/* Central Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search events by title, keyword, or venue (press '/' to focus)..."
              />
            </div>
          </div>

          {/* Quick Stat Pill Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 text-center">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
              <span className="text-xl font-bold text-white block">{events.length}</span>
              <span className="text-[11px] text-slate-300">Live Campus Events</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
              <span className="text-xl font-bold text-indigo-300 block">
                {events.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0)}
              </span>
              <span className="text-[11px] text-slate-300">Student Registrations</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
              <span className="text-xl font-bold text-pink-300 block">
                {CATEGORIES.length - 1}
              </span>
              <span className="text-[11px] text-slate-300">Active Societies</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
              <span className="text-xl font-bold text-emerald-300 block">100%</span>
              <span className="text-[11px] text-slate-300">Free Admission</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Catalog Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6">
        {/* Sticky Filter & Sort Control Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex-1 overflow-hidden">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                eventCounts={eventCounts}
              />
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 self-end lg:self-center shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="date-asc">Date (Soonest first)</option>
                <option value="date-desc">Date (Furthest first)</option>
                <option value="popularity">Most Popular (RSVPs)</option>
                <option value="capacity">Largest Hall Capacity</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips / Status */}
          {(searchQuery || selectedCategory !== 'All') && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span>Showing results for:</span>
                {searchQuery && (
                  <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    "{searchQuery}"
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                    {selectedCategory}
                  </span>
                )}
                <span className="text-slate-400">({filteredEvents.length} found)</span>
              </div>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Event Cards Grid */}
        <EventGrid
          events={filteredEvents}
          loading={loading}
          onQuickRegister={(evt) => setRegisteringEvent(evt)}
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      </main>

      {/* Registration Modal */}
      <RegisterModal
        isOpen={Boolean(registeringEvent)}
        onClose={() => setRegisteringEvent(null)}
        event={registeringEvent}
        onSuccessTicket={(ticket) => setSuccessTicket(ticket)}
      />

      {/* Success Ticket Modal */}
      <Modal
        isOpen={Boolean(successTicket)}
        onClose={() => setSuccessTicket(null)}
        title="Your Official Event Pass"
        maxWidth="max-w-md"
      >
        <DigitalTicket
          ticket={successTicket}
          onCancel={() => setSuccessTicket(null)}
        />
      </Modal>
    </div>
  );
}
