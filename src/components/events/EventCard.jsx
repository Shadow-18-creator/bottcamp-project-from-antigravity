import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatDate, formatTime, getRelativeTime, isPastEvent } from '../../utils/dateUtils';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useToast } from '../../context/ToastContext';
import { useRegistrations } from '../../hooks/useRegistrations';
import { useRole } from '../../context/RoleContext';

export function EventCard({ event, onQuickRegister }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isUserRegistered } = useRegistrations();
  const { studentProfile } = useRole();
  const { success, info } = useToast();

  const bookmarked = isBookmarked(event.id);
  const alreadyRegistered =
    isUserRegistered(event.id, studentProfile.email) ||
    isUserRegistered(event.id, studentProfile.rollNo);

  const past = isPastEvent(event.startDate);
  const isFull = event.registeredCount >= event.capacity;
  const capacityPercent = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.capacity || 1)) * 100)
  );

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleBookmark(event.id);
    if (newState) {
      success(`Bookmarked "${event.title.slice(0, 30)}..."`);
    } else {
      info(`Removed "${event.title.slice(0, 30)}..." from bookmarks`);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Banner Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={event.category} size="md" className="backdrop-blur-md shadow-xs font-semibold">
            {event.category}
          </Badge>
        </div>

        {/* Bookmark Heart Button */}
        <button
          onClick={handleBookmarkClick}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark event'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            bookmarked
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Relative Time Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white/90 bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          <span>{getRelativeTime(event.startDate)}</span>
        </div>

        {/* Status Overlay Tag */}
        {alreadyRegistered && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-semibold bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs">
            <CheckCircle className="w-3 h-3" />
            <span>Registered</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(event.startDate)}</span>
            <span>•</span>
            <span>{formatTime(event.startDate)}</span>
          </div>

          {/* Title */}
          <Link to={`/events/${event.id}`}>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition line-clamp-2 mb-1.5">
              {event.title}
            </h3>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {event.tagline || event.description}
          </p>

          {/* Venue */}
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Footer Area: Capacity Bar & Action */}
        <div>
          {/* Capacity Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Seats Booked</span>
              </span>
              <span className={isFull ? 'text-rose-600 font-semibold' : 'text-slate-700'}>
                {event.registeredCount || 0} / {event.capacity} ({capacityPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull
                    ? 'bg-rose-500'
                    : capacityPercent > 80
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <Link
              to={`/events/${event.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            {!past && !isFull && !alreadyRegistered && onQuickRegister && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickRegister(event);
                }}
                className="text-xs font-semibold py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-500/20 transition cursor-pointer"
              >
                Register
              </button>
            )}

            {isFull && !alreadyRegistered && (
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1.5 rounded-lg">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
