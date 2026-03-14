import getAxiosInstance from "@/api/getAxiosInstance";
import {FilterParams, PaginationParams, PaginationSearchParams} from "@/helpers/commanProps";

export const inventoryTransaction = (data: any) => {
    const instance = getAxiosInstance();
    return instance.post("/inventory/transactions/processCreate", data);
}

export const inventoryTransactionApprove = (id: string, data: any) => {
    const instance = getAxiosInstance();
    return instance.post(`/inventory/transactions/processApproval/${id}`, data);
}

export const getInventoryTransaction = (id: string) => {
    const instance = getAxiosInstance();
    return instance.get(`/inventory/transactions/getInventoryTransaction/${id}`);
}

export const deleteTransaction = (id: string) => {
    const instance = getAxiosInstance();
    return instance.delete(`/inventory/transactions/deleteInventoryTransaction/${id}`);
}

export const getTransactionListWithPaginationAndFilter = (
    params: PaginationParams,
    filters: FilterParams = {}
) => {
    const instance = getAxiosInstance();
    return instance.post("/inventory/transactions/getTransactionListWithPaginationAndFilter", filters, { params });
};


export const getTransactionDetailWithPaginationAndFilter = (
    params: PaginationParams,
    filters: FilterParams = {}
) => {
    const instance = getAxiosInstance();
    return instance.post("/inventory/transactions/details/getTransactionDetailWithPaginationAndFilter", filters, { params });
};

//Batch Based Inventory APIs
export const getBatchInventoryListWithFilter = (
    filters: FilterParams = {},
    searchText?: string
) => {
    const instance = getAxiosInstance();
    return instance.post(
        "/inventory/batch-inventory/getBatchInventoryListWithFilter", filters, { params: searchText } );
};

export const getBatchNoList = (
    filters: FilterParams = {
        "availableQuantity": { "$gt": 0 }
    },
    searchText?: string
) => {
    const instance = getAxiosInstance();
    return instance.post(
        "/inventory/batch-inventory/getBatchInventoryListWithFilter", filters, { params: searchText } );
};

export const getBatchInventoryListWithPaginationAndFilter = (
    params: PaginationSearchParams,
    filters: FilterParams = {},
) => {
    const instance = getAxiosInstance();
    return instance.post("/inventory/batch-inventory/getBatchInventoryListWithPaginationAndFilter", filters, { params });
};


// Transaction Details APIs
export const createTransactionDetails = (transactionId: string, data: any) => {
    const instance = getAxiosInstance();
    return instance.post(`/inventory/transactions/details/create/${transactionId}`, data);
};

export const updateTransactionDetails = (id: string, data: any) => {
    const instance = getAxiosInstance();
    return instance.put(`/inventory/transactions/details/update/${id}`, data);
};

export const deleteTransactionDetail = (id: string) => {
    const instance = getAxiosInstance();
    return instance.delete(`/inventory/transactions/details/delete/${id}`);
};

export const getTransactionDetail = (id: string) => {
    const instance = getAxiosInstance();
    return instance.get(`/inventory/transactions/details/getTransactionDetail/${id}`);
};

export const getInventory = (id: string) => {
    const instance = getAxiosInstance();
    return instance.get(`/inventory/getInventory/${id}`);
}

export const getInventoryTableData = (
    params: PaginationParams
) => {
    const instance = getAxiosInstance();
    return instance.get("/inventory/transactions/getInventoryTransactionTableViewListWithPagination", { params });
}

export const getInventoryTransactionTableWithFilters = (
    filters: Record<string, any>,
    params: PaginationParams
) => {
    const instance = getAxiosInstance();
    return instance.post("/inventory/transactions/getTransactionTableWithPaginationAndFilters", filters, { params });
};

export const getInventoryListWithFilter = () => {
    const instance = getAxiosInstance();
    return instance.post("/inventory/getInventoryListWithFilter");
}

export const getInventoryListWithPaginationAndFilter = (
    params: PaginationSearchParams = {},
    filters: FilterParams = {}
) => {
    const instance = getAxiosInstance();
    return instance.post(
        "/inventory/getInventoryListWithPaginationAndFilter",
        filters,
        { params }
    );
};


export const updateInventoryValuation = (id: string, payload: any) => {
    const instance = getAxiosInstance();
    return instance.post(`/inventory/valuation/updateValuation/${id}`, payload);
}

export const finalizeInventoryValuation = (id: string, payload: any) => {
    const instance = getAxiosInstance();
    instance.post(`/inventory/valuation/finalizeValuation/${id}`, payload);
}



