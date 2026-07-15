import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/services/auth';

export function useAuth() {
  const user = auth.getUser();
  const isAuthenticated = auth.isAuthenticated();

  return {
    user,
    isAuthenticated,
    login: auth.login,
    logout: auth.logout,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => auth.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: auth.logout,
    onSettled: () => {
      queryClient.clear();
      window.location.href = '/login';
    },
  });
}
