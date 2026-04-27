"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
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
import { cn } from "@/lib/utils";

export type AntColumnType<TData> = {
  title: string;
  dataIndex: string;
  key: string;
  className?: string;
  isNull?: string | React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, record: TData, index: number) => React.ReactNode;
  isSort?: boolean;
};

interface DataTableProps<TData> {
  columns: AntColumnType<TData>[];
  data: TData[];
  paginationStyle?: "simple" | "numbered";
  enableSelection?: boolean;
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  className?: string;
  containerClassName?: string;
  tableClassName?: string;
  multiSort?: boolean;
  totalCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onRowClick?: (record: TData) => void;
}

export function DataTable<TData>({
  columns,
  data,
  paginationStyle = "simple",
  enableSelection = false,
  enableColumnVisibility = false,
  enablePagination = true,
  onSelectionChange,
  className,
  containerClassName,
  tableClassName,
  totalCount,
  pageIndex,
  multiSort,
  pageSize: externalPageSize,
  onPaginationChange,
  onSortingChange,
  onRowClick,
}: DataTableProps<TData>) {
  "use no memo";
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const isManualPagination =
    totalCount !== undefined && onPaginationChange !== undefined;

  const [
    { pageIndex: internalPageIndex, pageSize: internalPageSize },
    setPagination,
  ] = React.useState<PaginationState>({
    pageIndex: pageIndex !== undefined ? pageIndex - 1 : 0,
    pageSize: externalPageSize || 10,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex: isManualPagination
        ? pageIndex
          ? pageIndex - 1
          : 0
        : internalPageIndex,
      pageSize: isManualPagination ? externalPageSize || 10 : internalPageSize,
    }),
    [
      isManualPagination,
      pageIndex,
      externalPageSize,
      internalPageIndex,
      internalPageSize,
    ],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableColumns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultCols: ColumnDef<TData, any>[] = columns.map((col) => {
      return {
        accessorKey: col.dataIndex,
        header: col.isSort
          ? ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={column.getToggleSortingHandler()}
                  className="flex w-full items-center justify-between h-8 px-0 hover:bg-transparent data-[state=open]:bg-transparent"
                >
                  <span className="text-left font-medium">{col.title}</span>
                  {column.getIsSorted() === "desc" ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  ) : column.getIsSorted() === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
                  )}
                </Button>
              );
            }
          : col.title,
        id: col.key,
        enableSorting: col.isSort,
        cell: col.render
          ? ({ row, getValue }) => {
              return col.render!(getValue(), row.original, row.index);
            }
          : ({ getValue }) => {
              const value = getValue();
              const content =
                (value === null || value === undefined || value === "") &&
                col.isNull !== undefined
                  ? col.isNull
                  : (value as React.ReactNode);

              return <div className={col.className}>{content}</div>;
            },
      };
    });

    if (enableSelection) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const selectColumn: ColumnDef<TData, any> = {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center w-[20px]">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center w-[20px]">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      };
      return [selectColumn, ...defaultCols];
    }

    return defaultCols;
  }, [columns, enableSelection]);

  // eslint-disable-next-line react-hooks/incompatible-library -- opted out via "use no memo"
  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater(sorting);
        setSorting(next);
        onSortingChange?.(next);
      } else {
        setSorting(updater);
        onSortingChange?.(updater);
      }
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater(pagination);
        if (isManualPagination) {
          onPaginationChange(next.pageIndex + 1, next.pageSize);
        } else {
          setPagination(next);
        }
      }
    },
    manualPagination: isManualPagination,
    manualSorting: isManualPagination,
    isMultiSortEvent: () => !!multiSort,
    rowCount: isManualPagination ? totalCount : undefined,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const onSelectionChangeRef = React.useRef(onSelectionChange);

  React.useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  React.useEffect(() => {
    if (onSelectionChangeRef.current) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChangeRef.current(selectedRows);
    }
  }, [rowSelection, table]);

  const getPaginationItems = () => {
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const items = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        items.push(1, 2, 3, "ellipsis");
      } else if (currentPage >= totalPages - 2) {
        items.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
      } else {
        items.push(1, "ellipsis", currentPage, "ellipsis", totalPages);
      }
    }
    return items;
  };

  return (
    <div className={cn("w-full", className)}>
      {enableColumnVisibility && (
        <div className="flex items-center py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto"
                suppressHydrationWarning
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className={cn("rounded-md border bg-card", containerClassName)}>
        <Table className={tableClassName}>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "py-3 font-medium text-muted-foreground whitespace-nowrap",
                        !enableSelection && "first:pl-4 last:pr-4",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-muted/30 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-3",
                        !enableSelection && "first:pl-4 last:pr-4",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <div className="flex items-center justify-between py-4 px-4">
          {table.getRowModel().rows?.length > 0 && (
            <>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-foreground font-medium">
                  Rows per page
                </p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger
                    className="h-9 w-[70px] bg-card border-input"
                    suppressHydrationWarning
                  >
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 50, 100].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                {paginationStyle === "simple" ? (
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground disabled:opacity-50 px-2"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {getPaginationItems().map((item, index) =>
                        item === "ellipsis" ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                          >
                            ...
                          </span>
                        ) : (
                          <Button
                            key={item}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8 w-8 min-w-0 p-0 text-sm font-normal text-muted-foreground hover:text-foreground",
                              table.getState().pagination.pageIndex + 1 ===
                                item &&
                                "border border-border/80 bg-muted/20 text-foreground rounded-md",
                            )}
                            onClick={() => table.setPageIndex(Number(item) - 1)}
                          >
                            {item}
                          </Button>
                        ),
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground disabled:opacity-50 px-2"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                ) : (
                  <Pagination className="w-auto mx-0">
                    <PaginationContent className="gap-1">
                      <PaginationItem>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 p-0"
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous Page</span>
                        </Button>
                      </PaginationItem>

                      {getPaginationItems().map((item, index) =>
                        item === "ellipsis" ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationLink
                              href="#"
                              isActive={
                                table.getState().pagination.pageIndex + 1 ===
                                item
                              }
                              className={cn(
                                "h-8 w-8 min-w-0 p-0 border-transparent bg-transparent",
                                table.getState().pagination.pageIndex + 1 ===
                                  item
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : "hover:bg-muted",
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                table.setPageIndex(Number(item) - 1);
                              }}
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}

                      <PaginationItem>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 p-0"
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next Page</span>
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
