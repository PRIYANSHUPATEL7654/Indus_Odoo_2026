"use client";

// React
import { useRouter } from "next/navigation";

// API
import { createWarehouse } from "@/api/warehouse";

// TanStack Query
import { useMutation } from "@tanstack/react-query";

// Assets
import { Save, Warehouse } from "lucide-react";
import warehouseSchema from "@/assets/schema/Warehouse/schema.json";
import createWarehouseUISchema from "@/assets/schema/Warehouse/createUISchema.json";

// Components
import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import { toast } from "sonner";

const WarehouseAddPage = () => {

    const router = useRouter();

    // Mutation: Create Warehouse
    const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            const response = await createWarehouse(data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Warehouse Registered Successfully");
            router.push("/warehouse/list");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to register warehouse");
        },
    });

    return (

        <div className="flex flex-col gap-5">

            <PageTitle
                title="New Warehouse Registration"
                description="Capture warehouse information for system records"
                startIcon={Warehouse}
            />

            <Form
                schema={warehouseSchema}
                uiSchema={createWarehouseUISchema}
                submitBtnText="Save Warehouse"
                startIconForSubmitBtn={Save}
                isLoading={isSavingLoading}
                onSubmit={(e) => {
                    if (e.status) onSubmit(e.data);
                }}
            />

        </div>
    );
};

export default WarehouseAddPage;
