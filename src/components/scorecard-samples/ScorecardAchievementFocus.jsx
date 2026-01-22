/**
 * Scorecard 6: Achievement Focus
 * Badge-centric design with rose/blush pastel accents
 * Gamification elements to motivate driver improvement
 */

import React from 'react'

const sampleDriver = {
  name: "Catherine Wells",
  tier: "Platinum",
  packagesDelivered: 842,
  dcr: 99.8,
  pod: 98.5,
  cdf: 92,
  ced: 100,
  dsb: 97,
  seatbeltOffRate: 100,
  speedingEventRate: 100,
  distractionsRate: 0.2,
  followingDistanceRate: 100,
  signalViolationsRate: 0,
  podOpportunities: 562,
  podSuccess: 554,
  dvicComplianceRate: 100,
  ppsComplianceRate: 98,
  weeksAtPlatinum: 12,
  perfectWeeks: 8,
}

export default function ScorecardAchievementFocus({ driver = sampleDriver }) {
  const achievements = [
    {
      id: 'safety_star',
      name: 'Safety Star',
      description: 'Perfect safety compliance',
      earned: driver.seatbeltOffRate === 100 && driver.speedingEventRate === 100,
      icon: '★'
    },
    {
      id: 'pod_pro',
      name: 'POD Pro',
      description: 'POD quality above 98%',
      earned: driver.pod >= 98,
      icon: '◎'
    },
    {
      id: 'delivery_ace',
      name: 'Delivery Ace',
      description: 'DCR above 99%',
      earned: driver.dcr >= 99,
      icon: '✦'
    },
    {
      id: 'perfect_week',
      name: 'Perfect Week',
      description: 'All metrics on target',
      earned: driver.dcr >= 98 && driver.pod >= 95 && driver.cdf >= 85,
      icon: '◆'
    },
    {
      id: 'customer_champion',
      name: 'Customer Champion',
      description: '100% customer experience',
      earned: driver.ced === 100,
      icon: '♥'
    },
    {
      id: 'consistency',
      name: 'Consistency King',
      description: '4+ weeks at Platinum',
      earned: driver.weeksAtPlatinum >= 4,
      icon: '◈'
    }
  ]

  const earnedCount = achievements.filter(a => a.earned).length

  const Badge = ({ achievement }) => {
    const baseStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 16px',
      borderRadius: '16px',
      transition: 'transform 0.2s ease',
      cursor: 'default'
    }

    if (achievement.earned) {
      return (
        <div style={{
          ...baseStyle,
          background: 'linear-gradient(180deg, #fdf2f4 0%, #fce7ea 100%)',
          border: '1px solid #f5d0d6'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e8b4bc 0%, #d4949e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#ffffff',
            marginBottom: '12px',
            boxShadow: '0 4px 12px rgba(212, 148, 158, 0.3)'
          }}>
            {achievement.icon}
          </div>
          <p style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#8b5a62',
            margin: '0 0 4px 0',
            textAlign: 'center'
          }}>
            {achievement.name}
          </p>
          <p style={{
            fontSize: '11px',
            color: '#b08891',
            margin: 0,
            textAlign: 'center'
          }}>
            {achievement.description}
          </p>
        </div>
      )
    }

    return (
      <div style={{
        ...baseStyle,
        background: '#fafafa',
        border: '1px dashed #e5e7eb'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: '#d1d5db',
          marginBottom: '12px'
        }}>
          {achievement.icon}
        </div>
        <p style={{
          fontSize: '13px',
          fontWeight: '500',
          color: '#9ca3af',
          margin: '0 0 4px 0',
          textAlign: 'center'
        }}>
          {achievement.name}
        </p>
        <p style={{
          fontSize: '11px',
          color: '#d1d5db',
          margin: 0,
          textAlign: 'center'
        }}>
          {achievement.description}
        </p>
      </div>
    )
  }

  const MetricMini = ({ label, value, unit = '%', good }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #f5f5f5'
    }}>
      <span style={{
        fontSize: '13px',
        color: '#6b7280'
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '15px',
        fontWeight: '600',
        color: good ? '#8b5a62' : '#6b7280'
      }}>
        {value}{unit}
      </span>
    </div>
  )

  return (
    <div style={{
      fontFamily: "'Nunito Sans', -apple-system, sans-serif",
      background: '#ffffff',
      minHeight: '100vh',
      padding: '48px'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '48px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 20px',
          background: '#fdf2f4',
          borderRadius: '24px',
          marginBottom: '16px'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#d4949e'
          }}>
            {driver.tier} Driver
          </span>
          <span style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#d4949e'
          }} />
          <span style={{
            fontSize: '14px',
            color: '#b08891'
          }}>
            Week {driver.weeksAtPlatinum} at {driver.tier}
          </span>
        </div>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          {driver.name}
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#9ca3af',
          margin: 0
        }}>
          {driver.packagesDelivered.toLocaleString()} packages delivered this week
        </p>
      </header>

      {/* Achievement Progress */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <p style={{
          fontSize: '13px',
          color: '#9ca3af',
          marginBottom: '12px'
        }}>
          Achievements Earned This Week
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '32px',
                height: '8px',
                borderRadius: '4px',
                background: i < earnedCount
                  ? 'linear-gradient(90deg, #e8b4bc 0%, #d4949e 100%)'
                  : '#f0f0f0'
              }}
            />
          ))}
        </div>
        <p style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#8b5a62',
          margin: 0
        }}>
          {earnedCount} of 6
        </p>
      </div>

      {/* Achievements Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '48px'
      }}>
        {achievements.map(achievement => (
          <Badge key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {/* Performance Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px'
      }}>
        <div style={{
          padding: '24px',
          background: '#fafafa',
          borderRadius: '16px'
        }}>
          <h3 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#8b5a62',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '16px'
          }}>
            Delivery Metrics
          </h3>
          <MetricMini label="Delivery Completion" value={driver.dcr} good={driver.dcr >= 99} />
          <MetricMini label="POD Quality" value={driver.pod} good={driver.pod >= 98} />
          <MetricMini label="Customer Defect Free" value={driver.cdf} good={driver.cdf >= 90} />
          <MetricMini label="Success Behaviors" value={driver.dsb} good={driver.dsb >= 95} />
        </div>

        <div style={{
          padding: '24px',
          background: '#fafafa',
          borderRadius: '16px'
        }}>
          <h3 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#8b5a62',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '16px'
          }}>
            Safety Metrics
          </h3>
          <MetricMini label="Seatbelt Compliance" value={driver.seatbeltOffRate} good={driver.seatbeltOffRate === 100} />
          <MetricMini label="Speed Compliance" value={driver.speedingEventRate} good={driver.speedingEventRate === 100} />
          <MetricMini label="Distraction-Free" value={(100 - driver.distractionsRate).toFixed(1)} good={driver.distractionsRate < 1} />
          <MetricMini label="Following Distance" value={driver.followingDistanceRate} good={driver.followingDistanceRate === 100} />
        </div>
      </div>

      {/* Motivation Message */}
      <div style={{
        marginTop: '40px',
        padding: '24px 32px',
        background: 'linear-gradient(135deg, #fdf2f4 0%, #fef7f8 100%)',
        borderRadius: '16px',
        textAlign: 'center',
        border: '1px solid #f5d0d6'
      }}>
        <p style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#8b5a62',
          marginBottom: '8px'
        }}>
          {earnedCount === 6
            ? "Perfect Week! You've earned all achievements!"
            : earnedCount >= 4
              ? "Great performance! Just a few more to unlock all badges."
              : "Keep pushing! Each achievement brings you closer to excellence."}
        </p>
        <p style={{
          fontSize: '13px',
          color: '#b08891',
          margin: 0
        }}>
          {earnedCount < 6 && `${6 - earnedCount} more achievement${6 - earnedCount > 1 ? 's' : ''} to unlock this week`}
        </p>
      </div>
    </div>
  )
}
