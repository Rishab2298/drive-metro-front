// Driver Actions Bar - Bulk actions toolbar when drivers are selected
import { useState } from 'react';
import {
  Check,
  X,
  FileText,
  Mail,
  MessageSquare,
  StickyNote,
  Sparkles,
  Loader2,
  ChevronDown,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { downloadBulkScorecardPDFs, downloadCombinedPDF } from '@/lib/generateScorecardPDF.jsx';
import { sendBulkEmails, sendBulkSms, generateAIFeedback } from '@/services/scorecardService';
import { API_URL } from '@/utils/scorecardUtils';

export const DriverActionsBar = ({
  selectedDriverObjects,
  selectedCount,
  driverRanks,
  data,
  masterScorecardId,
  getToken,
  hasPremiumAccess,
  promptUpgrade,
  clearSelection,
  setData,
  setShowBulkNoteModal,
}) => {
  const [showPdfDropdown, setShowPdfDropdown] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [generatingAIFeedback, setGeneratingAIFeedback] = useState(false);
  const [aiFeedbackError, setAiFeedbackError] = useState(null);
  const [aiFeedbackProcessing, setAiFeedbackProcessing] = useState(false);
  const [aiFeedbackMessage, setAiFeedbackMessage] = useState(null);

  const rankedCount = Object.values(driverRanks).filter(r => r.eligible).length;

  const handleBulkPDF = async () => {
    if (!hasPremiumAccess) {
      promptUpgrade('Bulk Download PDF');
      return;
    }
    if (selectedDriverObjects.length === 0) return;
    setShowPdfDropdown(false);
    await downloadBulkScorecardPDFs(
      selectedDriverObjects,
      {
        rankedCount,
        weekNumber: data?.weekNumber,
        year: data?.year,
        weekStart: data?.weekStart,
        weekEnd: data?.weekEnd,
        dspName: data?.dsp?.companyName || data?.dsp?.dspCode,
      },
      driverRanks
    );
  };

  const handleCombinedPDF = async () => {
    if (!hasPremiumAccess) {
      promptUpgrade('Combined PDF Download');
      return;
    }
    if (selectedDriverObjects.length === 0) return;
    setShowPdfDropdown(false);
    await downloadCombinedPDF(
      selectedDriverObjects,
      {
        rankedCount,
        weekNumber: data?.weekNumber,
        year: data?.year,
        weekStart: data?.weekStart,
        weekEnd: data?.weekEnd,
        dspName: data?.dsp?.companyName || data?.dsp?.dspCode,
      },
      driverRanks
    );
  };

  const handleBulkEmail = async () => {
    if (!hasPremiumAccess) {
      promptUpgrade('Send Email');
      return;
    }
    if (selectedDriverObjects.length === 0) return;

    const driversWithEmail = selectedDriverObjects.filter(d => d.email);
    const driversWithoutEmail = selectedDriverObjects.filter(d => !d.email);

    if (driversWithEmail.length === 0) {
      toast.error('None of the selected drivers have email addresses');
      return;
    }

    if (driversWithoutEmail.length > 0) {
      toast.warning(`${driversWithoutEmail.length} driver(s) don't have email addresses and will be skipped`);
    }

    setSendingEmail(true);

    try {
      const scorecardIds = driversWithEmail.map(d => d.id);
      const result = await sendBulkEmails(scorecardIds, getToken);

      if (result.successCount > 0) {
        toast.success(`Scorecard emails sent to ${result.successCount} driver(s)`);
      }
      if (result.failCount > 0) {
        toast.error(`Failed to send ${result.failCount} email(s)`);
      }

      clearSelection();
    } catch (err) {
      console.error('Bulk email error:', err);
      toast.error(err.message || 'Failed to send emails');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleBulkSMS = async () => {
    if (!hasPremiumAccess) {
      promptUpgrade('Send SMS');
      return;
    }
    if (selectedDriverObjects.length === 0) return;

    const driversWithPhone = selectedDriverObjects.filter(d => d.phone);
    const driversWithoutPhone = selectedDriverObjects.filter(d => !d.phone);

    if (driversWithPhone.length === 0) {
      toast.error('None of the selected drivers have phone numbers');
      return;
    }

    if (driversWithoutPhone.length > 0) {
      toast.warning(`${driversWithoutPhone.length} driver(s) don't have phone numbers and will be skipped`);
    }

    setSendingSms(true);

    try {
      const scorecardIds = driversWithPhone.map(d => d.id);
      const result = await sendBulkSms(scorecardIds, getToken);

      if (result.successCount > 0) {
        toast.success(`Scorecard SMS sent to ${result.successCount} driver(s)`);
      }
      if (result.failCount > 0) {
        toast.error(`Failed to send ${result.failCount} SMS`);
      }

      clearSelection();
    } catch (err) {
      console.error('Bulk SMS error:', err);
      toast.error(err.message || 'Failed to send SMS');
    } finally {
      setSendingSms(false);
    }
  };

  const handleBulkNotes = () => {
    if (selectedDriverObjects.length === 0) return;
    setShowBulkNoteModal(true);
  };

  const handleGenerateAIFeedback = async () => {
    if (!hasPremiumAccess) {
      promptUpgrade('AI Feedback');
      return;
    }
    if (selectedDriverObjects.length === 0) return;

    setGeneratingAIFeedback(true);
    setAiFeedbackError(null);
    setAiFeedbackMessage(null);

    try {
      const scorecardIds = selectedDriverObjects.map(d => d.id);
      const result = await generateAIFeedback(scorecardIds, masterScorecardId, getToken);

      if (result.processing) {
        setAiFeedbackProcessing(true);
        setAiFeedbackMessage(`Generating AI feedback for ${result.driversQueued} drivers in background...`);
        clearSelection();

        toast.info(
          `Generating AI feedback for ${result.driversQueued} driver${result.driversQueued > 1 ? 's' : ''}. Results will appear automatically as they're ready.`,
          { duration: 6000, icon: '✨' }
        );

        // Start polling to refresh data
        const pollInterval = setInterval(async () => {
          try {
            const refreshToken = await getToken();
            const refreshResponse = await fetch(`${API_URL}/api/master-scorecard/${masterScorecardId}`, {
              headers: { Authorization: `Bearer ${refreshToken}` },
            });
            if (refreshResponse.ok) {
              const refreshedData = await refreshResponse.json();
              setData(refreshedData);

              const driversWithFeedback = refreshedData.drivers.filter(
                d => scorecardIds.includes(d.id) && d.aiFeedback
              );

              if (driversWithFeedback.length === scorecardIds.length) {
                clearInterval(pollInterval);
                setAiFeedbackProcessing(false);
                setAiFeedbackMessage(null);
                toast.success(
                  `AI feedback generated for ${scorecardIds.length} driver${scorecardIds.length > 1 ? 's' : ''}!`,
                  { duration: 4000 }
                );
              }
            }
          } catch (pollErr) {
            console.error('Polling error:', pollErr);
          }
        }, 5000);

        setTimeout(() => {
          clearInterval(pollInterval);
          setAiFeedbackProcessing(false);
          if (aiFeedbackMessage) {
            setAiFeedbackMessage('AI feedback generation may still be in progress. Refresh to see updates.');
          }
        }, 120000);

      } else if (result.feedback) {
        setData(prevData => ({
          ...prevData,
          drivers: prevData.drivers.map(driver => {
            const feedbackItem = result.feedback.find(
              f => f.driverId === driver.driverId ||
                   f.driverId === driver.transporterId ||
                   f.driverName === driver.name
            );
            if (feedbackItem) {
              return {
                ...driver,
                aiFeedback: feedbackItem.feedback,
                aiFeedbackUpdatedAt: new Date().toISOString(),
              };
            }
            return driver;
          }),
        }));
        clearSelection();
      }

    } catch (err) {
      console.error('Error generating AI feedback:', err);
      setAiFeedbackError(err.message);
    } finally {
      setGeneratingAIFeedback(false);
    }
  };

  return (
    <div className="mb-4 p-4 rounded-xl bg-neutral-900 dark:bg-neutral-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 dark:bg-neutral-900/10">
            <Check className="w-4 h-4 text-white dark:text-neutral-900" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white dark:text-neutral-900">
              {selectedCount} driver{selectedCount !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-white/60 dark:text-neutral-600">
              Choose an action below
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* PDF Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPdfDropdown(!showPdfDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 dark:bg-neutral-900/10 hover:bg-white/20 dark:hover:bg-neutral-900/20 text-white dark:text-neutral-900 text-sm font-medium transition-colors"
            >
              <FileText className="w-4 h-4" />
              Download PDF
              <ChevronDown className="w-3 h-3" />
            </button>
            {showPdfDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowPdfDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 min-w-45">
                  <button
                    onClick={handleCombinedPDF}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Combined PDF
                  </button>
                  <button
                    onClick={handleBulkPDF}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Separate PDFs
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleBulkEmail}
            disabled={sendingEmail}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 dark:bg-neutral-900/10 hover:bg-white/20 dark:hover:bg-neutral-900/20 text-white dark:text-neutral-900 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {sendingEmail ? 'Sending...' : 'Send Email'}
          </button>
          <button
            onClick={handleBulkSMS}
            disabled={sendingSms}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 dark:bg-neutral-900/10 hover:bg-white/20 dark:hover:bg-neutral-900/20 text-white dark:text-neutral-900 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingSms ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            {sendingSms ? 'Sending...' : 'Send SMS'}
          </button>
          <button
            onClick={handleBulkNotes}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 dark:bg-neutral-900/10 hover:bg-white/20 dark:hover:bg-neutral-900/20 text-white dark:text-neutral-900 text-sm font-medium transition-colors"
          >
            <StickyNote className="w-4 h-4" />
            Add Notes
          </button>
          <button
            onClick={handleGenerateAIFeedback}
            disabled={generatingAIFeedback}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-linear-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-white dark:text-neutral-900 text-sm font-medium transition-all border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingAIFeedback ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {generatingAIFeedback ? 'Generating...' : 'Generate AI Feedback'}
          </button>
          <button
            onClick={clearSelection}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 dark:bg-neutral-900/5 hover:bg-white/10 dark:hover:bg-neutral-900/10 text-white/70 dark:text-neutral-600 text-sm font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>
      {/* AI Feedback Error */}
      {aiFeedbackError && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-between">
          <p className="text-sm text-red-200 dark:text-red-400">{aiFeedbackError}</p>
          <button
            onClick={() => setAiFeedbackError(null)}
            className="text-red-300 hover:text-red-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* AI Feedback Processing Message */}
      {aiFeedbackMessage && (
        <div className="mt-3 p-3 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center gap-3">
          {aiFeedbackProcessing && <Loader2 className="w-4 h-4 animate-spin text-purple-300" />}
          <p className="text-sm text-purple-200 dark:text-purple-400 flex-1">{aiFeedbackMessage}</p>
          <button
            onClick={() => setAiFeedbackMessage(null)}
            className="text-purple-300 hover:text-purple-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DriverActionsBar;
