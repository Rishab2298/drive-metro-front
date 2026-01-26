import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Upload,
  FileStack,
  ChevronRight,
  Shield,
  Star,
  AlertTriangle,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

// Standing badge colors
const STANDING_COLORS = {
  Platinum: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  Gold: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Silver: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  Bronze: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Poor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'N/A': 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
};

// Chart colors for tiers
const TIER_CHART_COLORS = {
  Platinum: '#8B5CF6',
  Gold: '#F59E0B',
  Silver: '#94A3B8',
  Bronze: '#F97316',
  Poor: '#EF4444',
  'N/A': '#9CA3AF',
};

// Tier order for sorting
const TIER_ORDER = { Platinum: 0, Gold: 1, Silver: 2, Bronze: 3, Poor: 4, 'N/A': 5 };

export default function ClientDashboard() {
  const { getToken } = useAuth();
  const { hasPremiumAccess, isTrialing, trialDaysRemaining } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [latestScorecardData, setLatestScorecardData] = useState(null);

  // Fetch master scorecards
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();

        // Fetch master scorecards list
        const response = await fetch(`${API_URL}/api/master-scorecards`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch scorecards');
        }

        const result = await response.json();
        setData(result);

        // Fetch latest scorecard details if available
        if (result.masterScorecards && result.masterScorecards.length > 0) {
          const latestId = result.masterScorecards[0].id;
          const detailResponse = await fetch(`${API_URL}/api/master-scorecard/${latestId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (detailResponse.ok) {
            const detailResult = await detailResponse.json();
            setLatestScorecardData(detailResult);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  // Calculate metrics and analytics
  const analytics = useMemo(() => {
    if (!data?.masterScorecards || data.masterScorecards.length === 0) {
      return null;
    }

    const scorecards = data.masterScorecards;
    const latest = scorecards[0];
    const previous = scorecards[1] || null;

    // Week-over-week comparison
    const weeklyComparison = {
      drivers: {
        current: latest.totalDrivers,
        previous: previous?.totalDrivers || 0,
        change: previous ? latest.totalDrivers - previous.totalDrivers : 0,
      },
      packages: {
        current: latest.totalPackages,
        previous: previous?.totalPackages || 0,
        change: previous ? latest.totalPackages - previous.totalPackages : 0,
        percentChange: previous && previous.totalPackages > 0
          ? ((latest.totalPackages - previous.totalPackages) / previous.totalPackages * 100).toFixed(1)
          : 0,
      },
      standing: {
        current: latest.averageStanding,
        previous: previous?.averageStanding || null,
        improved: previous ? TIER_ORDER[latest.averageStanding] < TIER_ORDER[previous.averageStanding] : false,
        declined: previous ? TIER_ORDER[latest.averageStanding] > TIER_ORDER[previous.averageStanding] : false,
      },
    };

    // Trend data for charts (last 8 weeks, reversed for chronological order)
    const trendData = scorecards.slice(0, 8).reverse().map(sc => ({
      week: `W${sc.weekNumber}`,
      weekLabel: `Week ${sc.weekNumber}, ${sc.year}`,
      drivers: sc.totalDrivers,
      packages: sc.totalPackages,
      standing: sc.averageStanding,
      standingScore: 5 - (TIER_ORDER[sc.averageStanding] || 5), // Convert to numeric score (higher = better)
    }));

    // Monthly analysis (last 4 weeks)
    const monthlyData = scorecards.slice(0, 4);
    const hasMonthlyData = monthlyData.length >= 4;
    const monthlyAnalysis = hasMonthlyData ? {
      totalPackages: monthlyData.reduce((sum, sc) => sum + sc.totalPackages, 0),
      avgDrivers: Math.round(monthlyData.reduce((sum, sc) => sum + sc.totalDrivers, 0) / monthlyData.length),
      avgPackagesPerWeek: Math.round(monthlyData.reduce((sum, sc) => sum + sc.totalPackages, 0) / monthlyData.length),
      standingDistribution: monthlyData.reduce((acc, sc) => {
        acc[sc.averageStanding] = (acc[sc.averageStanding] || 0) + 1;
        return acc;
      }, {}),
    } : null;

    return {
      latest,
      previous,
      weeklyComparison,
      trendData,
      monthlyAnalysis,
      hasMonthlyData,
      totalWeeks: scorecards.length,
    };
  }, [data]);

  // Calculate driver tier distribution from latest scorecard
  const tierDistribution = useMemo(() => {
    if (!latestScorecardData?.drivers) return [];

    const distribution = latestScorecardData.drivers.reduce((acc, driver) => {
      const tier = driver.overallStanding || driver.tier || 'N/A';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution)
      .map(([tier, count]) => ({
        tier,
        count,
        percentage: ((count / latestScorecardData.drivers.length) * 100).toFixed(1),
        color: TIER_CHART_COLORS[tier] || TIER_CHART_COLORS['N/A'],
      }))
      .sort((a, b) => (TIER_ORDER[a.tier] || 5) - (TIER_ORDER[b.tier] || 5));
  }, [latestScorecardData]);

  // Top performers and drivers needing attention
  const driverHighlights = useMemo(() => {
    if (!latestScorecardData?.drivers || latestScorecardData.drivers.length === 0) {
      return { topPerformers: [], needsAttention: [] };
    }

    const drivers = [...latestScorecardData.drivers];

    // Sort by tier (best first), then by packages delivered
    const sortedByPerformance = drivers.sort((a, b) => {
      const tierA = TIER_ORDER[a.overallStanding || a.tier] ?? 5;
      const tierB = TIER_ORDER[b.overallStanding || b.tier] ?? 5;
      if (tierA !== tierB) return tierA - tierB;
      return (parseInt(b.packagesDelivered) || 0) - (parseInt(a.packagesDelivered) || 0);
    });

    // Top 3 performers (Platinum or Gold)
    const topPerformers = sortedByPerformance
      .filter(d => ['Platinum', 'Gold'].includes(d.overallStanding || d.tier))
      .slice(0, 3);

    // Drivers needing attention (Poor or Bronze)
    const needsAttention = sortedByPerformance
      .filter(d => ['Poor', 'Bronze'].includes(d.overallStanding || d.tier))
      .slice(0, 3);

    return { topPerformers, needsAttention };
  }, [latestScorecardData]);

  // Format date range
  const formatDateRange = (weekStart, weekEnd) => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    const options = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  // Get driver name
  const getDriverName = (driver) => {
    return driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ') || 'Unknown';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 text-xl">!</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Unable to load dashboard</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { dsp, masterScorecards } = data || {};
  const hasData = !loading && masterScorecards && masterScorecards.length > 0;

  // Empty state - no scorecards (only show after loading completes)
  if (!loading && !hasData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Welcome Header */}
          <div className="mb-12">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-2">
              Welcome back
            </p>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {dsp?.companyName || dsp?.dspCode || 'Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              Get started by uploading your first weekly scorecard.
            </p>
          </div>

          {/* Empty State Card */}
          <div className="text-center py-16 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl bg-neutral-50/50 dark:bg-neutral-800/20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <FileStack className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No scorecards yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Upload your weekly scorecard files to start tracking driver performance and see insights here.
            </p>
            <Link
              to="/upload-scorecard"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors',
                'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
                'hover:bg-neutral-800 dark:hover:bg-neutral-100'
              )}
            >
              <Upload className="w-4 h-4" />
              Upload First Scorecard
            </Link>
          </div>

          {/* Quick Start Guide */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-foreground mb-1">Upload Scorecards</h4>
              <p className="text-sm text-muted-foreground">
                Download your weekly performance files from Amazon and upload them here.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                <span className="text-green-600 dark:text-green-400 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-foreground mb-1">Review & Rank</h4>
              <p className="text-sm text-muted-foreground">
                We automatically process and rank your drivers based on performance metrics.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-foreground mb-1">Share & Coach</h4>
              <p className="text-sm text-muted-foreground">
                Send personalized scorecards to drivers via email or SMS with coaching tips.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard with data
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-1">
              Welcome back
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {loading ? <Skeleton className="w-48 h-8 inline-block" /> : (dsp?.companyName || dsp?.dspCode || 'Dashboard')}
            </h1>
            {loading ? (
              <Skeleton className="w-64 h-4 mt-2" />
            ) : analytics?.latest && (
              <p className="text-muted-foreground mt-1">
                Latest: Week {analytics.latest.weekNumber}, {analytics.latest.year}
                <span className="mx-2">•</span>
                {formatDateRange(analytics.latest.weekStart, analytics.latest.weekEnd)}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              to="/view-scorecards"
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors',
                'border border-neutral-200 dark:border-neutral-700',
                'hover:bg-neutral-50 dark:hover:bg-neutral-800'
              )}
            >
              <FileStack className="w-4 h-4" />
              View All
            </Link>
            <Link
              to="/upload-scorecard"
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors',
                'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
                'hover:bg-neutral-800 dark:hover:bg-neutral-100'
              )}
            >
              <Upload className="w-4 h-4" />
              Upload
            </Link>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Drivers */}
          <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              {!loading && analytics?.weeklyComparison?.drivers?.change !== 0 && (
                <div className={cn(
                  'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                  analytics.weeklyComparison.drivers.change > 0
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                )}>
                  {analytics.weeklyComparison.drivers.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(analytics.weeklyComparison.drivers.change)}
                </div>
              )}
            </div>
            {loading ? (
              <Skeleton className="w-16 h-8 mb-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{analytics?.weeklyComparison?.drivers?.current || 0}</p>
            )}
            <p className="text-sm text-muted-foreground">Active Drivers</p>
          </div>

          {/* Total Packages */}
          <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              {!loading && analytics?.weeklyComparison?.packages?.percentChange != 0 && (
                <div className={cn(
                  'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                  analytics.weeklyComparison.packages.change > 0
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                )}>
                  {analytics.weeklyComparison.packages.change > 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(analytics.weeklyComparison.packages.percentChange)}%
                </div>
              )}
            </div>
            {loading ? (
              <Skeleton className="w-20 h-8 mb-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground">
                {(analytics?.weeklyComparison?.packages?.current || 0).toLocaleString()}
              </p>
            )}
            <p className="text-sm text-muted-foreground">Packages Delivered</p>
          </div>

          {/* Average Standing */}
          <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              {!loading && analytics?.weeklyComparison?.standing?.previous && (
                <div className={cn(
                  'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                  analytics.weeklyComparison.standing.improved
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : analytics.weeklyComparison.standing.declined
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400'
                )}>
                  {analytics.weeklyComparison.standing.improved ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : analytics.weeklyComparison.standing.declined ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  {analytics.weeklyComparison.standing.improved ? 'Up' : analytics.weeklyComparison.standing.declined ? 'Down' : 'Same'}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {loading ? (
                <Skeleton className="w-20 h-7 rounded-full" />
              ) : (
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-semibold',
                  STANDING_COLORS[analytics?.weeklyComparison?.standing?.current] || STANDING_COLORS['N/A']
                )}>
                  {analytics?.weeklyComparison?.standing?.current || 'N/A'}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Average Standing</p>
          </div>

          {/* Weeks Tracked */}
          <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            {loading ? (
              <Skeleton className="w-12 h-8 mb-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{analytics?.totalWeeks || 0}</p>
            )}
            <p className="text-sm text-muted-foreground">Weeks Tracked</p>
          </div>
        </div>

        {/* Two Column Layout for Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Trend Chart */}
          {loading ? (
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Weekly Package Volume</h3>
                  <p className="text-sm text-muted-foreground">Loading data...</p>
                </div>
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="flex-1 rounded-t" style={{ height: `${30 + Math.random() * 60}%` }} />
                ))}
              </div>
            </div>
          ) : analytics?.trendData && analytics.trendData.length > 1 && (
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Weekly Package Volume</h3>
                  <p className="text-sm text-muted-foreground">Last {analytics.trendData.length} weeks</p>
                </div>
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="h-48">
                <ChartContainer
                  config={{
                    packages: { label: 'Packages', color: '#8B5CF6' },
                  }}
                  className="h-full w-full"
                >
                  <AreaChart data={analytics.trendData}>
                    <defs>
                      <linearGradient id="packageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="week"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      className="text-muted-foreground"
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      labelFormatter={(value) => analytics.trendData.find(d => d.week === value)?.weekLabel || value}
                    />
                    <Area
                      type="monotone"
                      dataKey="packages"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fill="url(#packageGradient)"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </div>
          )}

          {/* Tier Distribution */}
          {loading ? (
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Driver Standings</h3>
                  <p className="text-sm text-muted-foreground">Loading distribution...</p>
                </div>
                <Target className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-20 h-6 rounded" />
                    <Skeleton className="flex-1 h-2 rounded-full" />
                    <Skeleton className="w-8 h-4" />
                    <Skeleton className="w-10 h-4" />
                  </div>
                ))}
              </div>
            </div>
          ) : tierDistribution.length > 0 && (
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Driver Standings</h3>
                  <p className="text-sm text-muted-foreground">This week&apos;s distribution</p>
                </div>
                <Target className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {tierDistribution.map((tier) => (
                  <div key={tier.tier} className="flex items-center gap-3">
                    <span className={cn(
                      'w-20 px-2 py-1 rounded text-xs font-medium text-center',
                      STANDING_COLORS[tier.tier]
                    )}>
                      {tier.tier}
                    </span>
                    <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${tier.percentage}%`,
                          backgroundColor: tier.color,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-12 text-right">
                      {tier.count}
                    </span>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {tier.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly Analysis (if 4+ weeks) */}
        {analytics?.hasMonthlyData && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Monthly Overview</h2>
              <span className="text-sm text-muted-foreground">(Last 4 weeks)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <p className="text-sm text-muted-foreground mb-1">Total Packages</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics.monthlyAnalysis.totalPackages.toLocaleString()}
                </p>
              </div>
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <p className="text-sm text-muted-foreground mb-1">Avg Packages/Week</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics.monthlyAnalysis.avgPackagesPerWeek.toLocaleString()}
                </p>
              </div>
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <p className="text-sm text-muted-foreground mb-1">Avg Drivers/Week</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics.monthlyAnalysis.avgDrivers}
                </p>
              </div>
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <p className="text-sm text-muted-foreground mb-1">Most Common Standing</p>
                <span className={cn(
                  'inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1',
                  STANDING_COLORS[Object.entries(analytics.monthlyAnalysis.standingDistribution)
                    .sort((a, b) => b[1] - a[1])[0]?.[0]] || STANDING_COLORS['N/A']
                )}>
                  {Object.entries(analytics.monthlyAnalysis.standingDistribution)
                    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Driver Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Performers */}
          {loading ? (
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-foreground">Top Performers Based on Packages Delivered</h3>
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div>
                        <Skeleton className="w-28 h-4 mb-1" />
                        <Skeleton className="w-20 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-16 h-6 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : driverHighlights.topPerformers.length > 0 && (
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-foreground">Top Performers Based on Packages Delivered</h3>
              </div>
              <div className="space-y-3">
                {driverHighlights.topPerformers.map((driver, index) => (
                  <div
                    key={driver.id || index}
                    className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                        index === 0
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                      )}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{getDriverName(driver)}</p>
                        <p className="text-xs text-muted-foreground">
                          {parseInt(driver.packagesDelivered || 0).toLocaleString()} packages
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      STANDING_COLORS[driver.overallStanding || driver.tier]
                    )}>
                      {driver.overallStanding || driver.tier}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Needs Attention */}
          {loading ? (
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-foreground">Needs Attention</h3>
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div>
                        <Skeleton className="w-28 h-4 mb-1" />
                        <Skeleton className="w-20 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-16 h-6 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : driverHighlights.needsAttention.length > 0 && (
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-foreground">Needs Attention</h3>
              </div>
              <div className="space-y-3">
                {driverHighlights.needsAttention.map((driver, index) => (
                  <div
                    key={driver.id || index}
                    className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{getDriverName(driver)}</p>
                        <p className="text-xs text-muted-foreground">
                          {parseInt(driver.packagesDelivered || 0).toLocaleString()} packages
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      STANDING_COLORS[driver.overallStanding || driver.tier]
                    )}>
                      {driver.overallStanding || driver.tier}
                    </span>
                  </div>
                ))}
              </div>
              {hasPremiumAccess && (
                <Link
                  to={`/master-scorecard/${analytics?.latest?.id}`}
                  className="flex items-center justify-center gap-2 mt-4 p-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  View full scorecard to add coaching notes
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Recent Scorecards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Weeks</h2>
            <Link
              to="/view-scorecards"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div>
                      <Skeleton className="w-32 h-5 mb-1" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <Skeleton className="w-20 h-4 mb-1" />
                      <Skeleton className="w-24 h-3" />
                    </div>
                    <Skeleton className="w-16 h-6 rounded-full" />
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
              ))
            ) : masterScorecards?.slice(0, 3).map((scorecard, index) => (
              <Link
                key={scorecard.id}
                to={`/master-scorecard/${scorecard.id}`}
                className={cn(
                  'flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all',
                  'border-neutral-200 dark:border-neutral-800',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-700',
                  index === 0 && 'ring-1 ring-neutral-300 dark:ring-neutral-600'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex flex-col items-center justify-center',
                    index === 0
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  )}>
                    <span className="text-xs font-medium opacity-70">W{scorecard.weekNumber}</span>
                    <span className="text-sm font-bold">{scorecard.year}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">
                        Week {scorecard.weekNumber}, {scorecard.year}
                      </h3>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDateRange(scorecard.weekStart, scorecard.weekEnd)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-foreground">{scorecard.totalDrivers} drivers</p>
                    <p className="text-xs text-muted-foreground">{scorecard.totalPackages.toLocaleString()} packages</p>
                  </div>
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    STANDING_COLORS[scorecard.averageStanding] || STANDING_COLORS['N/A']
                  )}>
                    {scorecard.averageStanding}
                  </span>
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions - always visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/upload-scorecard"
            className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Upload Scorecard</h4>
                <p className="text-sm text-muted-foreground">Add a new weekly report</p>
              </div>
            </div>
          </Link>

          <Link
            to="/manage-drivers"
            className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Manage Drivers</h4>
                <p className="text-sm text-muted-foreground">Update driver contacts</p>
              </div>
            </div>
          </Link>

          <Link
            to="/settings"
            className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Settings</h4>
                <p className="text-sm text-muted-foreground">Company preferences</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
