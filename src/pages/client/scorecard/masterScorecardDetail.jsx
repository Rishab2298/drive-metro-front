import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { downloadScorecardPDF, downloadBulkScorecardPDFs, downloadCombinedPDF } from '@/lib/generateScorecardPDF';
import { useSubscription } from '@/contexts/SubscriptionContext';
import UpgradeModal from '@/components/UpgradeModal';
import {
  Loader2,
  ArrowLeft,
  Users,
  Package,
  Calendar,
  Eye,
  Download,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Shield,
  MessageCircle,
  Wrench,
  Trophy,
  Info,
  MoreHorizontal,
  Share2,
  Link2,
  MessageSquare,
  Mail,
  FileText,
  StickyNote,
  UserMinus,
  Settings2,
  Search,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Lightbulb,
  Lock,
  Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

// Standing badge colors
const STANDING_COLORS = {
  Platinum: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  Gold: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Silver: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  Bronze: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Poor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'N/A': 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
};

// Pastel themes for modal
const MODAL_THEMES = {
  cream: { name: "Cream", bg: '#FFFDF7', card: '#FFFFFF', subtle: '#FAF8F5', text: '#5C5470', muted: '#9E9AA7', border: '#EBE8E2', accent: '#B8A99A' },
};

const SEVERITY_COLORS = {
  fantastic: { bg: '#F3EFF8', text: '#7C6A99', dot: '#A594C0' },
  great: { bg: '#EFF5EF', text: '#5A7A5A', dot: '#7D9B7D' },
  fair: { bg: '#FFF5EB', text: '#9A7355', dot: '#D4A574' },
  poor: { bg: '#FCF0F0', text: '#996666', dot: '#C99191' }
};

// KEY METRICS to display - Current Week (comprehensive view)
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

// Metric explanations database (based on Amazon DSP scorecard documentation)
const METRIC_EXPLANATIONS = {
  ficoScore: {
    title: "FICO Safety Score",
    desc: "Driving behavior score from 0-850 based on telematics. Repeated fast acceleration, hard braking, sharp cornering, cell phone distractions, and speeding all decrease your score.",
    calc: "Based on driving activity analysis. Higher is better. Target: 800+ for Fantastic",
    tips: ["Take more time to accelerate and brake smoothly", "Drive safely around corners", "Keep eyes on the road - reduce distractions"]
  },
  seatbeltOffRate: {
    title: "Seatbelt Off Events",
    desc: "Number of times per 100 trips you did not wear your seatbelt. An event is recorded when the vehicle exceeds 6 mph and seatbelt is not buckled.",
    calc: "(Seatbelt off instances ÷ Routes) shown as events per 100 trips. Target: 0",
    tips: ["Always buckle before starting the vehicle", "Keep seatbelt fastened between stops"]
  },
  speedingEventRate: {
    title: "Speeding Events (per 100 Trips)",
    desc: "Sum of all speeding events divided by total trips, shown as events per 100 trips. A speeding instance is going 10+ MPH over the posted speed limit for roughly one city block.",
    calc: "(Total speeding events ÷ Total trips) × 100. Target: 0 events",
    tips: ["Stay within posted speed limits for your safety and others", "Watch for speed limit changes", "Slow down in residential and school zones"]
  },
  distractionsRate: {
    title: "Distraction Events",
    desc: "Number of distraction events per 100 trips. Three types captured via video: looking down, looking at phone, or talking on phone while driving.",
    calc: "(Distraction events ÷ Trips) × 100. Target: 0 events",
    tips: ["Keep attention on the road", "Use Do Not Disturb mode", "Pull over if you need to use your phone"]
  },
  followingDistanceRate: {
    title: "Following Distance Events",
    desc: "Number of tailgating events per 100 trips. An event is recorded if you have 0.6 seconds or less following distance from the vehicle in front.",
    calc: "(Following distance events ÷ Trips) × 100. Target: 0 events",
    tips: ["Maintain at least 3-4 seconds following distance", "Increase distance in bad weather", "Watch for sudden stops ahead"]
  },
  signalViolationsRate: {
    title: "Sign/Signal Violations",
    desc: "Measures adherence to road signs and traffic signals. Includes stop sign violations, illegal U-turns, and red light violations. Red light violations count 10x more due to danger.",
    calc: "(Violations ÷ Trips) × 100, red lights weighted 10x. Target: 0",
    tips: ["Come to complete stop at all stop signs", "Never run red lights", "Check for 'No U-Turn' signs"]
  },
  ppsComplianceRate: {
    title: "Proper Park Sequence (PPS) Compliance",
    desc: "Measures correct parking sequence to prevent vehicle rollaways: FIRST apply parking brake, THEN shift to Park. Both must be done in that order to count as compliant.",
    calc: "(Compliant stops ÷ Total stops) × 100. Target: 100%",
    tips: ["Always apply parking brake FIRST", "Then shift to Park", "On hills, turn wheels toward curb (downhill) or road (uphill)"]
  },
  pawPrintCompliance: {
    title: "Paw Print Contact Compliance",
    desc: "Measures how often you text customers when a Paw Print icon (dog warning) appears. The automated text asks customers to secure pets. Always use this when you see a paw print.",
    calc: "Notifications sent ÷ Paw print stops. Target: 100%",
    tips: ["Check delivery app notes for paw print icon", "Always send text when paw print is present", "Look for dogs before entering property"]
  },
  deliveryCompletionRate: {
    title: "Delivery Completion Rate (DCR)",
    desc: "Percentage of packages dispatched that are successfully delivered (not returned). Uncontrollable factors like dogs, safety, weather, or road closures are excluded.",
    calc: "(Delivered ÷ Dispatched) × 100. Target: ~99% for Fantastic",
    tips: ["Attempt delivery on all packages", "Read customer notes carefully", "Call support if you're stuck"]
  },
  dnr: {
    title: "Delivered, Not Received (DNR)",
    desc: "Packages marked delivered but customer reported not receiving. Only counts controllable situations: multiple packages at group stop, delivered >50m from geopin, no POD photo.",
    calc: "Count of DNR packages. Target: 0",
    tips: ["Deliver to exact geopin location", "Always take a clear POD photo", "Don't deliver multiple customers' packages at once"]
  },
  podAcceptanceRate: {
    title: "Photo-On-Delivery (POD) Acceptance",
    desc: "Percentage of photos that were usable and shown to customers. Photos must clearly show where package is located. Retaking photos doesn't count against you.",
    calc: "(Accepted photos ÷ POD opportunities) × 100. Target: 98%+",
    tips: ["Step back 3-4 feet from package", "Ensure good lighting", "Make sure package is clearly visible"]
  },
  podRejects: {
    title: "Photo-On-Delivery Rejects",
    desc: "Count of rejected photos. Reasons: blurry, human in photo, no package detected, package too close, photo too dark.",
    calc: "Total count of rejected POD photos. Target: 0",
    tips: ["Take clear, well-lit photos", "Keep humans out of frame", "Show package location clearly"]
  },
  deliverySuccessBehaviors: {
    title: "Delivery Success Behaviors (DSB)",
    desc: "DPMO metric for DNR packages where you didn't follow best practices: simultaneous deliveries, deliveries >50m from drop-off, incorrect scan usage, no POD photo.",
    calc: "(Issues ÷ Deliveries) × 1,000,000. Target: ≤250 for Fantastic",
    tips: ["Deliver one customer at a time", "Stay within 50m of drop-off", "Always take POD photos"]
  },
  psb: {
    title: "Pickup Success Behaviors (PSB)",
    desc: "DPMO metric for pickup issues. Measures completing all pickups on time and being within 500m when logging exceptions.",
    calc: "(Pickup issues ÷ Total pickups) × 1,000,000. Target: As low as possible",
    tips: ["Complete pickups within time window", "Be on-site when logging exceptions"]
  },
  cdfDpmo: {
    title: "Negative Feedback Rate (CDF DPMO)",
    desc: "Customer Delivery Feedback - Defects Per Million Opportunities. Example: 1,500 DPMO = 1,500 negative feedbacks per million deliveries. Amazon filters out uncontrollable feedback.",
    calc: "(Negative feedback ÷ Deliveries) × 1,000,000. Target: ≤1,160 for Fantastic",
    tips: ["Always read customer notes before delivery", "Follow instructions exactly", "Be courteous with customers"]
  },
  feedbackTier: {
    title: "Overall Feedback Score",
    desc: "Customer feedback tier based on CDF DPMO score. Tiers: Fantastic (≤1,160), Great, Fair, Poor.",
    calc: "Based on CDF DPMO score. Target: Fantastic tier",
    tips: ["Read customer notes before every delivery", "Be courteous with customers", "Follow all instructions"]
  },
  customerEscalationDefect: {
    title: "Escalation Defects",
    desc: "Incidents during delivery: unprofessional behavior, policy violations, property damage, safety issues. Delayed 2 weeks for investigation. Higher severity = 3x weight.",
    calc: "Weighted count of incidents. Target: 0 for Fantastic",
    tips: ["Be professional at all times", "Follow all instructions", "Handle packages with care"]
  },
  rushedInspections: {
    title: "Rushed Inspections (DVIC)",
    desc: "Vehicle inspections completed too quickly. Standard vehicles: min 90 seconds. Step Vans: min 5 minutes. Under 10 seconds is critical.",
    calc: "Count of rushed inspections. Target: 0",
    tips: ["Take at least 90 seconds for standard vehicles", "Take at least 5 minutes for Step Vans", "Follow DVIC checklist thoroughly"]
  },
  qualityTier: {
    title: "Overall Quality Score",
    desc: "Quality tier based on Completion Rate, POD Acceptance, and Delivery Success Behaviors combined.",
    calc: "Composite of DCR, POD, and DSB scores. Target: Platinum/Fantastic",
    tips: ["Complete all deliveries", "Take quality POD photos", "Follow delivery best practices"]
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
  podRejectsBreakdown_blurryPhoto: 'Blurry Photo',
  podRejectsBreakdown_humanInPicture: 'Human in Photo',
  podRejectsBreakdown_noPackageDetected: 'No Package Detected',
  podRejectsBreakdown_packageTooClose: 'Package Too Close',
  podRejectsBreakdown_photoTooDark: 'Photo Too Dark',
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
  cedScore: 'Customer Escalation Score',
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
  overallScore: 'Overall Performance Score',
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

// Minimum packages for ranking
const MIN_PACKAGES_FOR_RANKING = 500;

// Quality group classification
const getQualityGroup = (driver) => {
  const dpmo = parseFloat(driver.cdfDpmo) || 0;
  const dcr = parseFloat(driver.deliveryCompletionRate) || 0;
  const pod = parseFloat(driver.podAcceptanceRate) || 0;

  if (pod < 99.7) return 5;
  if (dpmo === 0 && dcr >= 100 && pod >= 100) return 0;
  if (dpmo === 0 && dcr >= 99.8) return 1;
  if (dpmo > 0 && dpmo <= 1000 && dcr >= 100 && pod >= 100) return 2;
  if (dpmo === 0) return 3;
  return 4;
};

// Calculate ranks for drivers
const calculateDriverRanks = (drivers) => {
  if (!drivers || drivers.length === 0) return { rankMap: {}, rankedCount: 0 };

  const tierOrder = { Platinum: 0, Gold: 1, Silver: 2, Bronze: 3, Poor: 4 };

  const eligible = drivers.filter(d =>
    (parseInt(d.packagesDelivered) || 0) >= MIN_PACKAGES_FOR_RANKING
  );

  const sorted = [...eligible].sort((a, b) => {
    const tierA = tierOrder[a.overallStanding || a.tier] ?? 5;
    const tierB = tierOrder[b.overallStanding || b.tier] ?? 5;
    if (tierA !== tierB) return tierA - tierB;

    const groupA = getQualityGroup(a);
    const groupB = getQualityGroup(b);
    if (groupA !== groupB) return groupA - groupB;

    const dpmoA = parseFloat(a.cdfDpmo) || 0;
    const dpmoB = parseFloat(b.cdfDpmo) || 0;
    if ((groupA === 2 || groupA === 4) && dpmoA !== dpmoB) {
      return dpmoA - dpmoB;
    }

    const dcrA = parseFloat(a.deliveryCompletionRate) || 0;
    const dcrB = parseFloat(b.deliveryCompletionRate) || 0;
    if (dcrA !== dcrB) return dcrB - dcrA;

    const pkgsA = parseInt(a.packagesDelivered) || 0;
    const pkgsB = parseInt(b.packagesDelivered) || 0;
    return pkgsB - pkgsA;
  });

  const rankMap = {};
  const rankedCount = sorted.length;

  sorted.forEach((driver, index) => {
    const rank = index + 1;
    const score = rankedCount > 1
      ? 100 - ((rank - 1) / (rankedCount - 1) * 100)
      : 100;

    rankMap[driver.transporterId] = {
      rank,
      score: Math.round(score * 100) / 100,
      eligible: true
    };
  });

  drivers
    .filter(d => (parseInt(d.packagesDelivered) || 0) < MIN_PACKAGES_FOR_RANKING)
    .forEach(driver => {
      const packages = parseInt(driver.packagesDelivered) || 0;
      rankMap[driver.transporterId] = {
        rank: null,
        score: null,
        eligible: false,
        packages
      };
    });

  return { rankMap, rankedCount };
};

// Parse historical/trailing data from driver object
const parseHistoricalData = (driver) => {
  const weeks = [];

  // Debug: Log all historicalData keys
  const histKeys = Object.keys(driver).filter(k => k.startsWith('historicalData'));
  if (histKeys.length > 0) {
    console.log('Historical data keys found:', histKeys);
  }

  // Try to parse JSON string format first
  if (driver.historicalData && typeof driver.historicalData === 'string') {
    try {
      const parsed = JSON.parse(driver.historicalData);
      if (Array.isArray(parsed)) {
        parsed.forEach(weekData => {
          weeks.push({
            week: weekData.week ?? weekData.weekNum ?? 0,
            metrics: weekData.metrics || weekData
          });
        });
      }
    } catch (e) {
      // Not valid JSON, continue to flattened format
    }
  }

  // Try flattened format: historicalData_week0_dcr, historicalData_w0_dcr, etc.
  // Pattern 1: historicalData_week0_metricName
  // Pattern 2: historicalData_w0_metricName (index-based)
  const weekPattern1 = /^historicalData_week(\d+)_(.+)$/;
  const weekPattern2 = /^historicalData_w(\d+)_(.+)$/;
  const weekMetrics = {};

  Object.entries(driver).forEach(([key, value]) => {
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

  // Add flattened week data to weeks array
  Object.values(weekMetrics).forEach(weekData => {
    const existingWeek = weeks.find(w => w.week === weekData.week);
    if (!existingWeek) {
      weeks.push(weekData);
    }
  });

  // Sort by week number
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
        // For string values like tier, take the most recent
        averages[key] = value;
        counts[key] = 1;
      }
    });
  });

  // Calculate averages
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

// Categorize driver metrics into sections
const categorizeMetrics = (driver, useHistorical = false, historicalData = null) => {
  const safety = [];
  const safetyEvents = [];
  const delivery = [];
  const podBreakdown = [];
  const customer = [];
  const dvic = [];
  const dvicTimes = [];
  const standing = [];

  // Get trailing averages if using historical view
  const trailing = useHistorical && historicalData ? calculateTrailingAverages(historicalData) : null;
  const dataSource = trailing?.averages || driver;

  // Helper to get value with fallbacks
  const getValue = (key, fallbackKey = null) => {
    if (typeof key !== 'string') return null;

    let value = dataSource[key];
    if ((value === null || value === undefined) && fallbackKey) {
      value = dataSource[fallbackKey];
    }
    // Try alternate keys from REVERSE_KEY_MAP
    if (value === null || value === undefined) {
      const alternateKeys = REVERSE_KEY_MAP[key];
      if (Array.isArray(alternateKeys)) {
        for (const altKey of alternateKeys) {
          value = dataSource[altKey];
          if (value !== null && value !== undefined && value !== '') break;
        }
      }
    }
    // Try lowercase as last resort
    if (value === null || value === undefined) {
      value = dataSource[key.toLowerCase()];
    }
    return value;
  };

  // Helper to format value based on type
  const formatMetricValue = (metricDef, dataSource) => {
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
      const sent = dataSource[metricDef.sent] || 0;
      const total = dataSource[metricDef.total] || 0;
      return `${sent}/${total}`;
    }
    if (metricDef.format === 'fractionWithTotal' && metricDef.total) {
      const total = dataSource[metricDef.total] || 0;
      return `${value}/${total}`;
    }
    return value;
  };

  // Helper to add metric from object definition
  const addMetricFromDef = (arr, metricDef) => {
    if (typeof metricDef === 'string') {
      // Simple string key (for trailing metrics)
      const value = getValue(metricDef);
      if (value !== null && value !== undefined && value !== '') {
        arr.push({ key: metricDef, value, label: METRIC_DISPLAY_NAMES[metricDef] || metricDef });
      }
    } else {
      // Object definition with formatting
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
    // Use trailing-specific metrics (simple string keys)
    KEY_METRICS.safetyTrailing.forEach(key => addMetricFromDef(safety, key));
    KEY_METRICS.deliveryTrailing.forEach(key => addMetricFromDef(delivery, key));
    KEY_METRICS.customerTrailing.forEach(key => addMetricFromDef(customer, key));
    KEY_METRICS.standingTrailing.forEach(key => addMetricFromDef(standing, key));
  } else {
    // Use current week metrics (object definitions)
    KEY_METRICS.safety.forEach(def => addMetricFromDef(safety, def));
    KEY_METRICS.safetyEvents.forEach(def => addMetricFromDef(safetyEvents, def));
    KEY_METRICS.delivery.forEach(def => addMetricFromDef(delivery, def));
    KEY_METRICS.podRejectsBreakdown.forEach(def => addMetricFromDef(podBreakdown, def));
    KEY_METRICS.customer.forEach(def => addMetricFromDef(customer, def));
    KEY_METRICS.dvic.forEach(def => addMetricFromDef(dvic, def));

    // Process DVIC daily times - these have dynamic labels from the data
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

// Driver Preview Modal Component - DiveMetric Design with Tabs
const DriverPreviewModal = ({ driver, onClose, rankData, rankedCount }) => {
  const t = MODAL_THEMES.cream;
  const [view, setView] = useState('current');
  const [metricModal, setMetricModal] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    safety: true, delivery: true, customer: true, dvic: true, standing: true
  });

  // Parse historical data
  const historicalData = parseHistoricalData(driver);
  const hasHistoricalData = historicalData.length > 0;

  // Get categories based on view
  const categories = categorizeMetrics(
    driver,
    view === 'trailing',
    historicalData
  );

  const standing = driver.overallStanding || driver.tier || 'N/A';
  const tierSeverity = getSeverityLevel('tier', standing) || 'great';
  const tierColor = SEVERITY_COLORS[tierSeverity];

  const rank = rankData?.rank || null;
  const score = rankData?.score || null;
  const isEligible = rankData?.eligible || false;
  const packages = parseInt(driver.packagesDelivered) || 0;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Find explanation for metric
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
  const MetricDetailModal = ({ data, onClose: closeDetail }) => {
    if (!data) return null;
    const info = getExplanation(data.key);
    const severity = getSeverityLevel(data.key, data.value);
    const sevColor = severity ? SEVERITY_COLORS[severity] : null;

    return (
      <div
        onClick={closeDetail}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px', zIndex: 1100
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#FFFFFF', borderRadius: '20px', maxWidth: '360px',
            width: '100%', maxHeight: '80vh', overflow: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}
        >
          <div style={{
            padding: '24px',
            borderBottom: `1px solid ${t.border}`,
            background: sevColor ? sevColor.bg : t.subtle
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '600', color: t.text, margin: 0, lineHeight: 1.3, flex: 1 }}>
                {info.title}
              </h3>
              <button
                onClick={closeDetail}
                style={{
                  width: '28px', height: '28px', borderRadius: '8px', border: 'none',
                  background: 'rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: '16px', color: t.muted
                }}
              >×</button>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', background: '#FFFFFF', borderRadius: '12px'
            }}>
              <span style={{
                fontSize: '28px', fontWeight: '700',
                color: sevColor ? sevColor.text : t.text
              }}>
                {formatValue(data.key, data.value)}
              </span>
              {severity && (
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: sevColor.dot
                }} />
              )}
            </div>
          </div>
          <div style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: '14px', color: t.muted, lineHeight: 1.6, margin: '0 0 20px' }}>{info.desc}</p>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Calculation
              </div>
              <p style={{
                fontSize: '13px', color: t.text, lineHeight: 1.5, margin: 0,
                padding: '12px', background: t.subtle, borderRadius: '10px', borderLeft: `3px solid ${t.accent}`
              }}>{info.calc}</p>
            </div>

            {info.tips?.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  Tips for Improvement
                </div>
                {info.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: SEVERITY_COLORS.great.bg, color: SEVERITY_COLORS.great.text,
                      fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>✓</div>
                    <span style={{ fontSize: '13px', color: t.text }}>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${t.border}` }}>
            <button
              onClick={closeDetail}
              style={{
                width: '100%', padding: '12px', background: t.text, color: '#FFF',
                border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
              }}
            >Close</button>
          </div>
        </div>
      </div>
    );
  };

  // Metric Row Component
  const MetricRow = ({ metricKey, value, label, indent, isTier }) => {
    const severity = isTier ? getSeverityLevel('tier', value) : getSeverityLevel(metricKey, value);
    const sevColor = severity ? SEVERITY_COLORS[severity] : null;
    const displayLabel = label || formatLabel(metricKey);

    return (
      <div
        onClick={() => setMetricModal({ key: metricKey, value })}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: indent ? '11px 16px 11px 28px' : '13px 16px',
          background: indent ? t.subtle : t.card,
          borderBottom: `1px solid ${t.border}`,
          cursor: 'pointer', transition: 'background 0.15s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          <span style={{
            fontSize: indent ? '12px' : '13px',
            fontWeight: indent ? '400' : '500',
            color: indent ? t.muted : t.text
          }}>{displayLabel}</span>
          <Info size={12} style={{ opacity: 0.4, color: t.muted }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {severity && !indent && (
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: sevColor.dot }} />
          )}
          <span style={{
            fontSize: isTier ? '12px' : '13px',
            fontWeight: '600',
            color: sevColor ? sevColor.text : t.text,
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

  // Sub-section header
  const SubSectionHeader = ({ title }) => (
    <div style={{
      padding: '10px 16px',
      background: t.subtle,
      borderBottom: `1px solid ${t.border}`,
      fontSize: '11px',
      fontWeight: '600',
      color: t.muted,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      {title}
    </div>
  );

  // Section Component with optional subsections
  const Section = ({ id, title, icon: Icon, metrics, defaultSev, subSection, subSectionTitle, subMetrics }) => {
    const isOpen = expandedSections[id];
    const sev = defaultSev || 'great';
    const sevColor = SEVERITY_COLORS[sev];

    const totalCount = (metrics?.length || 0) + (subMetrics?.length || 0);
    if (totalCount === 0) return null;

    return (
      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={() => toggleSection(id)}
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
            background: t.card, borderRadius: '0 0 14px 14px',
            border: `1px solid ${t.border}`, borderTop: 'none', overflow: 'hidden'
          }}>
            {metrics?.map(({ key, value, label, type }) => (
              <MetricRow key={key} metricKey={key} value={value} label={label} isTier={type === 'tier'} />
            ))}
            {subSection && subMetrics?.length > 0 && (
              <>
                <SubSectionHeader title={subSectionTitle || subSection} />
                {subMetrics.map(({ key, value, label }) => (
                  <MetricRow key={key} metricKey={key} value={value} label={label} indent />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: t.bg }}
      >
        {/* Header */}
        <div style={{ padding: '20px 16px 0', background: t.card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: t.text }}>
              DiveMetric
            </div>
            <button
              onClick={onClose}
              style={{
                width: '28px', height: '28px', borderRadius: '8px', border: 'none',
                background: t.subtle, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={16} style={{ color: t.muted }} />
            </button>
          </div>

          {/* Profile Card */}
          <div style={{
            background: t.card, borderRadius: '14px', padding: '18px',
            border: `1px solid ${t.border}`, marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `linear-gradient(135deg, ${tierColor.dot}, ${tierColor.text})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '15px', fontWeight: '600', color: '#FFF'
              }}>
                {driver.firstName?.[0] || driver.name?.[0] || '?'}
                {driver.lastName?.[0] || ''}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: t.text }}>
                  {driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ') || 'Unknown Driver'}
                </div>
                <div style={{ fontSize: '12px', color: t.muted }}>
                  {driver.transporterId || 'No ID'}
                </div>
              </div>
              <div style={{
                padding: '5px 12px', background: tierColor.bg, borderRadius: '14px',
                fontSize: '11px', fontWeight: '600', color: tierColor.text
              }}>{standing}</div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                {
                  l: 'Rank',
                  v: isEligible ? `#${rank}` : '—',
                  sub: isEligible ? `of ${rankedCount}` : 'Not eligible'
                },
                { l: 'Score', v: score ? score.toFixed(1) : '-', sub: 'out of 100' },
                {
                  l: 'Packages',
                  v: packages || '-',
                  sub: !isEligible ? `${500 - packages} to rank` : null
                }
              ].map((x, i) => (
                <div key={i} style={{
                  background: t.subtle, borderRadius: '10px', padding: '10px 6px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: t.text }}>{x.v}</div>
                  <div style={{ fontSize: '9px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{x.l}</div>
                  {x.sub && <div style={{ fontSize: '8px', color: !isEligible && x.l === 'Rank' ? '#D97706' : t.muted, marginTop: '2px' }}>{x.sub}</div>}
                </div>
              ))}
            </div>

            {!isEligible && (
              <div style={{
                marginTop: '12px', padding: '10px 14px', background: '#FEF3C7',
                borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <div style={{ fontSize: '16px' }}>📦</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400E' }}>
                    {500 - packages} more packages needed for ranking
                  </div>
                  <div style={{ fontSize: '11px', color: '#B45309' }}>
                    Drivers with 500+ packages are included in rankings
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* View Tabs */}
          <div style={{
            display: 'flex', background: t.subtle, borderRadius: '10px', padding: '3px', marginBottom: '16px'
          }}>
            {[
              { id: 'current', l: 'Current Week' },
              { id: 'trailing', l: '6-Week Trailing' }
            ].map(x => (
              <button
                key={x.id}
                onClick={() => setView(x.id)}
                disabled={x.id === 'trailing' && !hasHistoricalData}
                style={{
                  flex: 1, padding: '9px', borderRadius: '8px', border: 'none',
                  background: view === x.id ? t.card : 'transparent',
                  color: view === x.id ? t.text : t.muted,
                  fontSize: '12px', fontWeight: '500',
                  cursor: x.id === 'trailing' && !hasHistoricalData ? 'not-allowed' : 'pointer',
                  opacity: x.id === 'trailing' && !hasHistoricalData ? 0.5 : 1,
                  boxShadow: view === x.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                }}
              >{x.l}</button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '0 16px 24px', maxHeight: 'calc(90vh - 380px)', overflowY: 'auto' }}>
          {/* Note from DSP */}
          {driver.dspNote && (
            <div style={{
              marginBottom: '12px', padding: '14px', background: SEVERITY_COLORS.fantastic.bg,
              borderRadius: '14px', border: `1px solid ${t.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', background: t.card,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <StickyNote size={16} style={{ color: SEVERITY_COLORS.fantastic.text }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: SEVERITY_COLORS.fantastic.text, marginBottom: '4px' }}>
                    Note from your DSP
                  </div>
                  <div style={{ fontSize: '13px', color: t.text, lineHeight: 1.5 }}>
                    {driver.dspNote}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trailing View Notice */}
          {view === 'trailing' && hasHistoricalData && (
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
                  Showing averaged metrics from the past 6 weeks
                </div>
              </div>
            </div>
          )}

          {/* Safety Section with Events subsection */}
          <Section
            id="safety"
            title="Driving Safety"
            icon={Shield}
            metrics={categories.safety}
            defaultSev="fantastic"
            subSection={!categories.isTrailing && categories.safetyEvents?.length > 0}
            subSectionTitle="Events (Per 100 Deliveries)"
            subMetrics={categories.safetyEvents}
          />

          {/* Delivery Section with POD Breakdown subsection */}
          <Section
            id="delivery"
            title="Delivery Quality"
            icon={Package}
            metrics={categories.delivery}
            defaultSev="great"
            subSection={!categories.isTrailing && categories.podBreakdown?.length > 0}
            subSectionTitle="Photo-On-Delivery Rejects"
            subMetrics={categories.podBreakdown}
          />

          {/* Customer Feedback Section */}
          <Section
            id="customer"
            title="Customer Feedback"
            icon={MessageCircle}
            metrics={categories.customer}
            defaultSev="fair"
          />

          {/* DVIC Section - Current Week Only */}
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
            />
          )}

          {/* AI Feedback Section */}
          {driver.aiFeedback && Array.isArray(driver.aiFeedback) && driver.aiFeedback.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                borderRadius: '14px 14px 0 0'
              }}>
                <Lightbulb size={16} style={{ color: '#FFF' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#FFF' }}>
                  AI Feedback to Improve
                </span>
                <Sparkles size={12} style={{ color: '#FFF', opacity: 0.7 }} />
              </div>
              <div style={{
                background: t.card,
                borderRadius: '0 0 14px 14px',
                border: `1px solid ${t.border}`,
                borderTop: 'none',
                padding: '16px'
              }}>
                <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                  {driver.aiFeedback.map((feedback, index) => (
                    <li key={index} style={{
                      fontSize: '13px',
                      color: t.text,
                      lineHeight: 1.6,
                      marginBottom: index < driver.aiFeedback.length - 1 ? '8px' : 0
                    }}>
                      {feedback}
                    </li>
                  ))}
                </ul>
                {driver.aiFeedbackUpdatedAt && (
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: `1px solid ${t.border}`,
                    fontSize: '10px',
                    color: t.muted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Sparkles size={10} />
                    Generated {new Date(driver.aiFeedbackUpdatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
            <div style={{ fontSize: '10px', color: t.muted }}>
              Tap any metric for details · DiveMetric Analytics
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
    </div>
  );
};

// Dropdown Component
const Dropdown = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useState(null);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              'absolute z-50 mt-2 w-48 rounded-xl bg-white dark:bg-neutral-900 shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {typeof children === 'function' ? children(() => setIsOpen(false)) : children}
          </div>
        </>
      )}
    </div>
  );
};

// Dropdown Item Component
const DropdownItem = ({ icon: Icon, label, onClick, disabled, iconClassName }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors',
      disabled
        ? 'text-neutral-400 cursor-not-allowed'
        : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
    )}
  >
    {Icon && <Icon className={cn("w-4 h-4", iconClassName)} />}
    {label}
  </button>
);

// Add Note Modal Component
const AddNoteModal = ({ driver, onClose, onSave, getToken }) => {
  const [note, setNote] = useState(driver?.dspNote || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!driver?.dspNote;
  const driverName = driver?.name || [driver?.firstName, driver?.lastName].filter(Boolean).join(' ');

  const handleSave = async () => {
    if (!note.trim()) return;

    setSaving(true);
    setError(null);

    try {
      console.log('Saving note for scorecard ID:', driver.id);
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/scorecard/${driver.id}/note`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note: note.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', response.status, errorData);
        throw new Error(errorData.error || `Failed to save note (${response.status})`);
      }

      onSave?.(note.trim());
      onClose();
    } catch (err) {
      console.error('Error saving note:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!driver?.dspNote) return;

    setSaving(true);
    setError(null);

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/scorecard/${driver.id}/note`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      onSave?.(null);
      onClose();
    } catch (err) {
      console.error('Error deleting note:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {isEditing ? 'Edit Note' : 'Add Note'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditing ? 'Edit' : 'Add'} a note for {driverName}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This note will be visible on the driver's public scorecard.
          </p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note here... (e.g., Great job this week! Keep up the good work.)"
            className="w-full h-32 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
          />
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </div>
        <div className="p-6 pt-0 flex gap-3">
          {isEditing && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-foreground font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!note.trim() || saving}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors',
              note.trim() && !saving
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
            )}
          >
            {saving ? 'Saving...' : (isEditing ? 'Update Note' : 'Save Note')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Selection Dropdown Component
const SelectionDropdown = ({ onSelect, selectedCount, totalCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { id: 'all', label: 'All', icon: Check },
    { id: 'none', label: 'None', icon: X },
    { id: 'top10', label: 'Top 10', icon: ArrowUp },
    { id: 'bottom10', label: 'Bottom 10', icon: ArrowDown },
    { id: 'ranked', label: 'All Ranked', icon: Trophy },
    { id: 'unranked', label: 'All Unranked', icon: Minus },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-5 h-5 rounded border-2 border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors bg-white dark:bg-neutral-800"
      >
        {selectedCount > 0 && selectedCount < totalCount && (
          <Minus className="w-3 h-3 text-neutral-500" />
        )}
        {selectedCount === totalCount && totalCount > 0 && (
          <Check className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />
        )}
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 z-50 w-44 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-1.5 overflow-hidden">
            <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Quick Select</span>
            </div>
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <option.icon className="w-3.5 h-3.5 text-neutral-400" />
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Sortable Header Component
const SortableHeader = ({ label, sortKey, currentSort, onSort, className = '' }) => {
  const isActive = currentSort.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        'group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
        isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300',
        className
      )}
    >
      {label}
      <span className={cn(
        'transition-opacity',
        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
      )}>
        {direction === 'asc' ? (
          <ArrowUp className="w-3 h-3" />
        ) : direction === 'desc' ? (
          <ArrowDown className="w-3 h-3" />
        ) : (
          <ArrowUpDown className="w-3 h-3" />
        )}
      </span>
    </button>
  );
};

// Bulk Action Modal for Notes
const BulkNoteModal = ({ selectedDrivers, onClose, onSave, getToken }) => {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!note.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const token = await getToken();
      // Save note to all selected drivers
      const promises = selectedDrivers.map(driver =>
        fetch(`${API_URL}/api/scorecard/${driver.id}/note`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ note: note.trim() }),
        })
      );

      await Promise.all(promises);
      onSave?.(note.trim());
      onClose();
    } catch (err) {
      console.error('Error saving notes:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Add Note to {selectedDrivers.length} Drivers
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            This note will be added to all selected drivers' scorecards.
          </p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note here..."
            className="w-full h-32 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
          />
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-foreground font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!note.trim() || saving}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors',
              note.trim() && !saving
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
            )}
          >
            {saving ? 'Saving...' : 'Add Note to All'}
          </button>
        </div>
      </div>
    </div>
  );
};

const MasterScorecardDetail = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { hasPremiumAccess } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [previewDriver, setPreviewDriver] = useState(null);
  const [noteDriver, setNoteDriver] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);

  // New state for enhanced table
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [selectedDrivers, setSelectedDrivers] = useState(new Set());
  const [showBulkNoteModal, setShowBulkNoteModal] = useState(false);

  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState('');

  // AI Feedback state
  const [generatingAIFeedback, setGeneratingAIFeedback] = useState(false);
  const [aiFeedbackError, setAiFeedbackError] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingEmailFor, setSendingEmailFor] = useState(null); // For individual driver email

  // Helper to show upgrade modal
  const promptUpgrade = (featureName) => {
    setUpgradeFeatureName(featureName);
    setShowUpgradeModal(true);
  };

  useEffect(() => {
    const fetchMasterScorecard = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/master-scorecard/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Scorecard not found');
          }
          throw new Error('Failed to fetch scorecard');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching master scorecard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterScorecard();
  }, [id, getToken]);

  // Calculate ranks
  const { rankMap: driverRanks, rankedCount } = data?.drivers
    ? calculateDriverRanks(data.drivers)
    : { rankMap: {}, rankedCount: 0 };
  const totalDrivers = data?.drivers?.length || 0;

  // Tier order for sorting
  const tierOrder = { Platinum: 0, Gold: 1, Silver: 2, Bronze: 3, Poor: 4, 'N/A': 5 };

  // Handle sort
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Handle selection
  const handleSelectDriver = useCallback((driverId) => {
    setSelectedDrivers(prev => {
      const next = new Set(prev);
      if (next.has(driverId)) {
        next.delete(driverId);
      } else {
        next.add(driverId);
      }
      return next;
    });
  }, []);

  // Handle quick select
  const handleQuickSelect = useCallback((action) => {
    if (!data?.drivers) return;

    switch (action) {
      case 'all':
        setSelectedDrivers(new Set(data.drivers.map(d => d.transporterId)));
        break;
      case 'none':
        setSelectedDrivers(new Set());
        break;
      case 'top10': {
        const eligible = data.drivers.filter(d => driverRanks[d.transporterId]?.eligible);
        const sorted = [...eligible].sort((a, b) =>
          (driverRanks[a.transporterId]?.rank || 999) - (driverRanks[b.transporterId]?.rank || 999)
        );
        setSelectedDrivers(new Set(sorted.slice(0, 10).map(d => d.transporterId)));
        break;
      }
      case 'bottom10': {
        const eligible = data.drivers.filter(d => driverRanks[d.transporterId]?.eligible);
        const sorted = [...eligible].sort((a, b) =>
          (driverRanks[b.transporterId]?.rank || 999) - (driverRanks[a.transporterId]?.rank || 999)
        );
        setSelectedDrivers(new Set(sorted.slice(0, 10).map(d => d.transporterId)));
        break;
      }
      case 'ranked':
        setSelectedDrivers(new Set(
          data.drivers.filter(d => driverRanks[d.transporterId]?.eligible).map(d => d.transporterId)
        ));
        break;
      case 'unranked':
        setSelectedDrivers(new Set(
          data.drivers.filter(d => !driverRanks[d.transporterId]?.eligible).map(d => d.transporterId)
        ));
        break;
      default:
        break;
    }
  }, [data?.drivers, driverRanks]);

  // Get selected driver objects
  const selectedDriverObjects = useMemo(() => {
    if (!data?.drivers) return [];
    return data.drivers.filter(d => selectedDrivers.has(d.transporterId));
  }, [data?.drivers, selectedDrivers]);

  // Sort and filter drivers
  const sortedDrivers = useMemo(() => {
    if (!data?.drivers) return [];

    // First, filter by search query
    let filtered = data.drivers;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = data.drivers.filter(driver => {
        const name = driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ') || '';
        return name.toLowerCase().includes(query);
      });
    }

    // Then sort
    return [...filtered].sort((a, b) => {
      const rankInfoA = driverRanks[a.transporterId];
      const rankInfoB = driverRanks[b.transporterId];
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;

      switch (sortConfig.key) {
        case 'rank': {
          // Eligible drivers first, then sort by rank
          if (rankInfoA?.eligible && !rankInfoB?.eligible) return -1;
          if (!rankInfoA?.eligible && rankInfoB?.eligible) return 1;
          if (rankInfoA?.eligible && rankInfoB?.eligible) {
            return ((rankInfoA.rank || 999) - (rankInfoB.rank || 999)) * multiplier;
          }
          return ((rankInfoB?.score || 0) - (rankInfoA?.score || 0)) * multiplier;
        }
        case 'name': {
          const nameA = (a.name || [a.firstName, a.lastName].filter(Boolean).join(' ') || '').toLowerCase();
          const nameB = (b.name || [b.firstName, b.lastName].filter(Boolean).join(' ') || '').toLowerCase();
          return nameA.localeCompare(nameB) * multiplier;
        }
        case 'tier': {
          const tierA = a.overallStanding || a.tier || 'N/A';
          const tierB = b.overallStanding || b.tier || 'N/A';
          return ((tierOrder[tierA] ?? 5) - (tierOrder[tierB] ?? 5)) * multiplier;
        }
        case 'packages': {
          const pkgsA = parseInt(a.packagesDelivered) || 0;
          const pkgsB = parseInt(b.packagesDelivered) || 0;
          return (pkgsA - pkgsB) * multiplier;
        }
        default:
          return 0;
      }
    });
  }, [data?.drivers, driverRanks, searchQuery, sortConfig]);

  // Format date range
  const formatDateRange = (weekStart, weekEnd) => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
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

  // Share functions
  const handleCopyLink = (driver) => {
    // Get the scorecard ID for this driver (from the weekly scorecard)
    const scorecardUrl = `${window.location.origin}/scorecard/${driver.id}`;
    navigator.clipboard.writeText(scorecardUrl);
    setCopiedLink(driver.transporterId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleShareSMS = (driver) => {
    if (!hasPremiumAccess) {
      promptUpgrade('Send SMS');
      return;
    }
    const driverName = driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ');
    const scorecardUrl = `${window.location.origin}/scorecard/${driver.id}`;
    const message = `Hi ${driverName}, here's your weekly scorecard: ${scorecardUrl}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`);
  };

  const handleShareEmail = async (driver) => {
    if (!hasPremiumAccess) {
      promptUpgrade('Send Email');
      return;
    }

    if (!driver.email) {
      toast.error('This driver does not have an email address');
      return;
    }

    setSendingEmailFor(driver.id);

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/scorecard/${driver.id}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      const driverName = driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ');
      toast.success(`Scorecard email sent to ${driverName}`);
    } catch (err) {
      console.error('Email send error:', err);
      toast.error(err.message || 'Failed to send email');
    } finally {
      setSendingEmailFor(null);
    }
  };

  const handleDownloadPDF = (driver) => {
    if (!hasPremiumAccess) {
      promptUpgrade('Download PDF');
      return;
    }
    const rankData = driverRanks[driver.transporterId] || {};
    downloadScorecardPDF(driver, {
      rank: rankData.rank,
      score: rankData.score,
      isEligible: rankData.eligible,
      rankedCount,
      weekNumber: data?.weekNumber,
      year: data?.year,
      weekStart: data?.weekStart,
      weekEnd: data?.weekEnd,
      dspName: data?.dsp?.companyName || data?.dsp?.dspCode,
    });
  };

  const handleRemoveRanking = (driver) => {
    // TODO: Implement remove ranking
    alert('Remove ranking coming soon!');
  };

  const handleOverrideTier = (driver) => {
    // TODO: Implement tier override
    alert('Override tier coming soon!');
  };

  // Bulk action handlers
  const [showPdfDropdown, setShowPdfDropdown] = useState(false);

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

  const handleCombinedPDF = () => {
    if (!hasPremiumAccess) {
      promptUpgrade('Combined PDF Download');
      return;
    }
    if (selectedDriverObjects.length === 0) return;
    setShowPdfDropdown(false);
    downloadCombinedPDF(
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

    // Check which drivers have emails
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
      const token = await getToken();
      const scorecardIds = driversWithEmail.map(d => d.id);

      const response = await fetch(`${API_URL}/api/scorecards/send-bulk-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scorecardIds }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send emails');
      }

      if (result.successCount > 0) {
        toast.success(`Scorecard emails sent to ${result.successCount} driver(s)`);
      }
      if (result.failCount > 0) {
        toast.error(`Failed to send ${result.failCount} email(s)`);
      }

      // Clear selection after successful send
      setSelectedDrivers(new Set());
    } catch (err) {
      console.error('Bulk email error:', err);
      toast.error(err.message || 'Failed to send emails');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleBulkSMS = () => {
    if (!hasPremiumAccess) {
      promptUpgrade('Send SMS');
      return;
    }
    if (selectedDriverObjects.length === 0) return;
    const message = `Hi, your weekly scorecard for Week ${data?.weekNumber} is ready! Check your email or contact your DSP for details.`;
    // For multiple recipients, we'll open with the message pre-filled
    window.open(`sms:?body=${encodeURIComponent(message)}`);
  };

  const handleBulkNotes = () => {
    if (selectedDriverObjects.length === 0) return;
    setShowBulkNoteModal(true);
  };

  // Generate AI Feedback handler
  const [aiFeedbackProcessing, setAiFeedbackProcessing] = useState(false);
  const [aiFeedbackMessage, setAiFeedbackMessage] = useState(null);

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
      const token = await getToken();
      const scorecardIds = selectedDriverObjects.map(d => d.id);

      const response = await fetch(`${API_URL}/api/generate-ai-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scorecardIds,
          masterScorecardId: id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate AI feedback');
      }

      const result = await response.json();

      // Handle async processing response
      if (result.processing) {
        setAiFeedbackProcessing(true);
        setAiFeedbackMessage(`Generating AI feedback for ${result.driversQueued} drivers in background...`);
        setSelectedDrivers(new Set());

        // Show toast notification
        toast.info(
          `Generating AI feedback for ${result.driversQueued} driver${result.driversQueued > 1 ? 's' : ''}. Results will appear automatically as they're ready.`,
          {
            duration: 6000,
            icon: '✨',
          }
        );

        // Start polling to refresh data every 5 seconds
        const pollInterval = setInterval(async () => {
          try {
            const refreshToken = await getToken();
            const refreshResponse = await fetch(`${API_URL}/api/master-scorecard/${id}`, {
              headers: { Authorization: `Bearer ${refreshToken}` },
            });
            if (refreshResponse.ok) {
              const refreshedData = await refreshResponse.json();
              setData(refreshedData);

              // Check if any of the selected drivers now have AI feedback
              const selectedIds = scorecardIds;
              const driversWithFeedback = refreshedData.drivers.filter(
                d => selectedIds.includes(d.id) && d.aiFeedback
              );

              if (driversWithFeedback.length === scorecardIds.length) {
                // All drivers have feedback, stop polling
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

        // Stop polling after 2 minutes max
        setTimeout(() => {
          clearInterval(pollInterval);
          setAiFeedbackProcessing(false);
          if (aiFeedbackMessage) {
            setAiFeedbackMessage('AI feedback generation may still be in progress. Refresh to see updates.');
          }
        }, 120000);

      } else if (result.feedback) {
        // Handle immediate response (legacy)
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
        setSelectedDrivers(new Set());
      }

    } catch (err) {
      console.error('Error generating AI feedback:', err);
      setAiFeedbackError(err.message);
    } finally {
      setGeneratingAIFeedback(false);
    }
  };

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
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/view-scorecards"
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-500" />
            </Link>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                {data?.dsp?.companyName || data?.dsp?.dspCode}
              </p>
              <h1 className="text-2xl font-bold text-foreground">
                Week {data?.weekNumber}, {data?.year}
              </h1>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-muted-foreground">Week</span>
              </div>
              <p className="text-lg font-semibold">
                {data?.weekStart && data?.weekEnd && formatDateRange(data.weekStart, data.weekEnd)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-muted-foreground">Drivers</span>
              </div>
              <p className="text-lg font-semibold">{data?.totalDrivers || 0}</p>
              <p className="text-sm text-muted-foreground">{rankedCount} ranked</p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm text-muted-foreground">Packages</span>
              </div>
              <p className="text-lg font-semibold">{data?.totalPackages?.toLocaleString() || 0}</p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm text-muted-foreground">Standing</span>
              </div>
              <p className="text-lg font-semibold">{data?.averageStanding || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Driver Scorecards</h2>
            {rankedCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {rankedCount} drivers ranked (500+ packages) · {totalDrivers - rankedCount} not yet eligible
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
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedDrivers.size > 0 && (
          <div className="mb-4 p-4 rounded-xl bg-neutral-900 dark:bg-neutral-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 dark:bg-neutral-900/10">
                  <Check className="w-4 h-4 text-white dark:text-neutral-900" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white dark:text-neutral-900">
                    {selectedDrivers.size} driver{selectedDrivers.size !== 1 ? 's' : ''} selected
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
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 dark:bg-neutral-900/10 hover:bg-white/20 dark:hover:bg-neutral-900/20 text-white dark:text-neutral-900 text-sm font-medium transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send SMS
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
                  onClick={() => setSelectedDrivers(new Set())}
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
        )}

        {/* Drivers Table */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
            <div className="col-span-1 flex items-center gap-3">
              <SelectionDropdown
                selectedCount={selectedDrivers.size}
                totalCount={sortedDrivers.length}
                onSelect={handleQuickSelect}
              />
              <SortableHeader
                label="Rank"
                sortKey="rank"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </div>
            <div className="col-span-3">
              <SortableHeader
                label="Driver"
                sortKey="name"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </div>
            <div className="col-span-2 flex justify-center">
              <SortableHeader
                label="Tier"
                sortKey="tier"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </div>
            <div className="col-span-2 flex justify-center">
              <SortableHeader
                label="Packages"
                sortKey="packages"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </div>
            <div className="col-span-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {sortedDrivers.map((driver, index) => {
              const rankInfo = driverRanks[driver.transporterId];
              const rank = rankInfo?.rank;
              const score = rankInfo?.score;
              const isEligible = rankInfo?.eligible;
              const packages = parseInt(driver.packagesDelivered) || 0;
              const tier = driver.overallStanding || driver.tier || 'N/A';
              const isSelected = selectedDrivers.has(driver.transporterId);

              return (
                <div
                  key={driver.id || driver.transporterId || index}
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
                      onClick={() => handleSelectDriver(driver.transporterId)}
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
                        {driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ') || 'Unknown Driver'}
                      </p>
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
                            onClick={() => { setNoteDriver(driver); close(); }}
                          />
                          <DropdownItem
                            icon={UserMinus}
                            label="Remove Ranking"
                            onClick={() => { handleRemoveRanking(driver); close(); }}
                          />
                          <DropdownItem
                            icon={Settings2}
                            label="Override Tier"
                            onClick={() => { handleOverrideTier(driver); close(); }}
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
                            label={copiedLink === driver.transporterId ? 'Copied!' : 'Copy Link'}
                            onClick={() => { handleCopyLink(driver); close(); }}
                          />
                          <DropdownItem
                            icon={MessageSquare}
                            label="SMS"
                            onClick={() => { handleShareSMS(driver); close(); }}
                          />
                          <DropdownItem
                            icon={sendingEmailFor === driver.id ? Loader2 : Mail}
                            label={sendingEmailFor === driver.id ? 'Sending...' : 'Email'}
                            onClick={() => { handleShareEmail(driver); close(); }}
                            disabled={sendingEmailFor === driver.id}
                            iconClassName={sendingEmailFor === driver.id ? 'animate-spin' : ''}
                          />
                          <DropdownItem
                            icon={FileText}
                            label="Download PDF"
                            onClick={() => { handleDownloadPDF(driver); close(); }}
                          />
                        </>
                      )}
                    </Dropdown>

                    {/* Preview Button */}
                    <button
                      onClick={() => setPreviewDriver(driver)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {(!data?.drivers || data.drivers.length === 0) && (
            <div className="text-center py-16 text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Users className="w-8 h-8 opacity-50" />
              </div>
              <p className="font-medium">No driver data found</p>
              <p className="text-sm mt-1">This scorecard doesn't contain any driver information.</p>
            </div>
          )}

          {/* No Search Results */}
          {data?.drivers && data.drivers.length > 0 && sortedDrivers.length === 0 && searchQuery && (
            <div className="text-center py-16 text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Search className="w-8 h-8 opacity-50" />
              </div>
              <p className="font-medium">No drivers found</p>
              <p className="text-sm mt-1">No drivers match "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

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
      </div>

      {/* Preview Modal */}
      {previewDriver && (
        <DriverPreviewModal
          driver={previewDriver}
          onClose={() => setPreviewDriver(null)}
          rankData={driverRanks[previewDriver.transporterId]}
          rankedCount={rankedCount}
        />
      )}

      {/* Add Note Modal */}
      {noteDriver && (
        <AddNoteModal
          driver={noteDriver}
          onClose={() => setNoteDriver(null)}
          getToken={getToken}
          onSave={(note) => {
            // Update local state with the new note
            setData(prevData => {
              if (!prevData) return prevData;
              return {
                ...prevData,
                drivers: prevData.drivers.map(d =>
                  d.id === noteDriver.id
                    ? { ...d, dspNote: note, dspNoteUpdatedAt: note ? new Date().toISOString() : null }
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
            // Update local state with the new notes for all selected drivers
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
    </div>
  );
};

export default MasterScorecardDetail;
