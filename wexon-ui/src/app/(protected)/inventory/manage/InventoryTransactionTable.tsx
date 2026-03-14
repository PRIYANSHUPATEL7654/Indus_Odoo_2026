"use client";

// React
import React, { useState } from "react";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// API
import { getTransactionListWithPaginationAndFilter } from "@/api/inventory";

// UI & Utils
import DataTable from "@/components/basicComponents/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PaginationParams } from "@/helpers/commanProps";


export type TransactionDTO = {
    id: string;
    transactionNo: string;
    transactionDate: string;
    productId: string;
    productName: string;
    transactionNature: "BUY" | "SELL" | "RENT" | "TRANSFER" | "ADJUSTMENT";
    transactionDirection: "IN" | "OUT";
    affectsWarehouseQuantity: boolean;
    warehouseId?: string;
    warehouseName?: string;
    partyType?: "VENDOR";
    partyId?: string;
    partyName?: string;
    status: "CREATED" | "APPROVED" | "CANCELED";
    remarks?: string;
    netQuantity: number;
    netUnitPrice: number;
};

type InventoryTransactionTableProps = {
    filters?: Record<string, any>;
    tableHeaderText?: string;
};

const fetchTransactionList = (
    { page, size, sort = "createdAt,desc" }: PaginationParams,
    filters: Record<string, any>,
) => ({
    queryKey: ["transactions", page, size, sort, filters],
    queryFn: async () => {
        const res = await getTransactionListWithPaginationAndFilter({ page, size, sort }, filters);
        return res.data;
    },
    keepPreviousData: true,
});



const columns: ColumnDef<TransactionDTO>[] = [
    {
        accessorKey: "transactionNo",
        header: "Transaction No",
        enableSorting: true,
        meta: { className: "pl-4" },
        cell: ({ row }) => row.original.transactionNo
    },
    {
        id: "transaction",
        header: "Transaction",
        cell: ({ row }) => (
            <Badge> {row.original.transactionNature} </Badge>
        ),
    },
    {
        accessorKey: "partyName",
        header: "Party",
        cell: ({ row }) => row.original.partyName ?? "Not Available",
    },
    // {
    //     accessorKey: "netQuantity",
    //     header: "Quantity",
    //     cell: ({ row }) =>
    //         row.original.netQuantity != null ? formatInteger(row.original.netQuantity, "Kg") : "-",
    // },
    // {
    //     accessorKey: "netUnitPrice",
    //     header: "Unit Price",
    //     cell: ({ row }) =>
    //         row.original.netUnitPrice != null ? formatInteger(row.original.netUnitPrice, "Rs") : "-",
    // },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant="outline">{row.original.status}</Badge>
        ),
    },
    {
        accessorKey: "transactionDate",
        header: "Transaction Date",
        enableSorting: true,
        cell: ({ row }) =>
            new Date(row.original.transactionDate).toLocaleDateString(),
    },
];


const InventoryTransactionTable = ({ filters = {}, tableHeaderText = "Inventory Transactions" }: InventoryTransactionTableProps) => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [sort, setSort] = useState("createdAt,desc");

    const { data, isLoading } = useQuery(
        fetchTransactionList({ page, size, sort }, filters)
    );

    return (
        <DataTable
            columns={columns}
            data={data?.content ?? []}
            page={page}
            pageSize={size}
            totalPages={data?.page?.totalPages ?? 0}
            totalElements={data?.page?.totalElements ?? 0}
            onPageChange={setPage}
            onSortChange={setSort}
            isLoading={isLoading}
            stickyLastColumn={false}
            tableHeaderText={tableHeaderText}
        />
    );
};

export default InventoryTransactionTable;
