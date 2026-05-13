import { Bell, Moon, Sun, Info, ChevronRight } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";

// ─── Route → Breadcrumb map ────────────────────────
interface BreadcrumbEntry {
  category?: string;
  page: string;
}

const routeBreadcrumbs: Record<string, BreadcrumbEntry> = {
  "/": { page: "Dashboard" },
  "/data-quality": { category: "Data Management", page: "Data Quality" },
  "/metadata": { category: "Data Management", page: "Metadata" },
  "/reference": { category: "Data Management", page: "Reference" },
  "/activity-log": { category: "Monitoring", page: "Activity Log" },
  "/feature-management": { category: "Configuration", page: "Feature Management" },
  "/users": { category: "User Management", page: "Users" },
  "/roles": { category: "User Management", page: "Roles" },
  "/permissions": { category: "User Management", page: "Permissions" },
  "/settings": { page: "Settings" },
};

function Breadcrumb() {
  const location = useRouterState({ select: (s) => s.location });
  const entry = routeBreadcrumbs[location.pathname] ?? { page: "Page" };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {entry.category && (
        <>
          <span className="text-muted-foreground">{entry.category}</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
        </>
      )}
      <span className="font-medium text-foreground">{entry.page}</span>
    </nav>
  );
}

// ─── Navbar ─────────────────────────────────────────
export function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-lg">
          <Info className="h-4 w-4 text-foreground" />
        </Button>

        <Button variant="ghost" size="icon" className="relative rounded-lg">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet-600" />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-lg">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-sm text-white">
                  {user?.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
