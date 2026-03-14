"use client";

import { useParams } from "next/navigation";
import InventoryTransactionTableForInventoryPage from "@/app/(protected)/inventory/[id]/InventoryTransactionTableForInventoryPage";
import InventoryPageHeader from "@/app/(protected)/inventory/[id]/InventoryPageHeader";
import PageTitle from "@/components/basicComponents/PageTitle";
import React from "react";
import {Box} from "lucide-react";

const InventoryPage = () => {

    const { id: inventoryId } = useParams<{ id: string }>();

    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="Inventory Details"
                description="Track, manage, and monitor all inventory inflow and outflow in one place."
                startIcon={Box}
            />

            <InventoryPageHeader
                inventoryId={inventoryId}
            />

            <InventoryTransactionTableForInventoryPage
                inventoryId={inventoryId}
            />
        </div>
    )
}

export default InventoryPage;