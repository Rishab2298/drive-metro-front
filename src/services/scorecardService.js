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
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Failed to fetch scorecard (${response.status})`);
  }

  return response.json();
};

// Save note for a driver (with optional attachment)
export const saveDriverNote = async (driverId, note, getToken, attachmentKey = null) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/scorecard/${driverId}/note`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ note: note.trim(), attachmentKey }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to save note (${response.status})`);
  }

  return response.json();
};

// Get presigned URL for uploading note attachment
export const getAttachmentUploadUrl = async (fileName, contentType, fileSize, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/s3/presign-attachment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fileName, contentType, fileSize }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to get upload URL');
  }

  return response.json();
};

// Upload file to S3 using presigned URL
export const uploadAttachmentToS3 = async (uploadUrl, file) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return true;
};

// Get presigned download URL for viewing attachment
export const getAttachmentDownloadUrl = async (key, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/s3/attachment-url?key=${encodeURIComponent(key)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to get download URL');
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

// Send SMS to single driver
export const sendDriverSms = async (driverId, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/scorecard/${driverId}/send-sms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to send SMS');
  }

  return result;
};

// Send bulk SMS
export const sendBulkSms = async (scorecardIds, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/scorecards/send-bulk-sms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ scorecardIds }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to send SMS');
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

// Poll AI feedback job status
export const getAIFeedbackJobStatus = async (jobId, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/ai-feedback/job/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // Job expired or not found
    }
    throw new Error('Failed to fetch job status');
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
