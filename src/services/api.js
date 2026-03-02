import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('lastLogin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

// Permits API
export const permitsAPI = {
  // Get all permits (with optional filters)
  getAll: (filters = {}) => api.get('/permits', { params: filters }),
  
  // Get permit by ID
  getById: (id) => api.get(`/permits/${id}`),
  
  // Create new permit
  create: (permitData) => api.post('/permits', permitData),
  
  // Update permit
  update: (id, permitData) => api.put(`/permits/${id}`, permitData),
  
  // Delete permit
  delete: (id) => api.delete(`/permits/${id}`),
  
  // Workflow actions
  submitForReview: (id) => api.post(`/permits/${id}/submit`),
  verifyChecklist: (id, checklistData) => api.post(`/permits/${id}/verify-checklist`, checklistData),
  completeInspection: (id, inspectionData) => api.post(`/permits/${id}/complete-inspection`, inspectionData),
  approvePermit: (id, approvalData) => api.post(`/permits/${id}/approve`, approvalData),
  startWork: (id) => api.post(`/permits/${id}/start-work`),
  completeWork: (id, completionData) => api.post(`/permits/${id}/complete-work`, completionData),
  closePermit: (id, closureData) => api.post(`/permits/${id}/close`, closureData),
  
  // Analytics
  getAnalytics: () => api.get('/permits/analytics'),
  getReports: (filters) => api.get('/permits/reports', { params: filters }),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Work Areas API
export const workAreasAPI = {
  getAll: () => api.get('/work-areas'),
  getChecklists: (workAreaId) => api.get(`/work-areas/${workAreaId}/checklists`),
  getSafetyRequirements: (workAreaId) => api.get(`/work-areas/${workAreaId}/safety-requirements`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
  getPendingTasks: () => api.get('/dashboard/pending-tasks'),
};

// Reports API
export const reportsAPI = {
  generatePermitReport: (permitId) => api.get(`/reports/permits/${permitId}`),
  generateAnalyticsReport: (filters) => api.get('/reports/analytics', { params: filters }),
  generateComplianceReport: (filters) => api.get('/reports/compliance', { params: filters }),
};

export default api;