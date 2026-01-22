import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileUp,
  ChevronDown,
  Lock,
  Crown,
} from 'lucide-react';

// Filename validation patterns for each document type
// These patterns use placeholders that will be replaced with actual DSP info
const getFilenamePattern = (docId, dspCode, stationCode) => {
  const patterns = {
    scorecard: {
      // US_TRDC_DIN6_Week2_2026_en_DSPScorecard.pdf
      pattern: new RegExp(`^US_${dspCode}_${stationCode}_Week\\d{1,2}_\\d{4}_en_DSPScorecard\\.pdf$`),
      errorMessage: `Invalid filename. Expected format: US_${dspCode}_${stationCode}_Week<Number>_<Year>_en_DSPScorecard.pdf`,
    },
    'weekly-overview': {
      // DSP_Overview_Dashboard_TRDC_DIN6_2026-W02.csv
      pattern: new RegExp(`^DSP_Overview_Dashboard_${dspCode}_${stationCode}_\\d{4}-W\\d{2}\\.csv$`),
      errorMessage: `Invalid filename. Expected format: DSP_Overview_Dashboard_${dspCode}_${stationCode}_<Year>-W<WeekNumber>.csv`,
    },
    'trailing-six-week': {
      // DSP_Overview_Dashboard_Trailing_Six_Week_TRDC_DIN6_2026-W02.csv
      pattern: new RegExp(`^DSP_Overview_Dashboard_Trailing_Six_Week_${dspCode}_${stationCode}_\\d{4}-W\\d{2}\\.csv$`),
      errorMessage: `Invalid filename. Expected format: DSP_Overview_Dashboard_Trailing_Six_Week_${dspCode}_${stationCode}_<Year>-W<WeekNumber>.csv`,
    },
    'negative-feedback': {
      // DSP_Customer_Delivery_Feedback_negative_DIN6_2026-W02.csv
      pattern: new RegExp(`^DSP_Customer_Delivery_Feedback_negative_${stationCode}_\\d{4}-W\\d{2}\\.csv$`),
      errorMessage: `Invalid filename. Expected format: DSP_Customer_Delivery_Feedback_negative_${stationCode}_<Year>-W<WeekNumber>.csv`,
    },
    'pod-quality': {
      // US-TRDC-DIN6-Week2-2026NA-DA-POD-Details.pdf
      pattern: new RegExp(`^US-${dspCode}-${stationCode}-Week\\d{1,2}-\\d{4}NA-DA-POD-Details\\.pdf$`),
      errorMessage: `Invalid filename. Expected format: US-${dspCode}-${stationCode}-Week<Number>-<Year>NA-DA-POD-Details.pdf`,
    },
    'pps-daily': {
      // Daily_PPS_Report_-1234567890.csv
      pattern: /^Daily_PPS_Report_-.+\.csv$/,
      errorMessage: 'Invalid filename. Expected format: Daily_PPS_Report_-<Identifier>.csv',
    },
    dvic: {
      // US_TRDC_DIN6_2026_week-2_20260115_DVIC_Time_Last_7_Days.xlsx
      pattern: new RegExp(`^US_${dspCode}_${stationCode}_\\d{4}_week-\\d{1,2}_.+_DVIC_Time_Last_7_Days\\.xlsx$`),
      errorMessage: `Invalid filename. Expected format: US_${dspCode}_${stationCode}_<Year>_week-<Number>_<Identifier>_DVIC_Time_Last_7_Days.xlsx`,
    },
    'paw-print': {
      // Notification_on_Arri_12345.csv or Notification_on_Arri_-12345.csv
      pattern: /^Notification_on_Arri_-?.+\.csv$/,
      errorMessage: 'Invalid filename. Expected format: Notification_on_Arri_<Identifier>.csv',
    },
  };

  return patterns[docId] || null;
};

