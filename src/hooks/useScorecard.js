import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

// Hook to fetch all master scorecards
export const useMasterScorecards = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['masterScorecards'],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/master-scorecards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch scorecards');
      return response.json();
    },
  });
};

// Hook to fetch single master scorecard with drivers
export const useMasterScorecard = (id) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['masterScorecard', id],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/master-scorecard/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 404) throw new Error('Scorecard not found');
        throw new Error('Failed to fetch scorecard');
      }
      return response.json();
    },
    enabled: !!id, // Only fetch if id exists
  });
};

// Hook to fetch drivers list
export const useDrivers = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/drivers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch drivers');
      return response.json();
    },
  });
};

// Hook to save driver note (mutation)
export const useSaveDriverNote = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ driverId, note }) => {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/scorecard/${driverId}/note`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note: note.trim() }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save note');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate scorecard queries to refetch with updated note
      queryClient.invalidateQueries({ queryKey: ['masterScorecard'] });
    },
  });
};

// Hook to delete driver note (mutation)
export const useDeleteDriverNote = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (driverId) => {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/scorecard/${driverId}/note`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterScorecard'] });
    },
  });
};

// Hook to send driver email (mutation)
export const useSendDriverEmail = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (driverId) => {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/scorecard/${driverId}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to send email');
      return result;
    },
  });
};

// Hook to generate AI feedback (mutation)
export const useGenerateAIFeedback = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ scorecardIds, masterScorecardId }) => {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/generate-ai-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scorecardIds, masterScorecardId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate AI feedback');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterScorecard'] });
    },
  });
};
