"use client";

import React from "react";
import PageTitle from "@/components/basicComponents/PageTitle";
import {LayoutDashboard} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardKpis } from "@/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity,
    ArrowDownToLine,
    ArrowLeftRight,
    ArrowUpFromLine,
    Box,
    Boxes,
    CircleAlert,
    Clock,
    SlidersHorizontal
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getTransactionListWithPaginationAndFilter } from "@/api/inventory";

type DashboardKpis = {
    totalProducts: number;
    distinctProductsInStock: number;
    totalAvailableStockQuantity: number;
    lowStockItems: number;
    outOfStockItems: number;
    pendingReceipts: number;
    pendingDeliveries: number;
    internalTransfersScheduled: number;
    pendingAdjustments: number;
};

const EMPTY_KPIS: DashboardKpis = {
    totalProducts: 0,
    distinctProductsInStock: 0,
    totalAvailableStockQuantity: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    internalTransfersScheduled: 0,
    pendingAdjustments: 0,
};

type RecentTx = {
    id: string;
    transactionNo: string;
    transactionNature: string;
    transactionDate: string;
    status: string;
    partyName?: string;
    warehouseName?: string;
    productName?: string;
};

const DashboardPage = () => {

    const { data = EMPTY_KPIS, isLoading, isError } = useQuery({
        queryKey: ["dashboard-kpis"],
        queryFn: async () => {
            const body: any = await getDashboardKpis();
            const payload =
                body && typeof body === "object" && "data" in body
                    ? body.data
                    : body;

            return payload ?? EMPTY_KPIS;
        },
        placeholderData: EMPTY_KPIS,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
    });

    const { data: recentTx = [], isLoading: isRecentLoading } = useQuery({
        queryKey: ["dashboard-recent-tx"],
        queryFn: async () => {
            const body: any = await getTransactionListWithPaginationAndFilter(
                { page: 0, size: 5, sort: "transactionDate,desc" },
                {},
            );
            const payload =
                body && typeof body === "object" && "data" in body ? body.data : body;

            return (payload?.content ?? []) as RecentTx[];
        },
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
    });

    return (
        <div className="dashboard-page space-y-4">
            <PageTitle
                title="Dashboard"
                description="Track inventory, operations, and warehouse activity at a glance."
                startIcon={LayoutDashboard}
            />

            <Card className="overflow-hidden border bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-muted-foreground" />
                                <div className="text-sm text-muted-foreground">
                                    Today’s Overview
                                </div>
                            </div>
                            <div className="text-2xl font-semibold tracking-tight">
                                Keep your warehouse running smoothly
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Create operations in one click and monitor pending work.
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href="/operations/receipts/create" className="flex gap-2">
                                    <ArrowDownToLine className="h-4 w-4" /> Receipt
                                </Link>
                            </Button>
                            <Button variant="secondary" asChild>
                                <Link href="/operations/delivery-orders/create" className="flex gap-2">
                                    <ArrowUpFromLine className="h-4 w-4" /> Delivery
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/operations/internal-transfers/create" className="flex gap-2">
                                    <ArrowLeftRight className="h-4 w-4" /> Transfer
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/operations/adjustments/create" className="flex gap-2">
                                    <SlidersHorizontal className="h-4 w-4" /> Adjust
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {isError && (
                        <div className="mt-4 rounded-md border bg-white p-3 text-sm text-muted-foreground">
                            Dashboard KPIs are temporarily unavailable. Showing demo values.
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    title="Total Products"
                    value={isLoading ? "-" : data.totalProducts}
                    icon={Box}
                />
                <KpiCard
                    title="Products In Stock"
                    value={isLoading ? "-" : data.distinctProductsInStock}
                    icon={Boxes}
                />
                <KpiCard
                    title="Low Stock"
                    value={isLoading ? "-" : data.lowStockItems}
                    icon={CircleAlert}
                    tone={data.lowStockItems > 0 ? "warn" : "neutral"}
                />
                <KpiCard
                    title="Out Of Stock"
                    value={isLoading ? "-" : data.outOfStockItems}
                    icon={CircleAlert}
                    tone={data.outOfStockItems > 0 ? "danger" : "neutral"}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Operational Backlog</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <MiniStat
                            label="Pending Receipts"
                            value={isLoading ? "-" : data.pendingReceipts}
                        />
                        <MiniStat
                            label="Pending Deliveries"
                            value={isLoading ? "-" : data.pendingDeliveries}
                        />
                        <MiniStat
                            label="Transfers Scheduled"
                            value={isLoading ? "-" : data.internalTransfersScheduled}
                        />
                        <MiniStat
                            label="Pending Adjustments"
                            value={isLoading ? "-" : data.pendingAdjustments}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Stock Quantity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                            Available units across all warehouses
                        </div>
                        <div className="text-4xl font-semibold tracking-tight">
                            {isLoading ? "-" : data.totalAvailableStockQuantity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Use Move History for traceability.
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Recent Operations
                    </CardTitle>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/move-history">View All</Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                    {isRecentLoading ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : recentTx.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                            No recent operations found.
                        </div>
                    ) : (
                        <div className="divide-y rounded-md border">
                            {recentTx.map((t) => (
                                <div
                                    key={t.id}
                                    className="flex flex-col gap-1 p-3 md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate font-medium">
                                                {t.transactionNo}
                                            </span>
                                            <Badge variant="secondary">{t.transactionNature}</Badge>
                                            <Badge variant="outline">{t.status}</Badge>
                                        </div>
                                        <div className="mt-1 truncate text-xs text-muted-foreground">
                                            {t.productName ? `${t.productName} · ` : ""}
                                            {t.partyName ? `${t.partyName} · ` : ""}
                                            {t.warehouseName ?? ""}
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {t.transactionDate
                                            ? new Date(t.transactionDate).toLocaleDateString()
                                            : "-"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardPage;

const KpiCard = ({
    title,
    value,
    icon: Icon,
    tone = "neutral",
}: {
    title: string;
    value: React.ReactNode;
    icon: React.ComponentType<{ className?: string }>;
    tone?: "neutral" | "warn" | "danger";
}) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div
                    className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md border bg-white",
                        tone === "warn" && "border-amber-200 bg-amber-50",
                        tone === "danger" && "border-rose-200 bg-rose-50",
                    )}
                >
                    <Icon
                        className={cn(
                            "h-4 w-4 text-muted-foreground",
                            tone === "warn" && "text-amber-700",
                            tone === "danger" && "text-rose-700",
                        )}
                    />
                </div>
            </CardHeader>
            <CardContent className="text-3xl font-semibold tracking-tight">
                {value}
            </CardContent>
        </Card>
    );
};

const MiniStat = ({ label, value }: { label: string; value: React.ReactNode }) => {
    return (
        <div className="rounded-lg border bg-white p-4">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
        </div>
    );
};
