import { KPIWidget, KPIWidgetSkeleton } from "@/features/dashboard/components/kpi-widget";
import {
  OverviewChart,
  ActivityChart,
  ChartSkeleton,
} from "@/features/dashboard/components/charts";
import { RecentUsersCard } from "@/features/dashboard/components/recent-users-card";
import {
  useKPIMetrics,
  useChartData,
  useActivityData,
} from "@/features/dashboard/hooks/use-dashboard";

export function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useKPIMetrics();
  const { data: chartData, isLoading: chartLoading } = useChartData();
  const { data: activityData, isLoading: activityLoading } = useActivityData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here's an overview of your system.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsLoading
          ? Array.from({ length: 4 }).map((_, i) => <KPIWidgetSkeleton key={i} />)
          : metrics?.map((metric) => <KPIWidget key={metric.id} metric={metric} />)}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-7">
        {chartLoading ? (
          <>
            <div className="col-span-4">
              <ChartSkeleton />
            </div>
            <div className="col-span-3">
              <ChartSkeleton />
            </div>
          </>
        ) : (
          <>
            {chartData && <OverviewChart data={chartData} />}
            {activityData && <ActivityChart data={activityData} />}
          </>
        )}
      </div>

      {/* Recent data */}
      <div className="grid gap-4 lg:grid-cols-7">
        <div className="col-span-4">{/* Placeholder for additional content */}</div>
        <RecentUsersCard />
      </div>
    </div>
  );
}
