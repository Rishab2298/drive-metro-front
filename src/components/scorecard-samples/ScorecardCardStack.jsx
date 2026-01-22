/**
 * Scorecard 13: Card Stack
 * Swipeable/tappable card stack layout
 * Each card reveals detailed metric info
 * Warm coral pastel accents
 */

import React, { useState } from 'react'

const systemFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const sampleDriver = {
  name: "Sophia Rivera",
  firstName: "Sophia",
  tier: "Platinum",
  packagesDelivered: 743,
  dcr: 99.2,
  pod: 97.8,
  cdf: 91.5,
  dsb: 96.2,
  seatbeltOffRate: 100,
  speedingEventRate: 99.5,
  distractionsRate: 0.3,
  followingDistanceRate: 99.8,
}

export default function ScorecardCardStack({ driver = sampleDriver }) {
  const [activeCard, setActiveCard] = useState(0)

  const cards = [
    {
      title: 'Delivery Rate',
      value: driver.dcr,
      target: 98,
      icon: '📦',
      detail: `${driver.packagesDelivered} packages delivered this week`,
      tip: 'Complete all delivery attempts before marking undeliverable'
    },
    {
      title: 'POD Quality',
      value: driver.pod,
      target: 95,
      icon: '📸',
      detail: 'Photo acceptance rate',
      tip: 'Ensure good lighting and full package visibility'
    },
    {
      title: 'Customer Score',
      value: driver.cdf,
      target: 85,
      icon: '⭐',
      detail: 'Customer defect-free rate',
      tip: 'Follow delivery instructions carefully'
    },
    {
      title: 'Safety Score',
      value: ((driver.seatbeltOffRate + driver.speedingEventRate + (100 - driver.distractionsRate) + driver.followingDistanceRate) / 4),
      target: 98,
      icon: '🛡️',
      detail: 'Combined safety metrics',
      tip: 'Stay focused and follow all safety protocols'
    }
  ]

  const currentCard = cards[activeCard]
  const isGood = currentCard.value >= currentCard.target

  return (
    <div style={{
      fontFamily: systemFont,
      background: '#fff7f5',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        background: '#ffffff'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 4px 0'
            }}>
              Hi, {driver.firstName}
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#9ca3af',
              margin: 0
            }}>
              Tap cards to explore your metrics
            </p>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fda4af 0%, #fb7185 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            {driver.tier.charAt(0)}
          </div>
        </div>
      </div>

      {/* Card Stack Container */}
      <div style={{
        padding: '24px 16px',
        position: 'relative'
      }}>
        {/* Background cards (stacked effect) */}
        {cards.map((card, index) => {
          const offset = index - activeCard
          if (offset < 0 || offset > 2) return null

          return (
            <div
              key={index}
              onClick={() => setActiveCard(index)}
              style={{
                position: offset === 0 ? 'relative' : 'absolute',
                top: offset === 0 ? 0 : `${offset * 8}px`,
                left: offset === 0 ? 0 : '16px',
                right: offset === 0 ? 0 : '16px',
                background: '#ffffff',
                borderRadius: '24px',
                padding: offset === 0 ? '28px' : '20px',
                boxShadow: offset === 0
                  ? '0 8px 32px rgba(251, 113, 133, 0.15)'
                  : '0 4px 16px rgba(0,0,0,0.06)',
                transform: `scale(${1 - offset * 0.05})`,
                opacity: offset === 0 ? 1 : 0.7,
                zIndex: cards.length - offset,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {offset === 0 ? (
                <>
                  {/* Active card content */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: '#fff1f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px'
                    }}>
                      {card.icon}
                    </div>
                    <div style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      background: isGood ? '#ecfdf5' : '#fef9c3',
                      color: isGood ? '#059669' : '#ca8a04',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {isGood ? 'On Target' : 'Needs Focus'}
                    </div>
                  </div>

                  <h2 style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    fontWeight: '500',
                    margin: '0 0 8px 0'
                  }}>
                    {card.title}
                  </h2>

                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      fontSize: '48px',
                      fontWeight: '700',
                      color: '#1f2937',
                      lineHeight: 1
                    }}>
                      {card.value.toFixed(1)}
                    </span>
                    <span style={{
                      fontSize: '20px',
                      color: '#d1d5db'
                    }}>
                      %
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: '8px',
                    background: '#fce7f3',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(card.value, 100)}%`,
                      background: 'linear-gradient(90deg, #fda4af 0%, #fb7185 100%)',
                      borderRadius: '4px'
                    }} />
                  </div>

                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0 0 16px 0'
                  }}>
                    {card.detail}
                  </p>

                  <div style={{
                    padding: '14px 16px',
                    background: '#fff7f5',
                    borderRadius: '12px',
                    borderLeft: '3px solid #fb7185'
                  }}>
                    <p style={{
                      fontSize: '13px',
                      color: '#9f1239',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      💡 {card.tip}
                    </p>
                  </div>
                </>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>{card.icon}</span>
                  <span style={{
                    fontSize: '15px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {card.title}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Card Navigator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '20px'
      }}>
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveCard(index)}
            style={{
              width: activeCard === index ? '32px' : '10px',
              height: '10px',
              borderRadius: '5px',
              border: 'none',
              background: activeCard === index ? '#fb7185' : '#fecdd3',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Bottom Summary */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        padding: '16px 20px',
        background: '#ffffff',
        borderTop: '1px solid #fce7f3',
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => setActiveCard(index)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: activeCard === index ? 1 : 0.5,
              transition: 'opacity 0.2s'
            }}
          >
            <span style={{ fontSize: '20px' }}>{card.icon}</span>
            <span style={{
              fontSize: '11px',
              color: '#6b7280',
              fontWeight: activeCard === index ? '600' : '400'
            }}>
              {card.value.toFixed(0)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
