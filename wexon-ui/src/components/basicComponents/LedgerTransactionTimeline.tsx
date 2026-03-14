"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import DataTable from "@/components/basicComponents/DataTable";
import { Badge } from "@/components/ui/badge";

/* =====================================================
   TYPES (Mapped from LedgerTransactionModel)
===================================================== */

export type LedgerTransactionRow = {
    id: string;
    ledgerTransactionId: string;
    ledgerTransactionType: string;
    entryType: "CREDIT" | "DEBIT";
    amount: number;
    referenceId?: string;
    description?: string;
    transactionDate: string;
    closingBalance: number;
    closingBalanceType: string;
};

/* =====================================================
   TABLE COLUMNS (PASSBOOK STYLE)
===================================================== */

const ledgerPassbookColumns: ColumnDef<LedgerTransactionRow>[] = [
    {
        accessorKey: "transactionDate",
        header: "Date",
        enableSorting: true,
        cell: ({ row }) =>
            format(
                new Date(row.original.transactionDate),
                "dd MMM yyyy"
            ),
    },
    {
        header: "Particulars",
        cell: ({ row }) =>
            row.original.description ||
            row.original.ledgerTransactionType,
    },
    {
        header: "Ref",
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.original.referenceId ||
                    row.original.ledgerTransactionId}
            </Badge>
        ),
    },
    {
        id: "debit",
        header: "Debit (₹)",
        meta: { className: "text-right text-red-600" },
        cell: ({ row }) =>
            row.original.entryType === "DEBIT"
                ? `₹ ${row.original.amount}`
                : "—",
    },
    {
        id: "credit",
        header: "Credit (₹)",
        meta: { className: "text-right text-green-600" },
        cell: ({ row }) =>
            row.original.entryType === "CREDIT"
                ? `₹ ${row.original.amount}`
                : "—",
    },
    {
        accessorKey: "closingBalance",
        header: "Balance (₹)",
        meta: { className: "text-right font-semibold" },
        enableSorting: false,
        cell: ({ row }) => (
            <>
                ₹ {row.original.closingBalance}
                <Badge variant="outline" className="ml-2">
                    {row.original.closingBalanceType}
                </Badge>
            </>
        ),
    },
];

/* =====================================================
   MAIN PAGE
===================================================== */

const LedgerPassbookPage = ({
                                transactions,
                                page,
                                pageSize,
                                totalPages,
                                totalElements,
                                onPageChange,
                                onSortChange,
                                isLoading,
                            }: {
    transactions: LedgerTransactionRow[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    onSortChange: (sort: string) => void;
    isLoading?: boolean;
}) => {
    return (
        <div className="flex flex-col gap-4">
            <DataTable
                columns={ledgerPassbookColumns}
                data={transactions}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={onPageChange}
                onSortChange={onSortChange}
                isLoading={isLoading}
                showTableHeader={false}
                tableHeaderText="Vendor / Account Passbook"
                stickyLastColumn
            />
        </div>
    );
};

export default LedgerPassbookPage;
