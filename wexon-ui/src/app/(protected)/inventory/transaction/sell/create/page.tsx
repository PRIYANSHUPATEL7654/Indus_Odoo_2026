"use client"


import {useRouter} from "next/navigation";
import PageTitle from "@/components/basicComponents/PageTitle";
import {FilePlus, Save} from "lucide-react";
import Form from "@/components/jsonforms/Form";
import transactionCreateUISchema from "@/assets/schema/Inventory/SellTransaction/Create/uischema.json";
import transactionCreateSchema from "@/assets/schema/Inventory/SellTransaction/Create/schema.json";
import {useMutation} from "@tanstack/react-query";
import {inventoryTransaction} from "@/api/inventory";
import {toast} from "sonner";


const TransactionPage = () => {

    const router = useRouter();

    // Mutation API Call for Create Inventory Transaction
    const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            const response = await inventoryTransaction(data);
            return response?.data;
        },
        onSuccess: () => {
            toast.success("Inventory Transaction Created Successfully!");
            router.push("/inventory/manage");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to Created Inventory Transaction");
        },
    })

    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="Create Transaction"
                description="Create a new transaction to record business activity such as buying, selling, renting, or transferring items."
                startIcon={FilePlus}
            />

            <Form
                schema={transactionCreateSchema}
                uiSchema={transactionCreateUISchema}
                submitBtnText="Create Transaction"
                startIconForSubmitBtn={Save}
                isLoading={isSavingLoading}
                onSubmit={(e) => {
                    if(e.status) onSubmit(e?.data)
                }}
            />

        </div>
    )
}

export default TransactionPage;