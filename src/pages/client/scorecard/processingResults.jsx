import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Download,
  Users,
  FileText,
  Clock,
  ChevronRight,
  ChevronDown,
  Eye,
  X,
  Shield,
  Package,
  Info,
  MessageCircle,
  Wrench,
  Trophy,
  Star,
} from 'lucide-react';


// ==========================================
// DiveMetric Enterprise Preview Modal
// Design #22 methodology with pastel themes
// ==========================================

// KEY METRICS to display - Current Week (comprehensive view)
const KEY_METRICS = {
  // Safety - Current Week (with sub-metrics)
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
  // Safety - Trailing metrics (6-Week)
  safetyTrailing: [
    { key: 'ficoScore', label: 'FICO Score', format: 'outOf850' },
    { key: 'speedingEventRate', label: 'Speeding Events' },
    { key: 'seatbeltOffRate', label: 'Seatbelt Off Events' },
    { key: 'distractionsRate', label: 'Distraction Events' },
    { key: 'signalViolationsRate', label: 'Sign/Signal Violations' },
    { key: 'followingDistanceRate', label: 'Following Distance Events' },
  ],
  // Overall - Trailing metrics (6-Week)
  overallTrailing: [
    { key: 'overallScore', label: 'Overall Performance Score' },
    { key: 'overallStanding', label: 'Overall Standing', type: 'tier' },
    { key: 'packagesDelivered', label: 'Total Packages Delivered' },
  ],
  // Delivery - Current Week
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
  // Delivery - Trailing metrics (6-Week)
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
  // Customer Feedback - Current Week
  customer: [
    { key: 'feedbackTier', label: 'Overall Feedback Score', type: 'tier', fallback: 'tier' },
    { key: 'cdfDpmo', label: 'Negative Feedback Rate (CDF DPMO)' },
    { key: 'deliveriesWithNegativeFeedback', label: 'Deliveries w/ Negative Feedback', format: 'fraction' },
    { key: 'customerEscalationDefect', label: 'Escalation Defects' },
  ],
  // Customer - Trailing metrics (6-Week)
  customerTrailing: [
    { key: 'cdfDpmo', label: 'Negative Feedback Rate (CDF DPMO)' },
    { key: 'cdfDpmoTier', label: 'CDF Tier', type: 'tier' },
    { key: 'cdfDpmoScore', label: 'CDF Score' },
    { key: 'cedScore', label: 'Customer Escalation Score' },
  ],
  // DVIC - Current Week
  dvic: [
    { key: 'rushedInspections', label: 'Rushed Inspections' },
    { key: 'dvicRushed', label: 'Rushed Inspections' },
  ],
  // DVIC Daily Inspection Times - keys from scorecard extraction
  dvicTimes: [
    { key: 'dvicTime1', labelKey: 'dvicDate1' },
    { key: 'dvicTime2', labelKey: 'dvicDate2' },
    { key: 'dvicTime3', labelKey: 'dvicDate3' },
    { key: 'dvicTime4', labelKey: 'dvicDate4' },
    { key: 'dvicTime5', labelKey: 'dvicDate5' },
    { key: 'dvicTime6', labelKey: 'dvicDate6' },
    { key: 'dvicTime7', labelKey: 'dvicDate7' },
  ],
  // Standing - Trailing (uses keys from historical data)
  standingTrailing: [
    { key: 'overallStanding', label: 'Overall Standing', type: 'tier' },
    { key: 'tier', label: 'Performance Tier', type: 'tier' },
  ],
  // Standing
  standing: [
    'overallStanding',
    'tier',
  ]
};


// Quality group classification for ranking
// Groups drivers based on DPMO, DCR, and POD performance thresholds
// Derived from Amazon's expected ranking patterns:
//   - DPMO=0 with DCR>=99.8 beats any DPMO>0
//   - Low DPMO (<=1000) with DCR=100 beats DPMO=0 with DCR<99.8
//   - Higher DPMO (>1000) loses to DPMO=0 even with lower DCR
//   - POD<99.7 is a major penalty regardless of other metrics
const getQualityGroup = (driver) => {
  const dpmo = parseFloat(driver.cdfDpmo) || 0;
  const dcr = parseFloat(driver.deliveryCompletionRate) || 0;
  const pod = parseFloat(driver.podAcceptanceRate) || 0;

  // Group 5: Major POD penalty - POD < 99.7 pushes driver down significantly
  // Example: Joshua (DCR=100, POD=99.6, DPMO=0) ranks last among Platinum
  if (pod < 99.7) return 5;

  // From here, POD >= 99.7

  // Group 0: Perfect - DPMO=0, DCR>=100, POD>=100
  // Example: Robert Hinkley (DCR=100, POD=100, DPMO=0) → Rank 1
  if (dpmo === 0 && dcr >= 100 && pod >= 100) return 0;

  // Group 1: Near-perfect - DPMO=0, DCR>=99.8 (with acceptable POD>=99.7)
  // Examples: Darius (99.9), Madison (99.9), Axel (99.9), Michael (99.8) → Ranks 2-5
  if (dpmo === 0 && dcr >= 99.8) return 1;

  // Group 2: Low DPMO (<=1000) with perfect DCR and POD - beats lower DCR with DPMO=0
  // Example: Logan (DCR=100, POD=100, DPMO=732) → Rank 6 (above Korey with DCR=99.7)
  if (dpmo > 0 && dpmo <= 1000 && dcr >= 100 && pod >= 100) return 2;

  // Group 3: DPMO=0 but lower DCR (< 99.8) - still beats higher DPMO
  // Example: Korey (DCR=99.7, POD=100, DPMO=0) → Rank 7
  if (dpmo === 0) return 3;

  // Group 4: Higher DPMO (> 1000) or DPMO with imperfect DCR/POD
  // Example: Lars (DCR=100, POD=100, DPMO=1285) → Rank 8
  return 4;
};

