// Hook for calculating driver rankings
import { useMemo } from 'react';
import { calculateDriverRanks } from '@/utils/scorecardUtils';

export const useDriverRanks = (drivers) => {
  const { rankMap, rankedCount } = useMemo(() => {
    if (!drivers || drivers.length === 0) {
      return { rankMap: {}, rankedCount: 0 };
    }
    return calculateDriverRanks(drivers);
  }, [drivers]);

  const totalDrivers = drivers?.length || 0;

  return {
    driverRanks: rankMap,
    rankedCount,
    totalDrivers,
  };
};

export default useDriverRanks;
