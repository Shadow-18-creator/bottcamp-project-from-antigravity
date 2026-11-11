import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarX, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
        <CalendarX className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        The campus page or event link you are looking for does not exist or has been relocated.
      </p>
      <Link to="/">
        <Button variant="primary" icon={Home}>
          Back to Events Feed
        </Button>
      </Link>
    </div>
  );
}
