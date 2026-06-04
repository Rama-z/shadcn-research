import React, { useState, useMemo } from "react";

import { Separator } from "@/components/ui/separator";
import { DateTimeRangePicker, type DateTimeRange } from "@/components/ui/date-time-range-picker";
import { DataQualityTimeliness } from "@/features/data-quality/components/data-quatlity-timeliness";
import { DataQualityCompleteness } from "@/features/data-quality/components/data-quality-completeness";
import { IntegratedCams } from "./integrated-cams";

// ─── Types ──────────────────────────────────────────
type TabKey = "integratedCam" | "configurationManagement";
type SortDir = "asc" | "desc" | null;

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
];

// ─── Main component ─────────────────────────────────
export function ReferenceTable() {
  const [activeTab, setActiveTab] = useState<TabKey>("integratedCam");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState<{ key: string; dir: SortDir }>({
    key: "",
    dir: null,
  });

  const tabs: { key: TabKey; label: string }[] = [
    { key: "integratedCam", label: "Integrated Cam" },
    { key: "configurationManagement", label: "Configuration Management" },
  ];

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

  const columns: { key: keyof DataQualityRow; label: string; className?: string }[] = [
    { key: "date", label: "Date" },
    { key: "ipAddress", label: "IP Address" },
    { key: "region", label: "Region" },
    { key: "vendor", label: "Vendor" },
    { key: "neType", label: "NE Type", className: "w-20" },
    { key: "technology", label: "Technology" },
    { key: "rules", label: "Rules" },
    { key: "totalFiles", label: "Total Files" },
    { key: "category", label: "Category" },
  ];

  const [dateRange, setDateRange] = React.useState<DateTimeRange>({
    from: new Date(2026, 0, 20, 20, 0, 0),
    to: new Date(2026, 0, 24, 20, 0, 0),
  });

  const displayedDataQuality = useMemo(() => {
    switch (activeTab) {
      case "integratedCam":
        return (
          <IntegratedCams
            // columns={columns}
            // data={mockData}
            sort={sort}
            handleSort={handleSort}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            getPageNumbers={getPageNumbers}
            pagedData={pagedData}
            totalPages={totalPages}
          />
        );
      case "configurationManagement":
        return (
          <DataQualityTimeliness
            // columns={columns}
            // data={mockData}
            sort={sort}
            handleSort={handleSort}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            getPageNumbers={getPageNumbers}
            // pagedData={pagedData}
            totalPages={totalPages}
          />
        );

      default:
        return (
          <DataQualityCompleteness
            columns={columns}
            data={mockData}
            sort={sort}
            handleSort={handleSort}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            getPageNumbers={getPageNumbers}
            pagedData={pagedData}
            totalPages={totalPages}
          />
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="rounded-xl bg-card" id="data-quality-table">
      {/* ── Header: Title + Tabs + DatePicker ─────────── */}
      <div className="flex flex-col gap-4 px-6 pb-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-general-foreground">Reference</h2>
          {/* Tabs */}
          <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date time range picker */}
          <DateTimeRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <Separator className="mt-4" />

      {displayedDataQuality}
    </div>
  );
}
