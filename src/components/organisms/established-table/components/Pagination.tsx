import { MoreHorizontal } from "lucide-react";

import * as Components from "@/components";

import { TPaginationProps } from "../types";

export function Pagination({
  rowsPerPage,
  setRowsPerPage,
  setCurrentPage,
  currentPage,
  getPageNumbers,
  totalPages,
}: TPaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Rows per page</span>
        <Components.Select
          value={String(rowsPerPage)}
          onValueChange={(val) => {
            setRowsPerPage(Number(val));
            setCurrentPage(1);
          }}
        >
          <Components.SelectTrigger className="h-8 w-[70px]">
            <Components.SelectValue />
          </Components.SelectTrigger>
          <Components.SelectContent>
            {[5, 10, 20, 50].map((n) => (
              <Components.SelectItem key={n} value={String(n)}>
                {n}
              </Components.SelectItem>
            ))}
          </Components.SelectContent>
        </Components.Select>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <Components.Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        >
          Previous
        </Components.Button>

        {getPageNumbers().map((page, idx) =>
          page === "ellipsis" ? (
            <Components.Button key={`e-${idx}`} variant="ghost" size="sm" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Components.Button>
          ) : (
            <Components.Button
              key={page}
              variant={page === currentPage ? "outline" : "ghost"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? "shadow-xs border-border" : ""}
            >
              {page}
            </Components.Button>
          )
        )}

        <Components.Button
          variant="ghost"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        >
          Next
        </Components.Button>
      </div>
    </div>
  );
}
