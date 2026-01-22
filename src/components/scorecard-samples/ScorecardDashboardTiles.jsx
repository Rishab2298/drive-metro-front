/**
 * Scorecard 24: Dashboard Tiles
 * Modular tile-based layout with customizable grid
 * Modern dashboard aesthetic with rounded tiles
 */

import { useState } from 'react'

const metricInfo = {
  onRoadSafetyScore: { title: "On-Road Safety Score", desc: "Overall driving safety assessment combining FICO, speeding, seatbelt, and following distance metrics.", calc: "Weighted average: FICO (40%), Events (35%), Compliance (25%).", tips: ["Maintain safe following distance", "Always wear seatbelt"] },
  ficoScore: { title: "FICO Safety Score", desc: "Standardized driving behavior score from 300-850.", calc: "Factors: Hard braking, Acceleration, Cornering, Speed, Phone use.", tips: ["Brake smoothly", "Accelerate gradually"] },
  ppsCompliance: { title: "Proper Park Sequence", desc: "Compliance rate for parking protocol.", calc: "(Compliant Stops ÷ Total Stops) × 100.", tips: ["Set parking brake first"] },
  pawPrint: { title: "Paw Print Compliance", desc: "Rate of sending notifications to customers.", calc: "(Notifications Sent ÷ Required) × 100.", tips: ["Send when approaching"] },
  distractions: { title: "Distractions Rate", desc: "Phone usage events per 100 deliveries.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Use Do Not Disturb"] },
  speeding: { title: "Speeding Events", desc: "Exceeding posted speed limits.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Watch for speed changes"] },
  seatbelt: { title: "Seatbelt Compliance", desc: "Seatbelt unfastened while moving.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Buckle before starting"] },
  followingDistance: { title: "Following Distance", desc: "Tailgating events.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Maintain 3-4 second gap"] },
  signals: { title: "Signal Violations", desc: "Traffic violations per 100.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Complete stops always"] },
  qualityScore: { title: "Delivery Quality Score", desc: "Overall quality tier.", calc: "Weighted: DCR, POD, DSB.", tips: ["Complete all deliveries"] },
  dcr: { title: "Delivery Completion Rate", desc: "Successfully delivered vs attempted.", calc: "(Delivered ÷ Attempted) × 100.", tips: ["Attempt all packages"] },
  dnr: { title: "Delivered Not Received", desc: "Customer claims not received.", calc: "Count of DNR claims.", tips: ["Clear POD photos"] },
  pod: { title: "Photo-On-Delivery", desc: "Photos accepted by quality system.", calc: "(Accepted ÷ Opportunities) × 100.", tips: ["Step back 3-4 feet"] },
  dsb: { title: "Delivery Success Behaviors", desc: "Recommended delivery practices.", calc: "Points for notes, locations, handling.", tips: ["Read all notes"] },
  psb: { title: "Pickup Success Behaviors", desc: "Pickup best practices.", calc: "Points for scanning, handling.", tips: ["Scan accurately"] },
  feedbackScore: { title: "Customer Feedback Score", desc: "Based on complaints.", calc: "Based on CDF DPMO.", tips: ["Be courteous"] },
  cdfDpmo: { title: "CDF DPMO", desc: "Defects Per Million Opportunities.", calc: "(Negative ÷ Deliveries) × 1M.", tips: ["Follow instructions"] },
  escalations: { title: "Escalation Defects", desc: "Issues requiring escalation.", calc: "Count of escalated issues.", tips: ["Resolve proactively"] },
  dvic: { title: "DVIC Inspections", desc: "Rushed inspections.", calc: "Count under 2 minutes.", tips: ["Take full time"] }
}

const sampleDriver = {
  name: "Joe Driver", firstName: "Joe", lastName: "Driver", dsp: "DSPX", station: "DXX1",
  week: 42, tier: "Platinum", rank: 12, total: 55, deliveries: 1254,
  note: "Great work last week! Please keep an eye on your speed.",
  safety: "Platinum", fico: 670, pps: 71.7, ppsTotal: 251, ppsBrake: 60, ppsPark: 11,
  pawSent: 105, pawTotal: 120, distractions: 0.1, speeding: 0.8, seatbelt: 0.2,
  following: 0.3, signals: 0.1, quality: "Gold", dcr: 99.5, dnr: 2, podRate: 99.3,
  podTotal: 561, podRejects: 4, podBlurry: 2, podHuman: 1, podNoPackage: 1,
  dsb: 320, psb: 500, feedback: "Silver", dpmo: 2107, negCount: 3, escalations: 1,
  negNotGreat: 5, negInstructions: 2, negAddress: 2, negNever: 1,
  dvicRushed: 3, dvicTotal: 5,
  dvicList: [{ day: "Wed 10/01", time: "00:27", status: "fair" }, { day: "Thu 10/02", time: "00:20", status: "fair" }, { day: "Sat 10/04", time: "00:09", status: "poor" }],
  focus: "Customer Delivery Feedback", guidance: "Always read the customer notes before executing a delivery!"
}

