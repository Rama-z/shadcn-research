import type { CrudFilter, CrudSort } from "@/types/data-provider";

export function generateSort(sorters: CrudSort[]): {
  _sort: string;
  _order: string;
} {
  const fields: string[] = [];
  const orders: string[] = [];

  sorters.forEach(({ field, order }) => {
    fields.push(field);
    orders.push(order);
  });

  return {
    _sort: fields.join(","),
    _order: orders.join(","),
  };
}

export function generateFilter(filters: CrudFilter[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  filters.forEach((filter) => {
    if ("field" in filter) {
      const { field, operator, value } = filter;
      if (operator === "eq") {
        result[field] = value;
      } else {
        result[`${field}_${operator}`] = value;
      }
    }
  });

  return result;
}

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
