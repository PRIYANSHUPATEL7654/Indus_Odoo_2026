"use client";

import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {
    Sidebar as ShadCNSidebar,
    SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu, SidebarMenuBadge, SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar
} from "@/components/ui/sidebar";
import {ChevronRight, EllipsisVertical, LogOut, LucideIcon, Search, User as UserIcon} from "lucide-react";
import {Kbd} from "@/components/ui/kbd";
import {User, useUserStore} from "@/store/userStore";
import {MenuItem} from "@/constants/MenuList";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {deleteTokenCookie} from "@/helpers/tokenCookie";
import WexonWordmark from "@/components/branding/WexonWordmark";



interface SidebarProps {
    user: User | null;
    mainMenuLabel: string;
    mainMenuItem: MenuItem[];
}


export const Sidebar = (props: SidebarProps) => {
    const userRoles = props.user?.roles;
    const { isMobile } = useSidebar()
    const router = useRouter();

    return (
        <ShadCNSidebar collapsible="icon" className="group/sidebar !border-r-0">
            <SidebarHeader className="px-0 pb-1">
                <SidebarMenu className="flex items-center w-full justify-center flex-col">
                    <SidebarMenuItem className="flex items-center justify-center w-full py-[9.7px] gap-2">
                        <div className="group-data-[state=collapsed]:hidden">
                            <WexonWordmark size="sm" />
                        </div>
                        <span className="text-xl font-semibold tracking-[0.18em] group-data-[state=expanded]:hidden">
                            W
                        </span>
                    </SidebarMenuItem>

                    {
                        !isMobile && (
                            <SidebarMenuItem className="w-full group-data-[state=collapsed]:hidden px-2 pt-3 ">
                                <InputGroup className="bg-white">
                                    <InputGroupAddon>
                                        <Search className="h-4 w-4" />
                                    </InputGroupAddon>
                                    <InputGroupInput placeholder="Search..."/>
                                    <InputGroupAddon align="inline-end">
                                        <Kbd>⌘K</Kbd>
                                    </InputGroupAddon>
                                </InputGroup>
                            </SidebarMenuItem>
                        )
                    }
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className="pt-0">
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarMenu className="flex w-full flex-col group-data-[state=collapsed]:items-center ">
                        {
                            props?.mainMenuItem.map((menuItem, index) => {
                                const Icon : LucideIcon = menuItem?.menuIcon;

                                if (!menuItem.hasSubMenu) {
                                    return (
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton tooltip={menuItem.menuLabel} asChild>
                                                <Link href={menuItem.menuLink}>
                                                    <Icon />
                                                    <span className="mr-auto">{menuItem.menuLabel}</span>
                                                    { menuItem.badge && <SidebarMenuBadge>{menuItem.badge}</SidebarMenuBadge> }
                                                    { menuItem.hasSubMenu && <ChevronRight />}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                }

                                return (
                                    <Collapsible
                                        key={index}
                                        defaultOpen={false}
                                        asChild
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={menuItem.menuLabel}>
                                                    <Icon />
                                                    <span className="mr-auto">{menuItem.menuLabel}</span>
                                                    { menuItem.badge && <SidebarMenuBadge>{menuItem.badge}</SidebarMenuBadge> }
                                                    { menuItem.hasSubMenu && <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>

                                            {
                                                menuItem.hasSubMenu && (
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {
                                                                menuItem.subMenu?.map((subMenuItem, index) => {
                                                                    const SubIcon : LucideIcon = subMenuItem.menuIcon;

                                                                    return(
                                                                        <SidebarMenuSubItem key={index}>
                                                                            <SidebarMenuSubButton asChild>
                                                                                <Link href={subMenuItem.menuLink}>
                                                                                    <SubIcon />
                                                                                    <span>{subMenuItem.menuLabel}</span>
                                                                                </Link>
                                                                            </SidebarMenuSubButton>
                                                                        </SidebarMenuSubItem>
                                                                    )
                                                                })
                                                            }
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                )
                                            }
                                        </SidebarMenuItem>
                                    </Collapsible>
                                )
                            })
                        }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center justify-center flex-col pb-2 w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg grayscale text-white">
                                        <AvatarImage src={""} alt={props.user?.fullName ?? ""} />
                                        <AvatarFallback className="rounded-full bg-black">
                                            {props.user?.fullName?.charAt(0) ?? "U"}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[state=collapsed]/sidebar:hidden">
                                        <span className="truncate font-medium">{props.user?.fullName}</span>
                                        <span className="text-muted-foreground truncate text-xs">
                                            {props.user?.email}
                                        </span>
                                    </div>

                                    <EllipsisVertical className="ml-auto size-4 group-data-[state=collapsed]/sidebar:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={isMobile ? "top" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={""} alt={props.user?.fullName ?? ""} />
                                            <AvatarFallback className="rounded-lg">
                                                {props.user?.fullName?.charAt(0) ?? "U"}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{props.user?.fullName}</span>
                                            <span className="text-muted-foreground truncate text-xs">
                                              {props.user?.email}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => {
                                        router.push('/profile');
                                    }}
                                >
                                    <UserIcon className="mr-2" />
                                    My Profile
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => {
                                        useUserStore.getState().logout();
                                        deleteTokenCookie();
                                        router.push('/login');
                                    }}
                                >
                                    <LogOut className="mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </ShadCNSidebar>
    )
}
