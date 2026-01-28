// Driver Preview Modal Component - DiveMetric Design with Tabs
import { useState } from 'react';
import {
  X,
  Shield,
  Package,
  MessageCircle,
  Wrench,
  Trophy,
  Info,
  ChevronDown,
  StickyNote,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SEVERITY_COLORS,
  SEVERITY_LABELS,
  TIER_COLORS,
  METRIC_EXPLANATIONS,
  parseHistoricalData,
  categorizeMetrics,
  getSeverityLevel,
  getDvicTimeSeverity,
  formatValue,
  formatLabel,
  getDriverName,
} from '@/utils/scorecardUtils';

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
      className="fixed inset-0 z-1100 flex items-center justify-center p-4 bg-black/40"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-90 w-full max-h-[80vh] overflow-auto shadow-2xl"
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
      className="fixed inset-0 z-1100 flex items-center justify-center p-4 bg-black/40"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-100 w-full max-h-[80vh] overflow-auto shadow-2xl"
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
              {data.items?.length || 0} incident{data.items?.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="p-4 max-h-100 overflow-y-auto">
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
    className="flex justify-between items-center py-4 px-4 pl-7 bg-severe-gradient border-l-[5px] border-red-500 cursor-pointer transition-all shadow-[0_4px_20px_rgba(220,38,38,0.35)] relative"
  >
    {/* Animated pulse border */}
    <div className="absolute left-0 top-0 bottom-0 w-1.25 bg-red-500 animate-severe-pulse" />

    <div className="flex items-center gap-3 flex-1">
      <div className="w-7 h-7 rounded-lg bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_4px_12px_rgba(239,68,68,0.5)] animate-icon-pulse">
        <AlertTriangle size={14} className="text-white" />
      </div>
      <span className="text-sm font-bold text-white drop-shadow-sm">
        {category.label}
      </span>
      <Info size={12} className="opacity-50 text-white/50" />
    </div>
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-extrabold text-red-900 py-1.5 px-3 bg-linear-to-br from-red-200 to-red-300 rounded-full uppercase tracking-wide shadow-md border border-white/30">
        SEVERE
      </span>
      <span className="text-lg font-black text-red-200 drop-shadow-md">
        {category.value}
      </span>
    </div>
  </div>
);

