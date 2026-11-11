import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Users, Search, Download, Trash2, Mail, GraduationCap } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { useRegistrations } from '../../hooks/useRegistrations';
import { useToast } from '../../context/ToastContext';

export function AttendeeListModal({ isOpen, onClose, event }) {
  const { getRegistrationsForEvent, cancelRegistration } = useRegistrations();
  const { success } = useToast();
  const [search, setSearch] = useState('');

  if (!event) return null;

  const attendees = getRegistrationsForEvent(event.id);

  const filteredAttendees = attendees.filter((a) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      a.name?.toLowerCase().includes(q) ||
      a.rollNo?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.department?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (attendees.length === 0) return;
    const headers = ['Ticket ID,Name,Roll No,Email,Department,Year,Registered Date'];
    const rows = attendees.map(
      (a) =>
        `"${a.id}","${a.name}","${a.rollNo}","${a.email}","${a.department}","${a.year}","${a.registeredAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Exported attendee roster to CSV!');
  };

  const handleRevoke = (regId, attendeeName) => {
    if (window.confirm(`Revoke registration for ${attendeeName}?`)) {
      cancelRegistration(regId);
      success(`Registration for ${attendeeName} revoked.`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Attendees for "${event.title}"`}
      maxWidth="max-w-3xl"
    >
      {/* Stats summary bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-xs">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600" />
          <span>
            Total Confirmed: <strong className="text-slate-900 font-semibold">{attendees.length}</strong> / {event.capacity} capacity
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search attendee by name/roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            icon={Download}
            onClick={handleExportCSV}
            disabled={attendees.length === 0}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Attendees Table / List */}
      {filteredAttendees.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          {attendees.length === 0
            ? 'No students have registered for this event yet.'
            : 'No attendees matching the search query.'}
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Roll No</th>
                <th className="py-2.5 px-3">Department / Year</th>
                <th className="py-2.5 px-3">Registered At</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendees.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 block">{att.name}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {att.email}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">{att.rollNo}</td>
                  <td className="py-3 px-3 text-slate-600">
                    <div>{att.department}</div>
                    <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.2 rounded">
                      {att.year}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {formatDate(att.registeredAt)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleRevoke(att.id, att.name)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      title="Revoke pass"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 flex justify-end mt-4">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
