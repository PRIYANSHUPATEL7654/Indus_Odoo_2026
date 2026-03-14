import { BreadcrumbList, Breadcrumb } from "@/constants/BreadcrumbList";

export const getBreadcrumbData = (pathname: string): Breadcrumb[] => {
    if (BreadcrumbList[pathname]) {
        return BreadcrumbList[pathname];
    }

    for (const key in BreadcrumbList) {
        if (key.includes("[") && isMatch(key, pathname)) {
            return BreadcrumbList[key];
        }
    }
    return [];
};

const isMatch = (pattern: string, pathname: string) => {
    const patternParts = pattern.split("/");
    const pathParts = pathname.split("/");

    if (patternParts.length !== pathParts.length) return false;

    return patternParts.every((part, i) => {
        return part.startsWith("[") || part === pathParts[i];
    });
};
