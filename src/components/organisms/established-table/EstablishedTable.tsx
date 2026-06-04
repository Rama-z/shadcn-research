import { ListFilter, Search } from "lucide-react";

import * as Components from "@/components";
import { TFilterOptions, TFilters } from "@/shared";

import useEstablishedTable from "./hooks";
import { TEstablishedTableProps } from "./types";
import { CompletionBar, FilterSheet, Pagination, SortableHeader } from "./components";

export function EstablishedTable<T>({ ...props }: TEstablishedTableProps<T>) {
  const { filterSheetOpen, setFilterSheetOpen, filters, setFilters } = useEstablishedTable({
    ...props,
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <Components.Input
            placeholder="IP Address or Total Files..."
            value={props.searchQuery}
            onChange={(e) => {
              props.setSearchQuery(e.target.value);
              props.setCurrentPage(1);
            }}
            className="pr-9"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
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

      {/* ── Table ────────────────────────────────────── */}
      <div className="mx-6 overflow-hidden rounded-xl border border-border">
        <Components.Table>
          <Components.TableHeader>
            <Components.TableRow className="hover:bg-transparent">
              {props.columns.map((col) => (
                <Components.TableHead key={col.key as string} className={col.className}>
                  <SortableHeader
                    label={col.label}
                    sortKey={col.key as string}
                    currentSort={props.sort}
                    onSort={props.handleSort}
                  />
                </Components.TableHead>
              ))}
              <Components.TableHead>
                <SortableHeader
                  label="Completion"
                  sortKey="completion"
                  currentSort={props.sort}
                  onSort={props.handleSort}
                />
              </Components.TableHead>
            </Components.TableRow>
          </Components.TableHeader>
          <Components.TableBody>
            {props.pagedData.length === 0 ? (
              <Components.TableRow>
                <Components.TableCell
                  colSpan={props.columns.length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </Components.TableCell>
              </Components.TableRow>
            ) : (
              props.pagedData.map((row) => (
                <Components.TableRow key={row.id}>
                  {props.columns.map((col) => (
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
        <Pagination {...props} />
      </div>

      <FilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={filters as TFilters<TFilterOptions>}
        onApply={setFilters}
        emptyFilter={props.emptyFilter}
        filterOptions={props.filterOptions}
      />
    </>
  );
}
