/**
 * Scorecard 26: Accordion Panels
 * Full-width expanding accordion sections
 * Bold headers with smooth expand/collapse
 */

import { useState } from 'react'

const metricInfo = {
  onRoadSafetyScore: { title: "On-Road Safety Score", desc: "Overall driving safety assessment combining multiple metrics.", calc: "FICO (40%), Events (35%), Compliance (25%).", tips: ["Maintain safe following distance"] },
  ficoScore: { title: "FICO Safety Score", desc: "Driving behavior score from 300-850.", calc: "Braking, Acceleration, Cornering, Speed, Phone use.", tips: ["Brake smoothly"] },
  ppsCompliance: { title: "Proper Park Sequence", desc: "Parking protocol compliance.", calc: "(Compliant ÷ Total) × 100.", tips: ["Set parking brake first"] },
  pawPrint: { title: "Paw Print", desc: "Customer notification rate.", calc: "(Sent ÷ Required) × 100.", tips: ["Send when approaching"] },
  distractions: { title: "Distractions", desc: "Phone events per 100 deliveries.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Use Do Not Disturb"] },
  speeding: { title: "Speeding", desc: "Speed violations.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Watch for changes"] },
  seatbelt: { title: "Seatbelt", desc: "Belt violations.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Buckle first"] },
  followingDistance: { title: "Following Distance", desc: "Tailgating events.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["3-4 second gap"] },
  signals: { title: "Signals", desc: "Traffic violations.", calc: "Events ÷ (Deliveries ÷ 100).", tips: ["Complete stops"] },
  qualityScore: { title: "Quality Score", desc: "Overall quality tier.", calc: "DCR, POD, DSB weighted.", tips: ["Complete all deliveries"] },
  dcr: { title: "DCR", desc: "Delivery completion rate.", calc: "(Delivered ÷ Attempted) × 100.", tips: ["Attempt all packages"] },
  dnr: { title: "DNR", desc: "Delivered not received.", calc: "Count of DNR claims.", tips: ["Clear POD photos"] },
  pod: { title: "POD", desc: "Photo acceptance rate.", calc: "(Accepted ÷ Opportunities) × 100.", tips: ["Step back 3-4 feet"] },
  dsb: { title: "DSB", desc: "Delivery success behaviors.", calc: "Points for best practices.", tips: ["Read notes"] },
  psb: { title: "PSB", desc: "Pickup success behaviors.", calc: "Points for procedures.", tips: ["Scan accurately"] },
  feedbackScore: { title: "Feedback Score", desc: "Customer feedback tier.", calc: "Based on CDF DPMO.", tips: ["Be courteous"] },
  cdfDpmo: { title: "CDF DPMO", desc: "Defects per million.", calc: "(Negative ÷ Deliveries) × 1M.", tips: ["Follow instructions"] },
  escalations: { title: "Escalations", desc: "Management escalations.", calc: "Count of escalations.", tips: ["Resolve proactively"] },
  dvic: { title: "DVIC", desc: "Rushed inspections.", calc: "Count under 2 minutes.", tips: ["Take full time"] }
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
  dvicList: [{ day: "Wed 10/01", time: "00:27", status: "fair" }, { day: "Thu 10/02", time: "00:20", status: "fair" }, { day: "Sat 10/04", time: "00:09", status: "poor" }],
  focus: "Customer Delivery Feedback", guidance: "Always read customer notes before delivery!"
}

