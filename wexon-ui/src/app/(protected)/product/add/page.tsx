"use client";

// React
import { useRouter } from "next/navigation";

// API
import { createProduct } from "@/api/product";

// TanStack Query
import { useMutation } from "@tanstack/react-query";

// Assets
import { Save, Package } from "lucide-react";
import productSchema from "@/assets/schema/Product/schema.json";
import createProductUISchema from "@/assets/schema/Product/createUISchema.json";

// Components
import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import { toast } from "sonner";

const ProductAddPage = () => {

    const router = useRouter();

    // Mutation: Create Product
    const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            const response = await createProduct(data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Product Created Successfully");
            router.push("/product/list");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to create product");
        },
    });

    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="New Product Registration"
                description="Enter product information for system records"
                startIcon={Package}
            />

            <Form
                schema={productSchema}
                uiSchema={createProductUISchema}
                submitBtnText="Save Product"
                startIconForSubmitBtn={Save}
                isLoading={isSavingLoading}
                onSubmit={(e) => {
                    if (e.status) onSubmit(e.data);
                }}
            />

        </div>
    );
};

export default ProductAddPage;
