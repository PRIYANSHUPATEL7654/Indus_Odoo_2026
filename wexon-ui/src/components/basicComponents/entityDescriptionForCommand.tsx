import {Phone, MapPin, Tag, Layers, Building2, Warehouse, Package, CheckCircle, XCircle, Hash} from "lucide-react";


export const formatKg = (
    value?: number,
    unit?: string
) =>
    value != null
        ? `${new Intl.NumberFormat("en-IN").format(value)}${unit ? ` ${unit}` : ""}`
        : "";

export const getProductCommandDescription = (item : any) => {
    return (
        <div className="flex gap-3 text-sm text-muted-foreground">
            {
                item?.sku && (
                    <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span>{item.sku}</span>
                    </div>
                )
            }

            {
                item?.category && (
                    <div className="flex items-center gap-1">
                        <Layers className="h-4 w-4" />
                        <span>{item.category}</span>
                    </div>
                )
            }
        </div>
    );
};


export const getVendorCommandDescription = (item : any) => {
    return (
        <div className="flex gap-3 text-sm text-muted-foreground">
            {
                item?.companyName && (
                    <div className="flex items-center gap-1">
                        <Building2 />
                        <span>{item.companyName}</span>
                    </div>
                )
            }

            {
                item?.vendorType && (
                    <div className="flex items-center gap-1">
                        <Tag />
                        <span>{item.vendorType}</span>
                    </div>
                )
            }


            {
                item?.mobileNumber && (
                    <div className="flex items-center gap-1">
                        <Phone />
                        <span>{item.mobileNumber}</span>
                    </div>
                )
            }

            {
                item?.city && (
                    <div className="flex items-center gap-1">
                        <MapPin />
                        <span>{item.city}</span>
                    </div>
                )
            }

        </div>
    );
};


export const getWarehouseCommandDescription = (item : any) => {
    return (
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">

            <div className="flex gap-3">
                {
                    item?.warehouseCode && (
                        <div className="flex items-center gap-2">
                            <Warehouse className="h-4 w-4" />
                            <span>{item.warehouseCode}</span>
                        </div>
                    )
                }

                {
                    item?.ownerName && (
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span>{item.ownerName}</span>
                        </div>
                    )
                }

                {
                    item?.contactNumber && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{item.contactNumber}</span>
                        </div>
                    )
                }

                {
                    item?.city && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{item.city}</span>
                        </div>
                    )
                }

            </div>

            <div className="flex gap-3">

                {
                    item?.availableCapacity != null &&
                    item?.totalCapacity != null && (
                        <div>
                            Capacity:{" "}
                            <span>{formatKg(item.availableCapacity)}</span>{" "}
                            / {formatKg(item.totalCapacity)}
                        </div>
                    )
                }

                {
                    item?.isActive != null && (
                        <div className="flex items-center gap-2 text-xs">
                            {item.isActive ? (
                                <>
                                    <CheckCircle className="text-green-600" />
                                    <span className="text-green-600">Active</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="text-red-600" />
                                    <span className="text-red-600">Inactive</span>
                                </>
                            )}
                        </div>
                    )
                }

            </div>


        </div>
    );
};

export const getAvailableInventoryCommandDescription = ( item: any) => {
    return (
        <div className="flex gap-3 text-sm text-muted-foreground">

            {
                item?.productName && (
                    <div className="flex items-center gap-1">
                        <Package />
                        <span>{item.productName}</span>
                    </div>
                )
            }

            {
                item?.availableQuantity != null && (
                    <div className="flex items-center gap-1">
                        <Hash />
                        <span>
                            Available Qty:{" "}
                            <span>{formatKg(item.availableQuantity)}</span>
                        </span>
                    </div>
                )
            }
        </div>
    );
};

export const getLocationCommandDescription = (item: any) => {
    return (
        <div className="flex gap-3 text-sm text-muted-foreground">
            {
                item?.locationCode && (
                    <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span>{item.locationCode}</span>
                    </div>
                )
            }
            {
                item?.locationName && (
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{item.locationName}</span>
                    </div>
                )
            }
        </div>
    );
};
