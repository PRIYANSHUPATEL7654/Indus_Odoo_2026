import getAxiosInstance from "@/api/getAxiosInstance";
import { FilterParams, PaginationSearchParams} from "@/helpers/commanProps";

export const createProduct = (data: any) => {
    const instance = getAxiosInstance();
    return instance.post("/product/create", data);
};

export const updateProduct = (data: any, id: any) => {
    const instance = getAxiosInstance();
    return instance.put(`/product/update/${id}`, data);
};

export const deleteProduct = (id: any) => {
    const instance = getAxiosInstance();
    return instance.delete(`/product/delete/${id}`);
};

export const getProduct = (id: any) => {
    const instance = getAxiosInstance();
    return instance.get(`/product/get/${id}`);
};

export const getAllProducts = () => {
    const instance = getAxiosInstance();
    return instance.post("/product/getProductListWithFilter");
};

export const getProductWithPagination = (
    params: PaginationSearchParams = {},
    filters: FilterParams = {},
) => {
    const instance = getAxiosInstance();
    return instance.post("/product/getProductListWithPaginationAndFilter", filters, { params });
};
