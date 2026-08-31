import axios from 'axios';
import { getAccessToken, setAccessToken } from '../context/AuthContext';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) {
      p.reject(error);
    } else if (token) {
      p.resolve(token);
    } else {
      p.reject(new Error('Authentication token refresh failed'));
    }
  });
  failedQueue = [];
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      });
    }
    original._retry = true;
    isRefreshing = true;
    try {
      const res = await apiClient.post<{ accessToken: string }>('/auth/refresh');
      setAccessToken(res.data.accessToken);
      processQueue(null, res.data.accessToken);
      original.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return apiClient(original);
    } catch (err) {
      processQueue(err, null);
      setAccessToken(null);
      window.dispatchEvent(new CustomEvent('vizu:session:expired'));
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
