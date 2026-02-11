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
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { downloadBulkScorecardPDFs, downloadCombinedPDF } from '@/lib/generateScorecardPDF.jsx';
import { sendBulkEmails, sendBulkSms, generateAIFeedback } from '@/services/scorecardService';

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
  onAIFeedbackStart,
}) => {
  const [showPdfDropdown, setShowPdfDropdown] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [generatingAIFeedback, setGeneratingAIFeedback] = useState(false);
  const [aiFeedbackError, setAiFeedbackError] = useState(null);

  const rankedCount = Object.values(driverRanks).filter(r => r.eligible).length;

  // Count drivers with/without AI feedback for rate limiting display
  const driversWithAIFeedback = selectedDriverObjects.filter(d => d.aiFeedback && d.aiFeedback.length > 0).length;
  const driversNeedingFeedback = selectedDriverObjects.length - driversWithAIFeedback;
  const allHaveFeedback = driversNeedingFeedback === 0;

  // Count drivers with/without SMS sent for rate limiting display
  const driversWithSmsSent = selectedDriverObjects.filter(d => d.smsSentAt).length;
  const driversNeedingSms = selectedDriverObjects.length - driversWithSmsSent;
  const allHaveSmsSent = driversNeedingSms === 0;

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

    // Check how many drivers already have SMS sent (rate limiting)
    const driversAlreadySent = selectedDriverObjects.filter(d => d.smsSentAt);
    const driversNotSent = selectedDriverObjects.filter(d => !d.smsSentAt);

    // If all drivers already have SMS sent, show error
    if (driversNotSent.length === 0) {
      toast.error(
        `SMS already sent to all ${driversAlreadySent.length} selected driver${driversAlreadySent.length > 1 ? 's' : ''}`,
        { duration: 4000 }
      );
      return;
    }

    // Warn if some drivers will be skipped due to already sent
    if (driversAlreadySent.length > 0) {
      toast.warning(
        `${driversAlreadySent.length} driver${driversAlreadySent.length > 1 ? 's' : ''} already received SMS and will be skipped`,
        { duration: 4000 }
      );
    }

    const driversWithPhone = driversNotSent.filter(d => d.phone);
    const driversWithoutPhone = driversNotSent.filter(d => !d.phone);

    if (driversWithPhone.length === 0) {
      toast.error('None of the remaining drivers have phone numbers');
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

        // Update local data to reflect smsSentAt
        setData(prevData => ({
          ...prevData,
          drivers: prevData.drivers.map(d =>
            scorecardIds.includes(d.id) && result.results?.find(r => r.scorecardId === d.id && r.success)
              ? { ...d, smsSentAt: new Date().toISOString() }
              : d
          ),
        }));
      }
      if (result.failCount > 0) {
        toast.error(`Failed to send ${result.failCount} SMS`);
      }
      if (result.skippedCount > 0) {
        toast.info(`${result.skippedCount} already sent (skipped)`);
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

    // Check how many drivers already have AI feedback
    const driversWithFeedback = selectedDriverObjects.filter(d => d.aiFeedback && d.aiFeedback.length > 0);
    const driversWithoutFeedback = selectedDriverObjects.filter(d => !d.aiFeedback || d.aiFeedback.length === 0);

    // If all drivers already have feedback, show error
    if (driversWithoutFeedback.length === 0) {
      toast.error(
        `All ${driversWithFeedback.length} selected driver${driversWithFeedback.length > 1 ? 's' : ''} already have AI feedback`,
        { duration: 4000 }
      );
      return;
    }

    // Warn if some drivers will be skipped
    if (driversWithFeedback.length > 0) {
      toast.warning(
        `${driversWithFeedback.length} driver${driversWithFeedback.length > 1 ? 's' : ''} already have AI feedback and will be skipped`,
        { duration: 4000 }
      );
    }

    setGeneratingAIFeedback(true);
    setAiFeedbackError(null);

    try {
      const scorecardIds = selectedDriverObjects.map(d => d.id);
      const result = await generateAIFeedback(scorecardIds, masterScorecardId, getToken);

      if (result.jobId) {
        // Notify parent to show progress banner
        onAIFeedbackStart?.({
          jobId: result.jobId,
          totalDrivers: result.totalDrivers,
        });
        clearSelection();

        const skippedMsg = result.skippedCount > 0
          ? ` (${result.skippedCount} skipped)`
          : '';
        toast.info(
          `Generating AI feedback for ${result.totalDrivers} driver${result.totalDrivers > 1 ? 's' : ''}${skippedMsg}...`,
          { duration: 3000, icon: '✨' }
        );
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
            disabled={sendingSms || allHaveSmsSent}
            title={allHaveSmsSent ? 'SMS already sent to all selected drivers' : driversWithSmsSent > 0 ? `${driversWithSmsSent} driver(s) will be skipped (already sent)` : ''}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              allHaveSmsSent
                ? 'bg-neutral-500/20 text-white/60 dark:text-neutral-500'
                : 'bg-white/10 dark:bg-neutral-900/10 hover:bg-white/20 dark:hover:bg-neutral-900/20 text-white dark:text-neutral-900'
            }`}
          >
            {sendingSms ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : allHaveSmsSent ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
            {sendingSms
              ? 'Sending...'
              : allHaveSmsSent
                ? 'Already Sent'
                : driversWithSmsSent > 0
                  ? `Send SMS (${driversNeedingSms})`
                  : 'Send SMS'
            }
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
            disabled={generatingAIFeedback || allHaveFeedback}
            title={allHaveFeedback ? 'All selected drivers already have AI feedback' : driversWithAIFeedback > 0 ? `${driversWithAIFeedback} driver(s) will be skipped (already have feedback)` : ''}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
              allHaveFeedback
                ? 'bg-neutral-500/20 border-neutral-400/30 text-white/60 dark:text-neutral-500'
                : 'bg-linear-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-white dark:text-neutral-900 border-purple-400/30'
            }`}
          >
            {generatingAIFeedback ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : allHaveFeedback ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {generatingAIFeedback
              ? 'Generating...'
              : allHaveFeedback
                ? 'Already Generated'
                : driversWithAIFeedback > 0
                  ? `Generate AI Feedback (${driversNeedingFeedback})`
                  : 'Generate AI Feedback'
            }
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
    </div>
  );
};

export default DriverActionsBar;
