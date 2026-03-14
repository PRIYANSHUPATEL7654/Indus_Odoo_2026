"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import PageTitle from "@/components/basicComponents/PageTitle";
import { createUser } from "@/api/user";
import UserUpsertForm from "@/components/users/UserUpsertForm";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";

const UsersAddPage = () => {
  const router = useRouter();
  const isSuperAdmin = useUserStore((s) => s.hasRole("SUPER_ADMIN"));

  useEffect(() => {
    if (!isSuperAdmin) router.replace("/dashboard");
  }, [isSuperAdmin, router]);

  const { mutate: onSave, isPending: isSaving } = useMutation({
    mutationFn: async (payload: any) => {
      const res: any = await createUser(payload);
      return res?.data;
    },
    onSuccess: () => {
      toast.success("User created");
      router.push("/users/list");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create user");
    },
  });

  if (!isSuperAdmin) return null;

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Create User"
        description="Add a new user and assign role."
        startIcon={UserPlus}
      />

      <UserUpsertForm mode="create" isSaving={isSaving} onSubmit={onSave} />
      <Button variant="outline" onClick={() => router.push("/users/list")}>
        Back
      </Button>
    </div>
  );
};

export default UsersAddPage;
