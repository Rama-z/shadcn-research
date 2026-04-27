import { DataTable } from "@/components/composite/data-table";
import { permissionColumns } from "./permission-columns";
import { usePermissions } from "../hooks/use-permissions";

export function PermissionTable() {
  const { data: permissions, isLoading } = usePermissions();

  return (
    <DataTable
      columns={permissionColumns}
      data={permissions ?? []}
      isLoading={isLoading}
      searchKey="name"
      searchPlaceholder="Search permissions..."
    />
  );
}
