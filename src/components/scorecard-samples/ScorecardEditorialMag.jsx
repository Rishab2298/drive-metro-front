/**
 * Scorecard 23: Editorial Magazine
 * Large typography, editorial spreads, asymmetric grids
 * Premium magazine aesthetic with dramatic whitespace
 */

import { useState } from 'react'

const metricInfo = {
  onRoadSafetyScore: { title: "On-Road Safety Score", desc: "Overall driving safety assessment combining FICO, speeding, seatbelt, and following distance metrics.", calc: "Weighted average: FICO (40%), Events (35%), Compliance (25%). Platinum ≥ 95%, Gold ≥ 85%, Silver ≥ 75%.", tips: ["Maintain safe following distance", "Always wear seatbelt", "Follow speed limits"] },
  ficoScore: { title: "FICO Safety Score", desc: "Standardized driving behavior score from 300-850 measuring risk level based on telematics data.", calc: "Factors: Hard braking (25%), Acceleration (20%), Cornering (20%), Speed (20%), Phone use (15%).", tips: ["Brake smoothly and early", "Accelerate gradually"] },
  ppsCompliance: { title: "Proper Park Sequence", desc: "Compliance rate for Amazon's parking protocol: engage parking brake, shift to park, then exit.", calc: "(Compliant Stops ÷ Total Stops) × 100. Target: 95%+", tips: ["Always set parking brake first", "Shift to park before exiting"] },
  pawPrint: { title: "Paw Print Compliance", desc: "Rate of sending 'On my way' notifications to customers when approaching delivery location.", calc: "(Notifications Sent ÷ Required) × 100. Target: 90%+", tips: ["Send when approaching", "Helps customers prepare"] },
  distractions: { title: "Distractions Rate", desc: "Phone usage or other distraction events detected per 100 deliveries.", calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.5", tips: ["Use Do Not Disturb", "Pull over if needed"] },
  speeding: { title: "Speeding Events", desc: "Instances of exceeding posted speed limits per 100 deliveries.", calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.5", tips: ["Watch for speed changes", "Slow in residential areas"] },
  seatbelt: { title: "Seatbelt Compliance", desc: "Events where seatbelt was unfastened while vehicle moving.", calc: "Events ÷ (Deliveries ÷ 100). Target: 0", tips: ["Buckle before starting"] },
  followingDistance: { title: "Following Distance", desc: "Tailgating events where you followed too closely.", calc: "Events ÷ (Deliveries ÷ 100). Target: < 0.3", tips: ["Maintain 3-4 second gap"] },
  signals: { title: "Signal Violations", desc: "Stop sign or traffic light violations per 100 deliveries.", calc: "Events ÷ (Deliveries ÷ 100). Target: 0", tips: ["Complete stops always"] },
  qualityScore: { title: "Delivery Quality Score", desc: "Overall quality tier based on completion, POD, and success behaviors.", calc: "Weighted: DCR (40%), POD (30%), DSB (30%).", tips: ["Complete all deliveries", "Clear POD photos"] },
  dcr: { title: "Delivery Completion Rate", desc: "Percentage of packages successfully delivered vs attempted.", calc: "(Delivered ÷ Attempted) × 100. Target: 98%+", tips: ["Attempt all packages"] },
  dnr: { title: "Delivered Not Received", desc: "Packages marked delivered but customer claims not received.", calc: "Count of DNR claims. Target: 0", tips: ["Clear POD photos", "Safe locations only"] },
  pod: { title: "Photo-On-Delivery", desc: "Percentage of delivery photos accepted by quality system.", calc: "(Accepted ÷ Opportunities) × 100. Target: 98%+", tips: ["Step back 3-4 feet", "Good lighting"] },
  dsb: { title: "Delivery Success Behaviors", desc: "Score for following Amazon's recommended delivery practices.", calc: "Points for: reading notes, safe locations, proper handling.", tips: ["Read all notes"] },
  psb: { title: "Pickup Success Behaviors", desc: "Score for pickup and return best practices at station.", calc: "Points for: accurate scanning, proper handling.", tips: ["Scan accurately"] },
  feedbackScore: { title: "Customer Feedback Score", desc: "Tier based on customer complaints and feedback rate.", calc: "Based on CDF DPMO. Lower complaints = higher tier.", tips: ["Be courteous"] },
  cdfDpmo: { title: "CDF DPMO", desc: "Defects Per Million Opportunities - standardized negative feedback rate.", calc: "(Negative Count ÷ Deliveries) × 1,000,000. Target: < 1,500", tips: ["Follow all instructions"] },
  escalations: { title: "Escalation Defects", desc: "Issues requiring management escalation or formal complaints.", calc: "Count of escalated issues. Target: 0", tips: ["Resolve proactively"] },
  dvic: { title: "DVIC Inspections", desc: "Vehicle inspections flagged as rushed (under 2 minutes).", calc: "Count of rushed inspections. Target: 0", tips: ["Take full time", "Check all items"] }
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
  cream: { name: "Cream", bg: '#FFFDF7', card: '#FFFFFF', subtle: '#FAF8F5', text: '#5C5470', muted: '#9E9AA7', border: '#EBE8E2', accent: '#B8A99A' },
  sage: { name: "Sage", bg: '#F7FAF7', card: '#FFFFFF', subtle: '#EFF5EF', text: '#4A5D4A', muted: '#8B9E8B', border: '#DCE6DC', accent: '#7D9B7D' },
  lavender: { name: "Lavender", bg: '#FAF8FC', card: '#FFFFFF', subtle: '#F3EFF8', text: '#5D5470', muted: '#9A94A7', border: '#E6E0ED', accent: '#A594C0' },
  rose: { name: "Rose", bg: '#FDF8F8', card: '#FFFFFF', subtle: '#FAF0F0', text: '#705454', muted: '#A79494', border: '#EDE4E4', accent: '#C9A5A5' },
  sky: { name: "Sky", bg: '#F7FAFC', card: '#FFFFFF', subtle: '#EEF4F8', text: '#4A5568', muted: '#8B96A3', border: '#DCE4EB', accent: '#7DA3C0' }
}

const severity = {
  fantastic: { bg: '#F3EFF8', text: '#7C6A99', dot: '#A594C0' },
  great: { bg: '#EFF5EF', text: '#5A7A5A', dot: '#7D9B7D' },
  fair: { bg: '#FFF5EB', text: '#9A7355', dot: '#D4A574' },
  poor: { bg: '#FCF0F0', text: '#996666', dot: '#C99191' }
}

export default function ScorecardEditorialMag({ driver = sampleDriver }) {
  const [view, setView] = useState('current')
  const [theme, setTheme] = useState('cream')
  const [modal, setModal] = useState(null)
  const [section, setSection] = useState('safety')

  const t = themes[theme]
  const tierMap = { Platinum: 'fantastic', Gold: 'great', Silver: 'fair', Bronze: 'poor' }
  const tierColor = severity[tierMap[driver.tier]] || severity.fantastic

  const Modal = ({ data, onClose }) => {
    if (!data) return null
    const info = metricInfo[data.key] || { title: data.label, desc: '', calc: '', tips: [] }
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', borderRadius: '4px', maxWidth: '340px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}>
          <div style={{ padding: '32px 28px 24px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '400', color: t.text, lineHeight: 1.2, marginBottom: '16px' }}>{info.title}</div>
            {data.value !== undefined && (
              <div style={{ display: 'inline-block', padding: '8px 16px', background: data.sev ? severity[data.sev].bg : t.subtle, borderRadius: '2px' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '400', color: data.sev ? severity[data.sev].text : t.text }}>{data.value}{data.suffix || ''}</span>
              </div>
            )}
          </div>
          <div style={{ padding: '24px 28px' }}>
            {info.desc && <p style={{ fontSize: '13px', color: t.muted, lineHeight: 1.7, margin: '0 0 20px' }}>{info.desc}</p>}
            {info.calc && <p style={{ fontSize: '12px', color: t.text, lineHeight: 1.6, margin: 0, padding: '16px', background: t.subtle, borderLeft: `2px solid ${t.accent}` }}>{info.calc}</p>}
            <button onClick={onClose} style={{ marginTop: '24px', padding: '12px 24px', background: t.text, color: '#FFF', border: 'none', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  const Metric = ({ k, label, value, suffix = '', sev, large }) => (
    <div onClick={() => setModal({ key: k, label, value, suffix, sev })} style={{ cursor: 'pointer', marginBottom: large ? '28px' : '16px' }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: t.muted, marginBottom: '6px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: large ? '44px' : '28px', fontWeight: '400', color: sev ? severity[sev].text : t.text, lineHeight: 1 }}>{value}{suffix}</span>
        {sev && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: severity[sev].dot }} />}
      </div>
    </div>
  )

  const sections = [
    { id: 'safety', label: 'Safety' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'customer', label: 'Feedback' },
    { id: 'dvic', label: 'DVIC' }
  ]

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: t.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Theme Pills */}
      <div style={{ display: 'flex', gap: '4px', padding: '12px 20px', borderBottom: `1px solid ${t.border}`, overflowX: 'auto' }}>
        {Object.entries(themes).map(([k, v]) => (
          <button key={k} onClick={() => setTheme(k)} style={{ padding: '6px 12px', border: theme === k ? `1px solid ${v.accent}` : '1px solid transparent', background: theme === k ? v.subtle : 'transparent', color: theme === k ? v.accent : t.muted, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>{v.name}</button>
        ))}
      </div>

      {/* Masthead */}
      <div style={{ padding: '40px 24px 32px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: t.muted, marginBottom: '12px' }}>Performance Report</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '400', color: t.text, lineHeight: 1.1, marginBottom: '16px' }}>DiveMetric</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '11px', color: t.muted, marginBottom: '4px' }}>Week {driver.week} · {driver.dsp}</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: t.text }}>{driver.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: tierColor.text, marginBottom: '2px' }}>{driver.tier}</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: tierColor.text, lineHeight: 1 }}>#{driver.rank}</div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}` }}>
        {[{ id: 'current', l: 'Current' }, { id: 'trailing', l: '6-Week' }].map(x => (
          <button key={x.id} onClick={() => setView(x.id)} style={{ flex: 1, padding: '14px', background: 'transparent', border: 'none', borderBottom: view === x.id ? `2px solid ${t.text}` : '2px solid transparent', color: view === x.id ? t.text : t.muted, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>{x.l}</button>
        ))}
      </div>

      {/* Hero Stats */}
      <div style={{ padding: '32px 24px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Metric k="ficoScore" label="FICO Score" value={driver.fico} sev={driver.fico >= 750 ? 'fantastic' : driver.fico >= 650 ? 'great' : 'fair'} large />
          <div>
            <Metric k="dcr" label="Completion" value={driver.dcr} suffix="%" />
            <Metric k="cdfDpmo" label="DPMO" value={driver.dpmo.toLocaleString()} sev="fair" />
          </div>
        </div>
      </div>

      {/* Section Nav */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}`, overflowX: 'auto' }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{ flex: 1, padding: '16px 12px', background: section === s.id ? t.subtle : 'transparent', border: 'none', color: section === s.id ? t.text : t.muted, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '80px' }}>{s.label}</button>
        ))}
      </div>

      {/* Section Content */}
      <div style={{ padding: '28px 24px' }}>
        {section === 'safety' && (
          <>
            <Metric k="onRoadSafetyScore" label="Safety Tier" value={driver.safety} sev="fantastic" large />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <Metric k="ppsCompliance" label="PPS Compliance" value={driver.pps} suffix="%" />
              <Metric k="pawPrint" label="Paw Print" value={Math.round(driver.pawSent / driver.pawTotal * 100)} suffix="%" sev="great" />
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: t.muted, marginBottom: '16px', paddingBottom: '8px', borderBottom: `1px solid ${t.border}` }}>Events / 100 Deliveries</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <Metric k="distractions" label="Distract" value={driver.distractions} />
              <Metric k="speeding" label="Speed" value={driver.speeding} sev="poor" />
              <Metric k="seatbelt" label="Belt" value={driver.seatbelt} sev="great" />
              <Metric k="followingDistance" label="Follow" value={driver.following} sev="fair" />
              <Metric k="signals" label="Signal" value={driver.signals} />
            </div>
          </>
        )}
        {section === 'delivery' && (
          <>
            <Metric k="qualityScore" label="Quality Tier" value={driver.quality} sev="great" large />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <Metric k="dcr" label="DCR" value={driver.dcr} suffix="%" />
              <Metric k="dnr" label="DNR Claims" value={driver.dnr} sev="fair" />
              <Metric k="pod" label="POD Rate" value={driver.podRate} suffix="%" />
              <Metric k="pod" label="POD Rejects" value={driver.podRejects} />
              <Metric k="dsb" label="DSB Score" value={driver.dsb} sev="great" />
              <Metric k="psb" label="PSB Score" value={driver.psb} sev="fair" />
            </div>
          </>
        )}
        {section === 'customer' && (
          <>
            <Metric k="feedbackScore" label="Feedback Tier" value={driver.feedback} sev="fair" large />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <Metric k="cdfDpmo" label="CDF DPMO" value={driver.dpmo.toLocaleString()} sev="fair" />
              <Metric k="escalations" label="Escalations" value={driver.escalations} sev="great" />
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: t.muted, marginBottom: '16px' }}>Breakdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[{ l: 'Not Great', v: driver.negNotGreat }, { l: 'Instructions', v: driver.negInstructions }, { l: 'Wrong Address', v: driver.negAddress }, { l: 'Never Received', v: driver.negNever }].map((x, i) => (
                <div key={i} style={{ padding: '12px', background: t.subtle }}>
                  <div style={{ fontSize: '10px', color: t.muted, marginBottom: '4px' }}>{x.l}</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: t.text }}>{x.v}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {section === 'dvic' && (
          <>
            <Metric k="dvic" label="Rushed Inspections" value={driver.dvicRushed} sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} large />
            <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: t.muted, marginBottom: '16px' }}>Inspection Log</div>
            {driver.dvicList.map((x, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${t.border}` }}>
                <span style={{ fontSize: '13px', color: t.text }}>{x.day}</span>
                <span style={{ fontSize: '13px', fontFamily: 'Georgia, serif', color: severity[x.status].text }}>{x.time}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Focus Area */}
      <div style={{ margin: '0 24px 32px', padding: '24px', background: t.subtle, borderLeft: `3px solid ${t.accent}` }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: t.accent, marginBottom: '12px' }}>Focus Area</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: t.text, marginBottom: '8px' }}>{driver.focus}</div>
        <p style={{ fontSize: '12px', color: t.muted, lineHeight: 1.6, margin: 0 }}>{driver.guidance}</p>
      </div>

      {/* Footer */}
      <div style={{ padding: '20px 24px', borderTop: `1px solid ${t.border}`, textAlign: 'center' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: t.muted }}>Tap metrics for details · DiveMetric</div>
      </div>

      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
