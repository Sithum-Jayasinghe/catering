import { api, apiClient } from './api';

export const auth = {
  async login(email: string, password: string) {
    const response = await api.login({ email, password });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
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
