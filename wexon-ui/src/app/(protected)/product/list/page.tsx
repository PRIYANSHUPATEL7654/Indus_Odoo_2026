"use client";

// React
import { useState } from "react";
import Link from "next/link";

// API
import { getProductWithPagination } from "@/api/product";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Assets
import {Plus, Package, Search, Eye, Filter, Edit} from "lucide-react";

// Helpers
import {FilterParams, PaginationSearchParams} from "@/helpers/commanProps";

// Components
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/basicComponents/PageTitle";
import DataTable from "@/components/basicComponents/DataTable";
import {useDebounce} from "@/helpers/useDebounce";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import { ColumnDef } from "@tanstack/react-table";
import {Product} from "@/type/product";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const fetchProductList = (
    {
        page,
        size,
        sort = "createdAt,desc",
        searchText
    }: PaginationSearchParams,
    filters?: FilterParams,
) => ({
    queryKey: ["product-list",  page, size, sort, searchText, filters],
    queryFn: async () => {
        const response = await getProductWithPagination(
            { page, size, sort, searchText },
            filters,
        );
        return response.data;
    },
    keepPreviousData: true,
});

const ProductListPage = () => {

    // Pagination states
    const [page, setPage] = useState(0);
    const [size] = useState(8);
    const [sort, setSort] = useState("createdAt,desc");
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState<FilterParams>({})

    const debounceSearchText = useDebounce(searchText);

    const {
        data,
        isLoading
    } = useQuery(fetchProductList({ page, size, sort, searchText: debounceSearchText }, filters));

    const pageData = data?.content ?? [];
    const totalPages = data?.page?.totalPages ?? 0;
    const totalElements = data?.page?.totalElements ?? 0;

    const ProductTableColumn: ColumnDef<Product>[] = [
        {
            accessorKey: "productName",
            header: "Product Name",
            enableSorting: true,
            cell: ({ row }) => (
                <p className="font-medium">{row.original.productName}</p>
            ),
            meta: { className: "pl-6" },
        },
        {
            accessorKey: "sku",
            header: "SKU",
            cell: ({ row }) => (
                <span>{row.original.sku}</span>
            ),
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => (
                <span>{row.original.category}</span>
            ),
        },
        {
            accessorKey: "baseUnit",
            header: "Base Unit",
            cell: ({ row }) => (
                <span className="uppercase">
                {row.original.baseUnit ?? "-"}
            </span>
            ),
        },
        {
            accessorKey: "isAffectedWarehouseCapacity",
            header: "Affects Capacity",
            cell: ({ row }) => (
                row.original.isAffectedWarehouseCapacity ? (
                    <Badge className="bg-orange-600">Yes</Badge>
                ) : (
                    <Badge variant="outline">No</Badge>
                )
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
                                <Link href={`/product/edit/${row.original.id}`}>
                                    <Edit />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Edit Product
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            ),
        },
    ];

    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="Products"
                description="Manage all registered products"
                startIcon={Package}
                actions={
                    <>
                        <Button size="icon-lg" variant="default" className="md:hidden">
                            <Link href="/product/add">
                                <Plus />
                            </Link>
                        </Button>

                        <Button size="lg" variant="default" className="hidden md:flex">
                            <Link
                                href="/product/add"
                                className="flex items-center gap-2"
                            >
                                <Plus />
                                <span>Register Product</span>
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
                            placeholder="Search by Product Name ....."
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
                    columns={ProductTableColumn}
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

export default ProductListPage;
