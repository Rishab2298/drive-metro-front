import React from 'react';
import { Document, Page, View, Text, Svg, Rect, Defs, LinearGradient, Stop, pdf } from '@react-pdf/renderer';
import {
  categorizeMetrics,
  getSeverityLevel,
  getDvicTimeSeverity,
  formatValue,
  formatLabel,
  getDriverName,
} from '@/utils/scorecardUtils';

// ═══════════════════════════════════════════════════════════════════════════
// PREMIUM COLOR PALETTE - Sophisticated navy/indigo with warm accents
// ═══════════════════════════════════════════════════════════════════════════
const C = {
  // Primary deep tones
  navy: '#0F172A',
  navyMid: '#1E293B',
  navyLight: '#334155',

  // Accent gradient spectrum
  indigo: '#6366F1',
  violet: '#8B5CF6',
  fuchsia: '#D946EF',
  rose: '#F43F5E',

  // Warm highlights
  amber: '#F59E0B',
  emerald: '#10B981',
  sky: '#0EA5E9',

  // Neutrals
  white: '#FFFFFF',
  cream: '#FAFBFC',
  pearl: '#F1F5F9',
  silver: '#E2E8F0',
  slate: '#94A3B8',
  charcoal: '#475569',

  // Glass effects
  glassLight: 'rgba(255,255,255,0.08)',
  glassMid: 'rgba(255,255,255,0.12)',
  glassBorder: 'rgba(255,255,255,0.18)',

  // Severity accents
  sevFantastic: { bg: '#EEF2FF', text: '#4338CA', accent: '#6366F1', glow: '#C7D2FE' },
  sevGreat: { bg: '#ECFDF5', text: '#047857', accent: '#10B981', glow: '#A7F3D0' },
  sevFair: { bg: '#FFFBEB', text: '#B45309', accent: '#F59E0B', glow: '#FDE68A' },
  sevPoor: { bg: '#FEF2F2', text: '#B91C1C', accent: '#EF4444', glow: '#FECACA', dark: '#7F1D1D' },
};

const TIER_STYLES = {
  Platinum: { bg: '#F5F3FF', text: '#7C3AED', border: '#C4B5FD' },
  Fantastic: { bg: '#F5F3FF', text: '#7C3AED', border: '#C4B5FD' },
  Gold: { bg: '#FFFBEB', text: '#B45309', border: '#FCD34D' },
  Great: { bg: '#FFFBEB', text: '#B45309', border: '#FCD34D' },
  Silver: { bg: '#F8FAFC', text: '#475569', border: '#CBD5E1' },
  Fair: { bg: '#FFF7ED', text: '#C2410C', border: '#FDBA74' },
  Bronze: { bg: '#FFF7ED', text: '#C2410C', border: '#FDBA74' },
  Poor: { bg: '#FEF2F2', text: '#B91C1C', border: '#FCA5A5' },
  'N/A': { bg: '#F9FAFB', text: '#6B7280', border: '#D1D5DB' },
};

// ═══════════════════════════════════════════════════════════════════════════
// SVG GRADIENT HEADER - Creates the premium gradient bar
// ═══════════════════════════════════════════════════════════════════════════
const GradientBar = ({ width, height }) => (
  <Svg width={width} height={height}>
    <Defs>
      <LinearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0%" stopColor={C.indigo} />
        <Stop offset="35%" stopColor={C.violet} />
        <Stop offset="70%" stopColor={C.fuchsia} />
        <Stop offset="100%" stopColor={C.rose} />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width={width} height={height} fill="url(#headerGrad)" />
  </Svg>
);

// Feedback category keys that should always be highlighted
const FEEDBACK_CATEGORY_KEYS = [
  'mishandledpackage',
  'unprofessional',
  'didnotfollowinstructions',
  'deliveredtowrongaddress',
  'neverreceived',
  'receivedwrongitem',
];

