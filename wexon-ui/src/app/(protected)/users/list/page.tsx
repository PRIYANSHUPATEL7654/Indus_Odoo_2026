"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, UserCog } from "lucide-react";
import PageTitle from "@/components/basicComponents/PageTitle";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { deleteUser, getUserList } from "@/api/user";
import type { UserDTO } from "@/type/user";

const UserListPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isSuperAdmin = useUserStore((s) => s.hasRole("SUPER_ADMIN"));

  const { data, isLoading } = useQuery({
    queryKey: ["user-list"],
    queryFn: async () => {
      const res: any = await getUserList();
      return (res?.data ?? []) as UserDTO[];
    },
    enabled: isSuperAdmin,
  });

  const { mutate: onDelete, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const res: any = await deleteUser(id);
      return res?.data;
    },
    onSuccess: async () => {
      toast.success("User deleted");
      await queryClient.invalidateQueries({ queryKey: ["user-list"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete user");
    },
  });

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col gap-4">
        <PageTitle
          title="User Management"
          description="You don’t have access to manage users."
          startIcon={UserCog}
        />
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  const users = data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="User Management"
        description="Create, update, and remove users."
        startIcon={UserCog}
        actions={
          <Button asChild>
            <Link href="/users/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Link>
          </Button>
        }
      />

      <div className="rounded-lg border overflow-auto">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead className="pl-6">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="pl-6 font-medium">{u.fullName}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.mobileNumber}</TableCell>
                  <TableCell>{u.roles?.map((r) => r.roleCode).join(", ") || "-"}</TableCell>
                  <TableCell className="text-right pr-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/users/edit/${u.id}`}>Edit</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={() => {
                          const ok = window.confirm(`Delete user "${u.fullName}"?`);
                          if (!ok) return;
                          onDelete(u.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserListPage;

