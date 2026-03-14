import {getInventory} from "@/api/inventory";
import {useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton";
import { CircleCheckBig, CircleX, Package } from "lucide-react";
import {formatKg} from "@/components/basicComponents/entityDescriptionForCommand";
import {Badge} from "@/components/ui/badge";
import React from "react";


const fetchInventory = (inventoryId: string) => ({
    queryKey: ["inventory", inventoryId],
    queryFn: async () => {
        const response = await getInventory(inventoryId);
        return response?.data;
    },
    enabled: !!inventoryId,
})

type InventoryPageHeaderProps = {
    inventoryId: string;
};

const InventoryPageHeader = (
    { inventoryId }: InventoryPageHeaderProps
) => {

    const { data: inventoryData, isLoading: isLoadingInventoryData } = useQuery(fetchInventory(inventoryId));

    return (

        isLoadingInventoryData ? (
            <div className="w-full h-auto border rounded-xl">
                <div className="flex p-4 gap-3 items-start justify-between">
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-7 w-40" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>

                            <Skeleton className="h-4 w-52" />
                            <Skeleton className="h-4 w-44" />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {[1, 2, 3].map((_, i) => (
                            <div
                                key={i}
                                className="p-3 border border-dashed rounded-lg flex flex-col gap-2"
                            >
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className="w-full h-auto border rounded-lg">
                <div className="flex p-4 gap-3 items-start justify-between">
                    <div className="flex gap-3">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl font-semibold">
                                    {inventoryData?.batchNo}
                                </div>

                                {
                                    inventoryData?.isActive !== undefined && (
                                        inventoryData.isActive ? (
                                            <Badge className="bg-green-600 text-white flex gap-1">
                                                <CircleCheckBig size={14} /> Active
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-600 text-white flex gap-1">
                                                <CircleX size={14} /> Inactive
                                            </Badge>
                                        )
                                    )
                                }
                            </div>

                            <div className="flex flex-col text-sm font-medium text-muted-foreground">
                                <div>SUK: {inventoryData?.productName}</div>
                                <div>Warehouse: {inventoryData?.warehouseName}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="p-3 border border-dashed rounded-lg">
                            <div className="text-xl font-semibold">
                                {formatKg(inventoryData?.totalQuantity, "Kg")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Total Quantity
                            </div>
                        </div>

                        <div className="p-3 border border-dashed rounded-lg">
                            <div className="text-xl font-semibold">
                                {formatKg(inventoryData?.availableQuantity, "Kg")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Available Quantity
                            </div>
                        </div>

                        <div className="p-3 border border-dashed rounded-lg">
                            <div className="text-xl font-semibold">
                                {formatKg(inventoryData?.reserveQuantity, "Kg")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Reserve Quantity
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default InventoryPageHeader;