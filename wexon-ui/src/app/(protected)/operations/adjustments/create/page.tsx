"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, SlidersHorizontal } from "lucide-react";
import type { JsonSchema7 } from "@jsonforms/core";

import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import { inventoryTransaction } from "@/api/inventory";

import adjustmentSchema from "@/assets/schema/Operations/Adjustment/schema.json";
import adjustmentUISchema from "@/assets/schema/Operations/Adjustment/uischema.json";

const AdjustmentCreatePage = () => {
  const router = useRouter();

  const { mutate: onSubmit, isPending } = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const res = await inventoryTransaction(data);
      return res?.data;
    },
    onSuccess: () => {
      toast.success("Adjustment completed successfully!");
      router.push("/move-history");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to complete adjustment");
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Inventory Adjustment"
        description="Record stock corrections (physical count, damaged items, etc.)."
        startIcon={SlidersHorizontal}
      />

      <Form
        schema={adjustmentSchema as unknown as JsonSchema7}
        uiSchema={adjustmentUISchema}
        data={{
          transactionNature: "ADJUSTMENT",
          affectsWarehouseQuantity: true,
          transactionDate: new Date().toISOString().slice(0, 10),
        }}
        submitBtnText="Complete Adjustment"
        startIconForSubmitBtn={Save}
        isLoading={isPending}
        onSubmit={(e) => {
          if (e.status) onSubmit(e.data);
        }}
      />
    </div>
  );
};

export default AdjustmentCreatePage;