const themes = {
  cream: { name: "Cream", bg: '#FAF9F6', card: '#FFFFFF', subtle: '#F5F4F1', text: '#3D3D3D', muted: '#8E8E8E', border: '#E8E6E1', accent: '#C4B5A0' },
  sage: { name: "Sage", bg: '#F5F7F5', card: '#FFFFFF', subtle: '#EDF2ED', text: '#3D4A3D', muted: '#7A8B7A', border: '#D8E2D8', accent: '#8FAF8F' },
  lavender: { name: "Lavender", bg: '#F8F6FA', card: '#FFFFFF', subtle: '#F0ECF5', text: '#4A4255', muted: '#8A82A0', border: '#E2DCE8', accent: '#B0A0C8' },
  rose: { name: "Rose", bg: '#FAF6F6', card: '#FFFFFF', subtle: '#F8EEEE', text: '#5A4545', muted: '#A08888', border: '#EAE0E0', accent: '#D4A5A5' },
  sky: { name: "Sky", bg: '#F5F8FA', card: '#FFFFFF', subtle: '#EBF2F7', text: '#3D4A55', muted: '#7A8FA0', border: '#D8E4EC', accent: '#8FB8D4' }
}

const severity = {
  fantastic: { bg: '#F0ECF5', text: '#6B5B8A', dot: '#B0A0C8', light: '#F8F6FA' },
  great: { bg: '#EDF2ED', text: '#4A6B4A', dot: '#8FAF8F', light: '#F5F8F5' },
  fair: { bg: '#FFF4E8', text: '#8A6A40', dot: '#D4A860', light: '#FFFAF5' },
  poor: { bg: '#FAE8E8', text: '#8A5050', dot: '#D48080', light: '#FDF5F5' }
}

