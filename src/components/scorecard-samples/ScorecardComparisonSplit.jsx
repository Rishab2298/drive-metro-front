/**
 * Scorecard 8: Comparison Split
 * Side-by-side comparison view with cream/butter pastel accents
 * Shows current week vs previous week or vs fleet average
 */

import React from 'react'

const sampleDriver = {
  name: "Elena Rodriguez",
  tier: "Gold",
  packagesDelivered: 456,
  // Current week metrics
  current: {
    dcr: 97.8,
    pod: 95.5,
    cdf: 88,
    ced: 99,
    dsb: 93,
    seatbelt: 100,
    speeding: 99,
    distractions: 0.5,
    following: 99,
    signals: 0
  },
  // Previous week metrics
  previous: {
    dcr: 96.2,
    pod: 93.8,
    cdf: 82,
    ced: 97,
    dsb: 89,
    seatbelt: 100,
    speeding: 97,
    distractions: 1.2,
    following: 98,
    signals: 0.5
  },
  // Fleet average
  fleetAvg: {
    dcr: 97.5,
    pod: 94.2,
    cdf: 85,
    ced: 98,
    dsb: 91
  }
}

export default function ScorecardComparisonSplit({ driver = sampleDriver }) {
  const ComparisonRow = ({ label, current, previous, target, inverted = false }) => {
    const diff = current - previous
    const isImproved = inverted ? diff < 0 : diff > 0
    const meetsTarget = inverted ? current < target : current >= target

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 100px 100px 100px',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid #f5f3ef'
      }}>
        <span style={{
          fontSize: '13px',
          color: '#5c5549',
          fontWeight: '450'
        }}>
          {label}
        </span>
        <span style={{
          fontSize: '15px',
          fontWeight: '600',
          color: meetsTarget ? '#8b7355' : '#9ca3af',
          textAlign: 'center'
        }}>
          {current.toFixed(1)}%
        </span>
        <span style={{
          fontSize: '14px',
          color: '#b0a899',
          textAlign: 'center'
        }}>
          {previous.toFixed(1)}%
        </span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: '600',
            color: isImproved ? '#7a9e6b' : diff === 0 ? '#b0a899' : '#c77a6a'
          }}>
            {diff > 0 ? '+' : ''}{diff.toFixed(1)}
          </span>
          {diff !== 0 && (
            <span style={{
              fontSize: '10px',
              color: isImproved ? '#7a9e6b' : '#c77a6a'
            }}>
              {isImproved ? '▲' : '▼'}
            </span>
          )}
        </div>
      </div>
    )
  }

  const FleetComparison = ({ label, driverValue, fleetValue }) => {
    const diff = driverValue - fleetValue
    const isAboveAvg = diff > 0

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: isAboveAvg ? '#faf8f3' : '#fafafa',
        borderRadius: '8px',
        marginBottom: '8px'
      }}>
        <span style={{
          fontSize: '12px',
          color: '#6b7280'
        }}>
          {label}
        </span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: '600',
            color: isAboveAvg ? '#8b7355' : '#6b7280'
          }}>
            {driverValue.toFixed(1)}%
          </span>
          <span style={{
            fontSize: '11px',
            color: isAboveAvg ? '#7a9e6b' : '#c77a6a',
            padding: '2px 8px',
            background: isAboveAvg ? '#f0f5ed' : '#fef2f0',
            borderRadius: '4px'
          }}>
            {diff > 0 ? '+' : ''}{diff.toFixed(1)} vs fleet
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: "'Lato', -apple-system, sans-serif",
      background: '#ffffff',
      minHeight: '100vh',
      padding: '48px'
    }}>
      {/* Header */}
      <header style={{
        marginBottom: '48px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <p style={{
              fontSize: '11px',
              color: '#b0a899',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '8px'
            }}>
              Week-over-Week Comparison
            </p>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#3d3832',
              margin: 0
            }}>
              {driver.name}
            </h1>
          </div>
          <div style={{
            display: 'flex',
            gap: '24px'
          }}>
            <div style={{
              padding: '16px 24px',
              background: '#faf8f3',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #f0ebe0'
            }}>
              <p style={{
                fontSize: '10px',
                color: '#b0a899',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}>
                Standing
              </p>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#8b7355',
                margin: 0
              }}>
                {driver.tier}
              </p>
            </div>
            <div style={{
              padding: '16px 24px',
              background: '#fafafa',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '10px',
                color: '#b0a899',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}>
                Packages
              </p>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#3d3832',
                margin: 0
              }}>
                {driver.packagesDelivered}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Comparison Table */}
      <section style={{
        marginBottom: '48px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 100px 100px 100px',
          padding: '12px 0',
          borderBottom: '2px solid #e8e4db'
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#8b7355',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Delivery Metrics
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#8b7355',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textAlign: 'center'
          }}>
            This Week
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#b0a899',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textAlign: 'center'
          }}>
            Last Week
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#b0a899',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textAlign: 'center'
          }}>
            Change
          </span>
        </div>

        <ComparisonRow
          label="Delivery Completion Rate"
          current={driver.current.dcr}
          previous={driver.previous.dcr}
          target={98}
        />
        <ComparisonRow
          label="POD Quality Score"
          current={driver.current.pod}
          previous={driver.previous.pod}
          target={95}
        />
        <ComparisonRow
          label="Customer Defect Free"
          current={driver.current.cdf}
          previous={driver.previous.cdf}
          target={85}
        />
        <ComparisonRow
          label="Customer Experience"
          current={driver.current.ced}
          previous={driver.previous.ced}
          target={98}
        />
        <ComparisonRow
          label="Success Behaviors"
          current={driver.current.dsb}
          previous={driver.previous.dsb}
          target={90}
        />
      </section>

      {/* Safety Comparison */}
      <section style={{
        marginBottom: '48px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 100px 100px 100px',
          padding: '12px 0',
          borderBottom: '2px solid #e8e4db'
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#8b7355',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Safety Metrics
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#8b7355',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textAlign: 'center'
          }}>
            This Week
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#b0a899',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textAlign: 'center'
          }}>
            Last Week
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#b0a899',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textAlign: 'center'
          }}>
            Change
          </span>
        </div>

        <ComparisonRow
          label="Seatbelt Compliance"
          current={driver.current.seatbelt}
          previous={driver.previous.seatbelt}
          target={100}
        />
        <ComparisonRow
          label="Speed Compliance"
          current={driver.current.speeding}
          previous={driver.previous.speeding}
          target={100}
        />
        <ComparisonRow
          label="Distraction Rate"
          current={driver.current.distractions}
          previous={driver.previous.distractions}
          target={1}
          inverted
        />
        <ComparisonRow
          label="Following Distance"
          current={driver.current.following}
          previous={driver.previous.following}
          target={100}
        />
      </section>

      {/* Fleet Comparison */}
      <section>
        <h2 style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#8b7355',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '16px'
        }}>
          vs Fleet Average
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          <FleetComparison label="DCR" driverValue={driver.current.dcr} fleetValue={driver.fleetAvg.dcr} />
          <FleetComparison label="POD" driverValue={driver.current.pod} fleetValue={driver.fleetAvg.pod} />
          <FleetComparison label="CDF" driverValue={driver.current.cdf} fleetValue={driver.fleetAvg.cdf} />
          <FleetComparison label="DSB" driverValue={driver.current.dsb} fleetValue={driver.fleetAvg.dsb} />
        </div>
      </section>

      {/* Summary Box */}
      <div style={{
        marginTop: '40px',
        padding: '24px',
        background: 'linear-gradient(135deg, #faf8f3 0%, #f5f2ea 100%)',
        borderRadius: '12px',
        border: '1px solid #e8e4db'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#5c5549',
              marginBottom: '6px'
            }}>
              Week Summary
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#8b8477',
              margin: 0
            }}>
              Strong improvement across delivery metrics. All safety metrics stable or improving.
              Continue focus on distraction-free driving.
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e8e4db'
          }}>
            <span style={{
              fontSize: '12px',
              color: '#8b8477'
            }}>
              Overall Trend
            </span>
            <span style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#7a9e6b'
            }}>
              ↑ Improving
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
