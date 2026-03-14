import { getAllLocations } from "@/api/location";
import { getAllProducts } from "@/api/product";
import { getAllVendors } from "@/api/vendor";
import { getAllWarehouses } from "@/api/warehouse";
import { getBatchNoList } from "@/api/inventory";
import { Option } from "@/components/basicComponents/Select/EntityCommandSelect";
import {
    getAvailableInventoryCommandDescription,
    getLocationCommandDescription,
    getProductCommandDescription,
    getVendorCommandDescription,
    getWarehouseCommandDescription
} from "@/components/basicComponents/entityDescriptionForCommand";


export type EntityConfig<T = any> = {
    queryKey: string;
    queryFn: () => Promise<any>;
    options: (item: T) => Option;
};

export type EntityKey = keyof typeof ENTITY_CONFIG;

export const ENTITY_CONFIG = {
    products: {
        queryKey: "products",
        queryFn: getAllProducts,
        options: (item) => ({
            label: item.productName,
            value: item.id,
            description: getProductCommandDescription(item),
            searchText: item.productName,
        }),
    },

    vendors: {
        queryKey: "vendors",
        queryFn: getAllVendors,
        options: (item) => ({
            label: item.vendorName,
            value: item.id,
            description: getVendorCommandDescription(item),
            searchText: item.mobileNumber,
        }),
    },

    warehouses: {
        queryKey: "warehouses",
        queryFn: getAllWarehouses,
        options: (item) => ({
            label: item.warehouseName,
            value: item.id,
            description: getWarehouseCommandDescription(item),
            searchText: item.warehouseName,
        }),
    },

    locations: {
        queryKey: "locations",
        queryFn: getAllLocations,
        options: (item) => ({
            label: item.locationName,
            value: item.id,
            description: getLocationCommandDescription(item),
            searchText: item.locationCode,
        }),
    },

    availableBatches: {
        queryKey: "availableBatches",
        queryFn: getBatchNoList,
        options: (item) => ({
            label: item.batchNo,
            value: item.batchNo,
            description: getAvailableInventoryCommandDescription(item),
            searchText: item.productName,
        }),
    }

} satisfies Record<string, EntityConfig>;
