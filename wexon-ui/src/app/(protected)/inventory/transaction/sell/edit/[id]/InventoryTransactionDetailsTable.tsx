"use client";

// React
import React, { useState } from "react";

// React Query
import {useMutation, useQuery } from "@tanstack/react-query";

// Table
import DataTable from "@/components/basicComponents/DataTable";
import { ColumnDef } from "@tanstack/react-table";

// UI
import { Badge } from "@/components/ui/badge";

// Utils
import { formatInteger } from "@/helpers/integerFormat";
import { PaginationParams } from "@/helpers/commanProps";
import {
    createTransactionDetails, deleteTransactionDetail, getInventoryTransaction,
    getTransactionDetail,
    getTransactionDetailWithPaginationAndFilter, updateTransactionDetails
} from "@/api/inventory";
import { Button } from "@/components/ui/button";
import {CirclePlus, Edit, Package, Save, Trash2, Trash2Icon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import detailsSchema from "@/assets/schema/Inventory/SellTransaction/Details/schema.json";
import detailsUISchema from "@/assets/schema/Inventory/SellTransaction/Details/uischema.json";
import {toast} from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type InventoryTransactionDetailsDTO = {
    id: string;
    transactionId: string;
    transactionNo: string;
    batchNo?: string;
    vehicleNumber?: string;

    grossQuantity?: number;
    perBagLessQuantity?: number;
    debitNoteQuantity?: number;
    measurementUnit?: string;
    bagQuantity?: number;

    netQuantity?: number;
    netUnitPrice?: number;
    remarks?: string;
};

const fetchTransactionDetails = (
    pagination: PaginationParams,
    filters: Record<string, any>
) => ({
    queryKey: ["transaction-details", pagination, filters],
    queryFn: async () => {
        const res = await getTransactionDetailWithPaginationAndFilter(pagination, filters);
        return res.data;
    },
    keepPreviousData: true,
});

const fetchTransactionDetailSpecific = (id: string) => ({
    queryKey: ["transaction-detail", id],
    queryFn: async () => {
        const res = await getTransactionDetail(id);
        return res.data;
    },
    keepPreviousData: true,
    enabled: !!id,
});

const fetchTransaction = (transactionId: string) => ({
    queryKey: ["inventory-transaction", transactionId],
    queryFn: async () => {
        const response = await getInventoryTransaction(transactionId);
        return response?.data;
    },
    enabled: !!transactionId,
});

type Props = {
    transactionId: string;
};

const InventoryTransactionDetailsTable = (
    { transactionId }: Props
) => {

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [sort, setSort] = useState("createdAt,desc");
    const [filters, setFilters] = useState({ transactionId: transactionId });

    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isAlertDialog, setIsAlertDialog] = useState(false);

    const [transactionDetailsId, setTransactionDetailsId] = useState<string>("");

    const { data, isLoading, refetch } = useQuery(fetchTransactionDetails({ page, size, sort }, filters));
    const { data: transactionData, isLoading: isEditLoading } = useQuery(fetchTransactionDetailSpecific(transactionDetailsId));
    const { data: transactionDataMain } = useQuery(fetchTransaction(transactionId));


    // Mutation API Call for Create Inventory Transaction Details
    const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            const response = await createTransactionDetails(transactionId, data);
            return response?.data;
        },
        onSuccess: () => {
            toast.success("Inventory Transaction Details Created Successfully!");
            setIsOpenDialog(false);
            refetch();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to Created Inventory Transaction Details");
        },
    })

    // Mutation API Call for update Inventory Transaction Details
    const { mutate: onUpdate, isPending: isUpdating } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            return updateTransactionDetails(transactionDetailsId, data);
        },
        onSuccess: () => {
            toast.success("Inventory Transaction Updated Details Successfully!");
            setIsOpenEditDialog(false);
            refetch();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update inventory transaction details");
        },
    });

    // Mutation API Call for update Inventory Transaction Details
    const { mutate: onDelete } = useMutation({
        mutationFn: async (id: any) => {
            return deleteTransactionDetail(id);
        },
        onSuccess: () => {
            toast.success("Inventory Transaction Details Deleted Successfully!");
            setIsOpenDialog(false);
            refetch();
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to Deleted inventory transaction details");
        },
    });


    const columns: ColumnDef<InventoryTransactionDetailsDTO>[] = [
        {
            accessorKey: "batchNo",
            header: "Batch No",
            meta: { className: "pl-4" },
            cell: ({ row }) => row.original.batchNo ?? "-",
        },
        {
            accessorKey: "vehicleNumber",
            header: "Vehicle No",
            cell: ({ row }) => row.original.vehicleNumber ?? "-",
        },
        {
            accessorKey: "grossQuantity",
            header: "Gross Qty",
            cell: ({ row }) =>
                row.original.grossQuantity != null
                    ? formatInteger(row.original.grossQuantity, "Kg")
                    : "-",
        },
        {
            accessorKey: "bagQuantity",
            header: "Bags",
            cell: ({ row }) =>
                row.original.bagQuantity != null
                    ? row.original.bagQuantity
                    : "-",
        },
        {
            accessorKey: "perBagLessQuantity",
            header: "Less / Bag",
            cell: ({ row }) =>
                row.original.perBagLessQuantity != null
                    ? formatInteger(row.original.perBagLessQuantity, "Kg")
                    : "-",
        },
        {
            accessorKey: "debitNoteQuantity",
            header: "Debit Qty",
            cell: ({ row }) =>
                row.original.debitNoteQuantity != null
                    ? formatInteger(row.original.debitNoteQuantity, "Kg")
                    : "-",
        },
        {
            accessorKey: "netQuantity",
            header: "Net Qty",
            cell: ({ row }) =>
                row.original.netQuantity != null
                    ? formatInteger(row.original.netQuantity, "Kg")
                    : "-",
        },
        {
            accessorKey: "netUnitPrice",
            header: "Unit Price",
            cell: ({ row }) =>
                row.original.netUnitPrice != null
                    ? formatInteger(row.original.netUnitPrice, "Rs")
                    : "-",
        },
        {
            accessorKey: "measurementUnit",
            header: "Unit",
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.measurementUnit ?? "-"}
                </Badge>
            ),
        },
        {
            accessorKey: "remarks",
            header: "Remarks",
            cell: ({ row }) => row.original.remarks ?? "-",
        },
        ...(transactionDataMain?.status === "CREATED"
            ? [
                {
                    id: "actions",
                    header: "Actions",
                    enableHiding: false,
                    cell: ({ row } : any) => (
                        <div className="flex gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                                setIsOpenEditDialog(true);
                                                setTransactionDetailsId(row.original.id);
                                            }}
                                        >
                                            <Edit />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit Details</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                                setIsAlertDialog(true);
                                                setTransactionDetailsId(row.original.id);
                                            }}
                                        >
                                            <Trash2 className="text-red-600" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete Details</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ),
                },
            ]
            : []),
    ];

    return (
        <div className="flex flex-col gap-3">

            {
                transactionDataMain?.status === "CREATED" && (
                    <Button onClick={() => setIsOpenDialog(true)}>
                        <CirclePlus /> Add Transaction Details
                    </Button>
                )
            }

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
                stickyLastColumn={true}
                showTableHeader={false}
            />

            <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>

                <DialogContent className="w-[60vw] max-h-[90vh] p-4.5 gap-4">

                    <VisuallyHidden>
                        <DialogHeader>
                            <DialogTitle>Create/Edit Inventory Details</DialogTitle>
                        </DialogHeader>
                    </VisuallyHidden>

                    <PageTitle
                        title="Inventory Details"
                        description="Add and manage batch-wise quantities, pricing, and deductions for accurate stock valuation."
                        startIcon={Package}
                    />

                    <Form
                        schema={detailsSchema}
                        uiSchema={detailsUISchema}
                        submitBtnText={"Create Transaction Details"}
                        startIconForSubmitBtn={Save}
                        onSubmit={(e) => {
                            if(e.status) onSubmit(e?.data)
                        }}
                    />

                </DialogContent>
            </Dialog>

            <Dialog open={isOpenEditDialog} onOpenChange={setIsOpenEditDialog}>

                <DialogContent className="w-[60vw] max-h-[90vh] p-4.5 gap-4">

                    <VisuallyHidden>
                        <DialogHeader>
                            <DialogTitle>Create/Edit Inventory Details</DialogTitle>
                        </DialogHeader>
                    </VisuallyHidden>

                    <PageTitle
                        title="Inventory Details"
                        description="Add and manage batch-wise quantities, pricing, and deductions for accurate stock valuation."
                        startIcon={Package}
                    />

                    {
                        transactionData && (
                            <Form
                                schema={detailsSchema}
                                uiSchema={detailsUISchema}
                                data={transactionData}
                                submitBtnText={"Update Transaction Details"}
                                startIconForSubmitBtn={Save}
                                onSubmit={(e) => {
                                    if(e.status) onUpdate(e?.data)
                                }}
                            />
                        )
                    }

                </DialogContent>
            </Dialog>


            <AlertDialog open={isAlertDialog} onOpenChange={setIsAlertDialog}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2Icon />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this transaction detail.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {onDelete(transactionDetailsId)}}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>

    );
};

export default InventoryTransactionDetailsTable;
