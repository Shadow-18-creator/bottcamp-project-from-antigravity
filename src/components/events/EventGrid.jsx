import React from 'react';
import { EventCard } from './EventCard';
import { EmptyState } from '../common/EmptyState';
import { SearchX } from 'lucide-react';

export function EventGrid({
  events = [],
  loading = false,
  onQuickRegister,
  onResetFilters,
  emptyTitle = 'No events match your criteria',
  emptyDescription = 'Try adjusting your search query, selecting "All Events", or clearing filters.',
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-4 h-96 animate-pulse flex flex-col justify-between"
          >
            <div className="h-44 bg-slate-200 rounded-xl w-full mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-5 bg-slate-200 rounded w-4/5" />
              <div className="h-3 bg-slate-100 rounded w-full" />
            </div>
            <div className="h-10 bg-slate-200 rounded-xl w-full mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={emptyTitle}
        description={emptyDescription}
        actionText={onResetFilters ? 'Clear Filters & Show All' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onQuickRegister={onQuickRegister}
        />
      ))}
    </div>
  );
}
