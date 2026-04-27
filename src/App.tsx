import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { router } from "./routes/router.tsx";
import { useAuthStore } from "@/store/auth-store";
import { LoginForm } from "./features/auth/components/login-form.tsx";
import { useEffect } from "react";

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
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // Initialize theme based on store preference
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Simulate checking auth state on mount
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [setLoading, theme, isAuthenticated]);

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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
      <Toaster
        theme="dark"
        position="bottom-right"
        richColors
        toastOptions={{
          style: {
            background: "hsl(240, 10%, 6%)",
            border: "1px solid hsl(240, 3.7%, 15.9%)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
