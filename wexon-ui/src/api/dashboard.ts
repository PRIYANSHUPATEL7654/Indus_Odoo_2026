import getAxiosInstance from "@/api/getAxiosInstance";

export const getDashboardKpis = () => {
  const instance = getAxiosInstance();
  return instance.get("/dashboard/kpis");
};
