import { useQuery } from "@tanstack/react-query";
import { mockKPIMetrics, mockChartData, mockActivityData } from "@/lib/mock-data";
import { sleep } from "@/lib/utils";

export function useKPIMetrics() {
  return useQuery({
    queryKey: ["kpi-metrics"],
    queryFn: async () => {
      await sleep(600);
      return mockKPIMetrics;
    },
  });
}

export function useChartData() {
  return useQuery({
    queryKey: ["chart-data"],
    queryFn: async () => {
      await sleep(800);
      return mockChartData;
    },
  });
}

export function useActivityData() {
  return useQuery({
    queryKey: ["activity-data"],
    queryFn: async () => {
      await sleep(700);
      return mockActivityData;
    },
  });
}
