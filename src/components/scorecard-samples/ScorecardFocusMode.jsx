/**
 * Scorecard 16: Focus Mode
 * Single metric at a time with large display
 * Swipe/tap navigation between metrics
 * Warm sand/beige pastel accents
 */

import React, { useState } from 'react'

const systemFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const sampleDriver = {
  name: "Daniel Park",
  firstName: "Daniel",
  tier: "Gold",
  packagesDelivered: 445,
  dcr: 97.2,
  pod: 94.8,
  cdf: 86.3,
  dsb: 91.5,
  seatbeltOffRate: 100,
  speedingEventRate: 98.5,
  distractionsRate: 0.8,
  followingDistanceRate: 97.2,
}

export default function ScorecardFocusMode({ driver = sampleDriver }) {
  const [focusIndex, setFocusIndex] = useState(0)

  const metrics = [
    {
      key: 'dcr',
      label: 'Delivery Completion',
      value: driver.dcr,
      target: 98,
      description: 'Percentage of packages successfully delivered',
      tips: [
        'Attempt delivery before marking undeliverable',
        'Use access codes from delivery notes',
        'Find safe alternate locations when needed'
      ]
    },
    {
      key: 'pod',
      label: 'POD Quality',
      value: driver.pod,
      target: 95,
      description: 'Photo-on-delivery acceptance rate',
      tips: [
        'Step back 3-4 feet from the package',
        'Ensure package is clearly visible',
        'Check lighting before taking photo'
      ]
    },
    {
      key: 'cdf',
      label: 'Customer Score',
      value: driver.cdf,
      target: 85,
      description: 'Customer defect-free delivery rate',
      tips: [
        'Follow customer delivery preferences',
        'Ring doorbell after delivery',
        'Place packages in protected areas'
      ]
    },
    {
      key: 'safety',
      label: 'Safety Score',
      value: ((driver.seatbeltOffRate + driver.speedingEventRate + (100 - driver.distractionsRate) + driver.followingDistanceRate) / 4),
      target: 98,
      description: 'Combined driving safety metrics',
      tips: [
        'Always wear your seatbelt',
        'Maintain safe following distance',
        'Avoid phone use while driving'
      ]
    }
  ]

  const current = metrics[focusIndex]
  const isGood = current.value >= current.target
  const gap = current.target - current.value

  const goNext = () => setFocusIndex((prev) => (prev + 1) % metrics.length)
  const goPrev = () => setFocusIndex((prev) => (prev - 1 + metrics.length) % metrics.length)

  return (
    <div style={{
      fontFamily: systemFont,
      background: '#faf8f5',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <p style={{
            fontSize: '12px',
            color: '#a8a29e',
            margin: '0 0 4px 0'
          }}>
            Focus Mode
          </p>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#292524',
            margin: 0
          }}>
            {driver.firstName}'s Metrics
          </h1>
        </div>
        <div style={{
          padding: '8px 14px',
          background: '#f5f0e8',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#78716c'
        }}>
          {focusIndex + 1} / {metrics.length}
        </div>
      </div>

      {/* Main Focus Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Metric Label */}
        <p style={{
          fontSize: '14px',
          color: '#a8a29e',
          textAlign: 'center',
          margin: '0 0 8px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          {current.label}
        </p>

        {/* Big Number */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <span style={{
            fontSize: '96px',
            fontWeight: '200',
            color: isGood ? '#78716c' : '#d6d3d1',
            lineHeight: 1
          }}>
            {current.value.toFixed(1)}
          </span>
          <span style={{
            fontSize: '32px',
            color: '#d6d3d1',
            marginLeft: '4px'
          }}>
            %
          </span>
        </div>

        {/* Status Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: isGood ? '#f0fdf4' : '#fefce8',
            borderRadius: '24px'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: isGood ? '#22c55e' : '#eab308'
            }} />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: isGood ? '#166534' : '#854d0e'
            }}>
              {isGood ? 'On Target' : `${gap.toFixed(1)}% below target`}
            </span>
          </div>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '15px',
          color: '#78716c',
          textAlign: 'center',
          margin: '0 0 32px 0',
          lineHeight: 1.5
        }}>
          {current.description}
        </p>

        {/* Tips Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{
            fontSize: '12px',
            color: '#a8a29e',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 16px 0'
          }}>
            Tips to Improve
          </h3>
          {current.tips.map((tip, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: i < current.tips.length - 1 ? '12px' : 0
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#f5f0e8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: '#78716c',
                flexShrink: 0
              }}>
                {i + 1}
              </div>
              <p style={{
                fontSize: '14px',
                color: '#57534e',
                margin: 0,
                lineHeight: 1.5
              }}>
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={goPrev}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: '2px solid #e7e5e4',
            background: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#78716c'
          }}
        >
          ←
        </button>

        {/* Dots */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {metrics.map((_, i) => (
            <button
              key={i}
              onClick={() => setFocusIndex(i)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: i === focusIndex ? '#78716c' : '#e7e5e4',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #d6cfc4 0%, #a8a29e 100%)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(120, 113, 108, 0.3)'
          }}
        >
          →
        </button>
      </div>
    </div>
  )
}
