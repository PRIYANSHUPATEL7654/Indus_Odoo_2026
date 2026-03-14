"use client";

import { useRouter } from "next/navigation";
import React from "react";
import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDownToLine, Save } from "lucide-react";
import type { JsonSchema7 } from "@jsonforms/core";

import receiptSchema from "@/assets/schema/Inventory/Buy/schema.json";
import receiptUISchema from "@/assets/schema/Inventory/Buy/uischema.json";
import { inventoryTransaction } from "@/api/inventory";

const ReceiptCreatePage = () => {
  const router = useRouter();

  const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const response = await inventoryTransaction(data);
      return response?.data;
    },
    onSuccess: () => {
      toast.success("Receipt created successfully!");
      router.push("/inventory/manage");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create receipt");
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Create Receipt"
        description="Record incoming stock (Receipt). Inventory updates automatically after creation."
        startIcon={ArrowDownToLine}
      />

      <Form
        schema={receiptSchema as unknown as JsonSchema7}
        uiSchema={receiptUISchema}
        data={{
          transactionNature: "BUY",
          transactionDirection: "IN",
          partyType: "VENDOR",
          affectsWarehouseQuantity: true,
          transactionDate: new Date().toISOString().slice(0, 10),
        }}
        submitBtnText="Create Receipt"
        startIconForSubmitBtn={Save}
        isLoading={isSavingLoading}
        onSubmit={(e) => {
          if (e.status) onSubmit(e.data);
        }}
      />
    </div>
  );
};

export default ReceiptCreatePage;
