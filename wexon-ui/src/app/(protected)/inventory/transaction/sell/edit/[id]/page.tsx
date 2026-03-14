"use client"

import { useParams } from "next/navigation";
import React from "react";
import InventoryTransactionPageHeader from "@/app/(protected)/inventory/transaction/sell/edit/[id]/InventoryTransactionPageHeader";
import InventoryTransactionDetailsTable from "@/app/(protected)/inventory/transaction/sell/edit/[id]/InventoryTransactionDetailsTable";


const InventoryEditPage = () => {

    const { id: transactionId } = useParams<{ id: string }>();

    return (
        <div className="flex flex-col gap-5">

            <InventoryTransactionPageHeader transactionId={transactionId} />

            <InventoryTransactionDetailsTable transactionId={transactionId} />

        </div>
    )
}

export default InventoryEditPage;