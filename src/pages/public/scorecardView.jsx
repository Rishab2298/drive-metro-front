import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Loader2,
  Shield,
  Package,
  MessageCircle,
  Wrench,
  Trophy,
  ChevronDown,
  Info,
  X,
  ArrowLeft,
  StickyNote,
  AlertTriangle,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Square,
  CheckSquare,
  Star,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SEVERITY_COLORS,
  SEVERITY_LABELS,
  TIER_COLORS,
  METRIC_EXPLANATIONS,
  KEY_METRICS,
  parseHistoricalData,
  categorizeMetrics,
  getSeverityLevel,
  getDvicTimeSeverity,
  formatValue,
  formatLabel,
} from '@/utils/scorecardUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

// Add anti-scraping meta tags to prevent indexing
const useAntiScraping = () => {
  useEffect(() => {
    // Add robots meta tag
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow, noarchive, nosnippet, noimageindex';
    document.head.appendChild(robotsMeta);

    // Add googlebot meta tag
    const googlebotMeta = document.createElement('meta');
    googlebotMeta.name = 'googlebot';
    googlebotMeta.content = 'noindex, nofollow, noarchive, nosnippet, noimageindex';
    document.head.appendChild(googlebotMeta);

    // Add AI crawlers meta tag
    const aiMeta = document.createElement('meta');
    aiMeta.name = 'robots';
    aiMeta.content = 'noai, noimageai';
    document.head.appendChild(aiMeta);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(robotsMeta);
      document.head.removeChild(googlebotMeta);
      document.head.removeChild(aiMeta);
    };
  }, []);
};

// Metric Detail Modal - Matches DriverPreviewModal style
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

// Feedback Detail Modal - For viewing detailed feedback items
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

