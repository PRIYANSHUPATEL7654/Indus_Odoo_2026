"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserCog } from "lucide-react";
import PageTitle from "@/components/basicComponents/PageTitle";
import { getUser, updateUser } from "@/api/user";
import UserUpsertForm from "@/components/users/UserUpsertForm";
import { useUserStore } from "@/store/userStore";
import type { UserDTO } from "@/type/user";

const UsersEditPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const isSuperAdmin = useUserStore((s) => s.hasRole("SUPER_ADMIN"));

  useEffect(() => {
    if (!isSuperAdmin) router.replace("/dashboard");
  }, [isSuperAdmin, router]);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res: any = await getUser(id);
      return (res?.data ?? null) as UserDTO | null;
    },
    enabled: Boolean(id) && isSuperAdmin,
  });

  const { mutate: onSave, isPending: isSaving } = useMutation({
    mutationFn: async (payload: any) => {
      const res: any = await updateUser(id, payload);
      return res?.data;
    },
    onSuccess: () => {
      toast.success("User updated");
      router.push("/users/list");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update user");
    },
  });

  if (!isSuperAdmin) return null;

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Edit User"
        description="Update user details and role."
        startIcon={UserCog}
      />

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : (
        <UserUpsertForm mode="edit" initialUser={user} isSaving={isSaving} onSubmit={onSave} />
      )}
    </div>
  );
};

export default UsersEditPage;