const themes = {
  cream: { name: "Cream", bg: '#FDFCF9', card: '#FFFFFF', subtle: '#F8F6F2', text: '#3A3530', muted: '#8A857D', border: '#EAE6E0', accent: '#B8A890' },
  sage: { name: "Sage", bg: '#F6F9F6', card: '#FFFFFF', subtle: '#EEF3EE', text: '#2D3D2D', muted: '#6B866B', border: '#D8E5D8', accent: '#6B9B6B' },
  lavender: { name: "Lavender", bg: '#F9F8FB', card: '#FFFFFF', subtle: '#F0EEF5', text: '#3A3550', muted: '#7A758F', border: '#E0DCE8', accent: '#8B80B0' },
  rose: { name: "Rose", bg: '#FBF8F8', card: '#FFFFFF', subtle: '#F7F0F0', text: '#4A3838', muted: '#9A8585', border: '#E8DCDC', accent: '#B89090' },
  sky: { name: "Sky", bg: '#F7FAFB', card: '#FFFFFF', subtle: '#EDF4F7', text: '#2D4048', muted: '#6B8A98', border: '#D8E8EE', accent: '#6BA0B8' }
}

const severity = {
  fantastic: { bg: '#F0EDF5', text: '#5B5080', dot: '#8B80B0', header: '#E8E5F0' },
  great: { bg: '#E8F0E8', text: '#406040', dot: '#6B9B6B', header: '#E0EBE0' },
  fair: { bg: '#FFF5E8', text: '#806030', dot: '#C8A050', header: '#F8EDD8' },
  poor: { bg: '#FAE8E8', text: '#804040', dot: '#C87070', header: '#F0DCDC' }
}

