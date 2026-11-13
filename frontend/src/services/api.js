const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchFarmerProfile() {
  const res = await fetch(`${API_BASE}/farmer`);
  if (!res.ok) throw new Error('Failed to load farmer profile');
  return res.json();
}

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to load dashboard stats');
  return res.json();
}

export async function fetchNotifications() {
  const res = await fetch(`${API_BASE}/notifications`);
  if (!res.ok) throw new Error('Failed to load notifications');
  return res.json();
}

export async function markNotificationAsRead(id) {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
  return res.json();
}

export async function analyzeCrop({ cropType, location, symptomsDescription, file }) {
  const formData = new FormData();
  formData.append('crop_type', cropType);
  formData.append('location', location);
  formData.append('symptoms_description', symptomsDescription || '');
  if (file) {
    formData.append('file', file);
  }

  const res = await fetch(`${API_BASE}/analyze-crop`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to analyze crop');
  }

  return res.json();
}

export async function fetchAnalyses() {
  const res = await fetch(`${API_BASE}/analyses`);
  if (!res.ok) throw new Error('Failed to fetch analyses');
  return res.json();
}

export async function fetchAnalysisById(id) {
  const res = await fetch(`${API_BASE}/analyses/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch analysis #${id}`);
  return res.json();
}

export async function fetchWeather(location = 'Bengaluru') {
  const res = await fetch(`${API_BASE}/weather?location=${encodeURIComponent(location)}`);
  if (!res.ok) throw new Error('Failed to fetch weather');
  return res.json();
}

export async function fetchActions({ status, category, priority } = {}) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (category) params.append('category', category);
  if (priority) params.append('priority', priority);

  const res = await fetch(`${API_BASE}/actions?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch farm actions');
  return res.json();
}

export async function createAction(actionData) {
  const res = await fetch(`${API_BASE}/actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actionData),
  });
  if (!res.ok) throw new Error('Failed to create action');
  return res.json();
}

export async function updateAction(id, updateData) {
  const res = await fetch(`${API_BASE}/actions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error('Failed to update action');
  return res.json();
}

export async function deleteAction(id) {
  const res = await fetch(`${API_BASE}/actions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete action');
  return res.json();
}

export async function sendAssistantChat(message, language = 'en') {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language }),
  });
  if (!res.ok) throw new Error('Assistant failed to respond');
  return res.json();
}
