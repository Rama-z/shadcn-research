// src/features/auth/auth.query.ts
import { queryOptions } from "@tanstack/react-query";
import { getMe } from "./auth.api";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export const meQueryOptions = queryOptions({
  queryKey: authKeys.me,
  queryFn: getMe,
  retry: false,
});
