/**
 * Scorecard 25: Sidebar Navigation
 * Fixed sidebar with scrollable content panels
 * App-like navigation with icon-based sidebar
 */

import { useState } from 'react'

const metricInfo = {
  onRoadSafetyScore: { title: "On-Road Safety Score", desc: "Overall driving safety assessment.", calc: "FICO (40%), Events (35%), Compliance (25%).", tips: ["Maintain safe following distance"] },
  ficoScore: { title: "FICO Safety Score", desc: "Driving behavior score from 300-850.", calc: "Braking, Acceleration, Cornering, Speed, Phone.", tips: ["Brake smoothly"] },
  ppsCompliance: { title: "Proper Park Sequence", desc: "Parking protocol compliance rate.", calc: "(Compliant ÷ Total) × 100.", tips: ["Set parking brake first"] },
  pawPrint: { title: "Paw Print Compliance", desc: "Customer notification rate.", calc: "(Sent ÷ Required) × 100.", tips: ["Send when approaching"] },
  distractions: { title: "Distractions", desc: "Phone events per 100 deliveries.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Use Do Not Disturb"] },
  speeding: { title: "Speeding", desc: "Speed violations per 100.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Watch for changes"] },
  seatbelt: { title: "Seatbelt", desc: "Belt violations per 100.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Buckle before starting"] },
  followingDistance: { title: "Following Distance", desc: "Tailgating events.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["3-4 second gap"] },
  signals: { title: "Signals", desc: "Traffic violations.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Complete stops"] },
  qualityScore: { title: "Quality Score", desc: "Overall quality tier.", calc: "DCR, POD, DSB weighted.", tips: ["Complete all deliveries"] },
  dcr: { title: "DCR", desc: "Delivery completion rate.", calc: "(Delivered ÷ Attempted) × 100.", tips: ["Attempt all packages"] },
  dnr: { title: "DNR", desc: "Delivered not received claims.", calc: "Count of DNR claims.", tips: ["Clear POD photos"] },
  pod: { title: "POD", desc: "Photo acceptance rate.", calc: "(Accepted ÷ Opportunities) × 100.", tips: ["Step back 3-4 feet"] },
  dsb: { title: "DSB", desc: "Delivery success behaviors.", calc: "Points for best practices.", tips: ["Read all notes"] },
  psb: { title: "PSB", desc: "Pickup success behaviors.", calc: "Points for procedures.", tips: ["Scan accurately"] },
  feedbackScore: { title: "Feedback Score", desc: "Customer feedback tier.", calc: "Based on CDF DPMO.", tips: ["Be courteous"] },
  cdfDpmo: { title: "CDF DPMO", desc: "Defects per million opportunities.", calc: "(Negative ÷ Deliveries) × 1M.", tips: ["Follow instructions"] },
  escalations: { title: "Escalations", desc: "Management escalations.", calc: "Count of escalated issues.", tips: ["Resolve proactively"] },
  dvic: { title: "DVIC", desc: "Rushed vehicle inspections.", calc: "Count under 2 minutes.", tips: ["Take full time"] }
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
  cream: { name: "Cream", bg: '#FDFCFA', sidebar: '#F5F3EF', card: '#FFFFFF', text: '#4A4540', muted: '#9A958D', border: '#E8E4DD', accent: '#C4B09A' },
  sage: { name: "Sage", bg: '#F8FAF8', sidebar: '#EEF3EE', card: '#FFFFFF', text: '#3D4D3D', muted: '#7A8F7A', border: '#DCE6DC', accent: '#7DA07D' },
  lavender: { name: "Lavender", bg: '#FAF9FC', sidebar: '#F2EFF7', card: '#FFFFFF', text: '#504860', muted: '#8A82A0', border: '#E4DEE8', accent: '#A090C0' },
  rose: { name: "Rose", bg: '#FCF9F9', sidebar: '#F8F0F0', card: '#FFFFFF', text: '#5A4848', muted: '#A09090', border: '#EAE2E2', accent: '#C8A0A0' },
  sky: { name: "Sky", bg: '#F9FBFC', sidebar: '#EDF3F8', card: '#FFFFFF', text: '#404D58', muted: '#7A90A0', border: '#DCE6EE', accent: '#80A8C8' }
}

const severity = {
  fantastic: { bg: '#F0ECF5', text: '#6B5B8A', dot: '#A090C0' },
  great: { bg: '#E8F2E8', text: '#4A6B4A', dot: '#7DA07D' },
  fair: { bg: '#FFF4E8', text: '#8A6840', dot: '#D0A060' },
  poor: { bg: '#FCE8E8', text: '#8A4848', dot: '#D08080' }
}

