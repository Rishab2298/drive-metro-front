import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Package,
  MessageCircle,
  Wrench,
  Trophy,
  ChevronDown,
  Info,
  X,
  StickyNote,
  AlertTriangle,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SEVERITY_COLORS,
  SEVERITY_LABELS,
  TIER_COLORS,
  METRIC_EXPLANATIONS,
  getSeverityLevel,
  getDvicTimeSeverity,
  formatValue,
  formatLabel,
} from '@/utils/scorecardUtils';

// ============================================
// SAMPLE DATA - Comprehensive with all metrics matching DriverPreviewModal
// ============================================

const SAMPLE_DRIVER = {
  firstName: 'Marcus',
  lastName: 'Thompson',
  transporterId: 'DRV-78432',
  overallStanding: 'Great',

  // Safety metrics
  tier: 'Great',
  ficoScore: 782,
  ppsComplianceRate: 96.5,
  pawPrintComplianceRate: 92,
  pawPrintSent: 105,
  pawPrintTotal: 128,

  // Safety Events (per 100 deliveries)
  distractionsRate: 0.8,
  speedingEventRate: 1.2,
  seatbeltOffRate: 0.05,
  followingDistanceRate: 3.5, // Poor - will show severe red highlighting
  signalViolationsRate: 0.3,

  // PPS Breakdown
  missingParkingBrakeStops: 12,
  missingGearInParkStops: 8,
  ppsTotalEvaluatedStops: 342,

  // Delivery metrics
  qualityTier: 'Great',
  deliveryCompletionRate: 99.2,
  dnr: 3,
  podAcceptanceRate: 94.8,
  podRejects: 18,
  podOpportunities: 1847,
  deliverySuccessBehaviors: 245,
  psb: 120,
  packagesDelivered: 1847,

  // POD Rejects Breakdown
  podRejectsBreakdown_blurryPhoto: 5,
  podRejectsBreakdown_humanInPicture: 3,
  podRejectsBreakdown_noPackageDetected: 4,
  podRejectsBreakdown_packageTooClose: 4,
  podRejectsBreakdown_photoTooDark: 2,

  // Customer metrics
  feedbackTier: 'Fair',
  cdfDpmo: 1580,
  deliveriesWithNegativeFeedback: 4,
  customerEscalationDefect: 1,

  // Customer Feedback Categories (with items for modal drill-down)
  feedbackCategories_deliveredToWrongAddress_count: 1,
  feedbackCategories_deliveredToWrongAddress_displayName: 'Delivered to Wrong Address',
  feedbackCategories_deliveredToWrongAddress_items_0_trackingId: 'TBA847291045',
  feedbackCategories_deliveredToWrongAddress_items_0_feedbackDetails: 'Package left at neighboring house instead of my address',
  feedbackCategories_deliveredToWrongAddress_items_0_deliveryDate: '2025-01-18',

  feedbackCategories_didNotFollowInstructions_count: 2,
  feedbackCategories_didNotFollowInstructions_displayName: 'Did Not Follow Instructions',
  feedbackCategories_didNotFollowInstructions_items_0_trackingId: 'TBA847291098',
  feedbackCategories_didNotFollowInstructions_items_0_feedbackDetails: 'Asked to leave at back door but package was left at front',
  feedbackCategories_didNotFollowInstructions_items_0_deliveryDate: '2025-01-19',
  feedbackCategories_didNotFollowInstructions_items_1_trackingId: 'TBA847291156',
  feedbackCategories_didNotFollowInstructions_items_1_feedbackDetails: 'Requested to ring doorbell but driver did not',
  feedbackCategories_didNotFollowInstructions_items_1_deliveryDate: '2025-01-21',

  feedbackCategories_neverReceived_count: 1,
  feedbackCategories_neverReceived_displayName: 'Never Received Delivery',
  feedbackCategories_neverReceived_items_0_trackingId: 'TBA847291203',
  feedbackCategories_neverReceived_items_0_feedbackDetails: 'Package marked delivered but not found at location shown in photo',
  feedbackCategories_neverReceived_items_0_deliveryDate: '2025-01-22',

  // DVIC metrics
  rushedInspections: 2,
  dvicTime1: '1:45',
  dvicDate1: 'Mon, Jan 20',
  dvicTime2: '0:52',
  dvicDate2: 'Tue, Jan 21',
  dvicTime3: '2:10',
  dvicDate3: 'Wed, Jan 22',
  dvicTime4: '1:30',
  dvicDate4: 'Thu, Jan 23',
  dvicTime5: '0:38',
  dvicDate5: 'Fri, Jan 24',
  dvicTime6: '1:55',
  dvicDate6: 'Sat, Jan 25',

  // Notes and AI Feedback
  dspNote: "Great improvement this week, Marcus! Keep focusing on your photo quality and following customer instructions. You're close to hitting Fantastic tier - let's maintain this momentum for peak season!",
  aiFeedback: [
    "Your FICO score of 782 is solid but there's room to reach 800+. Focus on smoother braking and acceleration patterns during deliveries.",
    "Following distance events (3.5 per 100) are critically above target. Maintain at least 3-4 seconds behind vehicles, especially in residential areas.",
    "Photo-On-Delivery acceptance dropped to 94.8%. Step back 3-4 feet and ensure packages are clearly visible in the frame.",
    "Customer instructions feedback: 2 incidents this week. Always read delivery notes before approaching each stop.",
    "PPS compliance at 96.5% - remember: FIRST apply parking brake, THEN shift to Park at every stop."
  ],
  aiFeedbackUpdatedAt: new Date().toISOString(),

  // Historical data for trailing view
  historicalData: JSON.stringify([
    { week: 51, metrics: { tier: 'Fantastic', ficoScore: 805, deliveryCompletionRate: 99.5, podAcceptanceRate: 98.2, cdfDpmo: 980, overallStanding: 'Fantastic' }},
    { week: 52, metrics: { tier: 'Great', ficoScore: 788, deliveryCompletionRate: 99.1, podAcceptanceRate: 96.8, cdfDpmo: 1250, overallStanding: 'Great' }},
    { week: 1, metrics: { tier: 'Fantastic', ficoScore: 812, deliveryCompletionRate: 99.6, podAcceptanceRate: 97.5, cdfDpmo: 890, overallStanding: 'Fantastic' }},
    { week: 2, metrics: { tier: 'Fantastic', ficoScore: 798, deliveryCompletionRate: 99.4, podAcceptanceRate: 97.1, cdfDpmo: 1100, overallStanding: 'Fantastic' }},
    { week: 3, metrics: { tier: 'Great', ficoScore: 775, deliveryCompletionRate: 99.0, podAcceptanceRate: 95.5, cdfDpmo: 1420, overallStanding: 'Great' }},
    { week: 4, metrics: { tier: 'Great', ficoScore: 782, deliveryCompletionRate: 99.2, podAcceptanceRate: 94.8, cdfDpmo: 1580, overallStanding: 'Great' }},
  ])
};

