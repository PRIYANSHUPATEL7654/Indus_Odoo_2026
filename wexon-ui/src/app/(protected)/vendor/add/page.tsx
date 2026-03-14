"use client";

// React
import { useRouter } from "next/navigation";

// API
import { createVendor } from "@/api/vendor";

// TanStack Query
import { useMutation } from "@tanstack/react-query";

// Assets
import { Save, Building2 } from "lucide-react";
import vendorSchema from "@/assets/schema/Vendor/schema.json";
import createVendorUISchema from "@/assets/schema/Vendor/createUISchema.json";

// Components
import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import { toast } from "sonner";

const VendorAddPage = () => {

    const router = useRouter();

    // Mutation API Call for Create Vendor
    const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            const response = await createVendor(data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Vendor Registration Successfully");
            router.push("/vendor/list");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to register vendor");
        },
    });

    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="New Vendor Registration"
                description="Capture vendor information for system records"
                startIcon={Building2}
            />

            <Form
                schema={vendorSchema}
                uiSchema={createVendorUISchema}
                submitBtnText="Save Vendor"
                startIconForSubmitBtn={Save}
                isLoading={isSavingLoading}
                onSubmit={(e) => {
                    if (e.status) onSubmit(e.data);
                }}
            />

        </div>
    );
};

export default VendorAddPage;