export function DocumentUploadBox({
  id,
  title,
  description,
  metricsIncluded,
  acceptedFileTypes = ['pdf', 'csv', 'xlsx'],
  exampleFileName,
  required = false,
  premium = false,
  onUploadComplete,
  specialInstructions,
  isUploaded = false,
  index = 0,
  dspInfo,
  hasPremiumAccess = true,
}) {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // Check if this document is locked (premium doc without access)
  const isLocked = premium && !hasPremiumAccess;
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(isUploaded ? 'success' : null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef(null);
  const uploadTriggeredRef = useRef(false);

  const FILE_EXTENSIONS = {
    pdf: '.pdf',
    csv: '.csv',
    xlsx: '.xlsx',
  };

  const acceptString = acceptedFileTypes.map((type) => FILE_EXTENSIONS[type]).filter(Boolean).join(',');
  const acceptLabel = acceptedFileTypes.map((t) => t.toUpperCase()).join(', ');

  // Validate file type and filename pattern
  const validateFile = useCallback((selectedFile) => {
    const fileName = selectedFile.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    // Check file type first
    const isValidType = acceptedFileTypes.includes(fileExtension);
    if (!isValidType) {
      return `Invalid file type. Expected ${acceptLabel}.`;
    }

    // Check filename pattern if DSP info is available
    if (dspInfo?.dspCode && dspInfo?.stationCode) {
      const patternConfig = getFilenamePattern(id, dspInfo.dspCode, dspInfo.stationCode);
      if (patternConfig && !patternConfig.pattern.test(fileName)) {
        return patternConfig.errorMessage;
      }
    }

    return null;
  }, [id, acceptedFileTypes, acceptLabel, dspInfo]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const error = validateFile(droppedFile);
      if (error) {
        setValidationError(error);
        setIsExpanded(true);
        setFile(null);
        return;
      }
      setFile(droppedFile);
      setUploadStatus(null);
      setValidationError(null);
      setIsExpanded(true);
      uploadTriggeredRef.current = false; // Reset for auto-upload
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const error = validateFile(selectedFile);
      if (error) {
        setValidationError(error);
        setIsExpanded(true);
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setUploadStatus(null);
      setValidationError(null);
      setIsExpanded(true);
      uploadTriggeredRef.current = false; // Reset for auto-upload
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file || uploading) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    try {
      const token = await getToken();
      setUploadProgress(20);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const res = await fetch(`${API_URL}/api/s3/presign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!res.ok) throw new Error('Failed to get upload URL');

      const { uploadUrl, key } = await res.json();
      setUploadProgress(50);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload file');

      setUploadProgress(100);
      setUploadStatus('success');
      if (onUploadComplete) onUploadComplete({ file, key });
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  }, [file, uploading, getToken, onUploadComplete]);

  // Auto-upload when file is selected and validation passes
  useEffect(() => {
    if (file && !uploading && !uploadTriggeredRef.current && uploadStatus !== 'success') {
      uploadTriggeredRef.current = true;
      handleUpload();
    }
  }, [file, uploading, uploadStatus, handleUpload]);

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus(null);
    setValidationError(null);
    uploadTriggeredRef.current = false;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Get current week number and year
  const getCurrentWeekAndYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(year, 0, 1);
    const diff = now - start;
    const oneWeek = 604800000;
    const week = Math.ceil(diff / oneWeek);
    const weekPadded = String(week).padStart(2, '0');
    return { week, weekPadded, year };
  };

  // Generate dynamic example filename based on document type and DSP info
  const getDynamicExampleFilename = () => {
    if (!dspInfo?.dspCode || !dspInfo?.stationCode) {
      return exampleFileName; // Fallback to static example
    }

    const { dspCode, stationCode } = dspInfo;
    const { week, weekPadded, year } = getCurrentWeekAndYear();
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const examples = {
      scorecard: `US_${dspCode}_${stationCode}_Week${week}_${year}_en_DSPScorecard.pdf`,
      'weekly-overview': `DSP_Overview_Dashboard_${dspCode}_${stationCode}_${year}-W${weekPadded}.csv`,
      'trailing-six-week': `DSP_Overview_Dashboard_Trailing_Six_Week_${dspCode}_${stationCode}_${year}-W${weekPadded}.csv`,
      'negative-feedback': `DSP_Customer_Delivery_Feedback_negative_${stationCode}_${year}-W${weekPadded}.csv`,
      'pod-quality': `US-${dspCode}-${stationCode}-Week${week}-${year}NA-DA-POD-Details.pdf`,
      'pps-daily': `Daily_PPS_Report_-${today}.csv`,
      dvic: `US_${dspCode}_${stationCode}_${year}_week-${week}_${today}_DVIC_Time_Last_7_Days.xlsx`,
      'paw-print': `Notification_on_Arri_${today}.csv`,
    };

    return examples[id] || exampleFileName;
  };

  const dynamicExampleFilename = getDynamicExampleFilename();
  const isComplete = uploadStatus === 'success';

  return (
    <div
      className={cn(
        'group relative py-4 transition-all duration-300',
        index > 0 && 'border-t border-neutral-200 dark:border-neutral-800'
      )}
    >
      {/* Collapsible Header - Always Visible */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        className={cn(
          'w-full flex items-center gap-4 text-left transition-colors rounded-xl p-3 -m-3 cursor-pointer',
          'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
        )}
      >
        {/* Step Number / Status */}
        <div
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shrink-0',
            isComplete
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
          )}
        >
          {isComplete ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <span className="text-xs">{String(index + 1).padStart(2, '0')}</span>
          )}
        </div>

        {/* Title and Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            {required && (
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded-full">
                Required
              </span>
            )}
            {premium && (
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700">
                Premium
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
        </div>

        {/* Right side: File type badge + Chevron + Upload button */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
            {acceptLabel}
          </span>

          <div
            className={cn(
              'w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          >
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </div>

          {/* Upload Button in Header */}
          {isLocked ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/billing');
              }}
              className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <Lock className="w-4 h-4" />
              <span>Upgrade</span>
            </button>
          ) : !isComplete ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>{file ? 'Change' : 'Upload'}</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Uploaded</span>
            </button>
          )}
        </div>
      </div>

      {/* Hidden file input - moved outside the button */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptString}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Collapsible Content */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-4 ml-13">
            {/* Meta Info */}
            {(metricsIncluded || exampleFileName || specialInstructions) && (
              <div className="mb-4 space-y-1.5 text-xs text-muted-foreground">
                {metricsIncluded && (
                  <p>
                    <span className="text-foreground/70">Metrics:</span> {metricsIncluded}
                  </p>
                )}
                {dynamicExampleFilename && (
                  <p>
                    <span className="text-foreground/70">Format:</span>{' '}
                    <code className="text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-[10px]">
                      {dynamicExampleFilename}
                    </code>
                  </p>
                )}
                {specialInstructions && (
                  <p className="text-neutral-500 dark:text-neutral-400 italic">
                    {specialInstructions}
                  </p>
                )}
              </div>
            )}

            {/* Validation Error */}
            {validationError && (
              <div className="mb-4 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{validationError}</p>
              </div>
            )}

            {/* Upload Area */}
            {isLocked ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/billing');
                }}
                className="relative rounded-xl border-2 border-dashed p-4 cursor-pointer transition-all duration-200 border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-0.5">
                      Premium Feature
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Upgrade to Pro to upload this report and unlock advanced analytics
                    </p>
                  </div>
                </div>
              </div>
            ) : !file && !isComplete ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className={cn(
                  'relative rounded-xl border-2 border-dashed p-4 cursor-pointer transition-all duration-200',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:border-neutral-400 dark:hover:border-neutral-600',
                  isDragging
                    ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800'
                    : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                    <FileUp className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-0.5">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">Accepts {acceptLabel} files</p>
                  </div>
                </div>
              </div>
            ) : file && !isComplete ? (
              <div className="space-y-3">
                {/* File Preview */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <div className="w-9 h-9 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                    <FileUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  {!uploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}

                {/* Error State */}
                {uploadStatus === 'error' && !uploading && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-between gap-3">
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Upload failed. Please try again.
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        uploadTriggeredRef.current = false;
                        handleUpload();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Success State */
              <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-900 dark:bg-white border border-neutral-900 dark:border-white">
                <div className="w-9 h-9 rounded-lg bg-neutral-800 dark:bg-neutral-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white dark:text-neutral-900" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white dark:text-neutral-900">
                    {file?.name || 'Document uploaded'}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    Ready for processing
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-white dark:hover:text-neutral-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100"
                >
                  Replace
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
