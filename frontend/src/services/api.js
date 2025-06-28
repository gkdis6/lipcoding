import axios from 'axios';

// API 기본 URL
const API_BASE_URL = 'http://localhost:8080/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: JWT 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'Present' : 'Missing');
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.method?.toUpperCase(), error.config?.url, 'Status:', error.response?.status, 'Message:', error.response?.data?.message);
    if (error.response?.status === 401) {
      console.log('Unauthorized - removing token and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 API
export const authAPI = {
  signup: (userData) => apiClient.post('/signup', userData),
  login: (credentials) => apiClient.post('/login', credentials),
};

// 사용자 API
export const userAPI = {
  getMe: () => apiClient.get('/me'),
  updateProfile: (formData) => apiClient.put('/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getProfileImage: (role, id) => apiClient.get(`/images/${role}/${id}`, {
    responseType: 'blob'
  }),
};

// 멘토 API
export const mentorAPI = {
  getMentors: (params = {}) => apiClient.get('/mentors', { params }),
};

// 매칭 요청 API
export const matchRequestAPI = {
  createRequest: (data) => apiClient.post('/match-requests', data),
  getRequests: (params = {}) => apiClient.get('/match-requests', { params }),
  updateRequest: (id, data) => apiClient.put(`/match-requests/${id}`, data),
  deleteRequest: (id) => apiClient.delete(`/match-requests/${id}`),
};

export default apiClient;
