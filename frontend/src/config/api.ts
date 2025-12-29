// API Configuration
const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV;
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Determine API URL with fallback logic
export const API_BASE_URL = (() => {
  // First try environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Always use production API as fallback (no localhost)
  return 'https://carrerpath-m48v.onrender.com';
})();

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Google Pay Configuration
export const GOOGLE_PAY_NUMBER = import.meta.env.VITE_GOOGLE_PAY_NUMBER || '9876543210';
export const GOOGLE_PAY_UPI_ID = import.meta.env.VITE_GOOGLE_PAY_UPI_ID || 'merchant@paytm';

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
  COURSE_ACCESS: (id: string) => `/api/courses/${id}/access`,
  
  // Videos (Secure)
  VIDEO_ACCESS: (videoId: string) => `/api/videos/${videoId}/access`,
  COURSE_VIDEOS: (courseId: string) => `/api/videos/course/${courseId}`,

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

  // Manual Google Pay Payments
  CREATE_ORDER: '/api/payments/create-order',
  UPLOAD_SCREENSHOT: (orderId: string) => `/api/payments/upload-screenshot/${orderId}`,
  MY_ORDERS: '/api/payments/my-orders',
  ADMIN_PENDING_PAYMENTS: '/api/payments/admin/pending',
  ADMIN_ALL_PAYMENTS: '/api/payments/admin/all',
  ADMIN_APPROVE_PAYMENT: (orderId: string) => `/api/payments/admin/approve/${orderId}`,
  ADMIN_REJECT_PAYMENT: (orderId: string) => `/api/payments/admin/reject/${orderId}`,

  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_USER_STATUS: (id: string) => `/api/admin/users/${id}/status`,

  // Contact
  CONTACT_SEND: '/api/contact/send-message',

  // Student Dashboard
  STUDENT_COURSES: '/api/student/courses',
  STUDENT_TESTSERIES: '/api/student/testseries',
  STUDENT_EBOOKS: '/api/student/ebooks',
  STUDENT_STUDYMATERIALS: '/api/student/studymaterials',
  STUDENT_RESULTS: '/api/student/results',
  STUDENT_PAYMENTS: '/api/student/payments',
  STUDENT_STATS: '/api/student/stats',
  STUDENT_PROGRESS: (courseId: string) => `/api/student/progress/${courseId}`,

  // Notices
  NOTICES: '/api/notices',
  NOTICES_ADMIN: '/api/notices/admin/all',
  NOTICES_STATS: '/api/notices/admin/stats',
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
    // Try to get token from userInfo first (AuthContext format)
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Error parsing userInfo:', e);
      }
    }
    
    // Fallback to direct token storage
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
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
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;