/**
 * Scorecard 17: Checklist Style
 * Task completion checklist format
 * Satisfying check-off visual feedback
 * Fresh green pastel accents
 */

import React from 'react'

const systemFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const sampleDriver = {
  name: "Emma Rodriguez",
  firstName: "Emma",
  tier: "Gold",
  packagesDelivered: 512,
  dcr: 98.2,
  pod: 96.5,
  cdf: 88.7,
  dsb: 94.3,
  seatbeltOffRate: 100,
  speedingEventRate: 100,
  distractionsRate: 0.4,
  followingDistanceRate: 99.5,
  signalViolationsRate: 0,
  dvicComplianceRate: 100,
  ppsComplianceRate: 92,
}

export default function ScorecardChecklist({ driver = sampleDriver }) {
  const deliveryChecks = [
    { label: 'Delivery Rate ≥ 98%', value: driver.dcr, target: 98, met: driver.dcr >= 98 },
    { label: 'POD Quality ≥ 95%', value: driver.pod, target: 95, met: driver.pod >= 95 },
    { label: 'Customer Score ≥ 85%', value: driver.cdf, target: 85, met: driver.cdf >= 85 },
    { label: 'Success Behaviors ≥ 90%', value: driver.dsb, target: 90, met: driver.dsb >= 90 },
  ]

  const safetyChecks = [
    { label: 'Seatbelt Always On', value: driver.seatbeltOffRate, target: 100, met: driver.seatbeltOffRate === 100 },
    { label: 'No Speeding Events', value: driver.speedingEventRate, target: 100, met: driver.speedingEventRate === 100 },
    { label: 'Distraction-Free Driving', value: 100 - driver.distractionsRate, target: 99, met: driver.distractionsRate < 1 },
    { label: 'Safe Following Distance', value: driver.followingDistanceRate, target: 99, met: driver.followingDistanceRate >= 99 },
    { label: 'Signal Compliance', value: 100 - driver.signalViolationsRate, target: 100, met: driver.signalViolationsRate === 0 },
  ]

  const complianceChecks = [
    { label: 'DVIC Complete', value: driver.dvicComplianceRate, target: 100, met: driver.dvicComplianceRate === 100 },
    { label: 'PPS Compliance ≥ 90%', value: driver.ppsComplianceRate, target: 90, met: driver.ppsComplianceRate >= 90 },
  ]

  const allChecks = [...deliveryChecks, ...safetyChecks, ...complianceChecks]
  const completedCount = allChecks.filter(c => c.met).length
  const totalCount = allChecks.length
  const completionPercent = (completedCount / totalCount) * 100

  const CheckItem = ({ item }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '16px',
      background: item.met ? '#f0fdf4' : '#ffffff',
      borderRadius: '12px',
      marginBottom: '8px',
      border: `1px solid ${item.met ? '#bbf7d0' : '#f3f4f6'}`,
      transition: 'all 0.2s ease'
    }}>
      {/* Checkbox */}
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        border: item.met ? 'none' : '2px solid #d1d5db',
        background: item.met ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' : '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: item.met ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none'
      }}>
        {item.met && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7L5.5 10L11.5 4"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: systemFont,
          fontSize: '14px',
          fontWeight: item.met ? '600' : '500',
          color: item.met ? '#166534' : '#374151',
          margin: 0,
          textDecoration: item.met ? 'none' : 'none'
        }}>
          {item.label}
        </p>
      </div>

      {/* Value */}
      <span style={{
        fontFamily: systemFont,
        fontSize: '15px',
        fontWeight: '700',
        color: item.met ? '#22c55e' : '#9ca3af'
      }}>
        {item.value.toFixed(1)}%
      </span>
    </div>
  )

  const SectionHeader = ({ title, completed, total }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '24px 0 12px 0'
    }}>
      <h3 style={{
        fontFamily: systemFont,
        fontSize: '13px',
        fontWeight: '700',
        color: '#22c55e',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        margin: 0
      }}>
        {title}
      </h3>
      <span style={{
        fontFamily: systemFont,
        fontSize: '12px',
        color: '#9ca3af'
      }}>
        {completed}/{total}
      </span>
    </div>
  )

  return (
    <div style={{
      fontFamily: systemFont,
      background: '#f8fdf9',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      paddingBottom: '24px'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        padding: '20px',
        borderBottom: '1px solid #ecfdf5'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <p style={{
              fontSize: '12px',
              color: '#22c55e',
              fontWeight: '600',
              margin: '0 0 4px 0'
            }}>
              WEEKLY CHECKLIST
            </p>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              {driver.firstName}'s Progress
            </h1>
          </div>
          <div style={{
            padding: '8px 14px',
            background: '#f0fdf4',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#166534'
          }}>
            {driver.tier}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Completion
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#22c55e'
            }}>
              {completedCount} of {totalCount}
            </span>
          </div>
          <div style={{
            height: '10px',
            background: '#dcfce7',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${completionPercent}%`,
              background: 'linear-gradient(90deg, #4ade80 0%, #22c55e 100%)',
              borderRadius: '5px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Checklists */}
      <div style={{ padding: '0 16px' }}>
        <SectionHeader
          title="Delivery Targets"
          completed={deliveryChecks.filter(c => c.met).length}
          total={deliveryChecks.length}
        />
        {deliveryChecks.map((item, i) => (
          <CheckItem key={i} item={item} />
        ))}

        <SectionHeader
          title="Safety Requirements"
          completed={safetyChecks.filter(c => c.met).length}
          total={safetyChecks.length}
        />
        {safetyChecks.map((item, i) => (
          <CheckItem key={i} item={item} />
        ))}

        <SectionHeader
          title="Compliance"
          completed={complianceChecks.filter(c => c.met).length}
          total={complianceChecks.length}
        />
        {complianceChecks.map((item, i) => (
          <CheckItem key={i} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div style={{
        margin: '24px 16px 0',
        padding: '20px',
        background: completedCount === totalCount
          ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
          : '#ffffff',
        borderRadius: '16px',
        textAlign: 'center',
        boxShadow: completedCount === totalCount
          ? '0 4px 20px rgba(34, 197, 94, 0.3)'
          : '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        {completedCount === totalCount ? (
          <>
            <p style={{
              fontSize: '24px',
              margin: '0 0 8px 0'
            }}>
              🎉
            </p>
            <p style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0
            }}>
              Perfect Week! All targets met!
            </p>
          </>
        ) : (
          <>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              {totalCount - completedCount} more {totalCount - completedCount === 1 ? 'target' : 'targets'} to hit this week
            </p>
          </>
        )}
      </div>
    </div>
  )
}
