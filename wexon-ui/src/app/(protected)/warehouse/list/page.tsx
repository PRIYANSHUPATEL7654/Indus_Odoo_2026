"use client";

// React
import { useState } from "react";
import Link from "next/link";

// API
import {
    getWarehouseDashboardStats,
    getWarehouseListWithPaginationAndFilter,
} from "@/api/warehouse";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Assets
import {Boxes, Contact2, Edit, Eye, Filter, Gauge, Package, Plus, Search, Warehouse} from "lucide-react";

// Helpers
import {FilterParams, PaginationSearchParams} from "@/helpers/commanProps";

// Components
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/basicComponents/PageTitle";
import DataTable from "@/components/basicComponents/DataTable";
import StatCard from "@/components/basicComponents/StatCard";
import { formatInteger } from "@/helpers/integerFormat";
import { useDebounce } from "@/helpers/useDebounce";
import {InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ColumnDef } from "@tanstack/react-table";
import { WarehouseType } from "@/type/warehouse";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const fetchWarehouseStats = () => ({
    queryKey: ["warehouse-stats"],
    queryFn: async () => {
        const response = await getWarehouseDashboardStats();
        return response.data;
    },
});

const fetchWarehouseList = (
    {
        page,
        size,
        sort = "createdAt,desc",
        searchText
    }: PaginationSearchParams,
    filters: FilterParams,
) => ({
    queryKey: ["warehouse-list", page, size, sort, searchText, filters],
    queryFn: async () => {
        const response = await getWarehouseListWithPaginationAndFilter(
            { page, size, sort, searchText },
            filters,
        );
        return response.data;
    },
    keepPreviousData: true,
});


const WarehouseListPage = () => {

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(8);
    const [sort, setSort] = useState("createdAt,desc");
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState<FilterParams>({})

    const debounceSearchText = useDebounce(searchText);

    const {
        data: stats,
        isLoading: isWarehouseStatsLoading,
    } = useQuery(fetchWarehouseStats());

    const {
        data,
        isLoading
    } = useQuery(fetchWarehouseList({ page, size, sort, searchText: debounceSearchText }, filters));

    const pageData = data?.content ?? [];
    const totalPages = data?.page?.totalPages ?? 0;
    const totalElements = data?.page?.totalElements ?? 0;

    const warehouseStatsConfig = [
        {
            label: "Total Warehouses",
            value: stats?.totalWarehouses,
            icon: Warehouse,
        },
        {
            label: "Total Capacity",
            value: formatInteger(stats?.totalCapacity),
            suffix: "Kg",
            icon: Boxes,
        },
        {
            label: "Available Capacity",
            value: formatInteger(stats?.availableCapacity),
            suffix: "Kg",
            icon: Package,
        },
        {
            label: "Utilization",
            value: stats?.utilizationPercentage,
            suffix: "%",
            icon: Gauge,
        },
    ];

    const WarehouseTableColumn: ColumnDef<WarehouseType>[] = [
        {
            accessorKey: "warehouseName",
            header: "Warehouse Name",
            enableSorting: true,
            cell: ({ row }) => (
                <p className="font-medium">
                    {row.original.warehouseName}
                </p>
            ),
            meta: { className: "pl-6" },
        },
        {
            accessorKey: "warehouseCode",
            header: "Code",
            cell: ({ row }) => (
                <span className="font-mono text-sm">
                {row.original.warehouseCode}
            </span>
            ),
        },
        {
            accessorKey: "ownerName",
            header: "Owner",
            cell: ({ row }) => (
                <span>{row.original.ownerName}</span>
            ),
        },
        {
            accessorKey: "totalCapacity",
            header: "Total Capacity",
            cell: ({ row }) => (
                <span>{formatInteger(row.original.totalCapacity, "Kg")}</span>
            ),
        },
        {
            accessorKey: "availableCapacity",
            header: "Available Capacity",
            cell: ({ row }) => (
                <span> {formatInteger(row.original.availableCapacity, "Kg")} </span>
            ),
        },
        {
            id: "status",
            header: "Status",
            cell: ({ row }) => (
                <span className="capitalize">
                {
                    row.original.isActive ? (
                        <Badge className="bg-green-600">Active</Badge>
                    ) : (
                        <Badge className="bg-red-600">InActive</Badge>
                    )
                }
            </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="sm" variant="ghost" asChild>
                                <Link href={`/warehouse/edit/${row.original.id}`}>
                                    <Edit />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Edit Warehouse
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
    ];



    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="Warehouses"
                description="Manage all registered warehouses"
                startIcon={Warehouse}
                actions={
                    <>
                        <Button size="icon-lg" variant="default" className="md:hidden">
                            <Link href="/warehouse/add">
                                <Plus />
                            </Link>
                        </Button>

                        <Button size="lg" variant="default" className="hidden md:flex">
                            <Link
                                href="/warehouse/add"
                                className="flex items-center gap-2"
                            >
                                <Plus />
                                <span>Register Warehouse</span>
                            </Link>
                        </Button>
                    </>
                }
            />

            <div className="flex gap-4 overflow-x-auto flex-col sm:flex-row">
                {
                    warehouseStatsConfig.map(
                        (item) => (
                            <StatCard
                                key={item.label}
                                isLoading={isWarehouseStatsLoading}
                                {...item}
                            />
                        )
                    )
                }
            </div>

            <div className="flex flex-col gap-3">

                <div className="flex gap-2">

                    <InputGroup className="w-[45%]">
                        <InputGroupAddon align="inline-start">
                            <Search />
                        </InputGroupAddon>
                        <InputGroupInput
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search by Warehouse Name ....."
                        />
                    </InputGroup>

                    <Button
                        variant="outline"
                        size="icon"
                    >
                        <Filter />
                    </Button>

                </div>

                <DataTable
                    columns={WarehouseTableColumn}
                    data={pageData}
                    page={page}
                    pageSize={size}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onSortChange={setSort}
                    isLoading={isLoading}
                    stickyLastColumn
                    showTableHeader={false}
                    totalElements={totalElements}
                    tableHeaderText="Warehouse List"
                />

            </div>

        </div>
    );
};

export default WarehouseListPage;
