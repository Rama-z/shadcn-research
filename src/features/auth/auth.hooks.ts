// src/features/auth/auth.hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { login as loginApi, logout as logoutApi } from "./auth.api";
import { authKeys, meQueryOptions } from "./auth.query";
import { useAuthStore } from "@/store/auth-store";

/**
 * useLoginMutation — for use in LoginForm (renders OUTSIDE RouterProvider).
 * Does not use useRouter. Updates the Zustand auth store on success,
 * which causes AuthGate to automatically render the dashboard.
 */
export function useLoginMutation() {
  const authStore = useAuthStore;

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // Persist tokens to localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: data.data.token,
          refreshToken: data.data.refreshToken,
        })
      );

      // Update the auth store — AuthGate reacts to this automatically
      authStore.getState().login(data?.data as any);
    },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      localStorage.removeItem("auth");
      useAuthStore.getState().logout();
    },
  });
}

/**
 * useAuth — for use in components INSIDE RouterProvider (dashboard pages, navbar, sidebar).
 * Uses useRouter for navigation on logout.
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const meQuery = useQuery(meQueryOptions);

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: data.data.token,
          refreshToken: data.data.refreshToken,
        })
      );

      queryClient.setQueryData(authKeys.me, data.data.username);

      await router.invalidate();

      router.navigate({
        to: "/",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSettled: async () => {
      localStorage.removeItem("auth");

      queryClient.setQueryData(authKeys.me, null);
      queryClient.removeQueries({
        queryKey: authKeys.me,
      });

      // Update auth store so AuthGate switches back to login
      useAuthStore.getState().logout();

      await router.invalidate();

      router.navigate({
        to: "/login",
      });
    },
  });

  return {
    user: meQuery.data,
    isLoading: meQuery.isLoading,
    isAuthenticated: !!meQuery.data,

    login: loginMutation.mutate,
    logout: logoutMutation.mutate,

    loginStatus: loginMutation.status,
    logoutStatus: logoutMutation.status,
  };
}
