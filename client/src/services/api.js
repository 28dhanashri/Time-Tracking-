import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Activity APIs
export const fetchActivities = async () => {
  const response = await api.get('/activities');
  return response.data;
};

export const fetchActivityById = async (id) => {
  const response = await api.get(`/activities/${id}`);
  return response.data;
};

export const createActivity = async (activityData) => {
  const response = await api.post('/activities', activityData);
  return response.data;
};

export const updateActivity = async (id, activityData) => {
  const response = await api.put(`/activities/${id}`, activityData);
  return response.data;
};

export const deleteActivity = async (id) => {
  const response = await api.delete(`/activities/${id}`);
  return response.data;
};

// Session & Timer APIs
export const startTimer = async (activityId) => {
  const response = await api.post('/sessions/start', { activityId });
  return response.data;
};

export const stopTimer = async (sessionId = null, activityId = null) => {
  const response = await api.post('/sessions/stop', { sessionId, activityId });
  return response.data;
};

export const fetchActiveSession = async () => {
  const response = await api.get('/sessions/active');
  return response.data;
};

export const fetchSessions = async (params = {}) => {
  const response = await api.get('/sessions', { params });
  return response.data;
};

export const deleteSession = async (id) => {
  const response = await api.delete(`/sessions/${id}`);
  return response.data;
};

// Report & Analytics APIs
export const fetchSummaryReport = async () => {
  const response = await api.get('/reports/summary');
  return response.data;
};

export const fetchCategoryReport = async () => {
  const response = await api.get('/reports/category');
  return response.data;
};

export const fetchDailyReport = async (days = 7) => {
  const response = await api.get('/reports/daily', { params: { days } });
  return response.data;
};

export default api;
