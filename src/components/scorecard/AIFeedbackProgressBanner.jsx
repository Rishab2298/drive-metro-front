// AI Feedback Progress Banner - Shows persistent progress during AI feedback generation
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, CheckCircle2, XCircle, X } from 'lucide-react';
import { getAIFeedbackJobStatus } from '@/services/scorecardService';

export const AIFeedbackProgressBanner = ({
  jobId,
  totalDrivers,
  getToken,
  onComplete,
  onDismiss,
}) => {
  const [jobStatus, setJobStatus] = useState({
    status: 'processing',
    processedDrivers: 0,
    successCount: 0,
    failedCount: 0,
    progress: 0,
  });
  const [dismissed, setDismissed] = useState(false);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    if (!jobId || dismissed) return;

    const pollStatus = async () => {
      try {
        const status = await getAIFeedbackJobStatus(jobId, getToken);

        if (!status) {
          // Job not found or expired
          clearInterval(pollIntervalRef.current);
          return;
        }

        setJobStatus(status);

        if (status.status === 'completed') {
          clearInterval(pollIntervalRef.current);
          // Give a moment to show 100% then call onComplete
          setTimeout(() => {
            onComplete?.();
          }, 1500);
        }
      } catch (err) {
        console.error('Error polling job status:', err);
      }
    };

    // Poll immediately then every 2 seconds
    pollStatus();
    pollIntervalRef.current = setInterval(pollStatus, 2000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [jobId, getToken, onComplete, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    onDismiss?.();
  };

  if (dismissed) return null;

  const isComplete = jobStatus.status === 'completed';
  const progressPercent = Math.round((jobStatus.processedDrivers / totalDrivers) * 100);

  return (
    <div className={`mb-4 p-4 rounded-xl border transition-all ${
      isComplete
        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
        : 'bg-gradient-to-r from-violet-50 via-indigo-50 to-purple-50 dark:from-violet-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800'
    }`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isComplete
              ? 'bg-emerald-500'
              : 'bg-gradient-to-br from-violet-500 to-indigo-600'
          }`}>
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-white" />
            ) : (
              <Sparkles className="w-5 h-5 text-white" />
            )}
          </div>

          {/* Progress Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-semibold ${
                isComplete
                  ? 'text-emerald-800 dark:text-emerald-200'
                  : 'text-violet-800 dark:text-violet-200'
              }`}>
                {isComplete ? 'AI Feedback Complete' : 'Generating AI Feedback'}
              </span>
              {!isComplete && (
                <Loader2 className="w-4 h-4 animate-spin text-violet-600 dark:text-violet-400" />
              )}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white dark:bg-neutral-800 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    isComplete
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={`text-sm font-medium tabular-nums ${
                isComplete
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-violet-700 dark:text-violet-300'
              }`}>
                {jobStatus.processedDrivers}/{totalDrivers}
              </span>
            </div>

            {/* Status Details */}
            <div className="flex items-center gap-4 mt-1.5 text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {jobStatus.successCount} success
              </span>
              {jobStatus.failedCount > 0 && (
                <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {jobStatus.failedCount} failed
                </span>
              )}
              <span className="text-neutral-500 dark:text-neutral-400">
                {progressPercent}% complete
              </span>
            </div>
          </div>
        </div>

        {/* Dismiss Button - Only show when complete */}
        {isComplete && (
          <button
            onClick={handleDismiss}
            className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AIFeedbackProgressBanner;
