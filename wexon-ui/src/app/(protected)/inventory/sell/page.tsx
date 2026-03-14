"use client"

import { useRouter } from "next/navigation";
import PageTitle from "@/components/basicComponents/PageTitle";
import { PackageMinus, Save } from "lucide-react";
import inventoryOutSchema from "@/assets/schema/Inventory/Sell/schema.json";
import inventoryOutUISchema from "@/assets/schema/Inventory/Sell/uischema.json";
import Form from "@/components/jsonforms/Form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {inventoryTransaction} from "@/api/inventory";

const InventorySellPage = () => {

    const router = useRouter();

    // Mutation API Call for Stock Out
    const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            const response = await inventoryTransaction(data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Inventory Removed Successfully!");
            router.push("/inventory/manage");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to Remove Inventory");
        },
    });

    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="Sell Inventory"
                description="Record and manage outward stock movements from your warehouse."
                startIcon={PackageMinus}
            />

            <Form
                schema={inventoryOutSchema}
                uiSchema={inventoryOutUISchema}
                submitBtnText="Remove Inventory"
                startIconForSubmitBtn={Save}
                isLoading={isSavingLoading}
                onSubmit={(e) => {
                    if (e.status) onSubmit(e.data);
                }}
            />

        </div>
    );
};

export default InventorySellPage;
