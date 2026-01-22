/**
 * Scorecard 2: Soft Cards
 * Rounded card-based metrics with lavender pastel accents
 * Gentle shadows and soft typography for approachability
 */

import React from 'react'

const sampleDriver = {
  name: "Alexander Roloff",
  tier: "Platinum",
  packagesDelivered: 271,
  dcr: 99.3,
  pod: 100,
  cdf: 0,
  ced: 100,
  seatbeltOffRate: 100,
  speedingEventRate: 100,
  distractionsRate: 0,
  followingDistanceRate: 100,
  signalViolationsRate: 0,
  podOpportunities: 185,
  podSuccess: 185,
  podRejects: 0,
}

export default function ScorecardSoftCards({ driver = sampleDriver }) {
  const tierConfig = {
    Platinum: { bg: '#f8f7ff', border: '#e8e4f8', text: '#6b5b9a' },
    Gold: { bg: '#fefcf3', border: '#f5e6c8', text: '#9a7b4f' },
    Silver: { bg: '#f7f8f9', border: '#e5e7eb', text: '#6b7280' },
    Bronze: { bg: '#fdf8f3', border: '#f0dcc8', text: '#8b6914' }
  }

  const config = tierConfig[driver.tier] || tierConfig.Silver

  const MetricCard = ({ label, value, subtitle, status = 'neutral' }) => {
    const statusColors = {
      excellent: { accent: '#e8e4f8', text: '#5b4b8a' },
      good: { accent: '#f3f4f6', text: '#374151' },
      neutral: { accent: '#faf5ff', text: '#6b7280' }
    }
    const colors = statusColors[status]

    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        border: '1px solid #f3f4f6'
      }}>
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginBottom: '12px',
          fontWeight: '500'
        }}>
          {label}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px',
          marginBottom: subtitle ? '8px' : 0
        }}>
          <span style={{
            fontSize: '32px',
            fontWeight: '600',
            color: colors.text,
            letterSpacing: '-0.02em'
          }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {typeof value === 'number' && value <= 100 && (
            <span style={{ fontSize: '14px', color: '#d1d5db' }}>%</span>
          )}
        </div>
        {subtitle && (
          <p style={{
            fontSize: '11px',
            color: '#b4b4b4',
            margin: 0
          }}>
            {subtitle}
          </p>
        )}
      </div>
    )
  }

  const SafetyBadge = ({ label, value, perfect }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 18px',
      background: perfect ? '#faf8ff' : '#fefefe',
      borderRadius: '12px',
      border: `1px solid ${perfect ? '#ebe5f7' : '#f0f0f0'}`
    }}>
      <span style={{
        fontSize: '13px',
        color: '#6b7280',
        fontWeight: '450'
      }}>
        {label}
      </span>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '600',
          color: perfect ? '#6b5b9a' : '#374151'
        }}>
          {value}%
        </span>
        {perfect && (
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#a78bfa'
          }} />
        )}
      </div>
    </div>
  )

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#fafafa',
      minHeight: '100vh',
      padding: '40px'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '8px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Driver Scorecard
            </p>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0,
              letterSpacing: '-0.01em'
            }}>
              {driver.name}
            </h1>
          </div>
          <div style={{
            background: config.bg,
            border: `1px solid ${config.border}`,
            borderRadius: '12px',
            padding: '12px 24px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '10px',
              color: '#9ca3af',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Status
            </p>
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              color: config.text,
              margin: 0
            }}>
              {driver.tier}
            </p>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <MetricCard
          label="Delivery Rate"
          value={driver.dcr}
          status="excellent"
        />
        <MetricCard
          label="POD Quality"
          value={driver.pod}
          subtitle={`${driver.podSuccess} of ${driver.podOpportunities} accepted`}
          status="excellent"
        />
        <MetricCard
          label="Customer Defects"
          value={driver.cdf}
          subtitle="Lower is better"
          status={driver.cdf === 0 ? 'excellent' : 'neutral'}
        />
        <MetricCard
          label="Packages Delivered"
          value={driver.packagesDelivered}
          status="neutral"
        />
      </div>

      {/* Safety Section */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        border: '1px solid #f3f4f6'
      }}>
        <h2 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '4px',
            height: '16px',
            background: 'linear-gradient(180deg, #a78bfa 0%, #ddd6fe 100%)',
            borderRadius: '2px'
          }} />
          Safety Performance
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          <SafetyBadge label="Seatbelt Compliance" value={driver.seatbeltOffRate} perfect={driver.seatbeltOffRate === 100} />
          <SafetyBadge label="Speed Compliance" value={driver.speedingEventRate} perfect={driver.speedingEventRate === 100} />
          <SafetyBadge label="Distraction-Free" value={100 - driver.distractionsRate} perfect={driver.distractionsRate === 0} />
          <SafetyBadge label="Safe Following" value={driver.followingDistanceRate} perfect={driver.followingDistanceRate === 100} />
          <SafetyBadge label="Signal Compliance" value={100 - driver.signalViolationsRate} perfect={driver.signalViolationsRate === 0} />
          <SafetyBadge label="Customer Experience" value={driver.ced} perfect={driver.ced === 100} />
        </div>
      </div>

      {/* Footer Tip */}
      <div style={{
        marginTop: '24px',
        padding: '20px 24px',
        background: '#faf8ff',
        borderRadius: '16px',
        border: '1px solid #ebe5f7',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: '#e8e4f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0
        }}>
          &#9733;
        </div>
        <div>
          <p style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#5b4b8a',
            marginBottom: '4px'
          }}>
            Excellent Performance
          </p>
          <p style={{
            fontSize: '12px',
            color: '#7c6b9e',
            margin: 0
          }}>
            Keep maintaining your current standards. Your safety and delivery metrics are outstanding.
          </p>
        </div>
      </div>
    </div>
  )
}
