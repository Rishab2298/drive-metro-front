/**
 * Scorecard 19: Story Format
 * Vertical story-like progression (Instagram/Snapchat style)
 * Full-screen cards with progress bar at top
 * Warm pink/magenta pastel accents
 */

import React, { useState, useEffect } from 'react'

const systemFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const sampleDriver = {
  name: "Taylor Kim",
  firstName: "Taylor",
  tier: "Platinum",
  packagesDelivered: 892,
  dcr: 99.6,
  pod: 98.4,
  cdf: 94.2,
  dsb: 97.8,
  seatbeltOffRate: 100,
  speedingEventRate: 100,
  distractionsRate: 0.1,
  followingDistanceRate: 100,
  weeksAtTier: 8,
}

export default function ScorecardStoryFormat({ driver = sampleDriver }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)

  const slides = [
    {
      type: 'intro',
      title: `${driver.firstName}'s Week`,
      subtitle: 'Your Performance Story',
      bg: 'linear-gradient(180deg, #fdf2f8 0%, #fce7f3 100%)'
    },
    {
      type: 'stat',
      emoji: '📦',
      value: driver.packagesDelivered,
      label: 'Packages Delivered',
      detail: 'This week',
      bg: 'linear-gradient(180deg, #fff1f3 0%, #ffe4e9 100%)'
    },
    {
      type: 'metric',
      emoji: '🎯',
      metric: 'Delivery Rate',
      value: driver.dcr,
      target: 98,
      status: driver.dcr >= 98 ? 'On Target!' : 'Keep pushing!',
      bg: 'linear-gradient(180deg, #fef1f8 0%, #fce7f3 100%)'
    },
    {
      type: 'metric',
      emoji: '📸',
      metric: 'POD Quality',
      value: driver.pod,
      target: 95,
      status: driver.pod >= 95 ? 'Great photos!' : 'Room to improve',
      bg: 'linear-gradient(180deg, #fdf4ff 0%, #f5d0fe 100%)'
    },
    {
      type: 'metric',
      emoji: '⭐',
      metric: 'Customer Score',
      value: driver.cdf,
      target: 85,
      status: driver.cdf >= 90 ? 'Customers love you!' : 'Good progress',
      bg: 'linear-gradient(180deg, #fef7ff 0%, #f3e8ff 100%)'
    },
    {
      type: 'safety',
      emoji: '🛡️',
      title: 'Safety Score',
      seatbelt: driver.seatbeltOffRate,
      speed: driver.speedingEventRate,
      focus: 100 - driver.distractionsRate,
      following: driver.followingDistanceRate,
      bg: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)'
    },
    {
      type: 'achievement',
      emoji: '🏆',
      title: driver.tier,
      subtitle: `${driver.weeksAtTier} weeks at this tier`,
      message: driver.tier === 'Platinum' ? 'You\'re among the best!' : 'Keep climbing!',
      bg: 'linear-gradient(180deg, #fefce8 0%, #fef08a 100%)'
    },
    {
      type: 'summary',
      title: 'Keep It Up!',
      message: 'You\'re doing amazing this week. Stay consistent and focused.',
      bg: 'linear-gradient(180deg, #fdf2f8 0%, #ec4899 100%)'
    }
  ]

  // Auto-progress timer
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => (s + 1) % slides.length)
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setProgress(0)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setProgress(0)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setProgress(0)
  }

  const slide = slides[currentSlide]

  return (
    <div style={{
      fontFamily: systemFont,
      background: '#000000',
      minHeight: '100vh',
      maxWidth: '430px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Progress bars at top */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        gap: '4px',
        zIndex: 20
      }}>
        {slides.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '3px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div style={{
              height: '100%',
              width: i < currentSlide ? '100%' : i === currentSlide ? `${progress}%` : '0%',
              background: '#ffffff',
              transition: i === currentSlide ? 'none' : 'width 0.3s'
            }} />
          </div>
        ))}
      </div>

      {/* Touch areas */}
      <div
        onClick={prevSlide}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '30%',
          zIndex: 15,
          cursor: 'pointer'
        }}
      />
      <div
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '70%',
          zIndex: 15,
          cursor: 'pointer'
        }}
      />

      {/* Slide Content */}
      <div style={{
        minHeight: '100vh',
        background: slide.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 32px 40px',
        textAlign: 'center'
      }}>
        {slide.type === 'intro' && (
          <>
            <p style={{
              fontSize: '48px',
              margin: '0 0 24px 0'
            }}>
              👋
            </p>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0'
            }}>
              {slide.title}
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              margin: 0
            }}>
              {slide.subtitle}
            </p>
          </>
        )}

        {slide.type === 'stat' && (
          <>
            <p style={{ fontSize: '64px', margin: '0 0 20px 0' }}>{slide.emoji}</p>
            <p style={{
              fontSize: '72px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 8px 0',
              lineHeight: 1
            }}>
              {slide.value}
            </p>
            <p style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              {slide.label}
            </p>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              margin: 0
            }}>
              {slide.detail}
            </p>
          </>
        )}

        {slide.type === 'metric' && (
          <>
            <p style={{ fontSize: '56px', margin: '0 0 24px 0' }}>{slide.emoji}</p>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              margin: '0 0 12px 0'
            }}>
              {slide.metric}
            </p>
            <p style={{
              fontSize: '80px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 8px 0',
              lineHeight: 1
            }}>
              {slide.value.toFixed(1)}
              <span style={{ fontSize: '32px', color: '#9ca3af' }}>%</span>
            </p>
            <p style={{
              fontSize: '20px',
              fontWeight: '600',
              color: slide.value >= slide.target ? '#22c55e' : '#f59e0b',
              margin: 0
            }}>
              {slide.status}
            </p>
          </>
        )}

        {slide.type === 'safety' && (
          <>
            <p style={{ fontSize: '56px', margin: '0 0 24px 0' }}>{slide.emoji}</p>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 32px 0'
            }}>
              {slide.title}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              width: '100%'
            }}>
              {[
                { label: 'Seatbelt', value: slide.seatbelt },
                { label: 'Speed', value: slide.speed },
                { label: 'Focus', value: slide.focus },
                { label: 'Distance', value: slide.following }
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: '16px',
                  padding: '16px'
                }}>
                  <p style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: item.value >= 99 ? '#22c55e' : '#6b7280',
                    margin: '0 0 4px 0'
                  }}>
                    {item.value.toFixed(1)}%
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {slide.type === 'achievement' && (
          <>
            <p style={{ fontSize: '72px', margin: '0 0 24px 0' }}>{slide.emoji}</p>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0'
            }}>
              {slide.title}
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              margin: '0 0 16px 0'
            }}>
              {slide.subtitle}
            </p>
            <p style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#ca8a04',
              margin: 0
            }}>
              {slide.message}
            </p>
          </>
        )}

        {slide.type === 'summary' && (
          <>
            <p style={{ fontSize: '56px', margin: '0 0 24px 0' }}>🚀</p>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 16px 0'
            }}>
              {slide.title}
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
              lineHeight: 1.5
            }}>
              {slide.message}
            </p>
          </>
        )}
      </div>

      {/* Slide indicator */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '6px',
        zIndex: 20
      }}>
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => goToSlide(i)}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: i === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  )
}
