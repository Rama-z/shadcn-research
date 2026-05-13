import type { AxiosInstance } from "axios";
import { createContext, useContext } from "react";

import { axiosInstance } from "@/lib/axios";
import { generateFilter, generateSort } from "@/lib/data-utils";
import type { DataProvider, GetListParams } from "@/types/data-provider";

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
): DataProvider => ({
  getList: async ({
    resource,
    pagination,
    filters,
    sorters,
    id,
  }: GetListParams & { id?: string | number }) => {
    const url = id ? `${apiUrl}/${resource}/${id}` : `${apiUrl}/${resource}`;
    let query: Record<string, unknown> = {};

    if (pagination) {
      const { currentPage = 1, pageSize = 10 } = pagination;
      query.page = currentPage - 1;
      query.size = pageSize;
    }

    if (sorters && sorters.length > 0) {
      const { _sort, _order } = generateSort(sorters);
      query.sortBy = _sort;
      query.sortOrder = _order.toUpperCase();
    }

    if (filters) {
      const generatedFilter = generateFilter(filters);
      query = { ...query, ...generatedFilter };
    }

    const { data, headers } = await httpClient.get(url, { params: query });

    let mappedData = data;
    let totalElements = Number(headers["x-total-count"]);

    if (data?.data?.content) {
      mappedData = data.data.content;
      totalElements = data.data.totalElements ?? totalElements;
    } else if (data?.content) {
      mappedData = data.content;
      totalElements = data.totalElements ?? totalElements;
    } else if (data?.data && Array.isArray(data.data)) {
      mappedData = data.data;
      totalElements = data.total ?? totalElements;
    }

    return {
      data: mappedData,
      total: totalElements || mappedData.length || 0,
      status: data?.status,
      message: data?.message,
    };
  },

  getMany: async ({ resource, ids }) => {
    const { data } = await httpClient.get(`${apiUrl}/${resource}`, {
      params: { id: ids },
    });
    return data;
  },

  getOne: async ({ resource, id }) => {
    const url =
      id === "" || id === undefined ? `${apiUrl}/${resource}` : `${apiUrl}/${resource}/${id}`;
    const { data } = await httpClient.get(url);
    return data;
  },

  create: async ({ resource, variables }) => {
    const { data } = await httpClient.post(`${apiUrl}/${resource}`, variables);
    return data;
  },

  update: async ({ resource, id, variables }) => {
    const url =
      id === "" || id === undefined ? `${apiUrl}/${resource}` : `${apiUrl}/${resource}/${id}`;
    const { data } = await httpClient.put(url, variables);
    return data;
  },

  getApiUrl: () => apiUrl,

  deleteOne: async ({ resource, id }) => {
    const url =
      id === "" || id === undefined ? `${apiUrl}/${resource}` : `${apiUrl}/${resource}/${id}`;
    const { data } = await httpClient.delete(url);
    return data;
  },

  custom: async ({ url, method, payload, query, headers, meta }) => {
    const requestUrl = url.startsWith("http") ? url : `${apiUrl}${url}`;

    const response = await httpClient({
      url: requestUrl,
      method,
      headers,
      //   responseType,
      data: payload,
      params: { ...query, ...meta },
    });

    return response.data;
  },
});

export const defaultDataProvider = dataProvider(import.meta.env.VITE_API_URL ?? "");

const DataProviderContext = createContext<DataProvider | undefined>(undefined);

export const DataProviders = DataProviderContext.Provider;

export const useDataProvider = () => {
  const context = useContext(DataProviderContext);
  return context ?? defaultDataProvider;
};
