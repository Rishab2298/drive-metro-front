/**
 * Scorecard Samples Demo Page
 * Preview all 32 enterprise-grade scorecard designs
 */

import React, { useState } from 'react'
import {
  ScorecardSwissGrid,
  ScorecardSoftCards,
  ScorecardLinearProgress,
  ScorecardRadialDashboard,
  ScorecardDataTable,
  ScorecardAchievementFocus,
  ScorecardTrendSparklines,
  ScorecardComparisonSplit,
  ScorecardImprovementCoach,
  ScorecardTimelineProgress,
  ScorecardMobileFirst,
  ScorecardGaugeMeters,
  ScorecardCardStack,
  ScorecardStatusPulse,
  ScorecardMiniDashboard,
  ScorecardFocusMode,
  ScorecardChecklist,
  ScorecardNotificationStyle,
  ScorecardStoryFormat,
  ScorecardQuickGlance,
  ScorecardSampleDemo,
  ScorecardEnterpriseSuite,
  ScorecardEditorialMag,
  ScorecardDashboardTiles,
  ScorecardSidebarNav,
  ScorecardAccordionPanels,
  ScorecardCardCarousel,
  ScorecardSplitScreen,
  ScorecardTimelineFlow,
  ScorecardFloatingCards,
  ScorecardTabMatrix,
  ScorecardMinimalList
} from '../../components/scorecard-samples'

const scorecards = [
  // Desktop-first designs
  { id: 1, name: 'Swiss Grid', accent: 'Sage Green', component: ScorecardSwissGrid, description: 'Ultra-clean grid layout with Swiss design principles', mobile: false },
  { id: 2, name: 'Soft Cards', accent: 'Lavender', component: ScorecardSoftCards, description: 'Rounded card metrics with soft shadows', mobile: false },
  { id: 3, name: 'Linear Progress', accent: 'Peach', component: ScorecardLinearProgress, description: 'Horizontal progress bars for easy scanning', mobile: false },
  { id: 4, name: 'Radial Dashboard', accent: 'Sky Blue', component: ScorecardRadialDashboard, description: 'Circular progress rings dashboard style', mobile: false },
  { id: 5, name: 'Data Table', accent: 'Mint Green', component: ScorecardDataTable, description: 'Clean tabular enterprise spreadsheet view', mobile: false },
  { id: 6, name: 'Achievement Focus', accent: 'Rose', component: ScorecardAchievementFocus, description: 'Gamification badges and achievements', mobile: false },
  { id: 7, name: 'Trend Sparklines', accent: 'Coral', component: ScorecardTrendSparklines, description: 'Mini inline charts showing trends', mobile: false },
  { id: 8, name: 'Comparison Split', accent: 'Cream', component: ScorecardComparisonSplit, description: 'Side-by-side week-over-week comparison', mobile: false },
  { id: 9, name: 'Improvement Coach', accent: 'Teal', component: ScorecardImprovementCoach, description: 'Action-oriented with learning tips', mobile: false },
  { id: 10, name: 'Timeline Progress', accent: 'Amber', component: ScorecardTimelineProgress, description: 'Journey timeline with milestones', mobile: false },
  // Mobile-first designs
  { id: 11, name: 'Mobile First', accent: 'Slate Blue', component: ScorecardMobileFirst, description: 'Fully mobile-optimized with tabs', mobile: true },
  { id: 12, name: 'Gauge Meters', accent: 'Mint', component: ScorecardGaugeMeters, description: 'Speedometer-style SVG gauges', mobile: true },
  { id: 13, name: 'Card Stack', accent: 'Coral', component: ScorecardCardStack, description: 'Swipeable/tappable card stack', mobile: true },
  { id: 14, name: 'Status Pulse', accent: 'Cyan', component: ScorecardStatusPulse, description: 'Animated pulse status indicators', mobile: true },
  { id: 15, name: 'Mini Dashboard', accent: 'Purple', component: ScorecardMiniDashboard, description: 'Compact all-in-one view', mobile: true },
  { id: 16, name: 'Focus Mode', accent: 'Sand', component: ScorecardFocusMode, description: 'Single metric at a time, swipeable', mobile: true },
  { id: 17, name: 'Checklist', accent: 'Green', component: ScorecardChecklist, description: 'Task completion checklist format', mobile: true },
  { id: 18, name: 'Notifications', accent: 'Blue-Gray', component: ScorecardNotificationStyle, description: 'Alert/notification card layout', mobile: true },
  { id: 19, name: 'Story Format', accent: 'Pink', component: ScorecardStoryFormat, description: 'Vertical story-like progression', mobile: true },
  { id: 20, name: 'Quick Glance', accent: 'Monochrome', component: ScorecardQuickGlance, description: 'Ultra-minimal essential metrics', mobile: true },
  { id: 21, name: 'Enterprise Demo', accent: 'Indigo/Violet', component: ScorecardSampleDemo, description: 'Premium enterprise scorecard with collapsible sections and severity indicators', mobile: true },
  { id: 22, name: 'Enterprise Suite', accent: 'Pastel Themes', component: ScorecardEnterpriseSuite, description: 'DiveMetric branded with 10 pastel themes and clickable metrics with explanations', mobile: true },
  { id: 23, name: 'Editorial Magazine', accent: 'Serif/Cream', component: ScorecardEditorialMag, description: 'Large typography, editorial spreads, asymmetric grids', mobile: true },
  { id: 24, name: 'Dashboard Tiles', accent: 'Multi-Theme', component: ScorecardDashboardTiles, description: 'Modular tile-based with customizable grid', mobile: true },
  { id: 25, name: 'Sidebar Navigation', accent: 'Pastel Mix', component: ScorecardSidebarNav, description: 'Fixed sidebar with scrollable content panels', mobile: true },
  { id: 26, name: 'Accordion Panels', accent: 'Section Colors', component: ScorecardAccordionPanels, description: 'Full-width expanding accordion sections', mobile: true },
  { id: 27, name: 'Card Carousel', accent: 'Gradient Cards', component: ScorecardCardCarousel, description: 'Horizontal scrolling card sections', mobile: true },
  { id: 28, name: 'Split Screen', accent: 'Panel Themes', component: ScorecardSplitScreen, description: 'Two-column layout with fixed left summary', mobile: true },
  { id: 29, name: 'Timeline Flow', accent: 'Node Colors', component: ScorecardTimelineFlow, description: 'Vertical timeline with branching metrics', mobile: true },
  { id: 30, name: 'Floating Cards', accent: 'Stacked Depth', component: ScorecardFloatingCards, description: 'Overlapping card layers with depth', mobile: true },
  { id: 31, name: 'Tab Matrix', accent: 'Grid Themes', component: ScorecardTabMatrix, description: 'Grid of tabbed metric groups', mobile: true },
  { id: 32, name: 'Minimal List', accent: 'Ultra-Clean', component: ScorecardMinimalList, description: 'Ultra-clean list-based with expandable rows', mobile: true },
]

