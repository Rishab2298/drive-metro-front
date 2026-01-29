// Driver Row Component - Individual driver row in the table
import { useState } from 'react';
import {
  Check,
  Eye,
  BadgeCheck,
  MoreHorizontal,
  Share2,
  StickyNote,
  Phone,
  Link2,
  MessageSquare,
  Mail,
  FileText,
  Loader2,
  Sparkles,
  UserMinus,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Dropdown, DropdownItem } from './Dropdown';
import { downloadScorecardPDF } from '@/lib/generateScorecardPDF.jsx';
import { sendDriverEmail, generateAIFeedback } from '@/services/scorecardService';
import { STANDING_COLORS, getDriverName, API_URL } from '@/utils/scorecardUtils';

export const DriverRow = ({
  driver,
  index,
  rankInfo,
  rankedCount,
  data,
  isSelected,
  onSelect,
  onPreview,
  onEditNote,
  onEditContact,
  masterScorecardId,
  setData,
  hasPremiumAccess,
  promptUpgrade,
  getToken,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  const rank = rankInfo?.rank;
  const score = rankInfo?.score;
  const isEligible = rankInfo?.eligible;
  const packages = parseInt(driver.packagesDelivered) || 0;
  const tier = driver.overallStanding || driver.tier || 'N/A';
  const driverName = getDriverName(driver);

  const handleCopyLink = () => {
    const scorecardUrl = `${window.location.origin}/scorecard/${driver.id}`;
    navigator.clipboard.writeText(scorecardUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareSMS = () => {
    if (!hasPremiumAccess) {
      promptUpgrade('Send SMS');
      return;
    }
    const scorecardUrl = `${window.location.origin}/scorecard/${driver.id}`;
    const message = `Hi ${driverName}, here's your weekly scorecard: ${scorecardUrl}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`);
  };

  const handleShareEmail = async () => {
    if (!hasPremiumAccess) {
      promptUpgrade('Send Email');
      return;
    }

    if (!driver.email) {
      toast.error('This driver does not have an email address');
      return;
    }

    setSendingEmail(true);

    try {
      await sendDriverEmail(driver.id, getToken);
      toast.success(`Scorecard email sent to ${driverName}`);
    } catch (err) {
      console.error('Email send error:', err);
      toast.error(err.message || 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!hasPremiumAccess) {
      promptUpgrade('Download PDF');
      return;
    }
    await downloadScorecardPDF(driver, {
      rank: rankInfo.rank,
      score: rankInfo.score,
      isEligible: rankInfo.eligible,
      rankedCount,
      weekNumber: data?.weekNumber,
      year: data?.year,
      weekStart: data?.weekStart,
      weekEnd: data?.weekEnd,
      dspName: data?.dsp?.companyName || data?.dsp?.dspCode,
    });
  };

  const handleRemoveRanking = () => {
    alert('Remove ranking coming soon!');
  };

  const handleOverrideTier = () => {
    alert('Override tier coming soon!');
  };

  return (
    <div
      className={cn(
        'grid grid-cols-12 gap-4 px-5 py-4 items-center transition-all duration-150',
        isSelected
          ? 'bg-neutral-100 dark:bg-neutral-800/50'
          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/30',
        !isEligible && 'opacity-80'
      )}
    >
      {/* Checkbox + Rank */}
      <div className="col-span-1 flex items-center gap-3">
        <button
          onClick={() => onSelect(driver.transporterId)}
          className={cn(
            'flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-150',
            isSelected
              ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white'
              : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 bg-white dark:bg-neutral-800'
          )}
        >
          {isSelected && (
            <Check className="w-3 h-3 text-white dark:text-neutral-900" />
          )}
        </button>
        <div className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs',
          !isEligible
            ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400 border border-dashed border-neutral-300 dark:border-neutral-700'
            : rank === 1
            ? 'bg-amber-100 text-amber-700'
            : rank === 2
            ? 'bg-slate-200 text-slate-600'
            : rank === 3
            ? 'bg-orange-100 text-orange-700'
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
        )}>
          {isEligible ? rank : '—'}
        </div>
      </div>

      {/* Driver Name & Score */}
      <div className="col-span-3">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-foreground truncate">
            {driverName}
          </p>
          {driver.acknowledgedAt && (
            <div
              className="flex items-center justify-center w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 shrink-0"
              title={`Acknowledged on ${new Date(driver.acknowledgedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}`}
            >
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          )}
          {driver.dspNote && (
            <div
              className="flex items-center justify-center w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-900/30 shrink-0"
              title={driver.dspNote}
            >
              <StickyNote className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </div>
          )}
          {driver.aiFeedback && Array.isArray(driver.aiFeedback) && driver.aiFeedback.length > 0 && (
            <div
              className="flex items-center justify-center w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-900/30 shrink-0"
              title="AI Feedback available"
            >
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isEligible ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
              Score: {score?.toFixed(1) || '-'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
              {500 - packages} more to rank
            </span>
          )}
        </p>
      </div>

      {/* Overall Tier - Centered */}
      <div className="col-span-2 flex justify-center">
        <span className={cn(
          'px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide',
          STANDING_COLORS[tier] || STANDING_COLORS['N/A']
        )}>
          {tier}
        </span>
      </div>

      {/* Packages - Centered */}
      <div className="col-span-2 text-center">
        <p className="text-sm font-semibold text-foreground tabular-nums">{packages.toLocaleString()}</p>
        {isEligible && (
          <p className="text-xs text-muted-foreground mt-0.5">delivered</p>
        )}
      </div>

      {/* Actions */}
      <div className="col-span-4 flex items-center justify-end gap-2">
        {/* Actions Dropdown */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 text-sm font-medium transition-all">
              <MoreHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Actions</span>
            </button>
          }
        >
          {(close) => (
            <>
              <DropdownItem
                icon={StickyNote}
                label={driver.dspNote ? "Edit Note" : "Add Note"}
                onClick={() => { onEditNote(driver); close(); }}
              />
              <DropdownItem
                icon={UserMinus}
                label="Remove Ranking"
                onClick={() => { handleRemoveRanking(); close(); }}
              />
              <DropdownItem
                icon={Settings2}
                label="Override Tier"
                onClick={() => { handleOverrideTier(); close(); }}
              />
            </>
          )}
        </Dropdown>

        {/* Share Dropdown */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 text-sm font-medium transition-all">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          }
        >
          {(close) => (
            <>
              <DropdownItem
                icon={Link2}
                label={copiedLink ? 'Copied!' : 'Copy Link'}
                onClick={() => { handleCopyLink(); close(); }}
              />
              <DropdownItem
                icon={MessageSquare}
                label="SMS"
                onClick={() => { handleShareSMS(); close(); }}
              />
              <DropdownItem
                icon={sendingEmail ? Loader2 : Mail}
                label={sendingEmail ? 'Sending...' : 'Email'}
                onClick={() => { handleShareEmail(); close(); }}
                disabled={sendingEmail}
                iconClassName={sendingEmail ? 'animate-spin' : ''}
              />
              <DropdownItem
                icon={FileText}
                label="Download PDF"
                onClick={() => { handleDownloadPDF(); close(); }}
              />
            </>
          )}
        </Dropdown>

        {/* Preview Button */}
        <button
          onClick={() => onPreview(driver)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-sm font-medium transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Preview</span>
        </button>
      </div>
    </div>
  );
};

export default DriverRow;
