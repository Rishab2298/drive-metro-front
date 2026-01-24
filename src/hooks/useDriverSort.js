// Hook for managing driver sorting and filtering
import { useState, useCallback, useMemo } from 'react';
import { TIER_ORDER, getDriverName } from '@/utils/scorecardUtils';

export const useDriverSort = (drivers, driverRanks) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const sortedDrivers = useMemo(() => {
    if (!drivers) return [];

    // Filter by search query
    let filtered = drivers;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = drivers.filter(driver => {
        const name = getDriverName(driver);
        return name.toLowerCase().includes(query);
      });
    }

    // Sort
    return [...filtered].sort((a, b) => {
      const rankInfoA = driverRanks[a.transporterId];
      const rankInfoB = driverRanks[b.transporterId];
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;

      switch (sortConfig.key) {
        case 'rank': {
          // Eligible drivers first, then sort by rank
          if (rankInfoA?.eligible && !rankInfoB?.eligible) return -1;
          if (!rankInfoA?.eligible && rankInfoB?.eligible) return 1;
          if (rankInfoA?.eligible && rankInfoB?.eligible) {
            return ((rankInfoA.rank || 999) - (rankInfoB.rank || 999)) * multiplier;
          }
          return ((rankInfoB?.score || 0) - (rankInfoA?.score || 0)) * multiplier;
        }
        case 'name': {
          const nameA = getDriverName(a).toLowerCase();
          const nameB = getDriverName(b).toLowerCase();
          return nameA.localeCompare(nameB) * multiplier;
        }
        case 'tier': {
          const tierA = a.overallStanding || a.tier || 'N/A';
          const tierB = b.overallStanding || b.tier || 'N/A';
          return ((TIER_ORDER[tierA] ?? 5) - (TIER_ORDER[tierB] ?? 5)) * multiplier;
        }
        case 'packages': {
          const pkgsA = parseInt(a.packagesDelivered) || 0;
          const pkgsB = parseInt(b.packagesDelivered) || 0;
          return (pkgsA - pkgsB) * multiplier;
        }
        default:
          return 0;
      }
    });
  }, [drivers, driverRanks, searchQuery, sortConfig]);

  return {
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    sortedDrivers,
  };
};

export default useDriverSort;
