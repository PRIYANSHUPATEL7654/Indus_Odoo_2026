import getAxiosInstance from "@/api/getAxiosInstance";

export const getRoleList = () => {
  const instance = getAxiosInstance();
  return instance.get("/roles/getAll");
};

