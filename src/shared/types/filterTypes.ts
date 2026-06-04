export type TFilterOptions = Record<string, { label: string; options: readonly string[] }>;

export type TFilters<T extends TFilterOptions> = {
  [K in keyof T]: T[K]["options"][number][];
};
