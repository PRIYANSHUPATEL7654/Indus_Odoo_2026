
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import React, {useState} from "react";
import {deleteTransaction, getInventoryTransaction, inventoryTransactionApprove} from "@/api/inventory";
import {Box, Calendar, CircleCheck, CirclePlus, CircleX, FileIcon, Trash2Icon, User} from "lucide-react";
import PageTitle from "@/components/basicComponents/PageTitle";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useRouter} from "next/navigation";

const fetchTransaction = (transactionId: string) => ({
    queryKey: ["inventory-transaction", transactionId],
    queryFn: async () => {
        const response = await getInventoryTransaction(transactionId);
        return response?.data;
    },
    enabled: !!transactionId,
});

type InventoryTransactionPageHeaderProps = {
    transactionId: string;
};

const InventoryTransactionPageHeader = (
    { transactionId }: InventoryTransactionPageHeaderProps
) => {

    const router = useRouter();
    const { data: transactionData, isLoading } = useQuery(fetchTransaction(transactionId));
    const [isAlertDialog, setIsAlertDialog] = useState(false);
    const queryClient = useQueryClient();

    // Mutation API Call for Delete Inventory Transaction
    const { mutate: onDelete } = useMutation({
        mutationFn: async (id: any) => {
            return deleteTransaction(id);
        },
        onSuccess: () => {
            toast.success("Inventory Transaction Deleted Successfully!");
            router.push("/inventory/manage");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to Deleted inventory transaction");
        },
    });

    // Mutation API Call for Approve Inventory Transaction
    const { mutate: onApprove } = useMutation({
        mutationFn: async (id: any) => {
            const payload = {
                "transactionNature" : "BUY"
            }
            return inventoryTransactionApprove(id, payload);
        },
        onSuccess: () => {
            toast.success("Inventory Transaction Deleted Successfully!");
            queryClient.invalidateQueries({
                queryKey: ["inventory-transaction", transactionId],
            });
            queryClient.invalidateQueries({
                queryKey: ["transaction-details"],
            });

        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to Deleted inventory transaction");
        },
    });


    return (
        <>
            <PageTitle
                title="Inventory Transaction"
                description="This page displays the details of a selected inventory transaction."
                startIcon={FileIcon}
                isLoading={isLoading}
                actions={
                    <div>
                        {
                            transactionData?.status == "CREATED" && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => {onApprove(transactionId)}}
                                    >
                                        <CircleCheck />Approve
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {setIsAlertDialog(true)}}
                                    >
                                        <CircleX />Delete
                                    </Button>
                                </div>
                            )
                        }
                    </div>
                }
            />

            {
                isLoading ? (
                    <div className="w-full h-auto border rounded-xl">
                        <div className="flex p-4 gap-3 items-start justify-between">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-7 w-64" />
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-40" />
                            </div>

                            <div className="flex gap-3">
                                {[1, 2].map((_, i) => (
                                    <div
                                        key={i}
                                        className="p-3 border border-dashed rounded-lg"
                                    >
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-4 w-28" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-auto border rounded-lg">
                        <div className="flex p-4 gap-3 items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl font-semibold">
                                        {transactionData?.transactionNo}
                                    </div>

                                    {
                                        transactionData?.status && (
                                            <Badge
                                                className={
                                                    transactionData.status === "CREATED"
                                                        ? "bg-blue-600 text-white"
                                                        : transactionData.status === "APPROVED"
                                                            ? "bg-green-600 text-white"
                                                            : "bg-red-600 text-white"
                                                }
                                            >
                                                {transactionData.status}
                                            </Badge>
                                        )
                                    }

                                    {
                                        transactionData?.transactionNature && (
                                            <Badge>
                                                {transactionData.transactionNature}
                                            </Badge>
                                        )
                                    }

                                </div>

                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4"/>
                                    <div className="text-sm font-medium text-muted-foreground">
                                        {transactionData?.partyName} • {transactionData?.partyType}
                                    </div>
                                </div>


                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1">
                                        <Box className="h-4 w-4"/>
                                        <div className="text-sm font-medium text-muted-foreground">
                                            {transactionData?.productName}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4"/>
                                        <div className="text-sm font-medium text-muted-foreground">
                                            { new Date(
                                                transactionData?.transactionDate
                                            ).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <AlertDialog open={isAlertDialog} onOpenChange={setIsAlertDialog}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2Icon />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this whole transaction.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {onDelete(transactionId)}}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
};

export default InventoryTransactionPageHeader;
