"use client"

import {ArrowDownToLine, ArrowLeftRight, ArrowUpFromLine, Boxes, SlidersHorizontal} from "lucide-react";
import PageTitle from "@/components/basicComponents/PageTitle";
import React from "react";
import InventoryTransactionTable from "@/app/(protected)/inventory/manage/InventoryTransactionTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const InventoryManagePage = () => {


    return (
        <div className="flex flex-col gap-5">

            <PageTitle
                title="Manage Inventory"
                description="Track, manage, and monitor all inventory inflow and outflow in one place."
                startIcon={Boxes}
                actions={
                    <div className="flex gap-3">
                        <Button className="cursor-pointer">
                            <Link href="/operations/receipts/create" className="flex gap-2">
                                <ArrowDownToLine />
                                Receipt
                            </Link>
                        </Button>

                        <Button variant="secondary" className="cursor-pointer">
                            <Link href="/operations/delivery-orders/create" className="flex gap-2">
                                <ArrowUpFromLine />
                                Delivery
                            </Link>
                        </Button>

                        <Button variant="outline" className="cursor-pointer">
                            <Link href="/operations/internal-transfers/create" className="flex gap-2">
                                <ArrowLeftRight />
                                Transfer
                            </Link>
                        </Button>

                        <Button variant="outline" className="cursor-pointer">
                            <Link href="/operations/adjustments/create" className="flex gap-2">
                                <SlidersHorizontal />
                                Adjustment
                            </Link>
                        </Button>
                    </div>
                }
            />

            <div className="flex flex-col gap-3">

                <InventoryTransactionTable />

            </div>
        </div>
    )
}

export default InventoryManagePage;
