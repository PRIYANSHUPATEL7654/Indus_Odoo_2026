
export type WarehouseType = {
    id: string;
    warehouseName: string;
    warehouseCode: string;
    ownerName: string;
    contactNumber: string;
    totalCapacity: number;
    availableCapacity: number;
    usedCapacity: number;
    addressLine1: string;
    addressLine2?: string;
    village?: string;
    taluka?: string;
    district?: string;
    city: string;
    state: string;
    pincode: string;
    isActive: boolean;
    isDeleted: boolean;
};