// ═══════════════════════════════════════════════════════════════════════════
// METRIC ROW - Refined with better spacing and visual hierarchy
// ═══════════════════════════════════════════════════════════════════════════
const MetricRow = ({ metric, indent = false, isLast = false }) => {
  const keyLower = metric.key?.toLowerCase() || '';
  const isDvicTime = keyLower.startsWith('dvictime');
  const isFeedbackCategory = FEEDBACK_CATEGORY_KEYS.includes(keyLower);

  const sev = metric.type === 'tier'
    ? getSeverityLevel('tier', metric.value)
    : (isDvicTime
      ? getDvicTimeSeverity(metric.value)
      : getSeverityLevel(metric.key, metric.value));

  const isTier = metric.type === 'tier';

  // Match modal logic: highlight poor/fair unless indented
  // Exception: always highlight DVIC times and feedback categories (negative feedback is always important)
  const alwaysHighlight = isDvicTime || isFeedbackCategory;
  const shouldHighlight = (sev === 'poor' || sev === 'fair') && (!indent || alwaysHighlight);
  const isPoor = sev === 'poor' && shouldHighlight;
  const isFair = sev === 'fair' && shouldHighlight;

  const tierStyle = isTier && metric.value ? (TIER_STYLES[metric.value] || TIER_STYLES['N/A']) : null;
  const displayValue = metric.type === 'tier' ? metric.value : formatValue(metric.key, metric.value);

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: indent ? 12 : 10,
      paddingVertical: 5,
      backgroundColor: isPoor ? C.sevPoor.dark : isFair ? C.sevFair.bg : C.white,
      borderBottomWidth: isLast ? 0 : 0.5,
      borderBottomColor: isPoor ? 'rgba(255,255,255,0.1)' : C.silver,
      borderLeftWidth: isPoor ? 3 : isFair ? 2.5 : 0,
      borderLeftColor: isPoor ? C.sevPoor.accent : isFair ? C.sevFair.accent : 'transparent',
    }}>
      {/* Label */}
      <Text style={{
        fontSize: indent ? 7.5 : 8,
        fontFamily: isPoor ? 'Helvetica-Bold' : 'Helvetica',
        color: isPoor ? C.white : isFair ? C.sevFair.text : indent ? C.slate : C.navyMid,
        flex: 1,
        marginRight: 8,
        letterSpacing: 0.1,
      }}>
        {metric.label || formatLabel(metric.key)}
      </Text>

      {/* Status badges */}
      {isPoor && (
        <View style={{
          backgroundColor: 'rgba(254,202,202,0.9)',
          borderRadius: 4,
          paddingHorizontal: 6,
          paddingVertical: 2.5,
          marginRight: 8,
        }}>
          <Text style={{ fontSize: 5.5, fontFamily: 'Helvetica-Bold', color: C.sevPoor.dark, letterSpacing: 0.5 }}>
            SEVERE
          </Text>
        </View>
      )}
      {isFair && (
        <View style={{
          backgroundColor: C.sevFair.accent,
          borderRadius: 4,
          paddingHorizontal: 6,
          paddingVertical: 2.5,
          marginRight: 8,
        }}>
          <Text style={{ fontSize: 5.5, fontFamily: 'Helvetica-Bold', color: C.white, letterSpacing: 0.5 }}>
            CONCERNING
          </Text>
        </View>
      )}

      {/* Value display */}
      {tierStyle ? (
        <View style={{
          backgroundColor: tierStyle.bg,
          borderRadius: 6,
          paddingHorizontal: 10,
          paddingVertical: 3.5,
          borderWidth: 1,
          borderColor: tierStyle.border,
        }}>
          <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: tierStyle.text }}>
            {metric.value}
          </Text>
        </View>
      ) : (
        <Text style={{
          fontSize: 8.5,
          fontFamily: 'Helvetica-Bold',
          color: isPoor ? '#FCA5A5' : isFair ? C.sevFair.text : sev === 'fantastic' ? C.sevFantastic.text : sev === 'great' ? C.sevGreat.text : C.navyLight,
        }}>
          {displayValue}
        </Text>
      )}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SUB-SECTION HEADER - Elegant divider with accent
// ═══════════════════════════════════════════════════════════════════════════
const SubHeader = ({ title }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.pearl,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderLeftWidth: 2,
    borderLeftColor: C.indigo,
  }}>
    <View style={{
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: C.indigo,
      marginRight: 6,
    }} />
    <Text style={{
      fontSize: 5.5,
      fontFamily: 'Helvetica-Bold',
      color: C.charcoal,
      letterSpacing: 0.6,
    }}>
      {title.toUpperCase()}
    </Text>
  </View>
);

