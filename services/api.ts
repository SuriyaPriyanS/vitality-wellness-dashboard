import axios from 'axios';

const API_BASE_URL =   'https://backendserver-9fvo.onrender.com/api';



// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('token', token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

// ==================== AUTH API ====================

export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  logout: () => axiosInstance.post('/auth/logout'),
  getMe: () => axiosInstance.get('/auth/me'),
  refreshToken: (refreshToken) =>
    axiosInstance.post('/auth/refresh', { refreshToken }),
};

// ==================== USER API ====================

export const userAPI = {
  getProfile: () => axiosInstance.get('/users/profile'),
  updateProfile: (data) => axiosInstance.put('/users/profile', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axiosInstance.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getStats: () => axiosInstance.get('/users/stats'),
  deleteAccount: () => axiosInstance.delete('/users/account'),
};

// ==================== HEALTH METRICS API ====================

export const healthAPI = {
  getMetrics: (params) => axiosInstance.get('/health/metrics', { params }),
  getTodayMetrics: () => axiosInstance.get('/health/metrics/today'),
  updateSteps: (data) => axiosInstance.put('/health/metrics/steps', data),
  logWater: (amount) => axiosInstance.put('/health/metrics/water', { amount }),
  getWellnessScore: () => axiosInstance.get('/health/wellness-score'),
  getTrends: (params) => axiosInstance.get('/health/trends', { params }),
};

// ==================== NUTRITION API ====================

export const nutritionAPI = {
  getMeals: (params) => axiosInstance.get('/nutrition/meals', { params }),
  getMeal: (id) => axiosInstance.get(`/nutrition/meals/${id}`),
  logMeal: (data) => axiosInstance.post('/nutrition/meals', data),
  updateMeal: (id, data) => axiosInstance.put(`/nutrition/meals/${id}`, data),
  deleteMeal: (id) => axiosInstance.delete(`/nutrition/meals/${id}`),
  uploadMealImage: (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axiosInstance.post(`/nutrition/meals/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAnalytics: (params) => axiosInstance.get('/nutrition/analytics', { params }),
};

// ==================== ACTIVITY API ====================

export const activityAPI = {
  getActivities: (params) => axiosInstance.get('/activities', { params }),
  getActivity: (id) => axiosInstance.get(`/activities/${id}`),
  logActivity: (data) => axiosInstance.post('/activities', data),
  updateActivity: (id, data) => axiosInstance.put(`/activities/${id}`, data),
  deleteActivity: (id) => axiosInstance.delete(`/activities/${id}`),
  getStats: (params) => axiosInstance.get('/activities/stats', { params }),
};

// ==================== SLEEP API ====================

export const sleepAPI = {
  getSleepHistory: (params) => axiosInstance.get('/sleep', { params }),
  getSleep: (id) => axiosInstance.get(`/sleep/${id}`),
  logSleep: (data) => axiosInstance.post('/sleep', data),
  updateSleep: (id, data) => axiosInstance.put(`/sleep/${id}`, data),
  deleteSleep: (id) => axiosInstance.delete(`/sleep/${id}`),
  getAnalysis: (params) => axiosInstance.get('/sleep/analysis', { params }),
};

// ==================== GOALS API ====================

export const goalsAPI = {
  getGoals: (params) => axiosInstance.get('/goals', { params }),
  getGoal: (id) => axiosInstance.get(`/goals/${id}`),
  createGoal: (data) => axiosInstance.post('/goals', data),
  updateGoal: (id, data) => axiosInstance.put(`/goals/${id}`, data),
  deleteGoal: (id) => axiosInstance.delete(`/goals/${id}`),
  completeGoal: (id) => axiosInstance.post(`/goals/${id}/complete`),
  updateProgress: (id, currentValue) =>
    axiosInstance.put(`/goals/${id}/progress`, { currentValue }),
};

// ==================== ACHIEVEMENTS API ====================

export const achievementsAPI = {
  getAllAchievements: () => axiosInstance.get('/achievements'),
  getUserAchievements: () => axiosInstance.get('/achievements/user'),
  getProgress: (id) => axiosInstance.get(`/achievements/${id}/progress`),
};

// ==================== DASHBOARD API ====================

export const dashboardAPI = {
  getDashboard: () => axiosInstance.get('/dashboard'),
  getDailySummary: (date) =>
    axiosInstance.get('/dashboard/summary', { params: { date } }),
  getInsights: () => axiosInstance.get('/dashboard/insights'),
};

// Export axios instance for custom requests
export default axiosInstance;
