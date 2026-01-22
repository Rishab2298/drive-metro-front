/**
 * Scorecard 1: Swiss Grid
 * Ultra-clean grid-based layout inspired by Swiss design principles
 * Subtle sage green accents with generous negative space
 */

import React from 'react'

const sampleDriver = {
  name: "Adam LeMaster",
  tier: "Platinum",
  packagesDelivered: 709,
  dcr: 99.7,
  pod: 97.99,
  cdf: 62.75,
  seatbeltOffRate: 100,
  speedingEventRate: 100,
  distractionsRate: 0.4,
  followingDistanceRate: 100,
  signalViolationsRate: 0,
  dvicComplianceRate: 100,
}

export default function ScorecardSwissGrid({ driver = sampleDriver }) {
  const getTierColor = (tier) => {
    const colors = {
      Platinum: '#94a3b8',
      Gold: '#d4a574',
      Silver: '#9ca3af',
      Bronze: '#b8860b'
    }
    return colors[tier] || '#6b7280'
  }

  const getScoreStatus = (score, threshold = 95) => {
    if (score >= threshold) return 'excellent'
    if (score >= 85) return 'good'
    return 'needs-improvement'
  }

  return (
    <div style={{
      fontFamily: "'Söhne', 'Helvetica Neue', system-ui, sans-serif",
      background: '#ffffff',
      minHeight: '100vh',
      padding: '48px',
      color: '#1a1a1a'
    }}>
      {/* Header Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'start',
        marginBottom: '64px',
        paddingBottom: '24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <p style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#6b7280',
            marginBottom: '8px'
          }}>
            Driver Performance Report
          </p>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '300',
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.1
          }}>
            {driver.name}
          </h1>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#6b7280'
          }}>
            Standing
          </span>
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            padding: '6px 16px',
            background: getTierColor(driver.tier),
            color: '#ffffff',
            borderRadius: '2px'
          }}>
            {driver.tier}
          </span>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px',
        background: '#e5e7eb',
        marginBottom: '64px'
      }}>
        {[
          { label: 'Delivery Completion', value: driver.dcr, suffix: '%' },
          { label: 'POD Quality', value: driver.pod, suffix: '%' },
          { label: 'Customer Defects', value: driver.cdf, suffix: '' },
          { label: 'Packages', value: driver.packagesDelivered, suffix: '' },
        ].map((metric, i) => (
          <div key={i} style={{
            background: '#ffffff',
            padding: '32px 24px'
          }}>
            <p style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#6b7280',
              marginBottom: '16px'
            }}>
              {metric.label}
            </p>
            <p style={{
              fontSize: '42px',
              fontWeight: '300',
              letterSpacing: '-0.02em',
              margin: 0,
              color: getScoreStatus(metric.value) === 'excellent' ? '#3d5a47' : '#1a1a1a'
            }}>
              {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              <span style={{ fontSize: '18px', color: '#9ca3af' }}>{metric.suffix}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Safety Section */}
      <div style={{ marginBottom: '64px' }}>
        <h2 style={{
          fontSize: '11px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#6b7280',
          marginBottom: '24px',
          fontWeight: '500'
        }}>
          Safety Metrics
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '48px'
        }}>
          {[
            { label: 'Seatbelt', value: driver.seatbeltOffRate },
            { label: 'Speeding', value: driver.speedingEventRate },
            { label: 'Distractions', value: driver.distractionsRate },
            { label: 'Following', value: driver.followingDistanceRate },
            { label: 'Signals', value: driver.signalViolationsRate },
          ].map((metric, i) => (
            <div key={i}>
              <p style={{
                fontSize: '11px',
                color: '#9ca3af',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {metric.label}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px'
              }}>
                <span style={{
                  fontSize: '28px',
                  fontWeight: '300',
                  color: metric.value >= 95 ? '#3d5a47' : '#1a1a1a'
                }}>
                  {metric.value}
                </span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>%</span>
              </div>
              {/* Minimal progress indicator */}
              <div style={{
                marginTop: '12px',
                height: '2px',
                background: '#f3f4f6',
                borderRadius: '1px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${metric.value}%`,
                  background: metric.value >= 95 ? '#9cb8a6' : '#d1d5db',
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb'
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
            background: driver.dvicComplianceRate === 100 ? '#9cb8a6' : '#fbbf24'
          }} />
          <span style={{
            fontSize: '12px',
            color: '#6b7280'
          }}>
            DVIC Compliance: {driver.dvicComplianceRate}%
          </span>
        </div>
        <p style={{
          fontSize: '11px',
          color: '#9ca3af',
          letterSpacing: '0.05em'
        }}>
          Report Generated {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>
  )
}