// Metric Row Component
const MetricRow = ({ metricKey, value, label, indent, isTier, forceHighlight, isPodBreakdown, onOpenMetricModal }) => {
  const isDvicTime = metricKey?.toLowerCase().startsWith('dvictime');
  const isPpsBreakdown = metricKey?.toLowerCase().startsWith('pps') && metricKey?.toLowerCase() !== 'ppscompliancerate';
  const isSafetyEvent = ['distractionsrate', 'speedingeventrate', 'seatbeltoffrate', 'followingdistancerate', 'signalviolationsrate'].includes(metricKey?.toLowerCase());

  // Check if this is the parent POD rejects metric
  const isPodRejectsParent = metricKey?.toLowerCase() === 'podrejects' ||
                             metricKey?.toLowerCase() === 'photoondeliveryrejects' ||
                             metricKey?.toLowerCase().includes('podreject');

  // POD breakdown item keys (nested items under Photo on Delivery Rejects)
  const podBreakdownKeys = ['blurry', 'humaninphoto', 'nopackagedetected', 'packagetooclose', 'phototoodark', 'other'];
  const isPodBreakdownItem = isPodBreakdown || podBreakdownKeys.includes(metricKey?.toLowerCase());

  // Check if PPS breakdown has any non-compliance (value contains "/" and first number > 0)
  const hasPpsNonCompliance = isPpsBreakdown && typeof value === 'string' && value.includes('/') && parseInt(value.split('/')[0]) > 0;

  // Check if POD-related items have issues (value > 0)
  const numericValue = typeof value === 'number' ? value : (typeof value === 'string' && !isNaN(parseInt(value)) ? parseInt(value) : 0);
  const hasPodIssue = (isPodRejectsParent || isPodBreakdownItem) && numericValue > 0;

  // Get base severity
  let severity = isDvicTime
    ? getDvicTimeSeverity(value)
    : (isTier ? getSeverityLevel('tier', value) : getSeverityLevel(metricKey, value));

  // Force severity to 'poor' for PPS breakdown items with non-compliance
  if (hasPpsNonCompliance) {
    severity = 'poor';
  }

  // Force severity to 'poor' for POD rejects and POD breakdown items with value > 0
  if (hasPodIssue) {
    severity = 'poor';
  }

  const sevColor = severity ? SEVERITY_COLORS[severity] : null;
  const displayLabel = label || formatLabel(metricKey);
  const shouldHighlight = severity === 'poor' || severity === 'fair';
  const isSevere = severity === 'poor';
  const isConcerning = severity === 'fair';

  // Force highlight for PPS breakdown with issues, safety events with poor/fair severity, POD issues, or explicit forceHighlight prop
  const shouldForceHighlight = forceHighlight || hasPpsNonCompliance || hasPodIssue || (isSafetyEvent && shouldHighlight);

  const showSevereHighlight = shouldHighlight && (!indent || isDvicTime || shouldForceHighlight);
  const showSevereIcon = isSevere && (!indent || isDvicTime || shouldForceHighlight);

  // Get tier-specific color for tier badges
  const tierColor = isTier && value ? TIER_COLORS[value] || TIER_COLORS['N/A'] : null;

  return (
    <div
      onClick={() => onOpenMetricModal({ key: metricKey, value })}
      className={cn(
        "flex justify-between items-center cursor-pointer transition-all border-b border-slate-200 relative",
        indent ? "py-3 px-4 pl-7" : "py-3.5 px-4",
        isSevere && showSevereHighlight && "bg-severe-gradient border-l-[5px] border-red-500 shadow-[0_4px_20px_rgba(220,38,38,0.35)] py-4",
        isConcerning && showSevereHighlight && "bg-linear-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 shadow-[0_2px_12px_rgba(249,115,22,0.2)]",
        !showSevereHighlight && (indent ? "bg-slate-50" : "bg-white"),
        !showSevereHighlight && "border-l-4 border-transparent hover:bg-slate-50"
      )}
    >
      {/* Animated pulse indicator for severe items */}
      {isSevere && showSevereHighlight && (
        <div className="absolute left-0 top-0 bottom-0 w-1.25 bg-red-500 animate-severe-pulse" />
      )}

      <div className="flex items-center gap-2.5 flex-1">
        {showSevereIcon && (
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_4px_12px_rgba(239,68,68,0.5)] animate-icon-pulse">
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
          <span className="text-[10px] font-extrabold text-red-900 py-1.5 px-3 bg-linear-to-br from-red-200 to-red-300 rounded-full uppercase tracking-wide shadow-md border border-white/30">
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
        {/* Tier badge with tier-specific colors */}
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
  <div className="py-3 px-4 bg-linear-to-r from-slate-50 to-white border-y border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
    <span className="w-0.75 h-3 rounded-sm bg-linear-to-b from-indigo-500 to-violet-500" />
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

// Main Driver Preview Modal
export const DriverPreviewModal = ({ driver, onClose, rankData, rankedCount, scorecardInfo }) => {
  const [view, setView] = useState('current');
  const [metricModal, setMetricModal] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overall: true, safety: true, delivery: true, customer: true, dvic: true, standing: true
  });

  const historicalData = parseHistoricalData(driver);
  const hasHistoricalData = historicalData.length > 0;

  const categories = categorizeMetrics(driver, view === 'trailing', historicalData);

  const standing = driver.overallStanding || driver.tier || 'N/A';

  const rank = rankData?.rank || null;
  const score = rankData?.score || null;
  const packages = parseInt(driver.packagesDelivered) || 0;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden bg-slate-50">
        {/* Header with gradient accent */}
        <div className="px-4 pt-5 pb-0 bg-white border-b-[3px] border-transparent bg-clip-padding"
          style={{
            borderImage: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899) 1'
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-xl font-extrabold text-gradient-brand tracking-tight">
                DiveMetric
              </div>
              {scorecardInfo && (
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {scorecardInfo.dspId && (
                    <span className="text-[10px] font-semibold text-slate-500 py-0.5 px-2 bg-slate-100 rounded-md">
                      {scorecardInfo.dspId}
                    </span>
                  )}
                  {scorecardInfo.stationCode && (
                    <span className="text-[10px] font-semibold text-slate-500 py-0.5 px-2 bg-slate-100 rounded-md">
                      {scorecardInfo.stationCode}
                    </span>
                  )}
                  {scorecardInfo.weekNumber && (
                    <span className="text-[10px] font-semibold text-slate-500 py-0.5 px-2 bg-slate-100 rounded-md">
                      Week {scorecardInfo.weekNumber}{scorecardInfo.year ? `, ${scorecardInfo.year}` : ''}
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm hover:from-red-500 hover:to-red-600 group transition-all"
            >
              <X size={16} className="text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Profile Card - Dark Gradient Hero Section */}
          <div className="bg-profile-gradient rounded-2xl p-5 mb-3.5 shadow-[0_8px_32px_rgba(30,27,75,0.4)] relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-14 h-14 rounded-[14px] bg-linear-to-br from-white/95 to-slate-100/90 flex items-center justify-center text-lg font-extrabold text-indigo-700 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-2 border-white/30">
                  {driver.firstName?.[0] || driver.name?.[0] || '?'}
                  {driver.lastName?.[0] || ''}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-white tracking-tight drop-shadow-sm">
                    {getDriverName(driver)}
                  </div>
                  <div className="text-xs text-indigo-200/90 mt-0.5 font-medium">
                    {driver.transporterId || 'No ID'}
                  </div>
                </div>
                <div className="py-1.5 px-3.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20 shadow-md">
                  {standing}
                </div>
              </div>

              {/* Quick Stats - Glass cards on dark */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    l: 'Rank',
                    v: rank ? `#${rank}` : '-',
                    sub: rankedCount ? `of ${rankedCount}` : '',
                    accent: '#A5B4FC'
                  },
                  {
                    l: 'Score',
                    v: score ? score.toFixed(1) : '-',
                    sub: 'out of 100',
                    accent: score >= 80 ? '#6EE7B7' : score >= 50 ? '#FCD34D' : '#FCA5A5'
                  },
                  {
                    l: 'Packages',
                    v: packages || '-',
                    sub: 'delivered',
                    accent: '#C4B5FD'
                  }
                ].map((x, i) => (
                  <div key={i} className="glass-card rounded-xl py-3.5 px-2 text-center">
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
                    ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white font-bold shadow-lg"
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
        <div className="p-4  max-h-[calc(90vh-380px)] overflow-y-auto">
          {/* Note from DSP */}
          {driver.dspNote && (
            <div className="mb-3.5 p-4 bg-linear-to-br from-indigo-50 to-violet-100 rounded-[14px] border border-indigo-200/50 shadow-md">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg">
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
          {view === 'trailing' && hasHistoricalData && (
            <div className="mb-3.5 p-3.5 bg-linear-to-br from-indigo-50 to-violet-100 rounded-xl flex items-center gap-3.5 border border-indigo-200/50 shadow-md">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg">
                <span className="text-base">📊</span>
              </div>
              <div>
                <div className="text-[13px] font-bold text-indigo-800">
                  6-Week Trailing Averages
                </div>
                <div className="text-[11px] text-indigo-600 mt-0.5">
                  Showing averaged metrics from the past 6 weeks
                </div>
              </div>
            </div>
          )}

          {/* Overall Performance Section - Trailing View Only (shown first) */}
          {categories.isTrailing && categories.overall?.length > 0 && (
            <Section
              id="overall"
              title="Overall Performance"
              icon={Star}
              metrics={categories.overall}
              defaultSev="great"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              onOpenMetricModal={setMetricModal}
            />
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
                  "w-full flex items-center justify-between p-3.5 border cursor-pointer transition-all bg-linear-to-br from-orange-50 to-orange-100/80 border-orange-200/50 shadow-md",
                  expandedSections.customer ? "rounded-t-[14px]" : "rounded-[14px]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
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
              <div className="flex items-center gap-3 p-3.5 bg-linear-to-r from-violet-500 via-indigo-500 to-pink-500 rounded-t-[14px] shadow-lg">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Lightbulb size={16} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">
                  AI Feedback to Improve
                </span>
                <Sparkles size={14} className="text-white/80" />
              </div>
              <div className="bg-linear-to-b from-white to-violet-50 rounded-b-[14px] border border-slate-200 border-t-0 p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <ul className="m-0 p-0 list-none">
                  {driver.aiFeedback.map((feedback, index) => (
                    <li key={index} className="text-[13px] text-slate-700 leading-relaxed mb-3 last:mb-0 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-md shrink-0 bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
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
              <span className="w-1 h-1 rounded-full bg-linear-to-r from-indigo-500 to-violet-500" />
              Tap any metric for details
              <span className="w-1 h-1 rounded-full bg-linear-to-r from-indigo-500 to-violet-500" />
            </div>
            <div className="text-[11px] mt-1.5 text-gradient-brand font-bold tracking-wide">
              DiveMetric Analytics
            </div>
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

export default DriverPreviewModal;
