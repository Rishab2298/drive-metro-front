/**
 * Scorecard 15: Mini Dashboard
 * Compact all-in-one view optimized for quick glances
 * Dense information display with purple/violet accents
 */

import React from 'react'

const systemFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const sampleDriver = {
  name: "Olivia Thompson",
  firstName: "Olivia",
  tier: "Platinum",
  packagesDelivered: 867,
  dcr: 99.4,
  pod: 98.2,
  cdf: 93.7,
  dsb: 97.1,
  ced: 99,
  seatbeltOffRate: 100,
  speedingEventRate: 100,
  distractionsRate: 0.2,
  followingDistanceRate: 100,
  signalViolationsRate: 0,
  dvicComplianceRate: 100,
  ppsComplianceRate: 98,
}

export default function ScorecardMiniDashboard({ driver = sampleDriver }) {
  const MiniMetric = ({ label, value, icon, good }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px',
      background: good ? '#faf5ff' : '#ffffff',
      borderRadius: '10px',
      border: `1px solid ${good ? '#e9d5ff' : '#f3f4f6'}`
    }}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: systemFont,
          fontSize: '11px',
          color: '#9ca3af',
          margin: 0
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: systemFont,
          fontSize: '16px',
          fontWeight: '700',
          color: good ? '#7c3aed' : '#374151',
          margin: 0
        }}>
          {typeof value === 'number' ? `${value.toFixed(1)}%` : value}
        </p>
      </div>
    </div>
  )

  const SafetyDot = ({ label, value }) => {
    const isGood = value >= 99
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isGood ? '#a78bfa' : '#fbbf24'
          }} />
          <span style={{
            fontFamily: systemFont,
            fontSize: '13px',
            color: '#6b7280'
          }}>
            {label}
          </span>
        </div>
        <span style={{
          fontFamily: systemFont,
          fontSize: '13px',
          fontWeight: '600',
          color: isGood ? '#7c3aed' : '#d97706'
        }}>
          {value.toFixed(1)}%
        </span>
      </div>
    )
  }

  const overallScore = ((driver.dcr + driver.pod + driver.cdf + driver.dsb) / 4)

  return (
    <div style={{
      fontFamily: systemFont,
      background: '#faf5ff',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      padding: '16px'
    }}>
      {/* Compact Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0
          }}>
            {driver.firstName}
          </h1>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            margin: '2px 0 0 0'
          }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            textAlign: 'right'
          }}>
            <p style={{
              fontSize: '10px',
              color: '#9ca3af',
              margin: 0
            }}>
              TIER
            </p>
            <p style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#7c3aed',
              margin: 0
            }}>
              {driver.tier}
            </p>
          </div>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            {overallScore.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Main Score Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          <MiniMetric label="Delivery Rate" value={driver.dcr} icon="📦" good={driver.dcr >= 98} />
          <MiniMetric label="POD Quality" value={driver.pod} icon="📸" good={driver.pod >= 95} />
          <MiniMetric label="Customer Score" value={driver.cdf} icon="⭐" good={driver.cdf >= 90} />
          <MiniMetric label="Success Rate" value={driver.dsb} icon="✓" good={driver.dsb >= 95} />
        </div>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '12px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#7c3aed',
            margin: 0
          }}>
            {driver.packagesDelivered}
          </p>
          <p style={{
            fontSize: '10px',
            color: '#9ca3af',
            margin: '2px 0 0 0'
          }}>
            Packages
          </p>
        </div>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#7c3aed',
            margin: 0
          }}>
            {driver.dvicComplianceRate}%
          </p>
          <p style={{
            fontSize: '10px',
            color: '#9ca3af',
            margin: '2px 0 0 0'
          }}>
            DVIC
          </p>
        </div>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#7c3aed',
            margin: 0
          }}>
            {driver.ppsComplianceRate}%
          </p>
          <p style={{
            fontSize: '10px',
            color: '#9ca3af',
            margin: '2px 0 0 0'
          }}>
            PPS
          </p>
        </div>
      </div>

      {/* Safety Summary */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px'
      }}>
        <h3 style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#7c3aed',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: '0 0 12px 0'
        }}>
          Safety Overview
        </h3>
        <SafetyDot label="Seatbelt" value={driver.seatbeltOffRate} />
        <SafetyDot label="Speed" value={driver.speedingEventRate} />
        <SafetyDot label="Distraction-Free" value={100 - driver.distractionsRate} />
        <SafetyDot label="Following Distance" value={driver.followingDistanceRate} />
        <SafetyDot label="Signals" value={100 - driver.signalViolationsRate} />
      </div>

      {/* Quick Tip */}
      <div style={{
        background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
        borderRadius: '12px',
        padding: '14px 16px',
        color: '#ffffff'
      }}>
        <p style={{
          fontSize: '12px',
          fontWeight: '600',
          margin: '0 0 4px 0',
          opacity: 0.9
        }}>
          Weekly Insight
        </p>
        <p style={{
          fontSize: '13px',
          margin: 0,
          lineHeight: 1.4
        }}>
          {overallScore >= 95
            ? 'Outstanding week! You\'re in the top tier of performers.'
            : 'Good progress! Focus on consistency to reach Platinum tier.'}
        </p>
      </div>
    </div>
  )
}
