import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Loader2,
  Shield,
  Package,
  MessageCircle,
  Wrench,
  ChevronDown,
  Info,
  X,
  ArrowLeft,
  Calendar,
  Building2,
  TrendingUp,
  MessageSquareText,
  StickyNote,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

// Pastel themes
const THEME = {
  bg: '#FFFDF7',
  card: '#FFFFFF',
  subtle: '#FAF8F5',
  text: '#5C5470',
  muted: '#9E9AA7',
  border: '#EBE8E2',
  accent: '#B8A99A'
};

// Severity colors
const SEVERITY_COLORS = {
  fantastic: { bg: '#F3EFF8', text: '#7C6A99', dot: '#A594C0' },
  great: { bg: '#EFF5EF', text: '#5A7A5A', dot: '#7D9B7D' },
  fair: { bg: '#FFF5EB', text: '#9A7355', dot: '#D4A574' },
  poor: { bg: '#FCF0F0', text: '#996666', dot: '#C99191' }
};

// KEY METRICS to display - Same as internal preview
const KEY_METRICS = {
  safety: [
    { key: 'tier', label: 'On-Road Safety Score', type: 'tier' },
    { key: 'ficoScore', label: 'FICO Score', format: 'outOf850' },
    { key: 'ppsComplianceRate', label: 'Proper-Park-Sequence Compliance', format: 'percent' },
    { key: 'pawPrintCompliance', label: 'Paw Print Contact Compliance', format: 'fraction', total: 'pawPrintTotal', sent: 'pawPrintSent' },
  ],
  safetyEvents: [
    { key: 'distractionsRate', label: 'Distractions' },
    { key: 'speedingEventRate', label: 'Speeding' },
    { key: 'seatbeltOffRate', label: 'Seatbelt Off' },
    { key: 'followingDistanceRate', label: 'Follow Distance' },
    { key: 'signalViolationsRate', label: 'Sign/Signal Violations' },
  ],
  safetyTrailing: ['onRoadSafetyScore', 'pawPrintContactCompliance'],
  delivery: [
    { key: 'qualityTier', label: 'Overall Quality Score', type: 'tier', fallback: 'tier' },
    { key: 'deliveryCompletionRate', label: 'Completion Rate', format: 'percent' },
    { key: 'dnr', label: 'Delivered, Not Received', format: 'fraction' },
    { key: 'podAcceptanceRate', label: 'Photo-On-Delivery Acceptance', format: 'percent' },
    { key: 'podRejects', label: 'Photo-On-Delivery Rejects', format: 'fractionWithTotal', total: 'podOpportunities' },
    { key: 'deliverySuccessBehaviors', label: 'Delivery Success Behaviors' },
    { key: 'psb', label: 'Pickup Success Behaviors', fallback: 'pickupSuccessBehaviors' },
  ],
  podRejectsBreakdown: [
    { key: 'podRejectsBreakdown_blurryPhoto', label: 'Blurry' },
    { key: 'podRejectsBreakdown_humanInPicture', label: 'Human in Photo' },
    { key: 'podRejectsBreakdown_noPackageDetected', label: 'No Package Detected' },
    { key: 'podRejectsBreakdown_packageTooClose', label: 'Package Too Close' },
    { key: 'podRejectsBreakdown_photoTooDark', label: 'Photo Too Dark' },
  ],
  deliveryTrailing: ['overallQualityScore', 'completionRate', 'photoOnDeliveryAcceptance'],
  customer: [
    { key: 'feedbackTier', label: 'Overall Feedback Score', type: 'tier', fallback: 'tier' },
    { key: 'cdfDpmo', label: 'Negative Feedback Rate (CDF DPMO)' },
    { key: 'deliveriesWithNegativeFeedback', label: 'Deliveries w/ Negative Feedback', format: 'fraction' },
    { key: 'customerEscalationDefect', label: 'Escalation Defects' },
  ],
  customerTrailing: ['overallFeedbackScore', 'negativeFeedbackRate'],
  dvic: [
    { key: 'rushedInspections', label: 'Rushed Inspections' },
    { key: 'dvicRushed', label: 'Rushed Inspections' },
  ],
  dvicTimes: [
    { key: 'dvicTime1', labelKey: 'dvicDate1' },
    { key: 'dvicTime2', labelKey: 'dvicDate2' },
    { key: 'dvicTime3', labelKey: 'dvicDate3' },
    { key: 'dvicTime4', labelKey: 'dvicDate4' },
    { key: 'dvicTime5', labelKey: 'dvicDate5' },
    { key: 'dvicTime6', labelKey: 'dvicDate6' },
    { key: 'dvicTime7', labelKey: 'dvicDate7' },
  ],
  standingTrailing: ['overallStanding', 'tier'],
  standing: ['overallStanding', 'tier']
};

