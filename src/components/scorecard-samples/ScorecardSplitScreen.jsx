/**
 * Scorecard 28: Split Screen
 * Two-column layout with fixed left summary
 * Desktop-inspired split view adapted for mobile
 */

import { useState } from 'react'

const metricInfo = {
  onRoadSafetyScore: { title: "On-Road Safety", desc: "Overall safety assessment.", calc: "FICO + Events + Compliance.", tips: ["Safe distance"] },
  ficoScore: { title: "FICO Score", desc: "Behavior score 300-850.", calc: "Braking, Speed, Phone.", tips: ["Brake smooth"] },
  ppsCompliance: { title: "PPS", desc: "Parking compliance.", calc: "(Compliant ÷ Total) × 100.", tips: ["Brake first"] },
  pawPrint: { title: "Paw Print", desc: "Notification rate.", calc: "(Sent ÷ Req) × 100.", tips: ["Send early"] },
  distractions: { title: "Distractions", desc: "Per 100 deliveries.", calc: "Events ÷ 100.", tips: ["Use DND"] },
  speeding: { title: "Speeding", desc: "Speed events.", calc: "Events ÷ 100.", tips: ["Watch limits"] },
  seatbelt: { title: "Seatbelt", desc: "Belt events.", calc: "Events ÷ 100.", tips: ["Buckle up"] },
  followingDistance: { title: "Following", desc: "Tailgating.", calc: "Events ÷ 100.", tips: ["3-4 seconds"] },
  signals: { title: "Signals", desc: "Violations.", calc: "Events ÷ 100.", tips: ["Full stops"] },
  qualityScore: { title: "Quality", desc: "Quality tier.", calc: "DCR + POD + DSB.", tips: ["Complete all"] },
  dcr: { title: "DCR", desc: "Completion rate.", calc: "Delivered ÷ Attempted.", tips: ["Try all"] },
  dnr: { title: "DNR", desc: "Not received.", calc: "DNR count.", tips: ["Clear photos"] },
  pod: { title: "POD", desc: "Photo rate.", calc: "Accepted ÷ Total.", tips: ["Step back"] },
  dsb: { title: "DSB", desc: "Success behaviors.", calc: "Best practices.", tips: ["Read notes"] },
  psb: { title: "PSB", desc: "Pickup behaviors.", calc: "Procedures.", tips: ["Scan right"] },
  feedbackScore: { title: "Feedback", desc: "Customer tier.", calc: "Based on DPMO.", tips: ["Be nice"] },
  cdfDpmo: { title: "DPMO", desc: "Defects per M.", calc: "(Neg ÷ Del) × 1M.", tips: ["Follow rules"] },
  escalations: { title: "Escalations", desc: "Escalated.", calc: "Count.", tips: ["Resolve fast"] },
  dvic: { title: "DVIC", desc: "Rushed checks.", calc: "Under 2 min.", tips: ["Take time"] }
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
  focus: "Customer Delivery Feedback", guidance: "Always read customer notes!"
}

const themes = {
  cream: { name: "Cream", bg: '#FDFCF9', panel: '#F8F6F2', card: '#FFFFFF', text: '#3A3530', muted: '#8A857D', border: '#E8E4DE', accent: '#B8A890' },
  sage: { name: "Sage", bg: '#F6F9F6', panel: '#EEF4EE', card: '#FFFFFF', text: '#2D3D2D', muted: '#6B866B', border: '#D4E2D4', accent: '#6B9B6B' },
  lavender: { name: "Lavender", bg: '#F9F7FB', panel: '#F0EDF5', card: '#FFFFFF', text: '#3A3550', muted: '#7A758F', border: '#DED8E5', accent: '#8B7FB0' },
  rose: { name: "Rose", bg: '#FBF8F8', panel: '#F6EEEE', card: '#FFFFFF', text: '#4A3838', muted: '#9A8585', border: '#E6DADA', accent: '#B89090' },
  sky: { name: "Sky", bg: '#F7FAFB', panel: '#ECF3F7', card: '#FFFFFF', text: '#2D4048', muted: '#6B8898', border: '#D4E2EA', accent: '#6B9CB8' }
}

const severity = {
  fantastic: { bg: '#EFEAF5', text: '#5B4F90', dot: '#8B7FB0' },
  great: { bg: '#E6F0E6', text: '#3F6040', dot: '#6B9B6B' },
  fair: { bg: '#FFF4E6', text: '#8A6020', dot: '#D0A040' },
  poor: { bg: '#FAE6E6', text: '#904040', dot: '#D07070' }
}

