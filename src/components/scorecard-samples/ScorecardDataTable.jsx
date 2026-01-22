/**
 * Scorecard 5: Data Table Classic
 * Clean tabular data presentation with mint green accents
 * Enterprise spreadsheet aesthetic with clear data hierarchy
 */

import React from 'react'

const sampleDriver = {
  name: "Benjamin Hauserman",
  tier: "Gold",
  packagesDelivered: 137,
  dcr: 96.8,
  pod: 94.5,
  cdf: 78.2,
  ced: 98,
  dsb: 88,
  seatbeltOffRate: 100,
  speedingEventRate: 98,
  distractionsRate: 1.2,
  followingDistanceRate: 97,
  signalViolationsRate: 0.5,
  podOpportunities: 95,
  podSuccess: 90,
  podRejects: 5,
  podRejectsBreakdown: {
    blurryPhoto: 2,
    noPackageDetected: 2,
    photoTooDark: 1
  },
  dvicComplianceRate: 100,
  ppsComplianceRate: 92,
}

export default function ScorecardDataTable({ driver = sampleDriver }) {
  const getStatusIndicator = (value, threshold = 95) => {
    if (value >= threshold) return { color: '#6b9e7d', bg: '#eef6f0', label: 'On Target' }
    if (value >= threshold - 10) return { color: '#b8860b', bg: '#fef9e7', label: 'Monitor' }
    return { color: '#c75c5c', bg: '#fef2f2', label: 'Action Required' }
  }

  const TableRow = ({ metric, value, target, unit = '%', notes = '' }) => {
    const status = getStatusIndicator(value, target)
    return (
      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
        <td style={{
          padding: '14px 16px',
          fontSize: '13px',
          color: '#374151',
          fontWeight: '450'
        }}>
          {metric}
        </td>
        <td style={{
          padding: '14px 16px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#1f2937',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {value.toFixed(1)}{unit}
        </td>
        <td style={{
          padding: '14px 16px',
          fontSize: '13px',
          color: '#9ca3af'
        }}>
          {target}{unit}
        </td>
        <td style={{ padding: '14px 16px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '500',
            background: status.bg,
            color: status.color
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: status.color
            }} />
            {status.label}
          </span>
        </td>
        <td style={{
          padding: '14px 16px',
          fontSize: '12px',
          color: '#9ca3af',
          maxWidth: '200px'
        }}>
          {notes}
        </td>
      </tr>
    )
  }

  return (
    <div style={{
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
      background: '#ffffff',
      minHeight: '100vh',
      padding: '40px 48px'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '40px',
        paddingBottom: '24px',
        borderBottom: '2px solid #1f2937'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            {driver.name}
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#6b7280',
            margin: 0
          }}>
            Driver Performance Report — Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontSize: '11px',
              color: '#9ca3af',
              margin: '0 0 4px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Standing
            </p>
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              {driver.tier}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontSize: '11px',
              color: '#9ca3af',
              margin: '0 0 4px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
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

      {/* Delivery Performance Table */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b9e7d',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '3px',
            height: '14px',
            background: '#6b9e7d',
            borderRadius: '1px'
          }} />
          Delivery Performance
        </h2>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#fafafa',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{
              background: '#f5f5f5',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Metric
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Actual
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Target
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Status
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Notes
              </th>
            </tr>
          </thead>
          <tbody style={{ background: '#ffffff' }}>
            <TableRow metric="Delivery Completion Rate (DCR)" value={driver.dcr} target={98} />
            <TableRow metric="POD Quality Score" value={driver.pod} target={95} notes={`${driver.podRejects} rejected photos this week`} />
            <TableRow metric="Customer Defect Free (CDF)" value={driver.cdf} target={85} notes="Focus on delivery accuracy" />
            <TableRow metric="Delivery Success Behaviors" value={driver.dsb} target={90} />
          </tbody>
        </table>
      </section>

      {/* Safety Metrics Table */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b9e7d',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '3px',
            height: '14px',
            background: '#6b9e7d',
            borderRadius: '1px'
          }} />
          Safety Compliance
        </h2>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#fafafa',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{
              background: '#f5f5f5',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}>
                Metric
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}>
                Actual
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}>
                Target
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}>
                Status
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}>
                Notes
              </th>
            </tr>
          </thead>
          <tbody style={{ background: '#ffffff' }}>
            <TableRow metric="Seatbelt Compliance" value={driver.seatbeltOffRate} target={100} />
            <TableRow metric="Speed Compliance" value={driver.speedingEventRate} target={100} notes="Minor speeding events recorded" />
            <TableRow metric="Distraction-Free Rate" value={100 - driver.distractionsRate} target={99} notes="Reduce phone interactions" />
            <TableRow metric="Following Distance" value={driver.followingDistanceRate} target={100} />
            <TableRow metric="Signal Compliance" value={100 - driver.signalViolationsRate} target={100} />
          </tbody>
        </table>
      </section>

      {/* POD Rejection Breakdown */}
      <section style={{
        padding: '24px',
        background: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '40px'
      }}>
        <h3 style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b7280',
          marginBottom: '16px'
        }}>
          POD Rejection Breakdown ({driver.podRejects} total)
        </h3>
        <div style={{
          display: 'flex',
          gap: '32px'
        }}>
          {Object.entries(driver.podRejectsBreakdown || {}).map(([key, value]) => (
            <div key={key} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151'
              }}>
                {value}
              </span>
              <span style={{
                fontSize: '12px',
                color: '#6b7280'
              }}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          gap: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#6b9e7d'
            }} />
            <span style={{ fontSize: '11px', color: '#6b7280' }}>On Target (≥95%)</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#b8860b'
            }} />
            <span style={{ fontSize: '11px', color: '#6b7280' }}>Monitor (85-94%)</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#c75c5c'
            }} />
            <span style={{ fontSize: '11px', color: '#6b7280' }}>Action Required (&lt;85%)</span>
          </div>
        </div>
        <p style={{
          fontSize: '11px',
          color: '#9ca3af'
        }}>
          DVIC: {driver.dvicComplianceRate}% | PPS: {driver.ppsComplianceRate}%
        </p>
      </footer>
    </div>
  )
}
