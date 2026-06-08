import { useState } from "react";
import { ListFilter, Search, Settings } from "lucide-react";

import { cn } from "@/lib";
import * as Components from "@/components";
import { TFilterOptions, TFilters, TTableColumn } from "@/shared";

import useEstablishedTable from "./hooks";
import { TEstablishedTableProps } from "./types";
import { CompletionBar, FilterSheet, Pagination, SortableHeader, TableOptions } from "./components";

export function EstablishedTable<T>({
  showTableOptions = false,
  ...props
}: TEstablishedTableProps<T>) {
  const {
    sort,
    filters,
    pagedData,
    handleSort,
    setFilters,
    totalPages,
    isCollapsed,
    rowsPerPage,
    currentPage,
    searchQuery,
    setSearchQuery,
    setRowsPerPage,
    setCurrentPage,
    getPageNumbers,
    filterSheetOpen,
    tableOptionsOpen,
    setFilterSheetOpen,
    setTableOptionsOpen,
  } = useEstablishedTable({
    ...props,
  });

  // Column visibility state — starts with all columns from props
  const [visibleColumns, setVisibleColumns] = useState<TTableColumn<T>[]>(props.columns);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <Components.Input
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
        <div className="flex items-center gap-2">
          <Components.Button
            variant="outline"
            size="default"
            className={cn("gap-2", { hidden: !showTableOptions })}
            onClick={() => setTableOptionsOpen(true)}
          >
            <Settings className="h-4 w-4" />
            Table Options
          </Components.Button>
          <Components.Button
            variant="outline"
            size="default"
            className="gap-2"
            onClick={() => setFilterSheetOpen(true)}
          >
            <ListFilter className="h-4 w-4" />
            Filter
          </Components.Button>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────── */}
      <div
        className={cn(
          "mx-6 overflow-hidden rounded-xl border border-border",
          isCollapsed ? "w-[calc(100vw-11.9rem)]" : "w-[calc(100vw-22.5rem)]"
        )}
      >
        <Components.Table>
          <Components.TableHeader>
            <Components.TableRow className="hover:bg-transparent">
              {visibleColumns.map((col) => (
                <Components.TableHead key={col.key as string} className={col.className}>
                  <SortableHeader
                    label={col.label}
                    sortKey={col.key as string}
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </Components.TableHead>
              ))}
              <Components.TableHead>
                <SortableHeader
                  label="Completion"
                  sortKey="completion"
                  currentSort={sort}
                  onSort={handleSort}
                />
              </Components.TableHead>
            </Components.TableRow>
          </Components.TableHeader>
          <Components.TableBody>
            {pagedData.length === 0 ? (
              <Components.TableRow>
                <Components.TableCell
                  colSpan={visibleColumns.length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </Components.TableCell>
              </Components.TableRow>
            ) : (
              pagedData.map((row) => (
                <Components.TableRow key={row.id}>
                  {visibleColumns.map((col) => (
                    <Components.TableCell key={col.key as string} className="text-sm">
                      {row[col.key as keyof typeof row]}
                    </Components.TableCell>
                  ))}
                  <Components.TableCell>
                    <CompletionBar value={row.completion} />
                  </Components.TableCell>
                </Components.TableRow>
              ))
            )}
          </Components.TableBody>
        </Components.Table>
        <Pagination
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          getPageNumbers={getPageNumbers}
          totalPages={totalPages}
          pagedData={pagedData}
        />
      </div>

      <FilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={filters as TFilters<TFilterOptions>}
        onApply={setFilters}
        emptyFilter={props.emptyFilter}
        filterOptions={props.filterOptions}
      />
      <TableOptions
        open={tableOptionsOpen}
        onOpenChange={setTableOptionsOpen}
        columns={props.columns}
        onApply={setVisibleColumns}
      />
    </>
  );
}
