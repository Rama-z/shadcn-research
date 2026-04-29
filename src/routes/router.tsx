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
import { DataQualityPage } from "./data-quality-page";
import { MetadataPage } from "./metadata-page";
import { ReferencePage } from "./reference-page";
import { ActivityLogPage } from "./activity-log-page";
import { FeatureManagementPage } from "./feature-management-page";

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

// ─── Data Quality Route ─────────────────────────────
const dataQualityRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/data-quality",
  component: DataQualityPage,
});

// ─── Metadata Route ─────────────────────────────────
const metadataRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/metadata",
  component: MetadataPage,
});

// ─── Reference Route ────────────────────────────────
const referenceRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/reference",
  component: ReferencePage,
});

// ─── Activity Log Route ─────────────────────────────
const activityLogRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/activity-log",
  component: ActivityLogPage,
});

// ─── Feature Management Route ───────────────────────
const featureManagementRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/feature-management",
  component: FeatureManagementPage,
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
    dataQualityRoute,
    metadataRoute,
    referenceRoute,
    activityLogRoute,
    featureManagementRoute,
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
