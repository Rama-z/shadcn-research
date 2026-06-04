import { TFilterOptions, TFilters } from "@/shared";
import { METADATA_FILTER_OPTIONS } from "@/shared/constant/filterContent";
import { TTableColumn } from "@/shared/types/global-types";
// import { FILTER_OPTIONS } from "./components/FilterSheet";

// ─── Types ──────────────────────────────────────────
export type TSortDir = "asc" | "desc" | null;

export interface IDataQualityRow {
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

export interface IFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: TFilters<TFilterOptions>;
  onApply: (filters: TFilters<TFilterOptions>) => void;
  emptyFilter: TFilters<TFilterOptions>;
  filterOptions: TFilterOptions;
}

export type TEstablishedTableProps<T> = {
  columns: TTableColumn<T>[];
  sort: { key: string; dir: TSortDir };
  handleSort: (key: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  getPageNumbers: () => (number | "ellipsis")[];
  pagedData: IDataQualityRow[];
  totalPages: number;
  emptyFilter: TFilters<TFilterOptions>;
  filterOptions: TFilterOptions;
};

// -- Filter Sheet --

export type TFilterKey = keyof typeof METADATA_FILTER_OPTIONS;
