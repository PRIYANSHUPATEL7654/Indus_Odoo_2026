
export interface PaginationParams {
    page?: number; // 0-based
    size?: number; // 20-rows something like that
    sort?: string; // example: "createdAt,desc"
}

export interface PaginationSearchParams {
    page?: number;
    size?: number;
    sort?: string;
    searchText?: string;
}

export type FilterParams = Record<string, any>;

