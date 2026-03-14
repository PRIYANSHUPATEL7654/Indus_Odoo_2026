

export interface Breadcrumb {
    label: string;
    link?: string;
    dynamic?: boolean;
}

export const BreadcrumbList: Record<string, Breadcrumb[]> = {

    "/vendor/list": [
        {
            label: "Vendors",
            link: "/vendor/list",
        },
    ],

    "/vendor/add": [
        {
            label: "Vendors",
            link: "/vendor/list",
        },
        {
            label: "Registration",
            link: "/vendor/add",
        },
    ],

    "/vendor/edit/[id]": [
        {
            label: "Vendors",
            link: "/vendor/list",
        },
        {
            label: "View Vendor",
            link: "/vendor/edit/[id]",
            dynamic: true,
        },
    ],

    "/product/list": [
        {
            label: "Products",
            link: "/product/list",
        },
    ],

    "/product/add": [
        {
            label: "Products",
            link: "/product/list",
        },
        {
            label: "Registration",
            link: "/product/add",
        },
    ],

    "/product/edit/[id]": [
        {
            label: "Products",
            link: "/product/list",
        },
        {
            label: "View Product",
            link: "/product/edit/[id]",
            dynamic: true,
        },
    ],

    "/warehouse/list": [
        {
            label: "Warehouses",
            link: "/warehouse/list",
        },
    ],

    "/warehouse/add": [
        {
            label: "Warehouses",
            link: "/warehouse/list",
        },
        {
            label: "Registration",
            link: "/warehouse/add",
        },
    ],

    "/warehouse/edit/[id]": [
        {
            label: "Warehouses",
            link: "/warehouse/list",
        },
        {
            label: "View Warehouse",
            link: "/warehouse/edit/[id]",
            dynamic: true,
        },
    ],
};
