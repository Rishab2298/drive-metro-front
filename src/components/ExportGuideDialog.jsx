import { useState, useMemo } from 'react';
import { cn, getAvailableScorecardWeek } from '@/lib/utils';
import { ChevronLeft, ChevronRight, FileText, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getExportGuide } from '@/config/exportGuides';

// Generate Amazon Dashboard URL for specific document types (used for direct links in guides)
const getAmazonDashboardUrl = (docId, dspInfo) => {
  if (!dspInfo?.stationCode || !dspInfo?.dspCode) return null;

  const { stationCode, dspCode } = dspInfo;

  // Only paw-print uses dashboard link in guides currently
  if (docId === 'paw-print') {
    const params = new URLSearchParams({
      dashboardId: 'c27da965-3178-411f-b485-ec9dcb1a335f',
      station: stationCode,
      companyId: dspCode,
    });
    return `https://logistics.amazon.com/performance/interactive-report?${params.toString()}`;
  }

  return null;
};

// Generate dynamic example filename based on document type and DSP info
const getDynamicFilename = (docId, dspInfo) => {
  if (!dspInfo?.dspCode || !dspInfo?.stationCode) {
    return null;
  }

  const { dspCode, stationCode } = dspInfo;
  const { week, weekPadded, year } = getAvailableScorecardWeek();
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const filenames = {
    scorecard: `US_${dspCode}_${stationCode}_Week${week}_${year}_en_DSPScorecard.pdf`,
    'weekly-overview': `DSP_Overview_Dashboard_${dspCode}_${stationCode}_${year}-W${weekPadded}.csv`,
    'trailing-six-week': `DSP_Overview_Dashboard_Trailing_Six_Week_${dspCode}_${stationCode}_${year}-W${weekPadded}.csv`,
    'negative-feedback': `DSP_Customer_Delivery_Feedback_negative_${stationCode}_${year}-W${weekPadded}.csv`,
    'pod-quality': `US-${dspCode}-${stationCode}-Week${week}-${year}NA-DA-POD-Details.pdf`,
    'pps-daily': `Daily_PPS_Report_-${today}.csv`,
    dvic: `US_${dspCode}_${stationCode}_${year}_week-${week}_${today}_DVIC_Time_Last_7_Days.xlsx`,
    'paw-print': `Notification_on_Arri_${today}.csv`,
    'safety-dashboard': `Safety_Dashboard_${dspCode}_${stationCode}_${year}-W${weekPadded}.csv`,
  };

  return filenames[docId] || null;
};

// Step image component - displays actual image or placeholder
const StepImage = ({ stepNumber, title, imagePath }) => {
  if (imagePath) {
    return (
      <div className="w-full rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
        <img
          src={imagePath}
          alt={`Step ${stepNumber}: ${title}`}
          className="w-full h-auto object-contain"
        />
      </div>
    );
  }

  // Fallback placeholder
  return (
    <div className="w-full aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex flex-col items-center justify-center gap-2">
      <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
        <span className="text-lg font-bold text-neutral-500 dark:text-neutral-400">{stepNumber}</span>
      </div>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center px-4">
        Screenshot: {title}
      </p>
    </div>
  );
};

export function ExportGuideDialog({ open, onOpenChange, docId, cortexVersion = "2", dspInfo }) {
  const [currentStep, setCurrentStep] = useState(0);

  const guide = getExportGuide(docId, cortexVersion);
  const dynamicFilename = useMemo(() => getDynamicFilename(docId, dspInfo), [docId, dspInfo]);
  const dashboardUrl = useMemo(() => getAmazonDashboardUrl(docId, dspInfo), [docId, dspInfo]);

  if (!guide) {
    return null;
  }

  const { title, steps } = guide;
  const totalSteps = steps.length;

  // Process step description to replace filename placeholder with dynamic value
  const getProcessedDescription = (description) => {
    if (!dynamicFilename) return description;

    // Replace various filename patterns with the actual expected filename
    const patterns = [
      /US_\[DSP\]_\[Station\]_Week\[N\]_\[Year\]_en_DSPScorecard\.pdf/,
      /DSP_Overview_Dashboard_\[DSP\]_\[Station\]_\[Year\]-W\[Week\]\.csv/,
      /DSP_Overview_Dashboard_Trailing_Six_Week_\[DSP\]_\[Station\]_\[Year\]-W\[Week\]\.csv/,
      /DSP_Customer_Delivery_Feedback_negative_\[Station\]_\[Year\]-W\[Week\]\.csv/,
      /US-\[DSP\]-\[Station\]-Week\[N\]-\[Year\]NA-DA-POD-Details\.pdf/,
      /Safety_Dashboard_\[DSP\]_\[Station\]_\[Year\]-W\[Week\]\.csv/,
    ];

    let result = description;
    for (const pattern of patterns) {
      if (pattern.test(result)) {
        result = result.replace(pattern, dynamicFilename);
        break;
      }
    }
    return result;
  };
  const step = steps[currentStep];

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index) => {
    setCurrentStep(index);
  };

  // Reset to first step when dialog opens
  const handleOpenChange = (isOpen) => {
    if (isOpen) {
      setCurrentStep(0);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Export Guide</span>
          </div>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>

        {/* Step Content */}
        <div className="space-y-4">
          {/* Step Image */}
          <StepImage stepNumber={step.stepNumber} title={step.title} imagePath={step.imagePath} />

          {/* Step Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                Step {step.stepNumber} of {totalSteps}
              </span>
            </div>
            <h3 className="font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{getProcessedDescription(step.description)}</p>

            {/* Dashboard Link Button */}
            {step.showDashboardLink && dashboardUrl && (
              <a
                href={dashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-violet-100 dark:bg-violet-500/20 border border-violet-200 dark:border-violet-500/30 text-violet-700 dark:text-violet-300 text-sm font-medium hover:bg-violet-200 dark:hover:bg-violet-500/30 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Paw Print Dashboard
              </a>
            )}
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-1.5 py-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  index === currentStep
                    ? 'w-6 bg-neutral-900 dark:bg-white'
                    : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500'
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={goToPrevStep}
              disabled={currentStep === 0}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                currentStep === 0
                  ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep === totalSteps - 1 ? (
              <button
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                Done
              </button>
            ) : (
              <button
                onClick={goToNextStep}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
