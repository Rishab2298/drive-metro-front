/**
 * Scorecard 4: Radial Dashboard
 * Circular progress rings with sky blue pastel accents
 * Dashboard-style layout with prominent visual indicators
 */

import React from 'react'

const sampleDriver = {
  name: "Axel Tinajero",
  tier: "Platinum",
  packagesDelivered: 692,
  dcr: 99.9,
  pod: 100,
  cdf: 100,
  ced: 100,
  dsb: 100,
  seatbeltOffRate: 100,
  speedingEventRate: 100,
  distractionsRate: 0,
  followingDistanceRate: 100,
  signalViolationsRate: 0,
  podOpportunities: 473,
  podSuccess: 473,
  ficoScore: 850,
}

export default function ScorecardRadialDashboard({ driver = sampleDriver }) {
  // Circular progress component using SVG
  const CircularProgress = ({ value, size = 120, strokeWidth = 8, label, sublabel }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (value / 100) * circumference
    const isExcellent = value >= 95

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f0f7fa"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={isExcellent ? '#7eb8ce' : '#d1d5db'}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          {/* Center text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <span style={{
              fontSize: '24px',
              fontWeight: '600',
              color: isExcellent ? '#4a8fa8' : '#6b7280'
            }}>
              {value.toFixed(0)}
            </span>
            <span style={{
              fontSize: '12px',
              color: '#b0b0b0'
            }}>%</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
            margin: 0
          }}>
            {label}
          </p>
          {sublabel && (
            <p style={{
              fontSize: '11px',
              color: '#9ca3af',
              margin: '4px 0 0 0'
            }}>
              {sublabel}
            </p>
          )}
        </div>
      </div>
    )
  }

  const SmallRing = ({ value, label, size = 64 }) => {
    const radius = (size - 6) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (value / 100) * circumference

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '12px 16px',
        background: '#fafcfd',
        borderRadius: '10px'
      }}>
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e8f4f8"
              strokeWidth={6}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={value >= 95 ? '#7eb8ce' : '#d1d5db'}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '12px',
            fontWeight: '600',
            color: value >= 95 ? '#4a8fa8' : '#6b7280'
          }}>
            {value.toFixed(0)}
          </span>
        </div>
        <span style={{
          fontSize: '13px',
          color: '#6b7280'
        }}>
          {label}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: "'Outfit', 'Segoe UI', sans-serif",
      background: '#ffffff',
      minHeight: '100vh',
      padding: '48px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '48px'
      }}>
        <div>
          <p style={{
            fontSize: '11px',
            color: '#7eb8ce',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '8px',
            fontWeight: '600'
          }}>
            Performance Dashboard
          </p>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0
          }}>
            {driver.name}
          </h1>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            textAlign: 'right'
          }}>
            <p style={{
              fontSize: '11px',
              color: '#9ca3af',
              margin: '0 0 4px 0'
            }}>
              Current Standing
            </p>
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#4a8fa8',
              margin: 0
            }}>
              {driver.tier}
            </p>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #a8d4e6 0%, #7eb8ce 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            {driver.tier.charAt(0)}
          </div>
        </div>
      </div>

      {/* Main Metrics - Large Rings */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '32px',
        padding: '40px',
        background: '#fafcfd',
        borderRadius: '20px',
        marginBottom: '32px'
      }}>
        <CircularProgress
          value={driver.dcr}
          size={140}
          strokeWidth={10}
          label="Delivery Rate"
          sublabel={`${driver.packagesDelivered} packages`}
        />
        <CircularProgress
          value={driver.pod}
          size={140}
          strokeWidth={10}
          label="POD Quality"
          sublabel={`${driver.podSuccess}/${driver.podOpportunities}`}
        />
        <CircularProgress
          value={driver.cdf}
          size={140}
          strokeWidth={10}
          label="CDF Score"
          sublabel="Customer Defect Free"
        />
        <CircularProgress
          value={driver.dsb}
          size={140}
          strokeWidth={10}
          label="DSB Score"
          sublabel="Success Behaviors"
        />
      </div>

      {/* Safety Metrics - Small Rings Grid */}
      <div style={{
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '16px'
        }}>
          Safety Compliance
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          <SmallRing value={driver.seatbeltOffRate} label="Seatbelt Compliance" />
          <SmallRing value={driver.speedingEventRate} label="Speed Compliance" />
          <SmallRing value={100 - driver.distractionsRate} label="Distraction-Free" />
          <SmallRing value={driver.followingDistanceRate} label="Following Distance" />
          <SmallRing value={100 - driver.signalViolationsRate} label="Signal Compliance" />
          <SmallRing value={driver.ced} label="Customer Experience" />
        </div>
      </div>

      {/* Score Summary */}
      <div style={{
        display: 'flex',
        gap: '24px',
        padding: '24px',
        background: 'linear-gradient(135deg, #f0f7fa 0%, #e8f4f8 100%)',
        borderRadius: '16px'
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(126, 184, 206, 0.15)'
          }}>
            <span style={{ fontSize: '24px' }}>&#9733;</span>
          </div>
          <div>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#4a8fa8',
              margin: '0 0 4px 0'
            }}>
              Outstanding Performance
            </p>
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              margin: 0
            }}>
              All metrics are at or above target thresholds
            </p>
          </div>
        </div>
        <div style={{
          padding: '0 24px',
          borderLeft: '1px solid rgba(126, 184, 206, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            fontSize: '11px',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            FICO
          </span>
          <span style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#4a8fa8'
          }}>
            {driver.ficoScore}
          </span>
        </div>
      </div>
    </div>
  )
}
