// MasterScorecardDetail - Main page for viewing master scorecard with all drivers
import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Loader2, ArrowLeft, Download, Search, ChevronRight } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import UpgradeModal from '@/components/UpgradeModal';
import AIAddonModal from '@/components/AIAddonModal';

// Hooks
import { useScorecardData } from '@/hooks/useScorecardData';
import { useDriverRanks } from '@/hooks/useDriverRanks';
import { useDriverSelection } from '@/hooks/useDriverSelection';
import { useDriverSort } from '@/hooks/useDriverSort';

// Components
import {
  ScorecardHeader,
  DriversTable,
  DriverActionsBar,
  DriverPreviewModal,
  AddNoteModal,
  BulkNoteModal,
  AIFeedbackProgressBanner,
} from '@/components/scorecard';

const MasterScorecardDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const showJson = searchParams.get('json') === 'true';
  const { hasPremiumAccess, hasAIAccess } = useSubscription();

  // Data fetching
  const { loading, error, data, setData, getToken } = useScorecardData(id);

  // Driver rankings
  const { driverRanks, rankedCount, totalDrivers } = useDriverRanks(data?.drivers);

  // Driver selection
  const {
    selectedDrivers,
    setSelectedDrivers,
    selectedDriverObjects,
    handleSelectDriver,
    handleQuickSelect,
    clearSelection,
  } = useDriverSelection(data?.drivers, driverRanks);

  // Sorting and filtering
  const {
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    sortedDrivers,
  } = useDriverSort(data?.drivers, driverRanks);

  // Modal states
  const [previewDriver, setPreviewDriver] = useState(null);
  const [noteDriver, setNoteDriver] = useState(null);
  const [showBulkNoteModal, setShowBulkNoteModal] = useState(false);

  // AI Feedback job state
  const [aiFeedbackJob, setAiFeedbackJob] = useState(null);

  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState('');

  // AI addon modal state
  const [showAIAddonModal, setShowAIAddonModal] = useState(false);
  const [aiAddonFeatureName, setAiAddonFeatureName] = useState('');

  const promptUpgrade = (featureName) => {
    setUpgradeFeatureName(featureName);
    setShowUpgradeModal(true);
  };

  const promptAIUpgrade = (featureName) => {
    setAiAddonFeatureName(featureName);
    setShowAIAddonModal(true);
  };

  // AI Feedback handlers
  const handleAIFeedbackStart = ({ jobId, totalDrivers }) => {
    setAiFeedbackJob({ jobId, totalDrivers });
  };

  const handleAIFeedbackComplete = async () => {
    // Refresh data to get the new AI feedback
    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5004'}/api/master-scorecard/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const refreshedData = await response.json();
        setData(refreshedData);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  const handleAIFeedbackDismiss = () => {
    setAiFeedbackJob(null);
  };

  // Download JSON
  const handleDownloadJson = () => {
    if (!data) return;
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scorecard-week${data.weekNumber}-${data.year}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          <p className="text-sm text-muted-foreground">Loading scorecard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 text-xl">!</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">{error}</h2>
          <Link
            to="/view-scorecards"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium text-sm"
          >
            <ArrowLeft size={16} />
            Back to Scorecards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ScorecardHeader data={data} rankedCount={rankedCount} />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Driver Scorecards</h2>
            {data?.drivers && data.drivers.filter(d => d.acknowledgedAt).length > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {data.drivers.filter(d => d.acknowledgedAt).length} acknowledged
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent"
              />
            </div>
{showJson && (
              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export JSON</span>
              </button>
            )}
          </div>
        </div>

        {/* AI Feedback Progress Banner - Persistent */}
        {aiFeedbackJob && (
          <AIFeedbackProgressBanner
            jobId={aiFeedbackJob.jobId}
            totalDrivers={aiFeedbackJob.totalDrivers}
            getToken={getToken}
            onComplete={handleAIFeedbackComplete}
            onDismiss={handleAIFeedbackDismiss}
          />
        )}

        {/* Bulk Actions Toolbar */}
        {selectedDrivers.size > 0 && (
          <DriverActionsBar
            selectedDriverObjects={selectedDriverObjects}
            selectedCount={selectedDrivers.size}
            driverRanks={driverRanks}
            data={data}
            masterScorecardId={id}
            getToken={getToken}
            hasPremiumAccess={hasPremiumAccess}
            hasAIAccess={hasAIAccess}
            promptUpgrade={promptUpgrade}
            promptAIUpgrade={promptAIUpgrade}
            clearSelection={clearSelection}
            setData={setData}
            setShowBulkNoteModal={setShowBulkNoteModal}
            onAIFeedbackStart={handleAIFeedbackStart}
          />
        )}

        {/* Drivers Table */}
        <DriversTable
          sortedDrivers={sortedDrivers}
          driverRanks={driverRanks}
          rankedCount={rankedCount}
          data={data}
          selectedDrivers={selectedDrivers}
          searchQuery={searchQuery}
          sortConfig={sortConfig}
          handleSort={handleSort}
          handleSelectDriver={handleSelectDriver}
          handleQuickSelect={handleQuickSelect}
          setSearchQuery={setSearchQuery}
          setPreviewDriver={setPreviewDriver}
          setNoteDriver={setNoteDriver}
          setData={setData}
          hasPremiumAccess={hasPremiumAccess}
          promptUpgrade={promptUpgrade}
          getToken={getToken}
        />

        {/* Table Footer Stats */}
        {sortedDrivers.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Showing {sortedDrivers.length} of {totalDrivers} drivers
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
            {selectedDrivers.size > 0 && (
              <p className="font-medium text-foreground">
                {selectedDrivers.size} selected
              </p>
            )}
          </div>
        )}

        {/* Raw JSON Preview */}
        {showJson && (
          <div className="mt-8">
            <details className="group">
              <summary className="cursor-pointer flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                View Raw JSON
              </summary>
              <div className="mt-4 p-4 rounded-xl bg-neutral-900 dark:bg-neutral-950 overflow-auto max-h-96">
                <pre className="text-xs text-neutral-300 font-mono whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDriver && (
        <DriverPreviewModal
          driver={previewDriver}
          onClose={() => setPreviewDriver(null)}
          rankData={driverRanks[previewDriver.transporterId]}
          rankedCount={rankedCount}
          scorecardInfo={{
            dspId: data?.dsp?.dspCode,
            dspName: data?.dsp?.companyName,
            stationCode: data?.dsp?.stationCode,
            weekNumber: data?.weekNumber,
            year: data?.year,
          }}
          getToken={getToken}
        />
      )}

      {/* Add Note Modal */}
      {noteDriver && (
        <AddNoteModal
          driver={noteDriver}
          onClose={() => setNoteDriver(null)}
          getToken={getToken}
          onSave={(result) => {
            setData(prevData => {
              if (!prevData) return prevData;
              return {
                ...prevData,
                drivers: prevData.drivers.map(d =>
                  d.id === noteDriver.id
                    ? {
                        ...d,
                        dspNote: result?.note || null,
                        dspNoteUpdatedAt: result ? new Date().toISOString() : null,
                        dspNoteAttachment: result?.attachmentKey || null
                      }
                    : d
                ),
              };
            });
          }}
        />
      )}

      {/* Bulk Note Modal */}
      {showBulkNoteModal && (
        <BulkNoteModal
          selectedDrivers={selectedDriverObjects}
          onClose={() => setShowBulkNoteModal(false)}
          getToken={getToken}
          onSave={(note) => {
            setData(prevData => {
              if (!prevData) return prevData;
              return {
                ...prevData,
                drivers: prevData.drivers.map(d =>
                  selectedDrivers.has(d.transporterId)
                    ? { ...d, dspNote: note, dspNoteUpdatedAt: new Date().toISOString() }
                    : d
                ),
              };
            });
            setSelectedDrivers(new Set());
          }}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName={upgradeFeatureName}
      />

      {/* AI Addon Modal */}
      <AIAddonModal
        isOpen={showAIAddonModal}
        onClose={() => setShowAIAddonModal(false)}
        featureName={aiAddonFeatureName}
      />
    </div>
  );
};

export default MasterScorecardDetail;
