/**
 * Scorecard 14: Status Pulse
 * Animated status indicators with pulse effects
 * Real-time feel with cyan/aqua accents
 */

import React from 'react'

const systemFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const sampleDriver = {
  name: "James Wilson",
  firstName: "James",
  tier: "Gold",
  packagesDelivered: 528,
  dcr: 96.8,
  pod: 93.5,
  cdf: 84.2,
  dsb: 89.7,
  seatbeltOffRate: 100,
  speedingEventRate: 97,
  distractionsRate: 1.5,
  followingDistanceRate: 96,
  signalViolationsRate: 0.8,
}

export default function ScorecardStatusPulse({ driver = sampleDriver }) {
  const getStatus = (value, target) => {
    if (value >= target) return { status: 'excellent', color: '#06b6d4', pulse: true }
    if (value >= target - 5) return { status: 'good', color: '#22d3d1', pulse: false }
    if (value >= target - 15) return { status: 'warning', color: '#fbbf24', pulse: true }
    return { status: 'critical', color: '#f87171', pulse: true }
  }

  const StatusIndicator = ({ value, label, target, description }) => {
    const { status, color, pulse } = getStatus(value, target)

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '18px 20px',
        background: '#ffffff',
        borderRadius: '16px',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        {/* Pulse indicator */}
        <div style={{
          position: 'relative',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {pulse && (
            <div style={{
              position: 'absolute',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: color,
              opacity: 0.2,
              animation: 'pulse 2s infinite'
            }} />
          )}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '700',
            fontFamily: systemFont,
            boxShadow: `0 4px 12px ${color}40`
          }}>
            {value.toFixed(0)}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <span style={{
              fontFamily: systemFont,
              fontSize: '15px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: systemFont,
              fontSize: '12px',
              fontWeight: '500',
              color: color,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {status}
            </span>
          </div>
          <p style={{
            fontFamily: systemFont,
            fontSize: '12px',
            color: '#9ca3af',
            margin: 0
          }}>
            {description} • Target: {target}%
          </p>
        </div>
      </div>
    )
  }

  const overallScore = ((driver.dcr + driver.pod + driver.cdf + driver.dsb) / 4)
  const overallStatus = getStatus(overallScore, 95)

  return (
    <div style={{
      fontFamily: systemFont,
      background: 'linear-gradient(180deg, #ecfeff 0%, #f0fdfa 100%)',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto'
    }}>
      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.5); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '24px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: 'rgba(6, 182, 212, 0.1)',
          borderRadius: '20px',
          marginBottom: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#06b6d4',
            animation: 'pulse 1.5s infinite'
          }} />
          <span style={{
            fontSize: '12px',
            color: '#0891b2',
            fontWeight: '600'
          }}>
            LIVE STATUS
          </span>
        </div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          {driver.firstName}'s Scorecard
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          margin: 0
        }}>
          Real-time performance monitoring
        </p>
      </div>

      {/* Overall Status Card */}
      <div style={{
        margin: '0 16px 24px',
        padding: '24px',
        background: '#ffffff',
        borderRadius: '20px',
        textAlign: 'center',
        animation: 'glow 3s infinite',
        boxShadow: '0 4px 20px rgba(6, 182, 212, 0.15)'
      }}>
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
          margin: '0 0 8px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Overall Performance
        </p>
        <div style={{
          fontSize: '56px',
          fontWeight: '700',
          color: overallStatus.color,
          lineHeight: 1
        }}>
          {overallScore.toFixed(1)}
          <span style={{ fontSize: '24px', color: '#d1d5db' }}>%</span>
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '12px',
          padding: '8px 16px',
          background: `${overallStatus.color}15`,
          borderRadius: '20px'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: overallStatus.color
          }}>
            {driver.tier} Tier
          </span>
          <span style={{
            fontSize: '14px',
            color: '#9ca3af'
          }}>
            •
          </span>
          <span style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            {driver.packagesDelivered} packages
          </span>
        </div>
      </div>

      {/* Metric Status List */}
      <div style={{ padding: '0 16px' }}>
        <StatusIndicator
          value={driver.dcr}
          label="Delivery Completion"
          target={98}
          description="Successful delivery rate"
        />
        <StatusIndicator
          value={driver.pod}
          label="POD Quality"
          target={95}
          description="Photo acceptance rate"
        />
        <StatusIndicator
          value={driver.cdf}
          label="Customer Defect Free"
          target={85}
          description="Delivery accuracy score"
        />
        <StatusIndicator
          value={driver.dsb}
          label="Success Behaviors"
          target={90}
          description="Best practices compliance"
        />

        {/* Safety Section */}
        <h3 style={{
          fontSize: '12px',
          color: '#06b6d4',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: '24px 0 12px 4px'
        }}>
          Safety Metrics
        </h3>

        <StatusIndicator
          value={driver.seatbeltOffRate}
          label="Seatbelt Compliance"
          target={100}
          description="Always buckle up"
        />
        <StatusIndicator
          value={driver.speedingEventRate}
          label="Speed Compliance"
          target={100}
          description="Drive within limits"
        />
        <StatusIndicator
          value={100 - driver.distractionsRate}
          label="Distraction Free"
          target={99}
          description="Stay focused on the road"
        />
      </div>

      {/* Footer Tip */}
      <div style={{
        margin: '24px 16px',
        padding: '16px 20px',
        background: '#ffffff',
        borderRadius: '12px',
        borderLeft: '4px solid #06b6d4'
      }}>
        <p style={{
          fontSize: '13px',
          color: '#0e7490',
          margin: 0,
          lineHeight: 1.5
        }}>
          <strong>Focus Area:</strong> {driver.cdf < 85
            ? 'Improve customer experience by following delivery instructions carefully.'
            : driver.pod < 95
              ? 'Take clearer POD photos for better acceptance rates.'
              : 'Excellent work! Maintain your current performance levels.'}
        </p>
      </div>
    </div>
  )
}
