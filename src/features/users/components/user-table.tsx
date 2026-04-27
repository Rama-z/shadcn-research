import { useState, useMemo } from "react";
import { DataTable } from "@/components/composite/data-table";
import { Button } from "@/components/ui/button";
import { getUserColumns } from "./user-columns";
import { useUsers, useDeleteUser } from "../hooks/use-users";
import { UserFormDialog } from "./user-form-dialog";
import { UserDetailDialog } from "./user-detail-dialog";
import type { User } from "@/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function UserTable() {
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const columns = useMemo(
    () =>
      getUserColumns({
        onView: (user) => {
          setSelectedUser(user);
          setIsDetailOpen(true);
        },
        onEdit: (user) => {
          setEditingUser(user);
          setIsFormOpen(true);
        },
        onDelete: (user) => {
          deleteUser.mutate(user.id, {
            onSuccess: () => toast.success(`${user.name} has been deleted`),
            onError: () => toast.error("Failed to delete user"),
          });
        },
      }),
    [deleteUser]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={users ?? []}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search users..."
        toolbar={
          <Button
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        }
      />

      <UserFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} user={editingUser} />

      <UserDetailDialog open={isDetailOpen} onOpenChange={setIsDetailOpen} user={selectedUser} />
    </>
  );
}
