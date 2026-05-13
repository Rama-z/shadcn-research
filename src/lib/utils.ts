import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat("id-ID").format(number);
}

import type { CrudFilter, CrudSort } from "@/types/data-provider";

export const generateSort = (sorters?: CrudSort[]) => {
  if (sorters && sorters.length > 0) {
    const _sort: string[] = [];
    const _order: string[] = [];

    sorters.map((item) => {
      _sort.push(item.field);
      _order.push(item.order);
    });

    return {
      _sort: _sort.join(","),
      _order: _order.join(","),
    };
  }

  return;
};

export const generateFilter = (filters?: CrudFilter[]) => {
  const query: { [key: string]: string } = {};

  if (filters) {
    filters.map((filter) => {
      if ("field" in filter) {
        const { field, operator, value } = filter;

        if (field === "q") {
          query[field] = value;
          return;
        }

        switch (operator) {
          case "eq":
            query[field] = value;
            break;
          case "ne":
            query[`${field}_ne`] = value;
            break;
          case "lt":
            query[`${field}_lt`] = value;
            break;
          case "gt":
            query[`${field}_gt`] = value;
            break;
          case "lte":
            query[`${field}_lte`] = value;
            break;
          case "gte":
            query[`${field}_gte`] = value;
            break;
          case "contains":
            query[`${field}_like`] = value;
            break;
          default:
            query[field] = value;
        }
      }
    });
  }

  return query;
};

export const formatDate = (value?: string | null): string => {
  if (!value) return "-";
  const date = new Date(value);

  if (isNaN(date.getTime())) return value;

  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");
  return `${month} ${day}, ${year}, ${hours}:${mins}`;
};

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      const rawBase64 = base64String.split(",")[1];
      resolve(rawBase64);
    };
    reader.onerror = (error) => reject(error);
  });
}
