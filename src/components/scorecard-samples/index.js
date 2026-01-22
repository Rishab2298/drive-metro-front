
/**
 * Enterprise-Grade Driver Scorecard Samples
 *
 * 32 unique scorecard designs - 10 desktop-first + 22 mobile-first
 * All using system fonts for universal compatibility
 */

// === DESKTOP-FIRST DESIGNS (1-10) ===

// 1. Swiss Grid - Ultra-clean grid layout with sage green accents
export { default as ScorecardSwissGrid } from './ScorecardSwissGrid'

// 2. Soft Cards - Rounded card metrics with lavender accents
export { default as ScorecardSoftCards } from './ScorecardSoftCards'

// 3. Linear Progress - Horizontal progress bars with peach tones
export { default as ScorecardLinearProgress } from './ScorecardLinearProgress'

// 4. Radial Dashboard - Circular progress rings with sky blue accents
export { default as ScorecardRadialDashboard } from './ScorecardRadialDashboard'

// 5. Data Table Classic - Clean tabular data with mint green accents
export { default as ScorecardDataTable } from './ScorecardDataTable'

// 6. Achievement Focus - Badge-centric gamification with rose accents
export { default as ScorecardAchievementFocus } from './ScorecardAchievementFocus'

// 7. Trend Sparklines - Mini inline charts with coral highlights
export { default as ScorecardTrendSparklines } from './ScorecardTrendSparklines'

// 8. Comparison Split - Side-by-side week comparison with cream/butter accents
export { default as ScorecardComparisonSplit } from './ScorecardComparisonSplit'

// 9. Improvement Coach - Action-oriented with teal accents and learning tips
export { default as ScorecardImprovementCoach } from './ScorecardImprovementCoach'

// 10. Timeline Progress - Week-over-week journey with amber accents
export { default as ScorecardTimelineProgress } from './ScorecardTimelineProgress'


// === MOBILE-FIRST DESIGNS (11-20) ===

// 11. Mobile First - Fully mobile-optimized with slate blue accents
export { default as ScorecardMobileFirst } from './ScorecardMobileFirst'

// 12. Gauge Meters - Speedometer-style SVG gauges with mint accents
export { default as ScorecardGaugeMeters } from './ScorecardGaugeMeters'

// 13. Card Stack - Swipeable card stack layout with coral accents
export { default as ScorecardCardStack } from './ScorecardCardStack'

// 14. Status Pulse - Animated pulse indicators with cyan accents
export { default as ScorecardStatusPulse } from './ScorecardStatusPulse'

// 15. Mini Dashboard - Compact all-in-one view with purple accents
export { default as ScorecardMiniDashboard } from './ScorecardMiniDashboard'

// 16. Focus Mode - Single metric at a time with sand/beige accents
export { default as ScorecardFocusMode } from './ScorecardFocusMode'

// 17. Checklist Style - Task completion format with green accents
export { default as ScorecardChecklist } from './ScorecardChecklist'

// 18. Notification Style - Alert card layout with blue-gray accents
export { default as ScorecardNotificationStyle } from './ScorecardNotificationStyle'

// 19. Story Format - Vertical story progression with pink/magenta accents
export { default as ScorecardStoryFormat } from './ScorecardStoryFormat'

// 20. Quick Glance - Ultra-minimal with monochrome accents
export { default as ScorecardQuickGlance } from './ScorecardQuickGlance'

// 21. Sample Demo - Premium mobile design with gradient hero and ring indicators
export { default as ScorecardSampleDemo } from './ScorecardSampleDemo'

// 22. Enterprise Suite - DiveMetric branded with 10 pastel themes and clickable metrics
export { default as ScorecardEnterpriseSuite } from './ScorecardEnterpriseSuite'

// 23. Editorial Magazine - Large typography, editorial spreads, asymmetric grids
export { default as ScorecardEditorialMag } from './ScorecardEditorialMag'

// 24. Dashboard Tiles - Modular tile-based with customizable grid
export { default as ScorecardDashboardTiles } from './ScorecardDashboardTiles'

// 25. Sidebar Navigation - Fixed sidebar with scrollable content panels
export { default as ScorecardSidebarNav } from './ScorecardSidebarNav'

// 26. Accordion Panels - Full-width expanding accordion sections
export { default as ScorecardAccordionPanels } from './ScorecardAccordionPanels'

// 27. Card Carousel - Horizontal scrolling card sections
export { default as ScorecardCardCarousel } from './ScorecardCardCarousel'

// 28. Split Screen - Two-column layout with fixed left summary
export { default as ScorecardSplitScreen } from './ScorecardSplitScreen'

// 29. Timeline Flow - Vertical timeline with branching metrics
export { default as ScorecardTimelineFlow } from './ScorecardTimelineFlow'

// 30. Floating Cards - Overlapping card layers with depth
export { default as ScorecardFloatingCards } from './ScorecardFloatingCards'

// 31. Tab Matrix - Grid of tabbed metric groups
export { default as ScorecardTabMatrix } from './ScorecardTabMatrix'

// 32. Minimal List - Ultra-clean list-based with expandable rows
export { default as ScorecardMinimalList } from './ScorecardMinimalList'


/**
 * DESIGN PHILOSOPHY:
 * - White backgrounds throughout for clean, printable output
 * - Subtle pastel color accents for visual hierarchy
 * - System fonts only - no external font dependencies
 * - Mobile-first designs (11-20) have 430px max-width and 44px+ touch targets
 * - Educational focus with improvement suggestions where applicable
 *
 * USAGE:
 * Each scorecard accepts a `driver` prop with metrics data.
 * If no driver prop is provided, sample data is used for demonstration.
 *
 * Example:
 * import { ScorecardQuickGlance } from './components/scorecard-samples'
 * <ScorecardQuickGlance driver={driverData} />
 */
