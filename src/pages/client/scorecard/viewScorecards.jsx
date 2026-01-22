import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Loader2,
  FileStack,
  Users,
  Package,
  Calendar,
  ChevronRight,
  Plus,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const ViewScorecards = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchMasterScorecards = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/master-scorecards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch scorecards');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching master scorecards:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterScorecards();
  }, [getToken]);

  // Format date range
  const formatDateRange = (weekStart, weekEnd) => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    const options = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  // Format week display
  const formatWeek = (weekNumber, year) => {
    return `Week ${weekNumber}, ${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          <p className="text-sm text-muted-foreground">Loading scorecards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 text-xl">!</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Unable to load scorecards</h2>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-2">
                {dsp?.companyName || dsp?.dspCode}
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Weekly Scorecards
              </h1>
              <p className="text-muted-foreground max-w-md">
                View and manage driver performance scorecards for each week.
              </p>
            </div>

            {/* Upload Button */}
            <Link
              to="/upload-scorecard"
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors',
                'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
                'hover:bg-neutral-800 dark:hover:bg-neutral-100'
              )}
            >
              <Plus className="w-4 h-4" />
              Upload New Week
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Summary Stats */}
        {masterScorecards && masterScorecards.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <span className="text-xs text-muted-foreground">Total Weeks</span>
              </div>
              <p className="text-2xl font-bold">{masterScorecards.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-neutral-500" />
                <span className="text-xs text-muted-foreground">Latest Week Drivers</span>
              </div>
              <p className="text-2xl font-bold">{masterScorecards[0]?.totalDrivers || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-neutral-500" />
                <span className="text-xs text-muted-foreground">Latest Week Packages</span>
              </div>
              <p className="text-2xl font-bold">{masterScorecards[0]?.totalPackages?.toLocaleString() || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-neutral-500" />
                <span className="text-xs text-muted-foreground">Latest Standing</span>
              </div>
              <p className="text-2xl font-bold">{masterScorecards[0]?.averageStanding || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Scorecards List */}
        {masterScorecards && masterScorecards.length > 0 ? (
          <div className="space-y-3">
            {masterScorecards.map((scorecard, index) => (
              <div
                key={scorecard.id}
                onClick={() => navigate(`/master-scorecard/${scorecard.id}`)}
                className={cn(
                  'flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all',
                  'border-neutral-200 dark:border-neutral-800',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-700',
                  index === 0 && 'ring-2 ring-neutral-900 dark:ring-white ring-offset-2 dark:ring-offset-neutral-950'
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Week Badge */}
                  <div className={cn(
                    'w-14 h-14 rounded-xl flex flex-col items-center justify-center',
                    index === 0
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  )}>
                    <span className="text-xs font-medium opacity-70">W{scorecard.weekNumber}</span>
                    <span className="text-lg font-bold">{scorecard.year}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">
                        {formatWeek(scorecard.weekNumber, scorecard.year)}
                      </h3>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {formatDateRange(scorecard.weekStart, scorecard.weekEnd)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 text-right">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{scorecard.totalDrivers}</p>
                      <p className="text-xs text-muted-foreground">Drivers</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{scorecard.totalPackages.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Packages</p>
                    </div>
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      STANDING_COLORS[scorecard.averageStanding] || STANDING_COLORS['N/A']
                    )}>
                      {scorecard.averageStanding}
                    </span>
                  </div>

                  {/* Mobile Stats */}
                  <div className="flex md:hidden items-center gap-2">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      STANDING_COLORS[scorecard.averageStanding] || STANDING_COLORS['N/A']
                    )}>
                      {scorecard.averageStanding}
                    </span>
                  </div>

                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <FileStack className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No scorecards yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Upload your first weekly scorecard to start tracking driver performance.
            </p>
            <Link
              to="/upload-scorecard"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors',
                'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
                'hover:bg-neutral-800 dark:hover:bg-neutral-100'
              )}
            >
              <Plus className="w-4 h-4" />
              Upload First Scorecard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewScorecards;
