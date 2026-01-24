// Hook for managing driver selection
import { useState, useCallback, useMemo } from 'react';

export const useDriverSelection = (drivers, driverRanks) => {
  const [selectedDrivers, setSelectedDrivers] = useState(new Set());

  const handleSelectDriver = useCallback((driverId) => {
    setSelectedDrivers(prev => {
      const next = new Set(prev);
      if (next.has(driverId)) {
        next.delete(driverId);
      } else {
        next.add(driverId);
      }
      return next;
    });
  }, []);

  const handleQuickSelect = useCallback((action) => {
    if (!drivers) return;

    switch (action) {
      case 'all':
        setSelectedDrivers(new Set(drivers.map(d => d.transporterId)));
        break;
      case 'none':
        setSelectedDrivers(new Set());
        break;
      case 'top10': {
        const eligible = drivers.filter(d => driverRanks[d.transporterId]?.eligible);
        const sorted = [...eligible].sort((a, b) =>
          (driverRanks[a.transporterId]?.rank || 999) - (driverRanks[b.transporterId]?.rank || 999)
        );
        setSelectedDrivers(new Set(sorted.slice(0, 10).map(d => d.transporterId)));
        break;
      }
      case 'bottom10': {
        const eligible = drivers.filter(d => driverRanks[d.transporterId]?.eligible);
        const sorted = [...eligible].sort((a, b) =>
          (driverRanks[b.transporterId]?.rank || 999) - (driverRanks[a.transporterId]?.rank || 999)
        );
        setSelectedDrivers(new Set(sorted.slice(0, 10).map(d => d.transporterId)));
        break;
      }
      case 'ranked':
        setSelectedDrivers(new Set(
          drivers.filter(d => driverRanks[d.transporterId]?.eligible).map(d => d.transporterId)
        ));
        break;
      case 'unranked':
        setSelectedDrivers(new Set(
          drivers.filter(d => !driverRanks[d.transporterId]?.eligible).map(d => d.transporterId)
        ));
        break;
      default:
        break;
    }
  }, [drivers, driverRanks]);

  const clearSelection = useCallback(() => {
    setSelectedDrivers(new Set());
  }, []);

  const selectedDriverObjects = useMemo(() => {
    if (!drivers) return [];
    return drivers.filter(d => selectedDrivers.has(d.transporterId));
  }, [drivers, selectedDrivers]);

  return {
    selectedDrivers,
    setSelectedDrivers,
    selectedDriverObjects,
    handleSelectDriver,
    handleQuickSelect,
    clearSelection,
  };
};

export default useDriverSelection;
