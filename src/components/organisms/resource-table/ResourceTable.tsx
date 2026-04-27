import { MoreVertical, Search } from "lucide-react";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  type AntColumnType,
  DataTable as BaseDataTable,
} from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { ResourceTableProps } from "@/types/resource-table";

export function ResourceTable<T extends { id: string }>(
  props: ResourceTableProps<T>,
) {
  const { t } = useTranslation();
  const {
    title,
    count,
    countLabel,
    primaryActions,
    onSearch,
    columns,
    data,
    onActionClick,
    onDeleteClick,
    onRowClick,
    enableSelection = false,
    secondaryActions,
  } = props;

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  React.useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchValue);
    }
  }, [debouncedSearchValue, onSearch]);

  const displayCount = count ?? props.total ?? data.length;

  const tableColumns: AntColumnType<T>[] = columns.map((col) => {
    return {
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.key,
      className: col.className,
      isNull: col.isNull,
      render: col.render,
      isSort: col.isSort,
    };
  });

  if (onActionClick) {
    tableColumns.push({
      title: t("common.actions"),
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div
          className="flex justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="h-8 w-8 p-0 hover:bg-muted/50"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => onActionClick(record as T)}
              >
                <span>{t("common.edit")}</span>
              </DropdownMenuItem>
              {("status" in record
                ? (record as { status?: string }).status?.toUpperCase()
                : undefined) !== "PENDING" && (
                <DropdownMenuItem
                  className={cn(
                    "gap-2 cursor-pointer",
                    typeof props.deleteClassName === "function"
                      ? props.deleteClassName(record as T)
                      : props.deleteClassName || "text-destructive",
                  )}
                  onClick={() => onDeleteClick?.(record as T)}
                >
                  <span>
                    {typeof props.deleteLabel === "function"
                      ? props.deleteLabel(record as T)
                      : props.deleteLabel || t("common.delete")}
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-between items-center px-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <div className="flex items-center gap-3">
          {primaryActions?.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col">
        <div className="flex flex-row justify-between items-center h-16 px-4 border-b">
          <p className="text-sm font-semibold text-muted-foreground">
            <Trans
              i18nKey="resourceTable.totalCount"
              values={{
                count: displayCount,
                label: countLabel || t("common.items"),
              }}
              components={[
                <span
                  key="count"
                  className="text-[#1B5EBF] dark:text-blue-400 font-bold"
                />,
              ]}
            />
          </p>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search")}
                className="pl-9 bg-background h-10 w-96 shadow-sm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            {secondaryActions?.map((action, index) => (
              <React.Fragment key={index}>{action}</React.Fragment>
            ))}
          </div>
        </div>

        <BaseDataTable
          columns={tableColumns}
          data={data}
          paginationStyle="simple"
          enableSelection={enableSelection}
          multiSort={false}
          containerClassName="border-0 shadow-none rounded-none"
          onRowClick={onRowClick}
          totalCount={props.total ?? props.count}
          pageIndex={props.current}
          pageSize={props.pageSize}
          onPaginationChange={props.onPaginationChange}
          onSortingChange={props.onSort}
        />
      </div>
    </div>
  );
}
