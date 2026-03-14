import getAxiosInstance from "@/api/getAxiosInstance";
import { FilterParams, PaginationSearchParams } from "@/helpers/commanProps";

export const createVendor = (data: any) => {
    const instance = getAxiosInstance();
    return instance.post("/vendor/create", data);
};

export const updateVendor = (data: any, id: any) => {
    const instance = getAxiosInstance();
    return instance.put(`/vendor/update/${id}`, data);
};

export const deleteVendor = (id: any) => {
    const instance = getAxiosInstance();
    return instance.delete(`/vendor/delete/${id}`);
};

export const getVendor = (id: any) => {
    const instance = getAxiosInstance();
    return instance.get(`/vendor/get/${id}`);
};

export const getAllVendors = () => {
    const instance = getAxiosInstance();
    return instance.post("/vendor/getVendorListWithFilter");
};

export const getVendorWithPagination = (
    params: PaginationSearchParams = {},
    filters: FilterParams = {},
) => {
    const instance = getAxiosInstance();
    return instance.post(
        "/vendor/getVendorListWithPaginationAndFilter",
        filters,
        { params }
    );
};