export default function ScorecardAccordionPanels({ driver = sampleDriver }) {
  const [view, setView] = useState('current')
  const [theme, setTheme] = useState('cream')
  const [modal, setModal] = useState(null)
  const [expanded, setExpanded] = useState({ profile: true, safety: true, delivery: false, feedback: false, dvic: false, focus: true })

  const t = themes[theme]
  const tierMap = { Platinum: 'fantastic', Gold: 'great', Silver: 'fair', Bronze: 'poor' }
  const tierColor = severity[tierMap[driver.tier]] || severity.fantastic

  const Modal = ({ data, onClose }) => {
    if (!data) return null
    const info = metricInfo[data.key] || { title: data.label, desc: '', calc: '', tips: [] }
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: t.card, borderRadius: '4px', maxWidth: '340px', width: '100%', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ padding: '28px', background: data.sev ? severity[data.sev].header : t.subtle }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: t.muted, marginBottom: '8px' }}>Metric Details</div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: t.text }}>{info.title}</div>
            {data.value !== undefined && (
              <div style={{ fontSize: '48px', fontWeight: '700', color: data.sev ? severity[data.sev].text : t.text, marginTop: '8px' }}>{data.value}{data.suffix || ''}</div>
            )}
          </div>
          <div style={{ padding: '24px' }}>
            <p style={{ fontSize: '14px', color: t.muted, lineHeight: 1.6, margin: '0 0 16px' }}>{info.desc}</p>
            {info.calc && <div style={{ padding: '14px', background: t.subtle, fontSize: '13px', color: t.text, borderLeft: `3px solid ${t.accent}` }}>{info.calc}</div>}
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <button onClick={onClose} style={{ width: '100%', padding: '14px', background: t.text, color: '#FFF', border: 'none', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  const AccordionHeader = ({ id, title, subtitle, sev, number }) => {
    const isOpen = expanded[id]
    const s = severity[sev] || severity.great
    return (
      <button onClick={() => toggle(id)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px', background: isOpen ? s.header : t.subtle, border: 'none',
        borderBottom: `1px solid ${t.border}`, cursor: 'pointer', textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: isOpen ? s.dot : t.border,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700', color: '#FFF'
          }}>{number}</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: t.text }}>{title}</div>
            {subtitle && <div style={{ fontSize: '12px', color: t.muted, marginTop: '2px' }}>{subtitle}</div>}
          </div>
        </div>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: isOpen ? t.card : t.border,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s'
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke={t.text} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </button>
    )
  }

  const DataRow = ({ k, label, value, suffix = '', sev, sub }) => (
    <div onClick={() => setModal({ key: k, label, value, suffix, sev })} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: sub ? '12px 20px 12px 52px' : '16px 20px',
      background: sub ? t.subtle : t.card,
      borderBottom: `1px solid ${t.border}`, cursor: 'pointer'
    }}>
      <span style={{ fontSize: sub ? '12px' : '14px', color: sub ? t.muted : t.text }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {sev && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: severity[sev].dot }} />}
        <span style={{ fontSize: '15px', fontWeight: '600', color: sev ? severity[sev].text : t.text }}>{value}{suffix}</span>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: t.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '20px', background: t.card, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em' }}>DiveMetric</div>
            <div style={{ fontSize: '12px', color: t.muted, marginTop: '4px' }}>Driver Performance Report</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: t.muted }}>Week</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: t.accent }}>{driver.week}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {Object.entries(themes).map(([k, v]) => (
            <button key={k} onClick={() => setTheme(k)} style={{
              flex: 1, padding: '10px 8px', border: theme === k ? `2px solid ${v.accent}` : `1px solid ${t.border}`,
              background: theme === k ? v.subtle : t.card, borderRadius: '8px', cursor: 'pointer'
            }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: theme === k ? v.accent : t.muted }}>{v.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', background: t.subtle }}>
        {[{ id: 'current', l: 'Current Week' }, { id: 'trailing', l: '6-Week Trailing' }].map(x => (
          <button key={x.id} onClick={() => setView(x.id)} style={{
            flex: 1, padding: '14px', border: 'none',
            background: view === x.id ? t.card : 'transparent',
            borderBottom: view === x.id ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
            color: view === x.id ? t.text : t.muted,
            fontSize: '12px', fontWeight: '600', cursor: 'pointer'
          }}>{x.l}</button>
        ))}
      </div>

      {/* Accordions */}
      <div>
        {/* Profile */}
        <AccordionHeader id="profile" title={driver.name} subtitle={`${driver.dsp} · ${driver.station} · ${driver.tier}`} sev={tierMap[driver.tier]} number="01" />
        {expanded.profile && (
          <div style={{ background: t.card, borderBottom: `1px solid ${t.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: `1px solid ${t.border}` }}>
              {[{ l: 'Deliveries', v: driver.deliveries.toLocaleString() }, { l: 'Rank', v: `#${driver.rank}/${driver.total}` }, { l: 'FICO', v: driver.fico }].map((m, i) => (
                <div key={i} style={{ padding: '20px', textAlign: 'center', borderRight: i < 2 ? `1px solid ${t.border}` : 'none' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: t.text }}>{m.v}</div>
                  <div style={{ fontSize: '10px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>{m.l}</div>
                </div>
              ))}
            </div>
            {driver.note && (
              <div style={{ padding: '16px 20px', borderLeft: `4px solid ${t.accent}`, background: t.subtle }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: t.accent, marginBottom: '4px' }}>DSP NOTE</div>
                <p style={{ fontSize: '13px', color: t.text, lineHeight: 1.5, margin: 0 }}>{driver.note}</p>
              </div>
            )}
          </div>
        )}

        {/* Safety */}
        <AccordionHeader id="safety" title="Driving Safety" subtitle="FICO, Events, Compliance" sev="fantastic" number="02" />
        {expanded.safety && (
          <div style={{ background: t.card }}>
            <DataRow k="onRoadSafetyScore" label="Safety Tier" value={driver.safety} sev="fantastic" />
            <DataRow k="ficoScore" label="FICO Score" value={`${driver.fico}/850`} sev={driver.fico >= 700 ? 'great' : 'fair'} />
            <DataRow k="ppsCompliance" label="PPS Compliance" value={driver.pps} suffix="%" />
            <DataRow k="ppsCompliance" label="Parking Brake Missed" value={driver.ppsBrake} sub />
            <DataRow k="ppsCompliance" label="Shift to Park Missed" value={driver.ppsPark} sub />
            <DataRow k="pawPrint" label="Paw Print" value={`${driver.pawSent}/${driver.pawTotal}`} sev="great" />
            <div style={{ padding: '12px 20px', background: t.subtle, borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: '10px', fontWeight: '600', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Events / 100 Deliveries</span>
            </div>
            <DataRow k="distractions" label="Distractions" value={driver.distractions} />
            <DataRow k="speeding" label="Speeding" value={driver.speeding} sev="poor" />
            <DataRow k="seatbelt" label="Seatbelt" value={driver.seatbelt} sev="great" />
            <DataRow k="followingDistance" label="Following Distance" value={driver.following} sev="fair" />
            <DataRow k="signals" label="Signal Violations" value={driver.signals} />
          </div>
        )}

        {/* Delivery */}
        <AccordionHeader id="delivery" title="Delivery Quality" subtitle="DCR, POD, Success Behaviors" sev="great" number="03" />
        {expanded.delivery && (
          <div style={{ background: t.card }}>
            <DataRow k="qualityScore" label="Quality Tier" value={driver.quality} sev="great" />
            <DataRow k="dcr" label="Completion Rate" value={driver.dcr} suffix="%" />
            <DataRow k="dnr" label="DNR Claims" value={driver.dnr} sev="fair" />
            <DataRow k="pod" label="POD Rate" value={driver.podRate} suffix="%" />
            <DataRow k="pod" label="Blurry" value={driver.podBlurry} sub />
            <DataRow k="pod" label="Human in Photo" value={driver.podHuman} sub />
            <DataRow k="pod" label="No Package" value={driver.podNoPackage} sub />
            <DataRow k="dsb" label="DSB Score" value={driver.dsb} sev="great" />
            <DataRow k="psb" label="PSB Score" value={driver.psb} sev="fair" />
          </div>
        )}

        {/* Feedback */}
        <AccordionHeader id="feedback" title="Customer Feedback" subtitle="DPMO, Escalations, Breakdown" sev="fair" number="04" />
        {expanded.feedback && (
          <div style={{ background: t.card }}>
            <DataRow k="feedbackScore" label="Feedback Tier" value={driver.feedback} sev="fair" />
            <DataRow k="cdfDpmo" label="CDF DPMO" value={driver.dpmo.toLocaleString()} sev="fair" />
            <DataRow k="escalations" label="Escalations" value={driver.escalations} sev="great" />
            <div style={{ padding: '12px 20px', background: t.subtle, borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: '10px', fontWeight: '600', color: t.muted, textTransform: 'uppercase' }}>Breakdown</span>
            </div>
            <DataRow k="cdfDpmo" label="Not Great" value={driver.negNotGreat} sub />
            <DataRow k="cdfDpmo" label="Instructions" value={driver.negInstructions} sub />
            <DataRow k="cdfDpmo" label="Wrong Address" value={driver.negAddress} sub />
            <DataRow k="cdfDpmo" label="Never Received" value={driver.negNever} sub />
          </div>
        )}

        {/* DVIC */}
        <AccordionHeader id="dvic" title="Vehicle Inspections" subtitle="DVIC Compliance" sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} number="05" />
        {expanded.dvic && (
          <div style={{ background: t.card }}>
            <DataRow k="dvic" label="Rushed Inspections" value={`${driver.dvicRushed}/${driver.dvicTotal}`} sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} />
            {driver.dvicList.map((x, i) => (
              <DataRow key={i} k="dvic" label={x.day} value={x.time} sev={x.status} sub />
            ))}
          </div>
        )}

        {/* Focus */}
        <AccordionHeader id="focus" title="Focus Area" subtitle={driver.focus} sev="fantastic" number="06" />
        {expanded.focus && (
          <div style={{ padding: '20px', background: t.card, borderBottom: `1px solid ${t.border}` }}>
            <p style={{ fontSize: '14px', color: t.text, lineHeight: 1.6, margin: 0 }}>{driver.guidance}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: t.muted }}>Tap any metric for details · DiveMetric Analytics</div>
      </div>

      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
