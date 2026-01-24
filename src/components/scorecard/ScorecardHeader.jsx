// Scorecard Header Component with summary cards
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Package, Trophy } from 'lucide-react';
import { formatDateRange } from '@/utils/scorecardUtils';

export const ScorecardHeader = ({ data, rankedCount }) => {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/view-scorecards"
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-500" />
          </Link>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              {data?.dsp?.companyName || data?.dsp?.dspCode}
            </p>
            <h1 className="text-2xl font-bold text-foreground">
              Week {data?.weekNumber}, {data?.year}
            </h1>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-muted-foreground">Week</span>
            </div>
            <p className="text-lg font-semibold">
              {data?.weekStart && data?.weekEnd && formatDateRange(data.weekStart, data.weekEnd)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-muted-foreground">Drivers</span>
            </div>
            <p className="text-lg font-semibold">{data?.totalDrivers || 0}</p>
            <p className="text-sm text-muted-foreground">{rankedCount} ranked</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-muted-foreground">Packages</span>
            </div>
            <p className="text-lg font-semibold">{data?.totalPackages?.toLocaleString() || 0}</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm text-muted-foreground">Standing</span>
            </div>
            <p className="text-lg font-semibold">{data?.averageStanding || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorecardHeader;
