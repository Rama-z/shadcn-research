import { ArrowUpDown } from "lucide-react";

import { TSortDir } from "../types";

export function SortableHeader({
  label,
  sortKey,
  onSort,
}: {
  label: string;
  sortKey: string;
  currentSort: { key: string; dir: TSortDir };
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
