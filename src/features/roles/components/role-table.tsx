import { DataTable } from "@/components/composite/data-table";
import { roleColumns } from "./role-columns";
import { useRoles } from "../hooks/use-roles";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function RoleTable() {
  const { data: roles, isLoading } = useRoles();

  return (
    <DataTable
      columns={roleColumns}
      data={roles ?? []}
      isLoading={isLoading}
      searchKey="name"
      searchPlaceholder="Search roles..."
      toolbar={
        <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
          <Plus className="h-4 w-4" />
          Add Role
        </Button>
      }
    />
  );
}
