"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeftRight, Save } from "lucide-react";
import type { JsonSchema7 } from "@jsonforms/core";

import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import { inventoryTransaction } from "@/api/inventory";

import transferSchema from "@/assets/schema/Operations/Transfer/schema.json";
import transferUISchema from "@/assets/schema/Operations/Transfer/uischema.json";

const InternalTransferCreatePage = () => {
  const router = useRouter();

  const { mutate: onSubmit, isPending } = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const res = await inventoryTransaction(data);
      return res?.data;
    },
    onSuccess: () => {
      toast.success("Transfer completed successfully!");
      router.push("/move-history");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to complete transfer");
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Internal Transfer"
        description="Move stock between warehouses (source batch → destination warehouse)."
        startIcon={ArrowLeftRight}
      />

      <Form
        schema={transferSchema as unknown as JsonSchema7}
        uiSchema={transferUISchema}
        data={{
          transactionNature: "TRANSFER",
          transactionDirection: "OUT",
          affectsWarehouseQuantity: true,
          transactionDate: new Date().toISOString().slice(0, 10),
        }}
        submitBtnText="Complete Transfer"
        startIconForSubmitBtn={Save}
        isLoading={isPending}
        onSubmit={(e) => {
          if (e.status) onSubmit(e.data);
        }}
      />
    </div>
  );
};

export default InternalTransferCreatePage;
