"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTokenCookie } from "@/helpers/tokenCookie";
import GlobalLoading from "@/app/loading";

interface PublicGuardProps {
    children: React.ReactNode;
}

export const PublicGuard = ({ children }: PublicGuardProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getTokenCookie();
        if (token) {
            router.replace("/dashboard");
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <GlobalLoading /> ;

    return <>{children}</>;
};