const SAMPLE_SCORECARD_INFO = {
  dspId: 'DSP-4521',
  stationCode: 'DLA7',
  weekNumber: 4,
  year: 2025
};

const SAMPLE_RANK_DATA = {
  rank: 7,
  score: 87.4,
  eligible: true
};

const SAMPLE_RANKED_COUNT = 52;

// ============================================
// COMPONENTS
// ============================================

// Metric Detail Modal
const MetricDetailModal = ({ data, onClose }) => {
  const getExplanation = (key) => {
    const keyLower = key.toLowerCase();
    for (const [explKey, expl] of Object.entries(METRIC_EXPLANATIONS)) {
      if (keyLower.includes(explKey.toLowerCase()) || explKey.toLowerCase().includes(keyLower)) {
        return expl;
      }
    }
    return {
      title: formatLabel(key),
      desc: `Metric tracking ${formatLabel(key).toLowerCase()} performance.`,
      calc: 'Calculated based on collected data.',
      tips: ['Focus on improvement', 'Review weekly']
    };
  };

  if (!data) return null;
  const info = getExplanation(data.key);
  const severity = getSeverityLevel(data.key, data.value);
  const sevColor = severity ? SEVERITY_COLORS[severity] : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/40"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-[360px] w-full max-h-[80vh] overflow-auto shadow-2xl"
      >
        <div
          className="p-6 border-b border-slate-200"
          style={{ background: sevColor ? sevColor.bg : '#F1F5F9' }}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[17px] font-semibold text-slate-800 leading-tight flex-1">
              {info.title}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-black/10 flex items-center justify-center text-slate-500 hover:bg-black/20 transition-colors"
            >
              ×
            </button>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl">
            <span
              className="text-[28px] font-bold"
              style={{ color: sevColor ? sevColor.text : '#1E293B' }}
            >
              {formatValue(data.key, data.value)}
            </span>
            {severity && (
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: sevColor.dot }}
              />
            )}
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-500 leading-relaxed mb-5">{info.desc}</p>

          <div className="mb-5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Calculation
            </div>
            <p className="text-[13px] text-slate-700 leading-snug p-3 bg-slate-50 rounded-lg border-l-[3px] border-slate-300">
              {info.calc}
            </p>
          </div>

          {info.tips?.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Tips for Improvement
              </div>
              {info.tips.map((tip, i) => (
                <div key={i} className="flex items-center gap-2.5 mb-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-[13px] text-slate-700">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Feedback Detail Modal
const FeedbackDetailModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/40"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-[400px] w-full max-h-[80vh] overflow-auto shadow-2xl"
      >
        <div className="p-6 border-b border-slate-200 bg-red-50">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={20} className="text-red-600" />
              <h3 className="text-[17px] font-semibold text-slate-800 leading-tight">
                {data.label}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-black/10 flex items-center justify-center text-slate-500 hover:bg-black/20 transition-colors"
            >
              ×
            </button>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-lg">
            <span className="text-sm text-red-700 font-semibold">
              {data.items?.length || data.value} incident{(data.items?.length || data.value) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {data.items && data.items.length > 0 ? (
            data.items.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3.5 rounded-xl mb-2.5 last:mb-0 border border-slate-200",
                  idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                )}
              >
                {item.feedbackDetails && (
                  <div className="text-[13px] text-slate-700 leading-snug mb-2.5">
                    "{item.feedbackDetails}"
                  </div>
                )}
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                  {item.trackingId && (
                    <span className="px-2 py-1 bg-white rounded-md border border-slate-200">
                      {item.trackingId}
                    </span>
                  )}
                  {item.deliveryDate && (
                    <span className="px-2 py-1 bg-white rounded-md border border-slate-200">
                      {new Date(item.deliveryDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-slate-400">
              No feedback details available
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Clickable Feedback Category Row - Severe styling with dark background
const FeedbackCategoryRow = ({ category, onClick }) => (
  <div
    onClick={onClick}
    className="flex justify-between items-center py-4 px-4 pl-7 bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-l-[5px] border-red-500 cursor-pointer transition-all shadow-[0_4px_20px_rgba(220,38,38,0.35)] relative"
  >
    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 animate-pulse" />
    <div className="flex items-center gap-3 flex-1">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_4px_12px_rgba(239,68,68,0.5)] animate-pulse">
        <AlertTriangle size={14} className="text-white" />
      </div>
      <span className="text-sm font-bold text-white drop-shadow-sm">
        {category.label}
      </span>
      <Info size={12} className="opacity-50 text-white/50" />
    </div>
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-extrabold text-red-900 py-1.5 px-3 bg-gradient-to-br from-red-200 to-red-300 rounded-full uppercase tracking-wide shadow-md border border-white/30">
        SEVERE
      </span>
      <span className="text-lg font-black text-red-200 drop-shadow-md">
        {category.value}
      </span>
    </div>
  </div>
);

// Metric Row Component
const MetricRow = ({ metricKey, value, label, indent, isTier, forceHighlight, onOpenMetricModal }) => {
  const isDvicTime = metricKey?.toLowerCase().startsWith('dvictime');
  const isPpsBreakdown = metricKey?.toLowerCase().startsWith('pps') && metricKey?.toLowerCase() !== 'ppscompliancerate';
  const isSafetyEvent = ['distractionsrate', 'speedingeventrate', 'seatbeltoffrate', 'followingdistancerate', 'signalviolationsrate'].includes(metricKey?.toLowerCase());

  // Check if PPS breakdown has any non-compliance (value contains "/" and first number > 0)
  const hasPpsNonCompliance = isPpsBreakdown && typeof value === 'string' && value.includes('/') && parseInt(value.split('/')[0]) > 0;

  // Get base severity
  let severity = isDvicTime
    ? getDvicTimeSeverity(value)
    : (isTier ? getSeverityLevel('tier', value) : getSeverityLevel(metricKey, value));

  // Force severity to 'poor' for PPS breakdown items with non-compliance
  if (hasPpsNonCompliance) {
    severity = 'poor';
  }

  const sevColor = severity ? SEVERITY_COLORS[severity] : null;
  const displayLabel = label || formatLabel(metricKey);
  const shouldHighlight = severity === 'poor' || severity === 'fair';
  const isSevere = severity === 'poor';
  const isConcerning = severity === 'fair';

  // Force highlight for PPS breakdown with issues, safety events with poor/fair severity, or explicit forceHighlight prop
  const shouldForceHighlight = forceHighlight || hasPpsNonCompliance || (isSafetyEvent && shouldHighlight);

  const showSevereHighlight = shouldHighlight && (!indent || isDvicTime || shouldForceHighlight);
  const showSevereIcon = isSevere && (!indent || isDvicTime || shouldForceHighlight);

  const tierColor = isTier && value ? TIER_COLORS[value] || TIER_COLORS['N/A'] : null;

  return (
    <div
      onClick={() => onOpenMetricModal({ key: metricKey, value })}
      className={cn(
        "flex justify-between items-center cursor-pointer transition-all border-b border-slate-200 relative",
        indent ? "py-3 px-4 pl-7" : "py-3.5 px-4",
        isSevere && showSevereHighlight && "bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-l-[5px] border-red-500 shadow-[0_4px_20px_rgba(220,38,38,0.35)] py-4",
        isConcerning && showSevereHighlight && "bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 shadow-[0_2px_12px_rgba(249,115,22,0.2)]",
        !showSevereHighlight && (indent ? "bg-slate-50" : "bg-white"),
        !showSevereHighlight && "border-l-4 border-transparent hover:bg-slate-50"
      )}
    >
      {isSevere && showSevereHighlight && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 animate-pulse" />
      )}

      <div className="flex items-center gap-2.5 flex-1">
        {showSevereIcon && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_4px_12px_rgba(239,68,68,0.5)] animate-pulse">
            <AlertTriangle size={14} className="text-white" />
          </div>
        )}
        {isConcerning && showSevereHighlight && !showSevereIcon && (
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center shadow-md"
            style={{ background: `linear-gradient(135deg, ${sevColor.dot} 0%, ${sevColor.text} 100%)` }}
          >
            <AlertTriangle size={12} className="text-white" />
          </div>
        )}
        <span
          className={cn(
            indent && !isDvicTime ? "text-xs" : "text-[13px]",
            isSevere && showSevereHighlight && "text-sm font-bold text-white drop-shadow-sm",
            isConcerning && showSevereHighlight && "font-semibold",
            !showSevereHighlight && (indent ? "text-slate-500 font-medium" : "text-slate-700 font-medium")
          )}
          style={{ color: isConcerning && showSevereHighlight ? sevColor.text : undefined }}
        >
          {displayLabel}
        </span>
        <Info size={12} className={cn("opacity-35", isSevere && showSevereHighlight ? "text-white/50" : "text-slate-400")} />
      </div>
      <div className="flex items-center gap-2.5">
        {isSevere && showSevereHighlight && (
          <span className="text-[10px] font-extrabold text-red-900 py-1.5 px-3 bg-gradient-to-br from-red-200 to-red-300 rounded-full uppercase tracking-wide shadow-md border border-white/30">
            {SEVERITY_LABELS[severity]}
          </span>
        )}
        {isConcerning && showSevereHighlight && (
          <span
            className="text-[9px] font-extrabold text-white py-1 px-2.5 rounded-xl uppercase tracking-wide shadow-md"
            style={{ background: `linear-gradient(135deg, ${sevColor.dot} 0%, ${sevColor.text} 100%)` }}
          >
            {SEVERITY_LABELS[severity]}
          </span>
        )}
        {isTier && tierColor ? (
          <span
            className="text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm"
            style={{
              background: tierColor.bg,
              color: tierColor.text,
              border: `1px solid ${tierColor.border}40`
            }}
          >
            {value}
          </span>
        ) : (
          <span
            className={cn(
              isSevere && showSevereHighlight && "text-lg font-black text-red-200 drop-shadow-md",
              isConcerning && showSevereHighlight && "text-[15px] font-extrabold",
              !showSevereHighlight && (sevColor ? "font-bold" : "font-bold text-slate-700")
            )}
            style={{ color: !isSevere && sevColor ? sevColor.text : undefined }}
          >
            {formatValue(metricKey, value)}
          </span>
        )}
      </div>
    </div>
  );
};

// Sub-section header
const SubSectionHeader = ({ title }) => (
  <div className="py-3 px-4 bg-gradient-to-r from-slate-50 to-white border-y border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
    <span className="w-0.5 h-3 rounded-sm bg-gradient-to-b from-indigo-500 to-violet-500" />
    {title}
  </div>
);

// Section Component with optional subsections
const Section = ({ id, title, icon: Icon, metrics, defaultSev, subSection, subSectionTitle, subMetrics, additionalSubSections, expandedSections, toggleSection, onOpenMetricModal }) => {
  const isOpen = expandedSections[id];
  const sev = defaultSev || 'great';
  const sevColor = SEVERITY_COLORS[sev];

  const additionalCount = additionalSubSections?.reduce((sum, s) => sum + (s.metrics?.length || 0), 0) || 0;
  const totalCount = (metrics?.length || 0) + (subMetrics?.length || 0) + additionalCount;
  if (totalCount === 0) return null;

  return (
    <div className="mb-3.5">
      <button
        onClick={() => toggleSection(id)}
        className={cn(
          "w-full flex items-center justify-between p-3.5 border cursor-pointer transition-all",
          isOpen ? "rounded-t-[14px]" : "rounded-[14px]"
        )}
        style={{
          background: `linear-gradient(135deg, ${sevColor.bg} 0%, ${sevColor.bg}DD 100%)`,
          borderColor: `${sevColor.dot}30`,
          boxShadow: `0 2px 8px ${sevColor.glow || 'rgba(0,0,0,0.05)'}`
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
            style={{
              background: `linear-gradient(135deg, ${sevColor.dot} 0%, ${sevColor.text} 100%)`,
              boxShadow: `0 2px 8px ${sevColor.glow || 'rgba(0,0,0,0.2)'}`
            }}
          >
            <Icon size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold" style={{ color: sevColor.text }}>{title}</span>
          <span
            className="text-[10px] font-bold text-white py-0.5 px-2 rounded-lg"
            style={{ background: sevColor.dot }}
          >
            {totalCount}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={cn("transition-transform duration-300", isOpen && "rotate-180")}
          style={{ color: sevColor.text }}
        />
      </button>
      {isOpen && (
        <div className="bg-white rounded-b-[14px] border border-slate-200 border-t-0 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          {metrics?.map(({ key, value, label, type }) => (
            <MetricRow key={key} metricKey={key} value={value} label={label} isTier={type === 'tier'} onOpenMetricModal={onOpenMetricModal} />
          ))}
          {subSection && subMetrics?.length > 0 && (
            <>
              <SubSectionHeader title={subSectionTitle || subSection} />
              {subMetrics.map(({ key, value, label }) => (
                <MetricRow key={key} metricKey={key} value={value} label={label} indent onOpenMetricModal={onOpenMetricModal} />
              ))}
            </>
          )}
          {additionalSubSections?.map((sub, idx) => (
            sub.metrics?.length > 0 && (
              <div key={idx}>
                <SubSectionHeader title={sub.title} />
                {sub.metrics.map(({ key, value, label }) => (
                  <MetricRow key={key} metricKey={key} value={value} label={label} indent onOpenMetricModal={onOpenMetricModal} />
                ))}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const SampleScorecard = () => {
  const [view, setView] = useState('current');
  const [metricModal, setMetricModal] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    safety: true, delivery: true, customer: true, dvic: true, standing: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const driver = SAMPLE_DRIVER;
  const scorecardInfo = SAMPLE_SCORECARD_INFO;
  const rankData = SAMPLE_RANK_DATA;
  const rankedCount = SAMPLE_RANKED_COUNT;

  const isTrailing = view === 'trailing';
  const standing = driver.overallStanding || driver.tier || 'N/A';
  const rank = rankData?.rank || null;
  const score = rankData?.score || null;
  const packages = parseInt(driver.packagesDelivered) || 0;

  // Parse historical data for trailing view
  const historicalData = driver.historicalData ? JSON.parse(driver.historicalData) : [];
  const hasHistoricalData = historicalData.length > 0;

  // Calculate trailing averages
  const calculateTrailingAverages = () => {
    if (!historicalData.length) return {};
    const averages = {};
    const counts = {};

    historicalData.forEach(week => {
      Object.entries(week.metrics || {}).forEach(([key, value]) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          if (!averages[key]) {
            averages[key] = 0;
            counts[key] = 0;
          }
          averages[key] += numValue;
          counts[key]++;
        } else if (typeof value === 'string') {
          averages[key] = value;
        }
      });
    });

    Object.keys(averages).forEach(key => {
      if (typeof averages[key] === 'number' && counts[key] > 0) {
        averages[key] = Math.round((averages[key] / counts[key]) * 100) / 100;
      }
    });

    return averages;
  };

  const trailingAverages = calculateTrailingAverages();

  // Build categorized metrics
  const buildCategories = () => {
    if (isTrailing) {
      return {
        safety: [
          { key: 'tier', value: trailingAverages.tier || 'Great', label: 'On-Road Safety Score', type: 'tier' },
          { key: 'ficoScore', value: `${Math.round(trailingAverages.ficoScore || 793)}/850`, label: 'FICO Score (Avg)' },
        ],
        safetyEvents: [],
        ppsBreakdown: [],
        delivery: [
          { key: 'deliveryCompletionRate', value: `${(trailingAverages.deliveryCompletionRate || 99.3).toFixed(1)}%`, label: 'Completion Rate (Avg)' },
          { key: 'podAcceptanceRate', value: `${(trailingAverages.podAcceptanceRate || 96.6).toFixed(1)}%`, label: 'POD Acceptance (Avg)' },
        ],
        podBreakdown: [],
        customer: [
          { key: 'cdfDpmo', value: Math.round(trailingAverages.cdfDpmo || 1203), label: 'Negative Feedback Rate (Avg)' },
        ],
        customerFeedbackBreakdown: [],
        dvic: [],
        dvicTimes: [],
        standing: [
          { key: 'overallStanding', value: trailingAverages.overallStanding || 'Great', label: 'Overall Standing', type: 'tier' },
          { key: 'fantasticWeeks', value: '4', label: 'Weeks at Fantastic+/Fantastic' },
          { key: 'greatWeeks', value: '2', label: 'Weeks at Great' },
          { key: 'fairWeeks', value: '0', label: 'Weeks at Fair' },
          { key: 'poorWeeks', value: '0', label: 'Weeks at Poor' },
        ],
        isTrailing: true,
        weekCount: historicalData.length
      };
    }

    // Current week metrics
    const safety = [
      { key: 'tier', value: driver.tier, label: 'On-Road Safety Score', type: 'tier' },
      { key: 'ficoScore', value: `${driver.ficoScore}/850`, label: 'FICO Score' },
      { key: 'ppsComplianceRate', value: `${driver.ppsComplianceRate}%`, label: 'Proper-Park-Sequence Compliance' },
      { key: 'pawPrintComplianceRate', value: `${driver.pawPrintSent}/${driver.pawPrintTotal}`, label: 'Paw Print Contact Compliance' },
    ];

    const safetyEvents = [
      { key: 'distractionsRate', value: driver.distractionsRate, label: 'Distractions' },
      { key: 'speedingEventRate', value: driver.speedingEventRate, label: 'Speeding' },
      { key: 'seatbeltOffRate', value: driver.seatbeltOffRate, label: 'Seatbelt Off' },
      { key: 'followingDistanceRate', value: driver.followingDistanceRate, label: 'Follow Distance' },
      { key: 'signalViolationsRate', value: driver.signalViolationsRate, label: 'Sign/Signal Violations' },
    ];

    const ppsBreakdown = [
      { key: 'ppsDidNotApplyParkingBrake', value: `${driver.missingParkingBrakeStops}/${driver.ppsTotalEvaluatedStops}`, label: 'Did Not Apply Parking Brake' },
      { key: 'ppsDidNotShiftGearToPark', value: `${driver.missingGearInParkStops}/${driver.ppsTotalEvaluatedStops}`, label: 'Did Not Shift Gear to Park' },
    ];

    const delivery = [
      { key: 'qualityTier', value: driver.qualityTier, label: 'Overall Quality Score', type: 'tier' },
      { key: 'deliveryCompletionRate', value: `${driver.deliveryCompletionRate}%`, label: 'Completion Rate' },
      { key: 'dnr', value: driver.dnr, label: 'Delivered, Not Received' },
      { key: 'podAcceptanceRate', value: `${driver.podAcceptanceRate}%`, label: 'Photo-On-Delivery Acceptance' },
      { key: 'podRejects', value: `${driver.podRejects}/${driver.podOpportunities}`, label: 'Photo-On-Delivery Rejects' },
      { key: 'deliverySuccessBehaviors', value: driver.deliverySuccessBehaviors, label: 'Delivery Success Behaviors (DSB)' },
      { key: 'psb', value: driver.psb, label: 'Pickup Success Behaviors (PSB)' },
    ];

    const podBreakdown = [
      { key: 'podRejectsBreakdown_blurryPhoto', value: driver.podRejectsBreakdown_blurryPhoto, label: 'Blurry' },
      { key: 'podRejectsBreakdown_humanInPicture', value: driver.podRejectsBreakdown_humanInPicture, label: 'Human in Photo' },
      { key: 'podRejectsBreakdown_noPackageDetected', value: driver.podRejectsBreakdown_noPackageDetected, label: 'No Package Detected' },
      { key: 'podRejectsBreakdown_packageTooClose', value: driver.podRejectsBreakdown_packageTooClose, label: 'Package Too Close' },
      { key: 'podRejectsBreakdown_photoTooDark', value: driver.podRejectsBreakdown_photoTooDark, label: 'Photo Too Dark' },
    ];

    const customer = [
      { key: 'feedbackTier', value: driver.feedbackTier, label: 'Overall Feedback Score', type: 'tier' },
      { key: 'cdfDpmo', value: driver.cdfDpmo, label: 'Negative Feedback Rate (CDF DPMO)' },
      { key: 'deliveriesWithNegativeFeedback', value: driver.deliveriesWithNegativeFeedback, label: 'Deliveries w/ Negative Feedback' },
      { key: 'customerEscalationDefect', value: driver.customerEscalationDefect, label: 'Escalation Defects' },
    ];

    // Customer Feedback Breakdown - reconstructed from flattened keys
    const customerFeedbackBreakdown = [];
    const feedbackCategories = [
      { key: 'deliveredToWrongAddress', label: 'Delivered to Wrong Address' },
      { key: 'didNotFollowInstructions', label: 'Did Not Follow Instructions' },
      { key: 'neverReceived', label: 'Never Received Delivery' },
    ];

    feedbackCategories.forEach(cat => {
      const countKey = `feedbackCategories_${cat.key}_count`;
      const count = driver[countKey] || 0;

      if (count > 0) {
        const items = [];
        for (let i = 0; i < count; i++) {
          const trackingIdKey = `feedbackCategories_${cat.key}_items_${i}_trackingId`;
          const feedbackDetailsKey = `feedbackCategories_${cat.key}_items_${i}_feedbackDetails`;
          const deliveryDateKey = `feedbackCategories_${cat.key}_items_${i}_deliveryDate`;

          if (driver[trackingIdKey]) {
            items.push({
              trackingId: driver[trackingIdKey],
              feedbackDetails: driver[feedbackDetailsKey] || '',
              deliveryDate: driver[deliveryDateKey] || ''
            });
          }
        }

        customerFeedbackBreakdown.push({
          key: cat.key,
          value: count,
          label: driver[`feedbackCategories_${cat.key}_displayName`] || cat.label,
          items
        });
      }
    });

    const dvic = [
      { key: 'rushedInspections', value: driver.rushedInspections, label: 'Rushed Inspections' },
    ];

    const dvicTimes = [
      { key: 'dvicTime1', value: driver.dvicTime1, label: driver.dvicDate1 },
      { key: 'dvicTime2', value: driver.dvicTime2, label: driver.dvicDate2 },
      { key: 'dvicTime3', value: driver.dvicTime3, label: driver.dvicDate3 },
      { key: 'dvicTime4', value: driver.dvicTime4, label: driver.dvicDate4 },
      { key: 'dvicTime5', value: driver.dvicTime5, label: driver.dvicDate5 },
      { key: 'dvicTime6', value: driver.dvicTime6, label: driver.dvicDate6 },
    ];

    return {
      safety,
      safetyEvents,
      ppsBreakdown,
      delivery,
      podBreakdown,
      customer,
      customerFeedbackBreakdown,
      dvic,
      dvicTimes,
      standing: [],
      isTrailing: false
    };
  };

  const categories = buildCategories();

  return (
    <div className="min-h-screen bg-slate-50 sm:py-6">
      {/* Sample Badge */}
      <div className="max-w-md mx-auto mb-2 px-4 sm:px-0">
        <div className="bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white text-center py-2 px-4 rounded-t-xl sm:rounded-xl text-xs font-bold">
          SAMPLE SCORECARD - This is a demo with example data
        </div>
      </div>

      {/* Card Container */}
      <div className="max-w-md mx-auto sm:rounded-2xl sm:shadow-xl sm:border sm:border-slate-200 sm:overflow-hidden bg-white">
        {/* Header */}
        <div className="px-4 pt-5 pb-0 bg-white border-b-[3px] border-transparent"
          style={{
            borderImage: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899) 1'
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-xl font-extrabold bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                DiveMetric
              </div>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="text-[10px] font-semibold text-slate-500 py-0.5 px-2 bg-slate-100 rounded-md">
                  {scorecardInfo.dspId}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 py-0.5 px-2 bg-slate-100 rounded-md">
                  {scorecardInfo.stationCode}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 py-0.5 px-2 bg-slate-100 rounded-md">
                  Week {scorecardInfo.weekNumber}, {scorecardInfo.year}
                </span>
              </div>
            </div>
            <Link
              to="/home"
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm hover:from-red-500 hover:to-red-600 group transition-all"
            >
              <X size={16} className="text-slate-400 group-hover:text-white transition-colors" />
            </Link>
          </div>

          {/* Profile Card */}
          <div
            className="rounded-2xl p-5 mb-3.5 shadow-[0_8px_32px_rgba(30,27,75,0.4)] relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4338CA 100%)'
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-white/95 to-slate-100/90 flex items-center justify-center text-lg font-extrabold text-indigo-700 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-2 border-white/30">
                  {driver.firstName?.[0]}{driver.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-white tracking-tight drop-shadow-sm">
                    {driver.firstName} {driver.lastName}
                  </div>
                  <div className="text-xs text-indigo-200/90 mt-0.5 font-medium">
                    {driver.transporterId}
                  </div>
                </div>
                <div className="py-1.5 px-3.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20 shadow-md">
                  {standing}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { l: 'Rank', v: rank ? `#${rank}` : '-', sub: rankedCount ? `of ${rankedCount}` : '', accent: '#A5B4FC' },
                  { l: 'Score', v: score ? score.toFixed(1) : '-', sub: 'out of 100', accent: score >= 80 ? '#6EE7B7' : score >= 50 ? '#FCD34D' : '#FCA5A5' },
                  { l: 'Packages', v: packages || '-', sub: 'delivered', accent: '#C4B5FD' }
                ].map((x, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl py-3.5 px-2 text-center border border-white/10">
                    <div
                      className="text-xl font-extrabold tracking-tight"
                      style={{ color: x.accent, textShadow: `0 0 20px ${x.accent}50` }}
                    >
                      {x.v}
                    </div>
                    <div className="text-[9px] text-indigo-200/80 uppercase tracking-widest font-semibold mt-1">{x.l}</div>
                    {x.sub && (
                      <div className="text-[9px] mt-0.5 font-medium text-indigo-200/60">
                        {x.sub}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-4 border border-black/5">
            {[
              { id: 'current', l: 'Current Week', icon: '📊' },
              { id: 'trailing', l: '6-Week Trailing', icon: '📈' }
            ].map(x => (
              <button
                key={x.id}
                onClick={() => setView(x.id)}
                disabled={x.id === 'trailing' && !hasHistoricalData}
                className={cn(
                  "flex-1 py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all",
                  view === x.id
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold shadow-lg"
                    : "text-slate-500 hover:text-slate-700",
                  x.id === 'trailing' && !hasHistoricalData && "opacity-40 cursor-not-allowed"
                )}
              >
                <span className="text-[11px]">{x.icon}</span>
                {x.l}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 bg-slate-50 sm:bg-white">
          {/* Note from DSP */}
          {driver.dspNote && (
            <div className="mb-3.5 p-4 bg-gradient-to-br from-indigo-50 to-violet-100 rounded-[14px] border border-indigo-200/50 shadow-md">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg">
                  <StickyNote size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1.5">
                    Note from your DSP
                  </div>
                  <div className="text-[13px] text-slate-700 leading-relaxed">
                    {driver.dspNote}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trailing View Notice */}
          {isTrailing && hasHistoricalData && (
            <div className="mb-3.5 p-3.5 bg-gradient-to-br from-indigo-50 to-violet-100 rounded-xl flex items-center gap-3.5 border border-indigo-200/50 shadow-md">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg">
                <span className="text-base">📊</span>
              </div>
              <div>
                <div className="text-[13px] font-bold text-indigo-800">
                  6-Week Trailing Averages
                </div>
                <div className="text-[11px] text-indigo-600 mt-0.5">
                  Showing averaged metrics from the past {categories.weekCount} weeks
                </div>
              </div>
            </div>
          )}

          {/* Safety Section */}
          <Section
            id="safety"
            title="Driving Safety"
            icon={Shield}
            metrics={categories.safety}
            defaultSev="fantastic"
            subSection={!categories.isTrailing && categories.ppsBreakdown?.length > 0}
            subSectionTitle="PPS Non-Compliance Breakdown"
            subMetrics={categories.ppsBreakdown}
            additionalSubSections={!categories.isTrailing && categories.safetyEvents?.length > 0
              ? [{ title: 'Events (Per 100 Deliveries)', metrics: categories.safetyEvents }]
              : undefined
            }
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            onOpenMetricModal={setMetricModal}
          />

          {/* Delivery Section */}
          <Section
            id="delivery"
            title="Delivery Quality"
            icon={Package}
            metrics={categories.delivery}
            defaultSev="great"
            subSection={!categories.isTrailing && categories.podBreakdown?.length > 0}
            subSectionTitle="Photo-On-Delivery Rejects"
            subMetrics={categories.podBreakdown}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            onOpenMetricModal={setMetricModal}
          />

          {/* Customer Feedback Section */}
          {(categories.customer?.length > 0 || categories.customerFeedbackBreakdown?.length > 0) && (
            <div className="mb-3.5">
              <button
                onClick={() => toggleSection('customer')}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 border cursor-pointer transition-all bg-gradient-to-br from-orange-50 to-orange-100/80 border-orange-200/50 shadow-md",
                  expandedSections.customer ? "rounded-t-[14px]" : "rounded-[14px]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <MessageCircle size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-orange-700">Customer Feedback</span>
                  <span className="text-[10px] font-bold text-white py-0.5 px-2 rounded-lg bg-orange-500">
                    {(categories.customer?.length || 0) + (categories.customerFeedbackBreakdown?.length || 0)}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={cn("text-orange-600 transition-transform duration-300", expandedSections.customer && "rotate-180")}
                />
              </button>
              {expandedSections.customer && (
                <div className="bg-white rounded-b-[14px] border border-slate-200 border-t-0 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                  {categories.customer?.map(({ key, value, label, type }) => (
                    <MetricRow key={key} metricKey={key} value={value} label={label} isTier={type === 'tier'} onOpenMetricModal={setMetricModal} />
                  ))}
                  {!categories.isTrailing && categories.customerFeedbackBreakdown?.length > 0 && (
                    <>
                      <SubSectionHeader title="Negative Feedback Breakdown" />
                      {categories.customerFeedbackBreakdown.map((category) => (
                        <FeedbackCategoryRow
                          key={category.key}
                          category={category}
                          onClick={() => setFeedbackModal(category)}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* DVIC Section */}
          {!categories.isTrailing && (categories.dvic?.length > 0 || categories.dvicTimes?.length > 0) && (
            <Section
              id="dvic"
              title="Vehicle Inspection Times (DVIC)"
              icon={Wrench}
              metrics={categories.dvic}
              defaultSev="great"
              subSection={categories.dvicTimes?.length > 0}
              subSectionTitle="Inspection Times"
              subMetrics={categories.dvicTimes}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              onOpenMetricModal={setMetricModal}
            />
          )}

          {/* Standing Section - Trailing View Only */}
          {categories.isTrailing && categories.standing?.length > 0 && (
            <Section
              id="standing"
              title="Overall Standing"
              icon={Trophy}
              metrics={categories.standing}
              defaultSev="fantastic"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              onOpenMetricModal={setMetricModal}
            />
          )}

          {/* AI Feedback Section */}
          {driver.aiFeedback && Array.isArray(driver.aiFeedback) && driver.aiFeedback.length > 0 && (
            <div className="mb-3.5">
              <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-pink-500 rounded-t-[14px] shadow-lg">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Lightbulb size={16} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">
                  AI Feedback to Improve
                </span>
                <Sparkles size={14} className="text-white/80" />
              </div>
              <div className="bg-gradient-to-b from-white to-violet-50 rounded-b-[14px] border border-slate-200 border-t-0 p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <ul className="m-0 p-0 list-none">
                  {driver.aiFeedback.map((feedback, index) => (
                    <li key={index} className="text-[13px] text-slate-700 leading-relaxed mb-3 last:mb-0 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-md shrink-0 bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                        {index + 1}
                      </span>
                      {feedback}
                    </li>
                  ))}
                </ul>
                {driver.aiFeedbackUpdatedAt && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-violet-500" />
                    <span className="font-semibold">Generated {new Date(driver.aiFeedbackUpdatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-6 pb-3">
            <div className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              Tap any metric for details
              <span className="w-1 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            </div>
            <div className="text-[11px] mt-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent font-bold tracking-wide">
              DiveMetric Analytics
            </div>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Detail Modal */}
      {metricModal && (
        <MetricDetailModal
          data={metricModal}
          onClose={() => setMetricModal(null)}
        />
      )}

      {/* Feedback Detail Modal */}
      {feedbackModal && (
        <FeedbackDetailModal
          data={feedbackModal}
          onClose={() => setFeedbackModal(null)}
        />
      )}
    </div>
  );
};

export default SampleScorecard;
