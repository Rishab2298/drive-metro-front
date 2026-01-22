/**
 * Scorecard 18: Notification Style
 * Alert/notification card layout
 * Familiar mobile notification patterns
 * Soft blue-gray pastel accents
 */

import React from 'react'

const systemFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const sampleDriver = {
  name: "Chris Martinez",
  firstName: "Chris",
  tier: "Silver",
  packagesDelivered: 389,
  dcr: 95.8,
  pod: 91.2,
  cdf: 78.5,
  dsb: 85.3,
  seatbeltOffRate: 100,
  speedingEventRate: 96,
  distractionsRate: 2.1,
  followingDistanceRate: 94,
  signalViolationsRate: 1.5,
  podRejects: 8,
}

export default function ScorecardNotificationStyle({ driver = sampleDriver }) {
  const getNotificationType = (value, target, inverted = false) => {
    const diff = inverted ? target - value : value - target
    if (diff >= 0) return 'success'
    if (diff >= -5) return 'warning'
    return 'alert'
  }

  const NotificationCard = ({ type, icon, title, message, value, time, action }) => {
    const colors = {
      success: { bg: '#f0fdf4', border: '#bbf7d0', icon: '#22c55e', text: '#166534' },
      warning: { bg: '#fffbeb', border: '#fde68a', icon: '#f59e0b', text: '#92400e' },
      alert: { bg: '#fef2f2', border: '#fecaca', icon: '#ef4444', text: '#991b1b' },
      info: { bg: '#f0f9ff', border: '#bae6fd', icon: '#0ea5e9', text: '#0369a1' }
    }
    const c = colors[type] || colors.info

    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        borderLeft: `4px solid ${c.icon}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          gap: '14px'
        }}>
          {/* Icon */}
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: c.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0
          }}>
            {icon}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '4px'
            }}>
              <h4 style={{
                fontFamily: systemFont,
                fontSize: '15px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                {title}
              </h4>
              {value && (
                <span style={{
                  fontFamily: systemFont,
                  fontSize: '15px',
                  fontWeight: '700',
                  color: c.icon
                }}>
                  {value}
                </span>
              )}
            </div>
            <p style={{
              fontFamily: systemFont,
              fontSize: '13px',
              color: '#6b7280',
              margin: '0 0 8px 0',
              lineHeight: 1.4
            }}>
              {message}
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontFamily: systemFont,
                fontSize: '11px',
                color: '#9ca3af'
              }}>
                {time}
              </span>
              {action && (
                <span style={{
                  fontFamily: systemFont,
                  fontSize: '12px',
                  fontWeight: '600',
                  color: c.icon
                }}>
                  {action}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Generate notifications based on driver metrics
  const notifications = [
    // Tier notification
    {
      type: 'info',
      icon: '🏆',
      title: 'Current Standing',
      message: `You're at ${driver.tier} tier. ${driver.tier === 'Silver' ? 'Improve DCR and CDF to reach Gold!' : 'Keep up the good work!'}`,
      value: null,
      time: 'This week',
      action: null
    },
    // DCR
    {
      type: getNotificationType(driver.dcr, 98),
      icon: '📦',
      title: 'Delivery Completion',
      message: driver.dcr >= 98 ? 'Excellent delivery rate!' : `${(98 - driver.dcr).toFixed(1)}% away from target`,
      value: `${driver.dcr.toFixed(1)}%`,
      time: 'Updated today',
      action: driver.dcr < 98 ? 'View tips →' : null
    },
    // POD
    {
      type: getNotificationType(driver.pod, 95),
      icon: '📸',
      title: 'POD Quality Alert',
      message: driver.pod >= 95 ? 'Photo quality is on target' : `${driver.podRejects} photos rejected this week`,
      value: `${driver.pod.toFixed(1)}%`,
      time: '2 hours ago',
      action: driver.pod < 95 ? 'Improve photos →' : null
    },
    // CDF
    {
      type: getNotificationType(driver.cdf, 85),
      icon: '⭐',
      title: 'Customer Score',
      message: driver.cdf >= 85 ? 'Customers are happy!' : 'Focus on delivery quality and care',
      value: `${driver.cdf.toFixed(1)}%`,
      time: 'Yesterday',
      action: driver.cdf < 85 ? 'See details →' : null
    },
    // Safety
    {
      type: getNotificationType(driver.speedingEventRate, 100),
      icon: '🚗',
      title: 'Driving Safety',
      message: driver.speedingEventRate === 100 ? 'Perfect driving record!' : 'Some speeding events detected',
      value: `${driver.speedingEventRate.toFixed(1)}%`,
      time: 'This week',
      action: driver.speedingEventRate < 100 ? 'Review →' : null
    },
    // Distractions
    driver.distractionsRate > 1 && {
      type: 'alert',
      icon: '📱',
      title: 'Distraction Warning',
      message: 'Phone usage detected while driving. Stay focused for safety.',
      value: `${driver.distractionsRate.toFixed(1)} events`,
      time: '5 hours ago',
      action: 'Learn more →'
    }
  ].filter(Boolean)

  // Sort by priority (alerts first)
  const sortedNotifications = notifications.sort((a, b) => {
    const priority = { alert: 0, warning: 1, info: 2, success: 3 }
    return priority[a.type] - priority[b.type]
  })

  return (
    <div style={{
      fontFamily: systemFont,
      background: '#f8fafc',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        padding: '20px',
        borderBottom: '1px solid #f1f5f9',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 4px 0'
            }}>
              Notifications
            </h1>
            <p style={{
              fontSize: '13px',
              color: '#9ca3af',
              margin: 0
            }}>
              {notifications.length} updates for {driver.firstName}
            </p>
          </div>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🔔
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div style={{
        margin: '16px',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-around',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{driver.packagesDelivered}</p>
          <p style={{ fontSize: '11px', opacity: 0.8, margin: '4px 0 0 0' }}>Packages</p>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{driver.tier}</p>
          <p style={{ fontSize: '11px', opacity: 0.8, margin: '4px 0 0 0' }}>Tier</p>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{driver.dcr.toFixed(0)}%</p>
          <p style={{ fontSize: '11px', opacity: 0.8, margin: '4px 0 0 0' }}>DCR</p>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ padding: '0 16px 24px' }}>
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: '0 0 12px 4px'
        }}>
          Recent Updates
        </p>

        {sortedNotifications.map((notif, i) => (
          <NotificationCard key={i} {...notif} />
        ))}
      </div>
    </div>
  )
}
