import { PermissionTable } from "@/features/permissions/components/permission-table";

export function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Permission Management</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage system permissions across modules.
        </p>
      </div>
      <PermissionTable />
    </div>
  );
}
