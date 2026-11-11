import React from 'react';
import { ShieldCheck, UserCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useEvents } from '../../hooks/useEvents';
import { useToast } from '../../context/ToastContext';

export function RoleBanner() {
  const { role, toggleRole, isAdmin } = useRole();
  const { resetAllToSeed } = useEvents();
  const { success } = useToast();

  const handleReset = () => {
    if (window.confirm('Reset all events, registrations, and bookmarks back to default college seed data?')) {
      resetAllToSeed();
      success('Reset to default college sample data successfully!');
    }
  };

  return (
    <div
      className={`border-b text-xs transition-colors py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 ${
        isAdmin
          ? 'bg-violet-950 text-violet-100 border-violet-800'
          : 'bg-indigo-950 text-indigo-100 border-indigo-800'
      }`}
    >
      <div className="flex items-center gap-2">
        {isAdmin ? (
          <ShieldCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
        ) : (
          <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        )}
        <span>
          Current Persona: <strong className="font-semibold capitalize text-white">{role}</strong> —{' '}
          {isAdmin
            ? 'You have administrative permissions to create, edit, and delete events.'
            : 'You are browsing as a student to discover, bookmark, and register for events.'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="text-slate-300 hover:text-white flex items-center gap-1 transition text-[11px] underline decoration-slate-500 underline-offset-2"
          title="Restore original events and clear custom tests"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Sample Data</span>
        </button>

        <button
          onClick={toggleRole}
          className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-[11px] transition shadow-xs ${
            isAdmin
              ? 'bg-violet-700 hover:bg-violet-600 text-white'
              : 'bg-indigo-700 hover:bg-indigo-600 text-white'
          }`}
        >
          <span>Switch to {isAdmin ? 'Student View' : 'Admin View'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
