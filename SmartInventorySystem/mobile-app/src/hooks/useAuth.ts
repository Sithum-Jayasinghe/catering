import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { getToken, getUser, storeUser } from '../services/storage';
import { login as authLogin, logout as authLogout, getCurrentUser } from '../services/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

interface AuthResult {
  success: boolean;
  error?: string;
}

export function useAuth(): AuthState & {
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<AuthResult>;
} {
  const [state, setState] = useState<AuthState>(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async (): Promise<void> => {
      try {
        const token = await getToken();
        const user = await getUser<User>();
        if (token && user) {
          setState({
            isAuthenticated: true,
            user,
            token,
          });
        }
      } catch (e) {
        console.error('Bootstrap auth error:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const { user, token } = await authLogin(email, password);
      await storeUser(user);
      setState({
        isAuthenticated: true,
        user,
        token,
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await authLogout();
      setState(initialState);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const user = await getCurrentUser();
      if (user) {
        await storeUser(user);
        setState((prev) => ({
          ...prev,
          user,
        }));
      }
    } catch (e) {
      console.error('Refresh user error:', e);
    }
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>): Promise<AuthResult> => {
    try {
      if (!state.user) {
        return { success: false, error: 'No user logged in' };
      }
      const updatedUser = { ...state.user, ...userData };
      await storeUser(updatedUser);
      setState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Update failed',
      };
    }
  }, [state.user]);

  return {
    ...state,
    loading,
    login,
    logout,
    refreshUser,
    updateUser,
    isAuthenticated: state.isAuthenticated,
  };
}
