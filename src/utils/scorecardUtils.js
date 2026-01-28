// Scorecard utility functions and constants

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

// Standing badge colors (Tailwind classes)
export const STANDING_COLORS = {
  Platinum: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  Gold: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Silver: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  Bronze: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Poor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'N/A': 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
};

// Tier colors for modal badges (hex values)
export const TIER_COLORS = {
  Platinum: { bg: '#EDE9FE', text: '#6D28D9', border: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
  Fantastic: { bg: '#EDE9FE', text: '#6D28D9', border: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
  Gold: { bg: '#FEF3C7', text: '#B45309', border: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
  Great: { bg: '#FEF3C7', text: '#B45309', border: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
  Silver: { bg: '#F1F5F9', text: '#475569', border: '#94A3B8', gradient: 'linear-gradient(135deg, #94A3B8, #64748B)' },
  Fair: { bg: '#FFEDD5', text: '#C2410C', border: '#F97316', gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
  Bronze: { bg: '#FFEDD5', text: '#C2410C', border: '#F97316', gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
  Poor: { bg: '#FEE2E2', text: '#B91C1C', border: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444, #DC2626)' },
  'N/A': { bg: '#F3F4F6', text: '#6B7280', border: '#9CA3AF', gradient: 'linear-gradient(135deg, #9CA3AF, #6B7280)' },
};

// Vibrant themes for modal
export const MODAL_THEMES = {
  cream: {
    name: "Vibrant",
    bg: '#F8FAFC',
    card: '#FFFFFF',
    subtle: '#F1F5F9',
    text: '#1E293B',
    muted: '#64748B',
    border: '#E2E8F0',
    accent: '#6366F1',
    gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  },
};

export const SEVERITY_COLORS = {
  fantastic: { bg: '#EEF2FF', text: '#4338CA', dot: '#6366F1', glow: 'rgba(99, 102, 241, 0.3)' },
  great: { bg: '#ECFDF5', text: '#047857', dot: '#10B981', glow: 'rgba(16, 185, 129, 0.3)' },
  fair: { bg: '#FFF7ED', text: '#C2410C', dot: '#F97316', glow: 'rgba(249, 115, 22, 0.3)' },
  poor: {
    bg: '#FEE2E2',
    text: '#991B1B',
    dot: '#DC2626',
    glow: 'rgba(220, 38, 38, 0.4)',
    gradient: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
    darkBg: '#7F1D1D',
    darkGradient: 'linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)'
  }
};

// Severity labels for display (user-friendly terms)
export const SEVERITY_LABELS = {
  poor: 'Severe',
  fair: 'Concerning',
  great: 'Good',
  fantastic: 'Optimal'
};

// KEY METRICS to display - Current Week (comprehensive view)
export const KEY_METRICS = {
  safety: [
    { key: 'tier', label: 'On-Road Safety Score', type: 'tier' },
    { key: 'ficoScore', label: 'FICO Score', format: 'outOf850' },
    { key: 'ppsComplianceRate', label: 'Proper-Park-Sequence Compliance', format: 'percent' },
    { key: 'pawPrintComplianceRate', label: 'Paw Print Contact Compliance', format: 'fraction', total: 'pawPrintTotal', sent: 'pawPrintSent' },
  ],
  safetyEvents: [
    { key: 'distractionsRate', label: 'Distractions' },
    { key: 'speedingEventRate', label: 'Speeding' },
    { key: 'seatbeltOffRate', label: 'Seatbelt Off' },
    { key: 'followingDistanceRate', label: 'Follow Distance' },
    { key: 'signalViolationsRate', label: 'Sign/Signal Violations' },
  ],
  ppsBreakdown: [
    { key: 'ppsDidNotApplyParkingBrake', label: 'Did Not Apply Parking Brake', format: 'ppsBreakdown', stopsKey: 'missingParkingBrakeStops', totalKey: 'ppsTotalEvaluatedStops' },
    { key: 'ppsDidNotShiftGearToPark', label: 'Did Not Shift Gear to Park', format: 'ppsBreakdown', stopsKey: 'missingGearInParkStops', totalKey: 'ppsTotalEvaluatedStops' },
  ],
  // Trailing view - Overall section (most important metrics first)
  overallTrailing: [
    { key: 'overallScore', label: 'Overall Performance Score' },
    { key: 'overallStanding', label: 'Overall Standing', type: 'tier' },
    { key: 'packagesDelivered', label: 'Total Packages Delivered' },
  ],
  // Trailing view - Safety section
  safetyTrailing: [
    { key: 'ficoScore', label: 'FICO Score', format: 'outOf850' },
    { key: 'speedingEventRate', label: 'Speeding Events' },
    { key: 'seatbeltOffRate', label: 'Seatbelt Off Events' },
    { key: 'distractionsRate', label: 'Distraction Events' },
    { key: 'signalViolationsRate', label: 'Sign/Signal Violations' },
    { key: 'followingDistanceRate', label: 'Following Distance Events' },
  ],
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
  deliveryTrailing: [
    { key: 'dcr', label: 'Delivery Completion Rate', format: 'percent' },
    { key: 'dcrTier', label: 'DCR Tier', type: 'tier' },
    { key: 'pod', label: 'Photo-On-Delivery', format: 'percent' },
    { key: 'podTier', label: 'POD Tier', type: 'tier' },
    { key: 'podScore', label: 'POD Score' },
    { key: 'dsb', label: 'Delivery Success Behaviors' },
    { key: 'dsbDpmoTier', label: 'DSB Tier', type: 'tier' },
    { key: 'dsbDpmoScore', label: 'DSB Score' },
    { key: 'psb', label: 'Pickup Success Behaviors' },
    { key: 'psbTier', label: 'PSB Tier', type: 'tier' },
    { key: 'psbScore', label: 'PSB Score' },
    { key: 'packagesDelivered', label: 'Packages Delivered' },
  ],
  customer: [
    { key: 'feedbackTier', label: 'Overall Feedback Score', type: 'tier', fallback: 'tier' },
    { key: 'cdfDpmo', label: 'Negative Feedback Rate (CDF DPMO)' },
    { key: 'deliveriesWithNegativeFeedback', label: 'Deliveries w/ Negative Feedback', format: 'fraction' },
    { key: 'customerEscalationDefect', label: 'Escalation Defects' },
  ],
  // Customer feedback breakdown categories (from negative feedback CSV)
  customerFeedbackCategories: [
    { key: 'mishandledPackage', label: 'Mishandled Package' },
    { key: 'unprofessional', label: 'Unprofessional' },
    { key: 'didNotFollowInstructions', label: 'Did Not Follow Instructions' },
    { key: 'deliveredToWrongAddress', label: 'Delivered to Wrong Address' },
    { key: 'neverReceived', label: 'Never Received Delivery' },
    { key: 'receivedWrongItem', label: 'Received Wrong Item' },
  ],
  customerTrailing: [
    { key: 'cdfDpmo', label: 'Negative Feedback Rate (CDF DPMO)' },
    { key: 'cdfDpmoTier', label: 'CDF Tier', type: 'tier' },
    { key: 'cdfDpmoScore', label: 'CDF Score' },
    { key: 'cedScore', label: 'Customer Escalation Score' },
  ],
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
  standingTrailing: [
    { key: 'overallStanding', label: 'Overall Standing', type: 'tier' },
    { key: 'tier', label: 'Performance Tier', type: 'tier' },
  ],
  standing: ['overallStanding', 'tier']
};

// Metric explanations database (based on Amazon DSP scorecard documentation)
export const METRIC_EXPLANATIONS = {
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
  ppsDidNotApplyParkingBrake: {
    title: "Did Not Apply Parking Brake",
    desc: "Number of stops where the parking brake was not applied. The parking brake must always be engaged FIRST before shifting to Park.",
    calc: "Missing Parking Brake Stops ÷ Total Evaluated Stops. Target: 0",
    tips: ["Always engage parking brake before shifting to Park", "Make it a habit at every stop", "Check brake is fully engaged"]
  },
  ppsDidNotShiftGearToPark: {
    title: "Did Not Shift Gear to Park",
    desc: "Number of stops where the gear was not shifted to Park. After applying the parking brake, always shift the gear to Park before exiting.",
    calc: "Missing Gear in Park Stops ÷ Total Evaluated Stops. Target: 0",
    tips: ["Always shift to Park after applying parking brake", "Never exit vehicle without gear in Park", "Follow the sequence: Brake → Park → Exit"]
  },
  pawPrintComplianceRate: {
    title: "Paw Print Contact Compliance",
    desc: "Before leaving your vehicle, always review the stop notes in the Delivery App. If you see the Paw Print alert or any customer note mentioning a dog, treat the location as a potential pet risk. When the Paw Print alert is present, send the customer a quick message to let them know you're arriving—this also prompts them to secure any pets. Use this step every time the Paw Print alert appears.",
    calc: "Texts sent ÷ Stops with Paw Prints. Target: 100%",
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
    calc: "Count of rushed inspections. Target: 90",
    tips: ["Take at least 90 seconds for standard vehicles", "Take at least 5 minutes for Step Vans", "Follow DVIC checklist thoroughly"]
  },
  qualityTier: {
    title: "Overall Quality Score",
    desc: "Quality tier based on Completion Rate, POD Acceptance, and Delivery Success Behaviors combined.",
    calc: "Composite of DCR, POD, and DSB scores. Target: Platinum/Fantastic",
    tips: ["Complete all deliveries", "Take quality POD photos", "Follow delivery best practices"]
  },
  // Customer Feedback Categories
  mishandledPackage: {
    title: "Mishandled Package",
    desc: "Customer reported that the driver mishandled their package during delivery. This could include throwing, dropping, or otherwise damaging the package.",
    calc: "Count of customer reports for this category. Target: 0",
    tips: ["Handle all packages with care", "Never throw packages", "Place packages gently at delivery location"]
  },
  unprofessional: {
    title: "Unprofessional Behavior",
    desc: "Customer reported unprofessional behavior from the driver. This could include rudeness, inappropriate conduct, or unsafe driving observed by customer.",
    calc: "Count of customer reports for this category. Target: 0",
    tips: ["Always be courteous and professional", "Dress appropriately", "Follow all traffic laws even when in customer view"]
  },
  didNotFollowInstructions: {
    title: "Did Not Follow Instructions",
    desc: "Customer reported that delivery instructions were not followed. This includes ignoring notes about where to leave packages or how to deliver.",
    calc: "Count of customer reports for this category. Target: 0",
    tips: ["Always read customer notes before delivery", "Follow all special instructions", "If instructions are unclear, contact support"]
  },
  deliveredToWrongAddress: {
    title: "Delivered to Wrong Address",
    desc: "Customer reported their package was delivered to an incorrect address, such as a neighboring house, wrong unit number, or different street.",
    calc: "Count of customer reports for this category. Target: 0",
    tips: ["Verify address before leaving package", "Check unit numbers carefully", "Use GPS to confirm location"]
  },
  neverReceived: {
    title: "Never Received Delivery",
    desc: "Customer reported they never received the package that was marked as delivered. The package may not be in the location shown in delivery photo.",
    calc: "Count of customer reports for this category. Target: 0",
    tips: ["Take clear POD photos showing exact location", "Place packages in secure, visible spots", "Avoid leaving packages in bad weather"]
  },
  receivedWrongItem: {
    title: "Received Wrong Item",
    desc: "Customer reported receiving someone else's package. This occurs when packages are mixed up or delivered to the wrong customer.",
    calc: "Count of customer reports for this category. Target: 0",
    tips: ["Double-check tracking ID before delivery", "Don't deliver multiple customers' packages at once", "Verify package matches delivery address"]
  }
};

// Metric display names
export const METRIC_DISPLAY_NAMES = {
  // Overall metrics
  overallScore: 'Overall Performance Score',
  overallStanding: 'Overall Standing',

  // FICO / Safety
  ficoScore: 'FICO Safety Score',
  ficoMetric: 'FICO Metric',
  ficoTier: 'FICO Tier',
  seatbeltOffRate: 'Seatbelt Off Events',
  seatbeltOffRateTier: 'Seatbelt Off Tier',
  seatbeltOffRateScore: 'Seatbelt Off Score',
  speedingEventRate: 'Speeding Events',
  speedingEventRateTier: 'Speeding Tier',
  speedingEventRateScore: 'Speeding Score',
  distractionsRate: 'Distraction Events',
  distractionsRateTier: 'Distractions Tier',
  distractionsRateScore: 'Distractions Score',
  followingDistanceRate: 'Follow Distance Events',
  followingDistanceRateTier: 'Following Distance Tier',
  followingDistanceRateScore: 'Following Distance Score',
  signalViolationsRate: 'Sign/Signal Violations',
  signalViolationsRateTier: 'Sign/Signal Violations Tier',
  signalViolationsRateScore: 'Sign/Signal Violations Score',
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
  dcrTier: 'DCR Tier',
  pod: 'Photo-On-Delivery Acceptance',
  podTier: 'POD Tier',
  podScore: 'POD Score',
  dsb: 'Delivery Success Behaviors',
  dsbDpmo: 'DSB DPMO',
  dsbDpmoTier: 'DSB Tier',
  dsbDpmoScore: 'DSB Score',
  psb: 'Pickup Success Behaviors',
  psbTier: 'PSB Tier',
  psbScore: 'PSB Score',
  cdfDpmo: 'Negative Feedback Rate (CDF DPMO)',
  cdfDpmoTier: 'CDF Tier',
  cdfDpmoScore: 'CDF Score',
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
  ppsDidNotApplyParkingBrake: 'Did Not Apply Parking Brake',
  ppsDidNotShiftGearToPark: 'Did Not Shift Gear to Park',
  pawPrintComplianceRate: 'Paw Print Notification Rate',
  tier: 'Performance Tier',
};

// Reverse key map for fallbacks
export const REVERSE_KEY_MAP = {
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

// Minimum packages for ranking (0 = rank all drivers)
export const MIN_PACKAGES_FOR_RANKING = 0;

// Tier order for sorting
export const TIER_ORDER = { Platinum: 0, Gold: 1, Silver: 2, Bronze: 3, Poor: 4, 'N/A': 5 };

// Safety event metrics that should display as "events per 100 trips" NOT percentages
export const SAFETY_EVENT_METRICS = [
  'seatbeltoffrate',
  'speedingeventrate',
  'distractionsrate',
  'followingdistancerate',
  'signalviolationsrate'
];

// Quality group classification
export const getQualityGroup = (driver) => {
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
export const calculateDriverRanks = (drivers) => {
  if (!drivers || drivers.length === 0) return { rankMap: {}, rankedCount: 0 };

  const sorted = [...drivers].sort((a, b) => {
    const tierA = TIER_ORDER[a.overallStanding || a.tier] ?? 5;
    const tierB = TIER_ORDER[b.overallStanding || b.tier] ?? 5;
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

    // DVIC - fewer rushed inspections is better
    const dvicA = parseInt(a.rushedInspections || a.dvicRushed) || 0;
    const dvicB = parseInt(b.rushedInspections || b.dvicRushed) || 0;
    if (dvicA !== dvicB) return dvicA - dvicB;

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

  return { rankMap, rankedCount };
};

// Parse historical/trailing data from driver object
export const parseHistoricalData = (driver) => {
  const weeks = [];

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

  Object.values(weekMetrics).forEach(weekData => {
    const existingWeek = weeks.find(w => w.week === weekData.week);
    if (!existingWeek) {
      weeks.push(weekData);
    }
  });

  weeks.sort((a, b) => a.week - b.week);

  return weeks;
};

// Get 6-week trailing averages from historical data
export const calculateTrailingAverages = (historicalWeeks) => {
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

// Customer feedback category keys (negative counts - any > 0 is bad)
const FEEDBACK_CATEGORY_KEYS = [
  'mishandledpackage',
  'unprofessional',
  'didnotfollowinstructions',
  'deliveredtowrongaddress',
  'neverreceived',
  'receivedwrongitem',
];

// Get severity level
export const getSeverityLevel = (key, value) => {
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

  // Overall Score - main performance metric (0-100 scale)
  if (keyLower === 'overallscore') {
    if (numValue >= 90) return 'fantastic';
    if (numValue >= 80) return 'great';
    if (numValue >= 70) return 'fair';
    return 'poor';
  }

  // Customer feedback category counts - ANY negative feedback is severe
  if (FEEDBACK_CATEGORY_KEYS.includes(keyLower)) {
    if (numValue === 0) return 'fantastic';
    return 'poor'; // Any count > 0 is severe
  }

  // Safety event metrics - LOWER is better (0 is ideal)
  if (SAFETY_EVENT_METRICS.includes(keyLower)) {
    if (numValue === 0) return 'fantastic';
    if (numValue <= 1) return 'great';
    if (numValue <= 3) return 'fair';
    return 'poor';
  }

  // Score fields (typically 0-100)
  if (keyLower.includes('score') && !keyLower.includes('fico')) {
    if (numValue >= 90) return 'fantastic';
    if (numValue >= 75) return 'great';
    if (numValue >= 50) return 'fair';
    return 'poor';
  }

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

// Parse DVIC time "M:SS" format to seconds
export const parseDvicTimeToSeconds = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const parts = timeStr.trim().split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10);
    const secs = parseInt(parts[1], 10);
    if (!isNaN(mins) && !isNaN(secs)) return mins * 60 + secs;
  }
  return null;
};

// Get severity for DVIC inspection times
export const getDvicTimeSeverity = (timeValue) => {
  const seconds = typeof timeValue === 'number' ? timeValue : parseDvicTimeToSeconds(timeValue);
  if (seconds === null) return null;
  if (seconds < 20) return 'poor';
  if (seconds < 60) return 'fair';
  if (seconds < 90) return 'great';
  return 'fantastic';
};

// Format value
export const formatValue = (key, value) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);

  const strValue = String(value);

  // Don't reformat if already a fraction (e.g., "105/128")
  if (strValue.includes('/')) return strValue;

  const keyLower = key.toLowerCase();

  if (SAFETY_EVENT_METRICS.includes(keyLower)) {
    const num = parseFloat(value);
    if (!isNaN(num)) return `${num}`;
  }

  if (keyLower.includes('rate') || keyLower.includes('compliance') || keyLower.includes('percentage')) {
    const num = parseFloat(value);
    if (!isNaN(num) && !strValue.includes('%')) return `${num}%`;
  }
  return strValue;
};

// Format label
export const formatLabel = (key) => {
  if (METRIC_DISPLAY_NAMES[key]) return METRIC_DISPLAY_NAMES[key];
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Categorize driver metrics into sections
export const categorizeMetrics = (driver, useHistorical = false, historicalData = null) => {
  const overall = [];  // Overall performance metrics (for trailing view)
  const safety = [];
  const safetyEvents = [];
  const ppsBreakdown = [];
  const delivery = [];
  const podBreakdown = [];
  const customer = [];
  const customerFeedbackBreakdown = [];
  const dvic = [];
  const dvicTimes = [];
  const standing = [];

  const trailing = useHistorical && historicalData ? calculateTrailingAverages(historicalData) : null;
  const dataSource = trailing?.averages || driver;

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

  const addMetricFromDef = (arr, metricDef) => {
    if (typeof metricDef === 'string') {
      const value = getValue(metricDef);
      if (value !== null && value !== undefined && value !== '') {
        // Skip FICO score if value is 0
        if (metricDef.toLowerCase() === 'ficoscore' && (value === 0 || value === '0')) {
          return;
        }
        arr.push({ key: metricDef, value, label: METRIC_DISPLAY_NAMES[metricDef] || metricDef });
      }
    } else {
      // Skip FICO score if value is 0
      if (metricDef.key === 'ficoScore') {
        const rawValue = getValue(metricDef.key, metricDef.fallback);
        if (rawValue === 0 || rawValue === '0' || parseFloat(rawValue) === 0) {
          return;
        }
      }
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
    KEY_METRICS.overallTrailing.forEach(def => addMetricFromDef(overall, def));
    KEY_METRICS.safetyTrailing.forEach(def => addMetricFromDef(safety, def));
    KEY_METRICS.deliveryTrailing.forEach(def => addMetricFromDef(delivery, def));
    KEY_METRICS.customerTrailing.forEach(def => addMetricFromDef(customer, def));
    KEY_METRICS.standingTrailing.forEach(def => addMetricFromDef(standing, def));
  } else {
    KEY_METRICS.safety.forEach(def => addMetricFromDef(safety, def));
    KEY_METRICS.safetyEvents.forEach(def => addMetricFromDef(safetyEvents, def));

    // PPS Breakdown: show "stops / total" format
    KEY_METRICS.ppsBreakdown.forEach(def => {
      const stops = getValue(def.stopsKey);
      const total = getValue(def.totalKey);
      if (stops !== null && stops !== undefined && total !== null && total !== undefined) {
        ppsBreakdown.push({
          key: def.key,
          value: `${stops}/${total}`,
          label: def.label
        });
      }
    });

    KEY_METRICS.delivery.forEach(def => addMetricFromDef(delivery, def));
    KEY_METRICS.podRejectsBreakdown.forEach(def => addMetricFromDef(podBreakdown, def));
    KEY_METRICS.customer.forEach(def => addMetricFromDef(customer, def));

    // Customer Feedback Breakdown: extract categories from flattened keys
    // Data comes as: feedbackCategories_deliveredToWrongAddress_count, feedbackCategories_deliveredToWrongAddress_items_0_trackingId, etc.
    KEY_METRICS.customerFeedbackCategories.forEach(def => {
      const countKey = `feedbackCategories_${def.key}_count`;
      const displayNameKey = `feedbackCategories_${def.key}_displayName`;
      const count = parseInt(driver[countKey]) || 0;

      if (count > 0) {
        // Reconstruct items array from flattened keys
        const items = [];
        for (let i = 0; i < count; i++) {
          const trackingIdKey = `feedbackCategories_${def.key}_items_${i}_trackingId`;
          const feedbackDetailsKey = `feedbackCategories_${def.key}_items_${i}_feedbackDetails`;
          const deliveryDateKey = `feedbackCategories_${def.key}_items_${i}_deliveryDate`;

          if (driver[trackingIdKey] !== undefined) {
            items.push({
              trackingId: driver[trackingIdKey] || '',
              feedbackDetails: driver[feedbackDetailsKey] || '',
              deliveryDate: driver[deliveryDateKey] || ''
            });
          }
        }

        customerFeedbackBreakdown.push({
          key: def.key,
          value: count,
          label: driver[displayNameKey] || def.label,
          items: items
        });
      }
    });

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
    overall,
    safety,
    safetyEvents,
    ppsBreakdown,
    delivery,
    podBreakdown,
    customer,
    customerFeedbackBreakdown,
    dvic,
    dvicTimes,
    standing,
    weekCount: trailing?.weekCount || 0,
    isTrailing: useHistorical
  };
};

// Format date range
export const formatDateRange = (weekStart, weekEnd) => {
  const start = new Date(weekStart);
  const end = new Date(weekEnd);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};

// Get driver display name
export const getDriverName = (driver) => {
  return driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ') || 'Unknown Driver';
};
