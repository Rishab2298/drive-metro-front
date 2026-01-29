/**
 * Scorecard 21: Executive Premium Dashboard
 * Enterprise-grade driver scorecard with Bloomberg/Stripe-inspired aesthetics
 * Dark theme with refined typography and sophisticated data visualization
 */

import { useState } from 'react'

// Sample driver data - Current Week
const sampleDriver = {
  name: "Joe Driver",
  firstName: "Joe",
  lastName: "Driver",
  transporterId: "A3AHESB408LBV7",
  dspCode: "DSPX",
  stationCode: "DXX1",
  week: 48,
  year: 2025,
  tier: "Platinum",
  overallStanding: "Platinum",
  overallScore: 87.58,
  rank: 12,
  totalDrivers: 55,
  packagesDelivered: 1254,
  dspNote: "Great work last week! Please make sure to keep an eye on your speed so we get those speeding violations down to zero.",
  // Safety
  onRoadSafetyScore: "Platinum",
  ficoScore: 670,
  ppsComplianceRate: 71.7,
  ppsTotalStops: 251,
  ppsDidNotApplyParkingBrake: 60,
  ppsDidNotShiftToPark: 11,
  pawPrintSent: 105,
  pawPrintTotal: 120,
  distractionsRate: 0.0,
  speedingEventRate: 0.0,
  seatbeltOffRate: 0.0,
  followingDistanceRate: 0.0,
  signalViolationsRate: 0.0,
  // Delivery
  deliveryQualityScore: "Gold",
  completionRate: 99.5,
  dcr: 99.5,
  dcrTier: "Platinum",
  deliveredNotReceived: 2,
  podAcceptanceRate: 99.2,
  pod: 99.2,
  podTier: "Platinum",
  podScore: 90.6,
  podOpportunities: 561,
  podRejects: 4,
  podRejectsBreakdown_blurryPhoto: 2,
  podRejectsBreakdown_humanInPicture: 0,
  podRejectsBreakdown_noPackageDetected: 1,
  podRejectsBreakdown_packageTooClose: 0,
  podRejectsBreakdown_photoTooDark: 1,
  dsb: 162,
  dsbDpmoTier: "Platinum",
  dsbDpmoScore: 84.35,
  psb: 0,
  psbTier: "",
  psbScore: 0,
  // Customer
  customerFeedbackScore: "Bronze",
  cdfDpmo: 2762,
  cdfDpmoTier: "Bronze",
  cdfDpmoScore: 0,
  cedScore: 0,
  negativeFeedbackCount: 3,
  escalationDefects: 1,
  negativeFeedback: {
    notGreat: 5,
    didNotFollowInstructions: 2,
    wrongAddress: 2,
    neverReceived: 1
  },
  // DVIC
  dvicRushedCount: 3,
  dvicTotalInspections: 5,
  dvicInspections: [
    { day: "Wed 10/01", time: "00:27", severity: "fair" },
    { day: "Thu 10/02", time: "00:20", severity: "fair" },
    { day: "Sat 10/04", time: "00:09", severity: "poor" }
  ],
  focusArea: "Customer Delivery Feedback",
  focusGuidance: "Always read the customer notes before executing a delivery! These notes will aid you in the delivery and help to ensure your success. When in doubt, call customer support or call/text the customer for guidance on how they want their package delivered.",
  // 6-Week Trailing Historical Data
  historicalData: JSON.stringify([
    { week: 43, year: 2025, metrics: { overallScore: 85.2, overallStanding: "Platinum", dcr: 99.1, pod: 98.9, cdfDpmo: 2500, speedingEventRate: 0.0, seatbeltOffRate: 0.0 }},
    { week: 44, year: 2025, metrics: { overallScore: 86.5, overallStanding: "Platinum", dcr: 99.3, pod: 99.0, cdfDpmo: 2650, speedingEventRate: 0.0, seatbeltOffRate: 0.0 }},
    { week: 45, year: 2025, metrics: { overallScore: 88.1, overallStanding: "Platinum", dcr: 99.5, pod: 99.1, cdfDpmo: 2800, speedingEventRate: 0.0, seatbeltOffRate: 0.0 }},
    { week: 46, year: 2025, metrics: { overallScore: 87.0, overallStanding: "Platinum", dcr: 99.4, pod: 99.2, cdfDpmo: 2700, speedingEventRate: 0.0, seatbeltOffRate: 0.0 }},
    { week: 47, year: 2025, metrics: { overallScore: 86.8, overallStanding: "Platinum", dcr: 99.2, pod: 99.0, cdfDpmo: 2750, speedingEventRate: 0.0, seatbeltOffRate: 0.0 }},
    { week: 48, year: 2025, metrics: { overallScore: 87.58, overallStanding: "Platinum", dcr: 99.5, pod: 99.2, cdfDpmo: 2762, speedingEventRate: 0.0, seatbeltOffRate: 0.0 }},
  ])
}

