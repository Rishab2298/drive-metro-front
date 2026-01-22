/**
 * Scorecard 7: Trend Sparklines
 * Mini inline charts showing performance trends with coral pastel accents
 * Data-dense visualization for tracking progress over time
 */

import React from 'react'

const sampleDriver = {
  name: "David Martinez",
  tier: "Gold",
  packagesDelivered: 523,
  dcr: 97.5,
  pod: 96.2,
  cdf: 82,
  ced: 98,
  dsb: 91,
  seatbeltOffRate: 100,
  speedingEventRate: 99,
  distractionsRate: 0.8,
  followingDistanceRate: 98,
  signalViolationsRate: 0.3,
  // Historical data for sparklines (last 8 weeks)
  history: {
    dcr: [95.2, 96.1, 97.0, 96.5, 97.8, 97.2, 98.1, 97.5],
    pod: [92.5, 93.8, 94.2, 95.1, 94.8, 95.9, 96.5, 96.2],
    cdf: [75, 78, 76, 80, 79, 81, 80, 82],
    safety: [96, 97, 98, 97, 99, 98, 99, 99]
  }
}

export default function ScorecardTrendSparklines({ driver = sampleDriver }) {
  // Simple SVG sparkline component
  const Sparkline = ({ data, width = 120, height = 32, color = '#e07a5f' }) => {
    const min = Math.min(...data) - 2
    const max = Math.max(...data) + 2
    const range = max - min

    const points = data.map((value, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    }).join(' ')

    const lastPoint = data[data.length - 1]
    const lastX = width
    const lastY = height - ((lastPoint - min) / range) * height

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Trend line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* End dot */}
        <circle
          cx={lastX}
          cy={lastY}
          r="4"
          fill={color}
        />
        {/* Baseline reference */}
        <line
          x1="0"
          y1={height}
          x2={width}
          y2={height}
          stroke="#f0f0f0"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      </svg>
    )
  }

  const TrendIndicator = ({ current, previous }) => {
    const diff = current - previous
    const isUp = diff > 0
    const isFlat = Math.abs(diff) < 0.5

    if (isFlat) {
      return (
        <span style={{
          fontSize: '11px',
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          → Stable
        </span>
      )
    }

    return (
      <span style={{
        fontSize: '11px',
        color: isUp ? '#6b9e7d' : '#c75c5c',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {isUp ? '↑' : '↓'} {Math.abs(diff).toFixed(1)}%
      </span>
    )
  }

  const MetricWithSparkline = ({ label, value, history, target, unit = '%' }) => {
    const isOnTarget = value >= target
    const previousWeek = history[history.length - 2]

    return (
      <div style={{
        padding: '20px 24px',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '6px'
            }}>
              {label}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px'
            }}>
              <span style={{
                fontSize: '28px',
                fontWeight: '600',
                color: isOnTarget ? '#e07a5f' : '#6b7280'
              }}>
                {value}
              </span>
              <span style={{
                fontSize: '14px',
                color: '#d1d5db'
              }}>
                {unit}
              </span>
            </div>
          </div>
          <div style={{
            textAlign: 'right'
          }}>
            <p style={{
              fontSize: '10px',
              color: '#d1d5db',
              marginBottom: '4px'
            }}>
              Target: {target}{unit}
            </p>
            <TrendIndicator current={value} previous={previousWeek} />
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <Sparkline
            data={history}
            color={isOnTarget ? '#e07a5f' : '#b0b0b0'}
          />
          <div style={{
            fontSize: '10px',
            color: '#d1d5db'
          }}>
            8-week trend
          </div>
        </div>
      </div>
    )
  }

  const SafetyMini = ({ label, value, trend }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #f5f5f5'
    }}>
      <span style={{
        fontSize: '13px',
        color: '#6b7280'
      }}>
        {label}
      </span>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '600',
          color: value >= 99 ? '#e07a5f' : '#6b7280'
        }}>
          {value}%
        </span>
        <span style={{
          fontSize: '10px',
          color: trend >= 0 ? '#6b9e7d' : '#c75c5c'
        }}>
          {trend >= 0 ? '↑' : '↓'}
        </span>
      </div>
    </div>
  )

  return (
    <div style={{
      fontFamily: "'Source Sans Pro', -apple-system, sans-serif",
      background: '#fafafa',
      minHeight: '100vh',
      padding: '40px 48px'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 6px 0'
          }}>
            {driver.name}
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#9ca3af',
            margin: 0
          }}>
            Performance Trends & Analytics
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            textAlign: 'right'
          }}>
            <p style={{
              fontSize: '10px',
              color: '#9ca3af',
              marginBottom: '2px'
            }}>
              Current Tier
            </p>
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#e07a5f',
              margin: 0
            }}>
              {driver.tier}
            </p>
          </div>
          <div style={{
            width: '1px',
            height: '32px',
            background: '#e5e7eb'
          }} />
          <div style={{
            textAlign: 'right'
          }}>
            <p style={{
              fontSize: '10px',
              color: '#9ca3af',
              marginBottom: '2px'
            }}>
              Packages
            </p>
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              {driver.packagesDelivered}
            </p>
          </div>
        </div>
      </header>

      {/* Main Metrics with Sparklines */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <MetricWithSparkline
          label="Delivery Completion Rate"
          value={driver.dcr}
          history={driver.history.dcr}
          target={98}
        />
        <MetricWithSparkline
          label="POD Quality Score"
          value={driver.pod}
          history={driver.history.pod}
          target={95}
        />
        <MetricWithSparkline
          label="Customer Defect Free"
          value={driver.cdf}
          history={driver.history.cdf}
          target={85}
        />
        <MetricWithSparkline
          label="Overall Safety Score"
          value={driver.history.safety[driver.history.safety.length - 1]}
          history={driver.history.safety}
          target={98}
        />
      </div>

      {/* Safety Details */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #f3f4f6',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#e07a5f',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '16px'
        }}>
          Safety Breakdown
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0 48px'
        }}>
          <SafetyMini label="Seatbelt Compliance" value={driver.seatbeltOffRate} trend={0} />
          <SafetyMini label="Speed Compliance" value={driver.speedingEventRate} trend={1} />
          <SafetyMini label="Distraction-Free" value={(100 - driver.distractionsRate).toFixed(1)} trend={0.5} />
          <SafetyMini label="Following Distance" value={driver.followingDistanceRate} trend={-0.5} />
        </div>
      </div>

      {/* Insights Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '16px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #f3f4f6',
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Trend Analysis
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: 1.6,
            margin: 0
          }}>
            Your delivery completion rate has shown consistent improvement over the past 8 weeks,
            rising from 95.2% to 97.5%. POD quality is also trending upward. Focus on maintaining
            these gains while working to bring CDF above the 85% target.
          </p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #fef3f0 0%, #fdf8f6 100%)',
          borderRadius: '12px',
          border: '1px solid #f5ddd6',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <p style={{
            fontSize: '11px',
            color: '#c78a7a',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Next Goal
          </p>
          <p style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#e07a5f',
            margin: 0
          }}>
            Reach 85% CDF
          </p>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '4px'
          }}>
            3% away from target
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: '32px',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <p style={{
          fontSize: '11px',
          color: '#d1d5db'
        }}>
          Data reflects rolling 8-week performance window
        </p>
        <p style={{
          fontSize: '11px',
          color: '#d1d5db'
        }}>
          Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </footer>
    </div>
  )
}
