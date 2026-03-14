import {usePathname, useRouter} from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";
import {Home} from "lucide-react";

interface BreadcrumbItemType {
    label: string;
    link?: string;
}

interface PrimitiveBreadcrumbProps {
    data: BreadcrumbItemType[];
}

const PrimitiveBreadcrumb = ({ data } : PrimitiveBreadcrumbProps) => {
    const router = useRouter();
    return (
        <div className="w-full text-sm text-muted-foreground">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden sm:flex">
                        <BreadcrumbLink className="cursor-pointer" onClick={() => router.push("/dashboard")}>
                            Dashboard
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    {data.map((item, i) => {
                        const isLast = i === data.length - 1;
                        return (
                            <React.Fragment key={i}>
                                <BreadcrumbSeparator className="hidden sm:flex" />
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage
                                            className="cursor-pointer"
                                            onClick={() => item.link && router.push(item.link)}
                                        >
                                            {item.label}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink
                                            className="cursor-pointer hidden sm:inline"
                                            onClick={() => item.link && router.push(item.link)}
                                        >
                                            {item.label}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </React.Fragment>
                        );
                    })}

                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}

export default PrimitiveBreadcrumb;