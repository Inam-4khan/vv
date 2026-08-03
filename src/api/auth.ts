import apiClient from './client';

export interface LoginCredentials {
  username?: string;
  email?: string;
  password?: string;
  [key: string]: any;
}

export interface SignupUserData {
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  persona?: string;
  [key: string]: any;
}

export async function loginApi(credentials: LoginCredentials) {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
}

export async function signupApi(userData: SignupUserData) {
  const response = await apiClient.post('/auth/signup', userData);
  return response.data;
}

export async function logoutApi() {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    console.warn('Logout endpoint unreachable, clearing session');
  }
  return { success: true };
}

export async function getCurrentUserApi() {
  const response = await apiClient.get('/auth/me');
  return response.data;
}
