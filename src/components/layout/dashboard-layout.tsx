import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./sidebar.tsx";
import { Navbar } from "./navbar.tsx";
import { useSidebarStore } from "@/store/sidebar-store";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 p-4 pl-0",
          isCollapsed ? "ml-[68px]" : "ml-60"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-[12px] border border-border bg-card shadow-sm">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 text-foreground">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
