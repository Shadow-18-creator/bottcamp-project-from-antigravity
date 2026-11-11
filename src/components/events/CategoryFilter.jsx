import React from 'react';
import {
  Sparkles,
  Code,
  Music,
  Trophy,
  Hammer,
  GraduationCap,
  Smile,
} from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

const ICON_MAP = {
  Sparkles,
  Code,
  Music,
  Trophy,
  Hammer,
  GraduationCap,
  Smile,
};

export function CategoryFilter({ selectedCategory, onSelectCategory, eventCounts = {} }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const IconComponent = ICON_MAP[cat.icon] || Sparkles;
        const isSelected = selectedCategory === cat.id;
        const count = eventCounts[cat.id];

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 ring-2 ring-indigo-600 ring-offset-2'
                : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
            <span>{cat.label}</span>
            {count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
