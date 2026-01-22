/**
 * Scorecard 22: DiveMetric Enterprise Suite
 * Minimal pastel design with 10 theme variants
 * Clickable metrics with explanatory modals
 */

import { useState } from 'react'

// Metric explanations
const metricInfo = {
  onRoadSafetyScore: {
    title: "On-Road Safety Score",
    desc: "Overall driving safety assessment combining FICO, speeding, seatbelt, and following distance metrics.",
    calc: "Weighted average: FICO (40%), Events (35%), Compliance (25%). Platinum ≥ 95%, Gold ≥ 85%, Silver ≥ 75%.",
    tips: ["Maintain safe following distance", "Always wear seatbelt", "Follow speed limits", "Avoid distractions"]
  },
  ficoScore: {
    title: "FICO Safety Score",
    desc: "Standardized driving behavior score from 300-850 measuring risk level based on telematics data.",
    calc: "Factors: Hard braking (25%), Acceleration (20%), Cornering (20%), Speed (20%), Phone use (15%).",
    tips: ["Brake smoothly and early", "Accelerate gradually", "Take corners at safe speeds"]
  },
  ppsCompliance: {
    title: "Proper Park Sequence",
    desc: "Compliance rate for Amazon's parking protocol: engage parking brake, shift to park, then exit.",
    calc: "(Compliant Stops ÷ Total Stops) × 100. Target: 95%+",
    tips: ["Always set parking brake first", "Shift to park before exiting", "Make it muscle memory"]
  },
  pawPrint: {
    title: "Paw Print Compliance",
    desc: "Rate of sending 'On my way' notifications to customers when approaching delivery location.",
    calc: "(Notifications Sent ÷ Required) × 100. Target: 90%+",
    tips: ["Send when approaching", "Helps customers prepare", "Reduces missed deliveries"]
  },
  distractions: {
    title: "Distractions Rate",
    desc: "Phone usage or other distraction events detected per 100 deliveries.",
    calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.5",
    tips: ["Use Do Not Disturb", "Pull over if needed", "Set navigation before driving"]
  },
  speeding: {
    title: "Speeding Events",
    desc: "Instances of exceeding posted speed limits per 100 deliveries.",
    calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.5",
    tips: ["Watch for speed changes", "Slow in residential areas", "Leave extra time"]
  },
  seatbelt: {
    title: "Seatbelt Compliance",
    desc: "Events where seatbelt was unfastened while vehicle moving, per 100 deliveries.",
    calc: "Events ÷ (Deliveries ÷ 100). Target: 0",
    tips: ["Buckle before starting", "Keep fastened between stops"]
  },
  followingDistance: {
    title: "Following Distance",
    desc: "Tailgating events where you followed too closely, per 100 deliveries.",
    calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.3",
    tips: ["Maintain 3-4 second gap", "Increase in bad weather"]
  },
  signals: {
    title: "Signal Violations",
    desc: "Stop sign or traffic light violations per 100 deliveries.",
    calc: "Events ÷ (Deliveries ÷ 100). Target: 0",
    tips: ["Complete stops always", "Don't rush yellow lights"]
  },
  qualityScore: {
    title: "Delivery Quality Score",
    desc: "Overall quality tier based on completion, POD, and success behaviors.",
    calc: "Weighted: DCR (40%), POD (30%), DSB (30%). Platinum ≥ 98%.",
    tips: ["Complete all deliveries", "Clear POD photos", "Follow instructions"]
  },
  dcr: {
    title: "Delivery Completion Rate",
    desc: "Percentage of packages successfully delivered vs attempted.",
    calc: "(Delivered ÷ Attempted) × 100. Target: 98%+",
    tips: ["Attempt all packages", "Use customer notes", "Call support if stuck"]
  },
  dnr: {
    title: "Delivered Not Received",
    desc: "Packages marked delivered but customer claims not received.",
    calc: "Count of DNR claims. Target: 0",
    tips: ["Clear POD photos", "Safe locations only", "Follow instructions exactly"]
  },
  pod: {
    title: "Photo-On-Delivery",
    desc: "Percentage of delivery photos accepted by quality system.",
    calc: "(Accepted ÷ Opportunities) × 100. Target: 98%+",
    tips: ["Step back 3-4 feet", "Good lighting", "Package clearly visible"]
  },
  dsb: {
    title: "Delivery Success Behaviors",
    desc: "Score for following Amazon's recommended delivery practices.",
    calc: "Points for: reading notes, safe locations, proper handling.",
    tips: ["Read all notes", "Choose safe spots", "Ring doorbell when appropriate"]
  },
  psb: {
    title: "Pickup Success Behaviors",
    desc: "Score for pickup and return best practices at station.",
    calc: "Points for: accurate scanning, proper handling, following procedures.",
    tips: ["Scan accurately", "Handle carefully", "Follow sequence"]
  },
  feedbackScore: {
    title: "Customer Feedback Score",
    desc: "Tier based on customer complaints and feedback rate.",
    calc: "Based on CDF DPMO. Lower complaints = higher tier.",
    tips: ["Be courteous", "Follow instructions", "Handle with care"]
  },
  cdfDpmo: {
    title: "CDF DPMO",
    desc: "Defects Per Million Opportunities - standardized negative feedback rate.",
    calc: "(Negative Count ÷ Deliveries) × 1,000,000. Target: < 1,500",
    tips: ["Follow all instructions", "Secure placement", "Professional manner"]
  },
  escalations: {
    title: "Escalation Defects",
    desc: "Issues requiring management escalation or formal complaints.",
    calc: "Count of escalated issues. Target: 0",
    tips: ["Resolve proactively", "Communicate clearly", "Call support early"]
  },
  dvic: {
    title: "DVIC Inspections",
    desc: "Vehicle inspections flagged as rushed (under 2 minutes).",
    calc: "Count of rushed inspections. Target: 0",
    tips: ["Take full time", "Check all items", "Report issues immediately"]
  }
}

