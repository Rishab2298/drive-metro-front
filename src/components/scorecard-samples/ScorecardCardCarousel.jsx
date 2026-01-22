/**
 * Scorecard 27: Card Carousel
 * Horizontal scrolling card sections
 * Swipeable cards with smooth momentum scrolling
 */

import { useState } from 'react'

const metricInfo = {
  onRoadSafetyScore: { title: "On-Road Safety Score", desc: "Overall driving safety assessment.", calc: "FICO (40%), Events (35%), Compliance (25%).", tips: ["Maintain safe distance"] },
  ficoScore: { title: "FICO Safety Score", desc: "Driving behavior score 300-850.", calc: "Braking, Acceleration, Cornering, Speed, Phone.", tips: ["Brake smoothly"] },
  ppsCompliance: { title: "PPS Compliance", desc: "Parking protocol rate.", calc: "(Compliant ÷ Total) × 100.", tips: ["Set parking brake first"] },
  pawPrint: { title: "Paw Print", desc: "Notification rate.", calc: "(Sent ÷ Required) × 100.", tips: ["Send approaching"] },
  distractions: { title: "Distractions", desc: "Per 100 deliveries.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Use DND"] },
  speeding: { title: "Speeding", desc: "Speed violations.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Watch speed"] },
  seatbelt: { title: "Seatbelt", desc: "Belt violations.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Buckle first"] },
  followingDistance: { title: "Following", desc: "Tailgating.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["3-4 sec gap"] },
  signals: { title: "Signals", desc: "Traffic violations.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Full stops"] },
  qualityScore: { title: "Quality Score", desc: "Quality tier.", calc: "DCR, POD, DSB.", tips: ["Complete all"] },
  dcr: { title: "DCR", desc: "Completion rate.", calc: "(Delivered ÷ Attempted) × 100.", tips: ["Attempt all"] },
  dnr: { title: "DNR", desc: "Not received.", calc: "DNR claims count.", tips: ["Clear photos"] },
  pod: { title: "POD", desc: "Photo rate.", calc: "(Accepted ÷ Opp) × 100.", tips: ["Step back"] },
  dsb: { title: "DSB", desc: "Delivery behaviors.", calc: "Best practices.", tips: ["Read notes"] },
  psb: { title: "PSB", desc: "Pickup behaviors.", calc: "Procedures.", tips: ["Scan right"] },
  feedbackScore: { title: "Feedback", desc: "Customer tier.", calc: "Based on DPMO.", tips: ["Be courteous"] },
  cdfDpmo: { title: "CDF DPMO", desc: "Defects per million.", calc: "(Neg ÷ Del) × 1M.", tips: ["Follow instructions"] },
  escalations: { title: "Escalations", desc: "Escalated issues.", calc: "Escalation count.", tips: ["Resolve early"] },
  dvic: { title: "DVIC", desc: "Rushed inspections.", calc: "Under 2 min count.", tips: ["Take time"] }
}

const sampleDriver = {
  name: "Joe Driver", firstName: "Joe", lastName: "Driver", dsp: "DSPX", station: "DXX1",
  week: 42, tier: "Platinum", rank: 12, total: 55, deliveries: 1254,
  note: "Great work! Watch your speed.", safety: "Platinum", fico: 670, pps: 71.7,
  ppsTotal: 251, ppsBrake: 60, ppsPark: 11, pawSent: 105, pawTotal: 120,
  distractions: 0.1, speeding: 0.8, seatbelt: 0.2, following: 0.3, signals: 0.1,
  quality: "Gold", dcr: 99.5, dnr: 2, podRate: 99.3, podTotal: 561, podRejects: 4,
  podBlurry: 2, podHuman: 1, podNoPackage: 1, dsb: 320, psb: 500, feedback: "Silver",
  dpmo: 2107, negCount: 3, escalations: 1, negNotGreat: 5, negInstructions: 2,
  negAddress: 2, negNever: 1, dvicRushed: 3, dvicTotal: 5,
  dvicList: [{ day: "Wed", time: "00:27", status: "fair" }, { day: "Thu", time: "00:20", status: "fair" }, { day: "Sat", time: "00:09", status: "poor" }],
  focus: "Customer Delivery Feedback", guidance: "Always read customer notes before delivery!"
}

const themes = {
  cream: { name: "Cream", bg: '#FAF9F6', card: '#FFFFFF', text: '#3D3A35', muted: '#9A968E', border: '#EBE8E2', accent: '#C0B098' },
  sage: { name: "Sage", bg: '#F5F8F5', card: '#FFFFFF', text: '#3A453A', muted: '#7A907A', border: '#D8E5D8', accent: '#7AA07A' },
  lavender: { name: "Lavender", bg: '#F8F6FA', card: '#FFFFFF', text: '#453A50', muted: '#8A80A0', border: '#E2DCE8', accent: '#9080B8' },
  rose: { name: "Rose", bg: '#FAF6F6', card: '#FFFFFF', text: '#4A3A3A', muted: '#A08888', border: '#EAE0E0', accent: '#C09898' },
  sky: { name: "Sky", bg: '#F5F8FA', card: '#FFFFFF', text: '#354550', muted: '#7090A0', border: '#D8E4EC', accent: '#70A0C0' }
}

