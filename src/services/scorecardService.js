// Scorecard API service functions
import { API_URL } from '@/utils/scorecardUtils';

// Fetch master scorecard by ID
export const fetchMasterScorecard = async (id, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/master-scorecard/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Scorecard not found');
    }
    throw new Error('Failed to fetch scorecard');
  }

  return response.json();
};

// Save note for a driver
export const saveDriverNote = async (driverId, note, getToken) => {
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
    throw new Error(errorData.error || `Failed to save note (${response.status})`);
  }

  return response.json();
};

// Delete note for a driver
export const deleteDriverNote = async (driverId, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/scorecard/${driverId}/note`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete note');
  }

  return response.json();
};

// Send email to single driver
export const sendDriverEmail = async (driverId, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/scorecard/${driverId}/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to send email');
  }

  return result;
};

// Send bulk emails
export const sendBulkEmails = async (scorecardIds, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/scorecards/send-bulk-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ scorecardIds }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to send emails');
  }

  return result;
};

// Generate AI feedback for drivers
export const generateAIFeedback = async (scorecardIds, masterScorecardId, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/generate-ai-feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      scorecardIds,
      masterScorecardId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate AI feedback');
  }

  return response.json();
};

// Save bulk notes to drivers
export const saveBulkNotes = async (drivers, note, getToken) => {
  const token = await getToken();
  const promises = drivers.map(driver =>
    fetch(`${API_URL}/api/scorecard/${driver.id}/note`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ note: note.trim() }),
    })
  );

  return Promise.all(promises);
};
