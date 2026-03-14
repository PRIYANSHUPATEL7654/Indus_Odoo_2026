"use client";

// React
import { useState } from "react";
import { useParams } from "next/navigation";

// API
import { getProduct, updateProduct } from "@/api/product";

// TanStack Query
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

// Assets
import { Edit, Save, Package } from "lucide-react";
import productSchema from "@/assets/schema/Product/schema.json";
import updateProductUISchema from "@/assets/schema/Product/updateUISchema.json";

// Components
import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import GlobalLoading from "@/app/loading";

const fetchProduct = (productId: string) => ({
    queryKey: ["product", productId],
    queryFn: async () => {
        const response = await getProduct(productId);
        return response.data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
});

const ProductEditPage = () => {

    // States
    const { id: productId } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [isEdit, setIsEdit] = useState(false);

    // Query: Fetch Product Details
    const { data, isLoading } = useQuery(fetchProduct(productId));

    // Mutation: Update Product
    const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            const response = await updateProduct(data, productId);
            return response.data;
        },
        onSuccess: async () => {
            toast.success("Product Updated Successfully");
            setIsEdit(false);
            await queryClient.invalidateQueries({
                queryKey: ["product", productId],
            });
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update product");
        },
    });

    return (
        <div className="page flex flex-col gap-5">

            { isLoading && <GlobalLoading /> }

            {data && (
                <>
                    <PageTitle
                        title={data?.productName}
                        description={data?.category}
                        startIcon={Package}
                        actions={
                            !isEdit && (
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    onClick={() => setIsEdit(true)}
                                >
                                    <Edit />
                                    {"Edit Information"}
                                </Button>
                            )
                        }
                        isLoading={isLoading}
                    />

                        <Form
                            schema={productSchema}
                            uiSchema={updateProductUISchema}
                            data={data}
                            submitBtnText="Update Product"
                            startIconForSubmitBtn={Save}
                            isLoading={isSavingLoading}
                            onSubmit={(e) => {
                                if (e.status) onSubmit(e.data);
                            }}
                            readOnly={!isEdit}
                        />
                    </>
                )
            }
        </div>
    );
};

export default ProductEditPage;
