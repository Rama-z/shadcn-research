import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Shield,
  KeyRound,
  Settings,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/sidebar-store";
import { useAuthStore } from "@/store/auth-store";
import { UnemLogo } from "../organisms/svg-resource/unem-logo/UnemLogo.tsx";

const menuSections = [
  {
    title: "DATA MANAGEMENT",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Users", href: "/users", icon: Users },
    ],
  },
  {
    title: "ACCESS MANAGEMENT",
    items: [
      { name: "Roles", href: "/roles", icon: Shield },
      { name: "Permissions", href: "/permissions", icon: KeyRound },
    ],
  },
];

const bottomNav = [{ name: "Settings", href: "/settings", icon: Settings }];

export function Sidebar() {
  const { isCollapsed, setCollapsed } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const matchRoute = useMatchRoute();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#E5E5E5] bg-white transition-all duration-300",
        isCollapsed ? "w-[68px]" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/logo-telkomsel.png"
              alt="Telkomsel Logo"
              className="h-8 w-auto object-contain"
            />
            <div className="flex flex-col">
              <div className="origin-left scale-[0.85]">
                <UnemLogo />
              </div>
              <span className="text-[10px] font-normal leading-tight tracking-[0.005em] text-[#737373]">
                Network Management
              </span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto">
            <img
              src="/assets/images/logo-telkomsel.png"
              alt="Telkomsel Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 py-2 text-[11px] font-semibold tracking-wider text-[#737373]/70">
                {section.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = matchRoute({ to: item.href, fuzzy: true });
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#172554] text-white shadow-sm"
                        : "text-[#404040] hover:bg-gray-50 hover:text-[#172554]"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-white" : "text-[#737373] group-hover:text-[#172554]"
                      )}
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-0.5 px-4 pb-4">
        {bottomNav.map((item) => {
          const isActive = matchRoute({ to: item.href, fuzzy: true });
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#172554] text-white shadow-sm"
                  : "text-[#404040] hover:bg-gray-50 hover:text-[#172554]"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-[#737373] group-hover:text-[#172554]"
                )}
              />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto space-y-0.5 px-4 pb-4">
        {bottomNav.map((item) => {
          const isActive = matchRoute({ to: item.href, fuzzy: true });
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#172554] text-white shadow-sm"
                  : "text-[#404040] hover:bg-gray-50 hover:text-[#172554]"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-[#737373] group-hover:text-[#172554]"
                )}
              />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        <button
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#404040] transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4 shrink-0 text-[#737373] transition-colors group-hover:text-red-600" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-background shadow-sm"
        onClick={() => setCollapsed(!isCollapsed)}
      >
        <ChevronLeft
          className={cn("h-3 w-3 transition-transform duration-200", isCollapsed && "rotate-180")}
        />
      </Button>
    </aside>
  );
}
