import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  Share2,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Ticket,
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { formatDate, formatTime, getRelativeTime, isPastEvent } from '../utils/dateUtils';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { RegisterModal } from '../components/registration/RegisterModal';
import { DigitalTicket } from '../components/registration/DigitalTicket';
import { Modal } from '../components/common/Modal';
import { useBookmarks } from '../hooks/useBookmarks';
import { useRegistrations } from '../hooks/useRegistrations';
import { useRole } from '../context/RoleContext';
import { useToast } from '../context/ToastContext';

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [viewTicketModal, setViewTicketModal] = useState(false);

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { registrations, isUserRegistered, cancelRegistration } = useRegistrations();
  const { studentProfile } = useRole();
  const { success, info } = useToast();

  useEffect(() => {
    const data = eventService.getById(id);
    setEvent(data);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-6" />
        <div className="h-80 bg-slate-200 rounded-2xl w-full mb-8" />
        <div className="h-8 bg-slate-200 rounded w-3/4 mb-4" />
        <div className="h-24 bg-slate-100 rounded w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Event Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          This event may have been cancelled, deleted, or the URL link is invalid.
        </p>
        <Link to="/">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Explore Events
          </Button>
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(event.id);
  const userTicket = registrations.find(
    (r) =>
      r.eventId === event.id &&
      (r.email?.toLowerCase() === studentProfile.email?.toLowerCase() ||
        r.rollNo?.toLowerCase() === studentProfile.rollNo?.toLowerCase())
  );

  const alreadyRegistered = Boolean(userTicket);
  const isPast = isPastEvent(event.startDate);
  const isFull = event.registeredCount >= event.capacity;
  const capacityPercent = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.capacity || 1)) * 100)
  );

  const handleBookmarkToggle = () => {
    const newState = toggleBookmark(event.id);
    if (newState) {
      success('Saved to your bookmarks!');
    } else {
      info('Removed from your bookmarks.');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Event link copied to clipboard!');
    }
  };

  const handleCancelTicket = (ticketId) => {
    if (window.confirm('Are you sure you want to cancel your confirmed ticket pass?')) {
      cancelRegistration(ticketId);
      setViewTicketModal(false);
      // Reload updated event counts
      setEvent(eventService.getById(id));
      success('Registration cancelled successfully.');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Share event link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-xl border transition ${
                bookmarked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark event'}
            >
              <Heart className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Banner Hero */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg h-72 sm:h-96 w-full mb-8 bg-slate-900">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />

          {/* Banner Overlays */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge variant={event.category} size="md" className="backdrop-blur-md shadow-md font-semibold">
              {event.category}
            </Badge>
            <span className="text-xs font-medium text-white/90 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full">
              {getRelativeTime(event.startDate)}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
              {event.title}
            </h1>
            {event.tagline && (
              <p className="text-slate-200 text-sm sm:text-base max-w-2xl line-clamp-2">
                {event.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Content Layout: Main Info (Left) + Booking Sticky Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase">Schedule</span>
                  <strong className="text-sm text-slate-900 block font-semibold">
                    {formatDate(event.startDate)}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {formatTime(event.startDate)} – {formatTime(event.endDate)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase">Location</span>
                  <strong className="text-sm text-slate-900 block font-semibold truncate">
                    {event.venue}
                  </strong>
                  <span className="text-xs text-slate-500">College Campus</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                About this Event
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {event.description}
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-400 mr-1">Tags:</span>
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Eligibility & Prerequisites */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Participation Guidelines</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <strong className="text-slate-900 block font-semibold mb-1">Eligibility</strong>
                  <p className="text-slate-600">{event.eligibility || 'Open to all students'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <strong className="text-slate-900 block font-semibold mb-1">Prerequisites / What to bring</strong>
                  <p className="text-slate-600">{event.prerequisites || 'Carry your Student ID'}</p>
                </div>
              </div>
            </section>

            {/* Organizer Info */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  {event.organizerName?.charAt(0) || 'C'}
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Organized by</span>
                  <h4 className="font-bold text-sm text-slate-900">{event.organizerName}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    {event.organizerContact}
                  </p>
                </div>
              </div>

              <div className="hidden sm:block">
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Society
                </span>
              </div>
            </section>
          </div>

          {/* Right Action Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Entry Fee</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900">Free</span>
                  <span className="text-xs text-slate-500 font-medium">Campus Sponsored</span>
                </div>
              </div>

              {/* Capacity Progress */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600">Remaining Seats</span>
                  <span className={isFull ? 'text-rose-600' : 'text-slate-900'}>
                    {Math.max(0, event.capacity - (event.registeredCount || 0))} left
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isFull
                        ? 'bg-rose-500'
                        : capacityPercent > 80
                        ? 'bg-amber-500'
                        : 'bg-indigo-600'
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 text-right">
                  {event.registeredCount || 0} of {event.capacity} total capacity booked
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {alreadyRegistered ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>You have a confirmed pass for this event!</span>
                    </div>

                    <Button
                      variant="primary"
                      className="w-full"
                      icon={Ticket}
                      onClick={() => setViewTicketModal(true)}
                    >
                      View Digital Pass
                    </Button>
                  </div>
                ) : isPast ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Event Ended
                  </Button>
                ) : isFull ? (
                  <div className="space-y-2">
                    <Button variant="danger" className="w-full" disabled>
                      Sold Out
                    </Button>
                    <p className="text-center text-xs text-slate-400">
                      Capacity limit reached for this venue.
                    </p>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={Ticket}
                    onClick={() => setIsRegisterOpen(true)}
                  >
                    Register for Event
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  icon={Heart}
                  onClick={handleBookmarkToggle}
                >
                  {bookmarked ? 'Remove Bookmark' : 'Bookmark Event'}
                </Button>
              </div>

              {/* Safety notice */}
              <p className="text-[11px] text-slate-400 text-center leading-normal">
                Registrations are instant and securely saved to your student pass wallet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        event={event}
        onSuccessTicket={(ticket) => {
          // Refresh current event count
          setEvent(eventService.getById(id));
          setViewTicketModal(true);
        }}
      />

      {/* Ticket Pass Viewer Modal */}
      <Modal
        isOpen={viewTicketModal}
        onClose={() => setViewTicketModal(false)}
        title="Your Official Event Pass"
        maxWidth="max-w-md"
      >
        <DigitalTicket
          ticket={userTicket}
          onCancel={handleCancelTicket}
        />
      </Modal>
    </div>
  );
}
