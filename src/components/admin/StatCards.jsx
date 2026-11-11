import React from 'react';
import { Calendar, Users, Percent, Sparkles } from 'lucide-react';

export function StatCards({ events = [], totalRegistrations = 0 }) {
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const totalBooked = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
  const fillRate = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  const uniqueCategories = new Set(events.map((e) => e.category)).size;

  const stats = [
    {
      label: 'Campus Events',
      value: events.length,
      subtext: 'Active on platform',
      icon: Calendar,
      color: 'indigo',
    },
    {
      label: 'Total RSVPs & Passes',
      value: totalBooked,
      subtext: 'Across all societies',
      icon: Users,
      color: 'violet',
    },
    {
      label: 'Seat Fill Rate',
      value: `${fillRate}%`,
      subtext: `${totalBooked} of ${totalCapacity} seats`,
      icon: Percent,
      color: 'emerald',
    },
    {
      label: 'Event Categories',
      value: uniqueCategories,
      subtext: 'Tech, Arts, Sports & more',
      icon: Sparkles,
      color: 'amber',
    },
  ];

  const colorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((st) => {
        const Icon = st.icon;
        return (
          <div
            key={st.label}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">{st.label}</span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  colorStyles[st.color]
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{st.value}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{st.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
