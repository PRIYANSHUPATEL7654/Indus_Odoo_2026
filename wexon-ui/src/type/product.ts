
export type Product = {
    id: string;
    sku: string;
    productName: string;
    description?: string;
    baseUnit?: string;
    isAffectedWarehouseCapacity?: boolean;
    category: string;
    isActive: boolean;
    isDeleted: boolean;
};