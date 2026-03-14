"use client";

// React
import React, { useState } from "react";

// TanStack Query
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// API
import {
    finalizeInventoryValuation,
    getInventoryTransactionTableWithFilters,
    updateInventoryValuation
} from "@/api/inventory";

// Assets
import {Calculator, CheckCircle, Save, XCircle} from "lucide-react";

// Helpers
import { PaginationParams } from "@/helpers/commanProps";

// Components
import DataTable from "@/components/basicComponents/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge"
import {formatKg} from "@/components/basicComponents/entityDescriptionForCommand";
import {Button} from "@/components/ui/button";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@/components/ui/table";
import Form from "@/components/jsonforms/Form";
import valuationSchema from "@/assets/schema/Inventory/Valuation/schema.json";
import valuationUISchema from "@/assets/schema/Inventory/Valuation/uischema.json";
import PageTitle from "@/components/basicComponents/PageTitle";
import {toast} from "sonner";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";

const fetchInventoryTransactionList = (
    filters: Record<string, any>, { page, size, sort = "createdAt,desc" }: PaginationParams
) => ({
    queryKey: ["inventory-transactions", filters, page, size, sort],
    queryFn: async () => {
        const response = await getInventoryTransactionTableWithFilters(filters, { page, size, sort });
        return response.data;
    },
    keepPreviousData: true,
});

export type InventoryTransaction = {
    id: string;
    inventoryId: string;
    batchNo: string;
    productId: string;
    productName: string;
    warehouseId: string;
    warehouseName: string;
    unitPrice: number;
    inventoryType: string;
    transactionType: string;
    partyId?: string;
    partyType?: string;
    partyName?: string;
    quantity: number;
    bagQuantity: number;
    remarks?: string;
    status: string;
    createdAt: string;
};

const TRANSACTION_BADGE_MAP: Record< string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    INWARD_NEW_STOCK: {
        label: "Stock Received",
        variant: "default",
    },
    INWARD: {
        label: "Stock In",
        variant: "secondary",
    },
    OUTWARD: {
        label: "Stock Out",
        variant: "destructive",
    },
    TRANSFER: {
        label: "Stock Transfer",
        variant: "outline",
    },
};

const INVENTORY_TYPE_BADGE: Record<
    string,
    { label: string; variant: "default" | "outline" }
> = {
    REGULAR: { label: "Regular", variant: "default" },
    RENT: { label: "Rent", variant: "outline" },
};

const TRANSACTION_STATUS_BADGE: Record<
    string,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
    VALUATION_PENDING: {
        label: "Valuation Pending",
        variant: "secondary",
    },
    PENDING: {
        label: "Pending",
        variant: "outline",
    },
    COMPLETED: {
        label: "Completed",
        variant: "default",
    },
    CANCELLED: {
        label: "Cancelled",
        variant: "destructive",
    },
};


type InventoryTransactionTableForInventoryPageProps = {
    inventoryId: string;

};

