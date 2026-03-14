"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRoleList } from "@/api/role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { UserDTO, UserRole } from "@/type/user";
import { toast } from "sonner";

type UserUpsertFormProps = {
  mode: "create" | "edit";
  initialUser?: UserDTO | null;
  isSaving?: boolean;
  onSubmit: (payload: {
    fullName: string;
    email: string;
    mobileNumber: string;
    password?: string;
    roleIds: string[];
  }) => void;
};

const normalizeRoleId = (user?: UserDTO | null) => {
  const first = user?.roles?.[0];
  return first?.id ?? "";
};

export default function UserUpsertForm({
  mode,
  initialUser,
  isSaving = false,
  onSubmit,
}: UserUpsertFormProps) {
  const [fullName, setFullName] = useState(initialUser?.fullName ?? "");
  const [email, setEmail] = useState(initialUser?.email ?? "");
  const [mobileNumber, setMobileNumber] = useState(initialUser?.mobileNumber ?? "");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(normalizeRoleId(initialUser));

  useEffect(() => {
    if (!initialUser) return;
    setFullName(initialUser.fullName ?? "");
    setEmail(initialUser.email ?? "");
    setMobileNumber(initialUser.mobileNumber ?? "");
    setRoleId(normalizeRoleId(initialUser));
    setPassword("");
  }, [initialUser]);

  const { data: rolesResponse, isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res: any = await getRoleList();
      return res?.data ?? [];
    },
  });

  const roles: UserRole[] = useMemo(() => rolesResponse ?? [], [rolesResponse]);

  const submit = () => {
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.trim().length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }
    if (!roleId) {
      toast.error("Role is required");
      return;
    }
    if (mode === "create" && password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (mode === "edit" && password.trim() && password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      mobileNumber: mobileNumber.trim(),
      roleIds: roleId ? [roleId] : [],
      ...(mode === "create"
        ? { password: password.trim() }
        : password.trim()
          ? { password: password.trim() }
          : {}),
    };

    onSubmit(payload);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobileNumber">Mobile number</Label>
          <Input
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit number"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@company.com"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">
            Password{" "}
            {mode === "edit" && (
              <span className="text-muted-foreground font-normal">
                (leave blank to keep unchanged)
              </span>
            )}
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "create" ? "Min 6 characters" : "Optional"}
          />
        </div>

        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={roleId} onValueChange={setRoleId} disabled={isRolesLoading}>
            <SelectTrigger className={cn("w-full", isRolesLoading && "opacity-70")}>
              <SelectValue placeholder={isRolesLoading ? "Loading..." : "Select role"} />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.roleName} ({r.roleCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={submit} disabled={isSaving}>
        {isSaving ? "Saving..." : mode === "create" ? "Create User" : "Update User"}
      </Button>
    </div>
  );
}