// Minimum packages required for ranking
const MIN_PACKAGES_FOR_RANKING = 500;

// Calculate ranks for all drivers (only those with 500+ packages)
// Ranking algorithm based on Amazon's expected driver rankings:
// 1. Tier (Platinum > Gold > Silver > Bronze > Poor)
// 2. Quality group (based on DPMO, DCR, POD combinations)
// 3. DPMO ascending (for drivers with DPMO > 0)
// 4. DCR descending (higher is better)
// 5. Packages descending (tiebreaker)
const calculateDriverRanks = (drivers) => {
  if (!drivers || drivers.length === 0) return { rankMap: {}, rankedCount: 0 };

  const tierOrder = { Platinum: 0, Gold: 1, Silver: 2, Bronze: 3, Poor: 4 };

  // Filter to only drivers with 500+ packages for ranking
  const eligible = drivers.filter(d =>
    (parseInt(d.packagesDelivered) || 0) >= MIN_PACKAGES_FOR_RANKING
  );

  // Sort eligible drivers using multi-key comparison
  const sorted = [...eligible].sort((a, b) => {
    // 1. Sort by tier (Platinum first)
    const tierA = tierOrder[a.overallStanding || a.tier] ?? 5;
    const tierB = tierOrder[b.overallStanding || b.tier] ?? 5;
    if (tierA !== tierB) return tierA - tierB;

    // 2. Sort by quality group
    const groupA = getQualityGroup(a);
    const groupB = getQualityGroup(b);
    if (groupA !== groupB) return groupA - groupB;

    // 3. For drivers with DPMO > 0 (groups 2 and 4), sort by DPMO ascending
    const dpmoA = parseFloat(a.cdfDpmo) || 0;
    const dpmoB = parseFloat(b.cdfDpmo) || 0;
    if ((groupA === 2 || groupA === 4) && dpmoA !== dpmoB) {
      return dpmoA - dpmoB;
    }

    // 4. Sort by DCR descending (higher is better)
    const dcrA = parseFloat(a.deliveryCompletionRate) || 0;
    const dcrB = parseFloat(b.deliveryCompletionRate) || 0;
    if (dcrA !== dcrB) return dcrB - dcrA;

    // 5. Sort by packages descending (tiebreaker)
    const pkgsA = parseInt(a.packagesDelivered) || 0;
    const pkgsB = parseInt(b.packagesDelivered) || 0;
    return pkgsB - pkgsA;
  });

  // Build rank map with position-based scores
  const rankMap = {};
  const rankedCount = sorted.length;

  // Assign ranks to eligible drivers
  sorted.forEach((driver, index) => {
    const rank = index + 1;
    // Score is calculated as inverse of rank position (higher rank = higher score)
    const score = rankedCount > 1
      ? 100 - ((rank - 1) / (rankedCount - 1) * 100)
      : 100;

    rankMap[driver.transporterId] = {
      rank,
      score: Math.round(score * 100) / 100,
      eligible: true
    };
  });

  // Add unranked drivers (< 500 packages) with no rank
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

// Metric explanations database
const METRIC_EXPLANATIONS = {
  // Safety Metrics
  ficoScore: {
    title: "FICO Safety Score",
    desc: "Standardized driving behavior score from 0-850 measuring risk level based on telematics data. Higher is better.",
    calc: "Factors: Hard braking (25%), Acceleration (20%), Cornering (20%), Speed (20%), Phone use (15%). Target: 800+",
    tips: ["Brake smoothly and early", "Accelerate gradually", "Take corners at safe speeds"]
  },
  seatbeltOffRate: {
    title: "Seatbelt Compliance",
    desc: "Percentage of time seatbelt was properly worn while driving. 100% means perfect compliance with no violations.",
    calc: "100 - (Unbuckled Events ÷ Driving Time × 100). Target: 100%",
    tips: ["Always buckle before starting", "Keep fastened between stops", "Make it automatic habit"]
  },
  speedingEventRate: {
    title: "Speeding Events (per 100 Trips)",
    desc: "Sum of all speeding events divided by total trips. A speeding instance is going 10+ MPH over the posted speed limit for roughly one city block.",
    calc: "(Total speeding events ÷ Total trips) × 100. Target: 0 events",
    tips: ["Stay within posted speed limits for your safety and others", "Watch for speed limit changes", "Slow down in residential and school zones"]
  },
  distractionsRate: {
    title: "Distractions Rate",
    desc: "Number of phone usage or distraction events per 100 deliveries. Lower is better - 0 is perfect.",
    calc: "Distraction Events ÷ (Deliveries ÷ 100). Target: 0",
    tips: ["Use Do Not Disturb mode", "Pull over if needed", "Set navigation before driving"]
  },
  followingDistanceRate: {
    title: "Following Distance Compliance",
    desc: "Percentage indicating safe following distance maintained. 100% means no tailgating events.",
    calc: "100 - (Tailgating Events ÷ Total Trips × 100). Target: 100%",
    tips: ["Maintain 3-4 second gap", "Increase distance in bad weather", "Watch for sudden stops ahead"]
  },
  signalViolationsRate: {
    title: "Signal Violations Rate",
    desc: "Number of stop sign or traffic light violations. 0 means perfect compliance.",
    calc: "Signal Violation Events ÷ Trips. Target: 0",
    tips: ["Complete stops at all signs", "Don't rush yellow lights", "Watch for pedestrians"]
  },
  onRoadSafetyScore: {
    title: "On-Road Safety Score",
    desc: "Overall driving safety assessment combining FICO, speeding, seatbelt, and following distance metrics.",
    calc: "Weighted average: FICO (40%), Events (35%), Compliance (25%). Platinum ≥ 95%, Gold ≥ 85%, Silver ≥ 75%.",
    tips: ["Maintain safe following distance", "Always wear seatbelt", "Follow speed limits"]
  },
  safetyTier: {
    title: "Safety Tier",
    desc: "Your overall safety performance tier based on all safety-related metrics.",
    calc: "Determined by combination of FICO score, driving events, and compliance metrics.",
    tips: ["Focus on consistent safe driving habits", "Avoid distractions while driving"]
  },
  ppsCompliance: {
    title: "Proper Park Sequence",
    desc: "Compliance rate for Amazon's parking protocol: engage parking brake, shift to park, then exit.",
    calc: "(Compliant Stops ÷ Total Stops) × 100. Target: 95%+",
    tips: ["Always set parking brake first", "Shift to park before exiting", "Make it muscle memory"]
  },
  pawPrintCompliance: {
    title: "Paw Print Compliance",
    desc: "Rate of sending 'On my way' notifications to customers when approaching delivery location.",
    calc: "(Notifications Sent ÷ Required) × 100. Target: 90%+",
    tips: ["Send when approaching", "Helps customers prepare", "Reduces missed deliveries"]
  },
  distractions: {
    title: "Distractions Rate",
    desc: "Phone usage or other distraction events detected per 100 deliveries.",
    calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.5",
    tips: ["Use Do Not Disturb mode", "Pull over if needed", "Set navigation before driving"]
  },
  speeding: {
    title: "Speeding Events",
    desc: "Instances of exceeding posted speed limits per 100 deliveries.",
    calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.5",
    tips: ["Watch for speed limit changes", "Slow in residential areas", "Leave extra time"]
  },
  seatbeltCompliance: {
    title: "Seatbelt Compliance",
    desc: "Events where seatbelt was unfastened while vehicle moving, per 100 deliveries.",
    calc: "Events ÷ (Deliveries ÷ 100). Target: 0",
    tips: ["Buckle before starting", "Keep fastened between stops"]
  },
  followingDistance: {
    title: "Following Distance",
    desc: "Tailgating events where you followed too closely, per 100 deliveries.",
    calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.3",
    tips: ["Maintain 3-4 second gap", "Increase distance in bad weather"]
  },
  signalViolations: {
    title: "Signal Violations",
    desc: "Stop sign or traffic light violations per 100 deliveries.",
    calc: "Events ÷ (Deliveries ÷ 100). Target: 0",
    tips: ["Complete stops always", "Don't rush yellow lights"]
  },
  // Delivery Metrics
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
  dnr: {
    title: "Delivered Not Received",
    desc: "Packages marked delivered but customer claims not received.",
    calc: "Count of DNR claims. Target: 0",
    tips: ["Clear POD photos", "Safe locations only", "Follow instructions exactly"]
  },
  deliverySuccessBehaviors: {
    title: "Delivery Success Behaviors (DSB)",
    desc: "Score for following Amazon's recommended delivery practices.",
    calc: "Points for: reading notes, safe locations, proper handling.",
    tips: ["Read all customer notes", "Choose safe spots", "Ring doorbell when appropriate"]
  },
  pickupSuccessBehaviors: {
    title: "Pickup Success Behaviors (PSB)",
    desc: "Score for pickup and return best practices at station.",
    calc: "Points for: accurate scanning, proper handling, following procedures.",
    tips: ["Scan accurately", "Handle packages carefully", "Follow load sequence"]
  },
  qualityTier: {
    title: "Delivery Quality Tier",
    desc: "Overall quality tier based on completion, POD, and success behaviors.",
    calc: "Weighted: DCR (40%), POD (30%), DSB (30%). Platinum ≥ 98%.",
    tips: ["Complete all deliveries", "Clear POD photos", "Follow instructions"]
  },
  // Customer Feedback Metrics
  customerFeedbackScore: {
    title: "Customer Feedback Score",
    desc: "Tier based on customer complaints and feedback rate.",
    calc: "Based on CDF DPMO. Lower complaints = higher tier.",
    tips: ["Be courteous", "Follow delivery instructions", "Handle packages with care"]
  },
  cdfDpmo: {
    title: "CDF DPMO",
    desc: "Customer Delivery Feedback - Defects Per Million Opportunities. Standardized negative feedback rate.",
    calc: "(Negative Count ÷ Deliveries) × 1,000,000. Target: < 1,500",
    tips: ["Follow all instructions", "Secure placement", "Professional manner"]
  },
  escalations: {
    title: "Escalation Defects",
    desc: "Issues requiring management escalation or formal complaints.",
    calc: "Count of escalated issues. Target: 0",
    tips: ["Resolve issues proactively", "Communicate clearly", "Call support early"]
  },
  customerEscalationDefect: {
    title: "Customer Escalation Defects",
    desc: "Number of customer issues that required escalation to management or formal complaints filed.",
    calc: "Count of escalated customer issues. Target: 0",
    tips: ["Follow delivery instructions exactly", "Handle packages with care", "Be professional and courteous"]
  },
  // Compliance Metrics
  ppsComplianceRate: {
    title: "Proper Park Sequence (PPS)",
    desc: "Compliance rate for Amazon's parking protocol: engage parking brake, shift to park, then exit vehicle.",
    calc: "(Compliant Stops ÷ Total Stops) × 100. Target: 95%+",
    tips: ["Always set parking brake first", "Shift to park before exiting", "Make it muscle memory"]
  },
  dvicComplianceRate: {
    title: "DVIC Compliance Rate",
    desc: "Daily Vehicle Inspection Checklist completion rate. Measures if pre-trip inspections are done properly.",
    calc: "(On-time Inspections ÷ Total Required) × 100. Target: 100%",
    tips: ["Complete inspection before starting", "Check all items thoroughly", "Report issues immediately"]
  },
  pawPrintComplianceRate: {
    title: "Paw Print Compliance",
    desc: "Rate of sending 'On my way' notifications to customers when approaching delivery location.",
    calc: "(Notifications Sent ÷ Total Required) × 100. Target: 90%+",
    tips: ["Send when approaching", "Helps customers prepare", "Reduces missed deliveries"]
  },
  dvicCompliance: {
    title: "DVIC Compliance",
    desc: "Daily Vehicle Inspection Checklist completion rate and quality.",
    calc: "Inspections completed properly ÷ Total required. Target: 100%",
    tips: ["Take full time for inspections", "Check all items", "Report issues immediately"]
  },
  rushedInspections: {
    title: "Rushed Inspections",
    desc: "Vehicle inspections completed in under 2 minutes, flagged as potentially insufficient. Shows rushed count out of total inspections.",
    calc: "Rushed Count / Total Inspections. Target: 0 rushed",
    tips: ["Allocate at least 2-3 minutes for inspection", "Check all items thoroughly", "Safety comes before speed"]
  },
  dvicTime1: {
    title: "Daily Inspection Time",
    desc: "Time taken for the vehicle inspection on this day.",
    calc: "Duration of inspection in minutes:seconds.",
    tips: ["Consistent inspection times show thoroughness", "Rushed inspections may miss safety issues"]
  },
  // General Metrics
  packagesDelivered: {
    title: "Packages Delivered",
    desc: "Total number of packages successfully delivered during the period.",
    calc: "Sum of all completed deliveries.",
    tips: ["Efficiency comes with experience", "Plan your route", "Stay organized"]
  },
  overallStanding: {
    title: "Overall Standing",
    desc: "Your comprehensive performance tier combining all metric categories.",
    calc: "Weighted combination of Safety, Delivery, and Customer metrics.",
    tips: ["Balance all performance areas", "Focus on weak areas", "Maintain consistency"]
  },
  tier: {
    title: "Performance Tier",
    desc: "Your current tier status based on overall performance.",
    calc: "Platinum > Gold > Silver > Bronze based on metric thresholds.",
    tips: ["Aim for consistent performance", "Review weekly metrics", "Set improvement goals"]
  },
  rank: {
    title: "Driver Rank",
    desc: "Your ranking among all drivers in the DSP.",
    calc: "Compared against all active drivers based on overall score.",
    tips: ["Learn from top performers", "Focus on improvement", "Celebrate progress"]
  },
  // Trailing-specific metrics
  overallScore: {
    title: "Overall Score",
    desc: "Composite performance score combining all metric categories over the trailing 6-week period.",
    calc: "Weighted combination: Safety (40%), Delivery (35%), Customer (25%). Scale: 0-100.",
    tips: ["Focus on lowest scoring areas", "Maintain consistency week over week", "Review weekly trends"]
  },
  cedScore: {
    title: "Customer Escalation Defect Score",
    desc: "Score based on customer escalations and formal complaints over the 6-week period.",
    calc: "100 - (Escalations × penalty factor). Higher is better.",
    tips: ["Resolve issues before escalation", "Follow all delivery instructions", "Communicate professionally"]
  },
  psb: {
    title: "Pickup Success Behaviors (PSB)",
    desc: "Score measuring adherence to pickup and return best practices at the station.",
    calc: "Based on: accurate scanning, proper handling, following load-out procedures.",
    tips: ["Scan all packages accurately", "Handle packages carefully", "Follow station procedures"]
  },
  dcr: {
    title: "Delivery Completion Rate",
    desc: "Percentage of packages successfully delivered vs total attempted over 6 weeks.",
    calc: "(Delivered ÷ Attempted) × 100. Target: 98%+",
    tips: ["Attempt all packages", "Use customer notes", "Contact support when needed"]
  },
  pod: {
    title: "Photo-On-Delivery Rate",
    desc: "Percentage of delivery photos accepted by the quality system over 6 weeks.",
    calc: "(Accepted Photos ÷ Opportunities) × 100. Target: 98%+",
    tips: ["Step back 3-4 feet", "Ensure good lighting", "Package clearly visible"]
  },
  dsb: {
    title: "Delivery Success Behaviors",
    desc: "Score for following Amazon's recommended delivery practices over 6 weeks.",
    calc: "Points earned for: reading notes, safe locations, proper handling.",
    tips: ["Read all customer notes", "Choose safe delivery spots", "Ring doorbell when appropriate"]
  },
  cdf: {
    title: "Customer Delivery Feedback",
    desc: "Customer feedback score over the 6-week trailing period. Measures customer satisfaction with deliveries.",
    calc: "Based on customer ratings and feedback submissions. Higher is better.",
    tips: ["Follow delivery instructions", "Handle packages carefully", "Be professional and courteous"]
  },
  pawPrintContactCompliance: {
    title: "Paw Print Contact Compliance",
    desc: "Rate of sending customer notifications when approaching delivery location over 6 weeks.",
    calc: "Notifications Sent ÷ Total Required. Shows as sent/total.",
    tips: ["Send notification when approaching", "Helps customers prepare for delivery"]
  },
  overallQualityScore: {
    title: "Overall Quality Score",
    desc: "Delivery quality tier based on completion rate, photo acceptance, and success behaviors over 6 weeks.",
    calc: "Weighted: DCR (40%), POD (30%), DSB (30%). Platinum ≥ 98%.",
    tips: ["Complete all deliveries", "Take clear delivery photos", "Follow customer instructions"]
  },
  completionRate: {
    title: "Completion Rate",
    desc: "Percentage of packages successfully delivered vs total attempted over 6-week trailing period.",
    calc: "(Delivered ÷ Attempted) × 100. Target: 98%+",
    tips: ["Attempt all packages", "Use customer notes", "Contact support when needed"]
  },
  photoOnDeliveryAcceptance: {
    title: "Photo-On-Delivery Acceptance",
    desc: "Percentage of delivery photos accepted by the quality system over 6 weeks.",
    calc: "(Accepted Photos ÷ Opportunities) × 100. Target: 98%+",
    tips: ["Step back 3-4 feet", "Ensure good lighting", "Package clearly visible"]
  },
  overallFeedbackScore: {
    title: "Overall Feedback Score",
    desc: "Customer feedback tier based on complaints and satisfaction over the 6-week trailing period.",
    calc: "Based on CDF DPMO. Lower complaints = higher tier.",
    tips: ["Follow all delivery instructions", "Handle packages with care", "Be professional"]
  },
  negativeFeedbackRate: {
    title: "Negative Feedback Rate (CDF DPMO)",
    desc: "Customer complaints measured as Defects Per Million Opportunities over 6 weeks.",
    calc: "(Negative Feedback ÷ Deliveries) × 1,000,000. Target: < 1,500",
    tips: ["Secure package placement", "Follow special instructions", "Maintain professionalism"]
  }
};

// Pastel themes for the modal
const MODAL_THEMES = {
  cream: { name: "Cream", bg: '#FFFDF7', card: '#FFFFFF', subtle: '#FAF8F5', text: '#5C5470', muted: '#9E9AA7', border: '#EBE8E2', accent: '#B8A99A' },
  sage: { name: "Sage", bg: '#F7FAF7', card: '#FFFFFF', subtle: '#EFF5EF', text: '#4A5D4A', muted: '#8B9E8B', border: '#DCE6DC', accent: '#7D9B7D' },
  lavender: { name: "Lavender", bg: '#FAF8FC', card: '#FFFFFF', subtle: '#F3EFF8', text: '#5D5470', muted: '#9A94A7', border: '#E6E0ED', accent: '#A594C0' },
  rose: { name: "Rose", bg: '#FDF8F8', card: '#FFFFFF', subtle: '#FAF0F0', text: '#705454', muted: '#A79494', border: '#EDE4E4', accent: '#C9A5A5' },
  sky: { name: "Sky", bg: '#F7FAFC', card: '#FFFFFF', subtle: '#EEF4F8', text: '#4A5568', muted: '#8B96A3', border: '#DCE4EB', accent: '#7DA3C0' }
};

// Pastel severity colors
const SEVERITY_COLORS = {
  fantastic: { bg: '#F3EFF8', text: '#7C6A99', dot: '#A594C0' },
  great: { bg: '#EFF5EF', text: '#5A7A5A', dot: '#7D9B7D' },
  fair: { bg: '#FFF5EB', text: '#9A7355', dot: '#D4A574' },
  poor: { bg: '#FCF0F0', text: '#996666', dot: '#C99191' }
};

// Severity labels for display (user-friendly terms)
const SEVERITY_LABELS = {
  poor: 'Severe',
  fair: 'Concerning',
  great: 'Good',
  fantastic: 'Optimal'
};

// Get severity level based on metric key and value
const getSeverityLevel = (key, value) => {
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(numValue)) {
    // For tier strings
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

  // FICO Score
  if (keyLower.includes('fico')) {
    if (numValue >= 800) return 'fantastic';
    if (numValue >= 700) return 'great';
    if (numValue >= 600) return 'fair';
    return 'poor';
  }

  // Rate/percentage metrics (higher is better)
  if (keyLower.includes('rate') || keyLower.includes('compliance') || keyLower.includes('acceptance')) {
    if (numValue >= 98) return 'fantastic';
    if (numValue >= 95) return 'great';
    if (numValue >= 90) return 'fair';
    return 'poor';
  }

  // Event metrics (lower is better)
  if (keyLower.includes('distraction') || keyLower.includes('speeding') || keyLower.includes('violation') || keyLower.includes('following')) {
    if (numValue <= 0.1) return 'fantastic';
    if (numValue <= 0.3) return 'great';
    if (numValue <= 0.5) return 'fair';
    return 'poor';
  }

  // DNR, Escalations (lower is better)
  if (keyLower.includes('dnr') || keyLower.includes('escalation') || keyLower.includes('rushed')) {
    if (numValue === 0) return 'fantastic';
    if (numValue <= 1) return 'great';
    if (numValue <= 3) return 'fair';
    return 'poor';
  }

  // DPMO (lower is better)
  if (keyLower.includes('dpmo')) {
    if (numValue <= 1000) return 'fantastic';
    if (numValue <= 1500) return 'great';
    if (numValue <= 2500) return 'fair';
    return 'poor';
  }

  return null;
};

// Parse DVIC time "M:SS" format to seconds
const parseDvicTimeToSeconds = (timeStr) => {
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
// 0-20s = poor (Severe), 20-60s = fair (Concerning), 60-90s = great (Good), 90s+ = fantastic (Optimal)
const getDvicTimeSeverity = (timeValue) => {
  const seconds = typeof timeValue === 'number' ? timeValue : parseDvicTimeToSeconds(timeValue);
  if (seconds === null) return null;
  if (seconds < 20) return 'poor';       // Severe
  if (seconds < 60) return 'fair';       // Concerning
  if (seconds < 90) return 'great';      // Good
  return 'fantastic';                     // Optimal
};

// Parse historical/trailing data from driver object
const parseHistoricalData = (driver) => {
  const weeks = [];

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

  // Try flattened format: historicalData_week0_dcr, historicalData_week1_dcr, etc.
  const weekPattern = /^historicalData_week(\d+)_(.+)$/;
  const weekMetrics = {};

  Object.entries(driver).forEach(([key, value]) => {
    const match = key.match(weekPattern);
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
    // Check if this week already exists from JSON parse
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

// Display names for metrics (3-5 word descriptive names)
const METRIC_DISPLAY_NAMES = {
  // Safety - Current Week
  ficoScore: 'FICO Safety Score',
  seatbeltOffRate: 'Seatbelt Off Events',
  speedingEventRate: 'Speeding Events',
  distractionsRate: 'Distraction Events',
  followingDistanceRate: 'Follow Distance Events',
  signalViolationsRate: 'Sign/Signal Violations',
  // Safety - Trailing
  onRoadSafetyScore: 'On-Road Safety Score',
  pawPrintContactCompliance: 'Paw Print Contact Compliance',
  pawPrintCompliance: 'Paw Print Contact Compliance',
  // Delivery - Current Week
  packagesDelivered: 'Total Packages Delivered',
  deliveryCompletionRate: 'Delivery Completion Rate',
  podAcceptanceRate: 'Photo-On-Delivery Acceptance',
  deliverySuccessBehaviors: 'Delivery Success Behaviors',
  dnr: 'Delivered, Not Received',
  podRejects: 'Photo-On-Delivery Rejects',
  qualityTier: 'Overall Quality Score',
  // POD Breakdown
  podRejectsBreakdown_blurryPhoto: 'Blurry Photo',
  podRejectsBreakdown_humanInPicture: 'Human in Photo',
  podRejectsBreakdown_noPackageDetected: 'No Package Detected',
  podRejectsBreakdown_packageTooClose: 'Package Too Close',
  podRejectsBreakdown_photoTooDark: 'Photo Too Dark',
  // Delivery - Trailing
  overallQualityScore: 'Overall Quality Score',
  completionRate: 'Completion Rate',
  photoOnDeliveryAcceptance: 'Photo-On-Delivery Acceptance',
  dcr: 'Delivery Completion Rate',
  pod: 'Photo-On-Delivery Acceptance',
  dsb: 'Delivery Success Behaviors',
  psb: 'Pickup Success Behaviors',
  // Customer - Current Week
  cdfDpmo: 'Negative Feedback Rate (CDF DPMO)',
  cdf: 'Customer Delivery Feedback',
  customerEscalationDefect: 'Escalation Defects',
  cedScore: 'Customer Escalation Score',
  deliveriesWithNegativeFeedback: 'Deliveries w/ Negative Feedback',
  feedbackTier: 'Overall Feedback Score',
  // Customer - Trailing
  overallFeedbackScore: 'Overall Feedback Score',
  negativeFeedbackRate: 'Negative Feedback Rate (CDF DPMO)',
  // DVIC
  dvicComplianceRate: 'Vehicle Inspection Compliance',
  rushedInspections: 'Rushed Inspections',
  dvicRushed: 'Rushed Inspections',
  dvicTime1: 'Inspection Time',
  dvicTime2: 'Inspection Time',
  dvicTime3: 'Inspection Time',
  dvicTime4: 'Inspection Time',
  dvicTime5: 'Inspection Time',
  dvicTime6: 'Inspection Time',
  dvicTime7: 'Inspection Time',
  // Compliance
  ppsComplianceRate: 'Proper Park Sequence Compliance',
  pawPrintComplianceRate: 'Paw Print Notification Rate',
  // Standing
  overallStanding: 'Overall Standing',
  overallScore: 'Overall Performance Score',
  tier: 'Performance Tier',
};

// Reverse map: display key -> actual data keys to try (in order)
const REVERSE_KEY_MAP = {
  // Safety - Trailing
  'onRoadSafetyScore': ['tier', 'overallStanding', 'safetyTier'],
  'pawPrintContactCompliance': ['pawPrint', 'pawPrintCompliance', 'pawPrintContactCompliance'],
  // Delivery - Trailing
  'overallQualityScore': ['tier', 'qualityTier', 'overallStanding'],
  'completionRate': ['dcr', 'deliveryCompletionRate', 'completionRate'],
  'photoOnDeliveryAcceptance': ['pod', 'podAcceptanceRate', 'photoOnDeliveryAcceptance'],
  // Customer - Trailing
  'overallFeedbackScore': ['tier', 'feedbackTier', 'overallStanding'],
  'negativeFeedbackRate': ['cdf', 'cdfDpmo', 'negativeFeedbackRate'],
  // Standard mappings
  'cdfDpmo': ['cdf', 'cdfDpmo'],
  'deliveryCompletionRate': ['dcr', 'deliveryCompletionRate'],
  'podAcceptanceRate': ['pod', 'podAcceptanceRate'],
  'deliverySuccessBehaviors': ['dsb', 'deliverySuccessBehaviors'],
};

// Categorize driver metrics into sections
const categorizeMetrics = (driver, useHistorical = false, historicalData = null) => {
  const safety = [];
  const safetyEvents = [];
  const delivery = [];
  const podBreakdown = [];
  const customer = [];
  const overall = [];
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
    // Use trailing-specific metrics (object definitions)
    KEY_METRICS.overallTrailing.forEach(def => addMetricFromDef(overall, def));
    KEY_METRICS.safetyTrailing.forEach(def => addMetricFromDef(safety, def));
    KEY_METRICS.deliveryTrailing.forEach(def => addMetricFromDef(delivery, def));
    KEY_METRICS.customerTrailing.forEach(def => addMetricFromDef(customer, def));
    KEY_METRICS.standingTrailing.forEach(def => addMetricFromDef(standing, def));
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
    overall,
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

// Driver Preview Modal Component - DiveMetric Design
const DriverPreviewModal = ({ driver, onClose, rankData, rankedCount }) => {
  const theme = 'cream';
  const [view, setView] = useState('current');
  const [metricModal, setMetricModal] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overall: true, safety: true, delivery: true, customer: true, dvic: true, standing: true
  });

  const t = MODAL_THEMES[theme];

  // Parse historical data
  const historicalData = parseHistoricalData(driver);
  const hasHistoricalData = historicalData.length > 0;

  // Get categories based on view
  const categories = categorizeMetrics(
    driver,
    view === 'trailing',
    historicalData
  );

  // Get driver standing/tier
  const standing = driver.overallStanding || driver.tier || 'N/A';
  const tierSeverity = getSeverityLevel('tier', standing) || 'great';
  const tierColor = SEVERITY_COLORS[tierSeverity];

  // Get driver rank from calculated data
  const rank = rankData?.rank || null;
  const score = rankData?.score || null;
  const isEligible = rankData?.eligible || false;
  const packages = parseInt(driver.packagesDelivered) || 0;

  // Toggle section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Format label - use display name mapping or convert from camelCase
  const formatLabel = (key) => {
    // Check for predefined display name
    if (METRIC_DISPLAY_NAMES[key]) {
      return METRIC_DISPLAY_NAMES[key];
    }
    // Fallback: convert camelCase to Title Case
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
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
    // Check if DVIC time metric
    const isDvicTime = metricKey?.toLowerCase().startsWith('dvictime');

    // Get severity (use DVIC logic for times, standard for others)
    const severity = isDvicTime
      ? getDvicTimeSeverity(value)
      : (isTier ? getSeverityLevel('tier', value) : getSeverityLevel(metricKey, value));

    const sevColor = severity ? SEVERITY_COLORS[severity] : null;
    const displayLabel = label || formatLabel(metricKey);

    // Only highlight poor (Severe) and fair (Concerning) states
    const shouldHighlight = severity === 'poor' || severity === 'fair';

    return (
      <div
        onClick={() => setMetricModal({ key: metricKey, value })}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: indent ? '11px 16px 11px 28px' : '13px 16px',
          background: shouldHighlight && !indent ? sevColor.bg : (indent ? t.subtle : t.card),
          borderBottom: `1px solid ${t.border}`,
          cursor: 'pointer', transition: 'background 0.15s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          <span style={{
            fontSize: indent ? '12px' : '13px',
            fontWeight: indent ? '400' : '500',
            color: shouldHighlight ? sevColor.text : (indent ? t.muted : t.text)
          }}>{displayLabel}</span>
          <Info size={12} style={{ opacity: 0.4, color: t.muted }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Severity dot - only for highlighted states */}
          {shouldHighlight && !indent && (
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: sevColor.dot }} />
          )}
          {/* Severity label badge - only for highlighted states */}
          {shouldHighlight && !indent && (
            <span style={{
              fontSize: '10px', fontWeight: '600', color: sevColor.text,
              padding: '2px 6px', background: sevColor.bg, borderRadius: '4px',
              textTransform: 'uppercase', letterSpacing: '0.03em'
            }}>
              {SEVERITY_LABELS[severity]}
            </span>
          )}
          <span style={{
            fontSize: isTier ? '12px' : '13px',
            fontWeight: '600',
            color: shouldHighlight ? sevColor.text : (sevColor ? sevColor.text : t.text),
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

  // Sub-section header for breakdowns
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: t.bg }}
      >
        {/* Header */}
        <div style={{ padding: '20px 16px 0', background: t.card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em' }}>
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
                  {driver.transporterId || 'No ID'} {driver.dspCode && `· ${driver.dspCode}`}
                </div>
              </div>
              <div style={{
                padding: '5px 12px', background: tierColor.bg, borderRadius: '14px',
                fontSize: '11px', fontWeight: '600', color: tierColor.text
              }}>{standing}</div>
            </div>

            {/* Week Display */}
            {(driver.week || driver.weekNumber || driver.scorecardWeek) && (
              <div style={{
                fontSize: '12px',
                color: t.muted,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ fontWeight: '500' }}>Week:</span>
                <span style={{ color: t.text, fontWeight: '600' }}>
                  {driver.week || driver.weekNumber || driver.scorecardWeek}
                </span>
              </div>
            )}

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

            {/* Not Eligible Banner */}
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
        <div style={{ padding: '0 16px 24px', maxHeight: 'calc(90vh - 320px)', overflowY: 'auto' }}>
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

          {/* Overall Performance Section - Trailing View Only (shown first) */}
          {categories.isTrailing && categories.overall?.length > 0 && (
            <Section
              id="overall"
              title="Overall Performance"
              icon={Star}
              metrics={categories.overall}
              defaultSev="great"
            />
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

const ProcessingResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [previewDriver, setPreviewDriver] = useState(null);

  // Get data from navigation state
  const { data, jobId, processedCount, errorCount, errors } = location.state || {};

  // Calculate ranks for all drivers (only 500+ packages are ranked)
  const { rankMap: driverRanks, rankedCount } = data?.drivers
    ? calculateDriverRanks(data.drivers)
    : { rankMap: {}, rankedCount: 0 };
  const totalDrivers = data?.drivers?.length || 0;

  // Sort drivers: ranked first (by rank), then unranked (by score)
  const sortedDrivers = data?.drivers ? [...data.drivers].sort((a, b) => {
    const rankInfoA = driverRanks[a.transporterId];
    const rankInfoB = driverRanks[b.transporterId];

    // Ranked drivers come first
    if (rankInfoA?.eligible && !rankInfoB?.eligible) return -1;
    if (!rankInfoA?.eligible && rankInfoB?.eligible) return 1;

    // Among ranked drivers, sort by rank
    if (rankInfoA?.eligible && rankInfoB?.eligible) {
      return (rankInfoA.rank || 999) - (rankInfoB.rank || 999);
    }

    // Among unranked drivers, sort by score
    return (rankInfoB?.score || 0) - (rankInfoA?.score || 0);
  }) : [];

  // Redirect if no data
  useEffect(() => {
    if (!data) {
      navigate('/upload-scorecard');
    }
  }, [data, navigate]);

  if (!data) {
    return null;
  }

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scorecard-results-${data.dspCode}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/upload-scorecard"
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-500" />
            </Link>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                Job ID: {jobId?.slice(0, 8)}...
              </p>
              <h1 className="text-2xl font-bold text-foreground">Processing Results</h1>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white dark:text-neutral-900" />
                </div>
                <span className="text-sm text-muted-foreground">DSP</span>
              </div>
              <p className="text-lg font-semibold">{data.dspCode}</p>
              <p className="text-sm text-muted-foreground">{data.stationCode}</p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-muted-foreground">Processed</span>
              </div>
              <p className="text-lg font-semibold">{processedCount} documents</p>
              {errorCount > 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400">{errorCount} errors</p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-muted-foreground">Drivers</span>
              </div>
              <p className="text-lg font-semibold">{data.drivers?.length || 0}</p>
              <p className="text-sm text-muted-foreground">with metrics</p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm text-muted-foreground">Processed</span>
              </div>
              <p className="text-lg font-semibold">
                {new Date(data.processedAt).toLocaleTimeString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(data.processedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Errors Section */}
        {errors && errors.length > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">Processing Errors</h3>
            </div>
            <ul className="space-y-2">
              {errors.map((err, idx) => (
                <li key={idx} className="text-sm text-amber-700 dark:text-amber-300">
                  <span className="font-medium">{err.docType}:</span> {err.error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Driver Metrics</h2>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
        </div>

        {/* Ranking Calculation Explanation */}
        {/* <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Ranking Calculation</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                Drivers are ranked using a multi-factor algorithm (requires 500+ packages):
              </p>
              <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                <li><span className="font-medium">Tier</span> — Platinum → Gold → Silver → Bronze → Poor</li>
                <li><span className="font-medium">Quality Group</span> — Based on metric thresholds:
                  <ul className="ml-4 mt-1 space-y-0.5 list-disc list-inside text-xs">
                    <li>Perfect: DPMO=0, DCR≥100%, POD≥100%</li>
                    <li>Near-perfect: DPMO=0, DCR≥99.8%, POD≥99.7%</li>
                    <li>Low DPMO (≤1000) with perfect DCR/POD</li>
                    <li>DPMO=0 with DCR{"<"}99.8%</li>
                    <li>Higher DPMO ({">"} 1000)</li>
                    <li>POD{"<"}99.7% (major penalty)</li>
                  </ul>
                </li>
                <li><span className="font-medium">DPMO</span> — Lower is better (within DPMO groups)</li>
                <li><span className="font-medium">DCR</span> — Higher completion rate is better</li>
                <li><span className="font-medium">Packages</span> — Higher volume as tiebreaker</li>
              </ol>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Score = 100 - ((rank - 1) / (total ranked - 1) × 100) — Rank #1 = 100, last rank = 0
              </p>
            </div>
          </div>
        </div> */}

        {/* Drivers List - Sorted by Rank */}
        {rankedCount > 0 && (
          <p className="text-sm text-muted-foreground mb-3">
            {rankedCount} drivers ranked (500+ packages) · {totalDrivers - rankedCount} not yet eligible
          </p>
        )}
        <div className="space-y-2">
          {sortedDrivers.map((driver, index) => {
            const rankInfo = driverRanks[driver.transporterId];
            const rank = rankInfo?.rank;
            const score = rankInfo?.score;
            const isEligible = rankInfo?.eligible;
            const packages = parseInt(driver.packagesDelivered) || 0;

            return (
              <div
                key={driver.transporterId || index}
                className={`flex items-center justify-between p-4 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors ${
                  isEligible
                    ? 'border-neutral-200 dark:border-neutral-800'
                    : 'border-dashed border-neutral-300 dark:border-neutral-700 opacity-75'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    !isEligible ? 'bg-neutral-50 dark:bg-neutral-900 text-neutral-400 border border-dashed border-neutral-300' :
                    rank === 1 ? 'bg-amber-100 text-amber-700' :
                    rank === 2 ? 'bg-slate-200 text-slate-600' :
                    rank === 3 ? 'bg-orange-100 text-orange-700' :
                    'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}>
                    {isEligible ? `#${rank}` : '—'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">
                        {driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ') || 'Unknown Driver'}
                      </p>
                      {(driver.overallStanding || driver.tier) && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          (driver.overallStanding || driver.tier) === 'Platinum' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' :
                          (driver.overallStanding || driver.tier) === 'Gold' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                          (driver.overallStanding || driver.tier) === 'Silver' ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                          (driver.overallStanding || driver.tier) === 'Bronze' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                          'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}>
                          {driver.overallStanding || driver.tier}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isEligible ? (
                        <>Score: {score?.toFixed(1) || '-'}</>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400">
                          {packages} / 500 packages for ranking
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{packages || '-'} pkgs</p>
                    {driver.ficoScore && parseFloat(driver.ficoScore) !== 0 && (
                      <p className="text-xs text-muted-foreground">FICO: {driver.ficoScore}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setPreviewDriver(driver)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>
            );
          })}

          {(!data.drivers || data.drivers.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No driver data found in processed documents.</p>
            </div>
          )}
        </div>

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
          scorecardInfo={{
            dspId: data?.dspCode,
            stationCode: data?.stationCode,
            weekNumber: previewDriver?.weekNumber || previewDriver?.week,
          }}
        />
      )}
    </div>
  );
};

export default ProcessingResults;