export default function ScorecardSplitScreen({ driver = sampleDriver }) {
  const [view, setView] = useState('current')
  const [theme, setTheme] = useState('cream')
  const [modal, setModal] = useState(null)
  const [section, setSection] = useState('safety')

  const t = themes[theme]
  const tierMap = { Platinum: 'fantastic', Gold: 'great', Silver: 'fair', Bronze: 'poor' }
  const tierColor = severity[tierMap[driver.tier]] || severity.fantastic

  const Modal = ({ data, onClose }) => {
    if (!data) return null
    const info = metricInfo[data.key] || { title: data.label, desc: '', tips: [] }
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: t.card, borderRadius: '16px', maxWidth: '300px', width: '100%', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: t.text }}>{info.title}</div>
            {data.value !== undefined && (
              <div style={{ fontSize: '36px', fontWeight: '700', color: data.sev ? severity[data.sev].text : t.text, marginTop: '8px' }}>{data.value}{data.suffix || ''}</div>
            )}
          </div>
          <div style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: '13px', color: t.muted, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
          </div>
          <div style={{ padding: '16px 24px', background: t.panel }}>
            <button onClick={onClose} style={{ width: '100%', padding: '12px', background: t.text, color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  const DataRow = ({ k, label, value, suffix = '', sev }) => (
    <div onClick={() => setModal({ key: k, label, value, suffix, sev })} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px', background: t.card, borderRadius: '10px',
      marginBottom: '8px', cursor: 'pointer', border: `1px solid ${t.border}`
    }}>
      <span style={{ fontSize: '12px', color: t.text }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {sev && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: severity[sev].dot }} />}
        <span style={{ fontSize: '13px', fontWeight: '600', color: sev ? severity[sev].text : t.text }}>{value}{suffix}</span>
      </div>
    </div>
  )

  const tabs = [
    { id: 'safety', icon: '🛡️', label: 'Safety' },
    { id: 'delivery', icon: '📦', label: 'Delivery' },
    { id: 'feedback', icon: '💬', label: 'Feedback' },
    { id: 'dvic', icon: '🔧', label: 'DVIC' }
  ]

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: t.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Theme Bar */}
      <div style={{ padding: '10px 16px', display: 'flex', gap: '6px', borderBottom: `1px solid ${t.border}` }}>
        {Object.entries(themes).map(([k, v]) => (
          <button key={k} onClick={() => setTheme(k)} style={{
            flex: 1, padding: '6px', borderRadius: '6px',
            background: theme === k ? v.accent : 'transparent',
            border: 'none', cursor: 'pointer'
          }}>
            <div style={{ fontSize: '9px', fontWeight: '600', color: theme === k ? '#FFF' : t.muted }}>{v.name}</div>
          </button>
        ))}
      </div>

      {/* Split Layout */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 44px)' }}>
        {/* Left Panel - Fixed Summary */}
        <div style={{ width: '140px', background: t.panel, padding: '20px 14px', borderRight: `1px solid ${t.border}`, flexShrink: 0 }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: t.text, marginBottom: '4px' }}>DiveMetric</div>
          <div style={{ fontSize: '10px', color: t.muted, marginBottom: '20px' }}>Week {driver.week}</div>

          {/* Avatar */}
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: `linear-gradient(135deg, ${tierColor.dot}, ${tierColor.text})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '700', color: '#FFF', marginBottom: '12px'
          }}>
            {driver.firstName[0]}{driver.lastName[0]}
          </div>

          <div style={{ fontSize: '13px', fontWeight: '600', color: t.text, marginBottom: '2px' }}>{driver.firstName}</div>
          <div style={{ fontSize: '10px', color: t.muted, marginBottom: '16px' }}>{driver.dsp}</div>

          {/* Quick Stats */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: tierColor.bg, borderRadius: '10px', marginBottom: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: tierColor.text }}>{driver.tier}</div>
              <div style={{ fontSize: '9px', color: t.muted }}>Tier</div>
            </div>
            <div style={{ padding: '10px', background: t.card, borderRadius: '10px', border: `1px solid ${t.border}`, marginBottom: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: t.text }}>#{driver.rank}</div>
              <div style={{ fontSize: '9px', color: t.muted }}>Rank</div>
            </div>
            <div style={{ padding: '10px', background: t.card, borderRadius: '10px', border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: t.text }}>{driver.fico}</div>
              <div style={{ fontSize: '9px', color: t.muted }}>FICO</div>
            </div>
          </div>

          {/* View Toggle */}
          <div style={{ marginBottom: '16px' }}>
            {[{ id: 'current', l: 'Current' }, { id: 'trailing', l: '6-Week' }].map(x => (
              <button key={x.id} onClick={() => setView(x.id)} style={{
                width: '100%', padding: '8px', marginBottom: '4px',
                background: view === x.id ? t.card : 'transparent',
                border: view === x.id ? `1px solid ${t.border}` : '1px solid transparent',
                borderRadius: '6px', cursor: 'pointer'
              }}>
                <span style={{ fontSize: '10px', fontWeight: '500', color: view === x.id ? t.text : t.muted }}>{x.l}</span>
              </button>
            ))}
          </div>

          {/* Section Tabs */}
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setSection(tab.id)} style={{
              width: '100%', padding: '10px 8px', marginBottom: '6px',
              background: section === tab.id ? t.card : 'transparent',
              border: section === tab.id ? `1px solid ${t.border}` : '1px solid transparent',
              borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ fontSize: '14px' }}>{tab.icon}</span>
              <span style={{ fontSize: '11px', fontWeight: '500', color: section === tab.id ? t.text : t.muted }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Panel - Content */}
        <div style={{ flex: 1, padding: '20px 14px', overflow: 'auto' }}>
          {section === 'safety' && (
            <>
              <div style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '14px' }}>Driving Safety</div>
              <DataRow k="onRoadSafetyScore" label="Safety Tier" value={driver.safety} sev="fantastic" />
              <DataRow k="ficoScore" label="FICO Score" value={driver.fico} sev={driver.fico >= 700 ? 'great' : 'fair'} />
              <DataRow k="ppsCompliance" label="PPS Compliance" value={driver.pps} suffix="%" />
              <DataRow k="pawPrint" label="Paw Print" value={Math.round(driver.pawSent / driver.pawTotal * 100)} suffix="%" sev="great" />
              <div style={{ fontSize: '10px', fontWeight: '600', color: t.muted, textTransform: 'uppercase', margin: '18px 0 10px' }}>Events / 100</div>
              <DataRow k="distractions" label="Distractions" value={driver.distractions} />
              <DataRow k="speeding" label="Speeding" value={driver.speeding} sev="poor" />
              <DataRow k="seatbelt" label="Seatbelt" value={driver.seatbelt} sev="great" />
              <DataRow k="followingDistance" label="Following" value={driver.following} sev="fair" />
              <DataRow k="signals" label="Signals" value={driver.signals} />
            </>
          )}

          {section === 'delivery' && (
            <>
              <div style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '14px' }}>Delivery Quality</div>
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
              <div style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '14px' }}>Customer Feedback</div>
              <DataRow k="feedbackScore" label="Feedback Tier" value={driver.feedback} sev="fair" />
              <DataRow k="cdfDpmo" label="CDF DPMO" value={driver.dpmo.toLocaleString()} sev="fair" />
              <DataRow k="escalations" label="Escalations" value={driver.escalations} sev="great" />
              <div style={{ fontSize: '10px', fontWeight: '600', color: t.muted, textTransform: 'uppercase', margin: '18px 0 10px' }}>Breakdown</div>
              {[{ l: 'Not Great', v: driver.negNotGreat }, { l: 'Instructions', v: driver.negInstructions }, { l: 'Wrong Address', v: driver.negAddress }, { l: 'Never Received', v: driver.negNever }].map((x, i) => (
                <DataRow key={i} k="cdfDpmo" label={x.l} value={x.v} />
              ))}
            </>
          )}

          {section === 'dvic' && (
            <>
              <div style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '14px' }}>Vehicle Inspections</div>
              <DataRow k="dvic" label="Rushed" value={`${driver.dvicRushed}/${driver.dvicTotal}`} sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} />
              {driver.dvicList.map((x, i) => (
                <DataRow key={i} k="dvic" label={x.day} value={x.time} sev={x.status} />
              ))}
              <div style={{ marginTop: '20px', padding: '14px', background: t.panel, borderRadius: '10px', borderLeft: `3px solid ${t.accent}` }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: t.accent, marginBottom: '6px' }}>FOCUS AREA</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: t.text, marginBottom: '4px' }}>{driver.focus}</div>
                <p style={{ fontSize: '11px', color: t.muted, lineHeight: 1.5, margin: 0 }}>{driver.guidance}</p>
              </div>
            </>
          )}

          {/* Footer */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: t.muted }}>Tap metrics for details</div>
          </div>
        </div>
      </div>

      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
