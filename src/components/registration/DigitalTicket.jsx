import React from 'react';
import { QrCode, Calendar, MapPin, User, CheckCircle2, Trash2, Printer } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { Button } from '../common/Button';

export function DigitalTicket({ ticket, onCancel }) {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md hover:shadow-lg transition overflow-hidden flex flex-col max-w-md mx-auto w-full">
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10 blur-xs" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
            Official Campus Pass
          </span>
          <span className="text-xs font-mono font-medium text-indigo-100">{ticket.id}</span>
        </div>
        <h3 className="font-bold text-lg leading-snug mb-1">{ticket.eventTitle}</h3>
        <p className="text-xs text-indigo-100 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(ticket.eventDate)} • {formatTime(ticket.eventDate)}
        </p>
      </div>

      {/* Perforated Divider Bar */}
      <div className="relative flex items-center justify-between px-2 bg-slate-50 border-y border-dashed border-slate-300 py-1">
        <div className="w-4 h-4 bg-slate-100 rounded-full -ml-4 border border-slate-300" />
        <div className="flex-1 border-t border-dashed border-slate-300 mx-2" />
        <div className="w-4 h-4 bg-slate-100 rounded-full -mr-4 border border-slate-300" />
      </div>

      {/* Ticket Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-4 text-xs mb-4">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-semibold">Attendee</span>
            <strong className="text-slate-900 block font-semibold truncate">{ticket.name}</strong>
            <span className="text-slate-500 text-[11px]">{ticket.rollNo}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-semibold">Department</span>
            <strong className="text-slate-900 block font-semibold truncate">{ticket.department}</strong>
            <span className="text-slate-500 text-[11px]">{ticket.year}</span>
          </div>

          <div className="col-span-2">
            <span className="text-slate-400 block text-[11px] uppercase font-semibold">Venue</span>
            <div className="flex items-center gap-1.5 text-slate-800 font-medium">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{ticket.eventVenue}</span>
            </div>
          </div>
        </div>

        {/* QR Code and Check-in verification box */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center text-slate-800 shadow-2xs shrink-0">
              <QrCode className="w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold text-xs mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmed Pass</span>
              </div>
              <p className="text-[10px] text-slate-500">Scan at entrance gate for instant admission</p>
            </div>
          </div>
        </div>

        {/* Ticket Actions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
            className="text-xs text-slate-600"
          >
            Print Pass
          </Button>

          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={() => onCancel(ticket.id, ticket.eventTitle)}
              className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              Cancel Pass
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
