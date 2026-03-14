"use client";

// React
import { useState } from "react";
import { useParams } from "next/navigation";

// API
import { getWarehouse, updateWarehouse } from "@/api/warehouse";

// TanStack Query
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

// Assets
import { Edit, Save, Warehouse } from "lucide-react";
import warehouseSchema from "@/assets/schema/Warehouse/schema.json";
import updateWarehouseUISchema from "@/assets/schema/Warehouse/updateUISchema.json";

// Components
import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import GlobalLoading from "@/app/loading";

const fetchWarehouse = (warehouseId: string) => ({
    queryKey: ["warehouse", warehouseId],
    queryFn: async () => {
        const response = await getWarehouse(warehouseId);
        return response.data;
    },
    enabled: !!warehouseId,
    staleTime: 1000 * 60 * 5,
});

const WarehouseEditPage = () => {

    // States
    const { id: warehouseId } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [isEdit, setIsEdit] = useState(false);

    // Query: Fetch Warehouse
    const { data, isLoading } = useQuery(fetchWarehouse(warehouseId));

    // Mutation: Update Warehouse
    const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            const response = await updateWarehouse(data, warehouseId);
            return response.data;
        },
        onSuccess: async () => {
            toast.success("Warehouse Updated Successfully");
            setIsEdit(false);
            await queryClient.invalidateQueries({
                queryKey: ["warehouse", warehouseId],
            });
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update warehouse");
        },
    });

    return (
        <div className="page flex flex-col gap-5">

            { isLoading && <GlobalLoading /> }

            {
                data && (
                    <>
                        <PageTitle
                            title={data?.warehouseName}
                            description={data?.warehouseCode}
                            startIcon={Warehouse}
                            isLoading={isLoading}
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
                        />

                        <Form
                            schema={warehouseSchema}
                            uiSchema={updateWarehouseUISchema}
                            data={data}
                            submitBtnText="Update Warehouse"
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

export default WarehouseEditPage;
