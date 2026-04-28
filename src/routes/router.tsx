import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";

import { LoginForm } from "../features/auth/components/login-form.tsx";
import { DashboardPage } from "./dashboard-page";
import { UsersPage } from "./users-page";
import { RolesPage } from "./roles-page";
import { PermissionsPage } from "./permissions-page";
import { SettingsPage } from "./settings-page";

import { DashboardLayout } from "../components/layout/dashboard-layout.tsx";

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
