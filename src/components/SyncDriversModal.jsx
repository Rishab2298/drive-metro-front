import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';
import {
  X,
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Users,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

const COUNTRIES = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '\u{1F1E8}\u{1F1E6}' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '\u{1F1F2}\u{1F1FD}' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '\u{1F1E6}\u{1F1FA}' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '\u{1F1EE}\u{1F1F3}' },
];

export default function SyncDriversModal({ isOpen, onClose, onSyncComplete }) {
  const { getToken } = useAuth();
  const [countryCode, setCountryCode] = useState('US');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const resetState = useCallback(() => {
    setFile(null);
    setError(null);
    setResults(null);
    setUploading(false);
    setSyncing(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return 'No file selected';
    if (selectedFile.name !== 'AssociateData.csv') {
      return 'File must be named "AssociateData.csv"';
    }
    if (!selectedFile.type.includes('csv') && !selectedFile.name.endsWith('.csv')) {
      return 'File must be a CSV file';
    }
    return null;
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    const droppedFile = e.dataTransfer.files[0];
    const validationError = validateFile(droppedFile);
    if (validationError) {
      setError(validationError);
      return;
    }
    setFile(droppedFile);
  }, []);

  const handleFileSelect = useCallback((e) => {
    setError(null);
    const selectedFile = e.target.files[0];
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }
    setFile(selectedFile);
  }, []);

  const handleSync = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const token = await getToken();

      // Step 1: Get presigned URL
      const presignResponse = await fetch(`${API_URL}/api/s3/presign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: 'text/csv',
        }),
      });

      if (!presignResponse.ok) {
        const errorData = await presignResponse.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const { uploadUrl, key } = await presignResponse.json();

      // Step 2: Upload to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      setUploading(false);
      setSyncing(true);

      // Step 3: Call sync endpoint
      const syncResponse = await fetch(`${API_URL}/api/drivers/sync`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          s3Key: key,
          countryCode,
        }),
      });

      if (!syncResponse.ok) {
        const errorData = await syncResponse.json();
        throw new Error(errorData.error || 'Failed to sync drivers');
      }

      const syncData = await syncResponse.json();
      setResults(syncData.results);
      setSyncing(false);

      // Notify parent to refresh driver list
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (err) {
      console.error('Sync error:', err);
      setError(err.message);
      setUploading(false);
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  const selectedCountry = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 px-6 py-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Sync Drivers</h2>
              <p className="text-sm text-neutral-300">
                Import from Amazon AssociateData.csv
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {results ? (
            // Results View
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-300">
                    Sync Complete
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {results.totalProcessed} drivers processed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-neutral-500" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {results.totalProcessed}
                  </p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <UserPlus className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {results.created}
                  </p>
                  <p className="text-xs text-muted-foreground">Created</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <UserCheck className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {results.updated}
                  </p>
                  <p className="text-xs text-muted-foreground">Updated</p>
                </div>
              </div>

              {results.errors && results.errors.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="font-medium text-amber-700 dark:text-amber-300 mb-2">
                    {results.errors.length} row(s) had errors:
                  </p>
                  <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-1 max-h-32 overflow-y-auto">
                    {results.errors.slice(0, 10).map((err, i) => (
                      <li key={i}>
                        Row {err.row}: {err.error}
                      </li>
                    ))}
                    {results.errors.length > 10 && (
                      <li>...and {results.errors.length - 10} more</li>
                    )}
                  </ul>
                </div>
              )}

              <button
                onClick={handleClose}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all',
                  'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
                  'hover:bg-neutral-800 dark:hover:bg-neutral-100'
                )}
              >
                Done
              </button>
            </div>
          ) : (
            // Upload View
            <div className="space-y-6">
              {/* Country Code Selector */}
              <div className="space-y-2">
                <Label>Country Code (for phone formatting)</Label>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <span>{selectedCountry.flag}</span>
                        <span>
                          {selectedCountry.name} ({selectedCountry.dialCode})
                        </span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>
                            {country.name} ({country.dialCode})
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Phone numbers without country codes will be formatted with this prefix
                </p>
              </div>

              {/* File Upload Area */}
              <div className="space-y-2">
                <Label>Upload File</Label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={cn(
                    'relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
                    dragActive
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600',
                    file && 'border-green-400 bg-green-50 dark:bg-green-900/20'
                  )}
                >
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileSpreadsheet className="w-10 h-10 text-green-500" />
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                        }}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-10 h-10 text-neutral-400" />
                      <p className="font-medium text-foreground">
                        Drop AssociateData.csv here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  File must be named exactly "AssociateData.csv"
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className={cn(
                    'flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all',
                    'border border-neutral-200 dark:border-neutral-700',
                    'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSync}
                  disabled={!file || uploading || syncing}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all',
                    'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
                    'hover:bg-neutral-800 dark:hover:bg-neutral-100',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : syncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Sync Drivers
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
