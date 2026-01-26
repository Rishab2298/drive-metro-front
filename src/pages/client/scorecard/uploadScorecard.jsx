import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { DocumentUploadBox } from '@/components/DocumentUploadBox';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { cn } from '@/lib/utils';
import { Upload, CheckCircle2, FileStack, Zap, Star, ChevronDown, Loader2, Lock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

const DOCUMENT_CONFIGS = [
  {
    id: 'scorecard',
    title: 'DSP Scorecard',
    description: 'Weekly performance scorecard PDF from Amazon Logistics',
    metricsIncluded: 'Overall DSP level scores. Beginning Oct 15th, 2025, no driver data or metrics are imported from the PDF scorecard.',
    acceptedFileTypes: ['pdf'],
    exampleFileName: 'US_TRDC_DIN6_Week2_2026_en_DSPScorecard.pdf',
    required: true,
    premium: false,
  },
  {
    id: 'weekly-overview',
    title: 'Weekly Overview Report',
    description: 'DSP Overview Dashboard export with driver metrics',
    metricsIncluded: 'Overall Standing, Tier Levels, Rank, Custom Thresholds, Driver Safety, CDF, CED, DCR, DSB, POD & PSB',
    acceptedFileTypes: ['csv'],
    exampleFileName: 'DSP_Overview_Dashboard_TRDC_DIN6_2026-W02.csv',
    required: true,
    premium: false,
  },
  {
    id: 'trailing-six-week',
    title: '6-Week Trailing Report',
    description: 'Historical overview data for trend analysis',
    metricsIncluded: 'All metrics from the regular overview report for the past six weeks, including rank and tier progression.',
    acceptedFileTypes: ['csv'],
    exampleFileName: 'DSP_Overview_Dashboard_Trailing_Six_Week_TRDC_DIN6_2026-W02.csv',
    required: false,
    premium: true,
  },
  {
    id: 'negative-feedback',
    title: 'Customer Feedback Report',
    description: 'Negative delivery feedback breakdown by category',
    metricsIncluded: 'Negative Feedback Counts by Category including delivery issues, package handling, and customer interactions.',
    acceptedFileTypes: ['csv'],
    exampleFileName: 'DSP_Customer_Delivery_Feedback_negative_DIN6_2026-W02.csv',
    required: false,
    premium: false,
  },
  {
    id: 'pod-quality',
    title: 'POD Quality Report',
    description: 'Photo on Delivery metrics and reject analysis',
    metricsIncluded: 'POD count, opportunities, rejects, and detailed reject category breakdown for quality tracking.',
    acceptedFileTypes: ['pdf'],
    exampleFileName: 'US-TRDC-DIN6-Week2-2026NA-DA-POD-Details.pdf',
    required: false,
    premium: false,
  },
  {
    id: 'pps-daily',
    title: 'PPS Daily Report',
    description: 'Proper Park Sequence compliance metrics',
    metricsIncluded: 'Proper Park Sequence Metrics tracking driver compliance with parking protocols.',
    acceptedFileTypes: ['csv'],
    exampleFileName: 'Daily_PPS_Report_-20260115.csv',
    required: false,
    premium: true,
    specialInstructions: 'Requires specific export steps. Contact support for the export guide.',
  },
  {
    id: 'dvic',
    title: 'DVIC Inspection Report',
    description: '7-day vehicle inspection timing data',
    metricsIncluded: '7-Day Trailing of DVIC inspection times to monitor pre-trip compliance.',
    acceptedFileTypes: ['xlsx'],
    exampleFileName: 'US_TRDC_DIN6_2026_week-2_20260115_DVIC_Time_Last_7_Days.xlsx',
    required: false,
    premium: true,
  },
  {
    id: 'paw-print',
    title: 'Paw Print Compliance',
    description: 'At-stop safety notification compliance rates',
    metricsIncluded: 'Compliance rate of DAs texting customers upon arrival at stops with paw prints (pet alerts).',
    acceptedFileTypes: ['csv'],
    exampleFileName: 'Notification_on_Arri_20260115.csv',
    required: false,
    premium: true,
    specialInstructions: 'May not be available for all DSPs. Skip if not applicable to your operations.',
  },
];

const CollapsibleSection = ({
  title,
  description,
  icon: Icon,
  iconClassName,
  docs,
  uploadedFiles,
  onUploadComplete,
  indexOffset = 0,
  defaultOpen = false,
  dspInfo,
  hasPremiumAccess = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const uploadedCount = docs.filter((d) => uploadedFiles[d.id]).length;
  const isComplete = uploadedCount === docs.length;

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
      {/* Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-4 p-5 text-left transition-colors',
          'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
          isOpen && 'border-b border-neutral-200 dark:border-neutral-800'
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconClassName)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
              {isComplete && (
                <CheckCircle2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Counter */}
          <div className="text-right">
            <p className="text-lg font-semibold tabular-nums">
              {uploadedCount}<span className="text-neutral-300 dark:text-neutral-600">/{docs.length}</span>
            </p>
          </div>

          {/* Chevron */}
          <div className={cn(
            'w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center transition-transform duration-200',
            isOpen && 'rotate-180'
          )}>
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </div>
        </div>
      </button>

      {/* Content - Collapsible */}
      <div className={cn(
        'grid transition-all duration-300 ease-in-out',
        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden">
          <div className="p-5 pt-2">
            <div className="space-y-1">
              {docs.map((doc, index) => (
                <DocumentUploadBox
                  key={doc.id}
                  {...doc}
                  index={indexOffset + index}
                  onUploadComplete={(data) => onUploadComplete(doc.id, data)}
                  isUploaded={!!uploadedFiles[doc.id]}
                  dspInfo={dspInfo}
                  hasPremiumAccess={hasPremiumAccess}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadScorecard = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { hasPremiumAccess, isLoading: subscriptionLoading } = useSubscription();

  // While subscription is loading, assume premium access (for trial users)
  const effectivePremiumAccess = subscriptionLoading ? true : hasPremiumAccess;
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [dspInfo, setDspInfo] = useState(null);
  const [dspLoading, setDspLoading] = useState(true);
  const [dspError, setDspError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState(null);

  // Fetch DSP info on mount
  useEffect(() => {
    const fetchDspInfo = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/dsp`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch DSP info');
        }

        const data = await response.json();
        setDspInfo(data);
      } catch (err) {
        console.error('Error fetching DSP info:', err);
        setDspError(err.message);
      } finally {
        setDspLoading(false);
      }
    };

    fetchDspInfo();
  }, [getToken]);

  const handleUploadComplete = (docId, { file, key }) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docId]: { file, key, uploadedAt: new Date() },
    }));
  };

  const handleProcessDocuments = async () => {
    setIsProcessing(true);
    setProcessingError(null);

    try {
      const token = await getToken();

      // Prepare documents array with S3 keys and doc types
      const documents = Object.entries(uploadedFiles).map(([docType, data]) => ({
        docType,
        key: data.key,
      }));

      const response = await fetch(`${API_URL}/api/process-documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ documents }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process documents');
      }

      // Navigate to the master scorecard detail page or view scorecards
      if (result.masterScorecardId) {
        navigate(`/master-scorecard/${result.masterScorecardId}`);
      } else {
        // Fallback to view scorecards if no master scorecard was created
        navigate('/view-scorecards');
      }
    } catch (err) {
      console.error('Processing error:', err);
      setProcessingError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const requiredDocs = DOCUMENT_CONFIGS.filter((doc) => doc.required);
  const optionalDocs = DOCUMENT_CONFIGS.filter((doc) => !doc.required && !doc.premium);
  const premiumDocs = DOCUMENT_CONFIGS.filter((doc) => doc.premium);

  const requiredUploaded = requiredDocs.every((doc) => uploadedFiles[doc.id]);
  const totalUploaded = Object.keys(uploadedFiles).length;
  const totalDocs = DOCUMENT_CONFIGS.length;

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 604800000;
    return Math.ceil(diff / oneWeek);
  };

  // Show loading state while fetching DSP info
  if (dspLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          <p className="text-sm text-muted-foreground">Loading DSP information...</p>
        </div>
      </div>
    );
  }

  // Show error state if DSP info failed to load
  if (dspError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 text-xl">!</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Unable to load DSP info</h2>
          <p className="text-sm text-muted-foreground">{dspError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-2">
                Week {getCurrentWeek()}, {new Date().getFullYear()}
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Upload Weekly Reports
              </h1>
              <p className="text-muted-foreground max-w-md">
                Import your Amazon DSP documents to generate driver scorecards and analytics.
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {totalUploaded}<span className="text-neutral-300 dark:text-neutral-600">/{totalDocs}</span>
                </p>
                <p className="text-xs text-muted-foreground">documents uploaded</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                <FileStack className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
        {/* Required Section */}
        <CollapsibleSection
          title="Required Documents"
          description="Essential for generating scorecards"
          icon={Zap}
          iconClassName="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
          docs={requiredDocs}
          uploadedFiles={uploadedFiles}
          onUploadComplete={handleUploadComplete}
          indexOffset={0}
          defaultOpen={true}
          dspInfo={dspInfo}
        />

        {/* Optional Section */}
        <CollapsibleSection
          title="Optional Documents"
          description="Additional metrics and insights"
          icon={FileStack}
          iconClassName="bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
          docs={optionalDocs}
          uploadedFiles={uploadedFiles}
          onUploadComplete={handleUploadComplete}
          indexOffset={requiredDocs.length}
          defaultOpen={false}
          dspInfo={dspInfo}
        />

        {/* Premium Section */}
        <CollapsibleSection
          title={effectivePremiumAccess ? "Premium Reports" : "Premium Reports (Upgrade Required)"}
          description={effectivePremiumAccess ? "Advanced analytics for subscribers" : "Upgrade to Pro to unlock these reports"}
          icon={effectivePremiumAccess ? Star : Lock}
          iconClassName={effectivePremiumAccess ? "bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"}
          docs={premiumDocs}
          uploadedFiles={uploadedFiles}
          onUploadComplete={handleUploadComplete}
          indexOffset={requiredDocs.length + optionalDocs.length}
          defaultOpen={false}
          dspInfo={dspInfo}
          hasPremiumAccess={effectivePremiumAccess}
        />

        {/* Processing Error */}
        {processingError && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 mt-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              <span className="font-semibold">Error:</span> {processingError}
            </p>
          </div>
        )}

        {/* Action Footer */}
        <div
          className={cn(
            'sticky bottom-6 p-5 rounded-2xl border transition-all duration-500 mt-8',
            requiredUploaded
              ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white'
              : 'bg-card/80 border-neutral-200 dark:border-neutral-800 backdrop-blur-xl'
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                  requiredUploaded
                    ? 'bg-neutral-800 dark:bg-neutral-100'
                    : 'bg-neutral-100 dark:bg-neutral-800'
                )}
              >
                {requiredUploaded ? (
                  <CheckCircle2 className="w-6 h-6 text-white dark:text-neutral-900" />
                ) : (
                  <Upload className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
                )}
              </div>
              <div>
                <p className={cn(
                  'font-semibold',
                  requiredUploaded ? 'text-white dark:text-neutral-900' : 'text-foreground'
                )}>
                  {requiredUploaded ? 'Ready to process' : 'Upload required documents'}
                </p>
                <p className={cn(
                  'text-sm',
                  requiredUploaded ? 'text-neutral-400 dark:text-neutral-500' : 'text-muted-foreground'
                )}>
                  {requiredUploaded
                    ? `${totalUploaded} documents ready for scorecard generation`
                    : `${requiredDocs.filter((d) => !uploadedFiles[d.id]).length} required document${requiredDocs.filter((d) => !uploadedFiles[d.id]).length > 1 ? 's' : ''} remaining`}
                </p>
              </div>
            </div>

            <button
              disabled={!requiredUploaded || isProcessing}
              onClick={handleProcessDocuments}
              className={cn(
                'px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2',
                requiredUploaded && !isProcessing
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Process Documents
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadScorecard;
