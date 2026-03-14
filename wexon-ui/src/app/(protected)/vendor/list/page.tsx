"use client";

// React
import { useState } from "react";
import Link from "next/link";

// API
import { getVendorWithPagination } from "@/api/vendor";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Assets
import {Plus, Building2, Search, Contact2, History, Edit} from "lucide-react";

// Helpers
import {PaginationSearchParams} from "@/helpers/commanProps";

// Components
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/basicComponents/PageTitle";
import DataTable from "@/components/basicComponents/DataTable";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {useDebounce} from "@/helpers/useDebounce";
import {ColumnDef} from "@tanstack/react-table";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Badge} from "@/components/ui/badge";
import {Vendor} from "@/type/vendor";

const fetchVendorList = (
    {
        page,
        size,
        sort = "createdAt,desc",
        searchText,
    }: PaginationSearchParams,
) => ({
    queryKey: ["vendor-list", page, size, sort, searchText],
    queryFn: async () => {
        const response = await getVendorWithPagination(
            { page, size, sort, searchText },
            {},
        );
        return response.data;
    },
    keepPreviousData: true,
});

const VendorListPage = () => {

    // Pagination states
    const [page, setPage] = useState(0);
    const [size] = useState(8);
    const [sort, setSort] = useState("createdAt,desc");
    const [searchText, setSearchText] = useState("");

    const debounceSearchText = useDebounce(searchText);

    const { data, isLoading } = useQuery(
        fetchVendorList({ page, size, sort, searchText: debounceSearchText })
    );

    const pageData = data?.content ?? [];
    const totalPages = data?.page?.totalPages ?? 0;
    const totalElements = data?.page?.totalElements ?? 0;

    const VendorTableColumn: ColumnDef<Vendor>[] = [
        {
            accessorKey: "vendorName",
            header: "Name",
            enableSorting: true,
            cell: ({ row }) => (
                <p className="font-medium">{row.original.vendorName}</p>
            ),
            meta: { className: "pl-6" },
        },
        {
            accessorKey: "companyName",
            header: "Company",
            cell: ({ row }) => (
                <span>{row.original.companyName}</span>
            ),
        },
        {
            accessorKey: "mobileNumber",
            header: "Phone",
            cell: ({ row }) => (
                <span>{row.original.mobileNumber}</span>
            ),
        },
        {
            id: "address",
            header: "Village",
            cell: ({ row }) => (
                <span>{row.original.village || "-"}</span>
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
                <div className="flex gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link href={`/vendor/edit/${row.original.id}`}>
                                        <Edit />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Edit Vendor
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link href={`/ledger/${row.original.id}`}>
                                        <Contact2 />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                View Ledger
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link href={`/move-history?partyId=${row.original.id}`}>
                                        <History />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                View Move History
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="Vendors"
                description="Manage all registered vendors"
                startIcon={Building2}
                actions={
                    <>
                        <Button size="icon-lg" variant="default" className="md:hidden">
                            <Link href="/vendor/add">
                                <Plus />
                            </Link>
                        </Button>

                        <Button size="lg" variant="default" className="hidden md:flex">
                            <Link
                                href="/vendor/add"
                                className="flex items-center gap-2"
                            >
                                <Plus />
                                <span>Register Vendor</span>
                            </Link>
                        </Button>
                    </>
                }
            />

            <div className="flex flex-col gap-3">

                <div className="flex gap-2">

                    <InputGroup className="w-[45%]">
                        <InputGroupAddon align="inline-start">
                            <Search />
                        </InputGroupAddon>
                        <InputGroupInput
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search By Vendor Name and Mobile Number ....."
                        />
                    </InputGroup>

                </div>

                <DataTable
                    columns={VendorTableColumn}
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
                />

            </div>

        </div>
    );
};

export default VendorListPage;
