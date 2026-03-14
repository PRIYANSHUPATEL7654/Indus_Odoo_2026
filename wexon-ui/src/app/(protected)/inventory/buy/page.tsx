"use client"

import {useRouter} from "next/navigation";
import PageTitle from "@/components/basicComponents/PageTitle";
import {PackagePlus, Save} from "lucide-react";
import inventoryInUISchema from "@/assets/schema/Inventory/Buy/uischema.json";
import Form from "@/components/jsonforms/Form";
import { useMutation } from "@tanstack/react-query";
import {toast} from "sonner";
import {inventoryTransaction} from "@/api/inventory";
import inventoryInSchema from "@/assets/schema/Inventory/Buy/schema.json";
import type { JsonSchema7 } from "@jsonforms/core";


const InventoryBuyPage = () => {

    const router = useRouter();

    // Mutation API Call for Add Inventory
    const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            const response = await inventoryTransaction(data);
            return response?.data;
        },
        onSuccess: () => {
            toast.success("Inventory Added Successfully!");
            router.push("/inventory/manage");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to Add Inventory");
        },
    })


    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="Buy Inventory"
                description="Record and manage inward stock entries for your warehouse."
                startIcon={PackagePlus}
            />

            <Form
                schema={inventoryInSchema as unknown as JsonSchema7}
                uiSchema={inventoryInUISchema}
                submitBtnText="Add Inventory"
                startIconForSubmitBtn={Save}
                isLoading={isSavingLoading}
                onSubmit={(e) => {
                    if(e.status) onSubmit(e?.data)
                }}
            />

        </div>
    )
}

export default InventoryBuyPage;