const InventoryTransactionTableForInventoryPage = ({
    inventoryId,

}: InventoryTransactionTableForInventoryPageProps) => {

    const queryClient = useQueryClient();

    // Table Related State
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [sort, setSort] = useState("createdAt,desc");

    // Sheet Related States
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedInventoryTransaction, setSelectedInventoryTransaction] = useState<InventoryTransaction>();

    // Calculation Related Data
    const [netQuantity, setNetQuantity] = useState<number>(0);
    const [baseAmount, setBaseAmount] = useState<number>(0);
    const [finalNetAmount, setFinalNetAmount] = useState<number>(0);
    const [valuationFormData, setValuationFormData] = useState<any>({});



    const filters = { inventoryId };
    const { data, isLoading } = useQuery(
        fetchInventoryTransactionList(filters, { page, size, sort })
    );

    const pageData = data?.content ?? [];
    const totalPages = data?.page?.totalPages ?? 0;
    const totalElements = data?.page?.totalElements ?? 0;

    const InventoryTransactionTableColumn: ColumnDef<InventoryTransaction>[] = [
        {
            accessorKey: "partyName",
            header: "Party",
            meta: { className: "pl-4" },
            cell: ({ row }) => {
                return (
                    <div>
                        {row.original.partyName} {" - "} {row.original.partyType}
                    </div>
                );
            }
        },
        {
            accessorKey: "inventoryType",
            header: "Inventory Type",
            cell: ({ row }) => {
                const config = INVENTORY_TYPE_BADGE[row.original.inventoryType];
                return config ? (
                    <Badge variant={config.variant}>{config.label}</Badge>
                ) : null;
            },
        },
        {
            accessorKey: "quantity",
            header: "Quantity(Kg)",
            cell: ({ row }) => formatKg(row.original.quantity),
        },
        {
            accessorKey: "bagQuantity",
            header: "No of Bags",
            cell: ({ row }) => formatKg(row.original.bagQuantity),
        },
        {
            accessorKey: "transactionType",
            header: "Transaction",
            cell: ({ row }) => {
                const config = TRANSACTION_BADGE_MAP[row.original.transactionType];
                return config ? (
                    <Badge variant={config.variant}>{config.label}</Badge>
                ) : null;
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const config = TRANSACTION_STATUS_BADGE[row.original.status];
                return config ? (
                    <Badge variant={config.variant}>{config.label}</Badge>
                ) : null;
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const isValuationPending =
                    row.original.status === "VALUATION_PENDING";

                return (
                    <div className="flex items-center gap-1">
                        {
                            isValuationPending ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                asChild
                                                onClick={() => {
                                                    setSelectedInventoryTransaction(row.original);
                                                    setSheetOpen(true);
                                                }}
                                            >
                                                <Calculator className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Create Valuation
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <div>{"-"}</div>
                            )
                        }
                    </div>
                );
            },
        },
    ];

    const calculateValuation = (formData: any) => {
        const grossQuantity = selectedInventoryTransaction?.quantity ?? 0;
        const bagQuantity = selectedInventoryTransaction?.bagQuantity ?? 0;
        const bLessWeight = Number(formData?.bLessWeight ?? 0);
        const dNotWeight = Number(formData?.dNotWeight ?? 0);
        const netUnitPrice = Number(formData?.netUnitPrice ?? 0);
        const otherCharges = Number(formData?.otherCharges ?? 0);
        const wastageDeduction = Number(formData?.wastageDeduction ?? 0);
        const calculatedNetQuantity = grossQuantity - (bagQuantity * bLessWeight) - dNotWeight;
        const calculatedBaseAmount = calculatedNetQuantity * netUnitPrice;
        const calculatedFinalNetAmount = calculatedBaseAmount + otherCharges - wastageDeduction;
        setNetQuantity(calculatedNetQuantity);
        setBaseAmount(calculatedBaseAmount);
        setFinalNetAmount(calculatedFinalNetAmount);
    };

    const { mutate: saveDraft, isPending: isDraftSaving } = useMutation({
        mutationFn: async (payload: any) => {
            return updateInventoryValuation(
                selectedInventoryTransaction!.id,
                payload
            );
        },
        onSuccess: async () => {
            toast.success("Valuation saved as draft");
            await queryClient.invalidateQueries({
                queryKey: ["inventory-transactions"],
            });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to save draft");
        },
    });

    const { mutate: finalizeValuation, isPending: isFinalizing } = useMutation({
        mutationFn: async (payload: any) => {
            return finalizeInventoryValuation(
                selectedInventoryTransaction!.id,
                payload
            );
        },
        onSuccess: async () => {
            toast.success("Valuation finalized successfully");
            setSheetOpen(false);

            await queryClient.invalidateQueries({
                queryKey: ["inventory-transactions"],
            });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to finalize valuation");
        },
    });


    return (

        <div>

            <DataTable
                columns={InventoryTransactionTableColumn}
                data={pageData}
                page={page}
                pageSize={size}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={setPage}
                onSortChange={setSort}
                isLoading={isLoading}
                stickyLastColumn={true}
                showTableHeader={true}
                tableHeaderText={"Inventory Transaction Details"}

            />


            <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>

                <DialogContent className="w-[60vw] max-h-[90vh] p-4.5 gap-4">

                    <VisuallyHidden>
                        <DialogHeader>
                            <DialogTitle>Inventory Valuation</DialogTitle>
                        </DialogHeader>
                    </VisuallyHidden>

                    <PageTitle
                        title="Inventory Valuation"
                        description="Calculate inventory transaction valuation."
                        startIcon={Calculator}
                    />

                    <div className="flex gap-3">
                        <div className="w-[50%] rounded-lg border p-1">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Transaction ID
                                        </TableCell>
                                        <TableCell>
                                            {selectedInventoryTransaction?.id}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Batch No
                                        </TableCell>
                                        <TableCell>
                                            {selectedInventoryTransaction?.batchNo}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Party
                                        </TableCell>
                                        <TableCell>
                                            {selectedInventoryTransaction?.partyName} -{" "}
                                            {selectedInventoryTransaction?.partyType}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Product
                                        </TableCell>
                                        <TableCell>
                                            {selectedInventoryTransaction?.productName}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Gross Quantity
                                        </TableCell>
                                        <TableCell>
                                            {formatKg(
                                                selectedInventoryTransaction?.quantity,
                                                "Kg"
                                            )}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Number of Bags
                                        </TableCell>
                                        <TableCell>
                                            {selectedInventoryTransaction?.bagQuantity}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Gross Unit Price
                                        </TableCell>
                                        <TableCell>
                                            ₹ {selectedInventoryTransaction?.unitPrice}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex flex-col w-[50%] gap-3">
                            <div className="w-full rounded-lg border p-1">
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-semibold">
                                                Net Amount
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                Net Quantity
                                            </TableCell>

                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="font-bold">
                                                ₹ {formatKg(finalNetAmount)}
                                            </TableCell>
                                            <TableCell className="font-bold">
                                                {formatKg(netQuantity, "Kg")}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            <Form
                                schema={valuationSchema}
                                uiSchema={valuationUISchema}
                                showSubmitBtn={false}
                                className="w-full px-1"
                                onChange={({ data }) => {
                                    setValuationFormData(data);
                                    calculateValuation(data);
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-background flex gap-2 ml-auto">
                        <Button
                            variant="destructive"
                            disabled={isDraftSaving}
                            onClick={() => setSheetOpen(false)}
                        >
                            <XCircle />
                            Cancel
                        </Button>
                        {/*<Button*/}
                        {/*    disabled={netQuantity <= 0 || finalNetAmount<= 0 || isDraftSaving}*/}
                        {/*    onClick={() => saveDraft(valuationFormData)}*/}
                        {/*>*/}
                        {/*    <Save /> Draft*/}
                        {/*</Button>*/}
                        <Button
                            disabled={netQuantity <= 0 || finalNetAmount<= 0 || isFinalizing}
                            onClick={() => finalizeValuation(valuationFormData)}
                        >
                            <CheckCircle /> Finalize
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>

    );
};

export default InventoryTransactionTableForInventoryPage;
