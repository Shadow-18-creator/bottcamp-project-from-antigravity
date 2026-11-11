import React from 'react';
import { Calendar, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight">CampusConnect</span>
              <p className="text-xs text-slate-400">The centralized college events platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <Link to="/" className="hover:text-indigo-600 transition">
              Explore Events
            </Link>
            <Link to="/my-events" className="hover:text-indigo-600 transition">
              My Passes & Bookmarks
            </Link>
            <Link to="/admin" className="hover:text-indigo-600 transition">
              Admin Portal
            </Link>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span>Built with React, Vite & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
