// Bulk Note Modal Component
import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveBulkNotes } from '@/services/scorecardService';

export const BulkNoteModal = ({ selectedDrivers, onClose, onSave, getToken }) => {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!note.trim()) return;

    setSaving(true);
    setError(null);

    try {
      await saveBulkNotes(selectedDrivers, note, getToken);
      onSave?.(note.trim());
      onClose();
    } catch (err) {
      console.error('Error saving notes:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Add Note to {selectedDrivers.length} Drivers
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            This note will be added to all selected drivers' scorecards.
          </p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note here..."
            className="w-full h-32 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
          />
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-foreground font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!note.trim() || saving}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors',
              note.trim() && !saving
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
            )}
          >
            {saving ? 'Saving...' : 'Add Note to All'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkNoteModal;
