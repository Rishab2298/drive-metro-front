/**
 * Scorecard 29: Timeline Flow
 * Vertical timeline with branching metrics
 * Journey-style progression with connected nodes
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
  cream: { name: "Cream", bg: '#FDFCF8', card: '#FFFFFF', line: '#E8E4DD', text: '#3D3830', muted: '#958F85', border: '#EBE7E0', accent: '#C0B098' },
  sage: { name: "Sage", bg: '#F5F9F5', card: '#FFFFFF', line: '#D0E0D0', text: '#2D402D', muted: '#6B8B6B', border: '#D8E8D8', accent: '#6BA06B' },
  lavender: { name: "Lavender", bg: '#F9F7FC', card: '#FFFFFF', line: '#DDD8E8', text: '#3A3250', muted: '#7A70A0', border: '#E4DEE8', accent: '#8878B8' },
  rose: { name: "Rose", bg: '#FCF8F8', card: '#FFFFFF', line: '#E8DCDC', text: '#4A3535', muted: '#A08585', border: '#EAE0E0', accent: '#C09090' },
  sky: { name: "Sky", bg: '#F6FAFC', card: '#FFFFFF', line: '#D0E0E8', text: '#2D4050', muted: '#6088A0', border: '#D8E6EE', accent: '#6098C0' }
}

const severity = {
  fantastic: { bg: '#EEE8F5', text: '#5848A0', dot: '#8878B8', glow: '#8878B830' },
  great: { bg: '#E4F0E4', text: '#386038', dot: '#6BA06B', glow: '#6BA06B30' },
  fair: { bg: '#FFF4E4', text: '#906818', dot: '#D0A030', glow: '#D0A03030' },
  poor: { bg: '#FCE4E4', text: '#A03838', dot: '#D06868', glow: '#D0686830' }
}

export default function ScorecardTimelineFlow({ driver = sampleDriver }) {
  const [view, setView] = useState('current')
  const [theme, setTheme] = useState('cream')
  const [modal, setModal] = useState(null)

  const t = themes[theme]
  const tierMap = { Platinum: 'fantastic', Gold: 'great', Silver: 'fair', Bronze: 'poor' }
  const tierColor = severity[tierMap[driver.tier]] || severity.fantastic

  const Modal = ({ data, onClose }) => {
    if (!data) return null
    const info = metricInfo[data.key] || { title: data.label, desc: '', tips: [] }
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: t.card, borderRadius: '20px', maxWidth: '320px', width: '100%', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: '17px', fontWeight: '600', color: t.text }}>{info.title}</div>
            {data.value !== undefined && (
              <div style={{ fontSize: '40px', fontWeight: '700', color: data.sev ? severity[data.sev].text : t.text, marginTop: '8px' }}>{data.value}{data.suffix || ''}</div>
            )}
          </div>
          <div style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: '14px', color: t.muted, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
          </div>
          <div style={{ padding: '16px 24px', background: t.bg }}>
            <button onClick={onClose} style={{ width: '100%', padding: '14px', background: t.text, color: '#FFF', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  const TimelineNode = ({ label, value, suffix = '', sev, icon, isLast }) => (
    <div style={{ display: 'flex', gap: '16px' }}>
      {/* Line & Dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px' }}>
        <div style={{
          width: '16px', height: '16px', borderRadius: '50%',
          background: sev ? severity[sev].dot : t.accent,
          boxShadow: sev ? `0 0 12px ${severity[sev].glow}` : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '8px', color: '#FFF'
        }}>
          {icon}
        </div>
        {!isLast && <div style={{ width: '2px', flex: 1, background: t.line, marginTop: '4px' }} />}
      </div>
      {/* Content */}
      <div onClick={() => setModal({ key: label.toLowerCase().replace(/\s/g, ''), label, value, suffix, sev })} style={{
        flex: 1, padding: '14px 16px', background: t.card,
        borderRadius: '14px', border: `1px solid ${t.border}`,
        marginBottom: isLast ? 0 : '12px', cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: t.text }}>{label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {sev && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: severity[sev].dot }} />}
            <span style={{ fontSize: '15px', fontWeight: '700', color: sev ? severity[sev].text : t.text }}>{value}{suffix}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const SectionHeader = ({ icon, title, sev }) => (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', marginTop: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px',
          background: sev ? severity[sev].bg : t.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px'
        }}>
          {icon}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: t.text }}>{title}</span>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif", background: t.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '20px', background: t.card, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: t.text }}>DiveMetric</div>
            <div style={{ fontSize: '12px', color: t.muted }}>Performance Timeline</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: t.muted }}>Week</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: t.accent }}>{driver.week}</div>
          </div>
        </div>

        {/* Theme & View */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {Object.entries(themes).map(([k, v]) => (
            <button key={k} onClick={() => setTheme(k)} style={{
              width: '24px', height: '24px', borderRadius: '8px',
              background: v.accent, border: theme === k ? '2px solid #FFF' : 'none',
              boxShadow: theme === k ? `0 0 0 2px ${v.accent}` : 'none',
              cursor: 'pointer'
            }} />
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', background: t.bg, borderRadius: '8px', padding: '3px' }}>
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

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: `linear-gradient(135deg, ${tierColor.dot}, ${tierColor.text})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '700', color: '#FFF'
          }}>
            {driver.firstName[0]}{driver.lastName[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: t.text }}>{driver.name}</div>
            <div style={{ fontSize: '12px', color: t.muted }}>{driver.dsp} · {driver.station}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ padding: '6px 12px', background: tierColor.bg, borderRadius: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: tierColor.text }}>{driver.tier}</span>
            </div>
            <div style={{ fontSize: '11px', color: t.muted }}>#{driver.rank} of {driver.total}</div>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div style={{ padding: '8px 20px 32px' }}>
        {/* Safety Section */}
        <SectionHeader icon="🛡️" title="Driving Safety" sev="fantastic" />
        <TimelineNode label="Safety Tier" value={driver.safety} sev="fantastic" />
        <TimelineNode label="FICO Score" value={driver.fico} sev={driver.fico >= 700 ? 'great' : 'fair'} />
        <TimelineNode label="PPS Compliance" value={driver.pps} suffix="%" />
        <TimelineNode label="Paw Print" value={Math.round(driver.pawSent / driver.pawTotal * 100)} suffix="%" sev="great" />
        <TimelineNode label="Distractions" value={driver.distractions} />
        <TimelineNode label="Speeding" value={driver.speeding} sev="poor" />
        <TimelineNode label="Seatbelt" value={driver.seatbelt} sev="great" />
        <TimelineNode label="Following" value={driver.following} sev="fair" />
        <TimelineNode label="Signals" value={driver.signals} isLast />

        {/* Delivery Section */}
        <SectionHeader icon="📦" title="Delivery Quality" sev="great" />
        <TimelineNode label="Quality Tier" value={driver.quality} sev="great" />
        <TimelineNode label="DCR" value={driver.dcr} suffix="%" />
        <TimelineNode label="DNR Claims" value={driver.dnr} sev="fair" />
        <TimelineNode label="POD Rate" value={driver.podRate} suffix="%" />
        <TimelineNode label="DSB Score" value={driver.dsb} sev="great" />
        <TimelineNode label="PSB Score" value={driver.psb} sev="fair" isLast />

        {/* Feedback Section */}
        <SectionHeader icon="💬" title="Customer Feedback" sev="fair" />
        <TimelineNode label="Feedback Tier" value={driver.feedback} sev="fair" />
        <TimelineNode label="CDF DPMO" value={driver.dpmo.toLocaleString()} sev="fair" />
        <TimelineNode label="Escalations" value={driver.escalations} sev="great" isLast />

        {/* DVIC Section */}
        <SectionHeader icon="🔧" title="Vehicle Inspections" sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} />
        <TimelineNode label="Rushed Inspections" value={`${driver.dvicRushed}/${driver.dvicTotal}`} sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} isLast />

        {/* Focus Area */}
        <SectionHeader icon="🎯" title="Focus Area" sev="fantastic" />
        <div style={{ marginLeft: '40px', padding: '16px', background: t.card, borderRadius: '14px', border: `1px solid ${t.border}`, borderLeft: `3px solid ${t.accent}` }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '8px' }}>{driver.focus}</div>
          <p style={{ fontSize: '13px', color: t.muted, lineHeight: 1.6, margin: 0 }}>{driver.guidance}</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px', textAlign: 'center', borderTop: `1px solid ${t.border}` }}>
        <div style={{ fontSize: '11px', color: t.muted }}>Tap nodes for details · DiveMetric</div>
      </div>

      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