export default function ScorecardSamplesDemo() {
  const [selectedId, setSelectedId] = useState(1)
  const [filterMobile, setFilterMobile] = useState(null) // null = all, true = mobile, false = desktop
  const selectedScorecard = scorecards.find(s => s.id === selectedId)
  const SelectedComponent = selectedScorecard?.component

  const filteredScorecards = filterMobile === null
    ? scorecards
    : scorecards.filter(s => s.mobile === filterMobile)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Navigation Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                Scorecard Design Samples
              </h1>
              <p style={{
                fontSize: '13px',
                color: '#6b7280',
                margin: 0
              }}>
                32 unique enterprise-grade designs • System fonts only
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {/* Filter buttons */}
              <div style={{
                display: 'flex',
                gap: '4px',
                padding: '4px',
                background: '#f3f4f6',
                borderRadius: '8px'
              }}>
                <button
                  onClick={() => setFilterMobile(null)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: filterMobile === null ? '#ffffff' : 'transparent',
                    color: filterMobile === null ? '#1f2937' : '#6b7280',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: filterMobile === null ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  All (32)
                </button>
                <button
                  onClick={() => setFilterMobile(false)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: filterMobile === false ? '#ffffff' : 'transparent',
                    color: filterMobile === false ? '#1f2937' : '#6b7280',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: filterMobile === false ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  Desktop (10)
                </button>
                <button
                  onClick={() => setFilterMobile(true)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: filterMobile === true ? '#ffffff' : 'transparent',
                    color: filterMobile === true ? '#1f2937' : '#6b7280',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: filterMobile === true ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  Mobile (22)
                </button>
              </div>
              <span style={{
                padding: '4px 12px',
                background: '#f3f4f6',
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '13px',
                color: '#6b7280'
              }}>
                #{selectedId}
              </span>
            </div>
          </div>

          {/* Scorecard Selector */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}>
            {filteredScorecards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedId(card.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: selectedId === card.id ? '2px solid #374151' : '1px solid #e5e7eb',
                  background: selectedId === card.id ? '#f9fafb' : '#ffffff',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                {card.mobile && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '16px',
                    height: '16px',
                    background: '#8b5cf6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#ffffff'
                  }}>
                    M
                  </span>
                )}
                <div style={{
                  fontSize: '13px',
                  fontWeight: selectedId === card.id ? '600' : '500',
                  color: '#374151',
                  marginBottom: '2px'
                }}>
                  {card.id}. {card.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#9ca3af'
                }}>
                  {card.accent}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Scorecard Info Bar */}
      <div style={{
        background: '#fafafa',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <p style={{
            fontSize: '13px',
            color: '#6b7280',
            margin: 0
          }}>
            <strong style={{ color: '#374151' }}>{selectedScorecard?.name}:</strong>{' '}
            {selectedScorecard?.description}
            {selectedScorecard?.mobile && (
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                background: '#ede9fe',
                color: '#7c3aed',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                Mobile-First
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Scorecard Preview */}
      <div style={{
        maxWidth: '1400px',
        margin: '24px auto',
        padding: '0 24px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 4px 20px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          // Center mobile designs
          display: selectedScorecard?.mobile ? 'flex' : 'block',
          justifyContent: 'center'
        }}>
          {SelectedComponent && <SelectedComponent />}
        </div>
      </div>

      {/* Quick Navigation Footer */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '4px',
        padding: '8px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 100
      }}>
        <button
          onClick={() => {
            const currentIndex = filteredScorecards.findIndex(s => s.id === selectedId)
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredScorecards.length - 1
            setSelectedId(filteredScorecards[prevIndex].id)
          }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ←
        </button>
        <div style={{
          display: 'flex',
          gap: '2px',
          alignItems: 'center',
          padding: '0 8px'
        }}>
          {filteredScorecards.map((card) => (
            <button
              key={card.id}
              onClick={() => setSelectedId(card.id)}
              style={{
                width: selectedId === card.id ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: selectedId === card.id
                  ? (card.mobile ? '#8b5cf6' : '#374151')
                  : '#e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title={`${card.id}. ${card.name}`}
            />
          ))}
        </div>
        <button
          onClick={() => {
            const currentIndex = filteredScorecards.findIndex(s => s.id === selectedId)
            const nextIndex = currentIndex < filteredScorecards.length - 1 ? currentIndex + 1 : 0
            setSelectedId(filteredScorecards[nextIndex].id)
          }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          →
        </button>
      </div>
    </div>
  )
}
