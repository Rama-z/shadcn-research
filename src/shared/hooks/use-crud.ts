import type { UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useDataProvider } from "@/provider/dataProvider";
import type {
  BaseRecord,
  CreateResponse,
  CustomResponse,
  CustomResponseType,
  DeleteOneResponse,
  GetListParams,
  GetListResponse,
  GetOneResponse,
  HttpError,
  UpdateResponse,
} from "@/types/data-provider";

export const useList = <TData extends BaseRecord = BaseRecord, TError = HttpError>(params: {
  resource: string;
  pagination?: GetListParams["pagination"];
  filters?: GetListParams["filters"];
  sorters?: GetListParams["sorters"];
  meta?: GetListParams["meta"];
  queryOptions?: Omit<
    UseQueryOptions<GetListResponse<TData>, TError, GetListResponse<TData>>,
    "queryKey" | "queryFn"
  >;
}): UseQueryResult<GetListResponse<TData>, TError> => {
  const dataProvider = useDataProvider();

  return useQuery<GetListResponse<TData>, TError>({
    queryKey: [
      params.resource,
      "list",
      params.pagination,
      params.filters,
      params.sorters,
      params.meta,
    ],
    queryFn: () =>
      dataProvider.getList<TData>({
        resource: params.resource,
        pagination: params.pagination,
        filters: params.filters,
        sorters: params.sorters,
        meta: params.meta,
      }),
    placeholderData: keepPreviousData,
    ...params.queryOptions,
  });
};

export const useOne = <TData extends BaseRecord = BaseRecord, TError = HttpError>(params: {
  resource: string;
  id: string | number;
  meta?: Record<string, unknown>;
  queryOptions?: Omit<
    UseQueryOptions<GetOneResponse<TData>, TError, GetOneResponse<TData>>,
    "queryKey" | "queryFn"
  >;
}): UseQueryResult<GetOneResponse<TData>, TError> => {
  const dataProvider = useDataProvider();

  return useQuery<GetOneResponse<TData>, TError>({
    queryKey: [params.resource, "detail", params.id, params.meta],
    queryFn: () =>
      dataProvider.getOne<TData>({
        resource: params.resource,
        id: params.id,
        meta: params.meta,
      }),
    ...params.queryOptions,
  });
};

export const useCreate = <
  TData extends BaseRecord = BaseRecord,
  TError = HttpError,
  TVariables = unknown,
>(): UseMutationResult<
  CreateResponse<TData>,
  TError,
  { resource?: string; variables?: TVariables; meta?: Record<string, unknown> },
  unknown
> => {
  const dataProvider = useDataProvider();
  const queryClient = useQueryClient();

  return useMutation<
    CreateResponse<TData>,
    TError,
    {
      resource?: string;
      variables?: TVariables;
      meta?: Record<string, unknown>;
    }
  >({
    mutationFn: ({ resource, variables, meta }) => {
      return dataProvider.create<TData, TVariables>({
        resource: resource || "",
        variables: variables as TVariables,
        meta,
      });
    },
    onSuccess: (_data, variables) => {
      if (variables.resource) {
        queryClient.invalidateQueries({ queryKey: [variables.resource] });
      }
    },
  });
};

export const useUpdate = <
  TData extends BaseRecord = BaseRecord,
  TError = HttpError,
  TVariables = unknown,
>(): UseMutationResult<
  UpdateResponse<TData>,
  TError,
  {
    resource: string;
    id: string | number;
    variables?: TVariables;
    meta?: Record<string, unknown>;
  },
  unknown
> => {
  const dataProvider = useDataProvider();
  const queryClient = useQueryClient();

  return useMutation<
    UpdateResponse<TData>,
    TError,
    {
      resource: string;
      id: string | number;
      variables?: TVariables;
      meta?: Record<string, unknown>;
    }
  >({
    mutationFn: ({ resource, id, variables, meta }) => {
      return dataProvider.update<TData, TVariables>({
        resource,
        id,
        variables: variables as TVariables,
        meta,
      });
    },
    onSuccess: (_data, { resource, id }) => {
      queryClient.invalidateQueries({ queryKey: [resource, "list"] });
      queryClient.invalidateQueries({ queryKey: [resource, "detail", id] });
    },
  });
};

export const useDelete = <
  TData extends BaseRecord = BaseRecord,
  TError = HttpError,
>(): UseMutationResult<
  DeleteOneResponse<TData>,
  TError,
  { resource: string; id: string | number; meta?: Record<string, unknown> },
  unknown
> => {
  const dataProvider = useDataProvider();
  const queryClient = useQueryClient();

  return useMutation<
    DeleteOneResponse<TData>,
    TError,
    {
      resource: string;
      id: string | number;
      meta?: Record<string, unknown>;
    }
  >({
    mutationFn: ({ resource, id, meta }) => {
      return dataProvider.deleteOne<TData>({
        resource,
        id,
        meta,
      });
    },
    onSuccess: (_data, { resource }) => {
      queryClient.invalidateQueries({ queryKey: [resource, "list"] });
    },
  });
};

export const useCustomMutation = <
  TData = BaseRecord,
  TError = HttpError,
  TVariables = unknown,
>(): UseMutationResult<
  CustomResponse<TData>,
  TError,
  {
    url: string;
    method: "get" | "post" | "put" | "patch" | "delete";
    payload?: TVariables;
    query?: Record<string, unknown>;
    headers?: Record<string, string>;
    responseType?: CustomResponseType;
    meta?: Record<string, unknown>;
  },
  unknown
> => {
  const dataProvider = useDataProvider();

  return useMutation<
    CustomResponse<TData>,
    TError,
    {
      url: string;
      method: "get" | "post" | "put" | "patch" | "delete";
      payload?: TVariables;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
      responseType?: CustomResponseType;
      meta?: Record<string, unknown>;
    }
  >({
    mutationFn: ({ url, method, payload, query, headers, responseType, meta }) => {
      if (!dataProvider.custom) {
        throw new Error("Custom method not implemented in DataProvider");
      }
      return dataProvider.custom<TData>({
        url,
        method,
        payload,
        query,
        headers,
        responseType,
        meta,
      });
    },
  });
};
