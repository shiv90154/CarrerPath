// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/users/login',
  REGISTER: '/api/users/register',
  SEND_OTP: '/api/users/send-otp',
  VERIFY_OTP: '/api/users/verify-otp',
  RESEND_OTP: '/api/users/resend-otp',
  CHANGE_PASSWORD: '/api/users/change-password',
  PROFILE: '/api/users/profile',

  // Courses
  COURSES: '/api/courses',
  COURSE_DETAIL: (id: string) => `/api/courses/${id}`,
  COURSE_VIDEO: (courseId: string, videoId: string) => `/api/courses/${courseId}/videos/${videoId}`,

  // Test Series
  TEST_SERIES: '/api/testseries',
  TEST_SERIES_DETAIL: (id: string) => `/api/testseries/${id}`,
  TEST_SERIES_ADMIN: '/api/testseries/admin',

  // Ebooks
  EBOOKS: '/api/ebooks',
  EBOOK_DETAIL: (id: string) => `/api/ebooks/${id}`,

  // Study Materials
  STUDY_MATERIALS: '/api/studymaterials',
  STUDY_MATERIAL_DETAIL: (id: string) => `/api/studymaterials/${id}`,

  // Current Affairs
  CURRENT_AFFAIRS: '/api/current-affairs',
  CURRENT_AFFAIRS_ADMIN: '/api/current-affairs/admin/all',
  CURRENT_AFFAIRS_STATS: '/api/current-affairs/stats/summary',

  // Payments
  PAYMENT_ORDERS: '/api/payments/orders',
  PAYMENT_VERIFY: '/api/payments/verify',
  MY_ORDERS: '/api/payments/myorders',

  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_USER_STATUS: (id: string) => `/api/admin/users/${id}/status`,

  // Contact
  CONTACT_SEND: '/api/contact/send-message',

  // Notices
  NOTICES: '/api/notices',
  NOTICES_ADMIN: '/api/notices/admin/all',
  NOTICES_STATS: '/api/notices/admin/stats',
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Axios instance with base configuration
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;