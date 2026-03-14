"use client";


import {useRouter} from "next/navigation";
import {ArrowLeftRight, FilePlus} from "lucide-react";
import PageTitle from "@/components/basicComponents/PageTitle";
import Form from "@/components/jsonforms/Form";

import InventoryFormSchema from "@/assets/schema/Inventory/Transaction/schema.json";
import InventoryFormUISchema from "@/assets/schema/Inventory/Transaction/uischema.json";

const TransactionPage = () => {

    const router = useRouter();

    return (

        <div className="flex flex-col gap-5">

            <PageTitle
                title="Inventory Transaction"
                description="Create and manage all stock movements including Buy, Sell,
                Transfer, and Adjustment using a single dynamic form with batch-level control."
                startIcon={ArrowLeftRight}
            />

            <Form
                schema={InventoryFormSchema}
                uiSchema={InventoryFormUISchema}
                // className="w-full"
                onChange={(data) => {
                    console.log(data);
                }}
            />

        </div>
    )
}

export default TransactionPage;