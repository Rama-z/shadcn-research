import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { router } from "./routes/router.tsx";
import { useAuthStore } from "@/store/auth-store";
import { LoginForm } from "./features/auth/components/login-form.tsx";
import { useEffect, useRef } from "react";
import { checkSession } from "./features/auth/auth.api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

import { useThemeStore } from "@/store/theme-store";

function AuthGate() {
  const { isAuthenticated, isLoading, login, logout, setLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const hasAttemptedRefresh = useRef(false);

  useEffect(() => {
    // Initialize theme based on store preference
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    // Only attempt session check once on mount
    if (hasAttemptedRefresh.current) return;
    hasAttemptedRefresh.current = true;

    // If already authenticated (shouldn't happen on fresh load, but guard anyway)
    if (isAuthenticated) {
      setLoading(false);
      return;
    }

    // Check if we have auth data in localStorage
    const authData = localStorage.getItem("auth");
    if (!authData) {
      // No stored auth at all — go straight to login
      setLoading(false);
      return;
    }

    // Validate the existing session via check-session API
    checkSession()
      .then((data) => {
        // Session is still valid — restore it
        login(data as any);
      })
      .catch((error) => {
        // Session invalid — clear stale data and show login
        localStorage.removeItem("auth");
        logout();
        console.log("Session check failed:", error);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <RouterProvider router={router} />;
}

function App() {
  const currentTheme = useThemeStore((s) => s.theme);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
      <Toaster theme={currentTheme} position="bottom-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
