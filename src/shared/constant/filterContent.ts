import { TFilterOptions, TFilters } from "@/shared";

export const METADATA_FILTER_OPTIONS = {
  neName: {
    label: "NE Name",
    options: ["SkyWave", "Next Wave", "Virelia"],
  },
  neType: {
    label: "NE Type",
    options: ["Core", "Non-Core"],
  },
  vendor: {
    label: "Vendor",
    options: ["Ericsson", "Huawei", "ZTE"],
  },
  technology: {
    label: "Technology",
    options: ["2G", "4G", "5G"],
  },
} as const satisfies TFilterOptions;

export const EMPTY_METADATA_FILTERS: TFilters<typeof METADATA_FILTER_OPTIONS> = {
  neName: [],
  neType: [],
  vendor: [],
  technology: [],
};

export const DATA_QUALITY_FILTER_OPTIONS = {
  neName: {
    label: "NE Name",
    options: ["SkyWave", "Next Wave", "Virelia"],
  },
  neType: {
    label: "NE Type",
    options: ["Core", "Non-Core"],
  },
  rules: {
    label: "Rules",
    options: ["Rules A", "Rules B", "Rules C"],
  },
  category: {
    label: "Category",
    options: ["Hourly", "Quarterly"],
  },
  vendor: {
    label: "Vendor",
    options: ["Ericsson", "Huawei", "ZTE"],
  },
  technology: {
    label: "Technology",
    options: ["2G", "4G", "5G"],
  },
} as const satisfies TFilterOptions;

export const EMPTY_DATA_QUALITY_FILTERS: TFilters<typeof DATA_QUALITY_FILTER_OPTIONS> = {
  neName: [],
  neType: [],
  rules: [],
  category: [],
  vendor: [],
  technology: [],
};
