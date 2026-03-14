import {
    Building2,
    Boxes,
    PackageSearch,
    LucideIcon,
    Home,
    History,
    Package,
    Warehouse,
    MapPin,
    Database, PackagePlus, PackageMinus, ArrowLeftRight, SlidersHorizontal, Users
} from 'lucide-react';

export interface MenuItem {
    menuLabel: string;
    menuIcon: LucideIcon;
    menuLink: string;
    badge?: number;
    hasSubMenu?: boolean;
    subMenu?: MenuItem[];
    requiredRoleCodes?: string[];
}

export const MainMenuItems: MenuItem[] = [
    {
        menuLabel: "Dashboard",
        menuIcon: Home,
        menuLink: "/dashboard",
        hasSubMenu: false,
    },
    {
        menuLabel: "Move History",
        menuIcon: History,
        menuLink: "/move-history",
        hasSubMenu: false,
    },
    {
        menuLabel: "Warehouse",
        menuIcon: Warehouse,
        menuLink: "/warehouse/list",
        hasSubMenu: false,
    },
    {
        menuLabel: "Locations",
        menuIcon: MapPin,
        menuLink: "/locations/list",
        hasSubMenu: false,
    },
    {
        menuLabel: "Operations",
        menuIcon: Boxes,
        menuLink: "/inventory/manage",
        hasSubMenu: true,
        subMenu: [
            {
                menuLabel: "All Operations",
                menuIcon: PackageSearch,
                menuLink: "/inventory/manage",
            },
            {
                menuLabel: "Receipts (Incoming)",
                menuIcon: PackagePlus,
                menuLink: "/operations/receipts/create",
            },
            {
                menuLabel: "Delivery Orders (Outgoing)",
                menuIcon: PackageMinus,
                menuLink: "/operations/delivery-orders/create",
            },
            {
                menuLabel: "Internal Transfers",
                menuIcon: ArrowLeftRight,
                menuLink: "/operations/internal-transfers/create",
            },
            {
                menuLabel: "Inventory Adjustments",
                menuIcon: SlidersHorizontal,
                menuLink: "/operations/adjustments/create",
            },
        ],
    },
    // {
    //     menuLabel: "Ledger",
    //     menuIcon: BookMinus,
    //     menuLink: "/ledger",
    //     hasSubMenu: true,
    //     subMenu: [
    //         {
    //             menuLabel: "Company Ledger",
    //             menuIcon: Building2,
    //             menuLink: "/ledger/company",
    //         },
    //         {
    //             menuLabel: "Client Ledger",
    //             menuIcon: Contact2,
    //             menuLink: "/ledger/client",
    //         },
    //     ],
    // },
    // {
    //     menuLabel: "Reports",
    //     menuIcon: Notebook,
    //     menuLink: "/reports/list",
    //     hasSubMenu: false,
    // },
    {
        menuLabel: "Master Entities",
        menuIcon: Database,
        hasSubMenu: true,
        menuLink: "",
        subMenu: [
            {
                menuLabel: "Product Management",
                menuIcon: Package,
                menuLink: "/product/list",
            },
            {
                menuLabel: "Vendors / Parties",
                menuIcon: Building2,
                menuLink: "/vendor/list",
            }
        ],
    },
    {
        menuLabel: "Admin",
        menuIcon: Users,
        hasSubMenu: true,
        menuLink: "",
        requiredRoleCodes: ["SUPER_ADMIN"],
        subMenu: [
            {
                menuLabel: "User Management",
                menuIcon: Users,
                menuLink: "/users/list",
            },
        ],
    },
];
