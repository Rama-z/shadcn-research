import {
  useLocation,
  useNavigate,
  useParams,
  useRouter as useTanStackRouter,
  useSearch,
} from "@tanstack/react-router";
import { useCallback, useMemo } from "react";

type NavigateOptions =
  | {
      to?: string;
      replace?: boolean;
      query?: Record<string, string | number | boolean | undefined | null>;
      params?: Record<string, string | number | boolean | undefined | null>;
    }
  | string;

export const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchObj = useSearch({ strict: false }) as Record<string, unknown>;

  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchObj && typeof searchObj === "object") {
      Object.entries(searchObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return params;
  }, [searchObj]);

  const handleNavigate = useCallback(
    (options: NavigateOptions) => {
      if (typeof options === "string") {
        navigate({ to: options as unknown as string } as unknown as Parameters<typeof navigate>[0]);
        return;
      }

      const { to, replace, query, params } = options;

      if (!to) return;

      const searchRecord: Record<string, string | number | boolean> = {};
      if (query && Object.keys(query).length > 0) {
        Object.entries(query).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            searchRecord[k] = v;
          }
        });
      }

      const paramsRecord: Record<string, string | number | boolean> = {};
      if (params && Object.keys(params).length > 0) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            paramsRecord[k] = v;
          }
        });
      }

      navigate({
        to: to as unknown as string,
        replace,
        ...(Object.keys(searchRecord).length > 0 && {
          search: searchRecord as unknown as Record<string, unknown>,
        }),
        ...(Object.keys(paramsRecord).length > 0 && {
          params: paramsRecord as unknown as Record<string, unknown>,
        }),
      } as unknown as Parameters<typeof navigate>[0]);
    },
    [navigate]
  );

  return useMemo(
    () => ({
      navigate: handleNavigate,
      location,
      searchParams,
    }),
    [handleNavigate, location, searchParams]
  );
};

export const useGo = () => {
  const { navigate } = useRouter();
  return navigate;
};

export const useParsed = () => {
  // Cast to a loose type so we can access arbitrary route params (e.g. `id`)
  // without TypeScript complaining that a key doesn't exist on `{}`.
  const params = useParams({ strict: false }) as Record<string, string | undefined>;
  const location = useLocation();
  const searchParamsObj = useSearch({ strict: false }) as Record<string, string | undefined>;

  const pathname = location.pathname;
  const parts = pathname.split("/");

  let action = parts[parts.length - 1];
  if (pathname.includes("/edit")) action = "edit";
  if (pathname.includes("/create")) action = "create";

  const resource = parts[1];

  return {
    id: params["id"] ?? searchParamsObj?.["id"],
    resource,
    action,
    pathname,
    params: { ...searchParamsObj, ...params },
  };
};

export const useBack = () => {
  const router = useTanStackRouter();
  return () => router.history.back();
};
