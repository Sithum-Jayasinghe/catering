import api from './api';
import { storeToken, storeUser, clearAll } from './storage';
import { User, AuthState } from '../types';

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const response = await api.post<{ user: User; token: string }>('/auth/login', {
    email,
    password,
  });
  const { user, token } = response.data;
  await storeToken(token);
  await storeUser(user);
  return { user, token };
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: string = 'staff'
): Promise<{ user: User; token: string }> {
  const response = await api.post<{ user: User; token: string }>('/auth/register', {
    name,
    email,
    password,
    role,
  });
  const { user, token } = response.data;
  await storeToken(token);
  await storeUser(user);
  return { user, token };
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    await clearAll();
  }
}

export async function refreshToken(): Promise<string | null> {
  try {
    const response = await api.post<{ token: string }>('/auth/refresh');
    const { token } = response.data;
    await storeToken(token);
    return token;
  } catch (error) {
    console.error('Refresh token error:', error);
    await clearAll();
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email });
}

export async function resetPassword(
  token: string,
  password: string
): Promise<void> {
  await api.post('/auth/reset-password', { token, password });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await api.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
}

export function isAuthenticated(state: AuthState): boolean {
  return state.isAuthenticated && !!state.token;
}