export default function ScorecardDashboardTiles({ driver = sampleDriver }) {
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
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: t.card, borderRadius: '24px', maxWidth: '340px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
          <div style={{ padding: '28px', background: data.sev ? severity[data.sev].light : t.subtle }}>
            <div style={{ fontSize: '18px', fontWeight: '600', color: t.text, marginBottom: '8px' }}>{info.title}</div>
            {data.value !== undefined && (
              <div style={{ fontSize: '42px', fontWeight: '700', color: data.sev ? severity[data.sev].text : t.text }}>{data.value}{data.suffix || ''}</div>
            )}
          </div>
          <div style={{ padding: '24px' }}>
            <p style={{ fontSize: '14px', color: t.muted, lineHeight: 1.6, margin: '0 0 16px' }}>{info.desc}</p>
            {info.calc && <div style={{ padding: '16px', background: t.subtle, borderRadius: '12px', fontSize: '13px', color: t.text, marginBottom: '16px' }}>{info.calc}</div>}
            <button onClick={onClose} style={{ width: '100%', padding: '14px', background: t.text, color: '#FFF', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Done</button>
          </div>
        </div>
      </div>
    )
  }

  const Tile = ({ k, label, value, suffix = '', sev, size = 'small', icon }) => {
    const isLarge = size === 'large'
    const isMedium = size === 'medium'
    return (
      <div
        onClick={() => setModal({ key: k, label, value, suffix, sev })}
        style={{
          background: t.card,
          borderRadius: '20px',
          padding: isLarge ? '24px' : isMedium ? '18px' : '16px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: `1px solid ${t.border}`,
          gridColumn: isLarge ? 'span 2' : 'span 1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: isLarge ? '120px' : isMedium ? '100px' : '85px',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '11px', fontWeight: '500', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</span>
          {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <span style={{ fontSize: isLarge ? '36px' : isMedium ? '28px' : '24px', fontWeight: '700', color: sev ? severity[sev].text : t.text, lineHeight: 1 }}>
            {value}{suffix}
          </span>
          {sev && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: severity[sev].dot, marginBottom: '6px' }} />}
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", background: t.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Theme Selector */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {Object.entries(themes).map(([k, v]) => (
          <button key={k} onClick={() => setTheme(k)} style={{
            width: '28px', height: '28px', borderRadius: '14px',
            background: v.accent, border: theme === k ? '3px solid #FFF' : '3px solid transparent',
            boxShadow: theme === k ? `0 0 0 2px ${v.accent}` : 'none',
            cursor: 'pointer'
          }} />
        ))}
      </div>

      {/* Header */}
      <div style={{ padding: '16px 16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: t.text }}>DiveMetric</div>
            <div style={{ fontSize: '12px', color: t.muted }}>Week {driver.week} Dashboard</div>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: t.subtle, borderRadius: '12px', padding: '4px' }}>
            {[{ id: 'current', l: 'Now' }, { id: 'trailing', l: '6W' }].map(x => (
              <button key={x.id} onClick={() => setView(x.id)} style={{
                padding: '8px 14px', borderRadius: '10px', border: 'none',
                background: view === x.id ? t.card : 'transparent',
                color: view === x.id ? t.text : t.muted,
                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                boxShadow: view === x.id ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
              }}>{x.l}</button>
            ))}
          </div>
        </div>

        {/* Profile Card */}
        <div style={{
          background: `linear-gradient(135deg, ${tierColor.light}, ${t.card})`,
          borderRadius: '24px', padding: '20px',
          border: `1px solid ${t.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: `linear-gradient(135deg, ${tierColor.dot}, ${tierColor.text})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '700', color: '#FFF'
            }}>
              {driver.firstName[0]}{driver.lastName[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '17px', fontWeight: '600', color: t.text }}>{driver.name}</div>
              <div style={{ fontSize: '13px', color: t.muted }}>{driver.dsp} · {driver.station}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: tierColor.text, padding: '4px 10px', background: tierColor.bg, borderRadius: '8px', marginBottom: '4px' }}>{driver.tier}</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: t.text }}>#{driver.rank}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div style={{ padding: '0 16px 20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {/* Hero Tiles */}
        <Tile k="ficoScore" label="FICO Score" value={driver.fico} sev={driver.fico >= 750 ? 'fantastic' : driver.fico >= 650 ? 'great' : 'fair'} size="large" icon="🛡️" />
        <Tile k="qualityScore" label="Quality" value={driver.quality} sev="great" size="medium" icon="📦" />
        <Tile k="feedbackScore" label="Feedback" value={driver.feedback} sev="fair" size="medium" icon="💬" />

        {/* Delivery Stats */}
        <Tile k="dcr" label="DCR" value={driver.dcr} suffix="%" size="small" />
        <Tile k="cdfDpmo" label="DPMO" value={driver.dpmo.toLocaleString()} sev="fair" size="small" />
        <Tile k="ppsCompliance" label="PPS" value={driver.pps} suffix="%" size="small" />
        <Tile k="pawPrint" label="Paw Print" value={Math.round(driver.pawSent / driver.pawTotal * 100)} suffix="%" sev="great" size="small" />
      </div>

      {/* Events Section */}
      <div style={{ padding: '0 16px 20px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: t.text, marginBottom: '12px', paddingLeft: '4px' }}>Events / 100 Deliveries</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { k: 'distractions', l: 'Distract', v: driver.distractions },
            { k: 'speeding', l: 'Speed', v: driver.speeding, s: 'poor' },
            { k: 'seatbelt', l: 'Belt', v: driver.seatbelt, s: 'great' },
            { k: 'followingDistance', l: 'Follow', v: driver.following, s: 'fair' },
            { k: 'signals', l: 'Signal', v: driver.signals }
          ].map(x => (
            <div key={x.k} onClick={() => setModal({ key: x.k, label: x.l, value: x.v, sev: x.s })} style={{
              background: t.card, borderRadius: '14px', padding: '14px', cursor: 'pointer',
              border: `1px solid ${t.border}`
            }}>
              <div style={{ fontSize: '10px', color: t.muted, marginBottom: '6px' }}>{x.l}</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: x.s ? severity[x.s].text : t.text }}>{x.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* POD & Delivery */}
      <div style={{ padding: '0 16px 20px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: t.text, marginBottom: '12px', paddingLeft: '4px' }}>Delivery Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <Tile k="pod" label="POD Rate" value={driver.podRate} suffix="%" size="small" />
          <Tile k="dnr" label="DNR Claims" value={driver.dnr} sev="fair" size="small" />
          <Tile k="dsb" label="DSB" value={driver.dsb} sev="great" size="small" />
          <Tile k="psb" label="PSB" value={driver.psb} sev="fair" size="small" />
        </div>
      </div>

      {/* DVIC */}
      <div style={{ padding: '0 16px 20px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: t.text, marginBottom: '12px', paddingLeft: '4px' }}>Vehicle Inspections</div>
        <div style={{ background: t.card, borderRadius: '16px', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
          <div onClick={() => setModal({ key: 'dvic', label: 'Rushed Inspections', value: driver.dvicRushed, sev: driver.dvicRushed > 0 ? 'fair' : 'fantastic' })} style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: `1px solid ${t.border}` }}>
            <span style={{ fontSize: '13px', color: t.text }}>Rushed Inspections</span>
            <span style={{ fontSize: '18px', fontWeight: '700', color: driver.dvicRushed > 0 ? severity.fair.text : severity.fantastic.text }}>{driver.dvicRushed}/{driver.dvicTotal}</span>
          </div>
          {driver.dvicList.map((x, i) => (
            <div key={i} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', background: i % 2 === 0 ? t.subtle : t.card }}>
              <span style={{ fontSize: '12px', color: t.muted }}>{x.day}</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: severity[x.status].text }}>{x.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Focus Area */}
      <div style={{ padding: '0 16px 32px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${t.accent}15, ${t.accent}05)`,
          borderRadius: '20px', padding: '20px',
          border: `2px solid ${t.accent}30`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>🎯</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: t.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Focus Area</span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: t.text, marginBottom: '8px' }}>{driver.focus}</div>
          <p style={{ fontSize: '13px', color: t.muted, lineHeight: 1.5, margin: 0 }}>{driver.guidance}</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px', textAlign: 'center', borderTop: `1px solid ${t.border}` }}>
        <div style={{ fontSize: '11px', color: t.muted }}>Tap tiles for details · DiveMetric</div>
      </div>

      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