// Sample data
const sampleDriver = {
  name: "Joe Driver",
  firstName: "Joe",
  lastName: "Driver",
  dsp: "DSPX",
  station: "DXX1",
  week: 42,
  tier: "Platinum",
  rank: 12,
  total: 55,
  deliveries: 1254,
  note: "Great work last week! Please keep an eye on your speed to get those speeding violations down to zero.",
  safety: "Platinum",
  fico: 670,
  pps: 71.7,
  ppsTotal: 251,
  ppsBrake: 60,
  ppsPark: 11,
  pawSent: 105,
  pawTotal: 120,
  distractions: 0.1,
  speeding: 0.8,
  seatbelt: 0.2,
  following: 0.3,
  signals: 0.1,
  quality: "Gold",
  dcr: 99.5,
  dnr: 2,
  podRate: 99.3,
  podTotal: 561,
  podRejects: 4,
  podBlurry: 2,
  podHuman: 1,
  podNoPackage: 1,
  dsb: 320,
  psb: 500,
  feedback: "Silver",
  dpmo: 2107,
  negCount: 3,
  escalations: 1,
  negNotGreat: 5,
  negInstructions: 2,
  negAddress: 2,
  negNever: 1,
  dvicRushed: 3,
  dvicTotal: 5,
  dvicList: [
    { day: "Wed 10/01", time: "00:27", status: "fair" },
    { day: "Thu 10/02", time: "00:20", status: "fair" },
    { day: "Sat 10/04", time: "00:09", status: "poor" }
  ],
  focus: "Customer Delivery Feedback",
  guidance: "Always read the customer notes before executing a delivery! These notes will aid you in the delivery and help to ensure your success."
}

// 10 Pastel themes
const themes = {
  cream: {
    name: "Cream",
    bg: '#FFFDF7', card: '#FFFFFF', subtle: '#FAF8F5',
    text: '#5C5470', muted: '#9E9AA7', border: '#EBE8E2',
    accent: '#B8A99A'
  },
  sage: {
    name: "Sage",
    bg: '#F7FAF7', card: '#FFFFFF', subtle: '#EFF5EF',
    text: '#4A5D4A', muted: '#8B9E8B', border: '#DCE6DC',
    accent: '#7D9B7D'
  },
  lavender: {
    name: "Lavender",
    bg: '#FAF8FC', card: '#FFFFFF', subtle: '#F3EFF8',
    text: '#5D5470', muted: '#9A94A7', border: '#E6E0ED',
    accent: '#A594C0'
  },
  rose: {
    name: "Rose",
    bg: '#FDF8F8', card: '#FFFFFF', subtle: '#FAF0F0',
    text: '#705454', muted: '#A79494', border: '#EDE4E4',
    accent: '#C9A5A5'
  },
  sky: {
    name: "Sky",
    bg: '#F7FAFC', card: '#FFFFFF', subtle: '#EEF4F8',
    text: '#4A5568', muted: '#8B96A3', border: '#DCE4EB',
    accent: '#7DA3C0'
  },
  mint: {
    name: "Mint",
    bg: '#F5FAFA', card: '#FFFFFF', subtle: '#E8F4F2',
    text: '#3D5A58', muted: '#7A9E9B', border: '#D4E6E3',
    accent: '#6DBAB3'
  },
  peach: {
    name: "Peach",
    bg: '#FFFAF5', card: '#FFFFFF', subtle: '#FFF3EA',
    text: '#6B5344', muted: '#A99485', border: '#F0E5DB',
    accent: '#D4A574'
  },
  cloud: {
    name: "Cloud",
    bg: '#F8F9FA', card: '#FFFFFF', subtle: '#F1F3F5',
    text: '#495057', muted: '#868E96', border: '#DEE2E6',
    accent: '#748DA6'
  },
  blush: {
    name: "Blush",
    bg: '#FEF9F7', card: '#FFFFFF', subtle: '#FCF2EE',
    text: '#6B4F4F', muted: '#A38888', border: '#EEE3DF',
    accent: '#C99191'
  },
  stone: {
    name: "Stone",
    bg: '#FAFAF9', card: '#FFFFFF', subtle: '#F5F5F4',
    text: '#44403C', muted: '#A8A29E', border: '#E7E5E4',
    accent: '#8C8680'
  }
}

