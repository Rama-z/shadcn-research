import { useState, useCallback, useMemo } from "react";

import { TFilterKey } from "./types";
import { TFilterOptions, TFilters } from "@/shared";
import { useSidebarStore } from "@/store/sidebar-store";

interface DataQualityRow {
  id: number;
  date: string;
  ipAddress: string;
  region: string;
  vendor: string;
  neType: string;
  technology: string;
  rules: string;
  totalFiles: number;
  category: string;
  completion: number;
}

type SortDir = "asc" | "desc" | null;

// ─── Mock data ──────────────────────────────────────
const mockData: DataQualityRow[] = [
  {
    id: 1,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "192.168.45.67",
    region: "Denpasar",
    vendor: "Ericsson",
    neType: "Core",
    technology: "4G",
    rules: "Rule B",
    totalFiles: 6,
    category: "Hourly",
    completion: 50,
  },
  {
    id: 2,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "10.14.32.89",
    region: "Yogyakarta",
    vendor: "Huawei",
    neType: "Core",
    technology: "2G",
    rules: "Rule A",
    totalFiles: 1,
    category: "Quarterly",
    completion: 50,
  },
  {
    id: 3,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "172.16.254.3",
    region: "Balikpapan",
    vendor: "Ericsson",
    neType: "Core",
    technology: "5G",
    rules: "Rule C",
    totalFiles: 3,
    category: "Hourly",
    completion: 50,
  },
  {
    id: 4,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "203.0.113.45",
    region: "Semarang",
    vendor: "ZTE",
    neType: "Core",
    technology: "5G",
    rules: "Rule C",
    totalFiles: 4,
    category: "Quarterly",
    completion: 50,
  },
  {
    id: 5,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "198.51.100.22",
    region: "Makassar",
    vendor: "ZTE",
    neType: "Core",
    technology: "2G",
    rules: "Rule A",
    totalFiles: 8,
    category: "Hourly",
    completion: 50,
  },
  {
    id: 6,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "8.8.8.8",
    region: "Palembang",
    vendor: "Huawei",
    neType: "Core",
    technology: "2G",
    rules: "Rule A",
    totalFiles: 8,
    category: "Quarterly",
    completion: 50,
  },
  {
    id: 7,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "192.0.2.123",
    region: "Medan",
    vendor: "ZTE",
    neType: "Core",
    technology: "5G",
    rules: "Rule C",
    totalFiles: 4,
    category: "Hourly",
    completion: 50,
  },
  {
    id: 8,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "172.31.255.254",
    region: "Bandung",
    vendor: "Ericsson",
    neType: "Core",
    technology: "4G",
    rules: "Rule B",
    totalFiles: 8,
    category: "Quarterly",
    completion: 50,
  },
  {
    id: 9,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "169.254.10.20",
    region: "Surabaya",
    vendor: "Huawei",
    neType: "Core",
    technology: "4G",
    rules: "Rule B",
    totalFiles: 2,
    category: "Hourly",
    completion: 50,
  },
  {
    id: 10,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "100.64.0.1",
    region: "Jakarta",
    vendor: "Huawei",
    neType: "Core",
    technology: "2G",
    rules: "Rule A",
    totalFiles: 8,
    category: "Quarterly",
    completion: 50,
  },
  {
    id: 11,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "100.64.0.1",
    region: "Jakarta",
    vendor: "Huawei",
    neType: "Core",
    technology: "2G",
    rules: "Rule A",
    totalFiles: 8,
    category: "Quarterly",
    completion: 50,
  },
  {
    id: 12,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "100.64.0.1",
    region: "Jakarta",
    vendor: "Huawei",
    neType: "Core",
    technology: "2G",
    rules: "Rule A",
    totalFiles: 8,
    category: "Quarterly",
    completion: 50,
  },
  {
    id: 13,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "100.64.0.1",
    region: "Jakarta",
    vendor: "Huawei",
    neType: "Core",
    technology: "2G",
    rules: "Rule A",
    totalFiles: 8,
    category: "Quarterly",
    completion: 50,
  },
  {
    id: 14,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "100.64.0.1",
    region: "Jakarta",
    vendor: "Huawei",
    neType: "Core",
    technology: "2G",
    rules: "Rule A",
    totalFiles: 8,
    category: "Quarterly",
    completion: 50,
  },
  {
    id: 15,
    date: "Jan 20, 2026 - 20:00:00",
    ipAddress: "100.64.0.1",
    region: "Jakarta",
    vendor: "Huawei",
    neType: "Core",
    technology: "2G",
    rules: "Rule A",
    totalFiles: 8,
    category: "Quarterly",
    completion: 50,
  },
];

const useEstablishedTable = ({ ...props }: any) => {
  const { isCollapsed } = useSidebarStore();

  // Local draft state so changes aren't applied until user clicks "Apply"
  const [draft, setDraft] = useState<TFilters<TFilterOptions>>(props.emptyFilter);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [tableOptionsOpen, setTableOptionsOpen] = useState(false);
  const [filters, setFilters] = useState<TFilters<TFilterOptions>>();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [sort, setSort] = useState<{ key: string; dir: SortDir }>({
    key: "",
    dir: null,
  });

  // Toggle sort
  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key === key) {
        if (prev.dir === "asc") return { key, dir: "desc" };
        if (prev.dir === "desc") return { key: "", dir: null };
        return { key, dir: "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  // Sync draft when the sheet opens
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) setDraft(props.filters);
      props.onOpenChange(nextOpen);
    },
    [props]
  );

  // Toggle a single checkbox value
  const toggleValue = (key: TFilterKey, value: string) => {
    setDraft((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  // Filter
  const handleReset = () => {
    setDraft(props.emptyFilter);
  };

  const handleApply = () => {
    props.onApply(draft);
    props.onOpenChange(false);
  };

  // Filter + sort
  const processedData = useMemo(() => {
    let filtered = mockData;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (row) =>
          row.ipAddress.toLowerCase().includes(q) ||
          row.region.toLowerCase().includes(q) ||
          row.vendor.toLowerCase().includes(q) ||
          row.totalFiles.toString().includes(q)
      );
    }

    if (sort.key && sort.dir) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sort.key as keyof DataQualityRow];
        const bVal = b[sort.key as keyof DataQualityRow];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sort.dir === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sort.dir === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return filtered;
  }, [searchQuery, sort]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(processedData.length / rowsPerPage));
  const pagedData = processedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Page buttons
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  const filterKeys = Object.keys(props.filterOptions) as TFilterKey[];

  return {
    draft,
    filters,
    setDraft,
    setFilters,
    filterKeys,
    toggleValue,
    handleReset,
    isCollapsed,
    handleApply,
    handleOpenChange,
    setFilterSheetOpen,
    filterSheetOpen,
    tableOptionsOpen,
    setTableOptionsOpen,
    rowsPerPage,
    setRowsPerPage,
    setCurrentPage,
    currentPage,
    getPageNumbers,
    totalPages,
    pagedData,
    handleSort,
    sort,
    setSort,
    setSearchQuery,
    searchQuery,
  };
};

export default useEstablishedTable;
