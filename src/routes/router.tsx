import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { LoginForm } from "@/features/auth/components/login-form";
import { DashboardPage } from "./dashboard-page";
import { UsersPage } from "./users-page";
import { RolesPage } from "./roles-page";
import { PermissionsPage } from "./permissions-page";
import { SettingsPage } from "./settings-page";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";

// ─── Root Route ─────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// ─── Login Route ────────────────────────────────────
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginForm,
});

// ─── Authenticated Layout ───────────────────────────
function DashboardLayout() {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn("transition-all duration-300", isCollapsed ? "ml-[68px]" : "ml-64")}>
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticated",
  component: DashboardLayout,
});

// ─── Dashboard Route ────────────────────────────────
const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: DashboardPage,
});

// ─── Users Route ────────────────────────────────────
const usersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/users",
  component: UsersPage,
});

// ─── Roles Route ────────────────────────────────────
const rolesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/roles",
  component: RolesPage,
});

// ─── Permissions Route ──────────────────────────────
const permissionsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/permissions",
  component: PermissionsPage,
});

// ─── Settings Route ─────────────────────────────────
const settingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/settings",
  component: SettingsPage,
});

// ─── Route Tree ─────────────────────────────────────
const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    usersRoute,
    rolesRoute,
    permissionsRoute,
    settingsRoute,
  ]),
]);

// ─── Router ─────────────────────────────────────────
export const router = createRouter({ routeTree });

// ─── Type declaration ───────────────────────────────
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
