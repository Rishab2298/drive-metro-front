/**
 * Scorecard 30: Floating Cards
 * Overlapping card layers with depth
 * 3D-inspired stacked card aesthetic
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
  cream: { name: "Cream", bg: '#F8F6F2', card: '#FFFFFF', shadow: 'rgba(180,170,150,0.15)', text: '#3A3530', muted: '#958F85', border: '#EBE7E0', accent: '#C0B098' },
  sage: { name: "Sage", bg: '#F2F6F2', card: '#FFFFFF', shadow: 'rgba(100,140,100,0.12)', text: '#2D402D', muted: '#6B8B6B', border: '#D4E2D4', accent: '#6BA06B' },
  lavender: { name: "Lavender", bg: '#F5F3F8', card: '#FFFFFF', shadow: 'rgba(120,100,160,0.12)', text: '#3A3250', muted: '#7A70A0', border: '#DDD8E5', accent: '#8878B8' },
  rose: { name: "Rose", bg: '#F8F4F4', card: '#FFFFFF', shadow: 'rgba(180,130,130,0.12)', text: '#4A3535', muted: '#A08585', border: '#E6DCDC', accent: '#C09090' },
  sky: { name: "Sky", bg: '#F2F6F8', card: '#FFFFFF', shadow: 'rgba(80,130,170,0.12)', text: '#2D4050', muted: '#6088A0', border: '#D4E2EA', accent: '#6098C0' }
}

const severity = {
  fantastic: { bg: '#EDE8F5', text: '#5040A0', dot: '#8070C0' },
  great: { bg: '#E2F0E2', text: '#306830', dot: '#60A060' },
  fair: { bg: '#FFF4E2', text: '#906010', dot: '#D09820' },
  poor: { bg: '#FCE2E2', text: '#A03030', dot: '#D06060' }
}

export default function ScorecardFloatingCards({ driver = sampleDriver }) {
  const [view, setView] = useState('current')
  const [theme, setTheme] = useState('cream')
  const [modal, setModal] = useState(null)
  const [activeCard, setActiveCard] = useState('safety')

  const t = themes[theme]
  const tierMap = { Platinum: 'fantastic', Gold: 'great', Silver: 'fair', Bronze: 'poor' }
  const tierColor = severity[tierMap[driver.tier]] || severity.fantastic

  const Modal = ({ data, onClose }) => {
    if (!data) return null
    const info = metricInfo[data.key] || { title: data.label, desc: '', tips: [] }
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: t.card, borderRadius: '24px', maxWidth: '320px', width: '100%', overflow: 'hidden', boxShadow: `0 30px 60px ${t.shadow}` }}>
          <div style={{ padding: '28px', background: data.sev ? severity[data.sev].bg : t.bg }}>
            <div style={{ fontSize: '18px', fontWeight: '600', color: t.text }}>{info.title}</div>
            {data.value !== undefined && (
              <div style={{ fontSize: '48px', fontWeight: '800', color: data.sev ? severity[data.sev].text : t.text, marginTop: '8px' }}>{data.value}{data.suffix || ''}</div>
            )}
          </div>
          <div style={{ padding: '24px' }}>
            <p style={{ fontSize: '14px', color: t.muted, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <button onClick={onClose} style={{ width: '100%', padding: '16px', background: t.text, color: '#FFF', border: 'none', borderRadius: '16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Done</button>
          </div>
        </div>
      </div>
    )
  }

  const FloatingCard = ({ id, title, icon, sev, zIndex, rotate, children }) => {
    const isActive = activeCard === id
    const s = severity[sev] || severity.great
    return (
      <div
        onClick={() => setActiveCard(id)}
        style={{
          background: t.card,
          borderRadius: '24px',
          boxShadow: isActive ? `0 20px 40px ${t.shadow}` : `0 8px 20px ${t.shadow}`,
          border: `1px solid ${t.border}`,
          marginBottom: isActive ? '16px' : '-60px',
          position: 'relative',
          zIndex: isActive ? 100 : zIndex,
          transform: isActive ? 'scale(1)' : `scale(0.96) rotate(${rotate}deg)`,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 20px',
          background: isActive ? s.bg : t.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${t.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>{icon}</span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: t.text }}>{title}</span>
          </div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.dot }} />
        </div>
        {/* Content */}
        {isActive && (
          <div style={{ padding: '16px 20px' }}>
            {children}
          </div>
        )}
      </div>
    )
  }

  const Metric = ({ k, label, value, suffix = '', sev }) => (
    <div onClick={(e) => { e.stopPropagation(); setModal({ key: k, label, value, suffix, sev }); }} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px', background: t.bg, borderRadius: '12px',
      marginBottom: '8px', cursor: 'pointer'
    }}>
      <span style={{ fontSize: '13px', color: t.text }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {sev && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: severity[sev].dot }} />}
        <span style={{ fontSize: '14px', fontWeight: '600', color: sev ? severity[sev].text : t.text }}>{value}{suffix}</span>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", background: t.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '20px', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: t.text }}>DiveMetric</div>
            <div style={{ fontSize: '12px', color: t.muted }}>Week {driver.week}</div>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: t.card, borderRadius: '12px', padding: '4px', boxShadow: `0 4px 12px ${t.shadow}` }}>
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

        {/* Themes */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {Object.entries(themes).map(([k, v]) => (
            <button key={k} onClick={() => setTheme(k)} style={{
              flex: 1, padding: '10px 8px', borderRadius: '12px',
              background: theme === k ? v.card : 'transparent',
              border: theme === k ? `2px solid ${v.accent}` : `1px solid ${t.border}`,
              boxShadow: theme === k ? `0 4px 12px ${v.shadow}` : 'none',
              cursor: 'pointer'
            }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: v.accent, margin: '0 auto' }} />
            </button>
          ))}
        </div>

        {/* Profile Card - Always on top */}
        <div style={{
          background: t.card, borderRadius: '24px', padding: '20px',
          boxShadow: `0 16px 32px ${t.shadow}`, border: `1px solid ${t.border}`,
          marginBottom: '20px', position: 'relative', zIndex: 200
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
              <div style={{ fontSize: '12px', color: t.muted }}>{driver.dsp} · {driver.station}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ padding: '6px 12px', background: tierColor.bg, borderRadius: '10px', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: tierColor.text }}>{driver.tier}</span>
              </div>
              <div style={{ fontSize: '11px', color: t.muted }}>#{driver.rank}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {[{ l: 'Deliveries', v: driver.deliveries.toLocaleString() }, { l: 'FICO', v: driver.fico }, { l: 'DCR', v: `${driver.dcr}%` }].map((m, i) => (
              <div key={i} style={{ flex: 1, padding: '12px', background: t.bg, borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: t.text }}>{m.v}</div>
                <div style={{ fontSize: '9px', color: t.muted, textTransform: 'uppercase' }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Card Stack */}
      <div style={{ padding: '0 20px 32px' }}>
        <FloatingCard id="safety" title="Driving Safety" icon="🛡️" sev="fantastic" zIndex={4} rotate={-1}>
          <Metric k="onRoadSafetyScore" label="Safety Tier" value={driver.safety} sev="fantastic" />
          <Metric k="ficoScore" label="FICO Score" value={driver.fico} sev={driver.fico >= 700 ? 'great' : 'fair'} />
          <Metric k="ppsCompliance" label="PPS" value={driver.pps} suffix="%" />
          <Metric k="pawPrint" label="Paw Print" value={Math.round(driver.pawSent / driver.pawTotal * 100)} suffix="%" sev="great" />
          <Metric k="speeding" label="Speeding" value={driver.speeding} sev="poor" />
          <Metric k="seatbelt" label="Seatbelt" value={driver.seatbelt} sev="great" />
          <Metric k="followingDistance" label="Following" value={driver.following} sev="fair" />
        </FloatingCard>

        <FloatingCard id="delivery" title="Delivery Quality" icon="📦" sev="great" zIndex={3} rotate={1}>
          <Metric k="qualityScore" label="Quality Tier" value={driver.quality} sev="great" />
          <Metric k="dcr" label="Completion Rate" value={driver.dcr} suffix="%" />
          <Metric k="dnr" label="DNR Claims" value={driver.dnr} sev="fair" />
          <Metric k="pod" label="POD Rate" value={driver.podRate} suffix="%" />
          <Metric k="dsb" label="DSB Score" value={driver.dsb} sev="great" />
          <Metric k="psb" label="PSB Score" value={driver.psb} sev="fair" />
        </FloatingCard>

        <FloatingCard id="feedback" title="Customer Feedback" icon="💬" sev="fair" zIndex={2} rotate={-0.5}>
          <Metric k="feedbackScore" label="Feedback Tier" value={driver.feedback} sev="fair" />
          <Metric k="cdfDpmo" label="CDF DPMO" value={driver.dpmo.toLocaleString()} sev="fair" />
          <Metric k="escalations" label="Escalations" value={driver.escalations} sev="great" />
        </FloatingCard>

        <FloatingCard id="dvic" title="Vehicle Inspections" icon="🔧" sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} zIndex={1} rotate={0.5}>
          <Metric k="dvic" label="Rushed Inspections" value={`${driver.dvicRushed}/${driver.dvicTotal}`} sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} />
          {driver.dvicList.map((x, i) => (
            <Metric key={i} k="dvic" label={x.day} value={x.time} sev={x.status} />
          ))}
        </FloatingCard>

        {/* Focus Area */}
        <div style={{
          background: t.card, borderRadius: '20px', padding: '20px',
          boxShadow: `0 8px 24px ${t.shadow}`, border: `1px solid ${t.border}`,
          marginTop: '16px', borderLeft: `4px solid ${t.accent}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '18px' }}>🎯</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: t.accent, textTransform: 'uppercase' }}>Focus Area</span>
          </div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: t.text, marginBottom: '8px' }}>{driver.focus}</div>
          <p style={{ fontSize: '13px', color: t.muted, lineHeight: 1.6, margin: 0 }}>{driver.guidance}</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: t.muted }}>Tap cards to expand · DiveMetric</div>
      </div>

      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
