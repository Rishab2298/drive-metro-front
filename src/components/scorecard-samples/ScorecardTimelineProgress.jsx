/**
 * Scorecard 10: Timeline Progress
 * Week-over-week timeline view with amber pastel accents
 * Shows progression journey and milestones achieved
 */

import React from 'react'

const sampleDriver = {
  name: "Grace Kim",
  tier: "Gold",
  currentWeek: 4,
  packagesDelivered: 2847,
  // Weekly progression data
  weeklyData: [
    { week: 1, tier: 'Silver', dcr: 94.5, pod: 91.2, cdf: 78, safety: 96 },
    { week: 2, tier: 'Silver', dcr: 95.8, pod: 93.5, cdf: 81, safety: 97 },
    { week: 3, tier: 'Gold', dcr: 97.2, pod: 95.1, cdf: 84, safety: 98 },
    { week: 4, tier: 'Gold', dcr: 98.1, pod: 96.8, cdf: 87, safety: 99 },
  ],
  milestones: [
    { week: 2, title: 'First 500 Packages', achieved: true },
    { week: 3, title: 'Promoted to Gold', achieved: true },
    { week: 3, title: 'Perfect Safety Week', achieved: true },
    { week: 4, title: 'POD Pro Badge', achieved: true },
    { week: 5, title: 'Platinum Eligible', achieved: false },
  ],
  nextMilestone: 'Platinum Tier',
  progressToNext: 72
}