// Metric explanations database
const METRIC_EXPLANATIONS = {
  ficoScore: {
    title: "FICO Safety Score",
    desc: "Standardized driving behavior score from 0-850 measuring risk level based on telematics data.",
    calc: "Factors: Hard braking (25%), Acceleration (20%), Cornering (20%), Speed (20%), Phone use (15%). Target: 800+",
    tips: ["Brake smoothly and early", "Accelerate gradually", "Take corners at safe speeds"]
  },
  seatbeltOffRate: {
    title: "Seatbelt Compliance",
    desc: "Percentage of time seatbelt was properly worn while driving.",
    calc: "100 - (Unbuckled Events ÷ Driving Time × 100). Target: 100%",
    tips: ["Always buckle before starting", "Keep fastened between stops"]
  },
  speedingEventRate: {
    title: "Speeding Events (per 100 Trips)",
    desc: "Sum of all speeding events divided by total trips. A speeding instance is going 10+ MPH over the posted speed limit for roughly one city block.",
    calc: "(Total speeding events ÷ Total trips) × 100. Target: 0 events",
    tips: ["Stay within posted speed limits for your safety and others", "Watch for speed limit changes", "Slow down in residential and school zones"]
  },
  deliveryCompletionRate: {
    title: "Delivery Completion Rate (DCR)",
    desc: "Percentage of packages successfully delivered vs attempted.",
    calc: "(Delivered ÷ Attempted) × 100. Target: 98%+",
    tips: ["Attempt all packages", "Use customer notes", "Call support if stuck"]
  },
  podAcceptanceRate: {
    title: "Photo-On-Delivery Rate",
    desc: "Percentage of delivery photos accepted by quality system.",
    calc: "(Accepted ÷ Opportunities) × 100. Target: 98%+",
    tips: ["Step back 3-4 feet", "Good lighting", "Package clearly visible"]
  },
  cdfDpmo: {
    title: "CDF DPMO",
    desc: "Customer Delivery Feedback - Defects Per Million Opportunities.",
    calc: "(Negative Count ÷ Deliveries) × 1,000,000. Target: < 1,500",
    tips: ["Follow all instructions", "Secure placement", "Professional manner"]
  },
  rushedInspections: {
    title: "Rushed Inspections",
    desc: "Vehicle inspections completed in under 2 minutes.",
    calc: "Rushed Count / Total Inspections. Target: 0 rushed",
    tips: ["Allocate at least 2-3 minutes", "Check all items thoroughly"]
  },
  ppsComplianceRate: {
    title: "Proper Park Sequence (PPS)",
    desc: "Compliance rate for parking protocol: engage parking brake, shift to park, then exit.",
    calc: "(Compliant Stops ÷ Total Stops) × 100. Target: 95%+",
    tips: ["Always set parking brake first", "Shift to park before exiting"]
  },
  customerEscalationDefect: {
    title: "Customer Escalation Defects",
    desc: "Number of customer issues that required escalation to management.",
    calc: "Count of escalated customer issues. Target: 0",
    tips: ["Follow delivery instructions exactly", "Handle packages with care"]
  }
};