// ═══════════════════════════════════════════════════════════════════════════
// METRIC SECTION - Premium card with layered depth
// ═══════════════════════════════════════════════════════════════════════════
const MetricSection = ({ title, metrics, subSections, sevKey = 'fantastic' }) => {
  const sevStyles = {
    fantastic: C.sevFantastic,
    great: C.sevGreat,
    fair: C.sevFair,
    poor: C.sevPoor,
  };
  const sev = sevStyles[sevKey] || sevStyles.fantastic;
  const allSubs = subSections?.filter(s => s.items && s.items.length > 0) || [];
  const totalCount = (metrics?.length || 0) + allSubs.reduce((sum, s) => sum + s.items.length, 0);

  if (totalCount === 0) return null;

  return (
    <View style={{
      marginBottom: 6,
      borderRadius: 6,
      overflow: 'hidden',
      backgroundColor: C.white,
      borderWidth: 1,
      borderColor: C.silver,
    }}>
      {/* Section Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: sev.bg,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: sev.accent,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Icon circle */}
          <View style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: sev.accent,
            marginRight: 6,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: C.white,
              opacity: 0.7,
            }} />
          </View>
          <Text style={{
            fontSize: 8,
            fontFamily: 'Helvetica-Bold',
            color: sev.text,
            letterSpacing: 0.1,
          }}>
            {title}
          </Text>
        </View>
        {/* Count badge */}
        <View style={{
          backgroundColor: sev.accent,
          borderRadius: 8,
          paddingHorizontal: 6,
          paddingVertical: 2,
        }}>
          <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: C.white }}>
            {totalCount}
          </Text>
        </View>
      </View>

      {/* Metrics content */}
      <View>
        {metrics?.map((m, i) => (
          <MetricRow
            key={m.key || i}
            metric={m}
            isLast={i === metrics.length - 1 && allSubs.length === 0}
          />
        ))}
        {allSubs.map((sub, si) => (
          <View key={si}>
            <SubHeader title={sub.title} />
            {sub.items.map((m, i) => (
              <MetricRow
                key={m.key || i}
                metric={m}
                indent
                isLast={si === allSubs.length - 1 && i === sub.items.length - 1}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STAT CARD - Glass morphism inspired
// ═══════════════════════════════════════════════════════════════════════════
const StatCard = ({ label, value, subtitle, color, isLast }) => (
  <View style={{
    flex: 1,
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    marginRight: isLast ? 0 : 6,
    borderWidth: 1,
    
  }}>
    <Text style={{
      fontSize: 15,
      fontFamily: 'Helvetica-Bold',
      color: color,
      marginBottom: 1,
    }}>
      {value}
    </Text>
    <Text style={{
      fontSize: 5.5,
      fontFamily: 'Helvetica-Bold',
      color: 'rgba(199,210,254,0.9)',
      letterSpacing: 0.8,
      marginBottom: 1,
    }}>
      {label}
    </Text>
    {subtitle && (
      <Text style={{ fontSize: 5, color: 'rgba(165,180,252,0.7)' }}>
        {subtitle}
      </Text>
    )}
  </View>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SCORECARD DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════
const ScorecardDocument = ({ driver, options }) => {
  const { rank, score, rankedCount, weekNumber, year, dspName, stationCode, aiFeedback } = options;

  const name = getDriverName(driver);
  const standing = driver.overallStanding || driver.tier || '-';
  const pkgs = parseInt(driver.packagesDelivered) || 0;
  const dspNote = driver.dspNote || driver.note || options.dspNote || null;
  const aiFb = aiFeedback || driver.aiFeedback || null;
  const categories = categorizeMetrics(driver, false, null);

  const scoreColor = score >= 80 ? C.emerald : score >= 50 ? C.amber : '#F87171';
  const initials = (driver.firstName?.[0] || '').toUpperCase() + (driver.lastName?.[0] || '').toUpperCase() || '?';
  const standingStyle = TIER_STYLES[standing] || TIER_STYLES['N/A'];

  return (
    <Document>
      <Page size="A4" style={{ backgroundColor: C.cream, padding: 16, fontFamily: 'Helvetica' }}>

        {/* ═══ HEADER SECTION ═══ */}
        <View style={{
          backgroundColor: C.white,
          borderRadius: 10,
          padding: 12,
          marginBottom: 2,
          borderWidth: 1,
          borderColor: C.silver,
        }}>
          {/* Brand row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{
                fontSize: 18,
                fontFamily: 'Helvetica-Bold',
                color: C.navy,
                letterSpacing: -0.3,
              }}>
                DiveMetric
              </Text>
              {(dspName || stationCode) && (
                <Text style={{
                  fontSize: 8,
                  color: C.charcoal,
                  marginTop: 2,
                  letterSpacing: 0.2,
                }}>
                  {[dspName, stationCode].filter(Boolean).join('  ·  ')}
                </Text>
              )}
            </View>
            {weekNumber && (
              <View style={{
                backgroundColor: C.navy,
                borderRadius: 6,
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}>
                <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: C.white, letterSpacing: 0.4 }}>
                  WEEK {weekNumber}{year ? ` · ${year}` : ''}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Gradient accent bar */}
        <View style={{ height: 3, borderRadius: 1.5, overflow: 'hidden', marginBottom: 8 }}>
          <GradientBar width={563} height={3} />
        </View>

        {/* ═══ PROFILE CARD ═══ */}
        <View style={{
          backgroundColor: C.navy,
          borderRadius: 10,
          padding: 14,
          marginBottom: 8,
        }}>
          {/* Driver info row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            {/* Avatar */}
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: C.white,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Helvetica-Bold',
                color: C.indigo,
              }}>
                {initials}
              </Text>
            </View>

            {/* Name & ID */}
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Helvetica-Bold',
                color: C.white,
                marginBottom: 2,
                letterSpacing: 0.1,
              }}>
                {name}
              </Text>
              <Text style={{ fontSize: 7, color: 'rgba(199,210,254,0.8)', letterSpacing: 0.3 }}>
                ID: {driver.transporterId || driver.employeeId || 'N/A'}
              </Text>
            </View>

            {/* Standing badge */}
            <View style={{
              backgroundColor: standingStyle.bg,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderWidth: 1,
              borderColor: standingStyle.border,
            }}>
              <Text style={{
                fontSize: 8,
                fontFamily: 'Helvetica-Bold',
                color: standingStyle.text,
                letterSpacing: 0.2,
              }}>
                {standing}
              </Text>
            </View>
          </View>

          {/* Stat cards row */}
          <View style={{ flexDirection: 'row' }}>
            <StatCard
              label="RANK"
              value={rank ? `#${rank}` : '—'}
              subtitle={rankedCount ? `of ${rankedCount} drivers` : null}
              color="#A5B4FC"
            />
            <StatCard
              label="SCORE"
              value={score ? score.toFixed(1) : '—'}
              subtitle="out of 100"
              color={scoreColor}
            />
            <StatCard
              label="PACKAGES"
              value={pkgs ? pkgs.toLocaleString() : '—'}
              subtitle="delivered"
              color="#C4B5FD"
              isLast
            />
          </View>
        </View>

        {/* ═══ DSP NOTE ═══ */}
        {dspNote && (
          <View style={{
            backgroundColor: '#FEFCE8',
            borderRadius: 6,
            padding: 10,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: '#FDE68A',
            borderLeftWidth: 3,
            borderLeftColor: C.amber,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <View style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: C.amber,
                marginRight: 6,
              }} />
              <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: '#92400E', letterSpacing: 0.6 }}>
                MESSAGE FROM YOUR DSP
              </Text>
            </View>
            <Text style={{ fontSize: 7.5, color: '#78350F', lineHeight: 1.4 }}>
              {dspNote.length > 200 ? dspNote.slice(0, 200) + '...' : dspNote}
            </Text>
          </View>
        )}

        {/* ═══ DUAL-COLUMN METRICS ═══ */}
        <View style={{ flexDirection: 'row' }}>
          {/* Left Column */}
          <View style={{ flex: 1, marginRight: 6 }}>
            <MetricSection
              title="Driving Safety"
              metrics={categories.safety}
              subSections={[
                { title: 'PPS Breakdown', items: categories.ppsBreakdown },
                { title: 'Events (Per 100 Deliveries)', items: categories.safetyEvents },
              ]}
              sevKey="fantastic"
            />
            <MetricSection
              title="Customer Feedback"
              metrics={categories.customer}
              subSections={[
                { title: 'Negative Categories', items: categories.customerFeedbackBreakdown },
              ]}
              sevKey="fair"
            />
          </View>

          {/* Right Column */}
          <View style={{ flex: 1 }}>
            <MetricSection
              title="Delivery Quality"
              metrics={categories.delivery}
              subSections={[
                { title: 'POD Rejection Details', items: categories.podBreakdown },
              ]}
              sevKey="great"
            />
            {(categories.dvic?.length > 0 || categories.dvicTimes?.length > 0) && (
              <MetricSection
                title="Vehicle Inspection"
                metrics={categories.dvic}
                subSections={[
                  { title: 'Inspection Times', items: categories.dvicTimes },
                ]}
                sevKey="great"
              />
            )}
          </View>
        </View>

        {/* ═══ AI FEEDBACK ═══ */}
        {aiFb && Array.isArray(aiFb) && aiFb.length > 0 && (
          <View style={{
            marginTop: 6,
            borderRadius: 6,
            overflow: 'hidden',
            backgroundColor: C.white,
            borderWidth: 1,
            borderColor: C.silver,
          }}>
            {/* Header with gradient */}
            <View style={{ height: 20, overflow: 'hidden' }}>
              <GradientBar width={563} height={20} />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', paddingLeft: 10 }}>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.white, letterSpacing: 0.2 }}>
                  AI-Powered Improvement Insights
                </Text>
              </View>
            </View>
            {/* Content */}
            <View style={{ padding: 10 }}>
              {aiFb.map((fb, idx) => (
                <View key={idx} style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: idx < aiFb.length - 1 ? 5 : 0,
                }}>
                  <View style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: C.indigo,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 6,
                    marginTop: 1,
                  }}>
                    <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: C.white }}>
                      {idx + 1}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 6.5, color: C.navyMid, flex: 1, lineHeight: 1.3 }}>
                    {String(fb)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ═══ FOOTER ═══ */}
        <View style={{
          position: 'absolute',
          bottom: 12,
          left: 16,
          right: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 6,
          borderTopWidth: 0.5,
          borderTopColor: C.silver,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: C.indigo,
              marginRight: 5,
            }} />
            <Text style={{ fontSize: 6, color: C.slate }}>Powered by </Text>
            <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: C.indigo }}>
              DiveMetric Analytics
            </Text>
          </View>
          <Text style={{ fontSize: 6, color: C.slate }}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>

      </Page>
    </Document>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export const generateScorecardPDF = async (driver, options = {}) => {
  const blob = await pdf(<ScorecardDocument driver={driver} options={options} />).toBlob();
  return blob;
};

