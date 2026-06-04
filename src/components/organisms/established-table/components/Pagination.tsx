import { MoreHorizontal } from "lucide-react";

import * as Components from "@/components";

import { TEstablishedTableProps } from "../types";

export function Pagination({ ...props }: TEstablishedTableProps<any>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Rows per page</span>
        <Components.Select
          value={String(props.rowsPerPage)}
          onValueChange={(val) => {
            props.setRowsPerPage(Number(val));
            props.setCurrentPage(1);
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
          disabled={props.currentPage <= 1}
          onClick={() => props.setCurrentPage(Math.max(1, props.currentPage - 1))}
        >
          Previous
        </Components.Button>

        {props.getPageNumbers().map((page, idx) =>
          page === "ellipsis" ? (
            <Components.Button key={`e-${idx}`} variant="ghost" size="sm" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Components.Button>
          ) : (
            <Components.Button
              key={page}
              variant={page === props.currentPage ? "outline" : "ghost"}
              size="sm"
              onClick={() => props.setCurrentPage(page)}
              className={page === props.currentPage ? "shadow-xs border-border" : ""}
            >
              {page}
            </Components.Button>
          )
        )}

        <Components.Button
          variant="ghost"
          size="sm"
          disabled={props.currentPage >= props.totalPages}
          onClick={() => props.setCurrentPage(Math.min(props.totalPages, props.currentPage + 1))}
        >
          Next
        </Components.Button>
      </div>
    </div>
  );
}
