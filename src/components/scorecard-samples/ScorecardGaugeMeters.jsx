/**
 * Scorecard 12: Gauge Meters
 * Speedometer-style SVG gauges for key metrics
 * Automotive dashboard aesthetic with mint accents
 */

import React from 'react'

const systemFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const sampleDriver = {
  name: "Marcus Chen",
  firstName: "Marcus",
  tier: "Gold",
  packagesDelivered: 612,
  dcr: 97.8,
  pod: 94.2,
  cdf: 86.5,
  dsb: 91.3,
  safetyScore: 98.2,
}

export default function ScorecardGaugeMeters({ driver = sampleDriver }) {
  // SVG Gauge Component
  const Gauge = ({ value, label, target = 100, size = 140, color = '#6ee7b7' }) => {
    const strokeWidth = 12
    const radius = (size - strokeWidth) / 2
    const circumference = radius * Math.PI // Half circle
    const percentage = Math.min(value / target, 1)
    const offset = circumference - (percentage * circumference)
    const isGood = value >= target * 0.95

    return (
      <div style={{ textAlign: 'center' }}>
        <svg width={size} height={size / 2 + 30} style={{ overflow: 'visible' }}>
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="#f0fdf4"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={isGood ? color : '#fcd34d'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1s ease-out',
              filter: `drop-shadow(0 2px 4px ${isGood ? 'rgba(110, 231, 183, 0.4)' : 'rgba(252, 211, 77, 0.4)'})`
            }}
          />
          {/* Center value */}
          <text
            x={size / 2}
            y={size / 2 - 5}
            textAnchor="middle"
            style={{
              fontFamily: systemFont,
              fontSize: '28px',
              fontWeight: '700',
              fill: '#1f2937'
            }}
          >
            {value.toFixed(1)}
          </text>
          <text
            x={size / 2}
            y={size / 2 + 18}
            textAnchor="middle"
            style={{
              fontFamily: systemFont,
              fontSize: '12px',
              fontWeight: '500',
              fill: '#9ca3af'
            }}
          >
            / {target}%
          </text>
        </svg>
        <p style={{
          fontFamily: systemFont,
          fontSize: '13px',
          fontWeight: '600',
          color: '#374151',
          margin: '-5px 0 0 0'
        }}>
          {label}
        </p>
      </div>
    )
  }

  // Mini gauge for secondary metrics
  const MiniGauge = ({ value, label }) => {
    const isGood = value >= 95
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #f0fdf4'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: `conic-gradient(${isGood ? '#6ee7b7' : '#fcd34d'} ${value * 3.6}deg, #f0fdf4 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: systemFont,
            fontSize: '11px',
            fontWeight: '700',
            color: '#374151'
          }}>
            {value.toFixed(0)}
          </div>
        </div>
        <span style={{
          fontFamily: systemFont,
          fontSize: '14px',
          color: '#6b7280'
        }}>
          {label}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: systemFont,
      background: '#f8fdf9',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto'
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
          alignItems: 'center'
        }}>
          <div>
            <p style={{
              fontSize: '12px',
              color: '#6ee7b7',
              fontWeight: '600',
              margin: '0 0 4px 0',
              letterSpacing: '0.05em'
            }}>
              PERFORMANCE GAUGES
            </p>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              {driver.firstName}'s Dashboard
            </h1>
          </div>
          <div style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)',
            borderRadius: '20px',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {driver.tier}
          </div>
        </div>
      </div>

      {/* Main Gauges */}
      <div style={{
        padding: '24px 16px',
        background: '#ffffff',
        margin: '16px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px'
        }}>
          <Gauge value={driver.dcr} label="Delivery Rate" target={100} />
          <Gauge value={driver.pod} label="POD Quality" target={100} />
          <Gauge value={driver.cdf} label="Defect Free" target={100} />
          <Gauge value={driver.safetyScore} label="Safety Score" target={100} />
        </div>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '0 16px',
        marginBottom: '16px'
      }}>
        <div style={{
          flex: 1,
          padding: '16px',
          background: '#ffffff',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 4px 0'
          }}>
            {driver.packagesDelivered}
          </p>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            margin: 0
          }}>
            Packages
          </p>
        </div>
        <div style={{
          flex: 1,
          padding: '16px',
          background: '#ffffff',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#6ee7b7',
            margin: '0 0 4px 0'
          }}>
            {driver.dsb.toFixed(0)}%
          </p>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            margin: 0
          }}>
            Success Rate
          </p>
        </div>
      </div>

      {/* Quick Insight */}
      <div style={{
        margin: '0 16px',
        padding: '16px 20px',
        background: '#ecfdf5',
        borderRadius: '12px',
        borderLeft: '4px solid #6ee7b7'
      }}>
        <p style={{
          fontSize: '13px',
          color: '#065f46',
          margin: 0,
          lineHeight: 1.5
        }}>
          <strong>Tip:</strong> {driver.pod < 95
            ? 'Focus on POD photo quality - step back and ensure package is clearly visible.'
            : 'Great performance! Keep maintaining these standards.'}
        </p>
      </div>
    </div>
  )
}
