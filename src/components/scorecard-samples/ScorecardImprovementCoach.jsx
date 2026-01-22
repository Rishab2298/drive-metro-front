/**
 * Scorecard 9: Improvement Coach
 * Action-oriented design with teal pastel accents
 * Focused on learning opportunities and specific improvement suggestions
 */

import React from 'react'

const sampleDriver = {
  name: "Fernando Garcia",
  tier: "Silver",
  packagesDelivered: 389,
  dcr: 94.2,
  pod: 88.5,
  cdf: 72,
  ced: 95,
  dsb: 82,
  seatbeltOffRate: 98,
  speedingEventRate: 95,
  distractionsRate: 2.1,
  followingDistanceRate: 94,
  signalViolationsRate: 1.2,
  podRejects: 12,
  podRejectsBreakdown: {
    blurryPhoto: 5,
    noPackageDetected: 3,
    photoTooDark: 2,
    packageTooClose: 2
  },
  dvicComplianceRate: 85,
  ppsComplianceRate: 78,
}

export default function ScorecardImprovementCoach({ driver = sampleDriver }) {
  // Generate improvement suggestions based on metrics
  const getImprovementAreas = () => {
    const areas = []

    if (driver.pod < 95) {
      areas.push({
        category: 'POD Quality',
        priority: 'high',
        score: driver.pod,
        target: 95,
        tips: [
          'Ensure good lighting before taking photos',
          'Step back to capture the full package',
          'Wait for camera to focus before snapping',
          'Avoid taking photos with package in hand'
        ],
        topIssue: Object.entries(driver.podRejectsBreakdown || {})
          .sort((a, b) => b[1] - a[1])[0]
      })
    }

    if (driver.dcr < 98) {
      areas.push({
        category: 'Delivery Completion',
        priority: driver.dcr < 95 ? 'high' : 'medium',
        score: driver.dcr,
        target: 98,
        tips: [
          'Attempt all deliveries before marking undeliverable',
          'Use access codes from delivery notes',
          'Contact customer when safe location unclear',
          'Check for alternative delivery locations'
        ]
      })
    }

    if (driver.distractionsRate > 1) {
      areas.push({
        category: 'Distraction-Free Driving',
        priority: 'high',
        score: 100 - driver.distractionsRate,
        target: 99,
        tips: [
          'Set up navigation before starting route',
          'Use voice commands for phone interactions',
          'Pull over safely if you need to use your device',
          'Keep phone mounted and out of reach'
        ]
      })
    }

    if (driver.cdf < 85) {
      areas.push({
        category: 'Customer Defect Free',
        priority: driver.cdf < 75 ? 'high' : 'medium',
        score: driver.cdf,
        target: 85,
        tips: [
          'Follow delivery instructions carefully',
          'Place packages in covered areas when possible',
          'Ring doorbell/knock to notify customers',
          'Take clear photos showing delivery location'
        ]
      })
    }

    return areas
  }

  const improvementAreas = getImprovementAreas()

  const PriorityBadge = ({ priority }) => {
    const config = {
      high: { bg: '#fef2f2', color: '#b45454', label: 'High Priority' },
      medium: { bg: '#fef9e7', color: '#9a7b2c', label: 'Medium Priority' },
      low: { bg: '#f0faf7', color: '#4a8b7a', label: 'Low Priority' }
    }
    const { bg, color, label } = config[priority]

    return (
      <span style={{
        fontSize: '10px',
        fontWeight: '600',
        padding: '4px 10px',
        borderRadius: '4px',
        background: bg,
        color: color,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </span>
    )
  }

  const ImprovementCard = ({ area }) => (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e5eae8',
      overflow: 'hidden',
      marginBottom: '20px'
    }}>
      {/* Card Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #f0f5f3',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2d3b36',
            margin: '0 0 6px 0'
          }}>
            {area.category}
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              fontSize: '13px',
              color: '#6b7a74'
            }}>
              Current: <strong style={{ color: '#2d3b36' }}>{area.score.toFixed(1)}%</strong>
            </span>
            <span style={{ color: '#d1d5db' }}>→</span>
            <span style={{
              fontSize: '13px',
              color: '#4a8b7a'
            }}>
              Target: {area.target}%
            </span>
          </div>
        </div>
        <PriorityBadge priority={area.priority} />
      </div>

      {/* Progress to Target */}
      <div style={{ padding: '16px 24px', background: '#fafcfb' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '11px', color: '#8b9a94' }}>Progress to Target</span>
          <span style={{ fontSize: '11px', color: '#8b9a94' }}>
            {((area.score / area.target) * 100).toFixed(0)}%
          </span>
        </div>
        <div style={{
          height: '6px',
          background: '#e5eae8',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min((area.score / area.target) * 100, 100)}%`,
            background: 'linear-gradient(90deg, #7ab5a4 0%, #5a9b8a 100%)',
            borderRadius: '3px',
            transition: 'width 0.6s ease'
          }} />
        </div>
      </div>

      {/* Tips Section */}
      <div style={{ padding: '20px 24px' }}>
        <h4 style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#5a9b8a',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '14px'
        }}>
          How to Improve
        </h4>
        <ul style={{
          margin: 0,
          padding: 0,
          listStyle: 'none'
        }}>
          {area.tips.map((tip, i) => (
            <li key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '8px 0',
              borderBottom: i < area.tips.length - 1 ? '1px solid #f5f7f6' : 'none'
            }}>
              <span style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#e8f2ef',
                color: '#5a9b8a',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {i + 1}
              </span>
              <span style={{
                fontSize: '13px',
                color: '#4a5a54',
                lineHeight: 1.5
              }}>
                {tip}
              </span>
            </li>
          ))}
        </ul>

        {/* Top Issue Callout (for POD) */}
        {area.topIssue && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: '#fef9e7',
            borderRadius: '8px',
            border: '1px solid #f5e6c8'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#9a7b2c',
              margin: 0
            }}>
              <strong>Top Issue:</strong> {area.topIssue[0].replace(/([A-Z])/g, ' $1').trim()} ({area.topIssue[1]} rejections)
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const QuickStat = ({ label, value, unit = '%', good }) => (
    <div style={{
      textAlign: 'center',
      padding: '16px'
    }}>
      <p style={{
        fontSize: '11px',
        color: '#8b9a94',
        marginBottom: '6px'
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '24px',
        fontWeight: '600',
        color: good ? '#5a9b8a' : '#6b7280',
        margin: 0
      }}>
        {value}{unit}
      </p>
    </div>
  )

  return (
    <div style={{
      fontFamily: "'Rubik', -apple-system, sans-serif",
      background: '#f7faf9',
      minHeight: '100vh',
      padding: '40px 48px'
    }}>
      {/* Header */}
      <header style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px 32px',
        marginBottom: '32px',
        border: '1px solid #e5eae8'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{
              fontSize: '12px',
              color: '#5a9b8a',
              fontWeight: '600',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Improvement Plan
            </p>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '600',
              color: '#2d3b36',
              margin: 0
            }}>
              {driver.name}
            </h1>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div style={{
              textAlign: 'right'
            }}>
              <p style={{ fontSize: '11px', color: '#8b9a94', marginBottom: '4px' }}>Current Tier</p>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#2d3b36', margin: 0 }}>{driver.tier}</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7ab5a4 0%, #5a9b8a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '20px'
            }}>
              ↑
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5eae8',
        marginBottom: '32px'
      }}>
        <QuickStat label="DCR" value={driver.dcr.toFixed(1)} good={driver.dcr >= 98} />
        <div style={{ borderLeft: '1px solid #f0f5f3' }}>
          <QuickStat label="POD" value={driver.pod.toFixed(1)} good={driver.pod >= 95} />
        </div>
        <div style={{ borderLeft: '1px solid #f0f5f3' }}>
          <QuickStat label="CDF" value={driver.cdf} good={driver.cdf >= 85} />
        </div>
        <div style={{ borderLeft: '1px solid #f0f5f3' }}>
          <QuickStat label="Safety" value={(100 - driver.distractionsRate).toFixed(1)} good={driver.distractionsRate < 1} />
        </div>
        <div style={{ borderLeft: '1px solid #f0f5f3' }}>
          <QuickStat label="Packages" value={driver.packagesDelivered} unit="" good />
        </div>
      </div>

      {/* Focus Areas */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#2d3b36',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: '#e8f2ef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}>
            {improvementAreas.length}
          </span>
          Areas to Focus On
        </h2>

        {improvementAreas.map((area, i) => (
          <ImprovementCard key={i} area={area} />
        ))}

        {improvementAreas.length === 0 && (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            border: '1px solid #e5eae8'
          }}>
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#5a9b8a',
              marginBottom: '8px'
            }}>
              Excellent Work!
            </p>
            <p style={{
              fontSize: '14px',
              color: '#6b7a74',
              margin: 0
            }}>
              All your metrics are on target. Keep up the great performance!
            </p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #e8f2ef 0%, #d8ebe5 100%)',
        borderRadius: '12px',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <p style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#2d3b36',
            marginBottom: '4px'
          }}>
            Need Help?
          </p>
          <p style={{
            fontSize: '13px',
            color: '#5a7a70',
            margin: 0
          }}>
            Talk to your dispatcher or team lead about personalized coaching opportunities.
          </p>
        </div>
        <div style={{
          fontSize: '11px',
          color: '#5a9b8a',
          fontWeight: '500'
        }}>
          Updated {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}
