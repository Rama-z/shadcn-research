import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ListFilter, MoreHorizontal, Search } from "lucide-react";

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

export function DataQualityCompleteness({
  columns,
  sort,
  handleSort,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  getPageNumbers,
  pagedData,
  totalPages,
}: {
  data: DataQualityRow[];
  columns: { key: string; label: string; className?: string }[];
  sort: { key: string; dir: SortDir };
  handleSort: (key: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  getPageNumbers: () => (number | "ellipsis")[];
  pagedData: DataQualityRow[];
  totalPages: number;
}) {
  // ─── Completion bar sub-component ───────────────────
  function CompletionBar({ value }: { value: number }) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-violet-500 transition-all"
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{value}%</span>
      </div>
    );
  }

  // ─── Sortable header sub-component ──────────────────
  function SortableHeader({
    label,
    sortKey,
    onSort,
  }: {
    label: string;
    sortKey: string;
    currentSort: { key: string; dir: SortDir };
    onSort: (key: string) => void;
  }) {
    return (
      <button
        className="flex items-center gap-1 font-medium text-foreground transition-colors hover:text-foreground/80"
        onClick={() => onSort(sortKey)}
      >
        {label}
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    );
  }

  return (
    <div>
      {/* ── Toolbar: Search + Filter ─────────────────── */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-4">
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <Input
            placeholder="IP Address or Total Files..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pr-9"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button variant="outline" size="default" className="gap-2">
          <ListFilter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* ── Table ────────────────────────────────────── */}
      <div className="mx-6 overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  <SortableHeader
                    label={col.label}
                    sortKey={col.key}
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </TableHead>
              ))}
              <TableHead>
                <SortableHeader
                  label="Completion"
                  sortKey="completion"
                  currentSort={sort}
                  onSort={handleSort}
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-sm">
                      {row[col.key as keyof typeof row]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <CompletionBar value={row.completion} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ───────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Rows per page</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(val) => {
              setRowsPerPage(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            Previous
          </Button>

          {getPageNumbers().map((page, idx) =>
            page === "ellipsis" ? (
              <Button key={`e-${idx}`} variant="ghost" size="sm" disabled>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "outline" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? "shadow-xs border-border" : ""}
              >
                {page}
              </Button>
            )
          )}

          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