// Metric display names
const METRIC_DISPLAY_NAMES = {
  ficoScore: 'FICO Safety Score',
  seatbeltOffRate: 'Seatbelt Off Events',
  speedingEventRate: 'Speeding Events',
  distractionsRate: 'Distraction Events',
  followingDistanceRate: 'Follow Distance Events',
  signalViolationsRate: 'Sign/Signal Violations',
  onRoadSafetyScore: 'On-Road Safety Score',
  pawPrintContactCompliance: 'Paw Print Contact Compliance',
  pawPrintCompliance: 'Paw Print Contact Compliance',
  packagesDelivered: 'Total Packages Delivered',
  deliveryCompletionRate: 'Delivery Completion Rate',
  podAcceptanceRate: 'Photo-On-Delivery Acceptance',
  deliverySuccessBehaviors: 'Delivery Success Behaviors',
  dnr: 'Delivered, Not Received',
  podRejects: 'Photo-On-Delivery Rejects',
  qualityTier: 'Overall Quality Score',
  overallQualityScore: 'Overall Quality Score',
  completionRate: 'Completion Rate',
  photoOnDeliveryAcceptance: 'Photo-On-Delivery Acceptance',
  dcr: 'Delivery Completion Rate',
  pod: 'Photo-On-Delivery Acceptance',
  dsb: 'Delivery Success Behaviors',
  psb: 'Pickup Success Behaviors',
  cdfDpmo: 'Negative Feedback Rate (CDF DPMO)',
  cdf: 'Customer Delivery Feedback',
  customerEscalationDefect: 'Escalation Defects',
  deliveriesWithNegativeFeedback: 'Deliveries w/ Negative Feedback',
  feedbackTier: 'Overall Feedback Score',
  overallFeedbackScore: 'Overall Feedback Score',
  negativeFeedbackRate: 'Negative Feedback Rate (CDF DPMO)',
  dvicComplianceRate: 'Vehicle Inspection Compliance',
  rushedInspections: 'Rushed Inspections',
  dvicRushed: 'Rushed Inspections',
  ppsComplianceRate: 'Proper Park Sequence Compliance',
  pawPrintComplianceRate: 'Paw Print Notification Rate',
  overallStanding: 'Overall Standing',
  tier: 'Performance Tier',
};

// Reverse key map for fallbacks
const REVERSE_KEY_MAP = {
  'onRoadSafetyScore': ['tier', 'overallStanding', 'safetyTier'],
  'pawPrintContactCompliance': ['pawPrint', 'pawPrintCompliance', 'pawPrintContactCompliance'],
  'overallQualityScore': ['tier', 'qualityTier', 'overallStanding'],
  'completionRate': ['dcr', 'deliveryCompletionRate', 'completionRate'],
  'photoOnDeliveryAcceptance': ['pod', 'podAcceptanceRate', 'photoOnDeliveryAcceptance'],
  'overallFeedbackScore': ['tier', 'feedbackTier', 'overallStanding'],
  'negativeFeedbackRate': ['cdf', 'cdfDpmo', 'negativeFeedbackRate'],
  'cdfDpmo': ['cdf', 'cdfDpmo'],
  'deliveryCompletionRate': ['dcr', 'deliveryCompletionRate'],
  'podAcceptanceRate': ['pod', 'podAcceptanceRate'],
  'deliverySuccessBehaviors': ['dsb', 'deliverySuccessBehaviors'],
};

