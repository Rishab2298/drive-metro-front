/**
 * Scorecard 31: Tab Matrix
 * Grid of tabbed metric groups
 * Compact tabbed sections in a matrix layout
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
  cream: { name: "Cream", bg: '#FDFCF8', card: '#FFFFFF', text: '#3A3528', muted: '#908A7D', border: '#E8E4DC', accent: '#B8A888' },
  sage: { name: "Sage", bg: '#F5F9F5', card: '#FFFFFF', text: '#2A3D2A', muted: '#6A8A6A', border: '#D2E2D2', accent: '#68A068' },
  lavender: { name: "Lavender", bg: '#F8F6FB', card: '#FFFFFF', text: '#38304D', muted: '#786DA0', border: '#DAD4E4', accent: '#8570B8' },
  rose: { name: "Rose", bg: '#FBF7F7', card: '#FFFFFF', text: '#483333', muted: '#9D8282', border: '#E4D8D8', accent: '#BE8888' },
  sky: { name: "Sky", bg: '#F5F9FB', card: '#FFFFFF', text: '#2A404D', muted: '#5D8598', border: '#D2E0E8', accent: '#5898B8' }
}

const severity = {
  fantastic: { bg: '#EBE5F2', text: '#4D3898', dot: '#8570B8' },
  great: { bg: '#DFF0DF', text: '#2D6030', dot: '#68A068' },
  fair: { bg: '#FFF2DD', text: '#8D5800', dot: '#D0A020' },
  poor: { bg: '#FBDDDD', text: '#982828', dot: '#D05858' }
}

export default function ScorecardTabMatrix({ driver = sampleDriver }) {
  const [view, setView] = useState('current')
  const [theme, setTheme] = useState('cream')
  const [modal, setModal] = useState(null)
  const [activeTabs, setActiveTabs] = useState({ safety: 'main', delivery: 'main', feedback: 'main' })

  const t = themes[theme]
  const tierMap = { Platinum: 'fantastic', Gold: 'great', Silver: 'fair', Bronze: 'poor' }
  const tierColor = severity[tierMap[driver.tier]] || severity.fantastic

  const setTab = (section, tab) => setActiveTabs(p => ({ ...p, [section]: tab }))

  const Modal = ({ data, onClose }) => {
    if (!data) return null
    const info = metricInfo[data.key] || { title: data.label, desc: '', tips: [] }
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: t.card, borderRadius: '16px', maxWidth: '300px', width: '100%', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: '15px', fontWeight: '600', color: t.text }}>{info.title}</div>
            {data.value !== undefined && (
              <div style={{ fontSize: '32px', fontWeight: '700', color: data.sev ? severity[data.sev].text : t.text, marginTop: '6px' }}>{data.value}{data.suffix || ''}</div>
            )}
          </div>
          <div style={{ padding: '16px 20px' }}>
            <p style={{ fontSize: '13px', color: t.muted, lineHeight: 1.5, margin: 0 }}>{info.desc}</p>
          </div>
          <div style={{ padding: '12px 20px', background: t.bg }}>
            <button onClick={onClose} style={{ width: '100%', padding: '12px', background: t.text, color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  const MatrixCard = ({ title, icon, tabs, activeTab, onTabChange, children }) => (
    <div style={{ background: t.card, borderRadius: '16px', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
      {/* Header with tabs */}
      <div style={{ padding: '12px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '14px' }}>{icon}</span>
          <span style={{ fontSize: '12px', fontWeight: '600', color: t.text }}>{title}</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
              flex: 1, padding: '6px', borderRadius: '6px', border: 'none',
              background: activeTab === tab.id ? t.bg : 'transparent',
              color: activeTab === tab.id ? t.text : t.muted,
              fontSize: '10px', fontWeight: '500', cursor: 'pointer'
            }}>{tab.label}</button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div style={{ padding: '12px' }}>
        {children}
      </div>
    </div>
  )

  const Metric = ({ k, label, value, suffix = '', sev, compact }) => (
    <div onClick={() => setModal({ key: k, label, value, suffix, sev })} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: compact ? '8px 10px' : '10px 12px',
      background: t.bg, borderRadius: '8px', marginBottom: '6px', cursor: 'pointer'
    }}>
      <span style={{ fontSize: compact ? '10px' : '11px', color: t.muted }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {sev && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: severity[sev].dot }} />}
        <span style={{ fontSize: compact ? '12px' : '13px', fontWeight: '600', color: sev ? severity[sev].text : t.text }}>{value}{suffix}</span>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif", background: t.bg, minHeight: '100vh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '16px', background: t.card, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: t.text }}>DiveMetric</div>
            <div style={{ fontSize: '11px', color: t.muted }}>Week {driver.week} Matrix</div>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: t.bg, borderRadius: '8px', padding: '3px' }}>
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

        {/* Theme Row */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {Object.entries(themes).map(([k, v]) => (
            <button key={k} onClick={() => setTheme(k)} style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: v.accent, border: theme === k ? '2px solid #FFF' : 'none',
              boxShadow: theme === k ? `0 0 0 2px ${v.accent}` : 'none',
              cursor: 'pointer'
            }} />
          ))}
        </div>

        {/* Profile Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: `linear-gradient(135deg, ${tierColor.dot}, ${tierColor.text})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700', color: '#FFF'
          }}>
            {driver.firstName[0]}{driver.lastName[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: t.text }}>{driver.name}</div>
            <div style={{ fontSize: '11px', color: t.muted }}>{driver.dsp} · #{driver.rank}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ padding: '8px 12px', background: tierColor.bg, borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: tierColor.text }}>{driver.tier}</div>
              <div style={{ fontSize: '8px', color: t.muted }}>TIER</div>
            </div>
            <div style={{ padding: '8px 12px', background: t.bg, borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: t.text }}>{driver.fico}</div>
              <div style={{ fontSize: '8px', color: t.muted }}>FICO</div>
            </div>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {/* Safety Card */}
        <MatrixCard title="Safety" icon="🛡️" tabs={[{ id: 'main', label: 'Main' }, { id: 'events', label: 'Events' }]} activeTab={activeTabs.safety} onTabChange={(t) => setTab('safety', t)}>
          {activeTabs.safety === 'main' ? (
            <>
              <Metric k="onRoadSafetyScore" label="Tier" value={driver.safety} sev="fantastic" compact />
              <Metric k="ficoScore" label="FICO" value={driver.fico} sev={driver.fico >= 700 ? 'great' : 'fair'} compact />
              <Metric k="ppsCompliance" label="PPS" value={driver.pps} suffix="%" compact />
              <Metric k="pawPrint" label="Paw" value={Math.round(driver.pawSent / driver.pawTotal * 100)} suffix="%" sev="great" compact />
            </>
          ) : (
            <>
              <Metric k="distractions" label="Distract" value={driver.distractions} compact />
              <Metric k="speeding" label="Speed" value={driver.speeding} sev="poor" compact />
              <Metric k="seatbelt" label="Belt" value={driver.seatbelt} sev="great" compact />
              <Metric k="followingDistance" label="Follow" value={driver.following} sev="fair" compact />
              <Metric k="signals" label="Signal" value={driver.signals} compact />
            </>
          )}
        </MatrixCard>

        {/* Delivery Card */}
        <MatrixCard title="Delivery" icon="📦" tabs={[{ id: 'main', label: 'Main' }, { id: 'pod', label: 'POD' }]} activeTab={activeTabs.delivery} onTabChange={(t) => setTab('delivery', t)}>
          {activeTabs.delivery === 'main' ? (
            <>
              <Metric k="qualityScore" label="Tier" value={driver.quality} sev="great" compact />
              <Metric k="dcr" label="DCR" value={driver.dcr} suffix="%" compact />
              <Metric k="dnr" label="DNR" value={driver.dnr} sev="fair" compact />
              <Metric k="dsb" label="DSB" value={driver.dsb} sev="great" compact />
            </>
          ) : (
            <>
              <Metric k="pod" label="Rate" value={driver.podRate} suffix="%" compact />
              <Metric k="pod" label="Rejects" value={driver.podRejects} compact />
              <Metric k="pod" label="Blurry" value={driver.podBlurry} compact />
              <Metric k="pod" label="Human" value={driver.podHuman} compact />
              <Metric k="psb" label="PSB" value={driver.psb} sev="fair" compact />
            </>
          )}
        </MatrixCard>

        {/* Feedback Card */}
        <MatrixCard title="Feedback" icon="💬" tabs={[{ id: 'main', label: 'Main' }, { id: 'detail', label: 'Detail' }]} activeTab={activeTabs.feedback} onTabChange={(t) => setTab('feedback', t)}>
          {activeTabs.feedback === 'main' ? (
            <>
              <Metric k="feedbackScore" label="Tier" value={driver.feedback} sev="fair" compact />
              <Metric k="cdfDpmo" label="DPMO" value={driver.dpmo.toLocaleString()} sev="fair" compact />
              <Metric k="escalations" label="Escalate" value={driver.escalations} sev="great" compact />
            </>
          ) : (
            <>
              <Metric k="cdfDpmo" label="Not Great" value={driver.negNotGreat} compact />
              <Metric k="cdfDpmo" label="Instructions" value={driver.negInstructions} compact />
              <Metric k="cdfDpmo" label="Address" value={driver.negAddress} compact />
              <Metric k="cdfDpmo" label="Not Recv" value={driver.negNever} compact />
            </>
          )}
        </MatrixCard>

        {/* DVIC Card */}
        <div style={{ background: t.card, borderRadius: '16px', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '12px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>🔧</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: t.text }}>DVIC</span>
            </div>
          </div>
          <div style={{ padding: '12px' }}>
            <Metric k="dvic" label="Rushed" value={`${driver.dvicRushed}/${driver.dvicTotal}`} sev={driver.dvicRushed > 0 ? 'fair' : 'fantastic'} compact />
            {driver.dvicList.map((x, i) => (
              <Metric key={i} k="dvic" label={x.day} value={x.time} sev={x.status} compact />
            ))}
          </div>
        </div>
      </div>

      {/* Focus Area - Full Width */}
      <div style={{ padding: '0 12px 24px' }}>
        <div style={{
          background: t.card, borderRadius: '16px', padding: '16px',
          border: `1px solid ${t.border}`, borderLeft: `4px solid ${t.accent}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px' }}>🎯</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: t.accent, textTransform: 'uppercase' }}>Focus Area</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: t.text, marginBottom: '6px' }}>{driver.focus}</div>
          <p style={{ fontSize: '12px', color: t.muted, lineHeight: 1.5, margin: 0 }}>{driver.guidance}</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', textAlign: 'center', borderTop: `1px solid ${t.border}` }}>
        <div style={{ fontSize: '10px', color: t.muted }}>Tap metrics for details · DiveMetric</div>
      </div>

      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
