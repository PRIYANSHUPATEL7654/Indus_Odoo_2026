"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {LucideIcon} from "lucide-react";

interface PageTitleProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    isFormPage?: boolean;
    startIcon?: LucideIcon;
    className?: string;
    isLoading?: boolean;
}

const PageTitle = (
    {
        title,
        description,
        actions,
        isFormPage = false,
        startIcon,
        isLoading = false,
        className }: PageTitleProps
)=> {
    return (
        <div
            className={cn(
                "w-full flex flex-col",
                isFormPage ? "max-w-[900px]" : "",
                className
            )}
        >
            {
                isLoading ? (
                    <div className="flex gap-3">
                        <Skeleton className="h-13 w-13" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-7 w-72" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center justify-center gap-4">

                            {
                                startIcon && (
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary">
                                        {React.createElement(startIcon, {
                                            className: "h-7 w-7 text-primary-foreground",
                                        })}
                                    </div>
                                )
                            }

                            <div className="flex flex-col min-w-0 gap-1">
                                <h1 className="text-xl font-semibold leading-tight wrap-break-word">
                                    {title}
                                </h1>

                                {
                                    description && (
                                        <p className="text-sm text-muted-foreground wrap-break-word leading-snug">
                                            { description }
                                        </p>
                                    )
                                }
                            </div>
                        </div>

                        {
                            actions && (
                                <div className="flex items-center gap-2 shrink-0">
                                    { actions }
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
}

export default PageTitle;