import getAxiosInstance from "@/api/getAxiosInstance";
import { FilterParams, PaginationSearchParams } from "@/helpers/commanProps";

export const createWarehouse = (data: any) => {
    const instance = getAxiosInstance();
    return instance.post("/warehouse/create", data);
};

export const updateWarehouse = (data: any, id: any) => {
    const instance = getAxiosInstance();
    return instance.put(`/warehouse/update/${id}`, data);
};

export const deleteWarehouse = (id: any) => {
    const instance = getAxiosInstance();
    return instance.delete(`/warehouse/delete/${id}`);
};

export const getWarehouse = (id: any) => {
    const instance = getAxiosInstance();
    return instance.get(`/warehouse/get/${id}`);
};

export const getAllWarehouses = () => {
    const instance = getAxiosInstance();
    return instance.post("/warehouse/getWarehouseListWithFilter");
};

export const getWarehouseListWithPaginationAndFilter = (
    params: PaginationSearchParams = {},
    filters: FilterParams = {},
) => {
    const instance = getAxiosInstance();
    return instance.post("/warehouse/getWarehouseListWithPaginationAndFilter", filters, { params });
};

export const getWarehouseDashboardStats = () => {
    const instance = getAxiosInstance();
    return instance.get("/warehouse/getStats");
};


