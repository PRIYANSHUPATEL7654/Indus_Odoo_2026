"use client";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


import { cn } from "@/lib/utils";
import { useState } from "react";
import DataTablePagination from "@/components/basicComponents/DataTablePagination";
import {Badge} from "@/components/ui/badge";
import {ArrowUp, ArrowDown, ArrowUpDown, Database, SearchX} from "lucide-react";

interface DataTableProps<TData> {
    columns: any;
    data: TData[];
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onSortChange: (sort: string) => void;
    stickyLastColumn?: boolean;
    isLoading?: boolean;
    showTableHeader?: boolean;
    tableHeaderText?: string;
}

const STICKY_LAST_COL_CLASS = "sticky right-0 z-20 bg-background shadow-left";
const STICKY_LAST_COL_CLASS_HEADER = "sticky right-0 z-20 bg-secondary shadow-left";
const SKELETON_ROW_COUNT = 10;
const SKELETON_ROW_HEIGHT = 40;

const DataTable = <TData,>(
    {
        columns,
        data,
        page,
        pageSize,
        totalPages,
        totalElements,
        onPageChange,
        onSortChange,
        stickyLastColumn = false,
        isLoading = false,
        showTableHeader = true,
        tableHeaderText
    }: DataTableProps<TData>
) => {

    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        pageCount: totalPages,
        defaultColumn: {
            enableSorting: false,
        },
        state: {
            pagination: {
                pageIndex: page,
                pageSize,
            },
            sorting,
        },
        manualPagination: true,
        manualSorting: true,
        onPaginationChange: (updater) => {
            const next = typeof updater === "function" ? updater({ pageIndex: page, pageSize }) : updater;
            onPageChange(next.pageIndex);
        },
        onSortingChange: (updater) => {
            const nextSorting = typeof updater === "function" ? updater(sorting) : updater;
            setSorting(nextSorting);
            if (nextSorting.length > 0) {
                const s = nextSorting[0];
                onSortChange(`${s.id},${s.desc ? "desc" : "asc"}`);
            }
        },
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-lg border overflow-auto">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                    {showTableHeader && (
                        <TableRow className="h-15">
                            <TableCell colSpan={columns.length} className="hover:bg-white">
                                <div className="flex items-center gap-2 pl-3">
                                        <span className="text-lg font-semibold">
                                          {tableHeaderText}
                                        </span>
                                    <Badge variant="secondary">
                                        {totalElements} Records
                                    </Badge>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}

                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-secondary">
                            {headerGroup.headers.map((header, index, arr) => {
                                const isLast = stickyLastColumn && index === arr.length - 1;
                                const canSort = header.column.getCanSort();
                                const sortState = header.column.getIsSorted();


                                return (
                                    <TableHead
                                        key={header.id}
                                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                        className={cn(
                                            "cursor-pointer select-none",
                                            header.column.columnDef.meta?.className,
                                            isLast && STICKY_LAST_COL_CLASS_HEADER
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            {
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            }
                                            <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">
                                                {
                                                    canSort && (
                                                        sortState === "asc" ? (
                                                            <ArrowUp className="h-4 w-4" />
                                                        ) : sortState === "desc" ? (
                                                            <ArrowDown className="h-4 w-4" />
                                                        ) : (
                                                            <ArrowUpDown className="h-4 w-4 opacity-40" />
                                                        )
                                                    )
                                                }
                                            </span>
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <>
                            {Array.from({ length: pageSize }).map((_, i) => (
                                <TableSkeletonRow
                                    key={i}
                                    columns={columns.length}
                                    stickyLastColumn={stickyLastColumn}
                                />
                            ))}
                        </>
                    ) : data.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={`${row.id}-${sorting.map(s => `${s.id}-${s.desc}`).join()}`}
                                      className={cn(
                                          "transition-colors",
                                          sorting.length > 0 && "animate-table-row"
                                      )}
                            >
                                {row.getVisibleCells().map((cell, index, arr) => {
                                    const isLast =
                                        stickyLastColumn &&
                                        index === arr.length - 1;

                                    return (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                cell.column.columnDef.meta?.className,
                                                isLast && STICKY_LAST_COL_CLASS
                                            )}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="py-14">
                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <SearchX className="h-10 w-10 opacity-60" />
                                    <span className="text-sm">Result Not Found</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {
                totalPages > 1 && (
                    <div className="flex flex-col gap-2 border-t p-3 sm:flex-row sm:items-center sm:justify-between">
                        <DataTablePagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    </div>
                )
            }
        </div>
    );
};

export default DataTable;


const TableSkeletonRow = (
    {
        columns,
        stickyLastColumn,
    }: { columns: number; stickyLastColumn?: boolean; }
) => {
    return (
        <TableRow style={{ height: SKELETON_ROW_HEIGHT }}>
            {Array.from({ length: columns }).map((_, index) => {
                const isLast = stickyLastColumn && index === columns - 1;
                return (
                    <TableCell
                        key={index}
                        className={cn(
                            isLast && STICKY_LAST_COL_CLASS,
                            "px-4"
                        )}
                    >
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                );
            })}
        </TableRow>
    );
};
