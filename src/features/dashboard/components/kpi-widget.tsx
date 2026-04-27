import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { KPIMetric } from "@/types";
import { Users, Activity, Shield, KeyRound, TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  activity: Activity,
  shield: Shield,
  key: KeyRound,
};

interface KPIWidgetProps {
  metric: KPIMetric;
}

export function KPIWidget({ metric }: KPIWidgetProps) {
  const Icon = iconMap[metric.icon] ?? Activity;
  const isIncrease = metric.changeType === "increase";

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/5">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/10 to-indigo-600/10">
          <Icon className="h-4 w-4 text-violet-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(metric.value)}</div>
        {metric.change > 0 && (
          <div className="mt-1 flex items-center gap-1">
            {isIncrease ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                isIncrease ? "text-emerald-500" : "text-red-500"
              )}
            >
              {metric.change}%
            </span>
            <span className="text-xs text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function KPIWidgetSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-8 w-20" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}
