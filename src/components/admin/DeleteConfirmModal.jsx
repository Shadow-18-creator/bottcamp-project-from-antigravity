import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, eventTitle }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Event" maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-1">
            Are you sure you want to delete this event?
          </h4>
          <p className="text-xs text-slate-600 mb-2">
            This will permanently remove <strong className="text-slate-900">"{eventTitle}"</strong> from the campus portal, including all student registrations and bookmarks.
          </p>
          <span className="text-[11px] text-rose-600 font-semibold block">
            This action cannot be undone.
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm Delete
        </Button>
      </div>
    </Modal>
  );
}
