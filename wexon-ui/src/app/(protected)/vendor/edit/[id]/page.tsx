"use client";

// React
import { useState } from "react";
import { useParams } from "next/navigation";

// API
import { getVendor, updateVendor } from "@/api/vendor";

// TanStack Query
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

// Assets
import { Edit, Save, Building2 } from "lucide-react";
import vendorSchema from "@/assets/schema/Vendor/schema.json";
import updateVendorUISchema from "@/assets/schema/Vendor/updateUISchema.json";

// Components
import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import GlobalLoading from "@/app/loading";

const fetchVendor = (vendorId: string) => ({
    queryKey: ["vendor", vendorId],
    queryFn: async () => {
        const response = await getVendor(vendorId);
        return response.data;
    },
    enabled: !!vendorId,
    staleTime: 1000 * 60 * 5,
});

const VendorEditPage = () => {

    // States
    const { id: vendorId } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [isEdit, setIsEdit] = useState(false);

    // Query: Fetch Vendor Details
    const { data, isLoading } = useQuery(fetchVendor(vendorId));

    // Mutation: Update Vendor
    const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
        mutationFn: async (data: Record<string, any>) => {
            const response = await updateVendor(data, vendorId);
            return response.data;
        },
        onSuccess: async () => {
            toast.success("Vendor Updated Successfully");
            setIsEdit(false);
            await queryClient.invalidateQueries({
                queryKey: ["vendor", vendorId],
            });
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update vendor");
        },
    });

    return (
        <div className="page flex flex-col gap-5">

            { isLoading && <GlobalLoading /> }

            {
                data && (
                    <>
                        <PageTitle
                            title={data?.vendorName}
                            description={data?.mobileNumber}
                            startIcon={Building2}
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
                            schema={vendorSchema}
                            uiSchema={updateVendorUISchema}
                            data={data}
                            submitBtnText="Update Vendor"
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

export default VendorEditPage;
