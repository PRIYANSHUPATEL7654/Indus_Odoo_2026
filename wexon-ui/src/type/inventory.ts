
export type Inventory = {
    id: string;
    batchNo: string;
    productId: string;
    productName: string;
    warehouseId: string;
    warehouseName: string;
    inventoryType: string;
    affectsWarehouseQuantity: boolean;
    totalQuantity: number;
    availableQuantity: number;
    isActive: boolean;
    remarks?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
};