export default function ScorecardSidebarNav({ driver = sampleDriver }) {
  const [view, setView] = useState('current')
  const [theme, setTheme] = useState('cream')
  const [modal, setModal] = useState(null)
  const [section, setSection] = useState('overview')

  const t = themes[theme]
  const tierMap = { Platinum: 'fantastic', Gold: 'great', Silver: 'fair', Bronze: 'poor' }
  const tierColor = severity[tierMap[driver.tier]] || severity.fantastic

  const Modal = ({ data, onClose }) => {
    if (!data) return null
    const info = metricInfo[data.key] || { title: data.label, desc: '', calc: '', tips: [] }
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: t.card, borderRadius: '16px', maxWidth: '320px', width: '100%', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: t.text, marginBottom: '12px' }}>{info.title}</div>
            {data.value !== undefined && (
              <div style={{ fontSize: '32px', fontWeight: '700', color: data.sev ? severity[data.sev].text : t.text }}>{data.value}{data.suffix || ''}</div>
            )}
          </div>
          <div style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: '13px', color: t.muted, lineHeight: 1.6, margin: '0 0 16px' }}>{info.desc}</p>
            {info.calc && <div style={{ padding: '12px', background: t.sidebar, borderRadius: '8px', fontSize: '12px', color: t.text }}>{info.calc}</div>}
          </div>
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${t.border}` }}>
            <button onClick={onClose} style={{ width: '100%', padding: '12px', background: t.text, color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  const navItems = [
    { id: 'overview', icon: '◉', label: 'Overview' },
    { id: 'safety', icon: '🛡️', label: 'Safety' },
    { id: 'delivery', icon: '📦', label: 'Delivery' },
    { id: 'feedback', icon: '💬', label: 'Feedback' },
    { id: 'dvic', icon: '🔧', label: 'DVIC' }
  ]

  const DataRow = ({ k, label, value, suffix = '', sev }) => (
    <div onClick={() => setModal({ key: k, label, value, suffix, sev })} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 16px', background: t.card, borderRadius: '10px',
      marginBottom: '8px', cursor: 'pointer', border: `1px solid ${t.border}`
    }}>
      <span style={{ fontSize: '13px', color: t.text }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: sev ? severity[sev].text : t.text }}>{value}{suffix}</span>
        {sev && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: severity[sev].dot }} />}
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif", background: t.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '72px', background: t.sidebar, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#FFF' }}>DM</span>
        </div>

        {/* Nav Items */}
        {navItems.map(item => (
          <button key={item.id} onClick={() => setSection(item.id)} style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: section === item.id ? t.card : 'transparent',
            border: 'none', cursor: 'pointer', marginBottom: '8px',
            boxShadow: section === item.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', transition: 'all 0.2s'
          }} title={item.label}>
            {item.icon}
          </button>
        ))}

        {/* Theme Dots */}
        <div style={{ marginTop: 'auto', paddingBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {Object.entries(themes).map(([k, v]) => (
            <button key={k} onClick={() => setTheme(k)} style={{
              width: '12px', height: '12px', borderRadius: '50%',
              background: v.accent, border: theme === k ? '2px solid #FFF' : 'none',
              boxShadow: theme === k ? `0 0 0 1px ${v.accent}` : 'none',
              cursor: 'pointer'
            }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${t.border}`, background: t.card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Week {driver.week}</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: t.text }}>{driver.name}</div>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: t.sidebar, borderRadius: '8px', padding: '3px' }}>
              {[{ id: 'current', l: 'Now' }, { id: 'trailing', l: '6W' }].map(x => (
                <button key={x.id} onClick={() => setView(x.id)} style={{
                  padding: '6px 12px', borderRadius: '6px', border: 'none',
                  background: view === x.id ? t.card : 'transparent',
                  color: view === x.id ? t.text : t.muted,
                  fontSize: '11px', fontWeight: '500', cursor: 'pointer'
                }}>{x.l}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '6px 12px', background: tierColor.bg, borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: tierColor.text }}>{driver.tier}</span>
            </div>
            <span style={{ fontSize: '13px', color: t.muted }}>Rank #{driver.rank} of {driver.total}</span>
          </div>
        </div>

        {/* Section Content */}
        <div style={{ padding: '16px' }}>
          {section === 'overview' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Key Metrics</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {[
                    { k: 'ficoScore', l: 'FICO', v: driver.fico, s: driver.fico >= 700 ? 'great' : 'fair' },
                    { k: 'dcr', l: 'DCR', v: driver.dcr, x: '%' },
                    { k: 'cdfDpmo', l: 'DPMO', v: driver.dpmo, s: 'fair' },
                    { k: 'qualityScore', l: 'Quality', v: driver.quality, s: 'great' }
                  ].map(m => (
                    <div key={m.k} onClick={() => setModal({ key: m.k, label: m.l, value: m.v, suffix: m.x, sev: m.s })} style={{
                      padding: '16px', background: t.card, borderRadius: '12px', cursor: 'pointer', border: `1px solid ${t.border}`
                    }}>
                      <div style={{ fontSize: '10px', color: t.muted, marginBottom: '6px' }}>{m.l}</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: m.s ? severity[m.s].text : t.text }}>{m.v}{m.x || ''}</div>
                    </div>
                  ))}
                </div>
              </div>
              {driver.note && (
                <div style={{ padding: '16px', background: t.sidebar, borderRadius: '12px', borderLeft: `3px solid ${t.accent}` }}>
                  <div style={{ fontSize: '10px', color: t.accent, fontWeight: '600', marginBottom: '6px' }}>DSP NOTE</div>
                  <p style={{ fontSize: '13px', color: t.text, lineHeight: 1.5, margin: 0 }}>{driver.note}</p>
                </div>
              )}
            </>
          )}

          {section === 'safety' && (
            <>
              <div style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Safety Metrics</div>
              <DataRow k="onRoadSafetyScore" label="Safety Tier" value={driver.safety} sev="fantastic" />
              <DataRow k="ficoScore" label="FICO Score" value={driver.fico} sev={driver.fico >= 700 ? 'great' : 'fair'} />
              <DataRow k="ppsCompliance" label="PPS Compliance" value={driver.pps} suffix="%" />
              <DataRow k="pawPrint" label="Paw Print" value={Math.round(driver.pawSent / driver.pawTotal * 100)} suffix="%" sev="great" />
              <div style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', marginTop: '20px', marginBottom: '12px' }}>Events / 100</div>
              <DataRow k="distractions" label="Distractions" value={driver.distractions} />
              <DataRow k="speeding" label="Speeding" value={driver.speeding} sev="poor" />
              <DataRow k="seatbelt" label="Seatbelt" value={driver.seatbelt} sev="great" />
              <DataRow k="followingDistance" label="Following" value={driver.following} sev="fair" />
              <DataRow k="signals" label="Signals" value={driver.signals} />
            </>
          )}

          {section === 'delivery' && (
            <>
              <div style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Delivery Metrics</div>
              <DataRow k="qualityScore" label="Quality Tier" value={driver.quality} sev="great" />
              <DataRow k="dcr" label="Completion Rate" value={driver.dcr} suffix="%" />
              <DataRow k="dnr" label="DNR Claims" value={driver.dnr} sev="fair" />
              <DataRow k="pod" label="POD Rate" value={driver.podRate} suffix="%" />
              <DataRow k="dsb" label="DSB Score" value={driver.dsb} sev="great" />
              <DataRow k="psb" label="PSB Score" value={driver.psb} sev="fair" />
            </>
          )}

          {section === 'feedback' && (
            <>
              <div style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Customer Feedback</div>
              <DataRow k="feedbackScore" label="Feedback Tier" value={driver.feedback} sev="fair" />
              <DataRow k="cdfDpmo" label="CDF DPMO" value={driver.dpmo.toLocaleString()} sev="fair" />
              <DataRow k="escalations" label="Escalations" value={driver.escalations} sev="great" />
              <div style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', marginTop: '20px', marginBottom: '12px' }}>Breakdown</div>
              {[{ l: 'Not Great', v: driver.negNotGreat }, { l: 'Instructions', v: driver.negInstructions }, { l: 'Wrong Address', v: driver.negAddress }, { l: 'Never Received', v: driver.negNever }].map((x, i) => (
                <DataRow key={i} k="cdfDpmo" label={x.l} value={x.v} />
              ))}
            </>
          )}

          {section === 'dvic' && (
            <>
              <div style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Vehicle Inspections</div>
              <DataRow k="dvic" label="Rushed Inspections" value={`${driver.dvicRushed}/${driver.dvicTotal}`} sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} />
              <div style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', marginTop: '20px', marginBottom: '12px' }}>Inspection Log</div>
              {driver.dvicList.map((x, i) => (
                <DataRow key={i} k="dvic" label={x.day} value={x.time} sev={x.status} />
              ))}
              <div style={{ marginTop: '20px', padding: '16px', background: t.sidebar, borderRadius: '12px', borderLeft: `3px solid ${t.accent}` }}>
                <div style={{ fontSize: '10px', color: t.accent, fontWeight: '600', marginBottom: '6px' }}>FOCUS AREA</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '4px' }}>{driver.focus}</div>
                <p style={{ fontSize: '12px', color: t.muted, lineHeight: 1.5, margin: 0 }}>{driver.guidance}</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px', textAlign: 'center', borderTop: `1px solid ${t.border}` }}>
          <div style={{ fontSize: '10px', color: t.muted }}>Tap metrics for details · DiveMetric</div>
        </div>
      </div>

      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
