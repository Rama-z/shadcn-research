import React from "react";

export interface ResourceColumn<T> {
  title: string;
  dataIndex: string;
  key: string;
  className?: string;
  isNull?: string | React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, record: T, index: number) => React.ReactNode;
  isSort?: boolean;
}

export interface ResourceTableProps<T> {
  title: string;
  count?: number;
  countLabel?: string;

  primaryActions?: React.ReactNode[];

  isFilter?: boolean;
  onFilter?: () => void;
  onSearch?: (value: string) => void;
  onSort?: (sorting: { id: string; desc: boolean }[]) => void;
  secondaryActions?: React.ReactNode[];

  columns: ResourceColumn<T>[];
  data: T[];
  onActionClick?: (item: T) => void;
  renderAction?: (
    item: T,
    onActionClick?: (item: T) => void,
  ) => React.ReactNode;
  onDeleteClick?: (item: T) => void;
  deleteLabel?: string | ((item: T) => string);
  deleteClassName?: string | ((item: T) => string);
  onRowClick?: (item: T) => void;
  enableSelection?: boolean;

  total?: number;
  current?: number;
  pageSize?: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
}
