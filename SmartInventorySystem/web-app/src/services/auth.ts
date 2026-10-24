import { api, apiClient } from './api';

export const auth = {
  async login(email: string, password: string) {
    const response = await api.login({ email, password });
    // Backend returns { token, refreshToken, expiresAt, userId, fullName, role } directly
    const { token, refreshToken, userId, fullName, role } = response as any;
    const user = { _id: userId, email, fullName, role };
    localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token };
  },

  async register(userData: { email: string; password: string; firstName: string; lastName: string; role?: string }) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};

export default auth;
