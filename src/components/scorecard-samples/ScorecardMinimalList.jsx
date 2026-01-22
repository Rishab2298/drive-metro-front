/**
 * Scorecard 32: Minimal List
 * Ultra-clean list-based with expandable rows
 * Refined minimalism with subtle interactions
 */

import { useState } from 'react'

const metricInfo = {
  onRoadSafetyScore: { title: "On-Road Safety Score", desc: "Overall driving safety assessment combining FICO, speeding, seatbelt, and following distance metrics.", calc: "Weighted average: FICO (40%), Events (35%), Compliance (25%).", tips: ["Maintain safe following distance", "Always wear seatbelt"] },
  ficoScore: { title: "FICO Safety Score", desc: "Standardized driving behavior score from 300-850 measuring risk level.", calc: "Factors: Hard braking (25%), Acceleration (20%), Cornering (20%), Speed (20%), Phone use (15%).", tips: ["Brake smoothly and early"] },
  ppsCompliance: { title: "Proper Park Sequence", desc: "Compliance rate for Amazon's parking protocol.", calc: "(Compliant Stops ÷ Total Stops) × 100. Target: 95%+", tips: ["Always set parking brake first"] },
  pawPrint: { title: "Paw Print Compliance", desc: "Rate of sending 'On my way' notifications.", calc: "(Notifications Sent ÷ Required) × 100.", tips: ["Send when approaching"] },
  distractions: { title: "Distractions Rate", desc: "Phone usage events per 100 deliveries.", calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.5", tips: ["Use Do Not Disturb"] },
  speeding: { title: "Speeding Events", desc: "Instances of exceeding posted speed limits.", calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.5", tips: ["Watch for speed changes"] },
  seatbelt: { title: "Seatbelt Compliance", desc: "Events where seatbelt was unfastened while vehicle moving.", calc: "Events ÷ (Deliveries ÷ 100). Target: 0", tips: ["Buckle before starting"] },
  followingDistance: { title: "Following Distance", desc: "Tailgating events where you followed too closely.", calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.3", tips: ["Maintain 3-4 second gap"] },
  signals: { title: "Signal Violations", desc: "Stop sign or traffic light violations.", calc: "Events ÷ (Deliveries ÷ 100). Target: 0", tips: ["Complete stops always"] },
  qualityScore: { title: "Delivery Quality Score", desc: "Overall quality tier based on completion, POD, and success behaviors.", calc: "Weighted: DCR (40%), POD (30%), DSB (30%).", tips: ["Complete all deliveries"] },
  dcr: { title: "Delivery Completion Rate", desc: "Percentage of packages successfully delivered.", calc: "(Delivered ÷ Attempted) × 100. Target: 98%+", tips: ["Attempt all packages"] },
  dnr: { title: "Delivered Not Received", desc: "Packages marked delivered but customer claims not received.", calc: "Count of DNR claims. Target: 0", tips: ["Clear POD photos"] },
  pod: { title: "Photo-On-Delivery", desc: "Percentage of delivery photos accepted.", calc: "(Accepted ÷ Opportunities) × 100.", tips: ["Step back 3-4 feet"] },
  dsb: { title: "Delivery Success Behaviors", desc: "Score for following recommended delivery practices.", calc: "Points for: reading notes, safe locations.", tips: ["Read all notes"] },
  psb: { title: "Pickup Success Behaviors", desc: "Score for pickup and return best practices.", calc: "Points for: accurate scanning, proper handling.", tips: ["Scan accurately"] },
  feedbackScore: { title: "Customer Feedback Score", desc: "Tier based on customer complaints and feedback rate.", calc: "Based on CDF DPMO.", tips: ["Be courteous"] },
  cdfDpmo: { title: "CDF DPMO", desc: "Defects Per Million Opportunities - standardized negative feedback rate.", calc: "(Negative Count ÷ Deliveries) × 1,000,000.", tips: ["Follow all instructions"] },
  escalations: { title: "Escalation Defects", desc: "Issues requiring management escalation.", calc: "Count of escalated issues. Target: 0", tips: ["Resolve proactively"] },
  dvic: { title: "DVIC Inspections", desc: "Vehicle inspections flagged as rushed.", calc: "Count of rushed inspections. Target: 0", tips: ["Take full time"] }
}

const sampleDriver = {
  name: "Joe Driver", firstName: "Joe", lastName: "Driver", dsp: "DSPX", station: "DXX1",
  week: 42, tier: "Platinum", rank: 12, total: 55, deliveries: 1254,
  note: "Great work last week! Please keep an eye on your speed.", safety: "Platinum", fico: 670, pps: 71.7,
  ppsTotal: 251, ppsBrake: 60, ppsPark: 11, pawSent: 105, pawTotal: 120,
  distractions: 0.1, speeding: 0.8, seatbelt: 0.2, following: 0.3, signals: 0.1,
  quality: "Gold", dcr: 99.5, dnr: 2, podRate: 99.3, podTotal: 561, podRejects: 4,
  podBlurry: 2, podHuman: 1, podNoPackage: 1, dsb: 320, psb: 500, feedback: "Silver",
  dpmo: 2107, negCount: 3, escalations: 1, negNotGreat: 5, negInstructions: 2,
  negAddress: 2, negNever: 1, dvicRushed: 3, dvicTotal: 5,
  dvicList: [{ day: "Wed 10/01", time: "00:27", status: "fair" }, { day: "Thu 10/02", time: "00:20", status: "fair" }, { day: "Sat 10/04", time: "00:09", status: "poor" }],
  focus: "Customer Delivery Feedback", guidance: "Always read the customer notes before executing a delivery!"
}

const themes = {
  cream: { name: "Cream", bg: '#FDFCF9', text: '#2D2A25', muted: '#8A867D', border: '#E5E2DA', accent: '#A89878' },
  sage: { name: "Sage", bg: '#F7FAF7', text: '#252D25', muted: '#6A826A', border: '#D5E0D5', accent: '#5A8A5A' },
  lavender: { name: "Lavender", bg: '#F9F8FC', text: '#2D2840', muted: '#7068A0', border: '#DDD8E8', accent: '#7060B0' },
  rose: { name: "Rose", bg: '#FCF9F9', text: '#352828', muted: '#987878', border: '#E8DCDC', accent: '#A87070' },
  sky: { name: "Sky", bg: '#F7FAFC', text: '#25303D', muted: '#5A7A98', border: '#D5E2EA', accent: '#5088B0' }
}

const severity = {
  fantastic: { text: '#5050A0', dot: '#7060B0' },
  great: { text: '#306030', dot: '#5A8A5A' },
  fair: { text: '#886010', dot: '#C89818' },
  poor: { text: '#903030', dot: '#C85050' }
}

export default function ScorecardMinimalList({ driver = sampleDriver }) {
  const [view, setView] = useState('current')
  const [theme, setTheme] = useState('cream')
  const [modal, setModal] = useState(null)
  const [expanded, setExpanded] = useState({})

  const t = themes[theme]
  const tierMap = { Platinum: 'fantastic', Gold: 'great', Silver: 'fair', Bronze: 'poor' }
  const tierColor = severity[tierMap[driver.tier]] || severity.fantastic

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  const Modal = ({ data, onClose }) => {
    if (!data) return null
    const info = metricInfo[data.key] || { title: data.label, desc: '', calc: '', tips: [] }
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', borderRadius: '4px', maxWidth: '340px', width: '100%', overflow: 'hidden' }}>
          <div style={{ padding: '28px 24px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: t.muted, letterSpacing: '0.03em', marginBottom: '8px' }}>{info.title}</div>
            {data.value !== undefined && (
              <div style={{ fontSize: '40px', fontWeight: '300', color: data.sev ? severity[data.sev].text : t.text, letterSpacing: '-0.02em' }}>{data.value}{data.suffix || ''}</div>
            )}
          </div>
          <div style={{ padding: '24px' }}>
            <p style={{ fontSize: '14px', color: t.muted, lineHeight: 1.7, margin: '0 0 20px' }}>{info.desc}</p>
            {info.calc && (
              <div style={{ padding: '16px', background: t.bg, borderLeft: `2px solid ${t.accent}`, marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', color: t.text, lineHeight: 1.5, margin: 0 }}>{info.calc}</p>
              </div>
            )}
            <button onClick={onClose} style={{ width: '100%', padding: '14px', background: t.text, color: '#FFF', border: 'none', fontSize: '12px', fontWeight: '500', letterSpacing: '0.05em', cursor: 'pointer' }}>CLOSE</button>
          </div>
        </div>
      </div>
    )
  }

  const ListRow = ({ k, label, value, suffix = '', sev }) => (
    <div onClick={() => setModal({ key: k, label, value, suffix, sev })} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 0', borderBottom: `1px solid ${t.border}`, cursor: 'pointer'
    }}>
      <span style={{ fontSize: '13px', fontWeight: '400', color: t.text }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: sev ? severity[sev].text : t.text, fontVariantNumeric: 'tabular-nums' }}>{value}{suffix}</span>
        {sev && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: severity[sev].dot }} />}
      </div>
    </div>
  )

  const ExpandableSection = ({ id, title, children }) => {
    const isOpen = expanded[id]
    return (
      <div style={{ marginBottom: '1px' }}>
        <button onClick={() => toggle(id)} style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 0', background: 'transparent', border: 'none',
          borderBottom: `1px solid ${t.border}`, cursor: 'pointer', textAlign: 'left'
        }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: t.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</span>
          <span style={{ fontSize: '14px', color: t.muted, transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>›</span>
        </button>
        {isOpen && <div style={{ paddingLeft: '12px' }}>{children}</div>}
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif", background: t.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Minimal Header */}
      <div style={{ padding: '24px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: t.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>DiveMetric</div>
            <div style={{ fontSize: '24px', fontWeight: '300', color: t.text, letterSpacing: '-0.02em' }}>Week {driver.week}</div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {Object.entries(themes).map(([k, v]) => (
              <button key={k} onClick={() => setTheme(k)} style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: v.accent, border: 'none',
                opacity: theme === k ? 1 : 0.3, cursor: 'pointer'
              }} />
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
          {[{ id: 'current', l: 'Current' }, { id: 'trailing', l: '6-Week Trailing' }].map(x => (
            <button key={x.id} onClick={() => setView(x.id)} style={{
              background: 'transparent', border: 'none', padding: 0, cursor: 'pointer'
            }}>
              <span style={{
                fontSize: '12px', fontWeight: '400',
                color: view === x.id ? t.text : t.muted,
                borderBottom: view === x.id ? `1px solid ${t.text}` : '1px solid transparent',
                paddingBottom: '4px'
              }}>{x.l}</span>
            </button>
          ))}
        </div>

        {/* Profile - Minimal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '20px', borderBottom: `1px solid ${t.border}` }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '24px',
            background: t.border, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '500', color: t.text
          }}>
            {driver.firstName[0]}{driver.lastName[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '500', color: t.text }}>{driver.name}</div>
            <div style={{ fontSize: '12px', color: t.muted }}>{driver.dsp} · {driver.station}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: tierColor.text }}>{driver.tier}</div>
            <div style={{ fontSize: '11px', color: t.muted }}>#{driver.rank} of {driver.total}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px' }}>
        {/* Summary Row */}
        <div style={{ display: 'flex', gap: '20px', padding: '20px 0', borderBottom: `1px solid ${t.border}` }}>
          {[
            { l: 'Deliveries', v: driver.deliveries.toLocaleString() },
            { l: 'FICO', v: driver.fico },
            { l: 'DCR', v: `${driver.dcr}%` },
            { l: 'DPMO', v: driver.dpmo.toLocaleString() }
          ].map((m, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: '300', color: t.text, letterSpacing: '-0.01em' }}>{m.v}</div>
              <div style={{ fontSize: '10px', color: t.muted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* Expandable Sections */}
        <ExpandableSection id="safety" title="Driving Safety">
          <ListRow k="onRoadSafetyScore" label="Safety Tier" value={driver.safety} sev="fantastic" />
          <ListRow k="ficoScore" label="FICO Score" value={driver.fico} sev={driver.fico >= 700 ? 'great' : 'fair'} />
          <ListRow k="ppsCompliance" label="PPS Compliance" value={driver.pps} suffix="%" />
          <ListRow k="pawPrint" label="Paw Print" value={`${driver.pawSent}/${driver.pawTotal}`} sev="great" />
          <ListRow k="distractions" label="Distractions" value={driver.distractions} />
          <ListRow k="speeding" label="Speeding" value={driver.speeding} sev="poor" />
          <ListRow k="seatbelt" label="Seatbelt" value={driver.seatbelt} sev="great" />
          <ListRow k="followingDistance" label="Following Distance" value={driver.following} sev="fair" />
          <ListRow k="signals" label="Signal Violations" value={driver.signals} />
        </ExpandableSection>

        <ExpandableSection id="delivery" title="Delivery Quality">
          <ListRow k="qualityScore" label="Quality Tier" value={driver.quality} sev="great" />
          <ListRow k="dcr" label="Completion Rate" value={driver.dcr} suffix="%" />
          <ListRow k="dnr" label="DNR Claims" value={driver.dnr} sev="fair" />
          <ListRow k="pod" label="POD Rate" value={driver.podRate} suffix="%" />
          <ListRow k="dsb" label="DSB Score" value={driver.dsb} sev="great" />
          <ListRow k="psb" label="PSB Score" value={driver.psb} sev="fair" />
        </ExpandableSection>

        <ExpandableSection id="feedback" title="Customer Feedback">
          <ListRow k="feedbackScore" label="Feedback Tier" value={driver.feedback} sev="fair" />
          <ListRow k="cdfDpmo" label="CDF DPMO" value={driver.dpmo.toLocaleString()} sev="fair" />
          <ListRow k="escalations" label="Escalations" value={driver.escalations} sev="great" />
          <ListRow k="cdfDpmo" label="Not Great" value={driver.negNotGreat} />
          <ListRow k="cdfDpmo" label="Instructions" value={driver.negInstructions} />
          <ListRow k="cdfDpmo" label="Wrong Address" value={driver.negAddress} />
          <ListRow k="cdfDpmo" label="Never Received" value={driver.negNever} />
        </ExpandableSection>

        <ExpandableSection id="dvic" title="Vehicle Inspections">
          <ListRow k="dvic" label="Rushed Inspections" value={`${driver.dvicRushed}/${driver.dvicTotal}`} sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} />
          {driver.dvicList.map((x, i) => (
            <ListRow key={i} k="dvic" label={x.day} value={x.time} sev={x.status} />
          ))}
        </ExpandableSection>

        {/* Focus Area */}
        <div style={{ padding: '24px 0', borderTop: `1px solid ${t.border}`, marginTop: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: t.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Focus Area</div>
          <div style={{ fontSize: '15px', fontWeight: '500', color: t.text, marginBottom: '8px' }}>{driver.focus}</div>
          <p style={{ fontSize: '13px', color: t.muted, lineHeight: 1.6, margin: 0 }}>{driver.guidance}</p>
        </div>

        {/* DSP Note */}
        {driver.note && (
          <div style={{ padding: '20px 0', borderTop: `1px solid ${t.border}` }}>
            <div style={{ fontSize: '10px', fontWeight: '600', color: t.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Note from DSP</div>
            <p style={{ fontSize: '13px', color: t.text, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>{driver.note}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: t.muted, letterSpacing: '0.05em' }}>Tap any metric for details</div>
      </div>

      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
