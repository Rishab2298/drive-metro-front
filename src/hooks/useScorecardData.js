// Hook for fetching and managing scorecard data
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { fetchMasterScorecard } from '@/services/scorecardService';

export const useScorecardData = (id) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchMasterScorecard(id, getToken);
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching master scorecard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, getToken]);

  const refreshData = async () => {
    try {
      const result = await fetchMasterScorecard(id, getToken);
      setData(result);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  return {
    loading,
    error,
    data,
    setData,
    refreshData,
    getToken,
  };
};

export default useScorecardData;
