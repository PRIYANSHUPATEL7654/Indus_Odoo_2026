"use client";

import { useRouter } from "next/navigation";
import React from "react";
import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowUpFromLine, Save } from "lucide-react";
import type { JsonSchema7 } from "@jsonforms/core";

import deliverySchema from "@/assets/schema/Inventory/Sell/schema.json";
import deliveryUISchema from "@/assets/schema/Inventory/Sell/uischema.json";
import { inventoryTransaction } from "@/api/inventory";

const DeliveryOrderCreatePage = () => {
  const router = useRouter();

  const { mutate: onSubmit, isPending: isSavingLoading } = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const response = await inventoryTransaction(data);
      return response?.data;
    },
    onSuccess: () => {
      toast.success("Delivery order created successfully!");
      router.push("/inventory/manage");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create delivery order");
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Create Delivery Order"
        description="Record outgoing stock (Delivery). Inventory updates automatically after creation."
        startIcon={ArrowUpFromLine}
      />

      <Form
        schema={deliverySchema as unknown as JsonSchema7}
        uiSchema={deliveryUISchema}
        data={{
          transactionNature: "SELL",
          transactionDirection: "OUT",
          partyType: "VENDOR",
          transactionDate: new Date().toISOString().slice(0, 10),
        }}
        submitBtnText="Create Delivery Order"
        startIconForSubmitBtn={Save}
        isLoading={isSavingLoading}
        onSubmit={(e) => {
          if (e.status) onSubmit(e.data);
        }}
      />
    </div>
  );
};

export default DeliveryOrderCreatePage;
