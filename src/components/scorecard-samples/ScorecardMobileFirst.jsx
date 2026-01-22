/**
 * Scorecard 11: Mobile First
 * Fully optimized for mobile devices with touch-friendly interactions
 * Vertical stack layout, large tap targets, swipeable sections
 * Subtle slate blue pastel accents
 */

import React, { useState } from 'react'

const sampleDriver = {
  name: "Marcus Johnson",
  firstName: "Marcus",
  tier: "Gold",
  packagesDelivered: 534,
  dcr: 97.8,
  pod: 96.5,
  cdf: 85.2,
  ced: 98,
  dsb: 92,
  seatbeltOffRate: 100,
  speedingEventRate: 99,
  distractionsRate: 0.5,
  followingDistanceRate: 98,
  signalViolationsRate: 0,
  podOpportunities: 356,
  podSuccess: 344,
  podRejects: 12,
  dvicComplianceRate: 100,
  ppsComplianceRate: 94,
}

export default function ScorecardMobileFirst({ driver = sampleDriver }) {
  const [activeTab, setActiveTab] = useState('overview')

  const getScoreColor = (score, target = 95) => {
    if (score >= target) return { bg: '#eef2ff', text: '#5b6b8a', accent: '#8b9dc3' }
    if (score >= target - 10) return { bg: '#fefce8', text: '#854d0e', accent: '#ca8a04' }
    return { bg: '#fef2f2', text: '#991b1b', accent: '#dc2626' }
  }

  const tierColors = {
    Platinum: { bg: '#f1f5f9', text: '#475569', gradient: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' },
    Gold: { bg: '#fef9ec', text: '#92400e', gradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' },
    Silver: { bg: '#f8fafc', text: '#64748b', gradient: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)' },
    Bronze: { bg: '#fef7ed', text: '#9a3412', gradient: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)' }
  }

  const tierStyle = tierColors[driver.tier] || tierColors.Silver

  // Large metric card for mobile
  const MetricCard = ({ label, value, target, unit = '%', subtitle }) => {
    const colors = getScoreColor(value, target)
    const percentage = Math.min((value / target) * 100, 100)

    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 6px 0'
            }}>
              {label}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px'
            }}>
              <span style={{
                fontSize: '36px',
                fontWeight: '700',
                color: colors.text,
                lineHeight: 1
              }}>
                {typeof value === 'number' ? value.toFixed(1) : value}
              </span>
              <span style={{
                fontSize: '18px',
                color: '#9ca3af'
              }}>
                {unit}
              </span>
            </div>
          </div>
          <div style={{
            background: colors.bg,
            padding: '8px 14px',
            borderRadius: '20px'
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: colors.text
            }}>
              {value >= target ? 'On Target' : `${(target - value).toFixed(1)}% to go`}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: '8px',
          background: '#f3f4f6',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${percentage}%`,
            background: colors.accent,
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>

        {subtitle && (
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '12px',
            margin: '12px 0 0 0'
          }}>
            {subtitle}
          </p>
        )}
      </div>
    )
  }

  // Safety metric row for mobile
  const SafetyRow = ({ label, value, icon }) => {
    const isPerfect = value >= 99
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: isPerfect ? '#eef2ff' : '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            {icon}
          </div>
          <span style={{
            fontSize: '15px',
            color: '#374151',
            fontWeight: '450'
          }}>
            {label}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            fontSize: '17px',
            fontWeight: '600',
            color: isPerfect ? '#5b6b8a' : '#6b7280'
          }}>
            {value}%
          </span>
          {isPerfect && (
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#8b9dc3'
            }} />
          )}
        </div>
      </div>
    )
  }

  // Tab button for mobile
  const TabButton = ({ id, label, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        flex: 1,
        padding: '14px 8px',
        background: active ? '#5b6b8a' : 'transparent',
        color: active ? '#ffffff' : '#6b7280',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: '#f8fafc',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      paddingBottom: '100px'
    }}>
      {/* Header - Sticky */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#ffffff',
        padding: '20px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{
              fontSize: '13px',
              color: '#9ca3af',
              margin: '0 0 4px 0'
            }}>
              Welcome back,
            </p>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              {driver.firstName}
            </h1>
          </div>
          <div style={{
            background: tierStyle.gradient,
            padding: '10px 18px',
            borderRadius: '24px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            {driver.tier}
          </div>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        background: '#e5e7eb',
        margin: '0 0 16px 0'
      }}>
        {[
          { label: 'Packages', value: driver.packagesDelivered },
          { label: 'POD Success', value: driver.podSuccess },
          { label: 'DVIC', value: `${driver.dvicComplianceRate}%` }
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#ffffff',
            padding: '16px 12px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '11px',
              color: '#9ca3af',
              margin: '0 0 4px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {stat.label}
            </p>
            <p style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#374151',
              margin: 0
            }}>
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '6px',
        padding: '4px',
        margin: '0 16px 20px',
        background: '#f1f5f9',
        borderRadius: '14px'
      }}>
        <TabButton id="overview" label="Overview" active={activeTab === 'overview'} />
        <TabButton id="safety" label="Safety" active={activeTab === 'safety'} />
        <TabButton id="tips" label="Tips" active={activeTab === 'tips'} />
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px' }}>
        {activeTab === 'overview' && (
          <>
            <MetricCard
              label="Delivery Completion Rate"
              value={driver.dcr}
              target={98}
              subtitle="Keep it above 98% to maintain your tier"
            />
            <MetricCard
              label="POD Quality Score"
              value={driver.pod}
              target={95}
              subtitle={`${driver.podSuccess} accepted, ${driver.podRejects} rejected`}
            />
            <MetricCard
              label="Customer Defect Free"
              value={driver.cdf}
              target={85}
              subtitle="Measures delivery accuracy and care"
            />
            <MetricCard
              label="Success Behaviors"
              value={driver.dsb}
              target={90}
              subtitle="Following best practices score"
            />
          </>
        )}

        {activeTab === 'safety' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '8px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <SafetyRow label="Seatbelt Compliance" value={driver.seatbeltOffRate} icon="🔒" />
            <SafetyRow label="Speed Compliance" value={driver.speedingEventRate} icon="⚡" />
            <SafetyRow label="Distraction-Free" value={(100 - driver.distractionsRate).toFixed(1)} icon="👀" />
            <SafetyRow label="Following Distance" value={driver.followingDistanceRate} icon="📏" />
            <SafetyRow label="Signal Compliance" value={(100 - driver.signalViolationsRate).toFixed(1)} icon="🚦" />

            {/* Overall Safety Score */}
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: '#eef2ff',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '13px',
                color: '#5b6b8a',
                marginBottom: '8px'
              }}>
                Overall Safety Score
              </p>
              <p style={{
                fontSize: '42px',
                fontWeight: '700',
                color: '#5b6b8a',
                margin: 0
              }}>
                {((driver.seatbeltOffRate + driver.speedingEventRate + (100 - driver.distractionsRate) + driver.followingDistanceRate + (100 - driver.signalViolationsRate)) / 5).toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 16px 0'
            }}>
              Tips to Improve
            </h3>

            {[
              {
                title: 'Better POD Photos',
                tip: 'Step back 3-4 feet and ensure the package is clearly visible before snapping.',
                priority: driver.pod < 95
              },
              {
                title: 'Reduce Distractions',
                tip: 'Set up navigation before starting. Use voice commands when needed.',
                priority: driver.distractionsRate > 1
              },
              {
                title: 'Customer Experience',
                tip: 'Ring doorbell after delivery. Place packages in covered areas when possible.',
                priority: driver.cdf < 85
              },
              {
                title: 'Maintain Following Distance',
                tip: 'Keep at least 3 seconds of distance from the vehicle ahead.',
                priority: driver.followingDistanceRate < 99
              }
            ].filter(t => t.priority).slice(0, 3).map((item, i) => (
              <div key={i} style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                marginBottom: '12px',
                borderLeft: '4px solid #8b9dc3'
              }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 6px 0'
                }}>
                  {item.title}
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  {item.tip}
                </p>
              </div>
            ))}

            {driver.pod >= 95 && driver.distractionsRate <= 1 && driver.cdf >= 85 && driver.followingDistanceRate >= 99 && (
              <div style={{
                padding: '24px',
                background: '#eef2ff',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '24px',
                  marginBottom: '8px'
                }}>
                  ⭐
                </p>
                <p style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#5b6b8a',
                  margin: 0
                }}>
                  Excellent! All metrics on target.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Status Bar - Fixed */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        padding: '16px 20px',
        background: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
      }}>
        <div>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            margin: '0 0 2px 0'
          }}>
            This Week
          </p>
          <p style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            margin: 0
          }}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: driver.dcr >= 98 && driver.pod >= 95 ? '#eef2ff' : '#fef9ec',
          borderRadius: '20px'
        }}>
          <span style={{
            fontSize: '14px'
          }}>
            {driver.dcr >= 98 && driver.pod >= 95 ? '📈' : '💪'}
          </span>
          <span style={{
            fontSize: '13px',
            fontWeight: '600',
            color: driver.dcr >= 98 && driver.pod >= 95 ? '#5b6b8a' : '#92400e'
          }}>
            {driver.dcr >= 98 && driver.pod >= 95 ? 'On Track' : 'Keep Pushing'}
          </span>
        </div>
      </div>
    </div>
  )
}
