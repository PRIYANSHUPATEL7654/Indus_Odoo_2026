"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Save } from "lucide-react";
import type { JsonSchema7 } from "@jsonforms/core";

import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";
import { createLocation } from "@/api/location";

import locationSchema from "@/assets/schema/Warehouse/Location/schema.json";
import locationUISchema from "@/assets/schema/Warehouse/Location/uischema.json";

const LocationAddPage = () => {
  const router = useRouter();

  const { mutate: onSubmit, isPending } = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const res = await createLocation(data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Location created successfully!");
      router.push("/locations/list");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create location");
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Add Location"
        description="Create a storage location under a warehouse."
        startIcon={MapPin}
      />

      <Form
        schema={locationSchema as unknown as JsonSchema7}
        uiSchema={locationUISchema}
        submitBtnText="Create Location"
        startIconForSubmitBtn={Save}
        isLoading={isPending}
        onSubmit={(e) => {
          if (e.status) onSubmit(e.data);
        }}
      />
    </div>
  );
};

export default LocationAddPage;

