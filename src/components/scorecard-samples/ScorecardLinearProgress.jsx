/**
 * Scorecard 3: Linear Progress
 * Horizontal progress bars with peach/coral pastel tones
 * Clean lines and clear visual hierarchy for easy scanning
 */

import React from 'react'

const sampleDriver = {
  name: "Asia Henderson",
  tier: "Platinum",
  packagesDelivered: 891,
  dcr: 100,
  pod: 100,
  cdf: 36.69,
  ced: 100,
  dsb: 100,
  seatbeltOffRate: 100,
  speedingEventRate: 100,
  distractionsRate: 0,
  followingDistanceRate: 100,
  signalViolationsRate: 0,
  podOpportunities: 596,
  podSuccess: 596,
  dvicComplianceRate: 100,
  ppsComplianceRate: 85,
}

export default function ScorecardLinearProgress({ driver = sampleDriver }) {
  const ProgressBar = ({ label, value, target = 100, showTarget = false, inverted = false }) => {
    const percentage = inverted ? (100 - value) : Math.min((value / target) * 100, 100)
    const isGood = inverted ? value < 5 : value >= 95
    const isMedium = inverted ? value < 20 : value >= 80

    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151'
          }}>
            {label}
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '4px'
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              color: isGood ? '#c96f53' : isMedium ? '#6b7280' : '#374151'
            }}>
              {value.toFixed(1)}
            </span>
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
              {showTarget ? `/ ${target}` : '%'}
            </span>
          </div>
        </div>
        <div style={{
          height: '8px',
          background: '#f5f5f5',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${percentage}%`,
            background: isGood
              ? 'linear-gradient(90deg, #f5cdc1 0%, #e8a090 100%)'
              : isMedium
                ? 'linear-gradient(90deg, #e5e7eb 0%, #d1d5db 100%)'
                : 'linear-gradient(90deg, #fef3c7 0%, #fcd34d 100%)',
            borderRadius: '4px',
            transition: 'width 0.8s ease-out'
          }} />
          {/* Target marker */}
          {showTarget && (
            <div style={{
              position: 'absolute',
              left: '95%',
              top: '-2px',
              bottom: '-2px',
              width: '2px',
              background: '#c96f53',
              borderRadius: '1px'
            }} />
          )}
        </div>
      </div>
    )
  }

  const StatBlock = ({ label, value, unit = '' }) => (
    <div style={{
      textAlign: 'center',
      padding: '20px'
    }}>
      <p style={{
        fontSize: '11px',
        color: '#9ca3af',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '28px',
        fontWeight: '300',
        color: '#1f2937',
        margin: 0
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
        <span style={{ fontSize: '14px', color: '#d1d5db', marginLeft: '2px' }}>{unit}</span>
      </p>
    </div>
  )

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: '#ffffff',
      minHeight: '100vh',
      padding: '48px 56px'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '48px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '500',
            color: '#1f2937',
            margin: 0,
            marginBottom: '8px'
          }}>
            {driver.name}
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#9ca3af',
            margin: 0
          }}>
            Performance Overview
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          background: '#fef7f4',
          borderRadius: '8px'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#e8a090'
          }} />
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#c96f53'
          }}>
            {driver.tier} Tier
          </span>
        </div>
      </header>

      {/* Key Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: '1px solid #f3f4f6',
        borderBottom: '1px solid #f3f4f6',
        marginBottom: '48px'
      }}>
        <StatBlock label="Packages" value={driver.packagesDelivered} />
        <div style={{ borderLeft: '1px solid #f3f4f6' }}>
          <StatBlock label="Completion Rate" value={driver.dcr} unit="%" />
        </div>
        <div style={{ borderLeft: '1px solid #f3f4f6' }}>
          <StatBlock label="POD Success" value={driver.podSuccess} unit={`/${driver.podOpportunities}`} />
        </div>
        <div style={{ borderLeft: '1px solid #f3f4f6' }}>
          <StatBlock label="DVIC" value={driver.dvicComplianceRate} unit="%" />
        </div>
      </div>

      {/* Progress Bars Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '64px'
      }}>
        {/* Delivery Metrics */}
        <section>
          <h2 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#c96f53',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '2px solid #fef7f4'
          }}>
            Delivery Performance
          </h2>
          <ProgressBar label="Delivery Completion Rate" value={driver.dcr} showTarget />
          <ProgressBar label="POD Quality Score" value={driver.pod} showTarget />
          <ProgressBar label="Customer Defect Free" value={100 - driver.cdf} />
          <ProgressBar label="Delivery Success Behaviors" value={driver.dsb} />
        </section>

        {/* Safety Metrics */}
        <section>
          <h2 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#c96f53',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '2px solid #fef7f4'
          }}>
            Safety Compliance
          </h2>
          <ProgressBar label="Seatbelt Compliance" value={driver.seatbeltOffRate} showTarget />
          <ProgressBar label="Speed Compliance" value={driver.speedingEventRate} showTarget />
          <ProgressBar label="Distraction-Free Driving" value={100 - driver.distractionsRate} />
          <ProgressBar label="Safe Following Distance" value={driver.followingDistanceRate} showTarget />
        </section>
      </div>

      {/* Learning Insight */}
      <div style={{
        marginTop: '48px',
        padding: '24px 28px',
        background: '#fef7f4',
        borderRadius: '8px',
        borderLeft: '3px solid #e8a090'
      }}>
        <h3 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#c96f53',
          marginBottom: '8px'
        }}>
          Focus Area
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          margin: 0,
          lineHeight: 1.6
        }}>
          {driver.cdf > 50
            ? 'Customer defect rate needs attention. Focus on package handling and delivery accuracy to improve customer satisfaction.'
            : driver.ppsComplianceRate < 90
              ? 'Improve PPS compliance by following pre-delivery photo protocols at each stop.'
              : 'Excellent performance across all metrics. Maintain your current standards and help mentor newer drivers.'}
        </p>
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: '48px',
        paddingTop: '24px',
        borderTop: '1px solid #f3f4f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <p style={{
          fontSize: '11px',
          color: '#d1d5db',
          margin: 0
        }}>
          Target threshold: 95% for all metrics
        </p>
        <p style={{
          fontSize: '11px',
          color: '#d1d5db',
          margin: 0
        }}>
          Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </footer>
    </div>
  )
}
