import { useQuery } from "@tanstack/react-query";
import { mockPermissions } from "@/lib/mock-data";
import { sleep } from "@/lib/utils";

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      await sleep(800);
      return mockPermissions;
    },
  });
}
