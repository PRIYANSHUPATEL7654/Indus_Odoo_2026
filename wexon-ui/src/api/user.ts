import getAxiosInstance from "@/api/getAxiosInstance";

export type UserUpsertPayload = {
  fullName: string;
  email: string;
  mobileNumber: string;
  password?: string;
  roleIds: string[];
};

export const getUserList = () => {
  const instance = getAxiosInstance();
  return instance.get("/user/getAll");
};

export const getUser = (id: string) => {
  const instance = getAxiosInstance();
  return instance.get(`/user/${id}`);
};

export const createUser = (data: UserUpsertPayload) => {
  const instance = getAxiosInstance();
  return instance.post("/user", data);
};

export const updateUser = (id: string, data: UserUpsertPayload) => {
  const instance = getAxiosInstance();
  return instance.put(`/user/${id}`, data);
};

export const deleteUser = (id: string) => {
  const instance = getAxiosInstance();
  return instance.delete(`/user/${id}`);
};