// Get severity level
const getSeverityLevel = (key, value) => {
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(numValue)) {
    if (typeof value === 'string') {
      const tier = value.toLowerCase();
      if (tier === 'platinum' || tier === 'fantastic') return 'fantastic';
      if (tier === 'gold' || tier === 'great') return 'great';
      if (tier === 'silver' || tier === 'fair') return 'fair';
      if (tier === 'bronze' || tier === 'poor') return 'poor';
    }
    return null;
  }

  const keyLower = key.toLowerCase();

  if (keyLower.includes('fico')) {
    if (numValue >= 800) return 'fantastic';
    if (numValue >= 700) return 'great';
    if (numValue >= 600) return 'fair';
    return 'poor';
  }

  if (keyLower.includes('rate') || keyLower.includes('compliance') || keyLower.includes('acceptance')) {
    if (numValue >= 98) return 'fantastic';
    if (numValue >= 95) return 'great';
    if (numValue >= 90) return 'fair';
    return 'poor';
  }

  if (keyLower.includes('dpmo')) {
    if (numValue <= 1000) return 'fantastic';
    if (numValue <= 1500) return 'great';
    if (numValue <= 2500) return 'fair';
    return 'poor';
  }

  return null;
};

// Safety event metrics that should display as "events per 100 trips" NOT percentages
const SAFETY_EVENT_METRICS = [
  'seatbeltoffrate',
  'speedingeventrate',
  'distractionsrate',
  'followingdistancerate',
  'signalviolationsrate'
];

// Format value
const formatValue = (key, value) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  const keyLower = key.toLowerCase();

  // Safety event metrics should display as raw events, not percentages
  if (SAFETY_EVENT_METRICS.includes(keyLower)) {
    const num = parseFloat(value);
    if (!isNaN(num)) return `${num}`;
  }

  if (keyLower.includes('rate') || keyLower.includes('compliance') || keyLower.includes('percentage')) {
    const num = parseFloat(value);
    if (!isNaN(num) && !String(value).includes('%')) return `${num}%`;
  }
  return String(value);
};

// Format label
const formatLabel = (key) => {
  if (METRIC_DISPLAY_NAMES[key]) return METRIC_DISPLAY_NAMES[key];
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Parse historical/trailing data from metrics object
const parseHistoricalData = (metrics) => {
  const weeks = [];

  // Try flattened format: historicalData_week0_dcr or historicalData_w0_dcr
  const weekPattern1 = /^historicalData_week(\d+)_(.+)$/;
  const weekPattern2 = /^historicalData_w(\d+)_(.+)$/;
  const weekMetrics = {};

  Object.entries(metrics).forEach(([key, value]) => {
    let match = key.match(weekPattern1);
    if (!match) {
      match = key.match(weekPattern2);
    }
    if (match) {
      const weekNum = parseInt(match[1]);
      const metricName = match[2];
      if (!weekMetrics[weekNum]) {
        weekMetrics[weekNum] = { week: weekNum, metrics: {} };
      }
      weekMetrics[weekNum].metrics[metricName] = value;
    }
  });

  Object.values(weekMetrics).forEach(weekData => {
    weeks.push(weekData);
  });

  weeks.sort((a, b) => a.week - b.week);
  return weeks;
};

// Get 6-week trailing averages from historical data
const calculateTrailingAverages = (historicalWeeks) => {
  if (!historicalWeeks || historicalWeeks.length === 0) return null;

  const averages = {};
  const counts = {};

  historicalWeeks.forEach(week => {
    Object.entries(week.metrics || {}).forEach(([key, value]) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (!averages[key]) {
          averages[key] = 0;
          counts[key] = 0;
        }
        averages[key] += numValue;
        counts[key]++;
      } else if (typeof value === 'string' && key !== 'weekNum') {
        averages[key] = value;
        counts[key] = 1;
      }
    });
  });

  Object.keys(averages).forEach(key => {
    if (typeof averages[key] === 'number' && counts[key] > 0) {
      averages[key] = Math.round((averages[key] / counts[key]) * 100) / 100;
    }
  });

  return {
    averages,
    weekCount: historicalWeeks.length
  };
};

