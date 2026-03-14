"use client";

import React from "react";
import PageTitle from "@/components/basicComponents/PageTitle";
import { User } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfilePage = () => {
  const user = useUserStore((s) => s.user);

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="My Profile"
        description="View your account details."
        startIcon={User}
      />

      <Card className="max-w-[600px]">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <div className="text-sm text-muted-foreground">Full Name</div>
            <div className="font-medium">{user?.fullName ?? "-"}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="font-medium">{user?.email ?? "-"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

