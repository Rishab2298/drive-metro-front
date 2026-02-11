// Add Note Modal Component with Attachment Support
import { useState, useRef } from 'react';
import { X, Paperclip, File, Loader2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveDriverNote, deleteDriverNote, getAttachmentUploadUrl, uploadAttachmentToS3 } from '@/services/scorecardService';
import { getDriverName } from '@/utils/scorecardUtils';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
};

export const AddNoteModal = ({ driver, onClose, onSave, getToken }) => {
  const [note, setNote] = useState(driver?.dspNote || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(driver?.dspNoteAttachment || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const isEditing = !!driver?.dspNote;
  const driverName = getDriverName(driver);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES[file.type]) {
      setError('Invalid file type. Allowed: PDF, JPG, PNG');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 2MB limit');
      return;
    }

    setAttachment(file);
    setExistingAttachment(null); // Remove existing attachment when new one selected
    setError(null);
  };

  const removeAttachment = () => {
    setAttachment(null);
    setExistingAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSave = async () => {
    if (!note.trim() && !attachment && !existingAttachment) return;

    setSaving(true);
    setError(null);
    setUploadProgress(0);

    try {
      let attachmentKey = existingAttachment;

      // Upload new attachment if selected
      if (attachment) {
        setUploadProgress(10);

        // Get presigned upload URL
        const { uploadUrl, key } = await getAttachmentUploadUrl(
          attachment.name,
          attachment.type,
          attachment.size,
          getToken
        );

        setUploadProgress(30);

        // Upload to S3
        await uploadAttachmentToS3(uploadUrl, attachment);
        attachmentKey = key;

        setUploadProgress(70);
      }

      // Save note with attachment
      await saveDriverNote(driver.id, note, getToken, attachmentKey);

      setUploadProgress(100);

      onSave?.({ note: note.trim(), attachmentKey });
      onClose();
    } catch (err) {
      console.error('Error saving note:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!driver?.dspNote && !driver?.dspNoteAttachment) return;

    setSaving(true);
    setError(null);

    try {
      await deleteDriverNote(driver.id, getToken);
      onSave?.(null);
      onClose();
    } catch (err) {
      console.error('Error deleting note:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const hasContent = note.trim() || attachment || existingAttachment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {isEditing ? 'Edit Note' : 'Add Note'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditing ? 'Edit' : 'Add'} a note for {driverName}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This note will be visible on the driver's public scorecard.
          </p>
        </div>
        <div className="p-6 space-y-4">
          {/* Note Text */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note here... (e.g., Great job this week! Keep up the good work.)"
            className="w-full h-32 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
          />

          {/* Attachment Section */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Attachment (optional)
            </label>

            {/* Show existing or new attachment */}
            {(attachment || existingAttachment) ? (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <File className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {attachment ? attachment.name : existingAttachment?.split('/').pop()}
                  </p>
                  {attachment && (
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.size)}
                    </p>
                  )}
                </div>
                <button
                  onClick={removeAttachment}
                  disabled={saving}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors disabled:opacity-50"
              >
                <Paperclip className="w-5 h-5 text-neutral-400" />
                <span className="text-sm text-muted-foreground">
                  Add PDF, JPG, or PNG (max 2MB)
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {saving && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Uploading attachment...
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
        <div className="p-6 pt-0 flex gap-3">
          {(isEditing || driver?.dspNoteAttachment) && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-foreground font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasContent || saving}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2',
              hasContent && !saving
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
            )}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : (isEditing ? 'Update Note' : 'Save Note')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;