export default function ScorecardSampleDemo({ driver = sampleDriver }) {
  const [activeView, setActiveView] = useState('current')
  const [expandedSection, setExpandedSection] = useState(null)

  // Premium color system
  const theme = {
    bg: {
      primary: '#0B0F1A',
      secondary: '#111827',
      tertiary: '#1F2937',
      card: 'rgba(31, 41, 55, 0.5)',
      cardHover: 'rgba(31, 41, 55, 0.8)',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#9CA3AF',
      muted: '#6B7280',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.06)',
      medium: 'rgba(255, 255, 255, 0.1)',
    },
    severity: {
      fantastic: { main: '#A78BFA', soft: 'rgba(167, 139, 250, 0.15)', text: '#C4B5FD' },
      great: { main: '#34D399', soft: 'rgba(52, 211, 153, 0.15)', text: '#6EE7B7' },
      fair: { main: '#FBBF24', soft: 'rgba(251, 191, 36, 0.15)', text: '#FCD34D' },
      poor: { main: '#F87171', soft: 'rgba(248, 113, 113, 0.15)', text: '#FCA5A5' },
    },
    tier: {
      Platinum: { gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)', glow: 'rgba(124, 58, 237, 0.3)' },
      Gold: { gradient: 'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)', glow: 'rgba(217, 119, 6, 0.3)' },
      Silver: { gradient: 'linear-gradient(135deg, #4B5563 0%, #9CA3AF 100%)', glow: 'rgba(75, 85, 99, 0.3)' },
      Bronze: { gradient: 'linear-gradient(135deg, #C2410C 0%, #FB923C 100%)', glow: 'rgba(194, 65, 12, 0.3)' },
    }
  }

  const getColor = (severity) => theme.severity[severity] || theme.severity.fantastic

  // Metric Row Component
  const MetricRow = ({ label, value, denominator, suffix = '', severity, indent = false, subtext }) => {
    const colors = severity ? getColor(severity) : null

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: indent ? '10px 16px 10px 28px' : '14px 16px',
        background: indent ? 'transparent' : theme.bg.card,
        borderBottom: `1px solid ${theme.border.subtle}`,
        transition: 'background 0.2s ease',
      }}>
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: indent ? '13px' : '14px',
            fontWeight: indent ? '400' : '500',
            color: indent ? theme.text.muted : theme.text.primary,
            letterSpacing: '-0.01em',
          }}>
            {label}
          </span>
          {subtext && (
            <span style={{
              fontSize: '11px',
              color: theme.text.muted,
              marginLeft: '8px',
            }}>
              {subtext}
            </span>
          )}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {severity && !indent && (
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: colors.main,
              boxShadow: `0 0 8px ${colors.main}`,
            }} />
          )}
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: severity ? colors.text : theme.text.primary,
            fontVariantNumeric: 'tabular-nums',
            fontFamily: "'SF Mono', 'Fira Code', monospace",
          }}>
            {value}{suffix}
            {denominator !== undefined && (
              <span style={{ color: theme.text.muted, fontWeight: '400' }}>
                /{denominator}
              </span>
            )}
          </span>
        </div>
      </div>
    )
  }

  // Section Component
  const Section = ({ id, title, icon, severity, children }) => {
    const colors = getColor(severity)
    const isExpanded = expandedSection === id || expandedSection === null

    return (
      <div style={{
        marginBottom: '12px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: theme.bg.secondary,
        border: `1px solid ${theme.border.subtle}`,
      }}>
        <button
          onClick={() => setExpandedSection(expandedSection === id ? null : id)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            background: `linear-gradient(90deg, ${colors.soft} 0%, transparent 100%)`,
            border: 'none',
            borderBottom: isExpanded ? `1px solid ${theme.border.subtle}` : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: colors.soft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}>
              {icon}
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: theme.text.primary,
              letterSpacing: '-0.01em',
            }}>
              {title}
            </span>
          </div>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: theme.bg.tertiary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke={theme.text.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
        {isExpanded && (
          <div style={{ background: theme.bg.secondary }}>
            {children}
          </div>
        )}
      </div>
    )
  }

  // Subsection Label
  const SubLabel = ({ children }) => (
    <div style={{
      padding: '12px 16px 8px',
      background: theme.bg.tertiary,
      borderBottom: `1px solid ${theme.border.subtle}`,
    }}>
      <span style={{
        fontSize: '11px',
        fontWeight: '600',
        color: theme.text.muted,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        {children}
      </span>
    </div>
  )

  const tierStyle = theme.tier[driver.tier] || theme.tier.Platinum

  return (
    <div style={{
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      background: theme.bg.primary,
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      color: theme.text.primary,
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 20px 0',
        background: `linear-gradient(180deg, ${theme.bg.secondary} 0%, ${theme.bg.primary} 100%)`,
      }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #F9FAFB 0%, #9CA3AF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            DRIVR
          </div>
          <div style={{
            padding: '6px 12px',
            background: theme.bg.tertiary,
            borderRadius: '6px',
            fontSize: '12px',
            color: theme.text.secondary,
            fontWeight: '500',
          }}>
            Week {driver.week}
          </div>
        </div>

        {/* Profile Card */}
        <div style={{
          background: theme.bg.secondary,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
          border: `1px solid ${theme.border.subtle}`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Tier Glow Effect */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '200px',
            height: '200px',
            background: tierStyle.glow,
            filter: 'blur(60px)',
            borderRadius: '50%',
            opacity: 0.6,
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '20px',
            }}>
              {/* Avatar */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: tierStyle.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                color: '#FFF',
                boxShadow: `0 4px 20px ${tierStyle.glow}`,
              }}>
                {driver.firstName[0]}{driver.lastName[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: theme.text.primary,
                  marginBottom: '2px',
                  letterSpacing: '-0.02em',
                }}>
                  {driver.name}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: theme.text.muted,
                }}>
                  {driver.dspCode} · {driver.stationCode}
                </div>
              </div>
              {/* Tier Badge */}
              <div style={{
                padding: '6px 14px',
                background: tierStyle.gradient,
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#FFF',
                letterSpacing: '0.02em',
                boxShadow: `0 2px 12px ${tierStyle.glow}`,
              }}>
                {driver.tier}
              </div>
            </div>

            {/* Stats Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}>
              {[
                { label: 'Deliveries', value: driver.packagesDelivered.toLocaleString() },
                { label: 'Rank', value: `#${driver.rank}`, sub: `of ${driver.totalDrivers}` },
                { label: 'FICO', value: driver.ficoScore },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: theme.bg.tertiary,
                  borderRadius: '10px',
                  padding: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: theme.text.primary,
                    fontVariantNumeric: 'tabular-nums',
                    marginBottom: '2px',
                  }}>
                    {stat.value}
                    {stat.sub && (
                      <span style={{ fontSize: '11px', color: theme.text.muted, fontWeight: '400' }}>
                        {' '}{stat.sub}
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: theme.text.muted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div style={{
          display: 'flex',
          background: theme.bg.tertiary,
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '20px',
        }}>
          {['current', 'trailing'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: activeView === view ? theme.bg.secondary : 'transparent',
                color: activeView === view ? theme.text.primary : theme.text.muted,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeView === view ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              {view === 'current' ? 'Current Week' : '6-Week Trailing'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px 32px' }}>
        {/* Trailing View Indicator */}
        {activeView === 'trailing' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '12px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#A78BFA' }}>
                6-Week Trailing Averages
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                Showing averaged metrics from weeks 43-48
              </div>
            </div>
          </div>
        )}

        {/* DSP Note - Current view only */}
        {activeView === 'current' && driver.dspNote && (
          <div style={{
            background: theme.bg.secondary,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            border: `1px solid ${theme.border.subtle}`,
            borderLeft: `3px solid ${theme.severity.fantastic.main}`,
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: theme.severity.fantastic.text,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}>
              Note from DSP
            </div>
            <p style={{
              fontSize: '13px',
              color: theme.text.secondary,
              lineHeight: '1.6',
              margin: 0,
            }}>
              {driver.dspNote}
            </p>
          </div>
        )}

        {/* Overall Performance - Trailing View Only */}
        {activeView === 'trailing' && (
          <Section id="overall" title="Overall Performance" icon="⭐" severity={driver.overallScore >= 90 ? 'fantastic' : driver.overallScore >= 80 ? 'great' : 'fair'}>
            <MetricRow
              label="Overall Score"
              value={driver.overallScore}
              severity={driver.overallScore >= 90 ? 'fantastic' : driver.overallScore >= 80 ? 'great' : driver.overallScore >= 70 ? 'fair' : 'poor'}
            />
            <MetricRow label="Overall Standing" value={driver.overallStanding} severity="fantastic" />
            <MetricRow label="Packages Delivered" value={driver.packagesDelivered.toLocaleString()} />
          </Section>
        )}

        {/* Driving Safety */}
        <Section id="safety" title="Driving Safety" icon="🛡️" severity="fantastic">
          {activeView === 'current' ? (
            <>
              <MetricRow label="On-Road Safety" value={driver.onRoadSafetyScore} severity="fantastic" />
              <MetricRow
                label="FICO Score"
                value={driver.ficoScore}
                denominator={850}
                severity={driver.ficoScore >= 800 ? 'fantastic' : driver.ficoScore >= 700 ? 'great' : 'fair'}
              />
              <MetricRow
                label="PPS Compliance"
                value={driver.ppsComplianceRate}
                suffix="%"
                severity={driver.ppsComplianceRate >= 95 ? 'fantastic' : driver.ppsComplianceRate >= 85 ? 'great' : driver.ppsComplianceRate >= 75 ? 'fair' : 'poor'}
              />
              <MetricRow
                label="Parking Brake Missed"
                value={driver.ppsDidNotApplyParkingBrake}
                denominator={driver.ppsTotalStops}
                indent
                severity={driver.ppsDidNotApplyParkingBrake > 0 ? 'poor' : 'fantastic'}
              />
              <MetricRow
                label="Shift to Park Missed"
                value={driver.ppsDidNotShiftToPark}
                denominator={driver.ppsTotalStops}
                indent
                severity={driver.ppsDidNotShiftToPark > 0 ? 'poor' : 'fantastic'}
              />
              <MetricRow
                label="Paw Print Compliance"
                value={driver.pawPrintSent}
                denominator={driver.pawPrintTotal}
                severity={driver.pawPrintSent / driver.pawPrintTotal >= 0.95 ? 'fantastic' : driver.pawPrintSent / driver.pawPrintTotal >= 0.85 ? 'great' : 'fair'}
              />

              <SubLabel>Events per 100 Deliveries</SubLabel>
              <MetricRow label="Distractions" value={driver.distractionsRate} severity={driver.distractionsRate === 0 ? 'fantastic' : 'poor'} />
              <MetricRow label="Speeding" value={driver.speedingEventRate} severity={driver.speedingEventRate === 0 ? 'fantastic' : 'poor'} />
              <MetricRow label="Seatbelt Off" value={driver.seatbeltOffRate} severity={driver.seatbeltOffRate === 0 ? 'fantastic' : 'poor'} />
              <MetricRow label="Following Distance" value={driver.followingDistanceRate} severity={driver.followingDistanceRate === 0 ? 'fantastic' : 'fair'} />
              <MetricRow label="Signal Violations" value={driver.signalViolationsRate} severity={driver.signalViolationsRate === 0 ? 'fantastic' : 'poor'} />
            </>
          ) : (
            <>
              <MetricRow
                label="FICO Score"
                value={driver.ficoScore}
                denominator={850}
                severity={driver.ficoScore >= 800 ? 'fantastic' : driver.ficoScore >= 700 ? 'great' : 'fair'}
              />
              <MetricRow label="Speeding Events" value="0.0" severity="fantastic" />
              <MetricRow label="Seatbelt Off Events" value="0.0" severity="fantastic" />
              <MetricRow label="Distraction Events" value="1.2" severity="poor" />
              <MetricRow label="Sign/Signal Violations" value="0.0" severity="fantastic" />
              <MetricRow label="Following Distance Events" value="0.0" severity="fantastic" />
            </>
          )}
        </Section>

        {/* Delivery Quality */}
        <Section id="delivery" title="Delivery Quality" icon="📦" severity="great">
          {activeView === 'current' ? (
            <>
              <MetricRow label="Quality Score" value={driver.deliveryQualityScore} severity="great" />
              <MetricRow label="Completion Rate" value={driver.completionRate} suffix="%" />
              <MetricRow label="Delivered Not Received" value={driver.deliveredNotReceived} denominator={driver.packagesDelivered} severity="fair" />
              <MetricRow label="POD Acceptance" value={driver.podAcceptanceRate} suffix="%" />
              <MetricRow label="POD Rejects" value={driver.podRejects} denominator={driver.podOpportunities} severity={driver.podRejects > 0 ? 'poor' : 'fantastic'} />
              <MetricRow label="Blurry Photo" value={driver.podRejectsBreakdown_blurryPhoto} indent severity={driver.podRejectsBreakdown_blurryPhoto > 0 ? 'poor' : undefined} />
              <MetricRow label="Human in Photo" value={driver.podRejectsBreakdown_humanInPicture} indent severity={driver.podRejectsBreakdown_humanInPicture > 0 ? 'poor' : undefined} />
              <MetricRow label="No Package Detected" value={driver.podRejectsBreakdown_noPackageDetected} indent severity={driver.podRejectsBreakdown_noPackageDetected > 0 ? 'poor' : undefined} />
              <MetricRow label="Package Too Close" value={driver.podRejectsBreakdown_packageTooClose} indent severity={driver.podRejectsBreakdown_packageTooClose > 0 ? 'poor' : undefined} />
              <MetricRow label="Photo Too Dark" value={driver.podRejectsBreakdown_photoTooDark} indent severity={driver.podRejectsBreakdown_photoTooDark > 0 ? 'poor' : undefined} />
              <MetricRow label="Delivery Success Behaviors" value={driver.dsb} severity="great" />
              <MetricRow label="Pickup Success Behaviors" value={driver.psb || 'N/A'} />
            </>
          ) : (
            <>
              <MetricRow label="Delivery Completion Rate" value="99.3%" severity="fantastic" />
              <MetricRow label="DCR Tier" value="Platinum" severity="fantastic" />
              <MetricRow label="Photo-On-Delivery" value="99.1%" severity="fantastic" />
              <MetricRow label="POD Tier" value="Platinum" severity="fantastic" />
              <MetricRow label="POD Score" value="90.6" severity="great" />
              <MetricRow label="Delivery Success Behaviors" value="162" />
              <MetricRow label="DSB Tier" value="Platinum" severity="fantastic" />
              <MetricRow label="DSB Score" value="84.35" severity="great" />
            </>
          )}
        </Section>

        {/* Customer Feedback */}
        <Section id="customer" title="Customer Feedback" icon="💬" severity={activeView === 'trailing' ? 'fair' : 'fair'}>
          {activeView === 'current' ? (
            <>
              <MetricRow label="Feedback Score" value={driver.customerFeedbackScore} severity="fair" />
              <MetricRow label="CDF DPMO" value={driver.cdfDpmo.toLocaleString()} severity="fair" />
              <MetricRow label="Negative Feedback" value={driver.negativeFeedbackCount} denominator={driver.packagesDelivered} severity="fair" indent />
              <MetricRow label="Escalation Defects" value={driver.escalationDefects} severity="great" />

              <SubLabel>Feedback Breakdown</SubLabel>
              <MetricRow label="Not Great" value={driver.negativeFeedback.notGreat} indent />
              <MetricRow label="Instructions Not Followed" value={driver.negativeFeedback.didNotFollowInstructions} indent />
              <MetricRow label="Wrong Address" value={driver.negativeFeedback.wrongAddress} indent />
              <MetricRow label="Never Received" value={driver.negativeFeedback.neverReceived} indent />
            </>
          ) : (
            <>
              <MetricRow label="CDF DPMO" value="2,693" severity="fair" />
              <MetricRow label="CDF Tier" value="Bronze" severity="poor" />
              <MetricRow label="CDF Score" value="0" severity="poor" />
              <MetricRow label="Customer Escalation Score" value="0" />
            </>
          )}
        </Section>

        {/* DVIC - Current view only */}
        {activeView === 'current' && (
          <Section id="dvic" title="Vehicle Inspections" icon="🔧" severity="fantastic">
            <MetricRow label="Rushed Inspections" value={driver.dvicRushedCount} denominator={driver.dvicTotalInspections} />
            {driver.dvicInspections.map((insp, i) => (
              <MetricRow key={i} label={insp.day} value={insp.time} severity={insp.severity} indent />
            ))}
          </Section>
        )}

        {/* Focus Area */}
        <Section id="focus" title="Focus Area" icon="🎯" severity="fantastic">
          <div style={{
            padding: '16px',
            background: theme.bg.card,
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: theme.severity.fantastic.text,
              marginBottom: '8px',
            }}>
              {driver.focusArea}
            </div>
            <p style={{
              fontSize: '13px',
              color: theme.text.secondary,
              lineHeight: '1.65',
              margin: 0,
            }}>
              {driver.focusGuidance}
            </p>
          </div>
        </Section>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '24px 0 8px',
        }}>
          <div style={{
            fontSize: '11px',
            color: theme.text.muted,
          }}>
            Powered by DRIVR Analytics
          </div>
        </div>
      </div>
    </div>
  )
}
