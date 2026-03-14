
export type Vendor = {
    id: string;
    vendorName: string;
    companyName: string;
    email?: string;
    mobileNumber: string;
    gstNumber?: string;
    addressLine1: string;
    addressLine2?: string;
    village: string;
    taluka: string;
    district: string;
    city?: string;
    state: string;
    pincode: string;
    isActive?: boolean;
};
