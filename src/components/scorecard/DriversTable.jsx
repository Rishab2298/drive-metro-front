// Drivers Table Component
import { Users, Search } from 'lucide-react';
import { SelectionDropdown } from './SelectionDropdown';
import { SortableHeader } from './SortableHeader';
import { DriverRow } from './DriverRow';

export const DriversTable = ({
  sortedDrivers,
  driverRanks,
  rankedCount,
  data,
  selectedDrivers,
  searchQuery,
  sortConfig,
  handleSort,
  handleSelectDriver,
  handleQuickSelect,
  setSearchQuery,
  setPreviewDriver,
  setNoteDriver,
  hasPremiumAccess,
  promptUpgrade,
  getToken,
}) => {
  const totalDrivers = data?.drivers?.length || 0;

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-5 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
        <div className="col-span-1 flex items-center gap-3">
          <SelectionDropdown
            selectedCount={selectedDrivers.size}
            totalCount={sortedDrivers.length}
            onSelect={handleQuickSelect}
          />
          <SortableHeader
            label="Rank"
            sortKey="rank"
            currentSort={sortConfig}
            onSort={handleSort}
          />
        </div>
        <div className="col-span-3">
          <SortableHeader
            label="Driver"
            sortKey="name"
            currentSort={sortConfig}
            onSort={handleSort}
          />
        </div>
        <div className="col-span-2 flex justify-center">
          <SortableHeader
            label="Tier"
            sortKey="tier"
            currentSort={sortConfig}
            onSort={handleSort}
          />
        </div>
        <div className="col-span-2 flex justify-center">
          <SortableHeader
            label="Packages"
            sortKey="packages"
            currentSort={sortConfig}
            onSort={handleSort}
          />
        </div>
        <div className="col-span-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {sortedDrivers.map((driver, index) => (
          <DriverRow
            key={driver.id || driver.transporterId || index}
            driver={driver}
            index={index}
            rankInfo={driverRanks[driver.transporterId]}
            rankedCount={rankedCount}
            data={data}
            isSelected={selectedDrivers.has(driver.transporterId)}
            onSelect={handleSelectDriver}
            onPreview={setPreviewDriver}
            onEditNote={setNoteDriver}
            hasPremiumAccess={hasPremiumAccess}
            promptUpgrade={promptUpgrade}
            getToken={getToken}
          />
        ))}
      </div>

      {/* Empty State */}
      {(!data?.drivers || data.drivers.length === 0) && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <Users className="w-8 h-8 opacity-50" />
          </div>
          <p className="font-medium">No driver data found</p>
          <p className="text-sm mt-1">This scorecard doesn't contain any driver information.</p>
        </div>
      )}

      {/* No Search Results */}
      {data?.drivers && data.drivers.length > 0 && sortedDrivers.length === 0 && searchQuery && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <Search className="w-8 h-8 opacity-50" />
          </div>
          <p className="font-medium">No drivers found</p>
          <p className="text-sm mt-1">No drivers match "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Scoring Criteria */}
      {sortedDrivers.length > 0 && (
        <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Scoring Criteria</p>
          <p className="text-xs text-muted-foreground mb-2">Drivers are scored 100 (best) to 0 using cascading priority — each level is an absolute separator before the next applies:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 text-xs text-muted-foreground">
            <span><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700 text-[10px] font-bold text-foreground/70 mr-1.5">1</span>Overall Standing Tier <span className="text-foreground/50 ml-1">(highest priority)</span></span>
            <span><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700 text-[10px] font-bold text-foreground/70 mr-1.5">2</span>Quality Group <span className="text-foreground/50 ml-1">(DCR + POD + DPMO)</span></span>
            <span><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700 text-[10px] font-bold text-foreground/70 mr-1.5">3</span>Negative Feedback Rate <span className="text-foreground/50 ml-1">(lower is better)</span></span>
            <span><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700 text-[10px] font-bold text-foreground/70 mr-1.5">4</span>Delivery Completion Rate <span className="text-foreground/50 ml-1">(higher is better)</span></span>
            <span><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700 text-[10px] font-bold text-foreground/70 mr-1.5">5</span>DVIC Rushed Inspections <span className="text-foreground/50 ml-1">(fewer is better)</span></span>
            <span><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700 text-[10px] font-bold text-foreground/70 mr-1.5">6</span>Packages Delivered <span className="text-foreground/50 ml-1">(tiebreaker)</span></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversTable;