const severity = {
  fantastic: { bg: '#F0ECF5', text: '#6050A0', dot: '#9080B8', gradient: 'linear-gradient(135deg, #F8F5FC, #EEEBF5)' },
  great: { bg: '#E8F2E8', text: '#406840', dot: '#70A070', gradient: 'linear-gradient(135deg, #F5FAF5, #E8F2E8)' },
  fair: { bg: '#FFF5E8', text: '#906820', dot: '#D0A040', gradient: 'linear-gradient(135deg, #FFFAF5, #FFF0E0)' },
  poor: { bg: '#FCE8E8', text: '#A04040', dot: '#D07070', gradient: 'linear-gradient(135deg, #FDF5F5, #FAE8E8)' }
}

export default function ScorecardCardCarousel({ driver = sampleDriver }) {
  const [view, setView] = useState('current')
  const [theme, setTheme] = useState('cream')
  const [modal, setModal] = useState(null)

  const t = themes[theme]
  const tierMap = { Platinum: 'fantastic', Gold: 'great', Silver: 'fair', Bronze: 'poor' }
  const tierColor = severity[tierMap[driver.tier]] || severity.fantastic

  const Modal = ({ data, onClose }) => {
    if (!data) return null
    const info = metricInfo[data.key] || { title: data.label, desc: '', calc: '', tips: [] }
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: t.card, borderRadius: '24px', maxWidth: '320px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
          <div style={{ padding: '28px', background: data.sev ? severity[data.sev].gradient : t.bg }}>
            <div style={{ fontSize: '18px', fontWeight: '600', color: t.text, marginBottom: '8px' }}>{info.title}</div>
            {data.value !== undefined && (
              <div style={{ fontSize: '48px', fontWeight: '800', color: data.sev ? severity[data.sev].text : t.text }}>{data.value}{data.suffix || ''}</div>
            )}
          </div>
          <div style={{ padding: '24px' }}>
            <p style={{ fontSize: '14px', color: t.muted, lineHeight: 1.6, margin: '0 0 16px' }}>{info.desc}</p>
            {info.calc && <div style={{ padding: '14px', background: t.bg, borderRadius: '12px', fontSize: '13px', color: t.text }}>{info.calc}</div>}
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <button onClick={onClose} style={{ width: '100%', padding: '16px', background: t.text, color: '#FFF', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  const MetricCard = ({ k, label, value, suffix = '', sev, icon, wide }) => (
    <div onClick={() => setModal({ key: k, label, value, suffix, sev })} style={{
      flexShrink: 0, width: wide ? '240px' : '140px', padding: '20px',
      background: sev ? severity[sev].gradient : t.card,
      borderRadius: '20px', cursor: 'pointer',
      border: `1px solid ${sev ? severity[sev].bg : t.border}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontSize: wide ? '36px' : '28px', fontWeight: '700', color: sev ? severity[sev].text : t.text, lineHeight: 1 }}>{value}</span>
        {suffix && <span style={{ fontSize: '14px', fontWeight: '500', color: t.muted }}>{suffix}</span>}
      </div>
    </div>
  )

  const scrollStyle = { display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }
  const cardStyle = { scrollSnapAlign: 'start' }

  return (
    <div style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", background: t.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: t.text }}>DiveMetric</div>
            <div style={{ fontSize: '12px', color: t.muted }}>Week {driver.week} Report</div>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: t.card, borderRadius: '12px', padding: '4px', border: `1px solid ${t.border}` }}>
            {[{ id: 'current', l: 'Now' }, { id: 'trailing', l: '6W' }].map(x => (
              <button key={x.id} onClick={() => setView(x.id)} style={{
                padding: '8px 14px', borderRadius: '10px', border: 'none',
                background: view === x.id ? t.bg : 'transparent',
                color: view === x.id ? t.text : t.muted,
                fontSize: '12px', fontWeight: '600', cursor: 'pointer'
              }}>{x.l}</button>
            ))}
          </div>
        </div>

        {/* Theme Selector */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {Object.entries(themes).map(([k, v]) => (
            <button key={k} onClick={() => setTheme(k)} style={{
              flex: 1, padding: '8px', borderRadius: '10px',
              background: theme === k ? v.card : 'transparent',
              border: theme === k ? `2px solid ${v.accent}` : `1px solid ${t.border}`,
              cursor: 'pointer'
            }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: v.accent, margin: '0 auto' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Profile Carousel */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: tierColor.gradient, borderRadius: '24px', padding: '24px',
          border: `1px solid ${tierColor.bg}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '18px',
              background: `linear-gradient(135deg, ${tierColor.dot}, ${tierColor.text})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: '700', color: '#FFF'
            }}>
              {driver.firstName[0]}{driver.lastName[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: t.text }}>{driver.name}</div>
              <div style={{ fontSize: '13px', color: t.muted }}>{driver.dsp} · {driver.station}</div>
            </div>
            <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.8)', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: t.muted }}>Rank</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: tierColor.text }}>#{driver.rank}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.6)', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: t.text }}>{driver.deliveries.toLocaleString()}</div>
              <div style={{ fontSize: '10px', color: t.muted, textTransform: 'uppercase' }}>Deliveries</div>
            </div>
            <div style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.6)', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: tierColor.text }}>{driver.tier}</div>
              <div style={{ fontSize: '10px', color: t.muted, textTransform: 'uppercase' }}>Tier</div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Carousel */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ padding: '0 20px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: t.text }}>Safety</span>
          <span style={{ fontSize: '11px', color: t.muted }}>Scroll →</span>
        </div>
        <div style={{ ...scrollStyle, padding: '0 20px' }}>
          <div style={cardStyle}><MetricCard k="ficoScore" label="FICO" value={driver.fico} sev={driver.fico >= 700 ? 'great' : 'fair'} icon="🛡️" wide /></div>
          <div style={cardStyle}><MetricCard k="ppsCompliance" label="PPS" value={driver.pps} suffix="%" /></div>
          <div style={cardStyle}><MetricCard k="pawPrint" label="Paw" value={Math.round(driver.pawSent / driver.pawTotal * 100)} suffix="%" sev="great" /></div>
          <div style={cardStyle}><MetricCard k="distractions" label="Distract" value={driver.distractions} /></div>
          <div style={cardStyle}><MetricCard k="speeding" label="Speed" value={driver.speeding} sev="poor" /></div>
          <div style={cardStyle}><MetricCard k="seatbelt" label="Belt" value={driver.seatbelt} sev="great" /></div>
          <div style={cardStyle}><MetricCard k="followingDistance" label="Follow" value={driver.following} sev="fair" /></div>
          <div style={cardStyle}><MetricCard k="signals" label="Signal" value={driver.signals} /></div>
        </div>
      </div>

      {/* Delivery Carousel */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ padding: '0 20px', marginBottom: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: t.text }}>Delivery</span>
        </div>
        <div style={{ ...scrollStyle, padding: '0 20px' }}>
          <div style={cardStyle}><MetricCard k="qualityScore" label="Quality" value={driver.quality} sev="great" icon="📦" wide /></div>
          <div style={cardStyle}><MetricCard k="dcr" label="DCR" value={driver.dcr} suffix="%" /></div>
          <div style={cardStyle}><MetricCard k="dnr" label="DNR" value={driver.dnr} sev="fair" /></div>
          <div style={cardStyle}><MetricCard k="pod" label="POD" value={driver.podRate} suffix="%" /></div>
          <div style={cardStyle}><MetricCard k="dsb" label="DSB" value={driver.dsb} sev="great" /></div>
          <div style={cardStyle}><MetricCard k="psb" label="PSB" value={driver.psb} sev="fair" /></div>
        </div>
      </div>

      {/* Feedback Carousel */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ padding: '0 20px', marginBottom: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: t.text }}>Feedback</span>
        </div>
        <div style={{ ...scrollStyle, padding: '0 20px' }}>
          <div style={cardStyle}><MetricCard k="feedbackScore" label="Tier" value={driver.feedback} sev="fair" icon="💬" wide /></div>
          <div style={cardStyle}><MetricCard k="cdfDpmo" label="DPMO" value={driver.dpmo} sev="fair" /></div>
          <div style={cardStyle}><MetricCard k="escalations" label="Escalate" value={driver.escalations} sev="great" /></div>
        </div>
      </div>

      {/* DVIC Carousel */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ padding: '0 20px', marginBottom: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: t.text }}>DVIC</span>
        </div>
        <div style={{ ...scrollStyle, padding: '0 20px' }}>
          <div style={cardStyle}><MetricCard k="dvic" label="Rushed" value={driver.dvicRushed} sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} icon="🔧" wide /></div>
          {driver.dvicList.map((x, i) => (
            <div key={i} style={cardStyle}><MetricCard k="dvic" label={x.day} value={x.time} sev={x.status} /></div>
          ))}
        </div>
      </div>

      {/* Focus Area */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${t.accent}20, ${t.accent}08)`,
          borderRadius: '20px', padding: '24px', border: `2px solid ${t.accent}30`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ fontSize: '20px' }}>🎯</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: t.accent, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Focus Area</span>
          </div>
          <div style={{ fontSize: '17px', fontWeight: '600', color: t.text, marginBottom: '10px' }}>{driver.focus}</div>
          <p style={{ fontSize: '14px', color: t.muted, lineHeight: 1.6, margin: 0 }}>{driver.guidance}</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px', textAlign: 'center', borderTop: `1px solid ${t.border}` }}>
        <div style={{ fontSize: '11px', color: t.muted }}>Swipe & tap for details · DiveMetric</div>
      </div>

      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
