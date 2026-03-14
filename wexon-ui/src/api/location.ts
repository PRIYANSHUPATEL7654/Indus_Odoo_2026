import getAxiosInstance from "@/api/getAxiosInstance";
import { FilterParams, PaginationSearchParams } from "@/helpers/commanProps";

export const getAllLocations = () => {
  const instance = getAxiosInstance();
  return instance.post("/warehouse/locations/getAll");
};

export const createLocation = (data: any) => {
  const instance = getAxiosInstance();
  return instance.post("/warehouse/locations/create", data);
};

export const updateLocation = (id: string, data: any) => {
  const instance = getAxiosInstance();
  return instance.put(`/warehouse/locations/update/${id}`, data);
};

export const deleteLocation = (id: string) => {
  const instance = getAxiosInstance();
  return instance.delete(`/warehouse/locations/delete/${id}`);
};

export const getLocation = (id: string) => {
  const instance = getAxiosInstance();
  return instance.get(`/warehouse/locations/get/${id}`);
};

export const getLocationListWithPaginationAndFilter = (
  params: PaginationSearchParams = {},
  filters: FilterParams = {},
  searchText?: string,
) => {
  const instance = getAxiosInstance();
  return instance.post("/warehouse/locations/getAllWithPagination", filters, {
    params: { ...params, searchText },
  });
};
