"use client";

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useUserStore} from "@/store/userStore";


interface RoleGuardProps {
    children?: React.ReactNode;
    requiredRole?: string;
    requiredFeature?: string;
    requiredOperation?: {
        feature: string;
        operation: string;
    }
    fallback?: React.ReactNode;
}

const RoleGuard = (props: RoleGuardProps) => {
    const router = useRouter();
    const hasRole = useUserStore((state) => state.hasRole);
    const hasFeature = useUserStore((state) => state.hasFeature);
    const hasOperation = useUserStore((state) => state.hasOperation);

    useEffect(() => {
        let hasPermission = true;

        if (props?.requiredRole) {
            hasPermission = hasRole(props?.requiredRole);
        }

        if (props?.requiredFeature) {
            hasPermission = hasPermission && hasFeature(props?.requiredFeature);
        }

        if (props?.requiredOperation) {
            hasPermission = hasPermission && hasOperation(props?.requiredOperation?.feature, props?.requiredOperation?.operation);
        }

        if (!hasPermission) {
            router.push("/");
        }
    }, [props?.requiredRole, props?.requiredFeature, props?.requiredOperation, hasRole, hasFeature, hasOperation, router])

    return (
        <>
            {props?.children}
        </>
    )
}

export default RoleGuard;