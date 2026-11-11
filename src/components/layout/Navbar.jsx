import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Calendar,
  Bookmark,
  ShieldCheck,
  User,
  Menu,
  X,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useRegistrations } from '../../hooks/useRegistrations';

export function Navbar() {
  const location = useLocation();
  const { role, toggleRole, isAdmin } = useRole();
  const { totalBookmarks } = useBookmarks();
  const { totalRegistrations } = useRegistrations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">CampusConnect</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200/60">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Centralized College Events</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Explore Events
            </Link>

            <Link
              to="/my-events"
              className={`relative px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                isActive('/my-events')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Ticket className="w-4 h-4 text-indigo-500" />
              <span>My Passes</span>
              {(totalRegistrations > 0 || totalBookmarks > 0) && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-semibold bg-indigo-600 text-white rounded-full min-w-5">
                  {totalRegistrations + totalBookmarks}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  isActive('/admin')
                    ? 'bg-violet-100 text-violet-800 font-semibold'
                    : 'text-violet-700 hover:bg-violet-50 font-medium'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-violet-600" />
                <span>Admin Studio</span>
              </Link>
            )}
          </nav>

          {/* Role Switcher Pill */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={toggleRole}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  role === 'student'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch role"
              >
                <User className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                onClick={toggleRole}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  role === 'admin'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch role"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
            }`}
          >
            Explore Events
          </Link>

          <Link
            to="/my-events"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/my-events') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-indigo-500" />
              My Passes & Bookmarks
            </span>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-semibold">
              {totalRegistrations + totalBookmarks}
            </span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/admin') ? 'bg-violet-100 text-violet-800' : 'text-violet-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-violet-600" />
              Admin Studio
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Viewing role:</span>
            <button
              onClick={toggleRole}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-slate-50 text-slate-800 hover:bg-slate-100"
            >
              Switch to {role === 'student' ? 'Admin Mode' : 'Student Mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
