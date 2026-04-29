import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  Database,
  BookOpen,
  ScrollText,
  Cog,
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
      { name: "Data Quality", href: "/data-quality", icon: ShieldCheck },
      { name: "Metadata", href: "/metadata", icon: Database },
      { name: "Reference", href: "/reference", icon: BookOpen },
    ],
  },
  {
    title: "MONITORING",
    items: [{ name: "Activity Log", href: "/activity-log", icon: ScrollText }],
  },
  {
    title: "CONFIGURATION",
    items: [{ name: "Feature Management", href: "/feature-management", icon: Cog }],
  },
];

const bottomNav = [{ name: "Settings", href: "/settings", icon: Settings }];

export function Sidebar() {
  const { isCollapsed, setCollapsed } = useSidebarStore();
  const { logout } = useAuthStore();
  const matchRoute = useMatchRoute();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
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
            <div className="flex flex-col text-foreground">
              <div className="origin-left scale-[0.85]">
                <UnemLogo />
              </div>
              <span className="text-[10px] font-normal leading-tight tracking-[0.005em] text-muted-foreground">
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
              <h3 className="px-3 py-2 text-[11px] font-semibold tracking-wider text-muted-foreground/70">
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
                      "group flex items-center gap-3 rounded-md py-2 pl-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#172554] text-white shadow-sm"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-muted-foreground group-hover:text-foreground"
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
                  : "text-foreground/80 hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        <button
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/20"
        >
          <LogOut className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-red-500" />
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