// Safety Event Detail Modal - For viewing detailed safety events
const SafetyEventDetailModal = ({ data, onClose }) => {
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
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-linear-to-br from-red-50 to-orange-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
                <ShieldAlert size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-800">
                  {data.label}
                </h3>
                <span className="text-xs text-red-600 font-semibold">
                  {data.events?.length || 0} event{data.events?.length !== 1 ? 's' : ''} recorded
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-slate-400 hover:bg-black/10 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="p-4 max-h-80 overflow-y-auto">
          {data.events && data.events.length > 0 ? (
            <div className="space-y-3">
              {data.events.map((event, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Top Row: Event ID & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        Event #{idx + 1}
                      </span>
                      {event.eventId && (
                        <span className="text-[11px] font-mono text-slate-500 px-2 py-0.5 bg-slate-100 rounded">
                          {event.eventId}
                        </span>
                      )}
                    </div>
                    {(event.dateTime || event.date) && (
                      <span className="text-[11px] text-slate-500 font-medium">
                        {event.dateTime || event.date}
                      </span>
                    )}
                  </div>

                  {/* Metric Subtype - Main highlight */}
                  {event.metricSubtype && (
                    <div className="mb-3 p-3 bg-linear-to-r from-red-50 to-orange-50 rounded-lg border-l-3 border-red-500">
                      <span className="text-sm font-bold text-red-700">
                        {event.metricSubtype}
                      </span>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {event.source && (
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Source</div>
                        <div className="text-xs font-medium text-slate-700">{event.source}</div>
                      </div>
                    )}
                    {event.reviewDetails && (
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Review Status</div>
                        <div className={cn(
                          "text-xs font-medium",
                          event.reviewDetails.toLowerCase().includes('approved') ? "text-emerald-600" :
                          event.reviewDetails.toLowerCase().includes('denied') ? "text-red-600" : "text-slate-700"
                        )}>
                          {event.reviewDetails}
                        </div>
                      </div>
                    )}
                    {event.programImpact && (
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Impact</div>
                        <div className="text-xs font-medium text-slate-700">{event.programImpact}</div>
                      </div>
                    )}
                    {event.vin && (
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Vehicle</div>
                        <div className="text-xs font-mono text-slate-600">{event.vin.slice(-6)}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <ShieldAlert size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No event details available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Safety Event Row - Severe styling with red gradient background (similar to FeedbackCategoryRow)
const SafetyEventRow = ({ eventType, onClick }) => (
  <div
    onClick={onClick}
    className="flex justify-between items-center py-4 px-4 pl-7 bg-severe-gradient border-l-[5px] border-red-500 cursor-pointer transition-all shadow-[0_4px_20px_rgba(220,38,38,0.35)] relative"
  >
    {/* Animated pulse border */}
    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 animate-severe-pulse" />

    <div className="flex items-center gap-3 flex-1">
      <div className="w-7 h-7 rounded-lg bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_4px_12px_rgba(239,68,68,0.5)] animate-icon-pulse">
        <ShieldAlert size={14} className="text-white" />
      </div>
      <span className="text-sm font-bold text-white drop-shadow-sm">
        {eventType.label}
      </span>
      <Info size={12} className="opacity-50 text-white/50" />
    </div>
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-extrabold text-red-900 py-1.5 px-3 bg-linear-to-br from-red-200 to-red-300 rounded-full uppercase tracking-wide shadow-md border border-white/30">
        SEVERE
      </span>
      <span className="text-lg font-black text-red-200 drop-shadow-md">
        {eventType.count}
      </span>
    </div>
  </div>
);

// Clickable Feedback Category Row - Severe styling with dark background
const FeedbackCategoryRow = ({ category, onClick }) => (
  <div
    onClick={onClick}
    className="flex justify-between items-center py-4 px-4 pl-7 bg-severe-gradient border-l-[5px] border-red-500 cursor-pointer transition-all shadow-[0_4px_20px_rgba(220,38,38,0.35)] relative"
  >
    {/* Animated pulse border */}
    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 animate-severe-pulse" />

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

// Metric Row Component - Matches DriverPreviewModal styling with severity highlights
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
  const numericValue = typeof value === 'number' ? value : (typeof value === 'string' && !isNaN(parseFloat(value)) ? parseFloat(value) : 0);
  const hasPodIssue = (isPodRejectsParent || isPodBreakdownItem) && numericValue > 0;

  // Check if safety event has value > 0 (severe for any non-zero safety event)
  const hasSafetyIssue = isSafetyEvent && numericValue > 0;

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

  // Force severity to 'poor' for safety events with value > 0
  if (hasSafetyIssue) {
    severity = 'poor';
  }

  const sevColor = severity ? SEVERITY_COLORS[severity] : null;
  const displayLabel = label || formatLabel(metricKey);
  const shouldHighlight = severity === 'poor' || severity === 'fair';
  const isSevere = severity === 'poor';
  const isConcerning = severity === 'fair';

  // Force highlight for PPS breakdown with issues, safety events with issues, POD issues, or explicit forceHighlight prop
  const shouldForceHighlight = forceHighlight || hasPpsNonCompliance || hasPodIssue || hasSafetyIssue || (isSafetyEvent && shouldHighlight);

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
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 animate-severe-pulse" />
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

// Sub-section header - Matches DriverPreviewModal style
const SubSectionHeader = ({ title }) => (
  <div className="py-3 px-4 bg-linear-to-r from-slate-50 to-white border-y border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
    <span className="w-0.75 h-3 rounded-sm bg-linear-to-b from-indigo-500 to-violet-500" />
    {title}
  </div>
);

// Section Component - Matches DriverPreviewModal with collapsible sections
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

const ScorecardView = () => {
  const { id } = useParams();
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metricModal, setMetricModal] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [safetyEventModal, setSafetyEventModal] = useState(null);
  const [view, setView] = useState('current');
  const [expandedSections, setExpandedSections] = useState({
    overall: true, safety: true, delivery: true, customer: true, dvic: true, standing: true, safetyEvents: true
  });
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [acknowledgeError, setAcknowledgeError] = useState(null);

  // Apply anti-scraping meta tags
  useAntiScraping();

  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        const response = await fetch(`${API_URL}/api/scorecard/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Scorecard not found');
          }
          throw new Error('Failed to load scorecard');
        }
        const data = await response.json();
        setScorecard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScorecard();
  }, [id]);

  // Handle acknowledgement
  const handleAcknowledge = useCallback(async () => {
    if (scorecard?.acknowledgedAt || isAcknowledging) return;

    setIsAcknowledging(true);
    setAcknowledgeError(null);

    try {
      const response = await fetch(`${API_URL}/api/scorecard/${id}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to acknowledge scorecard');
      }

      const data = await response.json();
      setScorecard(prev => ({ ...prev, acknowledgedAt: data.acknowledgedAt }));
    } catch (err) {
      setAcknowledgeError(err.message);
    } finally {
      setIsAcknowledging(false);
    }
  }, [id, scorecard?.acknowledgedAt, isAcknowledging]);

  const historicalData = useMemo(() => {
    if (!scorecard?.metrics) return null;
    return parseHistoricalData(scorecard.metrics);
  }, [scorecard]);

  const hasHistoricalData = historicalData && historicalData.length > 0;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm text-slate-500">Loading scorecard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">{error}</h2>
          <p className="text-sm text-slate-500">
            This scorecard link may have expired or is invalid.
          </p>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 text-white hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const { driver, dsp, metrics } = scorecard;
  const standing = metrics?.overallStanding || metrics?.tier || 'N/A';
  const packages = parseInt(metrics?.packagesDelivered) || 0;
  const rank = scorecard.rank;
  const score = scorecard.score;
  const rankedCount = scorecard.rankedCount;
  const categories = categorizeMetrics(metrics || {}, view === 'trailing', historicalData);

  // Build scorecard info for header badges
  const scorecardInfo = {
    dspId: dsp?.dspCode,
    stationCode: dsp?.stationCode,
    weekNumber: scorecard?.weekNumber,
    year: scorecard?.year
  };

  return (
    <div className="min-h-screen bg-slate-50 sm:py-6">
      {/* Card Container - Centered with max width */}
      <div className="max-w-md mx-auto sm:rounded-2xl sm:shadow-xl sm:border sm:border-slate-200 sm:overflow-hidden bg-white">
        {/* Header with gradient accent - Matches DriverPreviewModal */}
        <div
          className="px-4 pt-5 pb-2  bg-white relative"
        >
          {/* Gradient accent border - only spans card width */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.75"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)'
            }}
          />
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
            <Link
              to="/"
              className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm hover:from-red-500 hover:to-red-600 group transition-all"
            >
              <X size={16} className="text-slate-400 group-hover:text-white transition-colors" />
            </Link>
          </div>

          {/* Profile Card - Dark Gradient Hero Section */}
          <div className="bg-profile-gradient rounded-2xl p-5 mb-3.5 shadow-[0_8px_32px_rgba(30,27,75,0.4)] relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-14 h-14 rounded-[14px] bg-linear-to-br from-white/95 to-slate-100/90 flex items-center justify-center text-lg font-extrabold text-indigo-700 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-2 border-white/30">
                  {driver?.firstName?.[0] || '?'}
                  {driver?.lastName?.[0] || ''}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-white tracking-tight drop-shadow-sm">
                    {driver?.firstName} {driver?.lastName}
                  </div>
                  <div className="text-xs text-indigo-200/90 mt-0.5 font-medium">
                    {driver?.employeeId || 'No ID'}
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
          <div className="flex bg-slate-100 rounded-xl p-1 mb-4 border border-black/5 ">
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
        <div className="p-4 bg-slate-50 sm:bg-white">
        {/* Note from DSP */}
        {scorecard.dspNote && (
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
                  {scorecard.dspNote}
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

        {/* Driver Safety Events Section - Only show if there are safety events */}
        {(() => {
          // Extract safety events from driver metrics
          // Handle both nested format (safetyEvents: { Speeding: [...] })
          // and flattened format (safetyEvents_Speeding_0_eventId: "...")
          let safetyEvents = metrics?.safetyEvents || {};

          // If safetyEvents is empty, try to reconstruct from flattened keys
          if (Object.keys(safetyEvents).length === 0 && metrics) {
            const flattenedPattern = /^safetyEvents_([^_]+)_(\d+)_(.+)$/;
            const reconstructed = {};

            Object.entries(metrics).forEach(([key, value]) => {
              const match = key.match(flattenedPattern);
              if (match) {
                const [, metricType, indexStr, field] = match;
                const index = parseInt(indexStr, 10);

                if (!reconstructed[metricType]) {
                  reconstructed[metricType] = [];
                }

                if (!reconstructed[metricType][index]) {
                  reconstructed[metricType][index] = {};
                }

                reconstructed[metricType][index][field] = value;
              }
            });

            // Clean up any sparse arrays
            Object.keys(reconstructed).forEach(metricType => {
              reconstructed[metricType] = reconstructed[metricType].filter(Boolean);
            });

            safetyEvents = reconstructed;
          }

          const eventTypes = KEY_METRICS.safetyEventTypes
            .map(type => {
              const events = safetyEvents[type.key] || [];
              return {
                key: type.key,
                label: type.label,
                count: events.length,
                events: events,
              };
            })
            .filter(type => type.count > 0);

          if (eventTypes.length === 0) return null;

          return (
            <div className="mb-3.5">
              <button
                onClick={() => toggleSection('safetyEvents')}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 border cursor-pointer transition-all bg-linear-to-br from-red-50 to-red-100/80 border-red-200/50 shadow-md",
                  expandedSections.safetyEvents !== false ? "rounded-t-[14px]" : "rounded-[14px]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
                    <ShieldAlert size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-red-700">Driver Safety Events</span>
                  <span className="text-[10px] font-bold text-white py-0.5 px-2 rounded-lg bg-red-500">
                    {eventTypes.reduce((sum, t) => sum + t.count, 0)}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={cn("text-red-600 transition-transform duration-300", expandedSections.safetyEvents !== false && "rotate-180")}
                />
              </button>
              {expandedSections.safetyEvents !== false && (
                <div className="bg-white rounded-b-[14px] border border-slate-200 border-t-0 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                  {eventTypes.map((eventType) => (
                    <SafetyEventRow
                      key={eventType.key}
                      eventType={eventType}
                      onClick={() => setSafetyEventModal(eventType)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* AI Feedback Section */}
        {scorecard.aiFeedback && Array.isArray(scorecard.aiFeedback) && scorecard.aiFeedback.length > 0 && (
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
                {scorecard.aiFeedback.map((feedback, index) => (
                  <li key={index} className="text-[13px] text-slate-700 leading-relaxed mb-3 last:mb-0 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-md shrink-0 bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                      {index + 1}
                    </span>
                    {feedback}
                  </li>
                ))}
              </ul>
              {scorecard.aiFeedbackUpdatedAt && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-violet-500" />
                  <span className="font-semibold">Generated {new Date(scorecard.aiFeedbackUpdatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acknowledgement Section */}
        <div className="mt-6 mb-4">
          {scorecard.acknowledgedAt ? (
            // Already acknowledged
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-200/50 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                  <CheckCircle2 size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-emerald-800">
                    Scorecard Acknowledged
                  </div>
                  <div className="text-xs text-emerald-600 mt-0.5">
                    Confirmed on {new Date(scorecard.acknowledgedAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Not yet acknowledged - show checkbox
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl border border-amber-200/50 shadow-md">
              <button
                onClick={handleAcknowledge}
                disabled={isAcknowledging}
                className="w-full flex items-start gap-3 text-left group"
              >
                <div className={cn(
                  "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shrink-0 mt-0.5",
                  isAcknowledging
                    ? "bg-amber-200 border-amber-300"
                    : "border-amber-400 group-hover:border-amber-500 group-hover:bg-amber-100"
                )}>
                  {isAcknowledging ? (
                    <Loader2 size={14} className="text-amber-600 animate-spin" />
                  ) : (
                    <Square size={14} className="text-amber-400 group-hover:text-amber-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-amber-900 group-hover:text-amber-950 transition-colors">
                    I acknowledge that I have thoroughly reviewed this scorecard
                  </div>
                  <div className="text-xs text-amber-700 mt-1">
                    By checking this box, you confirm that you have read and understood all performance metrics and feedback provided in this scorecard.
                  </div>
                </div>
              </button>
              {acknowledgeError && (
                <div className="mt-3 p-2 bg-red-100 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle size={14} />
                  {acknowledgeError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-4 pb-6">
          <div className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-2">
            <span className="w-1 h-1 rounded-full bg-linear-to-r from-indigo-500 to-violet-500" />
            Tap any metric for details
            <span className="w-1 h-1 rounded-full bg-linear-to-r from-indigo-500 to-violet-500" />
          </div>
          <div className="text-[11px] mt-1.5 text-gradient-brand font-bold tracking-wide">
            Powered by DiveMetric Analytics
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

      {/* Safety Event Detail Modal */}
      {safetyEventModal && (
        <SafetyEventDetailModal
          data={safetyEventModal}
          onClose={() => setSafetyEventModal(null)}
        />
      )}
    </div>
  );
};

export default ScorecardView;