// Categorize metrics into sections - Same logic as internal preview
const categorizeMetrics = (metrics, useHistorical = false, historicalData = null) => {
  const safety = [];
  const safetyEvents = [];
  const delivery = [];
  const podBreakdown = [];
  const customer = [];
  const dvic = [];
  const dvicTimes = [];
  const standing = [];

  const trailing = useHistorical && historicalData ? calculateTrailingAverages(historicalData) : null;
  const dataSource = trailing?.averages || metrics;

  const getValue = (key, fallbackKey = null) => {
    if (typeof key !== 'string') return null;

    let value = dataSource[key];
    if ((value === null || value === undefined) && fallbackKey) {
      value = dataSource[fallbackKey];
    }
    if (value === null || value === undefined) {
      const alternateKeys = REVERSE_KEY_MAP[key];
      if (Array.isArray(alternateKeys)) {
        for (const altKey of alternateKeys) {
          value = dataSource[altKey];
          if (value !== null && value !== undefined && value !== '') break;
        }
      }
    }
    if (value === null || value === undefined) {
      value = dataSource[key.toLowerCase()];
    }
    return value;
  };

  const formatMetricValue = (metricDef, source) => {
    const value = getValue(metricDef.key, metricDef.fallback);
    if (value === null || value === undefined) return null;

    if (metricDef.format === 'outOf850') {
      return `${value}/850`;
    }
    if (metricDef.format === 'percent') {
      const num = parseFloat(value);
      return isNaN(num) ? value : `${num}%`;
    }
    if (metricDef.format === 'fraction' && metricDef.total && metricDef.sent) {
      const sent = source[metricDef.sent] || 0;
      const total = source[metricDef.total] || 0;
      return `${sent}/${total}`;
    }
    if (metricDef.format === 'fractionWithTotal' && metricDef.total) {
      const total = source[metricDef.total] || 0;
      return `${value}/${total}`;
    }
    return value;
  };

  const addMetricFromDef = (arr, metricDef) => {
    if (typeof metricDef === 'string') {
      const value = getValue(metricDef);
      if (value !== null && value !== undefined && value !== '') {
        arr.push({ key: metricDef, value, label: METRIC_DISPLAY_NAMES[metricDef] || metricDef });
      }
    } else {
      const formattedValue = formatMetricValue(metricDef, dataSource);
      if (formattedValue !== null) {
        arr.push({
          key: metricDef.key,
          value: formattedValue,
          label: metricDef.label,
          type: metricDef.type
        });
      }
    }
  };

  if (useHistorical) {
    KEY_METRICS.safetyTrailing.forEach(key => addMetricFromDef(safety, key));
    KEY_METRICS.deliveryTrailing.forEach(key => addMetricFromDef(delivery, key));
    KEY_METRICS.customerTrailing.forEach(key => addMetricFromDef(customer, key));
    KEY_METRICS.standingTrailing.forEach(key => addMetricFromDef(standing, key));
  } else {
    KEY_METRICS.safety.forEach(def => addMetricFromDef(safety, def));
    KEY_METRICS.safetyEvents.forEach(def => addMetricFromDef(safetyEvents, def));
    KEY_METRICS.delivery.forEach(def => addMetricFromDef(delivery, def));
    KEY_METRICS.podRejectsBreakdown.forEach(def => addMetricFromDef(podBreakdown, def));
    KEY_METRICS.customer.forEach(def => addMetricFromDef(customer, def));
    KEY_METRICS.dvic.forEach(def => addMetricFromDef(dvic, def));

    KEY_METRICS.dvicTimes.forEach(def => {
      const timeValue = getValue(def.key);
      const dayLabel = def.labelKey ? dataSource[def.labelKey] : null;
      if (timeValue !== null && timeValue !== undefined && timeValue !== '') {
        dvicTimes.push({
          key: def.key,
          value: timeValue,
          label: dayLabel || def.key.replace('dvicTime', 'Day ')
        });
      }
    });
  }

  return {
    safety,
    safetyEvents,
    delivery,
    podBreakdown,
    customer,
    dvic,
    dvicTimes,
    standing,
    weekCount: trailing?.weekCount || 0,
    isTrailing: useHistorical
  };
};

