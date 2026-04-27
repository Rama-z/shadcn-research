import { useQuery } from "@tanstack/react-query";
import { mockRoles } from "@/lib/mock-data";
import { sleep } from "@/lib/utils";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      await sleep(800);
      return mockRoles;
    },
  });
}
