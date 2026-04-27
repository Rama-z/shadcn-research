import { UserTable } from "@/features/users/components/user-table";

export function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="mt-1 text-muted-foreground">
          Manage user accounts, roles, and access levels.
        </p>
      </div>
      <UserTable />
    </div>
  );
}
