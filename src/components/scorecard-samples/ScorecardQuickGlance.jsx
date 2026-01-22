/**
 * Scorecard 20: Quick Glance
 * Ultra-minimal essential metrics only
 * Maximum clarity, zero clutter
 * Monochrome with subtle warm gray accents
 */

import React from 'react'

const systemFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const sampleDriver = {
  name: "Jordan Lee",
  firstName: "Jordan",
  tier: "Gold",
  packagesDelivered: 534,
  dcr: 97.5,
  pod: 95.8,
  cdf: 87.3,
  safetyScore: 98.4,
}

export default function ScorecardQuickGlance({ driver = sampleDriver }) {
  const overallScore = ((driver.dcr + driver.pod + driver.cdf + driver.safetyScore) / 4)
  const isExcellent = overallScore >= 95

  const StatusDot = ({ good }) => (
    <div style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: good ? '#1f2937' : '#d1d5db'
    }} />
  )

  return (
    <div style={{
      fontFamily: systemFont,
      background: '#ffffff',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Minimal Header */}
      <header style={{
        padding: '32px 24px 24px',
        borderBottom: '1px solid #f5f5f5'
      }}>
        <p style={{
          fontSize: '13px',
          color: '#a3a3a3',
          margin: '0 0 8px 0',
          letterSpacing: '0.02em'
        }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#171717',
          margin: 0,
          letterSpacing: '-0.02em'
        }}>
          {driver.firstName}
        </h1>
      </header>

      {/* Main Score */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 24px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <p style={{
            fontSize: '120px',
            fontWeight: '200',
            color: '#171717',
            margin: 0,
            lineHeight: 1,
            letterSpacing: '-0.04em'
          }}>
            {overallScore.toFixed(0)}
          </p>
          <p style={{
            fontSize: '15px',
            color: '#a3a3a3',
            margin: '8px 0 0 0'
          }}>
            overall score
          </p>
        </div>

        {/* Key Metrics */}
        <div style={{
          width: '100%',
          maxWidth: '280px'
        }}>
          {[
            { label: 'Delivery', value: driver.dcr, target: 98 },
            { label: 'Photos', value: driver.pod, target: 95 },
            { label: 'Customer', value: driver.cdf, target: 85 },
            { label: 'Safety', value: driver.safetyScore, target: 98 },
          ].map((metric, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 0',
              borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <StatusDot good={metric.value >= metric.target} />
                <span style={{
                  fontSize: '16px',
                  color: '#525252'
                }}>
                  {metric.label}
                </span>
              </div>
              <span style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#171717',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {metric.value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '24px',
        borderTop: '1px solid #f5f5f5'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{
              fontSize: '13px',
              color: '#a3a3a3',
              margin: '0 0 4px 0'
            }}>
              Standing
            </p>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#171717',
              margin: 0
            }}>
              {driver.tier}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontSize: '13px',
              color: '#a3a3a3',
              margin: '0 0 4px 0'
            }}>
              Packages
            </p>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#171717',
              margin: 0
            }}>
              {driver.packagesDelivered}
            </p>
          </div>
        </div>

        {/* Status message */}
        <div style={{
          marginTop: '20px',
          padding: '14px 16px',
          background: isExcellent ? '#fafafa' : '#fffbeb',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: isExcellent ? '#525252' : '#92400e',
            margin: 0
          }}>
            {isExcellent
              ? 'Excellent performance this week'
              : 'Room for improvement — check details'}
          </p>
        </div>
      </footer>
    </div>
  )
}
