import axios, { AxiosInstance, AxiosError } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

function getToken(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

function saveToken(key: string, value: string) {
  // preserve whichever storage was used originally
  if (localStorage.getItem(key) !== null) {
    localStorage.setItem(key, value);
  } else {
    sessionStorage.setItem(key, value);
  }
}

function clearTokens() {
  ['accessToken', 'refreshToken'].forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
}

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getToken('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 → refresh
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = getToken('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          if (data.success) {
            saveToken('accessToken', data.data.accessToken);
            saveToken('refreshToken', data.data.refreshToken);
            original.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return api(original);
          }
        } catch {
          clearTokens();
          window.location.href = '/login';
        }
      } else {
        clearTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
