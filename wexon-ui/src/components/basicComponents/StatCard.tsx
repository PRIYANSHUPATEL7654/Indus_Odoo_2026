"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";

interface StatCardProps {
    label: string;
    value?: string | number;
    icon?: LucideIcon;
    suffix?: string;
    trend?: "up" | "down";
    trendValue?: string;
    isLoading?: boolean;
    className?: string;
}

const StatCard = (
    {
        label,
        value,
        icon: Icon,
        suffix,
        trend,
        trendValue,
        isLoading = false,
        className,
    }: StatCardProps
) => {

    const isUp = trend === "up";

    return (
        <Card
            className={cn(
                "relative min-w-[220px] w-full h-[130px] overflow-hidden",
                "border bg-background/60 p-0 shadow-none",
                className
            )}
        >
            <CardContent className="px-5.5 py-5.5 h-full flex justify-between">

                <div className="flex flex-col gap-2 justify-between">

                    {
                        isLoading ? (
                            <Skeleton className="h-4 w-32" />
                        ) : (
                            <p className="text-sm font-medium text-muted-foreground">
                                {label}
                            </p>
                        )
                    }

                    {
                        isLoading ? (
                            <Skeleton className="h-8 w-28" />
                        ) : (
                            <div className="flex items-end gap-1">
                                <span className="text-3xl font-semibold tracking-tight">
                                    {value ?? "—"}
                                </span>
                                {suffix && (
                                    <span className="text-sm text-muted-foreground pb-1">
                                        {suffix}
                                    </span>
                                )}
                            </div>
                        )
                    }

                    {
                        isLoading ? (
                            <Skeleton className="h-3 w-20" />
                        ) : (
                            trend && trendValue && (
                                <div
                                    className={cn(
                                        "flex items-center gap-1 text-xs font-medium",
                                        isUp ? "text-green-600" : "text-red-600"
                                    )}
                                >
                                    {isUp ? (
                                        <TrendingUp className="h-3.5 w-3.5" />
                                    ) : (
                                        <TrendingDown className="h-3.5 w-3.5" />
                                    )}
                                    <span>{trendValue}</span>
                                </div>
                            )
                        )
                    }
                </div>

                {
                    Icon && (
                        <div>
                            {
                                isLoading ? (
                                    <Skeleton className="h-9 w-9 rounded-md" />
                                ) : (
                                    <div className="bg-primary/10 p-2 rounded-md">
                                        <Icon className="text-primary" />
                                    </div>
                                )
                            }
                        </div>
                    )
                }

            </CardContent>
        </Card>
    );
};


export default StatCard;