export default function ScorecardTimelineProgress({ driver = sampleDriver }) {
  const getTierColor = (tier) => {
    const colors = {
      Bronze: '#b8860b',
      Silver: '#9ca3af',
      Gold: '#d4a574',
      Platinum: '#94a3b8'
    }
    return colors[tier] || '#6b7280'
  }

  const WeekCard = ({ data, isLatest }) => (
    <div style={{
      background: isLatest ? '#fffbf5' : '#ffffff',
      border: `1px solid ${isLatest ? '#f5e6c8' : '#f3f4f6'}`,
      borderRadius: '12px',
      padding: '20px',
      position: 'relative'
    }}>
      {isLatest && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '16px',
          background: '#d4a574',
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: '600',
          padding: '4px 10px',
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Current
        </div>
      )}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#374151'
        }}>
          Week {data.week}
        </span>
        <span style={{
          fontSize: '12px',
          fontWeight: '500',
          color: getTierColor(data.tier),
          padding: '4px 10px',
          background: `${getTierColor(data.tier)}15`,
          borderRadius: '4px'
        }}>
          {data.tier}
        </span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px'
      }}>
        <div>
          <p style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>DCR</p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: 0 }}>
            {data.dcr}%
          </p>
        </div>
        <div>
          <p style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>POD</p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: 0 }}>
            {data.pod}%
          </p>
        </div>
        <div>
          <p style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>CDF</p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: 0 }}>
            {data.cdf}%
          </p>
        </div>
        <div>
          <p style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>Safety</p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: 0 }}>
            {data.safety}%
          </p>
        </div>
      </div>
    </div>
  )

  const MilestoneItem = ({ milestone, index }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      {/* Timeline connector */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '24px'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: milestone.achieved
            ? 'linear-gradient(135deg, #f5d9a8 0%, #d4a574 100%)'
            : '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: milestone.achieved ? '#ffffff' : '#9ca3af'
        }}>
          {milestone.achieved ? '✓' : '○'}
        </div>
        {index < driver.milestones.length - 1 && (
          <div style={{
            width: '2px',
            height: '32px',
            background: milestone.achieved ? '#f5d9a8' : '#e5e7eb'
          }} />
        )}
      </div>
      {/* Milestone content */}
      <div style={{
        flex: 1,
        paddingBottom: index < driver.milestones.length - 1 ? '32px' : 0
      }}>
        <p style={{
          fontSize: '13px',
          fontWeight: milestone.achieved ? '600' : '400',
          color: milestone.achieved ? '#374151' : '#9ca3af',
          margin: '0 0 4px 0'
        }}>
          {milestone.title}
        </p>
        <p style={{
          fontSize: '11px',
          color: '#b0b0b0',
          margin: 0
        }}>
          Week {milestone.week}
        </p>
      </div>
    </div>
  )

  // Calculate improvement from week 1 to current
  const firstWeek = driver.weeklyData[0]
  const lastWeek = driver.weeklyData[driver.weeklyData.length - 1]
  const improvements = {
    dcr: (lastWeek.dcr - firstWeek.dcr).toFixed(1),
    pod: (lastWeek.pod - firstWeek.pod).toFixed(1),
    cdf: lastWeek.cdf - firstWeek.cdf,
    safety: lastWeek.safety - firstWeek.safety
  }

  return (
    <div style={{
      fontFamily: "'Work Sans', -apple-system, sans-serif",
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
              color: '#d4a574',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px'
            }}>
              Progress Journey
            </p>
            <h1 style={{
              fontSize: '30px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {driver.name}
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              {driver.packagesDelivered.toLocaleString()} total packages delivered
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #fef9f0 0%, #fdf3e3 100%)',
            border: '1px solid #f5e6c8',
            borderRadius: '16px',
            padding: '20px 28px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '10px',
              color: '#b8956a',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Current Tier
            </p>
            <p style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#d4a574',
              margin: 0
            }}>
              {driver.tier}
            </p>
          </div>
        </div>
      </header>

      {/* Progress to Next Tier */}
      <div style={{
        background: '#fafafa',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              marginBottom: '4px'
            }}>
              Progress to <strong style={{ color: '#374151' }}>{driver.nextMilestone}</strong>
            </p>
          </div>
          <span style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#d4a574'
          }}>
            {driver.progressToNext}%
          </span>
        </div>
        <div style={{
          height: '10px',
          background: '#e5e7eb',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${driver.progressToNext}%`,
            background: 'linear-gradient(90deg, #f5d9a8 0%, #d4a574 100%)',
            borderRadius: '5px',
            transition: 'width 1s ease'
          }} />
        </div>
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginTop: '12px',
          textAlign: 'center'
        }}>
          Maintain current performance for 2 more weeks to reach {driver.nextMilestone}
        </p>
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '40px'
      }}>
        {/* Weekly Timeline */}
        <div>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#374151',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: '4px',
              height: '16px',
              background: 'linear-gradient(180deg, #f5d9a8 0%, #d4a574 100%)',
              borderRadius: '2px'
            }} />
            Weekly Progress
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            {driver.weeklyData.map((week, i) => (
              <WeekCard
                key={week.week}
                data={week}
                isLatest={i === driver.weeklyData.length - 1}
              />
            ))}
          </div>

          {/* Improvement Summary */}
          <div style={{
            marginTop: '24px',
            padding: '20px 24px',
            background: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #f3f4f6'
          }}>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '16px'
            }}>
              Total Improvement (Week 1 → Week {driver.currentWeek})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px'
            }}>
              {Object.entries(improvements).map(([key, value]) => (
                <div key={key} style={{ textAlign: 'center' }}>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: Number(value) > 0 ? '#6b9e7d' : '#6b7280',
                    margin: '0 0 4px 0'
                  }}>
                    {Number(value) > 0 ? '+' : ''}{value}%
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    margin: 0,
                    textTransform: 'uppercase'
                  }}>
                    {key}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#374151',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: '4px',
              height: '16px',
              background: 'linear-gradient(180deg, #f5d9a8 0%, #d4a574 100%)',
              borderRadius: '2px'
            }} />
            Milestones
          </h2>
          <div style={{
            background: '#fafafa',
            borderRadius: '16px',
            padding: '24px'
          }}>
            {driver.milestones.map((milestone, i) => (
              <MilestoneItem key={i} milestone={milestone} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Message */}
      <div style={{
        marginTop: '48px',
        padding: '24px 32px',
        background: 'linear-gradient(135deg, #fef9f0 0%, #fdf3e3 100%)',
        borderRadius: '16px',
        border: '1px solid #f5e6c8',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#8b6914',
          marginBottom: '8px'
        }}>
          Great Progress This Month!
        </p>
        <p style={{
          fontSize: '13px',
          color: '#a08050',
          margin: 0
        }}>
          You've improved in every metric category. Keep up the excellent work to reach Platinum tier.
        </p>
      </div>
    </div>
  )
}