// Get explanation for metric
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

// Metric Detail Modal
const MetricDetailModal = ({ data, onClose }) => {
  if (!data) return null;

  const info = getExplanation(data.key);
  const severity = getSeverityLevel(data.key, data.value);
  const sevColor = severity ? SEVERITY_COLORS[severity] : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-sm w-full max-h-[80vh] overflow-auto shadow-2xl"
      >
        <div
          className="p-6 border-b"
          style={{ background: sevColor ? sevColor.bg : THEME.subtle, borderColor: THEME.border }}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold" style={{ color: THEME.text }}>
              {info.title}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.1)' }}
            >
              <X size={16} style={{ color: THEME.muted }} />
            </button>
          </div>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: '#FFFFFF' }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: sevColor ? sevColor.text : THEME.text }}
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
        <div className="p-6">
          <p className="text-sm mb-5" style={{ color: THEME.muted, lineHeight: 1.6 }}>
            {info.desc}
          </p>
          <div className="mb-5">
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: THEME.muted }}
            >
              Calculation
            </div>
            <p
              className="text-sm p-3 rounded-lg"
              style={{
                color: THEME.text,
                background: THEME.subtle,
                borderLeft: `3px solid ${THEME.accent}`
              }}
            >
              {info.calc}
            </p>
          </div>
          {info.tips?.length > 0 && (
            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: THEME.muted }}
              >
                Tips
              </div>
              {info.tips.map((tip, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{ background: SEVERITY_COLORS.great.bg, color: SEVERITY_COLORS.great.text }}
                  >
                    ✓
                  </div>
                  <span className="text-sm" style={{ color: THEME.text }}>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t" style={{ borderColor: THEME.border }}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-semibold text-white"
            style={{ background: THEME.text }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-section header
const SubSectionHeader = ({ title }) => (
  <div style={{
    padding: '10px 16px',
    background: THEME.subtle,
    borderBottom: `1px solid ${THEME.border}`,
    fontSize: '11px',
    fontWeight: '600',
    color: THEME.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }}>
    {title}
  </div>
);

// Metric Row Component
const MetricRow = ({ metricKey, value, label, indent, isTier, onMetricClick }) => {
  const severity = isTier ? getSeverityLevel('tier', value) : getSeverityLevel(metricKey, value);
  const sevColor = severity ? SEVERITY_COLORS[severity] : null;
  const displayLabel = label || formatLabel(metricKey);

  return (
    <div
      onClick={() => onMetricClick({ key: metricKey, value })}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: indent ? '11px 16px 11px 28px' : '13px 16px',
        background: indent ? THEME.subtle : THEME.card,
        borderBottom: `1px solid ${THEME.border}`,
        cursor: 'pointer', transition: 'background 0.15s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
        <span style={{
          fontSize: indent ? '12px' : '13px',
          fontWeight: indent ? '400' : '500',
          color: indent ? THEME.muted : THEME.text
        }}>{displayLabel}</span>
        <Info size={12} style={{ opacity: 0.4, color: THEME.muted }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {severity && !indent && (
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: sevColor.dot }} />
        )}
        <span style={{
          fontSize: isTier ? '12px' : '13px',
          fontWeight: '600',
          color: sevColor ? sevColor.text : THEME.text,
          padding: isTier ? '4px 10px' : '0',
          background: isTier && sevColor ? sevColor.bg : 'transparent',
          borderRadius: isTier ? '8px' : '0'
        }}>
          {isTier ? value : formatValue(metricKey, value)}
        </span>
      </div>
    </div>
  );
};

// Section Component with optional subsections
const Section = ({ title, icon: Icon, metrics, defaultSev, subSection, subSectionTitle, subMetrics, onMetricClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const sev = defaultSev || 'great';
  const sevColor = SEVERITY_COLORS[sev];

  const totalCount = (metrics?.length || 0) + (subMetrics?.length || 0);
  if (totalCount === 0) return null;

  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px', background: sevColor.bg, border: 'none',
          borderRadius: isOpen ? '14px 14px 0 0' : '14px', cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon size={16} style={{ color: sevColor.text }} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: sevColor.text }}>{title}</span>
          <span style={{ fontSize: '11px', color: sevColor.text, opacity: 0.7 }}>({totalCount})</span>
        </div>
        <ChevronDown
          size={14}
          style={{
            color: sevColor.text,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s'
          }}
        />
      </button>
      {isOpen && (
        <div style={{
          background: THEME.card, borderRadius: '0 0 14px 14px',
          border: `1px solid ${THEME.border}`, borderTop: 'none', overflow: 'hidden'
        }}>
          {metrics?.map(({ key, value, label, type }) => (
            <MetricRow key={key} metricKey={key} value={value} label={label} isTier={type === 'tier'} onMetricClick={onMetricClick} />
          ))}
          {subSection && subMetrics?.length > 0 && (
            <>
              <SubSectionHeader title={subSectionTitle || subSection} />
              {subMetrics.map(({ key, value, label }) => (
                <MetricRow key={key} metricKey={key} value={value} label={label} indent onMetricClick={onMetricClick} />
              ))}
            </>
          )}
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
  const [viewTab, setViewTab] = useState('current');

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

  const historicalData = useMemo(() => {
    if (!scorecard?.metrics) return null;
    return parseHistoricalData(scorecard.metrics);
  }, [scorecard]);

  const hasHistoricalData = historicalData && historicalData.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.bg }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: THEME.muted }} />
          <p className="text-sm" style={{ color: THEME.muted }}>Loading scorecard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.bg }}>
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ background: SEVERITY_COLORS.poor.bg }}
          >
            !
          </div>
          <h2 className="text-xl font-semibold" style={{ color: THEME.text }}>
            {error}
          </h2>
          <p className="text-sm" style={{ color: THEME.muted }}>
            This scorecard link may have expired or is invalid.
          </p>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm"
            style={{ background: THEME.text, color: '#fff' }}
          >
            <ArrowLeft size={16} />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const { driver, dsp, metrics, weekStart } = scorecard;
  const standing = metrics?.overallStanding || metrics?.tier || 'N/A';
  const tierSeverity = getSeverityLevel('tier', standing) || 'great';
  const tierColor = SEVERITY_COLORS[tierSeverity];
  const categories = categorizeMetrics(metrics || {}, viewTab === 'trailing', historicalData);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md" style={{ background: `${THEME.card}ee` }}>
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold tracking-tight" style={{ color: THEME.text }}>
              DiveMetric
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: tierColor.bg, color: tierColor.text }}
            >
              {standing}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 pb-8">
        {/* Driver Card */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: THEME.card, border: `1px solid ${THEME.border}` }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${tierColor.dot}, ${tierColor.text})` }}
            >
              {driver?.firstName?.[0] || '?'}
              {driver?.lastName?.[0] || ''}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold" style={{ color: THEME.text }}>
                {driver?.firstName} {driver?.lastName}
              </h1>
              <p className="text-sm" style={{ color: THEME.muted }}>
                {driver?.employeeId}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: THEME.subtle }}
            >
              <Building2 size={16} style={{ color: THEME.muted }} />
              <div>
                <p className="text-xs" style={{ color: THEME.muted }}>Company</p>
                <p className="text-sm font-medium" style={{ color: THEME.text }}>
                  {dsp?.companyName || dsp?.dspCode}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: THEME.subtle }}
            >
              <Calendar size={16} style={{ color: THEME.muted }} />
              <div>
                <p className="text-xs" style={{ color: THEME.muted }}>Week</p>
                <p className="text-sm font-medium" style={{ color: THEME.text }}>
                  {formatDate(weekStart)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DSP Note Section */}
        {scorecard.dspNote && (
          <div
            className="rounded-2xl p-4 mb-4"
            style={{
              background: SEVERITY_COLORS.fantastic.bg,
              border: `1px solid ${THEME.border}`
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: THEME.card }}
              >
                <MessageSquareText size={16} style={{ color: SEVERITY_COLORS.fantastic.text }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-sm font-semibold mb-1"
                  style={{ color: SEVERITY_COLORS.fantastic.text }}
                >
                  Note from your DSP
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: THEME.text }}
                >
                  {scorecard.dspNote}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* View Tabs */}
        {hasHistoricalData && (
          <div
            className="flex gap-2 p-1 rounded-xl mb-4"
            style={{ background: THEME.subtle, border: `1px solid ${THEME.border}` }}
          >
            <button
              onClick={() => setViewTab('current')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all"
              style={{
                background: viewTab === 'current' ? THEME.card : 'transparent',
                color: viewTab === 'current' ? THEME.text : THEME.muted,
                boxShadow: viewTab === 'current' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Calendar size={14} />
              Current Week
            </button>
            <button
              onClick={() => setViewTab('trailing')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all"
              style={{
                background: viewTab === 'trailing' ? THEME.card : 'transparent',
                color: viewTab === 'trailing' ? THEME.text : THEME.muted,
                boxShadow: viewTab === 'trailing' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <TrendingUp size={14} />
              6-Week Trailing
            </button>
          </div>
        )}

        {/* Trailing View Notice */}
        {viewTab === 'trailing' && hasHistoricalData && (
          <div style={{
            marginBottom: '12px', padding: '10px 14px', background: '#EEF2FF',
            borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{ fontSize: '14px' }}>📊</div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#4338CA' }}>
                6-Week Trailing Averages
              </div>
              <div style={{ fontSize: '11px', color: '#6366F1' }}>
                Showing averaged metrics from {categories.weekCount} weeks of data
              </div>
            </div>
          </div>
        )}

        {/* Metric Sections - Same structure as internal preview */}
        <Section
          title="Driving Safety"
          icon={Shield}
          metrics={categories.safety}
          defaultSev="fantastic"
          subSection={!categories.isTrailing && categories.safetyEvents?.length > 0}
          subSectionTitle="Events (Per 100 Deliveries)"
          subMetrics={categories.safetyEvents}
          onMetricClick={setMetricModal}
        />

        <Section
          title="Delivery Quality"
          icon={Package}
          metrics={categories.delivery}
          defaultSev="great"
          subSection={!categories.isTrailing && categories.podBreakdown?.length > 0}
          subSectionTitle="Photo-On-Delivery Rejects"
          subMetrics={categories.podBreakdown}
          onMetricClick={setMetricModal}
        />

        <Section
          title="Customer Feedback"
          icon={MessageCircle}
          metrics={categories.customer}
          defaultSev="fair"
          onMetricClick={setMetricModal}
        />

        {/* DVIC Section - Current Week Only */}
        {!categories.isTrailing && (categories.dvic?.length > 0 || categories.dvicTimes?.length > 0) && (
          <Section
            title="Vehicle Inspection Times (DVIC)"
            icon={Wrench}
            metrics={categories.dvic}
            defaultSev="great"
            subSection={categories.dvicTimes?.length > 0}
            subSectionTitle="Inspection Times"
            subMetrics={categories.dvicTimes}
            onMetricClick={setMetricModal}
          />
        )}

        {/* Footer */}
        <div className="text-center pt-6 pb-4">
          <p className="text-xs" style={{ color: THEME.muted }}>
            Tap any metric for details
          </p>
          <p className="text-xs mt-1" style={{ color: THEME.muted }}>
            Powered by DiveMetric Analytics
          </p>
        </div>
      </div>

      {/* Metric Detail Modal */}
      {metricModal && (
        <MetricDetailModal
          data={metricModal}
          onClose={() => setMetricModal(null)}
        />
      )}
    </div>
  );
};

export default ScorecardView;