// Pastel severity colors
const severity = {
  fantastic: { bg: '#F3EFF8', text: '#7C6A99', dot: '#A594C0' },
  great: { bg: '#EFF5EF', text: '#5A7A5A', dot: '#7D9B7D' },
  fair: { bg: '#FFF5EB', text: '#9A7355', dot: '#D4A574' },
  poor: { bg: '#FCF0F0', text: '#996666', dot: '#C99191' }
}

export default function ScorecardEnterpriseSuite({ driver = sampleDriver }) {
  const [view, setView] = useState('current')
  const [theme, setTheme] = useState('cream')
  const [modal, setModal] = useState(null)
  const [sections, setSections] = useState({
    safety: true, delivery: true, customer: true, dvic: true, focus: true
  })

  const t = themes[theme]
  const tierSeverity = { Platinum: 'fantastic', Gold: 'great', Silver: 'fair', Bronze: 'poor' }

  // Modal
  const Modal = ({ data, onClose }) => {
    if (!data) return null
    const info = metricInfo[data.key] || { title: data.label, desc: '', calc: '', tips: [] }
    return (
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', zIndex: 1000, backdropFilter: 'blur(4px)'
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: '#FFFFFF', borderRadius: '20px', maxWidth: '360px',
          width: '100%', maxHeight: '75vh', overflow: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
        }}>
          <div style={{ padding: '24px 24px 20px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '600', color: t.text, margin: 0, lineHeight: 1.3 }}>
                {info.title}
              </h3>
              <button onClick={onClose} style={{
                width: '28px', height: '28px', borderRadius: '8px', border: 'none',
                background: t.subtle, cursor: 'pointer', fontSize: '16px', color: t.muted
              }}>×</button>
            </div>
            {data.value !== undefined && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', background: data.sev ? severity[data.sev].bg : t.subtle,
                borderRadius: '16px'
              }}>
                <span style={{
                  fontSize: '18px', fontWeight: '600',
                  color: data.sev ? severity[data.sev].text : t.text
                }}>
                  {data.value}{data.suffix || ''}
                </span>
                {data.denom && <span style={{ fontSize: '13px', color: t.muted }}>/ {data.denom}</span>}
              </div>
            )}
          </div>
          <div style={{ padding: '20px 24px' }}>
            {info.desc && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', color: t.muted, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
              </div>
            )}
            {info.calc && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Calculation
                </div>
                <p style={{
                  fontSize: '12px', color: t.text, lineHeight: 1.5, margin: 0,
                  padding: '12px', background: t.subtle, borderRadius: '10px'
                }}>{info.calc}</p>
              </div>
            )}
            {info.tips?.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  Tips
                </div>
                {info.tips.map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'
                  }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: severity.great.bg, color: severity.great.text,
                      fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>✓</div>
                    <span style={{ fontSize: '13px', color: t.text }}>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Metric Row
  const Row = ({ k, label, value, denom, suffix = '', sev, indent }) => (
    <div
      onClick={() => setModal({ key: k, label, value, denom, suffix, sev })}
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
        }}>{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.35 }}>
          <circle cx="12" cy="12" r="10" stroke={t.muted} strokeWidth="2"/>
          <path d="M12 16V12M12 8H12.01" stroke={t.muted} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {sev && !indent && (
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: severity[sev].dot }} />
        )}
        <span style={{
          fontSize: '13px', fontWeight: '600',
          color: sev ? severity[sev].text : t.text,
          fontVariantNumeric: 'tabular-nums'
        }}>
          {value}{suffix}
          {denom && <span style={{ fontWeight: '400', color: t.muted }}>/{denom}</span>}
        </span>
      </div>
    </div>
  )

  // Section
  const Section = ({ id, title, icon, sev, children }) => {
    const open = sections[id]
    const s = severity[sev]
    return (
      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={() => setSections(p => ({ ...p, [id]: !p[id] }))}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', background: s.bg, border: 'none',
            borderRadius: open ? '14px 14px 0 0' : '14px', cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>{icon}</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: s.text }}>{title}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
            <path d="M6 9L12 15L18 9" stroke={s.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div style={{
            background: t.card, borderRadius: '0 0 14px 14px',
            border: `1px solid ${t.border}`, borderTop: 'none', overflow: 'hidden'
          }}>
            {children}
          </div>
        )}
      </div>
    )
  }

  // Sublabel
  const Sub = ({ children }) => (
    <div style={{ padding: '10px 16px 6px', background: t.subtle, borderBottom: `1px solid ${t.border}` }}>
      <span style={{ fontSize: '10px', fontWeight: '600', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {children}
      </span>
    </div>
  )

  const tierColor = severity[tierSeverity[driver.tier]] || severity.fantastic

  return (
    <div style={{
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      background: t.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto'
    }}>
      {/* Theme Selector */}
      <div style={{
        padding: '10px 16px', background: t.card, borderBottom: `1px solid ${t.border}`,
        display: 'flex', gap: '6px', overflowX: 'auto'
      }}>
        {Object.entries(themes).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setTheme(k)}
            style={{
              padding: '5px 10px', borderRadius: '6px', whiteSpace: 'nowrap',
              border: theme === k ? `1.5px solid ${v.accent}` : '1.5px solid transparent',
              background: theme === k ? v.bg : t.subtle,
              color: theme === k ? v.accent : t.muted,
              fontSize: '11px', fontWeight: '500', cursor: 'pointer'
            }}
          >{v.name}</button>
        ))}
      </div>

      {/* Header */}
      <div style={{ padding: '20px 16px 0', background: t.card }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em' }}>
            DiveMetric
          </div>
          <div style={{
            padding: '5px 10px', background: t.subtle, borderRadius: '6px',
            fontSize: '11px', color: t.muted, fontWeight: '500'
          }}>
            Week {driver.week}
          </div>
        </div>

        {/* Profile */}
        <div style={{
          background: t.card, borderRadius: '14px', padding: '18px',
          border: `1px solid ${t.border}`, marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '11px',
              background: `linear-gradient(135deg, ${tierColor.dot}, ${tierColor.text})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '600', color: '#FFF'
            }}>
              {driver.firstName[0]}{driver.lastName[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: t.text }}>{driver.name}</div>
              <div style={{ fontSize: '12px', color: t.muted }}>{driver.dsp} · {driver.station}</div>
            </div>
            <div style={{
              padding: '5px 12px', background: tierColor.bg, borderRadius: '14px',
              fontSize: '11px', fontWeight: '600', color: tierColor.text
            }}>{driver.tier}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { l: 'Deliveries', v: driver.deliveries.toLocaleString() },
              { l: 'Rank', v: `#${driver.rank}`, s: `of ${driver.total}` },
              { l: 'FICO', v: driver.fico }
            ].map((x, i) => (
              <div key={i} style={{
                background: t.subtle, borderRadius: '10px', padding: '10px 8px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: t.text }}>
                  {x.v}
                  {x.s && <span style={{ fontSize: '10px', color: t.muted, fontWeight: '400' }}> {x.s}</span>}
                </div>
                <div style={{ fontSize: '9px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: t.subtle, borderRadius: '10px', padding: '3px', marginBottom: '16px'
        }}>
          {[{ id: 'current', l: 'Current Week' }, { id: 'trailing', l: '6-Week Trailing' }].map(x => (
            <button
              key={x.id}
              onClick={() => setView(x.id)}
              style={{
                flex: 1, padding: '9px', borderRadius: '8px', border: 'none',
                background: view === x.id ? t.card : 'transparent',
                color: view === x.id ? t.text : t.muted,
                fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                boxShadow: view === x.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >{x.l}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px 32px' }}>
        {/* Note */}
        {driver.note && (
          <div style={{
            background: t.card, borderRadius: '14px', padding: '14px',
            border: `1px solid ${t.border}`, borderLeft: `3px solid ${t.accent}`, marginBottom: '12px'
          }}>
            <div style={{ fontSize: '10px', fontWeight: '600', color: t.accent, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              DSP Note
            </div>
            <p style={{ fontSize: '12px', color: t.muted, lineHeight: 1.5, margin: 0 }}>{driver.note}</p>
          </div>
        )}

        {/* Safety */}
        <Section id="safety" title="Driving Safety" icon="🛡️" sev="fantastic">
          <Row k="onRoadSafetyScore" label="On-Road Safety" value={driver.safety} sev="fantastic" />
          <Row k="ficoScore" label="FICO Score" value={driver.fico} denom={850} sev={driver.fico >= 800 ? 'fantastic' : driver.fico >= 700 ? 'great' : 'fair'} />
          <Row k="ppsCompliance" label="PPS Compliance" value={driver.pps} suffix="%" />
          <Row k="ppsCompliance" label="Parking Brake Missed" value={driver.ppsBrake} denom={driver.ppsTotal} indent />
          <Row k="ppsCompliance" label="Shift to Park Missed" value={driver.ppsPark} denom={driver.ppsTotal} indent />
          <Row k="pawPrint" label="Paw Print Compliance" value={driver.pawSent} denom={driver.pawTotal} sev="great" />
          <Sub>Events per 100 Deliveries</Sub>
          <Row k="distractions" label="Distractions" value={driver.distractions} />
          <Row k="speeding" label="Speeding" value={driver.speeding} sev="poor" />
          <Row k="seatbelt" label="Seatbelt Off" value={driver.seatbelt} sev="great" />
          <Row k="followingDistance" label="Following Distance" value={driver.following} sev="fair" />
          <Row k="signals" label="Signal Violations" value={driver.signals} />
        </Section>

        {/* Delivery */}
        <Section id="delivery" title="Delivery Quality" icon="📦" sev="great">
          <Row k="qualityScore" label="Quality Score" value={driver.quality} sev="great" />
          <Row k="dcr" label="Completion Rate" value={driver.dcr} suffix="%" />
          <Row k="dnr" label="Delivered Not Received" value={driver.dnr} denom={driver.deliveries} sev="fair" />
          <Row k="pod" label="POD Acceptance" value={driver.podRate} suffix="%" />
          <Row k="pod" label="POD Rejects" value={driver.podRejects} denom={driver.podTotal} />
          <Row k="pod" label="Blurry Photo" value={driver.podBlurry} indent />
          <Row k="pod" label="Human in Photo" value={driver.podHuman} indent />
          <Row k="pod" label="No Package Detected" value={driver.podNoPackage} indent />
          <Row k="dsb" label="Delivery Success Behaviors" value={driver.dsb} sev="great" />
          <Row k="psb" label="Pickup Success Behaviors" value={driver.psb} sev="fair" />
        </Section>

        {/* Customer */}
        <Section id="customer" title="Customer Feedback" icon="💬" sev="fair">
          <Row k="feedbackScore" label="Feedback Score" value={driver.feedback} sev="fair" />
          <Row k="cdfDpmo" label="CDF DPMO" value={driver.dpmo.toLocaleString()} sev="fair" />
          <Row k="cdfDpmo" label="Negative Feedback" value={driver.negCount} denom={driver.deliveries} indent />
          <Row k="escalations" label="Escalation Defects" value={driver.escalations} sev="great" />
          <Sub>Feedback Breakdown</Sub>
          <Row k="cdfDpmo" label="Not Great" value={driver.negNotGreat} indent />
          <Row k="cdfDpmo" label="Did Not Follow Instructions" value={driver.negInstructions} indent />
          <Row k="cdfDpmo" label="Wrong Address" value={driver.negAddress} indent />
          <Row k="cdfDpmo" label="Never Received" value={driver.negNever} indent />
        </Section>

        {/* DVIC */}
        <Section id="dvic" title="Vehicle Inspections" icon="🔧" sev="fantastic">
          <Row k="dvic" label="Rushed Inspections" value={driver.dvicRushed} denom={driver.dvicTotal} />
          {driver.dvicList.map((x, i) => (
            <Row key={i} k="dvic" label={x.day} value={x.time} sev={x.status} indent />
          ))}
        </Section>

        {/* Focus */}
        <Section id="focus" title="Focus Area" icon="🎯" sev="fantastic">
          <div style={{ padding: '14px', background: t.card }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: t.accent, marginBottom: '6px' }}>
              {driver.focus}
            </div>
            <p style={{ fontSize: '12px', color: t.muted, lineHeight: 1.5, margin: 0 }}>{driver.guidance}</p>
          </div>
        </Section>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
          <div style={{ fontSize: '10px', color: t.muted }}>
            Tap any metric for details · DiveMetric Analytics
          </div>
        </div>
      </div>

      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
