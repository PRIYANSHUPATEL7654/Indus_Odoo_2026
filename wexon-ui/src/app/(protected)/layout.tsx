"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Sidebar } from "@/components/basicComponents/Sidebar";
import { useUserStore } from "@/store/userStore";
import { MainMenuItems, MenuItem } from "@/constants/MenuList";
import {AuthGuard} from "@/components/guards/AuthGuard";
import {usePathname} from "next/navigation";
import {getBreadcrumbData} from "@/helpers/breadcrumb";
import PrimitiveBreadcrumb from "@/components/basicComponents/PrimitiveBreadcrumb";
import {Separator} from "@/components/ui/separator";
import WexonWordmark from "@/components/branding/WexonWordmark";

const filterMenuByRoles = (
    items: MenuItem[],
    hasRole: (roleCode: string) => boolean,
): MenuItem[] => {
    return items
        .filter((item) => {
            if (!item.requiredRoleCodes || item.requiredRoleCodes.length === 0) return true;
            return item.requiredRoleCodes.some(hasRole);
        })
        .map((item) => {
            if (!item.hasSubMenu || !item.subMenu) return item;
            const nextSub = filterMenuByRoles(item.subMenu, hasRole);
            return { ...item, subMenu: nextSub };
        })
        .filter((item) => {
            if (!item.hasSubMenu) return true;
            return (item.subMenu?.length ?? 0) > 0;
        });
};

const ProtectedLayout = ({ children }: { children: React.ReactNode })=> {
    const user = useUserStore((s) => s.user);
    const hasRole = useUserStore((s) => s.hasRole);
    const pathname = usePathname();
    const data = getBreadcrumbData(pathname);
    const menuItems = filterMenuByRoles(MainMenuItems, hasRole);
    return (
        <AuthGuard>
            <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden bg-sidebar">
                    <Sidebar
                        user={user}
                        mainMenuLabel="Main Menu"
                        mainMenuItem={menuItems}
                    />

                    <div className="flex flex-col flex-1 overflow-hidden m-1.5 rounded-lg bg-white">
                        <div className="hidden md:flex overflow-auto w-full border-gray-200 p-3 items-center gap-2">
                            <SidebarTrigger className="ml-2"/>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <PrimitiveBreadcrumb data={data} />
                        </div>
                        <div className="flex md:hidden overflow-auto w-full border-gray-200 p-2.5 items-center gap-1">
                            <SidebarTrigger />
                            <div className="flex overflow-auto w-full -ml-5 justify-center items-center gap-1">
                                <WexonWordmark size="sm" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto w-full h-full px-4 py-4 md:py-2">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </AuthGuard>
    );
}

export default ProtectedLayout;
