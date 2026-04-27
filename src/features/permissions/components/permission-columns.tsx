import type { ColumnDef } from "@tanstack/react-table";
import type { Permission } from "@/types";
import { Badge } from "@/components/ui/badge";

export const permissionColumns: ColumnDef<Permission>[] = [
  {
    accessorKey: "name",
    header: "Permission",
    cell: ({ row }) => (
      <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{row.original.name}</code>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.description}</span>,
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => <Badge variant="secondary">{row.original.module}</Badge>,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.original.action;
      const variant =
        action === "create"
          ? "success"
          : action === "read"
            ? "default"
            : action === "update"
              ? "warning"
              : "destructive";
      return (
        <Badge variant={variant} className="capitalize">
          {action}
        </Badge>
      );
    },
  },
];
