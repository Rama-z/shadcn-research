import { RoleTable } from "@/features/roles/components/role-table";

export function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
        <p className="mt-1 text-muted-foreground">
          Configure roles and their associated permissions.
        </p>
      </div>
      <RoleTable />
    </div>
  );
}