export const downloadScorecardPDF = async (driver, options = {}) => {
  const blob = await generateScorecardPDF(driver, options);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const n = driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ') || 'driver';
  a.href = url;
  a.download = `scorecard-${n.replace(/\s+/g, '-').toLowerCase()}-week${options.weekNumber || ''}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadBulkScorecardPDFs = async (drivers, options = {}, rankMap = {}) => {
  for (const d of drivers) {
    const r = rankMap[d.transporterId] || {};
    await downloadScorecardPDF(d, { ...options, rank: r.rank, score: r.score, rankedCount: options.rankedCount });
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};

export const downloadCombinedPDF = async (drivers, options = {}, rankMap = {}) => {
  if (!drivers || drivers.length === 0) return;

  const CombinedDocument = () => (
    <Document>
      {drivers.map((driver, index) => {
        const r = rankMap[driver.transporterId] || {};
        const opts = { ...options, rank: r.rank, score: r.score, rankedCount: options.rankedCount };
        const name = getDriverName(driver);
        const standing = driver.overallStanding || driver.tier || '-';
        const pkgs = parseInt(driver.packagesDelivered) || 0;
        const dspNote = driver.dspNote || driver.note || opts.dspNote || null;
        const aiFb = opts.aiFeedback || driver.aiFeedback || null;
        const categories = categorizeMetrics(driver, false, null);
        const scoreColor = opts.score >= 80 ? C.emerald : opts.score >= 50 ? C.amber : '#F87171';
        const initials = (driver.firstName?.[0] || '').toUpperCase() + (driver.lastName?.[0] || '').toUpperCase() || '?';
        const standingStyle = TIER_STYLES[standing] || TIER_STYLES['N/A'];

        return (
          <Page key={index} size="A4" style={{ backgroundColor: C.cream, padding: 16, fontFamily: 'Helvetica' }}>
            {/* Header */}
            <View style={{ backgroundColor: C.white, borderRadius: 10, padding: 12, marginBottom: 2, borderWidth: 1, borderColor: C.silver }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.navy, letterSpacing: -0.3 }}>DiveMetric</Text>
                  {(opts.dspName || opts.stationCode) && (
                    <Text style={{ fontSize: 8, color: C.charcoal, marginTop: 2, letterSpacing: 0.2 }}>
                      {[opts.dspName, opts.stationCode].filter(Boolean).join('  ·  ')}
                    </Text>
                  )}
                </View>
                {opts.weekNumber && (
                  <View style={{ backgroundColor: C.navy, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 }}>
                    <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: C.white, letterSpacing: 0.4 }}>
                      WEEK {opts.weekNumber}{opts.year ? ` · ${opts.year}` : ''}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{ height: 3, borderRadius: 1.5, overflow: 'hidden', marginBottom: 8 }}>
              <GradientBar width={563} height={3} />
            </View>

            {/* Profile Card */}
            <View style={{ backgroundColor: C.navy, borderRadius: 10, padding: 14, marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.indigo }}>{initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.white, marginBottom: 2, letterSpacing: 0.1 }}>{name}</Text>
                  <Text style={{ fontSize: 7, color: 'rgba(199,210,254,0.8)', letterSpacing: 0.3 }}>ID: {driver.transporterId || driver.employeeId || 'N/A'}</Text>
                </View>
                <View style={{ backgroundColor: standingStyle.bg, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: standingStyle.border }}>
                  <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: standingStyle.text, letterSpacing: 0.2 }}>{standing}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <StatCard label="RANK" value={opts.rank ? `#${opts.rank}` : '—'} subtitle={opts.rankedCount ? `of ${opts.rankedCount}` : null} color="#A5B4FC" />
                <StatCard label="SCORE" value={opts.score ? opts.score.toFixed(1) : '—'} subtitle="out of 100" color={scoreColor} />
                <StatCard label="PACKAGES" value={pkgs ? pkgs.toLocaleString() : '—'} subtitle="delivered" color="#C4B5FD" isLast />
              </View>
            </View>

            {/* DSP Note */}
            {dspNote && (
              <View style={{ backgroundColor: '#FEFCE8', borderRadius: 6, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#FDE68A', borderLeftWidth: 3, borderLeftColor: C.amber }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.amber, marginRight: 6 }} />
                  <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: '#92400E', letterSpacing: 0.6 }}>MESSAGE FROM YOUR DSP</Text>
                </View>
                <Text style={{ fontSize: 7.5, color: '#78350F', lineHeight: 1.4 }}>{dspNote.length > 200 ? dspNote.slice(0, 200) + '...' : dspNote}</Text>
              </View>
            )}

            {/* Metrics */}
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <MetricSection title="Driving Safety" metrics={categories.safety} subSections={[{ title: 'PPS Breakdown', items: categories.ppsBreakdown }, { title: 'Events (Per 100)', items: categories.safetyEvents }]} sevKey="fantastic" />
                <MetricSection title="Customer Feedback" metrics={categories.customer} subSections={[{ title: 'Negative Categories', items: categories.customerFeedbackBreakdown }]} sevKey="fair" />
              </View>
              <View style={{ flex: 1 }}>
                <MetricSection title="Delivery Quality" metrics={categories.delivery} subSections={[{ title: 'POD Rejection Details', items: categories.podBreakdown }]} sevKey="great" />
                {(categories.dvic?.length > 0 || categories.dvicTimes?.length > 0) && (
                  <MetricSection title="Vehicle Inspection" metrics={categories.dvic} subSections={[{ title: 'Inspection Times', items: categories.dvicTimes }]} sevKey="great" />
                )}
              </View>
            </View>

            {/* AI Feedback */}
            {aiFb && Array.isArray(aiFb) && aiFb.length > 0 && (
              <View style={{ marginTop: 6, borderRadius: 6, overflow: 'hidden', backgroundColor: C.white, borderWidth: 1, borderColor: C.silver }}>
                <View style={{ height: 20, overflow: 'hidden' }}>
                  <GradientBar width={563} height={20} />
                  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', paddingLeft: 10 }}>
                    <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.white, letterSpacing: 0.2 }}>AI-Powered Improvement Insights</Text>
                  </View>
                </View>
                <View style={{ padding: 10 }}>
                  {aiFb.map((fb, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: idx < aiFb.length - 1 ? 5 : 0 }}>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.indigo, justifyContent: 'center', alignItems: 'center', marginRight: 6, marginTop: 1 }}>
                        <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: C.white }}>{idx + 1}</Text>
                      </View>
                      <Text style={{ fontSize: 6.5, color: C.navyMid, flex: 1, lineHeight: 1.3 }}>{String(fb)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Footer */}
            <View style={{ position: 'absolute', bottom: 12, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTopWidth: 0.5, borderTopColor: C.silver }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: C.indigo, marginRight: 5 }} />
                <Text style={{ fontSize: 6, color: C.slate }}>Powered by </Text>
                <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', color: C.indigo }}>DiveMetric Analytics</Text>
              </View>
              <Text style={{ fontSize: 6, color: C.slate }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );

  const blob = await pdf(<CombinedDocument />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scorecards-combined-week${options.weekNumber || ''}-${drivers.length}drivers.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default generateScorecardPDF;
