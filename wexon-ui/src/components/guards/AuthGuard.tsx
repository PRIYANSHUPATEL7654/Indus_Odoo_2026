"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { deleteTokenCookie, getTokenCookie } from "@/helpers/tokenCookie";
import { getCurrentUser } from "@/api/getCurrentUser";
import { useQuery } from "@tanstack/react-query";
import GlobalLoading from "@/app/loading";

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard = (
    { children } : AuthGuardProps
) => {
    const router = useRouter();
    const setUser = useUserStore((s) => s.setUser);

    // Get token from cookies
    const tokenCookie = getTokenCookie();

    // Fetch current logged-in user
    // Enabled only if token exists → prevents unnecessary 401 API calls
    const { data, isLoading, isError } = useQuery(
        {
            queryKey: ["currentUser"],
            queryFn: async () => {
                const response = await getCurrentUser();
                return response?.data;
            },
            enabled: !!tokenCookie,
            retry: false, // No retry on 401/403
        }
    );

    useEffect(() => {

        // No token → redirect to login
        if (!tokenCookie) {
            router.push('/login');
            return;
        }

        // API returned error → token invalid or expired
        if (isError) {
            // Clear invalid token
            deleteTokenCookie();
            router.push('/login');
            return;
        }

        // User fetched successfully → store in global state
        if (data) {
            setUser(data);
        }

    }, [tokenCookie, isError, data]);

    // Show loading until auth check is completed
    if (!tokenCookie) return <GlobalLoading />;
    if (isLoading) return <GlobalLoading />;

    // Authenticated → render protected content
    return <>{children}</>;
};
